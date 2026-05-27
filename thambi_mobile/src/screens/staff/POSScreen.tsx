import React, { useState, useEffect, useCallback } from 'react';
import {
    View, Text, FlatList, TouchableOpacity, StyleSheet,
    ActivityIndicator, Alert, ScrollView, Image, KeyboardAvoidingView, Platform
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { menuApi, type MenuItem, type Category } from '../../api/menu';
import { tablesApi, type RestaurantTable } from '../../api/tables';
import { ordersApi } from '../../api/orders';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { FONT, S } from '../../theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface CartItem {
    item: MenuItem;
    quantity: number;
}

const POSItem = React.memo(({ item, onAdd, colors }: { item: MenuItem, onAdd: (item: MenuItem) => void, colors: any }) => (
    <TouchableOpacity 
        style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
        onPress={() => onAdd(item)}
        activeOpacity={0.7}
    >
        {item.image_url ? (
            <Image source={{ uri: item.image_url }} style={styles.thumb} resizeMode="cover" />
        ) : (
            <View style={[styles.thumbPlaceholder, { backgroundColor: colors.surface2 }]}>
                <Feather name="image" size={24} color={colors.textDim} />
            </View>
        )}
        <View style={styles.cardInfo}>
            <Text style={[styles.itemName, { color: colors.text }]} numberOfLines={2}>{item.name}</Text>
            <Text style={[styles.price, { color: colors.accent }]}>₹{item.price}</Text>
        </View>
        <View style={[styles.addBtn, { backgroundColor: colors.accent }]}>
            <Feather name="plus" size={16} color="#000" />
        </View>
    </TouchableOpacity>
));

export function POSScreen() {
    const { user } = useAuth();
    const { colors, isDark } = useTheme();
    const insets = useSafeAreaInsets();
    const restaurantId = user?.restaurantId ?? '';

    const [items, setItems] = useState<MenuItem[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [tables, setTables] = useState<RestaurantTable[]>([]);
    const [loading, setLoading] = useState(true);
    
    const [filterCat, setFilterCat] = useState('all');
    const [cart, setCart] = useState<CartItem[]>([]);
    const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);

    const loadData = useCallback(async () => {
        if (!restaurantId) return;
        try {
            const [itemsData, catsData, tablesData] = await Promise.all([
                menuApi.getAll(restaurantId),
                menuApi.getCategories(restaurantId),
                tablesApi.findAll(restaurantId),
            ]);
            setItems(itemsData.filter(i => i.is_available)); // Only show available items
            setCategories(catsData);
            setTables(tablesData.filter(t => t.is_active));
        } catch {
            Alert.alert('Error', 'Failed to load POS data');
        }
    }, [restaurantId]);

    useEffect(() => { loadData().finally(() => setLoading(false)); }, [loadData]);

    const handleAddToCart = (menuItem: MenuItem) => {
        setCart(prev => {
            const existing = prev.find(c => c.item.id === menuItem.id);
            if (existing) {
                return prev.map(c => c.item.id === menuItem.id ? { ...c, quantity: c.quantity + 1 } : c);
            }
            return [...prev, { item: menuItem, quantity: 1 }];
        });
    };

    const handleRemoveFromCart = (itemId: string) => {
        setCart(prev => {
            const existing = prev.find(c => c.item.id === itemId);
            if (existing && existing.quantity > 1) {
                return prev.map(c => c.item.id === itemId ? { ...c, quantity: c.quantity - 1 } : c);
            }
            return prev.filter(c => c.item.id !== itemId);
        });
    };

    const cartTotal = cart.reduce((sum, c) => sum + (c.item.price * c.quantity), 0);
    const cartCount = cart.reduce((sum, c) => sum + c.quantity, 0);

    const handlePlaceOrder = async () => {
        if (!selectedTableId) {
            Alert.alert('Select Table', 'Please select a table before placing the order.');
            return;
        }
        if (cart.length === 0) {
            Alert.alert('Empty Cart', 'Please add items to the cart.');
            return;
        }

        setIsPlacingOrder(true);
        try {
            const payload = {
                restaurantId,
                tableId: selectedTableId,
                items: cart.map(c => ({ itemId: c.item.id, quantity: c.quantity })),
                total: cartTotal,
                status: 'Confirmed' // Assuming kitchen should start preparing immediately
            };
            await ordersApi.create(payload);
            Alert.alert('Success', 'Order placed successfully!');
            setCart([]);
            setSelectedTableId(null);
        } catch (err) {
            Alert.alert('Error', 'Failed to place order. Please try again.');
        } finally {
            setIsPlacingOrder(false);
        }
    };

    const visibleItems = filterCat === 'all'
        ? items
        : items.filter(i => i.categoryId === filterCat || String(i.categoryId) === filterCat);

    if (loading) return (
        <View style={[S.screen, { backgroundColor: colors.bg }]}>
            <ActivityIndicator style={{ marginTop: 80 }} color={colors.accent} size="large" />
        </View>
    );

    return (
        <KeyboardAvoidingView style={[S.screen, { backgroundColor: colors.bg }]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border, paddingTop: Math.max(insets.top, 16) }]}>
                <Text style={[styles.title, { color: colors.text }]}>New Order</Text>
                
                {/* Table Selector */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tableScroll}>
                    <TouchableOpacity
                        style={[styles.tableOption, { backgroundColor: colors.surface2, borderColor: colors.border }, selectedTableId === 'takeaway' && { backgroundColor: colors.accent, borderColor: colors.accent }]}
                        onPress={() => setSelectedTableId('takeaway')}
                    >
                        <Text style={[styles.tableOptionText, { color: colors.text }, selectedTableId === 'takeaway' && { color: '#000' }]}>Takeaway</Text>
                    </TouchableOpacity>
                    {tables.map(t => (
                        <TouchableOpacity
                            key={t.id}
                            style={[styles.tableOption, { backgroundColor: colors.surface2, borderColor: colors.border }, selectedTableId === t.id && { backgroundColor: colors.accent, borderColor: colors.accent }]}
                            onPress={() => setSelectedTableId(t.id)}
                        >
                            <Text style={[styles.tableOptionText, { color: colors.text }, selectedTableId === t.id && { color: '#000' }]}>T-{t.table_number}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <View style={{ flex: 1, flexDirection: 'row' }}>
                {/* Left/Main: Menu Items */}
                <View style={{ flex: 1 }}>
                    {/* Category Tabs */}
                    <View style={[styles.tabsWrapper, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsContent}>
                            <TouchableOpacity
                                style={[styles.tab, { backgroundColor: colors.surface2, borderColor: colors.border }, filterCat === 'all' && { backgroundColor: colors.accent, borderColor: colors.accent }]}
                                onPress={() => setFilterCat('all')}
                            >
                                <Text style={[styles.tabText, { color: colors.textMuted }, filterCat === 'all' && { color: '#0f0f13' }]}>All</Text>
                            </TouchableOpacity>
                            {categories.map(cat => (
                                <TouchableOpacity
                                    key={cat.id}
                                    style={[styles.tab, { backgroundColor: colors.surface2, borderColor: colors.border }, filterCat === cat.id && { backgroundColor: colors.accent, borderColor: colors.accent }]}
                                    onPress={() => setFilterCat(cat.id)}
                                >
                                    <Text style={[styles.tabText, { color: colors.textMuted }, filterCat === cat.id && { color: '#0f0f13' }]}>{cat.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Items Grid */}
                    <FlatList
                        data={visibleItems}
                        keyExtractor={item => item.id}
                        numColumns={2}
                        contentContainerStyle={styles.list}
                        columnWrapperStyle={{ gap: 12 }}
                        initialNumToRender={10}
                        maxToRenderPerBatch={10}
                        windowSize={5}
                        removeClippedSubviews={Platform.OS === 'android'}
                        renderItem={({ item }) => <POSItem item={item} onAdd={handleAddToCart} colors={colors} />}
                    />
                </View>

                {/* Right/Bottom Sidebar: Cart */}
                <View style={[styles.cartContainer, { backgroundColor: colors.surface, borderLeftColor: colors.border }]}>
                    <View style={[styles.cartHeader, { borderBottomColor: colors.border }]}>
                        <Text style={[styles.cartTitle, { color: colors.text }]}>Current Order</Text>
                        <Text style={[styles.cartSub, { color: colors.textDim }]}>{cartCount} items</Text>
                    </View>

                    <ScrollView style={styles.cartList} contentContainerStyle={{ padding: 12, gap: 12 }}>
                        {cart.length === 0 && (
                            <Text style={[styles.emptyCartText, { color: colors.textDim }]}>Tap items to add them to the order.</Text>
                        )}
                        {cart.map(c => (
                            <View key={c.item.id} style={styles.cartItem}>
                                <View style={{ flex: 1 }}>
                                    <Text style={[styles.cartItemName, { color: colors.text }]} numberOfLines={2}>{c.item.name}</Text>
                                    <Text style={[styles.cartItemPrice, { color: colors.accent }]}>₹{c.item.price * c.quantity}</Text>
                                </View>
                                <View style={styles.qtyControls}>
                                    <TouchableOpacity style={[styles.qtyBtn, { backgroundColor: colors.surface2 }]} onPress={() => handleRemoveFromCart(c.item.id)}>
                                        <Feather name="minus" size={14} color={colors.text} />
                                    </TouchableOpacity>
                                    <Text style={[styles.qtyText, { color: colors.text }]}>{c.quantity}</Text>
                                    <TouchableOpacity style={[styles.qtyBtn, { backgroundColor: colors.surface2 }]} onPress={() => handleAddToCart(c.item)}>
                                        <Feather name="plus" size={14} color={colors.text} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </ScrollView>

                    <View style={[styles.cartFooter, { borderTopColor: colors.border }]}>
                        <View style={styles.totalRow}>
                            <Text style={[styles.totalLabel, { color: colors.text }]}>Total:</Text>
                            <Text style={[styles.totalValue, { color: colors.accent }]}>₹{cartTotal}</Text>
                        </View>
                        <TouchableOpacity
                            style={[styles.placeOrderBtn, { backgroundColor: cart.length > 0 && selectedTableId ? colors.green : colors.surface2 }]}
                            onPress={handlePlaceOrder}
                            disabled={cart.length === 0 || !selectedTableId || isPlacingOrder}
                        >
                            {isPlacingOrder ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={[styles.placeOrderText, { color: cart.length > 0 && selectedTableId ? '#fff' : colors.textMuted }]}>
                                    Place Order
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    header: {
        padding: 16, borderBottomWidth: 1, gap: 12
    },
    title: { fontSize: 24, ...FONT.bold },
    tableScroll: { flexDirection: 'row' },
    tableOption: {
        paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, borderWidth: 1, marginRight: 8
    },
    tableOptionText: { fontSize: 14, ...FONT.bold },
    tabsWrapper: { borderBottomWidth: 1 },
    tabsContent: { paddingHorizontal: 10, paddingVertical: 12, flexDirection: 'row' },
    tab: {
        paddingHorizontal: 14, paddingVertical: 6, borderRadius: 99, borderWidth: 1, marginRight: 8
    },
    tabText: { fontSize: 13, ...FONT.medium },
    list: { padding: 12 },
    card: {
        flex: 1, borderRadius: 12, borderWidth: 1, overflow: 'hidden', paddingBottom: 10
    },
    thumb: { width: '100%', height: 100 },
    thumbPlaceholder: { width: '100%', height: 100, alignItems: 'center', justifyContent: 'center' },
    cardInfo: { padding: 10, gap: 4 },
    itemName: { fontSize: 13, ...FONT.bold },
    price: { fontSize: 14, ...FONT.bold },
    addBtn: {
        position: 'absolute', bottom: 8, right: 8, width: 28, height: 28, borderRadius: 14,
        alignItems: 'center', justifyContent: 'center'
    },
    cartContainer: {
        width: '35%', minWidth: 150, borderLeftWidth: 1, display: 'flex'
    },
    cartHeader: { padding: 12, borderBottomWidth: 1 },
    cartTitle: { fontSize: 16, ...FONT.bold },
    cartSub: { fontSize: 12, ...FONT.medium },
    emptyCartText: { textAlign: 'center', marginTop: 40, fontSize: 13 },
    cartList: { flex: 1 },
    cartItem: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
    cartItemName: { fontSize: 13, ...FONT.bold },
    cartItemPrice: { fontSize: 13, ...FONT.medium, marginTop: 2 },
    qtyControls: { alignItems: 'center', gap: 4 },
    qtyBtn: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    qtyText: { fontSize: 13, ...FONT.bold },
    cartFooter: { padding: 12, borderTopWidth: 1, gap: 12 },
    totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    totalLabel: { fontSize: 16, ...FONT.bold },
    totalValue: { fontSize: 18, ...FONT.bold },
    placeOrderBtn: {
        paddingVertical: 14, borderRadius: 10, alignItems: 'center', justifyContent: 'center'
    },
    placeOrderText: { fontSize: 15, ...FONT.bold }
});
