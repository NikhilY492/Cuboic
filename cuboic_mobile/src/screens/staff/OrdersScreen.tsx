import React, { useState, useEffect, useCallback } from 'react';
import {
    View, Text, FlatList, TouchableOpacity, StyleSheet,
    RefreshControl, ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getOrders, type Order } from '../../api/orders';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../hooks/useSocket';
import { COLORS, S, statusColor } from '../../theme';
import type { RootStackParamList } from '../../navigation/RootNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function OrdersScreen() {
    const { user } = useAuth();
    const nav = useNavigation<Nav>();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const load = useCallback(async () => {
        if (!user?.restaurant_id) return;
        const data = await getOrders(user.restaurant_id);
        setOrders(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    }, [user?.restaurant_id]);

    useEffect(() => { load().finally(() => setLoading(false)); }, [load]);

    // Real-time socket updates
    const socketRef = useSocket(user?.restaurant_id);
    useEffect(() => {
        const socket = socketRef.current;
        if (!socket) return;

        const onCreated = (order: Order) => setOrders(prev => [order, ...prev]);
        const onUpdated = (data: { _id: string; order_status: Order['order_status'] }) => {
            setOrders(prev =>
                prev.map(o => o._id === data._id ? { ...o, order_status: data.order_status } : o),
            );
        };

        socket.on('order.created', onCreated);
        socket.on('order.updated', onUpdated);
        return () => {
            socket.off('order.created', onCreated);
            socket.off('order.updated', onUpdated);
        };
    }, [socketRef]);

    const onRefresh = async () => {
        setRefreshing(true);
        await load();
        setRefreshing(false);
    };

    if (loading) return <View style={S.screen}><ActivityIndicator style={{ marginTop: 60 }} color={COLORS.accent} size="large" /></View>;

    return (
        <View style={S.screen}>
            <View style={styles.header}>
                <Text style={styles.title}>Orders</Text>
                <Text style={styles.sub}>{orders.length} total</Text>
            </View>

            <FlatList
                data={orders}
                keyExtractor={item => item._id}
                contentContainerStyle={styles.list}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.accent} />}
                renderItem={({ item }) => {
                    const tableNum = typeof item.table_id === 'object' ? item.table_id.table_number : '—';
                    const color = statusColor(item.order_status);
                    return (
                        <TouchableOpacity
                            style={styles.card}
                            onPress={() => nav.navigate('OrderDetail', { orderId: item._id })}
                            activeOpacity={0.8}
                        >
                            <View style={S.row}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.cardTitle}>Table {tableNum}</Text>
                                    <Text style={styles.cardSub}>₹{item.total_price.toFixed(2)} · {item.items.length} item{item.items.length !== 1 ? 's' : ''}</Text>
                                </View>
                                <View style={[S.badge, { backgroundColor: color + '22' }]}>
                                    <Text style={{ color, fontSize: 12, fontWeight: '700' }}>{item.order_status}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    );
                }}
                ListEmptyComponent={<Text style={styles.empty}>No orders yet. Waiting for customers…</Text>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        padding: 20,
        paddingTop: 56,
        backgroundColor: COLORS.surface,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    title: { fontSize: 26, fontWeight: '800', color: COLORS.text },
    sub: { fontSize: 13, color: COLORS.textMuted, marginTop: 2 },
    list: { padding: 16, gap: 10 },
    card: {
        ...S.card,
        padding: 16,
    },
    cardTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 4 },
    cardSub: { fontSize: 13, color: COLORS.textMuted },
    empty: { textAlign: 'center', color: COLORS.textMuted, marginTop: 80, fontSize: 14 },
});
