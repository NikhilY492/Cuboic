import React, { useState, useEffect } from 'react';
import {
    View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, ActivityIndicator,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { getOrderById, updateOrderStatus, type Order, type OrderStatus } from '../../api/orders';
import { COLORS, S, statusColor } from '../../theme';
import type { RootStackParamList } from '../../navigation/RootNavigator';

const STATUS_FLOW: OrderStatus[] = ['Received', 'Preparing', 'Ready', 'Assigned', 'Delivered'];

type Route = RouteProp<RootStackParamList, 'OrderDetail'>;

export function OrderDetailScreen() {
    const { params } = useRoute<Route>();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        getOrderById(params.orderId)
            .then(setOrder)
            .finally(() => setLoading(false));
    }, [params.orderId]);

    async function advance() {
        if (!order) return;
        const idx = STATUS_FLOW.indexOf(order.order_status);
        if (idx >= STATUS_FLOW.length - 1) return;
        const next = STATUS_FLOW[idx + 1];
        setUpdating(true);
        try {
            const updated = await updateOrderStatus(order._id, next);
            setOrder(updated);
        } catch {
            Alert.alert('Error', 'Failed to update status');
        } finally {
            setUpdating(false);
        }
    }

    if (loading) return <View style={S.screen}><ActivityIndicator style={{ marginTop: 80 }} color={COLORS.accent} size="large" /></View>;
    if (!order) return <View style={S.screen}><Text style={{ color: COLORS.text, margin: 32 }}>Order not found.</Text></View>;

    const tableNum = typeof order.table_id === 'object' ? order.table_id.table_number : '—';
    const color = statusColor(order.order_status);
    const isLast = order.order_status === 'Delivered';

    return (
        <ScrollView style={S.screen} contentContainerStyle={styles.body}>
            {/* Status hero */}
            <View style={styles.hero}>
                <Text style={styles.heroTable}>Table {tableNum}</Text>
                <View style={[S.badge, { backgroundColor: color + '22', alignSelf: 'center' }]}>
                    <Text style={{ color, fontSize: 16, fontWeight: '800' }}>{order.order_status}</Text>
                </View>
                <Text style={styles.heroTotal}>₹{order.total_price.toFixed(2)}</Text>
            </View>

            {/* Items */}
            <View style={S.card}>
                <Text style={S.sectionTitle}>Items</Text>
                {order.items.map((item, i) => (
                    <View key={i} style={[S.row, styles.itemRow]}>
                        <Text style={styles.itemName}>{item.quantity}× {item.name}</Text>
                        <Text style={styles.itemPrice}>₹{(item.unit_price * item.quantity).toFixed(2)}</Text>
                    </View>
                ))}
                <View style={styles.divider} />
                <View style={[S.row, styles.total]}>
                    <Text style={{ color: COLORS.textMuted, fontSize: 13 }}>Total</Text>
                    <Text style={{ color: COLORS.accent, fontWeight: '700', fontSize: 15 }}>₹{order.total_price.toFixed(2)}</Text>
                </View>
            </View>

            {/* Actions */}
            {!isLast && (
                <TouchableOpacity
                    style={[S.btnPrimary, updating && { opacity: 0.6 }, { marginTop: 8 }]}
                    onPress={advance}
                    disabled={updating}
                    activeOpacity={0.8}
                >
                    {updating
                        ? <ActivityIndicator color="#000" />
                        : <Text style={S.btnPrimaryText}>→ Mark as {STATUS_FLOW[STATUS_FLOW.indexOf(order.order_status) + 1]}</Text>
                    }
                </TouchableOpacity>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    body: { padding: 16, gap: 12 },
    hero: {
        ...S.card,
        alignItems: 'center',
        gap: 10,
        paddingVertical: 28,
        backgroundColor: COLORS.surface2,
    },
    heroTable: { fontSize: 14, color: COLORS.textMuted },
    heroTotal: { fontSize: 22, fontWeight: '800', color: COLORS.text },
    itemRow: { justifyContent: 'space-between', paddingVertical: 6 },
    itemName: { fontSize: 14, color: COLORS.text },
    itemPrice: { fontSize: 14, color: COLORS.accent, fontWeight: '600' },
    divider: { height: 1, backgroundColor: COLORS.border, marginVertical: 10 },
    total: { justifyContent: 'space-between' },
});
