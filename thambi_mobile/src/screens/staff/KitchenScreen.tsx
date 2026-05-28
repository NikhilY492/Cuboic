import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    View, Text, ScrollView, TouchableOpacity, StyleSheet,
    Dimensions, Alert
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ordersApi, type Order } from '../../api/orders';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useSocketEvent } from '../../context/SocketContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getStatusColor, FONT } from '../../theme';
import { useOptimisticMutation } from '../../hooks/useOptimisticMutation';

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

const NEXT_STATUS: Record<string, string> = {
    Confirmed: 'Ready'
};

function KitchenCard({ 
    item, 
    onAdvance
}: { 
    item: Order; 
    onAdvance: (o: Order) => void;
}) {
    const { colors } = useTheme();
    const indicatorColor = getStatusColor(item.status, colors);
    const tableNum = getTableNum(item);
    
    // Elapsed time calculation
    const elapsedMinutes = Math.floor((new Date().getTime() - new Date(item.createdAt).getTime()) / 60000);
    const timeDisplay = elapsedMinutes > 0 ? `${elapsedMinutes} Min` : 'Just now';
    const isUrgent = elapsedMinutes > 15;

    const nextState = NEXT_STATUS[item.status];
    let btnColor = nextState ? getStatusColor(nextState, colors) : colors.border;
    let btnText = nextState ? `Mark ${nextState}` : 'Finished';
    if (nextState === 'Ready') btnText = 'Mark Ready';

    return (
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: isUrgent ? colors.red : colors.border, borderWidth: isUrgent ? 2 : 1, borderTopWidth: 4, borderTopColor: indicatorColor }]}>
            <View style={[styles.cardHeader, { backgroundColor: colors.surface2 }]}>
                <View style={styles.headerRow}>
                    <Text style={[styles.headerOrderId, { color: colors.text }]}>Order # {item.id.slice(-5).toUpperCase()}</Text>
                    <Text style={[styles.headerElapsed, { color: isUrgent ? colors.red : colors.text }]}>{timeDisplay}</Text>
                </View>
                <Text style={[styles.tableText, { color: colors.textMuted }]}>
                    {tableNum.toLowerCase() === 'takeaway' ? 'Takeaway' : `Table - ${tableNum}`}
                </Text>
            </View>

            <View style={styles.cardBody}>
                {/* Items */}
                <View style={styles.itemsList}>
                    {item.items.map((it: any, idx: number) => (
                        <View key={idx} style={styles.itemRow}>
                            <View style={styles.itemQtyWrap}>
                                <Text style={[styles.itemQty, { color: colors.text }]}>{it.quantity} x</Text>
                            </View>
                            <View style={styles.itemNameWrap}>
                                <Text style={[styles.itemName, { color: colors.text }]}>{it.name}</Text>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Notes */}
                {!!item.notes && (
                    <View style={[styles.notesWrap, { backgroundColor: colors.red + '15', borderColor: colors.red + '30' }]}>
                        <Text style={[styles.notesTitle, { color: colors.red }]}>COOKING NOTES</Text>
                        <Text style={[styles.notesText, { color: colors.red }]}>{item.notes}</Text>
                    </View>
                )}

                {/* Action Buttons */}
                {nextState && (
                    <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
                        <TouchableOpacity 
                            style={[
                                styles.finishBtn, 
                                { backgroundColor: colors.surface2, flex: 1, borderColor: btnColor }
                            ]} 
                            onPress={() => onAdvance(item)}
                            activeOpacity={0.8}
                        >
                            <Text style={[styles.finishBtnText, { color: btnColor }]}>
                                {btnText}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </View>
    );
}

const KITCHEN_COLUMNS = ['Confirmed', 'Ready'];

export function KitchenScreen() {
    const { user, logout } = useAuth();
    const { colors, isDark } = useTheme();
    const insets = useSafeAreaInsets();
    const restaurantId = user?.restaurantId ?? '';

    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    const loadOrders = useCallback(async () => {
        if (!restaurantId) return;
        try {
            const data = await ordersApi.findAll(restaurantId);
            // Sort by oldest first (FIFO for kitchen)
            data.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
            setOrders(data);
        } catch { /* Ignore */ }
    }, [restaurantId]);

    useEffect(() => { loadOrders().finally(() => setLoading(false)); }, [loadOrders]);

    useSocketEvent(restaurantId, {
        'order:new': async () => loadOrders(),
        'order:updated': () => loadOrders(),
    });

    const { execute: optimisticUpdateStatus } = useOptimisticMutation(
        orders,
        setOrders,
        loadOrders
    );

    const handleAdvanceOrder = async (order: Order) => {
        const next = NEXT_STATUS[order.status];
        if (!next) return;
        
        optimisticUpdateStatus(
            'UPDATE_STATUS',
            { orderId: order.id, status: next },
            order.version,
            (prevOrders) => prevOrders.map(o => o.id === order.id ? { ...o, status: next as any } : o)
        );
    };

    const handleLogout = () => {
        Alert.alert('Logout', 'Are you sure you want to log out?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Logout', style: 'destructive', onPress: () => logout() }
        ]);
    };

    const { width } = Dimensions.get('window');
    const isTablet = width > 768;
    // On tablet, divide available width (minus padding/gaps) among the columns to use full screen
    const colWidth = isTablet ? (width - 40) / KITCHEN_COLUMNS.length : width * 0.85;

    return (
        <View style={[styles.container, { backgroundColor: colors.bg, paddingTop: insets.top }]}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
                <View>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>Kitchen Display</Text>
                    <Text style={[styles.headerSub, { color: colors.textDim }]}>Live Order Feed</Text>
                </View>
                <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
                    <Feather name="log-out" size={20} color={colors.red} />
                </TouchableOpacity>
            </View>

            {/* Kanban Board */}
            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                snapToInterval={isTablet ? undefined : colWidth + 16}
                decelerationRate="fast"
            >
                {KITCHEN_COLUMNS.map((status) => {
                    const colOrders = orders.filter(o => o.status === status);
                    let color = colors.text;
                    if (status === 'Confirmed') color = colors.blue;
                    if (status === 'Preparing') color = colors.amber;
                    if (status === 'Ready') color = colors.green;

                    return (
                        <View key={status} style={[styles.column, { width: colWidth }]}>
                            <View style={[styles.columnHeader, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
                                <View style={styles.colTitleWrap}>
                                    <View style={[styles.colDot, { backgroundColor: color }]} />
                                    <Text style={[styles.colTitle, { color }]}>
                                        {status === 'Confirmed' ? 'New Orders' : 'Ready'}
                                    </Text>
                                </View>
                                <View style={[styles.badge, { backgroundColor: isDark ? colors.surface2 : colors.bg }]}>
                                    <Text style={[styles.badgeText, { color: colors.textDim }]}>{colOrders.length}</Text>
                                </View>
                            </View>
                            
                            <ScrollView 
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={styles.columnBody}
                            >
                                {colOrders.map(order => (
                                    <View key={order.id} style={styles.cardWrapper}>
                                        <KitchenCard 
                                            item={order} 
                                            onAdvance={handleAdvanceOrder}
                                        />
                                    </View>
                                ))}
                                {colOrders.length === 0 && (
                                    <View style={styles.emptyState}>
                                        <Feather name="inbox" size={32} color={colors.border} />
                                        <Text style={[styles.emptyText, { color: colors.textDim }]}>No orders</Text>
                                    </View>
                                )}
                            </ScrollView>
                        </View>
                    );
                })}
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
    scrollContent: { padding: 12, gap: 16 },
    column: { flex: 1 },
    columnHeader: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        padding: 12, borderRadius: 12, borderBottomWidth: 1, marginBottom: 8
    },
    colTitleWrap: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    colDot: { width: 8, height: 8, borderRadius: 4 },
    colTitle: { fontSize: 14, ...FONT.bold },
    badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 },
    badgeText: { fontSize: 12, ...FONT.bold },
    columnBody: { paddingBottom: 24, gap: 12 },
    cardWrapper: { width: '100%' },
    card: {
        borderRadius: 12, overflow: 'hidden'
    },
    cardHeader: {
        padding: 12, paddingBottom: 10,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: 'rgba(0,0,0,0.05)'
    },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
    headerOrderId: { fontSize: 12, ...FONT.bold },
    headerElapsed: { fontSize: 11, ...FONT.bold },
    tableText: { fontSize: 16, ...FONT.bold, marginTop: 4 },
    cardBody: { padding: 12 },
    itemsList: { gap: 8, marginBottom: 12 },
    itemRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
    itemQtyWrap: { minWidth: 24, alignItems: 'flex-end' },
    itemQty: { fontSize: 13, ...FONT.bold },
    itemNameWrap: { flex: 1 },
    itemName: { fontSize: 13, ...FONT.medium, lineHeight: 18 },
    notesWrap: {
        padding: 8, borderRadius: 6, borderWidth: 1, marginBottom: 4
    },
    notesTitle: { fontSize: 10, ...FONT.bold, marginBottom: 4 },
    notesText: { fontSize: 12, ...FONT.medium },
    finishBtn: {
        paddingVertical: 10, borderRadius: 8, borderWidth: 1,
        alignItems: 'center', justifyContent: 'center'
    },
    finishBtnText: { fontSize: 13, ...FONT.bold },
    emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40, gap: 8 },
    emptyText: { fontSize: 13, ...FONT.medium }
});
