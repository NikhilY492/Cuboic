import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, View, Text, Alert, Vibration } from 'react-native';
import * as Speech from 'expo-speech';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { SocketProvider, useSocketEvent } from '../context/SocketContext';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { DashboardScreen } from '../screens/shared/DashboardScreen';
import { OrdersScreen } from '../screens/shared/OrdersScreen';
import { KanbanOrdersScreen } from '../screens/staff/KanbanOrdersScreen';
import { MenuScreen } from '../screens/shared/MenuScreen';
import { DeliveriesScreen } from '../screens/shared/DeliveriesScreen';
import { RobotsScreen } from '../screens/shared/RobotsScreen';
import { PaymentsScreen } from '../screens/shared/PaymentsScreen';
import { ProfileScreen } from '../screens/shared/ProfileScreen';
import { StaffScreen } from '../screens/owner/StaffScreen';
import { TablesScreen } from '../screens/owner/TablesScreen';
import { AnalyticsScreen } from '../screens/owner/AnalyticsScreen';
import { ManagementScreen } from '../screens/owner/ManagementScreen';
import { S } from '../theme';

export type RootStackParamList = {
    Login: undefined;
    Main: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

type MainTabParamList = {
    Dashboard: undefined;
    Orders: undefined;
    Analytics: undefined;
    Manage: undefined;
    Profile: undefined;
};

type ManageStackParamList = {
    ManagementMain: undefined;
    Menu: undefined;
    Staff: undefined;
    Tables: undefined;
    Payments: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();
const MStack = createNativeStackNavigator<ManageStackParamList>();

function ManageStack() {
    const { colors } = useTheme();
    return (
        <MStack.Navigator
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: colors.bg },
            }}
        >
            <MStack.Screen 
                name="ManagementMain" 
                component={ManagementScreen} 
                options={{ title: 'Manage' }} 
            />
            <MStack.Screen name="Menu" component={MenuScreen} />
            <MStack.Screen name="Staff" component={StaffScreen} />
            <MStack.Screen name="Tables" component={TablesScreen} />
            <MStack.Screen name="Payments" component={PaymentsScreen} />
        </MStack.Navigator>
    );
}

function MainTabs() {
    const { user } = useAuth();
    const { colors } = useTheme();
    const isOwner = user?.role === 'Owner';
    const isManager = user?.role === 'Manager';
    const isStaff = user?.role === 'Staff';
    const insets = useSafeAreaInsets();

    const [preferredVoice, setPreferredVoice] = React.useState<string | undefined>(undefined);

    React.useEffect(() => {
        const initVoices = async () => {
            try {
                const voices = await Speech.getAvailableVoicesAsync();
                const inVoice = voices.find(v => {
                    const lang = v.language.replace('_', '-').toLowerCase();
                    return lang.startsWith('en-in');
                })?.identifier;
                const enVoice = voices.find(v => v.language.toLowerCase().startsWith('en-'))?.identifier;
                setPreferredVoice(inVoice || enVoice);
            } catch (err) {
                console.error('[DEBUG] Error fetching voices:', err);
            }
        };
        initVoices();
    }, []);

    useSocketEvent(user?.restaurantId, {
        callCaptain: (data: any) => {
            if (isOwner || isManager) {
                // Trigger Vibration (Pattern: [Wait, Vibrate, Wait, Vibrate])
                Vibration.vibrate([0, 500, 200, 500]);
                
                // Voice Announcement
                const speakMsg = data?.message || `Customer at ${data?.tableName || 'a table'} needs the Captain.`;
                Speech.speak(speakMsg, {
                    language: 'en-IN',
                    voice: preferredVoice,
                    rate: 0.9,
                });

                Alert.alert('Captain Called!', speakMsg);
            }
        }
    });

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: colors.surface,
                    borderTopColor: colors.border,
                    borderTopWidth: 1,
                    paddingBottom: Math.max(insets.bottom, 8),
                    paddingTop: 8,
                    paddingLeft: Math.max(insets.left, 0),
                    paddingRight: Math.max(insets.right, 0),
                    minHeight: 64 + insets.bottom,
                },
                tabBarActiveTintColor: colors.accent,
                tabBarInactiveTintColor: colors.textDim,
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '500',
                    width: '100%',
                },
                tabBarItemStyle: {
                    paddingHorizontal: 2,
                },
                tabBarIcon: ({ color, size }) => {
                    let iconName: any = 'circle';
                    if (route.name === 'Dashboard') iconName = 'pie-chart';
                    else if (route.name === 'Orders') iconName = 'list';
                    else if (route.name === 'Analytics') iconName = 'bar-chart-2';
                    else if (route.name === 'Manage') iconName = 'settings';
                    else if (route.name === 'Profile') iconName = 'user';

                    return <Feather name={iconName} size={22} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Dashboard" component={DashboardScreen} />
            <Tab.Screen name="Orders" component={isStaff ? KanbanOrdersScreen : OrdersScreen} />
            {isOwner && (
                <Tab.Screen name="Analytics" component={AnalyticsScreen} />
            )}
            <Tab.Screen name="Manage" component={ManageStack} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
}

export function RootNavigator() {
    const { user, loading } = useAuth();
    const { colors } = useTheme();

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bg }}>
                <ActivityIndicator color={colors.accent} size="large" />
            </View>
        );
    }

    return (
        <SocketProvider restaurantId={user?.restaurantId}>
            <NavigationContainer>
                <Stack.Navigator
                    screenOptions={{
                        headerStyle: { backgroundColor: colors.surface },
                        headerTintColor: colors.text,
                        headerTitleStyle: { fontWeight: '700' },
                        contentStyle: { backgroundColor: colors.bg },
                    }}
                >
                    {!user ? (
                        <Stack.Screen
                            name="Login"
                            component={LoginScreen}
                            options={{ headerShown: false }}
                        />
                    ) : (
                        <Stack.Screen
                            name="Main"
                            component={MainTabs}
                            options={{ headerShown: false }}
                        />
                    )}
                </Stack.Navigator>
            </NavigationContainer>
        </SocketProvider>
    );
}
