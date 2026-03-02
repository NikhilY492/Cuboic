import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { getOrders } from '../../api/orders';
import { getPayments } from '../../api/payments';
import { useAuth } from '../../context/AuthContext';
import { COLORS, S, statusColor } from '../../theme';

export function DashboardScreen() {
    const { user, logout } = useAuth();
    const [stats, setStats] = useState({ orders: 0, revenue: 0, pending: 0, delivered: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user?.restaurant_id) return;
        Promise.all([
            getOrders(user.restaurant_id),
            getPayments(user.restaurant_id),
        ]).then(([orders, payments]) => {
            const revenue = payments.filter(p => p.status === 'Completed').reduce((s, p) => s + p.amount, 0);
            setStats({
                orders: orders.length,
                revenue,
                pending: orders.filter(o => !['Delivered'].includes(o.order_status)).length,
                delivered: orders.filter(o => o.order_status === 'Delivered').length,
            });
        }).finally(() => setLoading(false));
    }, [user?.restaurant_id]);

    const cards = [
        { label: 'Total Orders', value: String(stats.orders), color: COLORS.accent, icon: '🍽️' },
        { label: 'Revenue', value: `₹${stats.revenue.toFixed(0)}`, color: '#22c55e', icon: '💰' },
        { label: 'Active Orders', value: String(stats.pending), color: '#a78bfa', icon: '⏳' },
        { label: 'Delivered', value: String(stats.delivered), color: '#38bdf8', icon: '✅' },
    ];

    return (
        <ScrollView style={S.screen} contentContainerStyle={styles.body}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Good day, {user?.name?.split(' ')[0]} 👋</Text>
                    <Text style={styles.role}>Owner Dashboard</Text>
                </View>
                <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
                    <Text style={styles.logoutText}>Sign out</Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <ActivityIndicator color={COLORS.accent} size="large" style={{ marginTop: 60 }} />
            ) : (
                <View style={styles.grid}>
                    {cards.map(card => (
                        <View key={card.label} style={[styles.statCard, { borderColor: card.color + '44' }]}>
                            <Text style={styles.statIcon}>{card.icon}</Text>
                            <Text style={[styles.statValue, { color: card.color }]}>{card.value}</Text>
                            <Text style={styles.statLabel}>{card.label}</Text>
                        </View>
                    ))}
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    body: { padding: 16, paddingBottom: 40 },
    header: {
        ...S.row,
        justifyContent: 'space-between',
        paddingTop: 40,
        paddingBottom: 24,
    },
    greeting: { fontSize: 22, fontWeight: '800', color: COLORS.text },
    role: { fontSize: 13, color: COLORS.textMuted, marginTop: 2 },
    logoutBtn: {
        backgroundColor: COLORS.surface2,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    logoutText: { color: COLORS.textMuted, fontSize: 13, fontWeight: '600' },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    statCard: {
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        borderWidth: 1,
        padding: 20,
        width: '47%',
        alignItems: 'center',
        gap: 6,
    },
    statIcon: { fontSize: 28 },
    statValue: { fontSize: 28, fontWeight: '800' },
    statLabel: { fontSize: 12, color: COLORS.textMuted, textAlign: 'center' },
});
