import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { placeOrder, getUnpaidSummary, markPaidBulk } from '../api/orders';
import type { CartItem } from '../hooks/useCart';
import './CheckoutPage.css';



interface LocationState {
    items: CartItem[];
    total: number;
    restaurantId: string;
    tableId: string;
    tableLabel?: string;
    sessionId: string;
    customerId?: string;
    paymentStrategy?: 'PayPerOrder' | 'PayAtEnd';
}

// Stable per-session UUID
const SESSION_ID = crypto.randomUUID();

export function CheckoutPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state as LocationState | null;

    const [notes, setNotes] = useState('');
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');
    const [paymentMode, setPaymentMode] = useState<'Now' | 'Later'>(
        state?.paymentStrategy === 'PayPerOrder' ? 'Now' : 'Later'
    );
    const [unpaidSummary, setUnpaidSummary] = useState<{ total: number; orderIds: string[] } | null>(null);

    const fetchUnpaidSummary = useCallback(() => {
        if (!state?.restaurantId || !state?.sessionId) return;
        getUnpaidSummary(state.restaurantId, state.customerId || undefined, state.sessionId)
            .then(data => {
                if (data.total > 0) {
                    setUnpaidSummary(data);
                } else {
                    setUnpaidSummary(null);
                }
            })
            .catch(err => console.error('Failed to fetch unpaid summary:', err));
    }, [state?.restaurantId, state?.customerId, state?.sessionId]);

    useEffect(() => {
        fetchUnpaidSummary();
    }, [fetchUnpaidSummary]);

    // Guard — if no cart state, redirect back to menu
    if (!state || !state.items?.length) {
        return (
            <div className="checkout-page">
                <div className="checkout-empty">
                    <p>Your cart is empty.</p>
                    <Link to="/" className="btn btn-primary">← Back to Menu</Link>
                </div>
            </div>
        );
    }

    const { items, total, restaurantId, tableId, tableLabel, sessionId, customerId, paymentStrategy } = state;
    const previousBalance = unpaidSummary?.total ?? 0;
    const grandTotal = total + (paymentMode === 'Now' ? previousBalance : 0);

    const handlePay = async () => {
        setError('');
        setProcessing(true);

        try {

            // Payment "succeeded" — now create the order
            const order = await placeOrder({
                restaurantId: restaurantId,
                tableId: tableId,
                customerId: customerId,
                customerSessionId: sessionId ?? SESSION_ID,
                notes: notes.trim() || undefined,
                items: items.map(c => ({ itemId: c.item.id, quantity: c.quantity })),
                paymentStatus: paymentMode === 'Now' ? 'Paid' : 'Pending',
            });

            // If paying now, also settle all previous unpaid orders
            if (paymentMode === 'Now' && unpaidSummary && unpaidSummary.orderIds.length > 0) {
                try {
                    await markPaidBulk(restaurantId, unpaidSummary.orderIds);
                } catch (bulkErr) {
                    console.error('Failed to settle previous orders:', bulkErr);
                    // We don't block the current order success, but we log it
                }
            }

            localStorage.removeItem('thambi_cart');

            // Save order history array
            try {
                const stored = localStorage.getItem('thambi_active_orders');
                const prevOrders = stored ? JSON.parse(stored) : [];
                const newOrderSession = {
                    id: order.id,
                    time: Date.now(),
                    total: grandTotal,
                    itemCount: items.reduce((sum, c) => sum + c.quantity, 0)
                };
                localStorage.setItem('thambi_active_orders', JSON.stringify([...prevOrders, newOrderSession]));
            } catch (err) {
                console.error('Failed to log active order', err);
            }

            navigate(`/order/${order.id}`, { replace: true });
        } catch (err: unknown) {
            const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
            setError(msg ?? 'Failed to place order. Please try again.');
            setProcessing(false);
        }
    };

    return (
        <div className="checkout-page fade-in">
            <header className="checkout-header">
                <div className="container">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Link to={`/?r=${restaurantId}&t=${tableId}`} className="checkout-back">← Menu</Link>
                        {tableLabel && <div className="table-tag" style={{ margin: 0, padding: '4px 8px', fontSize: '0.75rem', borderRadius: '4px', background: 'var(--surface2)', color: 'var(--text-muted)', fontWeight: 600 }}>{tableLabel}</div>}
                    </div>
                    <p className="checkout-brand">Thambi</p>
                </div>
            </header>

            <main className="container checkout-bento">
                {/* ── Order Summary Tile (Large) ── */}
                <section className="bento-tile bento-tile--main fade-up">
                    <h2 className="bento-title">Your Order</h2>

                    <div className="bento-items-grid">
                        {items.map(c => (
                            <div key={c.item.id} className="bento-item">
                                <img src={c.item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'} alt={c.item.name} className="bento-item-img" />
                                <div className="bento-item-info">
                                    <div className="bento-item-name">
                                        {c.item.name} <span className="bento-item-qty-inline">x{c.quantity}</span>
                                    </div>
                                </div>
                                <div className="bento-item-price">₹{((Number(c.item.price) || 0) * (Number(c.quantity) || 1)).toFixed(2)}</div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── Totals Tile ── */}
                <section className="bento-tile bento-totals fade-up" style={{ animationDelay: '0.1s' }}>
                    <div className="co-total-row"><span>Items Subtotal</span><span>₹{total.toFixed(2)}</span></div>
                    
                    {previousBalance > 0 && paymentMode === 'Now' && (
                        <div className="co-total-row" style={{ color: 'var(--primary)', fontWeight: 600 }}>
                            <span>Previous Balance</span><span>₹{previousBalance.toFixed(2)}</span>
                        </div>
                    )}

                    <hr className="divider" style={{ margin: '12px 0' }} />
                    <div className="co-total-row co-total-grand">
                        <span>Total to Pay</span>
                        <span>₹{grandTotal.toFixed(2)}</span>
                    </div>
                    {previousBalance > 0 && paymentMode === 'Later' && (
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                            * Previous balance of ₹{previousBalance.toFixed(2)} will remain unpaid.
                        </p>
                    )}
                </section>

                {/* ── Special Instructions Tile ── */}
                <section className="bento-tile bento-notes fade-up" style={{ animationDelay: '0.15s' }}>
                    <h2 className="bento-title">Special Instructions (Optional)</h2>
                    <textarea 
                        className="checkout-notes-input"
                        placeholder="e.g. Make it spicy, no onions, etc."
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                        maxLength={250}
                        rows={3}
                    />
                </section>

                {/* ── Payment Information Tile ── */}
                <section className="bento-tile bento-payment fade-up" style={{ animationDelay: '0.2s' }}>
                    <h2 className="bento-title">Payment Mode</h2>
                    
                    {paymentStrategy === 'PayAtEnd' ? (
                        <>
                            <div className="payment-toggle-grid">
                                <button 
                                    className={`payment-toggle-btn ${paymentMode === 'Later' ? 'active' : ''}`}
                                    onClick={() => setPaymentMode('Later')}
                                >
                                    <span className="toggle-icon">💵</span>
                                    <div className="toggle-text">
                                        <div className="toggle-label">Pay Later</div>
                                        <div className="toggle-sub">at the counter</div>
                                    </div>
                                </button>
                                <button 
                                    className={`payment-toggle-btn ${paymentMode === 'Now' ? 'active' : ''}`}
                                    onClick={() => setPaymentMode('Now')}
                                >
                                    <span className="toggle-icon">💳</span>
                                    <div className="toggle-text">
                                        <div className="toggle-label">Pay Now</div>
                                        <div className="toggle-sub">UPI / Card</div>
                                    </div>
                                </button>
                            </div>

                            <p className="co-method-hint fade-in" style={{ marginTop: '16px' }}>
                                {paymentMode === 'Later' 
                                    ? "Place order first, pay when you're done." 
                                    : "Pay now to get your order faster."}
                            </p>
                        </>
                    ) : (
                        <div className="payment-toggle-grid single-option">
                            <button className="payment-toggle-btn active" style={{ cursor: 'default' }}>
                                <span className="toggle-icon">💳</span>
                                <div className="toggle-text">
                                    <div className="toggle-label">Pay Now</div>
                                    <div className="toggle-sub">Required with order</div>
                                </div>
                            </button>
                        </div>
                    )}
                </section>

                {/* ── Checkout Action Tile ── */}
                <section className="bento-action fade-up" style={{ animationDelay: '0.3s' }}>
                    {error && <div className="co-error">{error}</div>}

                    <button
                        className="btn btn-primary co-pay-btn bento-pay-btn"
                        onClick={handlePay}
                        disabled={processing}
                    >
                        {processing ? (
                            <span className="co-processing">
                                <span className="co-spinner" />
                                Processing…
                            </span>
                        ) : (
                            `Place Order • ₹${grandTotal.toFixed(2)}`
                        )}
                    </button>
                    <p className="co-secure-note">Secured & encrypted</p>
                </section>
            </main>
        </div>
    );
}
