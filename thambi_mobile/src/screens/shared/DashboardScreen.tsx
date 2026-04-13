import React, { useState, useEffect, useCallback } from 'react';
import {
    View, Text, ScrollView, StyleSheet, ActivityIndicator,
    TouchableOpacity, RefreshControl, Alert, TextInput,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { ordersApi } from '../../api/orders';
import { paymentsApi } from '../../api/payments';
import { deliveriesApi, robotsApi } from '../../api/deliveries';
import { useSocket } from '../../hooks/useSocket';
import { KpiCard } from '../../components/KpiCard';
import { useTheme } from '../../context/ThemeContext';
import { S } from '../../theme';
import { useNavigation } from '@react-navigation/native';

export function DashboardScreen() {
    const { user } = useAuth();
    const { colors } = useTheme();
    const navigation = useNavigation<any>();
    const restaurantId = user?.restaurantId ?? '';

    const [summary, setSummary] = useState({ order_count: 0, total_revenue: 0 });
    const [orderSummary, setOrderSummary] = useState({ pending: 0, preparing: 0, completed: 0 });
    const [activeDeliveries, setActiveDeliveries] = useState(0);
    const [robotsOnline, setRobotsOnline] = useState(0);
    const [unpaidGroups, setUnpaidGroups] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Dynamic styles
    const thematicStyles = {
        screen: { backgroundColor: colors.bg },
        greeting: { color: colors.textMuted },
        restaurantName: { color: colors.text },
        role: { color: colors.textDim },
        hint: { color: colors.textDim }
    };

    const config = user?.dashboard_config || (user?.role === 'Owner' ? ['Revenue', 'Orders', 'Pending', 'Preparing', 'Completed', 'Robots'] : ['Pending', 'Preparing', 'Completed', 'Robots']);

    const load = useCallback(async () => {
        if (!restaurantId) return;

        if (config.includes('Revenue') || config.includes('Orders')) {
            try {
                const s = await paymentsApi.getSummary(restaurantId);
                setSummary(s);
            } catch { /* ignore */ }
        }

        try {
            const [deliveries, robots, orderSum, unpaidRes] = await Promise.all([
                deliveriesApi.findActive(restaurantId),
                robotsApi.findAll(restaurantId),
                ordersApi.getSummary(restaurantId),
                ordersApi.getUnpaidGroups(restaurantId),
            ]);
            setActiveDeliveries(deliveries.length);
            setRobotsOnline(robots.filter(r => r.isOnline).length);
            setOrderSummary(orderSum);
            setUnpaidGroups(unpaidRes);
        } catch { /* ignore */ }
    }, [restaurantId, config]);

    useEffect(() => {
        load().finally(() => setLoading(false));
    }, [load]);

    // Poll every 1 second
    useEffect(() => {
        const interval = setInterval(load, 1000);
        return () => clearInterval(interval);
    }, [load]);

    useSocket(restaurantId, {
        'order:new': () => load(),
        'order:updated': () => load(),
        'order:status': () => load(),
        'delivery:started': () => load(),
        'delivery:updated': () => load(),
    });

    const handleDrillDown = (status: string) => {
        navigation.navigate('Orders', { statusInitial: status });
    };

    const handleSettleAll = async (group: any) => {
        Alert.alert(
            'Settle All Orders',
            `Are you sure you want to mark all ${group.count} orders for Table ${group.table?.table_number ?? 'Unknown'} as Paid? Total: ₹${group.total.toFixed(2)}`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Confirm',
                    onPress: async () => {
                        try {
                            await ordersApi.markPaidBulk(restaurantId, group.orderIds);
                            load();
                            Alert.alert('Success', 'Orders marked as paid.');
                        } catch (err) {
                            Alert.alert('Error', 'Failed to settle orders.');
                        }
                    }
                }
            ]
        );
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await load();
        setRefreshing(false);
    };

    const allKpis = [
        { 
            id: 'Revenue',
            icon: <Feather name="dollar-sign" size={24} color={colors.green} />, 
            value: `₹${summary.total_revenue.toFixed(0)}`, 
            label: "Today's Revenue", 
            sub: 'Total gross revenue today', 
            color: colors.green,
            fullWidth: true 
        },
        { 
            id: 'Orders',
            icon: <Feather name="hash" size={24} color={colors.blue} />, 
            value: summary.order_count, 
            label: "Today's Orders", 
            sub: 'Total orders processed', 
            color: colors.blue,
            fullWidth: true 
        },
        { 
            id: 'Pending',
            icon: <Feather name="alert-circle" size={24} color={colors.amber} />, 
            value: orderSummary.pending, 
            label: 'Pending Orders', 
            sub: 'Requires attention', 
            color: colors.amber,
            onPress: () => handleDrillDown('Pending')
        },
        { 
            id: 'Preparing',
            icon: <Feather name="coffee" size={24} color={colors.purple} />, 
            value: orderSummary.preparing, 
            label: 'Preparing', 
            sub: 'Being cooked', 
            color: colors.purple,
            onPress: () => handleDrillDown('Confirmed')
        },
        { 
            id: 'Completed',
            icon: <Feather name="check-circle" size={24} color={colors.accent} />, 
            value: orderSummary.completed, 
            label: 'Completed', 
            sub: 'Ready / Delivered', 
            color: colors.accent,
            onPress: () => handleDrillDown('Ready')
        },
        { 
            id: 'Robots',
            icon: <Feather name="cpu" size={24} color={colors.blue} />, 
            value: robotsOnline, 
            label: 'Robots', 
            sub: 'Online now', 
            color: colors.blue 
        },
    ];

    const kpis = allKpis.filter(k => config.includes(k.id));

    return (
        <ScrollView
            style={thematicStyles.screen}
            contentContainerStyle={styles.body}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />}
        >
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={[styles.greeting, thematicStyles.greeting]}>Welcome back,</Text>
                    <Text style={[styles.restaurantName, thematicStyles.restaurantName]}>{user?.name || 'Administrator'}</Text>
                    <Text style={[styles.role, thematicStyles.role]}>{user?.role} Overview</Text>
                </View>
            </View>

            {loading ? (
                <ActivityIndicator color={colors.accent} size="large" style={{ marginTop: 40 }} />
            ) : (
                <View style={styles.grid}>
                    {kpis.map(k => (
                        <KpiCard
                            key={k.label}
                            icon={k.icon}
                            value={k.value}
                            label={k.label}
                            sub={k.sub}
                            accentColor={k.color}
                            fullWidth={(k as any).fullWidth}
                            onPress={(k as any).onPress}
                        />
                    ))}
                </View>
            )}

            {unpaidGroups.length > 0 && (
                <View style={[styles.section, { marginTop: 8 }]}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 0 }]}>Unreconciled Sessions</Text>
                        <View style={[styles.searchBox, { backgroundColor: colors.surface2, borderColor: colors.border }]}>
                            <Feather name="search" size={14} color={colors.textDim} />
                            <TextInput
                                style={[styles.searchInput, { color: colors.text }]}
                                placeholder="Search Table / Phone"
                                placeholderTextColor={colors.textDim}
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                            />
                        </View>
                    </View>
                    {unpaidGroups
                        .filter(g => {
                            if (!searchQuery) return true;
                            const q = searchQuery.toLowerCase();
                            const tableNum = String(g.table?.table_number || '').toLowerCase();
                            const phone = String(g.customer?.phone || '').toLowerCase();
                            const name = String(g.customer?.name || '').toLowerCase();
                            return tableNum.includes(q) || phone.includes(q) || name.includes(q);
                        })
                        .map((group) => (
                        <View key={group.sessionId} style={[styles.unpaidCard, { backgroundColor: colors.surface, borderColor: colors.amber + '40' }]}>
                            <View style={styles.unpaidInfo}>
                                <Text style={[styles.unpaidTable, { color: colors.text }]}>Table {group.table?.table_number ?? '?'}</Text>
                                <Text style={[styles.unpaidCustomer, { color: colors.textDim }]}>
                                    {group.customer?.name || 'Guest'} • {group.count} orders
                                </Text>
                            </View>
                            <View style={{ alignItems: 'flex-end', marginRight: 12 }}>
                                <Text style={[styles.unpaidAmount, { color: colors.amber }]}>₹{group.total.toFixed(2)}</Text>
                            </View>
                            <TouchableOpacity 
                                style={[styles.settleBtn, { backgroundColor: colors.amber }]}
                                onPress={() => handleSettleAll(group)}
                            >
                                <Text style={styles.settleBtnText}>Settle All</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                    {unpaidGroups.filter(g => {
                        const q = searchQuery.toLowerCase();
                        return String(g.table?.table_number || '').toLowerCase().includes(q) || 
                               String(g.customer?.phone || '').toLowerCase().includes(q) || 
                               String(g.customer?.name || '').toLowerCase().includes(q);
                    }).length === 0 && (
                        <Text style={{ textAlign: 'center', color: colors.textDim, paddingVertical: 20 }}>
                            No sessions match "{searchQuery}"
                        </Text>
                    )}
                </View>
            )}

            <Text style={[styles.hint, thematicStyles.hint]}>
                Real-time updates active — pull to refresh manually
            </Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    body: { padding: 16, paddingBottom: 40 },
    header: {
        ...S.shadow,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 48,
        paddingBottom: 24,
    },
    greeting: { fontSize: 16, fontWeight: '600' },
    restaurantName: { fontSize: 26, fontWeight: '800', marginTop: 4 },
    role: { fontSize: 13, marginTop: 4, textTransform: 'uppercase', letterSpacing: 1 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 24 },
    hint: {
        textAlign: 'center',
        fontSize: 12,
        paddingHorizontal: 16,
    },
    section: { marginBottom: 24 },
    sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 16 },
    unpaidCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        marginBottom: 10,
        ...S.shadow
    },
    unpaidInfo: { flex: 1 },
    unpaidTable: { fontSize: 16, fontWeight: '700' },
    unpaidCustomer: { fontSize: 12, marginTop: 2 },
    unpaidAmount: { fontSize: 18, fontWeight: '800' },
    settleBtn: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    settleBtnText: { color: '#000', fontWeight: '700', fontSize: 13 },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        height: 32,
        borderRadius: 8,
        borderWidth: 1,
        width: 160,
    },
    searchInput: {
        flex: 1,
        fontSize: 11,
        marginLeft: 6,
        padding: 0,
    },
});
