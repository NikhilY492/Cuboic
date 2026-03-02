import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { getRobots, type Robot } from '../../api/deliveries';
import { useAuth } from '../../context/AuthContext';
import { COLORS, S, statusColor } from '../../theme';

export function RobotsScreen() {
    const { user } = useAuth();
    const [robots, setRobots] = useState<Robot[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const load = async () => {
        if (!user?.restaurant_id) return;
        setRobots(await getRobots(user.restaurant_id));
    };

    useEffect(() => { load().finally(() => setLoading(false)); }, []);

    return (
        <View style={S.screen}>
            <View style={styles.header}>
                <Text style={styles.title}>Robot Fleet</Text>
            </View>

            {loading ? (
                <ActivityIndicator color={COLORS.accent} style={{ marginTop: 60 }} size="large" />
            ) : (
                <FlatList
                    data={robots}
                    keyExtractor={item => item._id}
                    contentContainerStyle={styles.list}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await load(); setRefreshing(false); }} tintColor={COLORS.accent} />}
                    renderItem={({ item }) => {
                        const color = statusColor(item.status);
                        const available = item.cabinets.filter(c => c.status === 'Available').length;
                        const occupied = item.cabinets.filter(c => c.status === 'Occupied').length;
                        return (
                            <View style={S.card}>
                                <View style={[S.row, { marginBottom: 8 }]}>
                                    <Text style={styles.name}>{item.display_name}</Text>
                                    <View style={[S.badge, { backgroundColor: color + '22' }]}>
                                        <Text style={{ color, fontWeight: '700', fontSize: 13 }}>{item.status}</Text>
                                    </View>
                                </View>
                                <Text style={styles.serial}>{item.robot_serial}</Text>
                                <View style={[S.row, styles.cabinets]}>
                                    <Text style={[styles.cabinetStat, { color: COLORS.green }]}>🟢 {available} free</Text>
                                    <Text style={[styles.cabinetStat, { color: COLORS.accent }]}>🟠 {occupied} occupied</Text>
                                </View>
                            </View>
                        );
                    }}
                    ListEmptyComponent={<Text style={{ color: COLORS.textMuted, textAlign: 'center', marginTop: 60 }}>No robots found.</Text>}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        padding: 20, paddingTop: 56,
        backgroundColor: COLORS.surface,
        borderBottomWidth: 1, borderBottomColor: COLORS.border,
    },
    title: { fontSize: 26, fontWeight: '800', color: COLORS.text },
    list: { padding: 16, gap: 10 },
    name: { flex: 1, fontSize: 17, fontWeight: '700', color: COLORS.text },
    serial: { fontSize: 12, color: COLORS.textMuted },
    cabinets: { marginTop: 12, gap: 16 },
    cabinetStat: { fontSize: 13, fontWeight: '600' },
});
