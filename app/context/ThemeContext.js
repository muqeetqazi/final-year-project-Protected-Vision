import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

export const ThemeContext = createContext();
export const ThemeUpdateContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('isDarkMode');
      if (savedTheme !== null) {
        setIsDarkMode(JSON.parse(savedTheme));
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    }
  };

  const toggleTheme = async () => {
    try {
      const newTheme = !isDarkMode;
      setIsDarkMode(newTheme);
      await AsyncStorage.setItem('isDarkMode', JSON.stringify(newTheme));
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const theme = {
    isDarkMode,
    colors: isDarkMode ? {
      // Primary colors
      primary: '#43034d',
      primaryLight: '#6a0a7a',
      primaryDark: '#2c0233',
      
      // Secondary colors
      secondary: '#7a1a87',
      secondaryLight: '#9e3ca8',
      secondaryDark: '#5a0e66',
      
      // UI colors
      background: '#121212',
      surface: '#1E1E1E',
      card: '#242424',
      border: '#2C2C2C',
      
      // Text colors
      text: '#FFFFFF',
      textSecondary: '#B3B3B3',
      textDisabled: '#666666',
      
      // Status colors
      error: '#CF6679',
      success: '#03DAC6',
      warning: '#FAAD14',
      info: '#1890FF',
      
      // Button colors
      button: '#43034d',
      buttonText: '#FFFFFF',
      buttonDisabled: '#333333',
      buttonTextDisabled: '#888888',
    } : {
      // Primary colors
      primary: '#43034d',
      primaryLight: '#7a1a87',
      primaryDark: '#2c0233',
      
      // Secondary colors
      secondary: '#7a1a87',
      secondaryLight: '#9e3ca8',
      secondaryDark: '#5a0e66',
      
      // UI colors
      background: '#F5F5F5',
      surface: '#FFFFFF',
      card: '#FFFFFF',
      border: '#E0E0E0',
      
      // Text colors
      text: '#000000',
      textSecondary: '#666666',
      textDisabled: '#BBBBBB',
      
      // Status colors
      error: '#B00020',
      success: '#4CAF50',
      warning: '#FAAD14',
      info: '#1890FF',
      
      // Button colors
      button: '#43034d',
      buttonText: '#FFFFFF',
      buttonDisabled: '#E0E0E0',
      buttonTextDisabled: '#999999',
    }
  };

  return (
    <ThemeUpdateContext.Provider value={toggleTheme}>
      <ThemeContext.Provider value={theme}>
        {children}
      </ThemeContext.Provider>
    </ThemeUpdateContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
export const useThemeUpdate = () => useContext(ThemeUpdateContext);

// Default export for the provider
export default ThemeProvider; 