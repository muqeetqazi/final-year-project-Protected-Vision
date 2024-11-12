import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

// Import the screen components
//import AboutScreen from './AboutScreen'; // Adjust path if needed
import HomeScreen from '../screen/HomeScreen';
import VideoRecording from '../screen/VideoRecording';


// Create the Stack Navigator
const Stack = createStackNavigator();

export default function Index() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="VideoRecording" component={VideoRecording} />
        {/* <Stack.Screen name="About" component={AboutScreen} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
