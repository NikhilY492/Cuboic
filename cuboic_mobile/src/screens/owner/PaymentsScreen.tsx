import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { getPayments, type Payment } from '../../api/payments';
import { useAuth } from '../../context/AuthContext';
import { COLORS, S, statusColor } from '../../theme';

export function PaymentsScreen() {
    const { user } = useAuth();
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const load = async () => {
        if (!user?.restaurant_id) return;
        const data = await getPayments(user.restaurant_id);
        setPayments(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    };

    useEffect(() => { load().finally(() => setLoading(false)); }, []);

    const total = payments.filter(p => p.status === 'Completed').reduce((s, p) => s + p.amount, 0);

    return (
        <View style={S.screen}>
            <View style={styles.header}>
                <Text style={styles.title}>Payments</Text>
                <Text style={styles.totalLabel}>Collected  <Text style={{ color: COLORS.accent }}>₹{total.toFixed(2)}</Text></Text>
            </View>

            {loading ? (
                <ActivityIndicator color={COLORS.accent} style={{ marginTop: 60 }} size="large" />
            ) : (
                <FlatList
                    data={payments}
                    keyExtractor={item => item._id}
                    contentContainerStyle={styles.list}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await load(); setRefreshing(false); }} tintColor={COLORS.accent} />}
                    renderItem={({ item }) => {
                        const color = statusColor(item.status);
                        return (
                            <View style={S.card}>
                                <View style={S.row}>
                                    <Text style={styles.amount}>₹{item.amount.toFixed(2)}</Text>
                                    <View style={[S.badge, { backgroundColor: color + '22' }]}>
                                        <Text style={{ color, fontSize: 12, fontWeight: '700' }}>{item.status}</Text>
                                    </View>
                                </View>
                                <Text style={styles.method}>{item.method}  ·  {new Date(item.createdAt).toLocaleDateString()}</Text>
                            </View>
                        );
                    }}
                    ListEmptyComponent={<Text style={{ color: COLORS.textMuted, textAlign: 'center', marginTop: 60 }}>No payments yet.</Text>}
                />
            )}
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
    totalLabel: { fontSize: 14, color: COLORS.textMuted, marginTop: 4 },
    list: { padding: 16, gap: 10 },
    amount: { flex: 1, fontSize: 18, fontWeight: '800', color: COLORS.text },
    method: { fontSize: 12, color: COLORS.textMuted, marginTop: 6 },
});
