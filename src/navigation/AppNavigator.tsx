// src/navigation/AppNavigator.tsx
import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { AuthContext } from '../context/AuthContext';

// Import Screens - FIXED PATHS
import LoginScreen from '../modules/auth/LoginScreen';
import DashboardScreen from '../modules/dashboard/DashboardScreen';
import ProfileScreen from '../modules/profile/ProfileScreen';
import DoctorListScreen from '../modules/doctors/DoctorListScreen';
import AddDoctorScreen from '../modules/doctors/AddDoctorScreen';
import DoctorAvailabilityScreen from '../modules/doctors/DoctorAvailabilityScreen';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

// Doctor Stack Navigator
const DoctorStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DoctorList" component={DoctorListScreen} />
      <Stack.Screen name="AddDoctor" component={AddDoctorScreen} />
      <Stack.Screen name="DoctorAvailability" component={DoctorAvailabilityScreen} />
    </Stack.Navigator>
  );
};

// Main Drawer Navigator (After Login)
const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#007AFF',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        drawerActiveTintColor: '#007AFF',
        drawerInactiveTintColor: '#666',
        drawerStyle: {
          backgroundColor: '#f5f5f5',
        },
      }}
    >
      <Drawer.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{
          drawerLabel: 'Dashboard',
          title: 'Dashboard',
        }}
      />
      <Drawer.Screen 
        name="Doctors" 
        component={DoctorStack}
        options={{
          drawerLabel: 'Doctors',
          title: 'Doctors Management',
        }}
      />
      <Drawer.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          drawerLabel: 'My Profile',
          title: 'Profile',
        }}
      />
    </Drawer.Navigator>
  );
};

// Root Navigator
const RootNavigator = () => {
  const authContext = useContext(AuthContext);
  
  if (!authContext) return null;
  
  const { user } = authContext;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <Stack.Screen name="Main" component={DrawerNavigator} />
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
};

// App Navigator
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
};

export default AppNavigator;