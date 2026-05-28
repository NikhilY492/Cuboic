import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrder, cancelOrder, getUnpaidSummary, markPaidBulk, type Order } from '../api/orders';
import { getRestaurant } from '../api/menu';
import { useSocket } from '../hooks/useSocket';
import { StatusTimeline } from '../components/StatusTimeline';
import { ConfirmCancelModal } from '../components/ConfirmCancelModal';
import { getCustomer } from '../utils/auth';
import { getSessionId } from '../utils/session';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import './OrderTrackerPage.css';

const TERMINAL = new Set<Order['status']>(['Delivered', 'Cancelled']);

export function OrderTrackerPage() {
    const { orderId } = useParams<{ orderId: string }>();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const [tableLabel, setTableLabel] = useState<string>('—');
    const [cancelModalOpen, setCancelModalOpen] = useState(false);
    const [cancelling, setCancelling] = useState(false);
    const [customerName, setCustomerName] = useState('');
    const [unpaidSummary, setUnpaidSummary] = useState<{ total: number; count: number; orderIds: string[] } | null>(null);
    const [settling, setSettling] = useState(false);

    useEffect(() => {
        const c = getCustomer();
        if (c?.name) setCustomerName(c.name.split(' ')[0]);
    }, []);

    const fetchOrder = useCallback(() => {
        if (!orderId) return;
        return getOrder(orderId)
            .then(data => {
                setOrder(data);
                setLastUpdated(new Date());

                // Robust table number resolution (FR-5 / Bugfix)
                let tNum: string | number | undefined = data.table?.table_number;
                if (!tNum && typeof data.tableId === 'object' && 'table_number' in data.tableId) {
                    tNum = data.tableId.table_number;
                }

                if (tNum) {
                    setTableLabel(String(tNum));
                } else if (data.restaurantId) {
                    const tid = typeof data.tableId === 'string' ? data.tableId : data.tableId.id;
                    getRestaurant(data.restaurantId)
                        .then(r => {
                            const t = r.tables?.find(tb => tb.id === tid);
                            setTableLabel(t ? String(t.table_number) : tid.slice(-4).toUpperCase());
                        })
                        .catch(() => setTableLabel(tid.slice(-4).toUpperCase()));
                } else {
                    const tid = typeof data.tableId === 'string' ? data.tableId : data.tableId.id;
                    setTableLabel(tid.slice(-4).toUpperCase());
                }
            })
            .catch(() => setError('Order not found.'))
            .finally(() => setLoading(false));
    }, [orderId]);

    const fetchUnpaidSummary = useCallback(() => {
        if (!order || !order.restaurantId) return;
        const sid = getSessionId();
        getUnpaidSummary(order.restaurantId, order.customerId || undefined, sid)
            .then(data => {
                if (data.total > 0) {
                    setUnpaidSummary(data);
                } else {
                    setUnpaidSummary(null);
                }
            })
            .catch(err => console.error('Failed to fetch unpaid summary:', err));
    }, [order]);

    // Initial fetch
    useEffect(() => { fetchOrder(); }, [fetchOrder]);

    // 10-second polling — stops when order reaches terminal state
    useEffect(() => {
        if (!orderId) return;
        if (order && TERMINAL.has(order.status)) return; // no more polling needed

        const interval = setInterval(() => {
            fetchOrder();
            fetchUnpaidSummary();
        }, 10_000);

        return () => clearInterval(interval);
    }, [orderId, order?.status, order?.restaurantId, fetchOrder, fetchUnpaidSummary]);

    useEffect(() => {
        if (order) fetchUnpaidSummary();
    }, [order, fetchUnpaidSummary]);

    // Real-time updates via WebSocket — still active for instant pushes
    const socketRef = useSocket(order?.restaurantId?.toString() ?? null);
    useEffect(() => {
        const socket = socketRef.current;
        if (!socket || !orderId || !order?.restaurantId) return;

        const eventName = `order:updated:${order.restaurantId}`;
        const handler = (data: Order) => {
            if (data.id === orderId || data.id?.toString() === orderId) {
                setOrder(prev => prev ? { ...prev, ...data } : prev);
                setLastUpdated(new Date());
            }
        };
        socket.on(eventName, handler);
        return () => { socket.off(eventName, handler); };
    }, [socketRef, orderId, order?.restaurantId]);

    const handleSettleAll = async () => {
        if (!unpaidSummary || !order?.restaurantId || settling) return;
        if (!window.confirm(`Settle all ${unpaidSummary.count} outstanding orders (₹${unpaidSummary.total.toFixed(2)})?`)) return;

        setSettling(true);
        try {
            await markPaidBulk(order.restaurantId, unpaidSummary.orderIds);
            fetchUnpaidSummary(); // Refresh status
            alert('Payment settled successfully!');
        } catch (err) {
            console.error('Settlement failed:', err);
            alert('Failed to settle payment. Please try at the counter.');
        } finally {
            setSettling(false);
        }
    };

    if (loading) return <div className="tracker-page"><div className="spinner-center"><div className="spinner" /></div></div>;
    if (error || !order) return (
        <div className="tracker-page tracker-error">
            <p>{error || 'Something went wrong'}</p>
            <Link to="/" className="btn btn-ghost">Go back</Link>
        </div>
    );

    // `tableLabel` manages the resolved state

    const isCancelled = order.status === 'Cancelled';
    const canCancel = order.status === 'Pending';

    const handleCancel = async () => {
        if (!orderId) return;
        setCancelling(true);
        try {
            const updated = await cancelOrder(orderId);
            setOrder(updated);
            setCancelModalOpen(false);
        } catch (err) {
            console.error('Failed to cancel order:', err);
            // Optionally, we could show an error toast here. For now, just close.
            setCancelModalOpen(false);
        } finally {
            setCancelling(false);
        }
    };

    const handleDownloadBill = () => {
        if (!order) return;
        
        const doc = new jsPDF();
        
        // Header
        doc.setFontSize(22);
        doc.text("THAMBI", 105, 20, { align: "center" });
        doc.setFontSize(10);
        doc.text(`Order ID: ${order.id}`, 105, 30, { align: "center" });
        doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`, 105, 36, { align: "center" });
        
        // Table
        const tableData = order.items.map(item => [
            item.name,
            item.quantity.toString(),
            `Rs. ${(item.unit_price ?? item.unitPrice ?? 0).toFixed(2)}`,
            `Rs. ${((item.unit_price ?? item.unitPrice ?? 0) * item.quantity).toFixed(2)}`
        ]);
        
        autoTable(doc, {
            startY: 45,
            head: [['Item', 'Qty', 'Price', 'Total']],
            body: tableData,
            theme: 'striped',
            headStyles: { fillColor: [33, 33, 33] }
        });
        
        // Footer Totals
        const finalY = (doc as any).lastAutoTable.finalY + 10;
        doc.setFontSize(12);
        doc.text(`Subtotal: Rs. ${order.subtotal.toFixed(2)}`, 140, finalY);
        doc.text(`Tax: Rs. ${order.tax.toFixed(2)}`, 140, finalY + 8);
        doc.setFont("helvetica", "bold");
        doc.text(`Grand Total: Rs. ${order.total.toFixed(2)}`, 140, finalY + 16);
        
        doc.save(`Thambi_Bill_${order.id.slice(-8).toUpperCase()}.pdf`);
    };

    return (
        <div className={`tracker-page fade-in ${isCancelled ? 'tracker-cancelled' : ''}`}>
            <header className="tracker-header">
                <div className="container">
                    <Link to={`/?r=${order.restaurantId}&t=${typeof order.tableId === 'string' ? order.tableId : order.tableId.id}`} className="tracker-back">← Menu</Link>
                    <p className="tracker-brand">Thambi</p>
                    {lastUpdated && !isCancelled && (
                        <span className="tracker-updated">
                            Updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </span>
                    )}
                </div>
            </header>

            <main className="container tracker-body">
                {/* Status hero */}
                <div className="tracker-hero card" style={{ opacity: isCancelled ? 0.7 : 1, filter: isCancelled ? 'grayscale(1)' : 'none' }}>
                    <div className="tracker-hero__status-label" style={{ color: isCancelled ? 'var(--danger, #dc3545)' : undefined }}>
                        {isCancelled
                            ? 'Order Cancelled'
                            : order.status === 'Delivered'
                                ? `Hope you enjoyed it, ${customerName}!`
                                : 'Tracking your order…'}
                    </div>
                    <h1 className="tracker-hero__status">
                        {customerName && !isCancelled && order.status !== 'Delivered' ? (
                            <>
                                {customerName},
                                <br />
                                {getStatusMessage(order.status)}
                            </>
                        ) : isCancelled ? (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                <span style={{
                                    backgroundColor: 'var(--danger, #dc3545)',
                                    color: 'white',
                                    padding: '4px 12px',
                                    borderRadius: '16px',
                                    fontSize: '0.85rem',
                                    fontWeight: 'bold',
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px'
                                }}>
                                    CANCELLED
                                </span>
                            </div>
                        ) : (
                            getStatusMessage(order.status)
                        )}
                    </h1>
                    
                    {isCancelled ? (
                        <p className="tracker-table" style={{ color: 'var(--danger, #dc3545)', fontWeight: 600, fontSize: '0.9rem', marginTop: '12px' }}>
                            This order was cancelled by staff.
                        </p>
                    ) : (
                        <p className="tracker-table">Table {tableLabel}</p>
                    )}
                </div>

                {/* Timeline — hidden for Cancelled */}
                {!isCancelled && (
                    <section className="tracker-section card">
                        <h2 className="tracker-section__title">Order Progress</h2>
                        <StatusTimeline status={order.status} />
                    </section>
                )}

                {/* Order summary */}
                <section className="tracker-section card" style={{ opacity: isCancelled ? 0.6 : 1, filter: isCancelled ? 'grayscale(1)' : 'none' }}>
                    <h2 className="tracker-section__title">Order Summary</h2>
                    <div className="order-items">
                        {order.items.map((item, i) => (
                            <div key={i} className="order-item">
                                <span className="order-item__name" style={{ textDecoration: isCancelled ? 'line-through' : 'none' }}>{item.quantity}× {item.name}</span>
                                <span className="order-item__price">₹{((item.unit_price ?? item.unitPrice ?? 0) * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                    <hr className="divider" />
                    <div className="order-totals">
                        <div className="order-total-row order-total-row--grand">
                            <span>Total</span><span style={{ textDecoration: isCancelled ? 'line-through' : 'none' }}>₹{order.total.toFixed(2)}</span>
                        </div>
                    </div>
                </section>
                
                {!isCancelled && unpaidSummary && unpaidSummary.total > 0 && (
                    <section className="tracker-section card unpaid-highlight" style={{ borderColor: 'var(--primary)', borderWidth: '2px', background: 'var(--surface2)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h2 className="tracker-section__title" style={{ margin: 0, color: 'var(--primary)' }}>Outstanding Balance</h2>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                                    Total for {unpaidSummary.count} unpaid order(s) this session
                                </p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>₹{unpaidSummary.total.toFixed(2)}</span>
                            </div>
                        </div>
                        <div style={{ marginTop: '12px', padding: '10px', borderRadius: '8px', background: 'rgba(var(--primary-rgb), 0.1)', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            Please settle this amount at the counter before leaving. Thank you!
                        </div>
                        <button 
                            className="btn btn-primary" 
                            style={{ marginTop: '16px', width: '100%', fontWeight: 700 }}
                            onClick={handleSettleAll}
                            disabled={settling}
                        >
                            {settling ? 'Settling…' : `Settle All Dues (₹${unpaidSummary.total.toFixed(2)})`}
                        </button>
                    </section>
                )}

                <p className="tracker-note">Order ID: <code>{order.id}</code></p>

                <div style={{ marginTop: '24px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <button
                        className="btn btn-outline"
                        style={{ width: '100%' }}
                        onClick={handleDownloadBill}
                    >
                        Download Bill (PDF)
                    </button>
                    {canCancel && (
                        <button
                            className="btn btn-outline"
                            style={{ borderColor: 'var(--danger, #dc3545)', color: 'var(--danger, #dc3545)', width: '100%' }}
                            onClick={() => setCancelModalOpen(true)}
                        >
                            Cancel Order
                        </button>
                    )}
                </div>
            </main>

            <ConfirmCancelModal
                open={cancelModalOpen}
                onClose={() => setCancelModalOpen(false)}
                onConfirm={handleCancel}
                loading={cancelling}
            />
        </div>
    );
}

function getStatusMessage(status: Order['status']): string {
    const map: Record<Order['status'], string> = {
        Pending: 'Order Received',
        Confirmed: 'Being Prepared',
        Preparing: 'Being Prepared',
        Ready: 'Ready to Serve',
        Assigned: 'Robot on the Way',
        Delivered: 'Delivered!',
        Cancelled: 'Order Cancelled',
    };
    return map[status] ?? status;
}

