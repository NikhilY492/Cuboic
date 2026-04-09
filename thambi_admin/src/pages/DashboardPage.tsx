import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { paymentsApi } from '../api/payments'
import { deliveriesApi } from '../api/deliveries'
import { robotsApi } from '../api/robots'
import { ordersApi } from '../api/orders'
import { restaurantsApi, Restaurant } from '../api/restaurants'
import { useSocket } from '../hooks/useSocket'
import { showToast } from '../components/Toast'

interface Summary { order_count: number; total_revenue: number }

export default function DashboardPage() {
    const { user } = useAuth()
    const [summary, setSummary] = useState<Summary>({ order_count: 0, total_revenue: 0 })
    const [orderSummary, setOrderSummary] = useState({ pending: 0, preparing: 0, completed: 0 })
    const [activeDeliveries, setActiveDeliveries] = useState(0)
    const [robotsOnline, setRobotsOnline] = useState(0)
    const [restaurantData, setRestaurantData] = useState<Restaurant | null>(null)
    const [pulse, setPulse] = useState(false)

    const restaurantId = user?.restaurantId ?? ''

    const load = async () => {
        if (!user || !restaurantId) return;

        // Load non-critical summary safely
        if (user.role === 'Owner') {
            try {
                const summaryRes = await paymentsApi.getSummary(restaurantId);
                if (summaryRes?.data) setSummary(summaryRes.data);
            } catch (err) {
                console.error('Failed to load summary data:', err);
            }
        }

        // Load core operational data
        try {
            const [deliveriesRes, robotsRes, orderSummaryRes] = await Promise.all([
                deliveriesApi.findActive(restaurantId),
                robotsApi.findAll(restaurantId),
                ordersApi.getSummary(restaurantId),
            ]);
            setActiveDeliveries(deliveriesRes.data.length);
            setRobotsOnline((robotsRes.data as Array<{ isOnline: boolean }>).filter((r) => r.isOnline).length);
            
            if (orderSummaryRes?.data) {
                setOrderSummary(orderSummaryRes.data);
            }

            const restRes = await restaurantsApi.findById(restaurantId);
            setRestaurantData(restRes.data);
        } catch (err) {
            console.error('Failed to load operational data:', err);
        }
    }

    useEffect(() => { load() }, [restaurantId])

    useSocket(restaurantId, {
        'order:new': (data) => {
            setPulse(true)
            setTimeout(() => setPulse(false), 2000)
            showToast('New Order', 'A new order has arrived!', 'info')
            load()
        },
        'order:updated': () => load(),
        'delivery:started': () => { showToast('Delivery Started', 'Robot is on its way!', 'success'); load() },
        'delivery:updated': () => load(),
    })

    const kpis = [
        ...(user?.role === 'Owner'
            ? [
                  {
                      label: "Today's Orders",
                      value: summary.order_count,
                      sub: 'paid today',
                      icon: '#',
                      accent: 'kpi-blue',
                  },
                  {
                      label: "Today's Revenue",
                      value: `₹${summary.total_revenue.toFixed(2)}`,
                      sub: 'before fees',
                      icon: '₹',
                      accent: 'kpi-green',
                  },
              ]
            : []),
        {
            label: 'Pending Orders',
            value: orderSummary.pending,
            sub: 'action needed',
            icon: '⏱',
            accent: 'kpi-amber',
        },
        {
            label: 'Preparing Orders',
            value: orderSummary.preparing,
            sub: 'in kitchen',
            icon: '🔥',
            accent: 'kpi-blue',
        },
        {
            label: 'Completed Today',
            value: orderSummary.completed,
            sub: 'delivered',
            icon: '✓',
            accent: 'kpi-green',
        },
        {
            label: 'Active Deliveries',
            value: activeDeliveries,
            sub: 'in transit',
            icon: '○',
            accent: 'kpi-amber',
        },
        {
            label: 'Robots Online',
            value: robotsOnline,
            sub: 'connected',
            icon: '●',
            accent: 'kpi-purple',
        },
    ]

    const handleToggleStrategy = async () => {
        if (!restaurantData) return;
        const newStrategy = restaurantData.paymentStrategy === 'PayPerOrder' ? 'PayAtEnd' : 'PayPerOrder';
        try {
            await restaurantsApi.update(restaurantId, { paymentStrategy: newStrategy });
            setRestaurantData({ ...restaurantData, paymentStrategy: newStrategy });
            showToast('Success', `Payment mode updated to ${newStrategy === 'PayPerOrder' ? 'Pay per order' : 'Pay at end'}`, 'success');
        } catch (err) {
            showToast('Error', 'Failed to update payment mode', 'warning');
        }
    }

    return (
        <div className="page">
            <div className="page-header">
                <h2>Dashboard</h2>
                <p className="page-sub">Welcome back, {user?.name}</p>
            </div>

            <div className={`kpi-grid ${pulse ? 'kpi-pulse' : ''}`}>
                {kpis.map((k) => (
                    <div key={k.label} className={`kpi-card ${k.accent}`}>
                        <div className="kpi-icon">{k.icon}</div>
                        <div className="kpi-body">
                            <div className="kpi-value">{k.value}</div>
                            <div className="kpi-label">{k.label}</div>
                            <div className="kpi-sub">{k.sub}</div>
                        </div>
                    </div>
                ))}
            </div>

            {user?.role === 'Owner' && restaurantData && (
                <div className="glass-panel tech-border" style={{ padding: '24px', marginTop: '32px' }}>
                    <h3 style={{ marginBottom: '16px', fontSize: '1rem', color: 'var(--accent-primary)' }}>System Configuration</h3>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <div style={{ fontWeight: 600, marginBottom: '4px' }}>Payment Workflow</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                {restaurantData.paymentStrategy === 'PayPerOrder' 
                                    ? 'Customers must pay for each order immediately.' 
                                    : 'Customers can aggregate multiple orders and pay at the end.'}
                            </div>
                        </div>
                        <button 
                            className="tech-btn" 
                            onClick={handleToggleStrategy}
                            style={{ 
                                borderColor: restaurantData.paymentStrategy === 'PayAtEnd' ? 'var(--accent-primary)' : 'var(--border-color)',
                                color: restaurantData.paymentStrategy === 'PayAtEnd' ? 'var(--accent-primary)' : 'var(--text-secondary)'
                            }}
                        >
                            {restaurantData.paymentStrategy === 'PayPerOrder' ? 'Switch to "Pay at End"' : 'Switch to "Pay per Order"'}
                        </button>
                    </div>
                </div>
            )}

            <div className="dashboard-hint">
                Real-time updates are active — new orders and delivery changes appear automatically.
            </div>
        </div>
    )
}
