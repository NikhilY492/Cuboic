import { apiClient } from './apiClient'

export interface HourlyCurvePoint {
  hour: number
  avgOrders: number
  avgRevenue: number
  ordersZ: number
  label: 'peak' | 'slow' | 'normal'
}

export interface RevenueTrends {
  totalRevenue: number
  orderVolume: number
  averageOrderValue: number
  trends: { date: string; revenue: number; volume: number }[]
  forecast?: { date: string; revenue: number; volume: number; isForecast: boolean }[]
  peakHours: { hour: number; count: number }[]
  hourlyDemand?: {
    weekday: HourlyCurvePoint[]
    weekend: HourlyCurvePoint[]
    summary: {
      weekday: { peakHours: number[]; slowHours: number[] }
      weekend: { peakHours: number[]; slowHours: number[] }
    }
  }
}

export interface PopularItem {
  id: string
  name: string
  quantity: number
  revenue: number
  categoryId?: string
  type: 'Star' | 'Plowhorse' | 'Dog' | 'Puzzle'
}

export interface CategoryPerformance {
  id: string
  name: string
  revenue: number
  volume: number
}

export interface MenuAnalytics {
  popularItems: PopularItem[]
  categoryPerformance: CategoryPerformance[]
}

export interface CustomerInsights {
  newCustomers: number
  returningCustomers: number
  topSpenders: { id: string; name: string; phone: string; totalSpent: number; orderCount: number }[]
}

export interface ProjectedStockPoint {
  day: number
  date: string
  projectedStock: number
  reorderPoint: number
}

export interface InventoryItemPrediction {
  id: string
  name: string
  unit: string
  category: string
  currentStock: number
  reorderLevel: number
  leadTimeDays: number
  costPerUnit: number
  avgDailyUse: number
  demandStd: number
  safetyStock: number
  dynamicReorderPoint: number
  daysUntilStockout: number
  daysUntilReorder: number
  urgency: 'CRITICAL' | 'WARNING' | 'HEALTHY'
  projectedStockoutDate: string | null
  reorderDeadlineDate: string | null
  projectedDepletion: ProjectedStockPoint[]
}

export interface InventoryForecastSummary {
  outletId: string
  generatedAt: string
  totalItems: number
  criticalCount: number
  warningCount: number
  healthyCount: number
  items: InventoryItemPrediction[]
}

export const analyticsApi = {
  getRevenueTrends: (restaurantId: string, startDate?: string, endDate?: string, timeframe?: string) =>
    apiClient.get<RevenueTrends>(`/analytics/${restaurantId}/revenue`, { params: { startDate, endDate, timeframe } }).then(r => r.data),

  getMenuAnalytics: (restaurantId: string, startDate?: string, endDate?: string) =>
    apiClient.get<MenuAnalytics>(`/analytics/${restaurantId}/menu`, { params: { startDate, endDate } }).then(r => r.data),

  getCustomerInsights: (restaurantId: string, startDate?: string, endDate?: string) =>
    apiClient.get<CustomerInsights>(`/analytics/${restaurantId}/customers`, { params: { startDate, endDate } }).then(r => r.data),

  getInventoryForecast: (outletId: string, historyDays = 60) =>
    apiClient.get<InventoryForecastSummary>('/inventory/forecast', { params: { outletId, historyDays } }).then(r => r.data),
}

