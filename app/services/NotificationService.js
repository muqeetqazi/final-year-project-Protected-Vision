import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

class NotificationService {
  static async requestPermissions() {
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        return false;
      }
      return true;
    }
    return false;
  }

  static async scheduleNotification(title, body, seconds = 5) {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data: { data: 'goes here' },
        },
        trigger: { seconds },
      });
      return true;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      return false;
    }
  }

  static async sendImmediateNotification(title, body) {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data: { data: 'goes here' },
        },
        trigger: null,
      });
      return true;
    } catch (error) {
      console.error('Error sending notification:', error);
      return false;
    }
  }

  static async cancelAllNotifications() {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      return true;
    } catch (error) {
      console.error('Error canceling notifications:', error);
      return false;
    }
  }

  // Demo notifications for testing
  static async sendDemoNotifications() {
    const demos = [
      {
        title: 'Welcome to Protected Vision!',
        body: 'Thank you for using our app. Tap to explore features.',
        delay: 2
      },
      {
        title: 'Security Tip',
        body: 'Remember to regularly scan your sensitive content for protection.',
        delay: 5
      },
      {
        title: 'Premium Features Available',
        body: 'Upgrade to Premium for advanced protection features!',
        delay: 8
      }
    ];

    for (const demo of demos) {
      await this.scheduleNotification(demo.title, demo.body, demo.delay);
    }
  }
}

export default NotificationService; 