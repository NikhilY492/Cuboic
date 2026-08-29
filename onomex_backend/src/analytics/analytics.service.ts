import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getRevenueTrends(
    restaurantId: string,
    startDate?: string,
    endDate?: string,
    timeframe: 'daily' | 'weekly' | 'monthly' = 'daily',
  ) {
    const start = startDate
      ? new Date(startDate)
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Default 30 days
    const end = endDate ? new Date(endDate) : new Date();

    const orders = await this.prisma.order.findMany({
      where: {
        restaurantId,
        status: { not: 'Cancelled' },
        createdAt: { gte: start, lte: end },
      },
      select: {
        createdAt: true,
        total: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const orderVolume = orders.length;
    const averageOrderValue = orderVolume > 0 ? totalRevenue / orderVolume : 0;

    // ── Peak Hours Analysis (Weekday vs Weekend Z-score matching peak_hours.py) ───
    const peakHoursCount = new Array(24).fill(0);
    const weekdayHours: { orders: number[]; revenues: number[] } = Array.from({ length: 24 }, () => ({ orders: [], revenues: [] })) as any;
    const weekendHours: { orders: number[]; revenues: number[] } = Array.from({ length: 24 }, () => ({ orders: [], revenues: [] })) as any;

    // Map by (date, hour)
    const dateHourCounts = new Map<string, { count: number; revenue: number; isWeekend: boolean; hour: number }>();

    orders.forEach((order) => {
      const h = order.createdAt.getHours();
      peakHoursCount[h]++;

      const dow = order.createdAt.getDay(); // 0 is Sunday, 6 is Saturday
      const isWeekend = dow === 0 || dow === 6;
      const dateStr = order.createdAt.toISOString().split('T')[0];
      const key = `${dateStr}_${h}`;

      const current = dateHourCounts.get(key) || { count: 0, revenue: 0, isWeekend, hour: h };
      current.count++;
      current.revenue += order.total;
      dateHourCounts.set(key, current);
    });

    for (const item of dateHourCounts.values()) {
      const target = item.isWeekend ? weekendHours : weekdayHours;
      (target as any)[item.hour].orders.push(item.count);
      (target as any)[item.hour].revenues.push(item.revenue);
    }

    const processCurve = (hourData: any[]) => {
      const stats = hourData.map((h, hour) => {
        const totalO = h.orders.reduce((a: number, b: number) => a + b, 0);
        const totalR = h.revenues.reduce((a: number, b: number) => a + b, 0);
        const count = h.orders.length || 1;
        return {
          hour,
          avgOrders: totalO / count,
          avgRevenue: totalR / count,
        };
      });

      const avgList = stats.map((s) => s.avgOrders);
      const mean = avgList.reduce((a, b) => a + b, 0) / 24;
      const variance = avgList.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / 24;
      const std = Math.sqrt(variance) || 1;

      return stats.map((s) => {
        const z = (s.avgOrders - mean) / std;
        let label: 'peak' | 'slow' | 'normal' = 'normal';
        if (z >= 0.75) label = 'peak';
        else if (z <= -0.75) label = 'slow';
        return {
          ...s,
          ordersZ: Number(z.toFixed(2)),
          label,
        };
      });
    };

    const weekdayCurve = processCurve(weekdayHours as any);
    const weekendCurve = processCurve(weekendHours as any);

    // ── Timeframe Grouping (Daily trends) ──────────────────────────────────
    const grouped = orders.reduce(
      (acc, order) => {
        const dateStr = order.createdAt.toISOString().split('T')[0];
        if (!acc[dateStr]) acc[dateStr] = { revenue: 0, volume: 0 };
        acc[dateStr].revenue += order.total;
        acc[dateStr].volume += 1;
        return acc;
      },
      {} as Record<string, { revenue: number; volume: number }>,
    );

    const trends: { date: string; revenue: number; volume: number }[] = [];
    for (const [date, data] of Object.entries(grouped)) {
      trends.push({ date, revenue: Number(data.revenue.toFixed(2)), volume: data.volume });
    }
    trends.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // ── 7-Day Revenue & Demand Forecast (matching revenue_forecast.py) ──────
    const forecast: { date: string; revenue: number; volume: number; isForecast: boolean }[] = [];
    if (trends.length >= 3) {
      const recent = trends.slice(-14);
      const avgRevenue = recent.reduce((sum, t) => sum + t.revenue, 0) / recent.length;
      const avgVolume = recent.reduce((sum, t) => sum + t.volume, 0) / recent.length;

      // Day of week factors
      const dowSums = new Array(7).fill(0);
      const dowCounts = new Array(7).fill(0);
      for (const t of trends) {
        const d = new Date(t.date).getDay();
        dowSums[d] += t.revenue;
        dowCounts[d]++;
      }
      const dowMultipliers = dowSums.map((sum, d) => {
        const cnt = dowCounts[d] || 1;
        const dowAvg = sum / cnt;
        return avgRevenue > 0 ? dowAvg / avgRevenue : 1;
      });

      const lastDate = new Date(trends[trends.length - 1].date);
      for (let i = 1; i <= 7; i++) {
        const nextDate = new Date(lastDate);
        nextDate.setDate(nextDate.getDate() + i);
        const dow = nextDate.getDay();
        const mult = dowMultipliers[dow] || (dow === 0 || dow === 6 ? 1.25 : 1.0);
        const predictedRev = Math.max(0, avgRevenue * mult);
        const predictedVol = Math.max(1, Math.round(avgVolume * mult));

        forecast.push({
          date: nextDate.toISOString().split('T')[0],
          revenue: Number(predictedRev.toFixed(2)),
          volume: predictedVol,
          isForecast: true,
        });
      }
    }

    return {
      totalRevenue: Number(totalRevenue.toFixed(2)),
      orderVolume,
      averageOrderValue: Number(averageOrderValue.toFixed(2)),
      trends,
      forecast,
      peakHours: peakHoursCount.map((count, hour) => ({ hour, count })),
      hourlyDemand: {
        weekday: weekdayCurve,
        weekend: weekendCurve,
        summary: {
          weekday: {
            peakHours: weekdayCurve.filter((c) => c.label === 'peak').map((c) => c.hour),
            slowHours: weekdayCurve.filter((c) => c.label === 'slow').map((c) => c.hour),
          },
          weekend: {
            peakHours: weekendCurve.filter((c) => c.label === 'peak').map((c) => c.hour),
            slowHours: weekendCurve.filter((c) => c.label === 'slow').map((c) => c.hour),
          },
        },
      },
    };
  }

  async getMenuAnalytics(
    restaurantId: string,
    startDate?: string,
    endDate?: string,
  ) {
    const start = startDate
      ? new Date(startDate)
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    const orders = await this.prisma.order.findMany({
      where: {
        restaurantId,
        status: { not: 'Cancelled' },
        createdAt: { gte: start, lte: end },
      },
      select: { items: true },
    });

    const itemStats: Record<
      string,
      { name: string; quantity: number; revenue: number; categoryId?: string }
    > = {};

    orders.forEach((order) => {
      const items = order.items as any[];
      if (Array.isArray(items)) {
        items.forEach((item) => {
          if (!itemStats[item.item_id]) {
            itemStats[item.item_id] = {
              name: item.name,
              quantity: 0,
              revenue: 0,
            };
          }
          itemStats[item.item_id].quantity += item.quantity || 1;
          itemStats[item.item_id].revenue +=
            (item.quantity || 1) * (item.unit_price || 0);
        });
      }
    });

    // Match with actual categories from MenuItems
    const catalogItems = await this.prisma.menuItem.findMany({
      where: { restaurantId },
      include: { category: true },
    });

    const categoryStats: Record<
      string,
      { name: string; revenue: number; volume: number }
    > = {};
    const popularItems: {
      id: string;
      name: string;
      quantity: number;
      revenue: number;
      categoryId?: string;
    }[] = [];

    let totalMenuVolume = 0;
    let totalMenuRevenue = 0;

    // map category info and calculate popular items array
    for (const [id, stats] of Object.entries(itemStats)) {
      const catalogItem = catalogItems.find((c) => c.id === id);
      if (catalogItem) {
        stats.categoryId = catalogItem.categoryId;
        const catName = catalogItem.category?.name || 'Unknown';
        if (!categoryStats[catalogItem.categoryId]) {
          categoryStats[catalogItem.categoryId] = {
            name: catName,
            revenue: 0,
            volume: 0,
          };
        }
        categoryStats[catalogItem.categoryId].revenue += stats.revenue;
        categoryStats[catalogItem.categoryId].volume += stats.quantity;
      }

      totalMenuVolume += stats.quantity;
      totalMenuRevenue += stats.revenue;

      popularItems.push({ id, ...stats });
    }

    const avgVolume = popularItems.length
      ? totalMenuVolume / popularItems.length
      : 0;
    const avgRevenue = popularItems.length
      ? totalMenuRevenue / popularItems.length
      : 0;

    // Stars, Plowhorses, Dogs, Puzzles
    const categorizedItems = popularItems.map((item) => {
      let type = 'Dog'; // Low volume, Low revenue
      if (item.quantity >= avgVolume && item.revenue >= avgRevenue)
        type = 'Star';
      else if (item.quantity >= avgVolume && item.revenue < avgRevenue)
        type = 'Plowhorse';
      else if (item.quantity < avgVolume && item.revenue >= avgRevenue)
        type = 'Puzzle';

      return { ...item, type };
    });

    return {
      popularItems: categorizedItems.sort((a, b) => b.quantity - a.quantity), // sort by quantity descending
      categoryPerformance: Object.entries(categoryStats)
        .map(([id, stats]) => ({ id, ...stats }))
        .sort((a, b) => b.revenue - a.revenue),
    };
  }

  async getCustomerInsights(
    restaurantId: string,
    startDate?: string,
    endDate?: string,
  ) {
    const start = startDate
      ? new Date(startDate)
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    const orders = await this.prisma.order.findMany({
      where: {
        restaurantId,
        status: { not: 'Cancelled' },
        createdAt: { gte: start, lte: end },
        customerId: { not: null }, // Only track known customers for insights
      },
      include: { customer: true },
    });

    const spenders: Record<
      string,
      {
        id: string;
        name: string;
        phone: string;
        totalSpent: number;
        orderCount: number;
      }
    > = {};

    orders.forEach((order) => {
      const cid = order.customerId;
      if (!cid) return;

      if (!spenders[cid]) {
        spenders[cid] = {
          id: cid,
          name: order.customer?.name || 'Unknown',
          phone: order.customer?.phone || '',
          totalSpent: 0,
          orderCount: 0,
        };
      }
      spenders[cid].totalSpent += order.total;
      spenders[cid].orderCount++;
    });

    const topSpenders = Object.values(spenders)
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 10);

    // New vs Returning in this period
    // Since we filtered timeframe, if orderCount == 1 maybe New? (Actually we should check if they ordered BEFORE start date).
    // Let's do a slightly heavier check for returning
    const allCustomerIds = Object.keys(spenders);
    const pastOrdersForTheseCustomers = await this.prisma.order.findMany({
      where: {
        restaurantId,
        customerId: { in: allCustomerIds },
        createdAt: { lt: start },
        status: { not: 'Cancelled' },
      },
      select: { customerId: true },
      distinct: ['customerId'],
    });

    const returningCustomerIds = new Set(
      pastOrdersForTheseCustomers.map((o) => o.customerId),
    );

    let newCustomers = 0;
    let returningCustomers = 0;

    allCustomerIds.forEach((cid) => {
      if (returningCustomerIds.has(cid)) returningCustomers++;
      else newCustomers++;
    });

    return {
      newCustomers,
      returningCustomers,
      topSpenders,
    };
  }
}
