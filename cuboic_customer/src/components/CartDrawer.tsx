import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { placeOrder } from '../api/orders';
import type { CartItem } from '../hooks/useCart';
import './CartDrawer.css';

interface CartDrawerProps {
    open: boolean;
    onClose: () => void;
    items: CartItem[];
    total: number;
    restaurantId: string;
    tableId: string;
    sessionId: string;
    onAdd: (item: any) => void;
    onRemove: (itemId: string) => void;
    onClear: () => void;
}

export function CartDrawer({
    open,
    onClose,
    items,
    total,
    restaurantId,
    tableId,
    sessionId,
    onAdd,
    onRemove,
    onClear,
}: CartDrawerProps) {
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);

    if (!open) return null;

    const handlePlaceOrder = async () => {
        if (items.length === 0) return;
        setSubmitting(true);
        try {
            const order = await placeOrder({
                restaurant_id: restaurantId,
                table_id: tableId,
                customer_session_id: sessionId,
                items: items.map(c => ({ item_id: c.item._id, quantity: c.quantity })),
            });
            onClear();
            onClose();
            // Assuming /order/:id is the path for the tracker
            navigate(`/order/${order._id}`);
        } catch (error) {
            console.error('Failed to place order:', error);
            alert('Failed to place order. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const taxAmount = total * 0.05; // Assuming 5% tax from backend logic
    const grandTotal = total + taxAmount;

    return (
        <>
            {open && <div className="drawer-overlay" onClick={onClose} />}
            <div className={`cart-drawer ${open ? 'cart-drawer--open' : ''}`}>
                <div className="cart-drawer__header">
                    <h2 className="cart-drawer__title">Your Order</h2>
                    <button className="cart-close" onClick={onClose} aria-label="Close cart">
                        ✕
                    </button>
                </div>

                {items.length === 0 ? (
                    <div className="cart-empty">
                        <div className="cart-empty__icon">🛒</div>
                        <p>Your cart is empty</p>
                        <p className="cart-empty__sub">Add some tasty items!</p>
                    </div>
                ) : (
                    <>
                        <div className="cart-items">
                            {items.map(c => (
                                <div key={c.item._id} className="cart-row">
                                    <div style={{ flex: 1 }}>
                                        <h3 className="cart-row__name">{c.item.name}</h3>
                                        <p className="cart-row__price">₹{c.item.price.toFixed(2)}</p>
                                    </div>

                                    <div className="cart-row__controls" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--surface2)', borderRadius: '20px', padding: '4px' }}>
                                        <button
                                            style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'transparent', color: 'var(--text)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                            onClick={() => onRemove(c.item._id)}
                                        >
                                            −
                                        </button>
                                        <span style={{ minWidth: '16px', textAlign: 'center', fontSize: '0.9rem', fontWeight: 600 }}>
                                            {c.quantity}
                                        </span>
                                        <button
                                            style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--accent)', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                            onClick={() => onAdd(c.item)}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={{ marginTop: 'auto', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: 'var(--text-dim)', fontSize: '0.9rem' }}>
                                <span>Subtotal</span>
                                <span>₹{total.toFixed(2)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', color: 'var(--text-dim)', fontSize: '0.9rem' }}>
                                <span>Taxes (5%)</span>
                                <span>₹{taxAmount.toFixed(2)}</span>
                            </div>
                            <div className="cart-total" style={{ marginBottom: '24px' }}>
                                <span>Total</span>
                                <span>₹{grandTotal.toFixed(2)}</span>
                            </div>

                            <button
                                className="btn btn-primary cart-cta"
                                onClick={handlePlaceOrder}
                                disabled={submitting}
                            >
                                {submitting ? 'Placing Order...' : 'Place Order'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
