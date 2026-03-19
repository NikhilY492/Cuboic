import React, { useState, useEffect, useCallback } from 'react';
import {
    View, Text, ScrollView, TouchableOpacity, StyleSheet,
    RefreshControl, ActivityIndicator, Dimensions, Alert
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ordersApi, type Order } from '../../api/orders';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../hooks/useSocket';
import * as Speech from 'expo-speech';
import { COLORS, S, statusColor } from '../../theme';

function getHeaderTextColor(status: string) {
    return COLORS.text;
}

function getTableNum(order: Order): string {
    let num = '';
    if (order.table?.table_number !== undefined) {
        num = String(order.table.table_number);
    } else {
        num = typeof order.tableId === 'string' ? order.tableId.slice(-4) : 'TAKE';
    }
    return num.startsWith('T') ? num.substring(1) : num;
}

const NEXT_STATUS: Record<string, string> = {
    Pending: 'Confirmed',
    Confirmed: 'Ready',
    Ready: 'Delivered',
};

// ─── Order Card Component ───────────────────────────────────────────────────

function KanbanCard({ item, onAdvance }: { item: Order, onAdvance: (o: Order) => void }) {
    const indicatorColor = statusColor(item.status);
    const headerText = COLORS.text;
    const tableNum = getTableNum(item);
    
    // Elapsed time calculation
    const elapsedMinutes = Math.floor((new Date().getTime() - new Date(item.createdAt).getTime()) / 60000);
    const timeDisplay = elapsedMinutes > 0 ? `${elapsedMinutes} Min` : 'Just now';

    // Format date "17 Nov, 01:30 PM"
    const dateObj = new Date(item.createdAt);
    const dateFormatted = dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    const timeFormatted = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const isTerminal = ['Delivered', 'Cancelled'].includes(item.status);
    
    const nextState = NEXT_STATUS[item.status];
    let btnColor = nextState ? statusColor(nextState) : COLORS.border;
    
    // Override the grey color for "Mark Delivered" to make it highly visible
    if (nextState === 'Delivered') {
        btnColor = COLORS.purple;
    }

    return (
        <View style={[styles.card, { borderTopWidth: 4, borderTopColor: indicatorColor }]}>
            {/* Header Area */}
            <View style={styles.cardHeader}>
                <View style={styles.headerRow}>
                    <Text style={[styles.headerOrderId, { color: COLORS.text }]}>Order # {item.id.slice(-5).toUpperCase()}</Text>
                    <Text style={[styles.headerElapsed, { color: COLORS.text }]}>{timeDisplay}</Text>
                </View>
                <Text style={[styles.headerDateTime, { color: COLORS.textDim }]}>{dateFormatted}, {timeFormatted}</Text>
            </View>

            <View style={styles.cardBody}>
                {/* Status & Table */}
                <View style={styles.subHeader}>
                    <View style={styles.statusWrap}>
                        <View style={[styles.statusDot, { backgroundColor: indicatorColor }]} />
                        <Text style={[styles.statusText, { color: indicatorColor }]}>
                            {item.status === 'Pending' ? 'Open' : item.status}
                        </Text>
                    </View>
                    <Text style={styles.tableText}>Table - {tableNum}</Text>
                </View>
                
                {/* Items List */}
                <View style={styles.itemsContainer}>
                    {item.items.map((it, i) => (
                        <View key={i} style={styles.itemRowBlock}>
                            <View style={styles.itemRow}>
                                <Text style={styles.itemName}>
                                    <Text style={{fontWeight: '700', color: COLORS.text}}>{it.quantity}x</Text> <Text style={{color: COLORS.textMuted}}>{it.name}</Text>
                                </Text>
                                {/* Simple Checkmark logic based on global order status for mock purposes */}
                                <Feather 
                                    name={isTerminal || item.status === 'Ready' ? "check-circle" : "circle"} 
                                    size={16} 
                                    color={isTerminal || item.status === 'Ready' ? COLORS.green : COLORS.border} 
                                />
                            </View>
                        </View>
                    ))}
                </View>

                {/* Finish Button */}
                <TouchableOpacity 
                    style={[
                        styles.finishBtn, 
                        isTerminal && styles.finishBtnDisabled,
                        !isTerminal && { borderColor: btnColor }
                    ]} 
                    disabled={isTerminal}
                    onPress={() => onAdvance(item)}
                    activeOpacity={0.8}
                >
                    <Text style={[
                        styles.finishBtnText, 
                        isTerminal && styles.finishBtnTextDisabled,
                        !isTerminal && { color: btnColor }
                    ]}>
                        {isTerminal ? 'Finished' : (nextState ? `Mark ${nextState}` : 'Finish')}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

// ─── Main Screen Component ──────────────────────────────────────────────────

export function KanbanOrdersScreen() {
    const { user } = useAuth();
    const restaurantId = user?.restaurantId ?? '';

    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [preferredVoice, setPreferredVoice] = useState<string | undefined>(undefined);

    useEffect(() => {
        const initVoices = async () => {
            try {
                const voices = await Speech.getAvailableVoicesAsync();
                const inVoice = voices.find(v => v.language.startsWith('en-IN'))?.identifier;
                const enVoice = voices.find(v => v.language.startsWith('en-'))?.identifier;
                setPreferredVoice(inVoice || enVoice);
            } catch (err) {
                console.error('[DEBUG] Error fetching voices:', err);
            }
        };
        initVoices();
    }, []);

    const loadOrders = useCallback(async () => {
        if (!restaurantId) return;
        try {
            const data = await ordersApi.findAll(restaurantId);
            // Sort by most recent first
            data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            setOrders(data);
        } catch { /* Ignore */ }
    }, [restaurantId]);

    useEffect(() => { loadOrders().finally(() => setLoading(false)); }, [loadOrders]);

    // Poll every 2 seconds
    useEffect(() => {
        const interval = setInterval(loadOrders, 2000);
        return () => clearInterval(interval);
    }, [loadOrders]);

    useSocket(restaurantId, {
        'order:new': async (newOrder: Order) => {
            loadOrders();
            const tableNum = getTableNum(newOrder);
            const itemsList = newOrder.items
                .map(it => `${it.quantity} ${it.name}`)
                .join(', ');
            const message = `New order for Table ${tableNum}. Items: ${itemsList}.`;
            Speech.stop();
            Speech.speak(message, { 
                voice: preferredVoice,
                rate: 0.85,
                pitch: 1.0
            });
        },
        'order:updated': () => loadOrders(),
    });

    const handleAdvance = async (order: Order) => {
        let next = NEXT_STATUS[order.status];
        if (!next) return;
        try {
            await ordersApi.updateStatus(order.id, next);
            loadOrders();
        } catch { Alert.alert('Error', 'Failed to update order'); }
    };

    if (loading) {
        return <View style={S.screen}><ActivityIndicator style={{ marginTop: 80 }} color={COLORS.accent} size="large" /></View>;
    }

    const onRefresh = async () => {
        setRefreshing(true);
        await loadOrders();
        setRefreshing(false);
    };

    // Calculate active/completed counts for header
    const activeTableKeys = new Set(orders.filter(o => !['Delivered', 'Cancelled'].includes(o.status)).map(o => getTableNum(o)));
    const activeTableCount = activeTableKeys.size;
    const tableKeys = new Set(orders.map(o => getTableNum(o)));

    return (
        <View style={[S.screen, { maxWidth: '100%' }]}>
            {/* Standard App Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>Orders</Text>
                    <Text style={styles.sub}>
                        {activeTableCount} active table{activeTableCount !== 1 ? 's' : ''} · {tableKeys.size} total
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={() => Speech.speak("Test voice message", { voice: preferredVoice, rate: 0.85 })}
                    style={{ padding: 8, backgroundColor: COLORS.surface2, borderRadius: 8 }}
                >
                    <Feather name="volume-2" size={20} color={COLORS.accent} />
                </TouchableOpacity>
            </View>

            <ScrollView 
                contentContainerStyle={styles.gridContainer}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                <View style={styles.grid}>
                    {orders.map(order => (
                        <View key={order.id} style={styles.cardWrapper}>
                            <KanbanCard item={order} onAdvance={handleAdvance} />
                        </View>
                    ))}
                </View>
                {orders.length === 0 && (
                    <Text style={styles.emptyText}>No orders right now.</Text>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        padding: 16,
        paddingTop: 48,
        backgroundColor: COLORS.surface,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 10,
    },
    title: { fontSize: 24, fontWeight: '800', color: COLORS.text },
    sub: { fontSize: 13, color: COLORS.textMuted, marginTop: 2 },
    
    gridContainer: {
        padding: 16,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        marginHorizontal: -8,
    },
    cardWrapper: {
        width: '100%',
        padding: 8,
        // Responsive breakpoints: On tablets, this will be handled via a custom hook or just statically via flex if we had a pure grid system.
        // For a true "responsive" flex item, we can use minWidth and flexGrow, or explicitly calculate width.
        // We'll use a responsive flex base.
        flexBasis: 320,
        flexGrow: 1,
        maxWidth: 450,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 60,
        color: COLORS.textMuted,
    },

    // Card Styles
    card: {
        backgroundColor: COLORS.surface,
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    cardHeader: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        paddingBottom: 12,
        backgroundColor: COLORS.surface2,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    headerOrderId: { fontSize: 14, fontWeight: '700' },
    headerElapsed: { fontSize: 12, fontWeight: '700' },
    headerDateTime: { fontSize: 12, opacity: 0.8 },
    
    cardBody: {
        padding: 16,
        backgroundColor: COLORS.surface,
    },
    subHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        marginBottom: 12,
    },
    statusWrap: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    statusDot: { width: 8, height: 8, borderRadius: 4 },
    statusText: { fontSize: 13, fontWeight: '700' },
    tableText: { fontSize: 13, fontWeight: '600', color: '#9ca3af' },

    itemsContainer: {
        marginBottom: 20,
    },
    itemRowBlock: {
        marginBottom: 12,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 6,
    },
    itemName: { fontSize: 14, color: '#111827', flex: 1, paddingRight: 10 },
    itemVariant: {
        fontSize: 12,
        color: '#9ca3af',
        marginLeft: 20, // indent
    },
    finishBtn: {
        backgroundColor: COLORS.surface2,
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.accent,
    },
    finishBtnDisabled: {
        backgroundColor: COLORS.surface2,
        borderColor: COLORS.border,
    },
    finishBtnText: {
        color: COLORS.accent,
        fontSize: 14,
        fontWeight: '700',
    },
    finishBtnTextDisabled: {
        color: COLORS.textDim,
    }
});
