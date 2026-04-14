import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUnpaidSummary, markPaidBulk } from '../api/orders';
import { getCustomer } from '../utils/auth';
import './CartDrawer.css'; // Reusing established bottom sheet styles

export interface ActiveOrderSession {
    id: string;
    time: number;
    total: number;
    itemCount: number;
}

interface OrdersDrawerProps {
    open: boolean;
    onClose: () => void;
    orders: ActiveOrderSession[];
    restaurantId: string;
    tableId: string;
    sessionId: string;
}

export function OrdersDrawer({
    open,
    onClose,
    orders,
    restaurantId,
    sessionId,
}: OrdersDrawerProps) {
    const [unpaid, setUnpaid] = useState<{ count: number; total: number; orderIds: string[] } | null>(null);
    const [settling, setSettling] = useState(false);

    const fetchUnpaid = () => {
        const customer = getCustomer();
        getUnpaidSummary(restaurantId, customer?.id, sessionId)
            .then(setUnpaid)
            .catch(() => {});
    };

    useEffect(() => {
        if (open && orders.length > 0) {
            fetchUnpaid();
        }
    }, [open, orders, restaurantId, sessionId]);

    const handleSettleAll = async () => {
        if (!unpaid || settling) return;
        if (!window.confirm(`Settle all outstanding dues (₹${unpaid.total.toFixed(2)})?`)) return;

        setSettling(true);
        try {
            await markPaidBulk(restaurantId, unpaid.orderIds);
            fetchUnpaid();
            alert('Payment settled successfully!');
        } catch (err) {
            console.error('Settlement failed:', err);
            alert('Failed to settle dues. Please try at the counter.');
        } finally {
            setSettling(false);
        }
    };

    if (!open) return null;

    // Sort newest orders first
    const sortedOrders = [...orders].sort((a, b) => b.time - a.time);

    return (
        <>
            <div className="drawer-overlay" onClick={onClose} />

            <div className="cart-sheet" role="dialog" aria-label="Your active orders">
                <div className="cart-sheet__handle" />

                {/* Header */}
                <div className="cart-sheet__header">
                    <h2 className="cart-sheet__title">Active Orders</h2>
                    <button className="cart-close" onClick={onClose} aria-label="Close">✕</button>
                </div>

                {/* Body */}
                <div className="cart-sheet__body">
                    {unpaid && unpaid.total > 0 && (
                        <div style={{ backgroundColor: 'var(--surface2)', margin: '0 24px 16px', padding: '16px', borderRadius: '16px', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Unpaid Balance</div>
                                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text)' }}>₹{unpaid.total.toFixed(2)}</div>
                            </div>
                            <button 
                                onClick={handleSettleAll}
                                disabled={settling}
                                style={{ 
                                    padding: '10px 16px', 
                                    backgroundColor: 'var(--accent)', 
                                    border: 'none',
                                    borderRadius: '10px', 
                                    color: 'white', 
                                    fontSize: '0.85rem', 
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    opacity: settling ? 0.7 : 1
                                }}
                            >
                                {settling ? 'Settling…' : 'Settle Now'}
                            </button>
                        </div>
                    )}

                    {sortedOrders.length === 0 ? (
                        <div className="cart-empty">
                            <div className="cart-empty__icon" style={{ marginBottom: '8px' }}>
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" />
                                    <polyline points="12 6 12 12 16 14" />
                                </svg>
                            </div>
                            <p>No active orders</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px 24px' }}>
                            {sortedOrders.map((order, index) => {
                                const localTime = new Date(order.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                return (
                                    <Link key={order.id} to={`/order/${order.id}`} className="bento-tile" style={{ textDecoration: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px' }}>
                                        <div>
                                            <div style={{ fontWeight: 800, color: 'var(--text)', fontSize: '1rem', marginBottom: '4px' }}>
                                                Order #{orders.length - index}
                                            </div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', fontWeight: 600 }}>
                                                {localTime} • {order.itemCount} items
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <span style={{ fontWeight: 800, color: 'var(--text)', fontSize: '1rem' }}>₹{order.total.toFixed(2)}</span>
                                            <span style={{ fontSize: '1.2rem', color: 'var(--accent)' }}>→</span>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
