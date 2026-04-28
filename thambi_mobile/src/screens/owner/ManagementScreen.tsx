import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { S } from '../../theme';
import { restaurantsApi, Restaurant } from '../../api/restaurants';

export function ManagementScreen({ navigation }: any) {
    const { user } = useAuth();
    const { colors } = useTheme();
    const isOwner = user?.role === 'Owner';
    const restaurantId = user?.restaurantId ?? '';

    const [restaurantData, setRestaurantData] = useState<Restaurant | null>(null);

    useEffect(() => {
        if (!restaurantId || !isOwner) return;
        restaurantsApi.findById(restaurantId)
            .then(res => setRestaurantData(res))
            .catch(() => {});
    }, [restaurantId, isOwner]);

    const handleToggleStrategy = async () => {
        if (!restaurantData) return;
        const newStrategy = restaurantData.paymentStrategy === 'PayPerOrder' ? 'PayAtEnd' : 'PayPerOrder';
        try {
            await restaurantsApi.update(restaurantId, { paymentStrategy: newStrategy });
            setRestaurantData({ ...restaurantData, paymentStrategy: newStrategy });
            Alert.alert('Success', `Payment workflow updated to ${newStrategy === 'PayPerOrder' ? 'Pay per order' : 'Pay at end'}`);
        } catch (err) {
            Alert.alert('Error', 'Failed to update payment workflow');
        }
    };

    const config = user?.dashboard_config || [];
    const canManageStaff = isOwner || config.includes('ManageStaff');
    const canManageTables = isOwner || config.includes('ManageTables');
    const canViewPayments = isOwner || config.includes('ViewPayments');

    const options = [
        { name: 'Menu', icon: 'book-open', screen: 'Menu', color: '#60a5fa', desc: 'Manage categories and items' },
        ...(canManageStaff ? [{ name: 'Staff', icon: 'users', screen: 'Staff', color: '#c084fc', desc: 'Manage your restaurant team' }] : []),
        ...(canManageTables ? [{ name: 'Tables', icon: 'grid', screen: 'Tables', color: '#fbbf24', desc: 'Configure dining areas' }] : []),
        ...(canViewPayments ? [{ name: 'Payments', icon: 'credit-card', screen: 'Payments', color: '#4ade80', desc: 'View transaction history' }] : []),
    ];

    return (
        <View style={[S.screen, { backgroundColor: colors.bg }]}>
            <ScrollView contentContainerStyle={styles.body}>
                <View style={styles.header}>
                    <Text style={[styles.title, { color: colors.text }]}>Management</Text>
                    <Text style={[styles.subtitle, { color: colors.textMuted }]}>Configure and oversee operations</Text>
                </View>

                <View style={styles.grid}>
                    {options.map((opt) => (
                        <TouchableOpacity
                            key={opt.name}
                            style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
                            onPress={() => navigation.navigate(opt.screen)}
                            activeOpacity={0.7}
                        >
                            <View style={[styles.iconContainer, { backgroundColor: opt.color + '15' }]}>
                                <Feather name={opt.icon as any} size={24} color={opt.color} />
                            </View>
                            <View style={styles.cardInfo}>
                                <Text style={[styles.cardText, { color: colors.text }]}>{opt.name}</Text>
                                <Text style={[styles.cardDesc, { color: colors.textMuted }]}>{opt.desc}</Text>
                            </View>
                            <Feather name="chevron-right" size={20} color={colors.textDim} />
                        </TouchableOpacity>
                    ))}
                </View>

                {isOwner && restaurantData && (
                    <View style={[styles.section, { padding: 16, borderRadius: 20, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, marginTop: 24 }]}>
                        <Text style={{ fontSize: 16, fontWeight: '700', color: colors.accent, marginBottom: 12 }}>System Configuration</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <View style={{ flex: 1, paddingRight: 16 }}>
                                <Text style={{ fontWeight: '600', marginBottom: 4, color: colors.text, fontSize: 14 }}>Payment Workflow</Text>
                                <Text style={{ fontSize: 12, color: colors.textDim }}>
                                    {restaurantData.paymentStrategy === 'PayPerOrder' 
                                        ? 'Customers pay for each order immediately.' 
                                        : 'Customers aggregate orders and pay at the end.'}
                                </Text>
                            </View>
                            <TouchableOpacity 
                                style={{ 
                                    paddingVertical: 8, 
                                    paddingHorizontal: 12, 
                                    borderRadius: 8, 
                                    borderWidth: 1, 
                                    borderColor: restaurantData.paymentStrategy === 'PayAtEnd' ? colors.accent : colors.border 
                                }}
                                onPress={handleToggleStrategy}
                            >
                                <Text style={{ 
                                    fontSize: 12, 
                                    fontWeight: '600', 
                                    color: restaurantData.paymentStrategy === 'PayAtEnd' ? colors.accent : colors.textDim 
                                }}>
                                    {restaurantData.paymentStrategy === 'PayPerOrder' ? 'Switch to Pay at End' : 'Switch to Pay per Order'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    body: { padding: 16, paddingTop: 60 },
    header: {
        marginBottom: 32, paddingHorizontal: 4 },
    title: { fontSize: 28, fontWeight: '800' },
    subtitle: { fontSize: 15, marginTop: 4 },
    section: { marginBottom: 24 },
    grid: { gap: 12 },
    card: {
        ...S.shadow,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 20,
        borderWidth: 1,





    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    cardInfo: {
        flex: 1 },
    cardText: { fontSize: 17, fontWeight: '700' },
    cardDesc: {
        fontSize: 13, marginTop: 2 },
});
