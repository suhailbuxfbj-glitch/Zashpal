import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import LoginScreen from './src/screens/LoginScreen';
import AdminDashboard from './src/screens/AdminDashboard';
import EmployeeDashboard from './src/screens/EmployeeDashboard';
import AttendanceScreen from './src/screens/AttendanceScreen';
import EmployeeListScreen from './src/screens/EmployeeListScreen';
import ReportsScreen from './src/screens/ReportsScreen';
import AdminControlScreen from './src/screens/AdminControlScreen';
import AuditLogScreen from './src/screens/AuditLogScreen';
import { AppProvider } from './src/data/AppContext';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function AdminTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Dashboard') iconName = focused ? 'grid' : 'grid-outline';
          else if (route.name === 'Employees') iconName = focused ? 'people' : 'people-outline';
          else if (route.name === 'Attendance') iconName = focused ? 'calendar' : 'calendar-outline';
          else if (route.name === 'Reports') iconName = focused ? 'bar-chart' : 'bar-chart-outline';
          else if (route.name === 'Controls') iconName = focused ? 'settings' : 'settings-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#1a73e8',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: { backgroundColor: '#fff', borderTopColor: '#e0e0e0', height: 60, paddingBottom: 8 },
        headerStyle: { backgroundColor: '#1a73e8' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      })}
    >
      <Tab.Screen name="Dashboard" component={AdminDashboard} options={{ title: '📊 Dashboard' }} />
      <Tab.Screen name="Employees" component={EmployeeListScreen} options={{ title: '👥 Employees' }} />
      <Tab.Screen name="Attendance" component={AttendanceScreen} options={{ title: '📅 Attendance' }} />
      <Tab.Screen name="Reports" component={ReportsScreen} options={{ title: '📈 Reports' }} />
      <Tab.Screen name="Controls" component={AdminControlScreen} options={{ title: '⚙️ Controls' }} />
    </Tab.Navigator>
  );
}

function EmployeeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'MyAttendance') iconName = focused ? 'calendar' : 'calendar-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#1a73e8',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: { backgroundColor: '#fff', borderTopColor: '#e0e0e0', height: 60, paddingBottom: 8 },
        headerStyle: { backgroundColor: '#1a73e8' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      })}
    >
      <Tab.Screen name="Home" component={EmployeeDashboard} options={{ title: '🏠 Home' }} />
      <Tab.Screen name="MyAttendance" component={AttendanceScreen} options={{ title: '📅 My Attendance' }} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState(null);

  return (
    <AppProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!user ? (
            <Stack.Screen name="Login">
              {props => <LoginScreen {...props} onLogin={setUser} />}
            </Stack.Screen>
          ) : user.role === 'admin' ? (
            <>
              <Stack.Screen name="AdminMain" component={AdminTabs} />
              <Stack.Screen name="AuditLog" component={AuditLogScreen}
                options={{ headerShown: true, title: 'Audit Log', headerStyle: { backgroundColor: '#1a73e8' }, headerTintColor: '#fff' }} />
            </>
          ) : (
            <Stack.Screen name="EmployeeMain" component={EmployeeTabs} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
}
