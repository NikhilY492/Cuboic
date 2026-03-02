import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrder, type Order } from '../api/orders';
import { useSocket } from '../hooks/useSocket';
import { StatusTimeline } from '../components/StatusTimeline';
import './OrderTrackerPage.css';

export function OrderTrackerPage() {
    const { orderId } = useParams<{ orderId: string }>();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Initial fetch
    useEffect(() => {
        if (!orderId) return;
        getOrder(orderId)
            .then(setOrder)
            .catch(() => setError('Order not found.'))
            .finally(() => setLoading(false));
    }, [orderId]);

    // Real-time updates via Socket.io
    const socketRef = useSocket(order?.restaurant_id?.toString() ?? null);
    useEffect(() => {
        const socket = socketRef.current;
        if (!socket || !orderId) return;

        const handler = (data: { _id: string; order_status: Order['order_status'] }) => {
            if (data._id === orderId || data._id?.toString() === orderId) {
                setOrder(prev => prev ? { ...prev, order_status: data.order_status } : prev);
            }
        };
        socket.on('order.updated', handler);
        return () => { socket.off('order.updated', handler); };
    }, [socketRef, orderId, order?.restaurant_id]);

    if (loading) return <div className="tracker-page"><div className="spinner-center"><div className="spinner" /></div></div>;
    if (error || !order) return (
        <div className="tracker-page tracker-error">
            <p>😕 {error || 'Something went wrong'}</p>
            <Link to="/" className="btn btn-ghost">Go back</Link>
        </div>
    );

    const tableNumber = typeof order.table_id === 'object'
        ? (order.table_id as any).table_number
        : '—';

    return (
        <div className="tracker-page fade-in">
            <header className="tracker-header">
                <div className="container">
                    <Link to="/" className="tracker-back">← Menu</Link>
                    <p className="tracker-brand">Cuboic</p>
                </div>
            </header>

            <main className="container tracker-body">
                {/* Status hero */}
                <div className="tracker-hero card">
                    <div className="tracker-hero__status-label">
                        {order.order_status === 'Delivered' ? '🎉 Enjoy your meal!' : '⏳ Tracking your order…'}
                    </div>
                    <h1 className="tracker-hero__status">{getStatusMessage(order.order_status)}</h1>
                    <p className="tracker-table">Table {tableNumber}</p>
                </div>

                {/* Timeline */}
                <section className="tracker-section card">
                    <h2 className="tracker-section__title">Order Progress</h2>
                    <StatusTimeline status={order.order_status} />
                </section>

                {/* Order summary */}
                <section className="tracker-section card">
                    <h2 className="tracker-section__title">Order Summary</h2>
                    <div className="order-items">
                        {order.items.map((item, i) => (
                            <div key={i} className="order-item">
                                <span className="order-item__name">{item.quantity}× {item.name}</span>
                                <span className="order-item__price">₹{(item.unit_price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                    <hr className="divider" />
                    <div className="order-totals">
                        <div className="order-total-row"><span>Subtotal</span><span>₹{order.subtotal.toFixed(2)}</span></div>
                        <div className="order-total-row"><span>Tax</span><span>₹{order.tax_amount.toFixed(2)}</span></div>
                        <div className="order-total-row order-total-row--grand">
                            <span>Total</span><span>₹{order.total_price.toFixed(2)}</span>
                        </div>
                    </div>
                </section>

                <p className="tracker-note">Order ID: <code>{order._id}</code></p>
            </main>
        </div>
    );
}

function getStatusMessage(status: Order['order_status']): string {
    const map: Record<Order['order_status'], string> = {
        Received: 'Order Received',
        Preparing: 'Being Prepared',
        Ready: 'Ready to Serve',
        Assigned: 'Robot on the Way',
        Delivered: 'Delivered!',
    };
    return map[status] ?? status;
}
