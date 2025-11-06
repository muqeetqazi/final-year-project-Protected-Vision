import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Import the screen components
import AboutScreen from '../screen/AboutScreen';
import AuthScreen from '../screen/AuthScreen';
import DashboardScreen from '../screen/DashboardScreen';
import EditProfileScreen from '../screen/EditProfileScreen';
import HelpSupportScreen from '../screen/HelpSupportScreen';
import HomeScreen from '../screen/HomeScreen';
import PreviewScreen from '../screen/PreviewScreen';
import PrivacyPolicyScreen from '../screen/PrivacyPolicyScreen';
import ProfileScreen from '../screen/ProfileScreen';
import ResultScreen from '../screen/ResultScreen';
import SettingsScreen from '../screen/SettingsScreen';



const Stack = createStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
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
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
          <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
          <Stack.Screen name="About" component={AboutScreen} />
        </Stack.Navigator>
      </ThemeProvider>
    </AuthProvider>
  );
}
