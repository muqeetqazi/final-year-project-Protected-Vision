import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

// Import the screen components
//import AboutScreen from './AboutScreen'; // Adjust path if needed
import AuthScreen from '../screen/AuthScreen';
import DashboardScreen from '../screen/DashboardScreen';
import HistoryScreen from '../screen/HistoryScreen';
import HomeScreen from '../screen/HomeScreen';
import PreviewScreen from '../screen/PreviewScreen';
import ProfileScreen from '../screen/ProfileScreen';
import ResultScreen from '../screen/ResultScreen';
import SettingsScreen from '../screen/SettingsScreen';
import SubscriptionScreen from '../screen/SubscriptionScreen';

// Create the Stack Navigator
const Stack = createStackNavigator();

export default function App() {
  return (
    <Stack.Navigator
      initialRouteName="Auth"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Auth" component={AuthScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Preview" component={PreviewScreen} />
      <Stack.Screen name="Result" component={ResultScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="History" component={HistoryScreen} />
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="Subscription" component={SubscriptionScreen} />
    </Stack.Navigator>
  );
}
