import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
    Image,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
// import UserStats from '../app/components/UserStats'; // Temporarily disabled
import { useAuth } from '../app/context/AuthContext';
import { useTheme } from '../app/context/ThemeContext';

const ProfileScreen = ({ navigation }) => {
  const theme = useTheme();
  const { user, logout } = useAuth();
  
  const [userData] = useState({
    name: user ? `${user.first_name} ${user.last_name}` : 'User',
    email: user ? user.email : 'user@example.com',
    processedFiles: 12,
    savedFiles: 5,
    sharedFiles: 3,
  });

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
        <TouchableOpacity 
          style={styles.settingsButton}
          onPress={() => navigation.navigate('Settings')}
        >
          <FontAwesome name="cog" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={[styles.content, { backgroundColor: theme.colors.background }]}
        showsVerticalScrollIndicator={false}
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

          <TouchableOpacity style={[styles.menuItem, { borderBottomColor: theme.colors.border }]}>
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