import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

// Import the screen components
//import AboutScreen from './AboutScreen'; // Adjust path if needed
import AuthScreen from '../screen/AuthScreen';
import HistoryScreen from '../screen/HistoryScreen';
import HomeScreen from '../screen/HomeScreen';
import PreviewScreen from '../screen/PreviewScreen';
import ProfileScreen from '../screen/ProfileScreen';
import ResultScreen from '../screen/ResultScreen';
import SettingsScreen from '../screen/SettingsScreen';

// Create the Stack Navigator
const Stack = createStackNavigator();

export default function Index() {
  return (
    <Stack.Navigator initialRouteName="Auth">
      <Stack.Screen 
        name="Auth" 
        component={AuthScreen} 
        options={{headerShown: false}} 
      />
      <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{headerShown: false}} 
      />
      <Stack.Screen 
        name="Preview" 
        component={PreviewScreen} 
        options={{headerShown: false}} 
      />
      <Stack.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{headerShown: false}} 
      />
      <Stack.Screen 
        name="History" 
        component={HistoryScreen} 
        options={{headerShown: false}} 
      />
      <Stack.Screen 
        name="Result" 
        component={ResultScreen} 
        options={{headerShown: false}} 
      />
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{headerShown: false}} 
      />
      
      {/* <Stack.Screen name="About" component={AboutScreen} /> */}
    </Stack.Navigator>
  );
}
