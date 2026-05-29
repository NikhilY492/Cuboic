import React, { useState, useEffect, useCallback } from 'react';
import {
    View, Text, ScrollView, TouchableOpacity, StyleSheet,
    RefreshControl, ActivityIndicator, Alert
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ordersApi, type Order } from '../../api/orders';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useSocketEvent } from '../../context/SocketContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getStatusColor, FONT } from '../../theme';

function getTableNum(order: Order): string {
    if (order.table?.table_number !== undefined) {
        const str = String(order.table.table_number);
        if (str.toLowerCase() === 'takeaway') return 'Takeaway';
        return str.startsWith('T') ? str.substring(1) : str;
    }
    
    if (typeof order.tableId === 'string') {
        const idLower = order.tableId.toLowerCase();
        if (idLower === 'takeaway' || idLower === 'takeaway_virtual') return 'Takeaway';
        const str = order.tableId.slice(-4);
        return str.startsWith('T') ? str.substring(1) : str;
    }
    
    return 'TAKE';
}

function WaiterCard({ 
    item, 
    onDeliver 
}: { 
    item: Order; 
    onDeliver?: (o: Order, itemIds: string[]) => void;
}) {
    const { colors } = useTheme();
    const indicatorColor = getStatusColor(item.status, colors);
    const tableNum = getTableNum(item);
    
    // Elapsed time calculation
    const elapsedMinutes = Math.floor((new Date().getTime() - new Date(item.createdAt).getTime()) / 60000);
    const timeDisplay = elapsedMinutes > 0 ? `${elapsedMinutes} Min` : 'Just now';
    
    const isReady = item.status === 'Ready';

    const undeliveredItems = item.items.filter((it: any) => !it.isDelivered);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);

    useEffect(() => {
        setSelectedItems(item.items.filter((it: any) => !it.isDelivered).map((it: any) => it.itemId));
    }, [item]);

    const toggleItem = (itemId: string) => {
        setSelectedItems(prev => prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]);
    };

    const isAllSelected = selectedItems.length === undeliveredItems.length && undeliveredItems.length > 0;

    const toggleSelectAll = () => {
        if (isAllSelected) {
            setSelectedItems([]);
        } else {
            setSelectedItems(undeliveredItems.map((it: any) => it.itemId));
        }
    };

    return (
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: isReady ? colors.green : colors.border, borderWidth: isReady ? 2 : 1, borderTopWidth: 4, borderTopColor: indicatorColor }]}>
            <View style={[styles.cardHeader, { backgroundColor: colors.surface2 }]}>
                <View style={styles.headerRow}>
                    <Text style={[styles.headerOrderId, { color: colors.text }]}>Order # {item.id.slice(-5).toUpperCase()}</Text>
                    <Text style={[styles.headerElapsed, { color: colors.textDim }]}>{timeDisplay}</Text>
                </View>
                <Text style={[styles.tableText, { color: isReady ? colors.text : colors.textMuted }]}>
                    {tableNum.toLowerCase() === 'takeaway' ? 'Takeaway' : `Table - ${tableNum}`}
                </Text>
            </View>

            <View style={styles.cardBody}>
                {/* Items Summary */}
                <View style={styles.itemsList}>
                    {item.items.map((it: any, idx: number) => {
                        const isDelivered = it.isDelivered;
                        const isSelected = selectedItems.includes(it.itemId);
                        return (
                            <TouchableOpacity 
                                key={idx} 
                                style={[styles.itemRow, isDelivered && { opacity: 0.5 }]}
                                onPress={() => isReady && !isDelivered && toggleItem(it.itemId)}
                                disabled={!isReady || isDelivered}
                                activeOpacity={0.7}
                            >
                                {isReady && (
                                    <View style={styles.checkboxContainer}>
                                        <View style={[styles.checkbox, isSelected && { backgroundColor: colors.green, borderColor: colors.green }, isDelivered && { backgroundColor: colors.border, borderColor: colors.border }]}>
                                            {(isSelected || isDelivered) && <Feather name="check" size={12} color="#fff" />}
                                        </View>
                                    </View>
                                )}
                                <View style={styles.itemQtyWrap}>
                                    <Text style={[styles.itemQty, { color: colors.text, textDecorationLine: isDelivered ? 'line-through' : 'none' }]}>{it.quantity} x</Text>
                                </View>
                                <View style={styles.itemNameWrap}>
                                    <Text style={[styles.itemName, { color: colors.text, textDecorationLine: isDelivered ? 'line-through' : 'none' }]}>{it.name}</Text>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Actions */}
                {isReady && onDeliver && (
                    <View style={styles.actionContainer}>
                        {undeliveredItems.length > 1 && (
                            <TouchableOpacity onPress={toggleSelectAll} style={styles.selectAllBtn}>
                                <View style={[styles.checkbox, isAllSelected && { backgroundColor: colors.green, borderColor: colors.green }]}>
                                    {isAllSelected && <Feather name="check" size={12} color="#fff" />}
                                </View>
                                <Text style={[styles.selectAllText, { color: colors.text }]}>Select All</Text>
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity 
                            style={[styles.deliverBtn, { backgroundColor: selectedItems.length > 0 ? colors.green : colors.border }]} 
                            onPress={() => selectedItems.length > 0 && onDeliver(item, selectedItems)}
                            activeOpacity={0.8}
                            disabled={selectedItems.length === 0}
                        >
                            <Feather name="check-circle" size={20} color="#fff" />
                            <Text style={[styles.deliverBtnText, { color: '#fff' }]}>
                                {isAllSelected || undeliveredItems.length === 1 ? 'Deliver All' : `Deliver Selected (${selectedItems.length})`}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </View>
    );
}

export function WaiterScreen() {
    const { user, logout } = useAuth();
    const { colors, isDark } = useTheme();
    const insets = useSafeAreaInsets();
    const restaurantId = user?.restaurantId ?? '';

    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [activeTab, setActiveTab] = useState<'Ready' | 'Preparing'>('Ready');

    const loadOrders = useCallback(async () => {
        if (!restaurantId) return;
        try {
            const data = await ordersApi.findAll(restaurantId);
            // Sort by oldest first so waiters deliver the oldest ready orders first
            data.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
            setOrders(data);
        } catch { /* Ignore */ }
    }, [restaurantId]);

    const handleRefresh = async () => {
        setRefreshing(true);
        await loadOrders();
        setRefreshing(false);
    };

    useEffect(() => { loadOrders().finally(() => setLoading(false)); }, [loadOrders]);

    useSocketEvent(restaurantId, {
        'order:new': async () => loadOrders(),
        'order:updated': () => loadOrders(),
    });

    const handleDeliver = async (order: Order, itemIds: string[]) => {
        try {
            const updated = await ordersApi.deliverItems(order.id, itemIds);
            setOrders(prev => prev.map(o => o.id === order.id ? updated : o));
        } catch (err) {
            Alert.alert('Error', 'Failed to deliver items');
        }
    };

    const handleLogout = () => {
        Alert.alert('Logout', 'Are you sure you want to log out?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Logout', style: 'destructive', onPress: () => logout() }
        ]);
    };

    const filteredOrders = orders.filter(o => o.status === activeTab);

    return (
        <View style={[styles.container, { backgroundColor: colors.bg, paddingTop: insets.top }]}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
                <View>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>Waiter Hub</Text>
                    <Text style={[styles.headerSub, { color: colors.textDim }]}>Deliveries & Service</Text>
                </View>
                <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
                    <Feather name="log-out" size={20} color={colors.red} />
                </TouchableOpacity>
            </View>

            {/* Segmented Control */}
            <View style={styles.tabContainer}>
                <TouchableOpacity 
                    style={[styles.tab, activeTab === 'Ready' && { backgroundColor: colors.green }]} 
                    onPress={() => setActiveTab('Ready')}
                >
                    <Text style={[styles.tabText, { color: activeTab === 'Ready' ? '#fff' : colors.textDim }]}>
                        Ready to Deliver
                    </Text>
                    {activeTab === 'Ready' && orders.filter(o => o.status === 'Ready').length > 0 && (
                        <View style={styles.tabBadge}>
                            <Text style={styles.tabBadgeText}>{orders.filter(o => o.status === 'Ready').length}</Text>
                        </View>
                    )}
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.tab, activeTab === 'Preparing' && { backgroundColor: colors.surface2 }]} 
                    onPress={() => setActiveTab('Preparing')}
                >
                    <Text style={[styles.tabText, { color: activeTab === 'Preparing' ? colors.text : colors.textDim }]}>
                        In Kitchen
                    </Text>
                </TouchableOpacity>
            </View>

            {/* List */}
            <ScrollView 
                contentContainerStyle={styles.scrollContent}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.accent} />}
            >
                {filteredOrders.map(order => (
                    <WaiterCard 
                        key={order.id} 
                        item={order} 
                        onDeliver={activeTab === 'Ready' ? handleDeliver : undefined} 
                    />
                ))}
                
                {filteredOrders.length === 0 && !loading && (
                    <View style={styles.emptyState}>
                        <Feather name={activeTab === 'Ready' ? "check-circle" : "clock"} size={48} color={colors.border} />
                        <Text style={[styles.emptyText, { color: colors.textDim }]}>
                            {activeTab === 'Ready' ? "No orders ready for delivery. Great job!" : "No orders are currently cooking."}
                        </Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderBottomWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    headerTitle: { fontSize: 20, ...FONT.bold },
    headerSub: { fontSize: 12, ...FONT.medium, marginTop: 2 },
    logoutBtn: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: 'rgba(239,68,68,0.1)'
    },
    tabContainer: {
        flexDirection: 'row',
        padding: 16,
        gap: 12,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 8,
    },
    tabText: {
        fontSize: 14,
        ...FONT.bold,
    },
    tabBadge: {
        backgroundColor: '#fff',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
    },
    tabBadgeText: {
        fontSize: 12,
        ...FONT.bold,
        color: '#000',
    },
    scrollContent: { padding: 16, paddingBottom: 40, gap: 16 },
    card: {
        borderRadius: 16, overflow: 'hidden'
    },
    cardHeader: {
        padding: 16, paddingBottom: 14,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: 'rgba(0,0,0,0.05)'
    },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
    headerOrderId: { fontSize: 13, ...FONT.bold },
    headerElapsed: { fontSize: 12, ...FONT.bold },
    tableText: { fontSize: 24, ...FONT.bold, marginTop: 4 },
    cardBody: { padding: 16 },
    itemsList: { gap: 10 },
    itemRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
    itemQtyWrap: { minWidth: 28, alignItems: 'flex-end' },
    itemQty: { fontSize: 15, ...FONT.bold },
    itemNameWrap: { flex: 1 },
    itemName: { fontSize: 15, ...FONT.medium, lineHeight: 20 },
    deliverBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 12,
        gap: 8,
    },
    deliverBtnText: {
        fontSize: 16,
        ...FONT.bold,
    },
    emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 80, gap: 16, paddingHorizontal: 40 },
    emptyText: { fontSize: 15, ...FONT.medium, textAlign: 'center', lineHeight: 22 },
    checkboxContainer: {
        justifyContent: 'center',
        marginRight: 8,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#ccc',
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionContainer: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
    },
    selectAllBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 14,
        paddingHorizontal: 8,
    },
    selectAllText: {
        fontSize: 15,
        ...FONT.medium,
    }
});
