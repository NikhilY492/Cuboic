import React, { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, TextInput, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { Order, ordersApi } from '../../api/orders';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMutationQueue } from '../../hooks/useMutationQueue';

interface EditOrderModalProps {
    visible: boolean;
    order: Order | null;
    restaurantId: string;
    onClose: () => void;
    onSaved: (updatedOrder: Order) => void;
}

export function EditOrderModal({ visible, order, restaurantId, onClose, onSaved }: EditOrderModalProps) {
    const { colors, isDark } = useTheme();
    const insets = useSafeAreaInsets();
    
    const [cart, setCart] = useState<{ itemId: string; name: string; quantity: number; unitPrice: number }[]>([]);
    const [notes, setNotes] = useState('');
    const [saving, setSaving] = useState(false);
    const { enqueue, drain, isOnline } = useMutationQueue();

    useEffect(() => {
        if (visible && order) {
            setCart(order.items.map(i => ({
                itemId: i.itemId,
                name: i.name,
                quantity: i.quantity,
                unitPrice: i.unitPrice
            })));
            setNotes(order.notes || '');
        } else {
            setCart([]);
            setNotes('');
        }
    }, [visible, order]);

    const handleUpdateQuantity = (item: { id: string; name: string; price: number }, change: number) => {
        setCart(prev => {
            const existing = prev.find(p => p.itemId === item.id);
            if (existing) {
                const newQuantity = existing.quantity + change;
                if (newQuantity <= 0) {
                    return prev.filter(p => p.itemId !== item.id);
                }
                return prev.map(p => p.itemId === item.id ? { ...p, quantity: newQuantity } : p);
            } else if (change > 0) {
                return [...prev, { itemId: item.id, name: item.name, quantity: change, unitPrice: item.price }];
            }
            return prev;
        });
    };

    const getQuantity = (itemId: string) => {
        return cart.find(c => c.itemId === itemId)?.quantity || 0;
    };

    const handleSave = async () => {
        if (!order) return;
        if (cart.length === 0) {
            Alert.alert('Invalid', 'Order must have at least one item. If you want to cancel, use the cancel button instead.');
            return;
        }

        setSaving(true);
        const payloadItems = cart.map(c => ({ itemId: c.itemId, quantity: c.quantity }));
        const payload = { orderId: order.id, items: payloadItems, notes };
        
        const optimisticOrder: Order = {
            ...order,
            items: cart.map(c => ({ itemId: c.itemId, name: c.name, quantity: c.quantity, unitPrice: c.unitPrice })),
            notes,
        };

        enqueue('UPDATE_ITEMS', payload, order.version);
        onSaved(optimisticOrder);
        
        if (isOnline) {
            drain().catch(() => {});
        }
        
        setSaving(false);
    };

    const handleCancelOrder = () => {
        if (!order) return;
        Alert.alert('Cancel Order', 'Are you sure you want to completely cancel this order?', [
            { text: 'No', style: 'cancel' },
            { 
                text: 'Yes, Cancel', 
                style: 'destructive',
                onPress: async () => {
                    setSaving(true);
                    const optimisticOrder: Order = { ...order, status: 'Cancelled' as any };
                    enqueue('UPDATE_STATUS', { orderId: order.id, status: 'Cancelled' }, order.version);
                    onSaved(optimisticOrder);
                    
                    if (isOnline) {
                        drain().catch(() => {});
                    }
                    setSaving(false);
                }
            }
        ]);
    };

    if (!order) return null;

    const totalAmount = cart.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
            <View style={[styles.container, { backgroundColor: colors.bg }]}>
                {/* Header */}
                <View style={[styles.header, { borderBottomColor: colors.border }]}>
                    <TouchableOpacity onPress={onClose} style={styles.iconBtn}>
                        <Feather name="x" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.title, { color: colors.text }]}>
                        Edit Order #{order.id.slice(-5).toUpperCase()}
                    </Text>
                    <View style={{ width: 40 }} />
                </View>

                {/* Body */}
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {/* Notes Section */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Cooking Notes</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                            placeholder="Add cooking instructions..."
                            placeholderTextColor={colors.textMuted}
                            value={notes}
                            onChangeText={setNotes}
                            multiline
                            numberOfLines={2}
                        />
                    </View>

                    {/* Menu Items */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Modify Ordered Items</Text>
                        <View style={styles.menuList}>
                            {order.items.map(orderItem => {
                                const qty = getQuantity(orderItem.itemId);
                                const isSelected = qty > 0;
                                
                                const simulatedItem = {
                                    id: orderItem.itemId,
                                    name: orderItem.name,
                                    price: orderItem.unitPrice
                                };

                                return (
                                    <View key={orderItem.itemId} style={[styles.menuItem, { backgroundColor: colors.surface, borderColor: isSelected ? colors.accent : colors.border }]}>
                                        <View style={styles.itemInfo}>
                                            <Text style={[styles.itemName, { color: colors.text }]}>{orderItem.name}</Text>
                                            <Text style={[styles.itemPrice, { color: colors.textMuted }]}>₹{orderItem.unitPrice}</Text>
                                        </View>
                                        <View style={styles.counterRow}>
                                            <TouchableOpacity 
                                                style={[styles.counterBtn, { backgroundColor: colors.surface2 }]} 
                                                onPress={() => handleUpdateQuantity(simulatedItem, -1)}
                                                disabled={qty === 0}
                                            >
                                                <Feather name="minus" size={16} color={qty === 0 ? colors.border : colors.text} />
                                            </TouchableOpacity>
                                            <Text style={[styles.qtyText, { color: colors.text }]}>{qty}</Text>
                                            <TouchableOpacity 
                                                style={[styles.counterBtn, { backgroundColor: colors.surface2 }]} 
                                                onPress={() => handleUpdateQuantity(simulatedItem, 1)}
                                            >
                                                <Feather name="plus" size={16} color={colors.text} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                );
                            })}
                        </View>
                    </View>
                </ScrollView>

                {/* Footer */}
                <View style={[styles.footer, { backgroundColor: colors.surface, borderTopColor: colors.border, paddingBottom: Math.max(insets.bottom, 16) }]}>
                    <View style={styles.totalRow}>
                        <Text style={[styles.totalLabel, { color: colors.text }]}>New Total:</Text>
                        <Text style={[styles.totalAmount, { color: colors.accent }]}>₹{totalAmount.toFixed(2)}</Text>
                    </View>
                    <TouchableOpacity 
                        style={[styles.saveBtn, { backgroundColor: colors.accent, marginBottom: 12 }]}
                        onPress={handleSave}
                        disabled={saving}
                    >
                        {saving ? (
                            <ActivityIndicator size="small" color="white" />
                        ) : (
                            <Text style={styles.saveBtnText}>Save Changes</Text>
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.cancelOrderBtn, { borderColor: colors.red, borderWidth: 1 }]}
                        onPress={handleCancelOrder}
                        disabled={saving}
                    >
                        <Text style={[styles.cancelOrderBtnText, { color: colors.red }]}>Cancel Order</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
    },
    iconBtn: { padding: 8, marginLeft: -8 },
    title: { fontSize: 18, fontWeight: '700' },
    scrollContent: { padding: 16, paddingBottom: 160 },
    section: { marginBottom: 24 },
    sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
    input: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 12,
        fontSize: 15,
        minHeight: 80,
        textAlignVertical: 'top'
    },
    menuList: { gap: 12 },
    menuItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
    },
    itemInfo: { flex: 1, paddingRight: 16 },
    itemName: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
    itemPrice: { fontSize: 14, fontWeight: '500' },
    counterRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    counterBtn: {
        width: 32, height: 32,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center'
    },
    qtyText: { fontSize: 16, fontWeight: '700', minWidth: 20, textAlign: 'center' },
    footer: {
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        padding: 16,
        borderTopWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 10
    },
    totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16, alignItems: 'center' },
    totalLabel: { fontSize: 16, fontWeight: '600' },
    totalAmount: { fontSize: 20, fontWeight: '800' },
    saveBtn: {
        padding: 16,
        borderRadius: 12,
        alignItems: 'center'
    },
    saveBtnText: { color: 'white', fontSize: 16, fontWeight: '700' },
    cancelOrderBtn: {
        padding: 16,
        borderRadius: 12,
        alignItems: 'center'
    },
    cancelOrderBtnText: { fontSize: 16, fontWeight: '700' }
});
