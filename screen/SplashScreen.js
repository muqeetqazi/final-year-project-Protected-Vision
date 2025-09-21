import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import {
    Dimensions,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { useTheme } from '../app/context/ThemeContext';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ navigation }) => {
  const theme = useTheme();

  useEffect(() => {
    // Navigate to Auth screen after 3 seconds
    const timer = setTimeout(() => {
      navigation.replace('Auth');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.logoContainer}>
        {/* Shield Icon */}
        <View style={[styles.shieldContainer, { borderColor: theme.colors.primary }]}>
          <Ionicons name="shield" size={80} color={theme.colors.primary} />
        </View>
        
        {/* Brand Name */}
        <Text style={[styles.brandName, { color: theme.colors.primary }]}>
          PROTECTED VISION
        </Text>
        
        {/* Tagline */}
        <Text style={[styles.tagline, { color: theme.colors.primary }]}>
          STAY SECURE, STAY PRIVATE!
        </Text>
      </View>
      
      {/* Loading indicator */}
      <View style={styles.loadingContainer}>
        <View style={[styles.loadingDot, { backgroundColor: theme.colors.primary }]} />
        <View style={[styles.loadingDot, { backgroundColor: theme.colors.primary }]} />
        <View style={[styles.loadingDot, { backgroundColor: theme.colors.primary }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  shieldContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  brandName: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: 2,
  },
  tagline: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
    letterSpacing: 1,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 50,
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    opacity: 0.7,
  },
});

export default SplashScreen;
