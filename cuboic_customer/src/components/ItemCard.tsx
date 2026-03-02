import type { MenuItem } from '../api/menu';
import type { CartItem } from '../hooks/useCart';
import './ItemCard.css';

interface Props {
    item: MenuItem;
    cartItem?: CartItem;
    onAdd: (item: MenuItem) => void;
    onRemove: (id: string) => void;
}

export function ItemCard({ item, cartItem, onAdd, onRemove }: Props) {
    const qty = cartItem?.quantity ?? 0;

    return (
        <div className={`item-card card ${!item.is_available ? 'item-card--oos' : ''}`}>
            <div className="item-card__info">
                <p className="item-card__name">{item.name}</p>
                {item.description && <p className="item-card__desc">{item.description}</p>}
                <p className="item-card__price">₹{item.price.toFixed(2)}</p>
                {!item.is_available && <span className="badge badge-muted oos-badge">Out of Stock</span>}
            </div>

            <div className="item-card__action">
                {item.is_available && (
                    qty === 0 ? (
                        <button className="btn btn-primary add-btn" onClick={() => onAdd(item)}>
                            + Add
                        </button>
                    ) : (
                        <div className="qty-control">
                            <button className="qty-btn" onClick={() => onRemove(item._id)}>−</button>
                            <span className="qty-value">{qty}</span>
                            <button className="qty-btn" onClick={() => onAdd(item)}>+</button>
                        </div>
                    )
                )}
            </div>
        </div>
    );
}
