import { FontAwesome } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { Alert, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../app/context/ThemeContext';
import NotificationService from '../app/services/NotificationService';

const SettingsScreen = ({ navigation }) => {
  const theme = useTheme();
  const [notifications, setNotifications] = React.useState(false);
  const [autoSave, setAutoSave] = React.useState(true);

  useEffect(() => {
    checkNotificationPermissions();
  }, []);

  const checkNotificationPermissions = async () => {
    const hasPermission = await NotificationService.requestPermissions();
    setNotifications(hasPermission);
  };

  const handleNotificationToggle = async () => {
    if (!notifications) {
      const hasPermission = await NotificationService.requestPermissions();
      if (hasPermission) {
        setNotifications(true);
        // Send a test notification
        await NotificationService.sendImmediateNotification(
          'Notifications Enabled',
          'You will now receive important updates and security alerts!'
        );
        // Schedule demo notifications
        await NotificationService.sendDemoNotifications();
      } else {
        Alert.alert(
          'Permission Required',
          'Please enable notifications in your device settings to receive important updates.',
          [{ text: 'OK' }]
        );
      }
    } else {
      setNotifications(false);
      await NotificationService.cancelAllNotifications();
      Alert.alert(
        'Notifications Disabled',
        'You will no longer receive notifications from Protected Vision.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear App Data',
      'Are you sure you want to clear all app data? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await NotificationService.cancelAllNotifications();
            setNotifications(false);
            setAutoSave(false);
            Alert.alert('Success', 'All app data has been cleared.');
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome name="arrow-left" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Appearance</Text>
          <View style={styles.settingItem}>
            <Text style={[styles.settingLabel, { color: theme.colors.text }]}>Dark Mode</Text>
            <Switch
              value={theme.isDarkMode}
              onValueChange={theme.toggleTheme}
              trackColor={{ false: "#767577", true: theme.colors.primary }}
            />
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Notifications</Text>
          <View style={styles.settingItem}>
            <Text style={[styles.settingLabel, { color: theme.colors.text }]}>Push Notifications</Text>
            <Switch
              value={notifications}
              onValueChange={handleNotificationToggle}
              trackColor={{ false: "#767577", true: theme.colors.primary }}
            />
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Content</Text>
          <View style={styles.settingItem}>
            <Text style={[styles.settingLabel, { color: theme.colors.text }]}>Auto-save Results</Text>
            <Switch
              value={autoSave}
              onValueChange={setAutoSave}
              trackColor={{ false: "#767577", true: theme.colors.primary }}
            />
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.button, { backgroundColor: theme.colors.error }]}
          onPress={handleClearData}
        >
          <Text style={styles.buttonText}>Clear App Data</Text>
        </TouchableOpacity>
      </View>
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
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  settingLabel: {
    fontSize: 16,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SettingsScreen; 