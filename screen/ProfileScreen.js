import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  Image,
  Platform,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
// import UserStats from '../app/components/UserStats'; // Temporarily disabled
import axios from 'axios';
import { API_CONFIG } from '../app/config/api';
import { useAuth } from '../app/context/AuthContext';
import { useTheme } from '../app/context/ThemeContext';
import { TokenManager } from '../app/services/AuthService';

const ProfileScreen = ({ navigation }) => {
  const theme = useTheme();
  const { user, logout, updateUser } = useAuth();
  
  const [refreshing, setRefreshing] = useState(false);
  const [userData, setUserData] = useState({
    name: user ? `${user.first_name} ${user.last_name}` : 'User',
    email: user ? user.email : 'user@example.com',
    processedFiles: 12,
    savedFiles: 5,
    sharedFiles: 3,
  });

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      console.log('Refreshing profile data...');
      
      const accessToken = await TokenManager.getAccessToken();
      const response = await axios.get(
        `${API_CONFIG.BASE_URL}/auth/profile/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Profile refresh response:', response.data);
      
      // Update local user context with fresh data
      updateUser(response.data);
      
      // Update local userData state
      setUserData({
        name: response.data ? `${response.data.first_name} ${response.data.last_name}` : 'User',
        email: response.data ? response.data.email : 'user@example.com',
        processedFiles: response.data?.total_documents_processed || 0,
        savedFiles: response.data?.total_documents_saved || 0,
        sharedFiles: response.data?.total_documents_shared || 0,
      });
      
      console.log('Profile data refreshed successfully');
    } catch (error) {
      console.error('Profile refresh error:', error);
      
      if (error.response?.status === 401) {
        // Handle token expiry
        console.log('Token expired during refresh, logging out...');
        await logout();
        navigation.replace('Auth');
        return;
      }
      
      // For other errors, we'll just log them and continue
      // The user can try refreshing again
      console.log('Refresh failed, but user can try again');
    } finally {
      setRefreshing(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigation.replace('Auth');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.primary }]}>
      <StatusBar barStyle={theme.isDarkMode ? "light-content" : "dark-content"} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <FontAwesome name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            style={[styles.refreshButton, { opacity: refreshing ? 0.6 : 1 }]}
            onPress={handleRefresh}
            disabled={refreshing}
          >
            {refreshing ? (
              <FontAwesome name="spinner" size={20} color="#fff" />
            ) : (
              <FontAwesome name="refresh" size={20} color="#fff" />
            )}
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.settingsButton}
            onPress={() => navigation.navigate('Settings')}
          >
            <FontAwesome name="cog" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={[styles.content, { backgroundColor: theme.colors.background }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#fff"
            title="Pull to refresh profile"
            titleColor="#fff"
            progressBackgroundColor="rgba(255,255,255,0.2)"
            colors={['#fff']}
            progressViewOffset={20}
          />
        }
      >
        {/* Profile Image Section */}
        <LinearGradient
          colors={[theme.colors.primary, theme.isDarkMode ? '#2c0233' : '#7a1a87']}
          style={styles.profileGradient}
        >
          <View style={styles.profileImageSection}>
            <View style={styles.profileImageContainer}>
              <Image
                source={require('../assets/images/default-avatar.jpg')}
                style={styles.profileImage}
              />
              <TouchableOpacity style={styles.editImageButton}>
                <FontAwesome name="camera" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
            <Text style={styles.userName}>{userData.name}</Text>
            <Text style={styles.userEmail}>{userData.email}</Text>
            {/* <View style={styles.subscriptionBadge}>
              <FontAwesome 
                name={userData.subscriptionType === 'Premium' ? 'crown' : 'user'} 
                size={16} 
                color={userData.subscriptionType === 'Premium' ? '#FFD700' : '#fff'} 
              />
              <Text style={styles.subscriptionText}>{userData.subscriptionType}</Text>
            </View> */}
          </View>
        </LinearGradient>

        {/* User Stats Section - Temporarily disabled */}
        {/* <View style={styles.userStatsContainer}>
          <UserStats />
        </View> */}

        {/* Menu Items */}
        <View style={[styles.menuContainer, { 
          backgroundColor: theme.colors.surface,
          shadowColor: theme.isDarkMode ? '#000' : '#666'
        }]}>
          <TouchableOpacity 
            style={[styles.menuItem, { borderBottomColor: theme.colors.border }]}
            onPress={() => navigation.navigate('Dashboard')}
          >
            <View style={[styles.menuIconContainer, { backgroundColor: theme.isDarkMode ? '#2c0233' : '#f0e6f3' }]}>
              <FontAwesome name="dashboard" size={20} color={theme.colors.primary} />
            </View>
            <Text style={[styles.menuText, { color: theme.colors.text }]}>Dashboard</Text>
            <FontAwesome name="chevron-right" size={16} color={theme.colors.textSecondary} />
          </TouchableOpacity>

          {/* <TouchableOpacity 
            style={[styles.menuItem, { borderBottomColor: theme.colors.border }]}
            onPress={() => navigation.navigate('Subscription')}
          >
            <View style={[styles.menuIconContainer, { backgroundColor: theme.isDarkMode ? '#2c0233' : '#f0e6f3' }]}>
              <FontAwesome name="star" size={20} color={theme.colors.primary} />
            </View>
            <Text style={[styles.menuText, { color: theme.colors.text }]}>Subscription</Text>
            <FontAwesome name="chevron-right" size={16} color={theme.colors.textSecondary} />
          </TouchableOpacity> */}

          <TouchableOpacity 
            style={[styles.menuItem, { borderBottomColor: theme.colors.border }]}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <View style={[styles.menuIconContainer, { backgroundColor: theme.isDarkMode ? '#2c0233' : '#f0e6f3' }]}>
              <FontAwesome name="user" size={20} color={theme.colors.primary} />
            </View>
            <Text style={[styles.menuText, { color: theme.colors.text }]}>Edit Profile</Text>
            <FontAwesome name="chevron-right" size={16} color={theme.colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItem, { borderBottomColor: theme.colors.border }]}>
            <View style={[styles.menuIconContainer, { backgroundColor: theme.isDarkMode ? '#2c0233' : '#f0e6f3' }]}>
              <FontAwesome name="bell" size={20} color={theme.colors.primary} />
            </View>
            <Text style={[styles.menuText, { color: theme.colors.text }]}>Notifications</Text>
            <FontAwesome name="chevron-right" size={16} color={theme.colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItem, { borderBottomColor: theme.colors.border }]}>
            <View style={[styles.menuIconContainer, { backgroundColor: theme.isDarkMode ? '#2c0233' : '#f0e6f3' }]}>
              <FontAwesome name="lock" size={20} color={theme.colors.primary} />
            </View>
            <Text style={[styles.menuText, { color: theme.colors.text }]}>Privacy & Security</Text>
            <FontAwesome name="chevron-right" size={16} color={theme.colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={[styles.menuIconContainer, { backgroundColor: theme.isDarkMode ? '#2c0233' : '#f0e6f3' }]}>
              <FontAwesome name="question-circle" size={20} color={theme.colors.primary} />
            </View>
            <Text style={[styles.menuText, { color: theme.colors.text }]}>Help & Support</Text>
            <FontAwesome name="chevron-right" size={16} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity 
          style={[styles.logoutButton, { backgroundColor: theme.colors.error }]}
          onPress={handleLogout}
        >
          <FontAwesome name="sign-out" size={20} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  refreshButton: {
    padding: 8,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  settingsButton: {
    padding: 5,
  },
  content: {
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  profileGradient: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingBottom: 30,
  },
  profileImageSection: {
    alignItems: 'center',
    paddingTop: 30,
  },
  profileImageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#fff',
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#43034d',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 15,
  },
  userEmail: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 5,
  },
  userStatsContainer: {
    margin: 20,
    marginTop: -20,
    flex: 1,
  },
  menuContainer: {
    margin: 20,
    borderRadius: 15,
    elevation: 3,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
    padding: 16,
    borderRadius: 15,
    marginBottom: 30,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  subscriptionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 10,
  },
  subscriptionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
  },
});

export default ProfileScreen; 