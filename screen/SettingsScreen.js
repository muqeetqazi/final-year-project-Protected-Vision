import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme, useThemeUpdate } from '../app/context/ThemeContext';

import { scheduleNotification } from '../app/services/NotificationService';
const SettingsScreen = ({ navigation }) => {
  const theme = useTheme();
  const toggleTheme = useThemeUpdate();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [dataBackupEnabled, setDataBackupEnabled] = useState(false);
  const [autoDeleteEnabled, setAutoDeleteEnabled] = useState(false);
  const [cloudSyncEnabled, setCloudSyncEnabled] = useState(false);

  useEffect(() => {
    checkNotificationPermissions();
  }, []);

  const checkNotificationPermissions = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    setNotificationsEnabled(status === 'granted');
  };

  const handleNotificationToggle = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    
    if (status !== 'granted') {
      const { status: newStatus } = await Notifications.requestPermissionsAsync();
      if (newStatus !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please enable notifications in your device settings to receive updates.',
          [{ text: 'OK' }]
        );
        return;
      }
    }
    
    const newValue = !notificationsEnabled;
    setNotificationsEnabled(newValue);
    
    if (newValue) {
      // Schedule a test notification
      scheduleNotification(
        'Notifications Enabled',
        'You will now receive updates about your protected documents.',
        5
      );
    }
  };

  const handleThemeToggle = () => {
    toggleTheme();
  };

  const renderSettingItem = (
    icon,
    iconType,
    title,
    description,
    value,
    onToggle,
    testID
  ) => {
    let IconComponent;
    switch (iconType) {
      case 'FontAwesome':
        IconComponent = FontAwesome;
        break;
      case 'MaterialIcons':
        IconComponent = MaterialIcons;
        break;
      default:
        IconComponent = Ionicons;
    }

    return (
      <View style={[styles.settingItem, { borderBottomColor: theme.colors.border }]}>
        <View style={styles.settingIconContainer}>
          <IconComponent
            name={icon}
            size={24}
            color={theme.colors.primary}
          />
        </View>
        <View style={styles.settingContent}>
          <Text style={[styles.settingTitle, { color: theme.colors.text }]}>
            {title}
          </Text>
          <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>
            {description}
          </Text>
        </View>
        <Switch
          testID={testID}
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: '#767577', true: theme.colors.primaryLight }}
          thumbColor={value ? theme.colors.primary : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
        />
      </View>
    );
  };

  const renderSectionHeader = (title) => (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionHeaderText, { color: theme.colors.primary }]}>
        {title}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>
      
      <ScrollView style={styles.scrollView}>
        {renderSectionHeader('Appearance')}
        {renderSettingItem(
          theme.isDarkMode ? 'moon' : 'sunny',
          'Ionicons',
          'Dark Mode',
          'Switch between light and dark theme',
          theme.isDarkMode,
          handleThemeToggle,
          'theme-toggle'
        )}

        {renderSectionHeader('Notifications')}
        {renderSettingItem(
          'notifications',
          'Ionicons',
          'Push Notifications',
          'Receive alerts about sensitive content detection',
          notificationsEnabled,
          handleNotificationToggle,
          'notification-toggle'
        )}

        {/* {renderSectionHeader('Security')} */}
        {/* {renderSettingItem(
          'fingerprint',
          'MaterialIcons',
          'Biometric Authentication',
          'Secure app access with fingerprint or face ID',
          biometricEnabled,
          () => setBiometricEnabled(!biometricEnabled),
          'biometric-toggle'
        )} */}
        
        

        <View style={styles.aboutSection}>
          <TouchableOpacity 
            style={[styles.aboutItem, { backgroundColor: theme.colors.surface }]}
            onPress={() => navigation.navigate('HelpSupport')}
          >
            <Ionicons name="help-circle" size={24} color={theme.colors.primary} />
            <Text style={[styles.aboutItemText, { color: theme.colors.text }]}>Help & Support</Text>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.aboutItem, { backgroundColor: theme.colors.surface }]}
            onPress={() => navigation.navigate('PrivacyPolicy')}
          >
            <Ionicons name="document-text" size={24} color={theme.colors.primary} />
            <Text style={[styles.aboutItemText, { color: theme.colors.text }]}>Privacy Policy</Text>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.aboutItem, { backgroundColor: theme.colors.surface }]}
            onPress={() => navigation.navigate('About')}
          >
            <Ionicons name="information-circle" size={24} color={theme.colors.primary} />
            <Text style={[styles.aboutItemText, { color: theme.colors.text }]}>About</Text>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.versionContainer}>
          <Text style={[styles.versionText, { color: theme.colors.textSecondary }]}>
            Protected Vision v1.0.0
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    marginTop: 24,
    marginBottom: 8,
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  settingIconContainer: {
    width: 40,
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
  },
  aboutSection: {
    marginTop: 24,
    marginBottom: 16,
  },
  aboutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  aboutItemText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
  },
  versionContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  versionText: {
    fontSize: 14,
  },
});

export default SettingsScreen; 