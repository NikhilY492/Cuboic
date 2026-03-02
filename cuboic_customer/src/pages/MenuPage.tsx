import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getRestaurant, getCategories, getMenuItems, type Category, type MenuItem } from '../api/menu';
import { useCart } from '../hooks/useCart';
import { ItemCard } from '../components/ItemCard';
import { CartDrawer } from '../components/CartDrawer';
import './MenuPage.css';

// Stable session id per tab
const SESSION_ID = crypto.randomUUID();

export function MenuPage() {
    const [params] = useSearchParams();
    const restaurantId = params.get('r') ?? '';
    const tableId = params.get('t') ?? '';

    const [restaurantName, setRestaurantName] = useState('Cuboic');
    const [categories, setCategories] = useState<Category[]>([]);
    const [items, setItems] = useState<MenuItem[]>([]);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [cartOpen, setCartOpen] = useState(false);

    const cart = useCart();

    // Load restaurant + categories
    useEffect(() => {
        if (!restaurantId) return;
        Promise.all([getRestaurant(restaurantId), getCategories(restaurantId)]).then(
            ([rest, cats]) => {
                setRestaurantName(rest.name);
                const sorted = cats.sort((a, b) => a.display_order - b.display_order);
                setCategories(sorted);
                setActiveCategory(sorted[0]?._id ?? null);
            },
        );
    }, [restaurantId]);

    // Load menu items when category changes
    useEffect(() => {
        if (!restaurantId) return;

        setLoading(true);

        getMenuItems(restaurantId, activeCategory ?? undefined)
            .then(data => {
                console.log("MENU ITEMS RESPONSE:", data); // 👈 ADD THIS
                setItems(data);
            })
            .finally(() => setLoading(false));

    }, [restaurantId, activeCategory]);

    return (
        <div className="menu-page">
            {/* Header */}
            <header className="menu-header">
                <div className="container">
                    <div className="menu-header__inner">
                        <div>
                            <p className="menu-header__brand">Cuboic</p>
                            <h1 className="menu-header__name">{restaurantName}</h1>
                        </div>
                        <button
                            className="cart-fab"
                            onClick={() => setCartOpen(true)}
                            aria-label="Open cart"
                        >
                            🛒
                            {cart.count > 0 && <span className="cart-fab__badge">{cart.count}</span>}
                        </button>
                    </div>
                </div>
            </header>

            {/* Category tabs */}
            <div className="category-bar">
                <div className="category-bar__inner">
                    <button
                        className={`cat-tab ${activeCategory === null ? 'cat-tab--active' : ''}`}
                        onClick={() => setActiveCategory(null)}
                    >
                        All
                    </button>
                    {categories.map(c => (
                        <button
                            key={c._id}
                            className={`cat-tab ${activeCategory === c._id ? 'cat-tab--active' : ''}`}
                            onClick={() => setActiveCategory(c._id)}
                        >
                            {c.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Items */}
            <main className="container menu-body">
                {loading ? (
                    <div className="spinner-center"><div className="spinner" /></div>
                ) : items.length === 0 ? (
                    <p className="menu-empty">No items in this category.</p>
                ) : (
                    <div className="item-list fade-in">
                        {items.map(item => (
                            <ItemCard
                                key={item._id}
                                item={item}
                                cartItem={cart.items.find(c => c.item._id === item._id)}
                                onAdd={cart.add}
                                onRemove={cart.remove}
                            />
                        ))}
                    </div>
                )}
            </main>

            {/* Cart FAB (mobile sticky) */}
            {cart.count > 0 && !cartOpen && (
                <div className="cart-summary-bar">
                    <button className="btn btn-primary cart-summary-btn" onClick={() => setCartOpen(true)}>
                        <span className="cart-summary-btn__count">{cart.count} items</span>
                        <span>View Cart  ·  ₹{cart.total.toFixed(2)}</span>
                    </button>
                </div>
            )}

            <CartDrawer
                open={cartOpen}
                onClose={() => setCartOpen(false)}
                items={cart.items}
                total={cart.total}
                restaurantId={restaurantId}
                tableId={tableId}
                sessionId={SESSION_ID}
                onAdd={cart.add}
                onRemove={cart.remove}
                onClear={cart.clear}
            />
        </div>
    );
}
