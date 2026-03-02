import React, { useState, useEffect, useCallback } from 'react';
import {
    View, Text, FlatList, TouchableOpacity, StyleSheet,
    Alert, ActivityIndicator, RefreshControl,
} from 'react-native';
import { getActiveDeliveries, confirmStop, getRobots, type Delivery, type Robot } from '../../api/deliveries';
import { getOrders, type Order } from '../../api/orders';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../hooks/useSocket';
import { COLORS, S, statusColor } from '../../theme';

export function CreateDeliveryScreen() {
    const { user } = useAuth();
    const [deliveries, setDeliveries] = useState<Delivery[]>([]);
    const [robots, setRobots] = useState<Robot[]>([]);
    const [readyOrders, setReadyOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const load = useCallback(async () => {
        if (!user?.restaurant_id) return;
        const [delivs, rbs, orders] = await Promise.all([
            getActiveDeliveries(user.restaurant_id),
            getRobots(user.restaurant_id),
            getOrders(user.restaurant_id, 'Ready'),
        ]);
        setDeliveries(delivs);
        setRobots(rbs);
        setReadyOrders(orders);
    }, [user?.restaurant_id]);

    useEffect(() => { load().finally(() => setLoading(false)); }, [load]);

    // Real-time delivery events
    const socketRef = useSocket(user?.restaurant_id);
    useEffect(() => {
        const socket = socketRef.current;
        if (!socket) return;
        const onUpdated = () => load();
        socket.on('delivery.created', onUpdated);
        socket.on('delivery.updated', onUpdated);
        return () => {
            socket.off('delivery.created', onUpdated);
            socket.off('delivery.updated', onUpdated);
        };
    }, [socketRef, load]);

    const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };

    async function handleConfirmStop(deliveryId: string, stopIndex: number) {
        try {
            const updated = await confirmStop(deliveryId, stopIndex);
            setDeliveries(prev => prev.map(d => d._id === updated._id ? updated : d).filter(d => d.trip_status !== 'Completed'));
        } catch (e: any) {
            Alert.alert('Error', e?.response?.data?.message ?? 'Failed to confirm stop');
        }
    }

    if (loading) return <View style={S.screen}><ActivityIndicator style={{ marginTop: 80 }} color={COLORS.accent} size="large" /></View>;

    return (
        <FlatList
            style={S.screen}
            contentContainerStyle={styles.body}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.accent} />}
            ListHeaderComponent={
                <View>
                    <View style={styles.header}>
                        <Text style={styles.title}>Deliveries</Text>
                    </View>

                    {/* Robot fleet overview */}
                    <Text style={[S.sectionTitle, styles.sectionPad]}>Robot Fleet</Text>
                    {robots.map(robot => (
                        <View key={robot._id} style={[S.card, styles.robotCard]}>
                            <View style={S.row}>
                                <Text style={styles.robotName}>{robot.display_name}</Text>
                                <View style={[S.badge, { backgroundColor: statusColor(robot.status) + '22' }]}>
                                    <Text style={{ color: statusColor(robot.status), fontSize: 12, fontWeight: '700' }}>{robot.status}</Text>
                                </View>
                            </View>
                            <Text style={styles.robotSerial}>{robot.robot_serial}</Text>
                        </View>
                    ))}

                    {/* Ready orders */}
                    {readyOrders.length > 0 && (
                        <>
                            <Text style={[S.sectionTitle, styles.sectionPad, { marginTop: 20 }]}>
                                Orders Ready for Delivery ({readyOrders.length})
                            </Text>
                            {readyOrders.map(o => {
                                const tableNum = typeof o.table_id === 'object' ? o.table_id.table_number : '—';
                                return (
                                    <View key={o._id} style={[S.card, styles.robotCard]}>
                                        <Text style={styles.robotName}>Table {tableNum}</Text>
                                        <Text style={styles.robotSerial}>₹{o.total_price.toFixed(2)} · {o._id.slice(-6)}</Text>
                                    </View>
                                );
                            })}
                        </>
                    )}

                    <Text style={[S.sectionTitle, styles.sectionPad, { marginTop: 20 }]}>
                        Active Trips ({deliveries.length})
                    </Text>
                </View>
            }
            data={deliveries}
            keyExtractor={item => item._id}
            renderItem={({ item }) => {
                const robot = typeof item.robot_id === 'object' ? item.robot_id : null;
                return (
                    <View style={[S.card, styles.delivCard]}>
                        <View style={S.row}>
                            <Text style={styles.delivTitle}>{robot?.display_name ?? 'Robot'}</Text>
                            <View style={[S.badge, { backgroundColor: statusColor(item.trip_status) + '22' }]}>
                                <Text style={{ color: statusColor(item.trip_status), fontSize: 11, fontWeight: '700' }}>{item.trip_status}</Text>
                            </View>
                        </View>
                        {item.stops.map((stop, idx) => (
                            <View key={idx} style={styles.stop}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.stopText}>Stop {idx + 1} · {stop.status}</Text>
                                    <Text style={styles.stopSub}>Cabinets: {stop.cabinets.join(', ')}</Text>
                                </View>
                                {stop.status !== 'Delivered' && (
                                    <TouchableOpacity
                                        style={styles.confirmBtn}
                                        onPress={() => handleConfirmStop(item._id, idx)}
                                        activeOpacity={0.8}
                                    >
                                        <Text style={styles.confirmBtnText}>✓ Done</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        ))}
                    </View>
                );
            }}
            ListEmptyComponent={<Text style={styles.empty}>No active delivery trips.</Text>}
        />
    );
}

const styles = StyleSheet.create({
    body: { padding: 16, paddingBottom: 40, gap: 8 },
    header: {
        paddingTop: 40,
        paddingBottom: 12,
        marginBottom: 4,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    title: { fontSize: 26, fontWeight: '800', color: COLORS.text },
    sectionPad: { paddingTop: 4 },
    robotCard: { marginBottom: 0 },
    robotName: { flex: 1, fontSize: 15, fontWeight: '700', color: COLORS.text },
    robotSerial: { fontSize: 12, color: COLORS.textMuted, marginTop: 4 },
    delivCard: { gap: 10 },
    delivTitle: { flex: 1, fontSize: 15, fontWeight: '700', color: COLORS.text },
    stop: {
        ...S.row,
        gap: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
    },
    stopText: { fontSize: 13, color: COLORS.text, fontWeight: '500' },
    stopSub: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
    confirmBtn: {
        backgroundColor: COLORS.accent,
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 8,
    },
    confirmBtnText: { color: '#000', fontWeight: '700', fontSize: 13 },
    empty: { color: COLORS.textMuted, textAlign: 'center', padding: 32 },
});
