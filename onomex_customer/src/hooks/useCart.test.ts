import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCart } from './useCart';

// jsdom provides localStorage — clear it between tests
beforeEach(() => localStorage.clear());
afterEach(() => localStorage.clear());

const makeItem = (id: string, price: number) => ({
    id,
    name: `Item ${id}`,
    description: '',
    price,
    categoryId: 'cat-1',
    is_available: true,
});

describe('useCart', () => {
    // ── initial state ────────────────────────────────────────────────────────
    it('starts with an empty cart', () => {
        const { result } = renderHook(() => useCart());
        expect(result.current.items).toHaveLength(0);
        expect(result.current.total).toBe(0);
        expect(result.current.count).toBe(0);
    });

    // ── add ──────────────────────────────────────────────────────────────────
    it('adds a new item with quantity 1', () => {
        const { result } = renderHook(() => useCart());
        act(() => result.current.add(makeItem('burger', 120)));
        expect(result.current.items).toHaveLength(1);
        expect(result.current.items[0].quantity).toBe(1);
    });

    it('increments quantity when adding the same item twice', () => {
        const { result } = renderHook(() => useCart());
        const item = makeItem('biryani', 150);
        act(() => result.current.add(item));
        act(() => result.current.add(item));
        expect(result.current.items).toHaveLength(1);
        expect(result.current.items[0].quantity).toBe(2);
    });

    it('tracks multiple distinct items independently', () => {
        const { result } = renderHook(() => useCart());
        act(() => result.current.add(makeItem('item-a', 100)));
        act(() => result.current.add(makeItem('item-b', 200)));
        expect(result.current.items).toHaveLength(2);
    });

    // ── remove ───────────────────────────────────────────────────────────────
    it('decrements quantity when item quantity > 1', () => {
        const { result } = renderHook(() => useCart());
        const item = makeItem('dosa', 60);
        act(() => result.current.add(item));
        act(() => result.current.add(item));
        act(() => result.current.remove('dosa'));
        expect(result.current.items[0].quantity).toBe(1);
    });

    it('removes item completely when quantity drops to 0', () => {
        const { result } = renderHook(() => useCart());
        const item = makeItem('chai', 30);
        act(() => result.current.add(item));
        act(() => result.current.remove('chai'));
        expect(result.current.items).toHaveLength(0);
    });

    it('does nothing when removing an item not in the cart', () => {
        const { result } = renderHook(() => useCart());
        act(() => result.current.add(makeItem('pizza', 250)));
        act(() => result.current.remove('nonexistent-id'));
        expect(result.current.items).toHaveLength(1);
    });

    // ── clear ────────────────────────────────────────────────────────────────
    it('clears all items', () => {
        const { result } = renderHook(() => useCart());
        act(() => result.current.add(makeItem('a', 100)));
        act(() => result.current.add(makeItem('b', 200)));
        act(() => result.current.clear());
        expect(result.current.items).toHaveLength(0);
        expect(result.current.total).toBe(0);
    });

    // ── total & count ────────────────────────────────────────────────────────
    it('calculates total correctly across multiple items', () => {
        const { result } = renderHook(() => useCart());
        act(() => result.current.add(makeItem('x', 100)));
        act(() => result.current.add(makeItem('x', 100)));  // qty 2 → 200
        act(() => result.current.add(makeItem('y', 50)));   // qty 1 → 50
        expect(result.current.total).toBe(250);
    });

    it('calculates count correctly', () => {
        const { result } = renderHook(() => useCart());
        act(() => result.current.add(makeItem('a', 10)));
        act(() => result.current.add(makeItem('a', 10))); // 2x
        act(() => result.current.add(makeItem('b', 20))); // 1x
        expect(result.current.count).toBe(3);
    });

    // ── localStorage persistence ─────────────────────────────────────────────
    it('persists cart to localStorage on change', () => {
        const { result } = renderHook(() => useCart());
        act(() => result.current.add(makeItem('saved', 99)));
        const stored = JSON.parse(localStorage.getItem('onomex_cart') || '[]');
        expect(stored).toHaveLength(1);
        expect(stored[0].item.id).toBe('saved');
    });

    it('restores cart from localStorage on mount', () => {
        const savedCart = [{ item: makeItem('restored', 75), quantity: 3 }];
        localStorage.setItem('onomex_cart', JSON.stringify(savedCart));

        const { result } = renderHook(() => useCart());
        expect(result.current.items).toHaveLength(1);
        expect(result.current.items[0].quantity).toBe(3);
        expect(result.current.total).toBe(225); // 75 * 3
    });
});
