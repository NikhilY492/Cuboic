import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { OrdersScreen } from '../screens/staff/OrdersScreen';
import { OrderDetailScreen } from '../screens/staff/OrderDetailScreen';
import { CreateDeliveryScreen } from '../screens/staff/CreateDeliveryScreen';
import { DashboardScreen } from '../screens/owner/DashboardScreen';
import { PaymentsScreen } from '../screens/owner/PaymentsScreen';
import { RobotsScreen } from '../screens/owner/RobotsScreen';
import { COLORS } from '../theme';

export type RootStackParamList = {
    Login: undefined;
    Main: undefined;
    OrderDetail: { orderId: string };
    CreateDelivery: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

type StaffTabParamList = { Orders: undefined; Deliveries: undefined };
type OwnerTabParamList = { Dashboard: undefined; Payments: undefined; Robots: undefined };

const StaffTab = createBottomTabNavigator<StaffTabParamList>();
const OwnerTab = createBottomTabNavigator<OwnerTabParamList>();

function StaffTabs() {
    return (
        <StaffTab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: { backgroundColor: COLORS.surface, borderTopColor: COLORS.border },
                tabBarActiveTintColor: COLORS.accent,
                tabBarInactiveTintColor: COLORS.textMuted,
            }}
        >
            <StaffTab.Screen name="Orders" component={OrdersScreen} options={{ tabBarLabel: '🍽️ Orders' }} />
            <StaffTab.Screen name="Deliveries" component={CreateDeliveryScreen} options={{ tabBarLabel: '🤖 Deliveries' }} />
        </StaffTab.Navigator>
    );
}

function OwnerTabs() {
    return (
        <OwnerTab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: { backgroundColor: COLORS.surface, borderTopColor: COLORS.border },
                tabBarActiveTintColor: COLORS.accent,
                tabBarInactiveTintColor: COLORS.textMuted,
            }}
        >
            <OwnerTab.Screen name="Dashboard" component={DashboardScreen} options={{ tabBarLabel: '📊 Dashboard' }} />
            <OwnerTab.Screen name="Payments" component={PaymentsScreen} options={{ tabBarLabel: '💳 Payments' }} />
            <OwnerTab.Screen name="Robots" component={RobotsScreen} options={{ tabBarLabel: '🤖 Robots' }} />
        </OwnerTab.Navigator>
    );
}

function MainTabs() {
    const { user } = useAuth();
    return user?.role === 'Owner' ? <OwnerTabs /> : <StaffTabs />;
}

export function RootNavigator() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.bg }}>
                <ActivityIndicator color={COLORS.accent} size="large" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerStyle: { backgroundColor: COLORS.surface },
                    headerTintColor: COLORS.text,
                    headerTitleStyle: { fontWeight: '700' },
                }}
            >
                {!user ? (
                    <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                ) : (
                    <>
                        <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
                        <Stack.Screen name="OrderDetail" component={OrderDetailScreen} options={{ title: 'Order Detail' }} />
                        <Stack.Screen name="CreateDelivery" component={CreateDeliveryScreen} options={{ title: 'New Delivery' }} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}
