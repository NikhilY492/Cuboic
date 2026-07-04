import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { auditApi, type AuditLog } from '../../api/audit';
import { usersApi, type User } from '../../api/users';
import { S, FONT } from '../../theme';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function AuditsScreen() {
    const { user } = useAuth();
    const { colors, isDark } = useTheme();
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    
    const isOwnerOrManager = user?.role === 'Owner' || user?.role === 'Manager';

    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [users, setUsers] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadData = useCallback(async () => {
        if (!user?.restaurantId) return;
        try {
            const [logsData, usersData] = await Promise.all([
                auditApi.findAll(user.restaurantId),
                usersApi.findAll(user.restaurantId).catch(() => [] as User[])
            ]);
            setLogs(logsData);

            const userMap: Record<string, string> = {};
            usersData.forEach(u => {
                userMap[u.id] = u.name;
            });
            setUsers(userMap);
        } catch (err) {
            console.error('Failed to load audits', err);
        }
    }, [user?.restaurantId]);

    useEffect(() => {
        if (!isOwnerOrManager) {
            navigation.goBack();
            return;
        }
        loadData().finally(() => setLoading(false));
    }, [loadData, isOwnerOrManager, navigation]);

    const handleRefresh = async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    };

    const renderItem = ({ item }: { item: AuditLog }) => {
        const userName = users[item.userId] || item.userId;
        const date = new Date(item.createdAt);
        
        return (
            <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={styles.cardHeader}>
                    <Text style={[styles.actionText, { color: colors.text }]}>{item.action}</Text>
                    <Text style={[styles.timeText, { color: colors.textDim }]}>
                        {date.toLocaleDateString()} {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                </View>
                <View style={styles.cardBody}>
                    <Text style={[styles.userText, { color: colors.textMuted }]}>
                        <Feather name="user" size={14} /> {userName}
                    </Text>
                </View>
                {item.details && Object.keys(item.details).length > 0 && (
                    <View style={[styles.detailsBox, { backgroundColor: colors.surface2 }]}>
                        <Text style={[styles.detailsText, { color: colors.text }]}>
                            {JSON.stringify(item.details, null, 2)}
                        </Text>
                    </View>
                )}
            </View>
        );
    };

    if (loading) return (
        <View style={[S.screen, { backgroundColor: colors.bg }]}>
            <ActivityIndicator color={colors.accent} size="large" style={{ marginTop: 80 }} />
        </View>
    );

    return (
        <View style={[S.screen, { backgroundColor: colors.bg }]}>
            <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border, paddingTop: Math.max(insets.top, 16) }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backBtn, { backgroundColor: colors.surface2 }]}>
                        <Feather name="arrow-left" size={20} color={colors.text} />
                    </TouchableOpacity>
                    <View>
                        <Text style={[styles.title, { color: colors.text }]}>Audit Logs</Text>
                        <Text style={[styles.sub, { color: colors.textMuted }]}>Monitor system activity</Text>
                    </View>
                </View>
            </View>

            <FlatList
                data={logs}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
                renderItem={renderItem}
                onRefresh={handleRefresh}
                refreshing={refreshing}
                ListEmptyComponent={() => (
                    <View style={styles.emptyBox}>
                        <Feather name="activity" size={48} color={colors.border} style={{ marginBottom: 16 }} />
                        <Text style={[styles.emptyText, { color: colors.textDim }]}>No activity recorded yet.</Text>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        paddingHorizontal: 16, paddingBottom: 16, borderBottomWidth: 1,
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end'
    },
    backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
    title: { fontSize: 24, ...FONT.bold },
    sub: { fontSize: 13, ...FONT.medium, marginTop: 2 },
    list: { padding: 16, gap: 12 },
    card: {
        padding: 16, borderRadius: 16, borderWidth: 1,
    },
    cardHeader: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8
    },
    actionText: { fontSize: 15, ...FONT.bold, flex: 1, paddingRight: 8 },
    timeText: { fontSize: 12, ...FONT.medium },
    cardBody: {
        marginBottom: 8
    },
    userText: { fontSize: 13, ...FONT.medium },
    detailsBox: {
        padding: 12, borderRadius: 8, marginTop: 4
    },
    detailsText: { fontSize: 12, fontFamily: 'monospace' },
    emptyBox: { alignItems: 'center', justifyContent: 'center', padding: 40, marginTop: 40 },
    emptyText: { fontSize: 15, ...FONT.medium }
});
