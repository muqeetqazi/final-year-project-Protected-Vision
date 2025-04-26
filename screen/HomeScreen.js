import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useTheme } from '../app/context/ThemeContext';
import NotificationService from '../app/services/NotificationService';
import CarouselComponent from './components/Carousel';

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const theme = useTheme();
  const [selectedMedia, setSelectedMedia] = useState(null);

  const carouselData = [
    {
      image: require('../assets/images/lock1.jpg'),
      text: 'Protect Your Sensitive Documents',
    },
    {
      image: require('../assets/images/lock2.jpeg'),
      text: 'AI-Powered Sensitive Data Detection',
    },
    {
      image: require('../assets/images/bank.jpg'),
      text: 'Secure Financial & Personal Information',
    },
  ];

  const features = [
    {
      icon: 'id-card',
      title: 'ID Protection',
      description: 'Detect national ID cards, driver\'s licenses, and passport information',
    },
    {
      icon: 'credit-card',
      title: 'Financial Security',
      description: 'Identify bank account details, credit card numbers, and financial data',
    },
    {
      icon: 'user-secret',
      title: 'PII Detection',
      description: 'Find emails, phone numbers, passwords, and personal identifiers',
    },
    {
      icon: 'file-text',
      title: 'Document Analysis',
      description: 'Scan documents for sensitive information with advanced AI',
    },
    {
      icon: 'shield',
      title: 'Data Protection',
      description: 'Get recommendations to secure your sensitive information',
    },
    {
      icon: 'history',
      title: 'Scan History',
      description: 'Keep track of previously scanned documents and findings',
    },
  ];

  const sensitiveDataTypes = [
    { name: 'National ID Cards', icon: 'id-card' },
    { name: 'Driver\'s Licenses', icon: 'car' },
    { name: 'Passports', icon: 'plane' },
    { name: 'Credit Cards', icon: 'credit-card' },
    { name: 'Bank Statements', icon: 'bank' },
    { name: 'Tax Documents', icon: 'file-text' },
    { name: 'Medical Records', icon: 'medkit' },
    { name: 'Email Addresses', icon: 'envelope' },
    { name: 'Phone Numbers', icon: 'phone' },
    { name: 'Passwords', icon: 'key' },
    { name: 'Social Security Numbers', icon: 'user-shield' },
    { name: 'Birth Certificates', icon: 'certificate' },
  ];

  useEffect(() => {
    requestPermissions();
    sendWelcomeNotification();
  }, []);

  const sendWelcomeNotification = async () => {
    await NotificationService.sendImmediateNotification(
      'Welcome to Protected Vision',
      'Scan your documents to detect and protect sensitive information.'
    );
  };

  const requestPermissions = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (cameraStatus !== 'granted' || libraryStatus !== 'granted') {
      alert('Sorry, we need camera and media library permissions to make this work!');
    }
  };

  const handleMediaPicker = async (type) => {
    try {
      const baseOptions = {
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      };

      let result;
      if (type === 'camera') {
        result = await ImagePicker.launchCameraAsync({
          ...baseOptions,
          mediaTypes: ImagePicker.MediaTypeOptions.Images
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          ...baseOptions,
          mediaTypes: ImagePicker.MediaTypeOptions.All
        });
      }

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedAsset = result.assets[0];
        
        const fileSize = selectedAsset.fileSize || 0;
        if (fileSize > 50 * 1024 * 1024) {
          alert('File size too large. Please select a file under 50MB.');
          return;
        }

        setSelectedMedia(selectedAsset);
        navigation.navigate('Preview', { 
          media: {
            uri: selectedAsset.uri,
            type: selectedAsset.type || 'image',
            width: selectedAsset.width,
            height: selectedAsset.height
          }
        });
      }
    } catch (error) {
      console.error('Error picking media:', error);
      alert('Error accessing media. Please try again.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={theme.isDarkMode ? "light-content" : "dark-content"} />
      <LinearGradient
        colors={[theme.colors.primary, theme.isDarkMode ? '#2c0233' : '#7a1a87']}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <FontAwesome name="user-circle" size={30} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Protected Vision</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <FontAwesome name="cog" size={30} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.carouselContainer}>
          <CarouselComponent data={carouselData} />
        </View>

        <View style={[styles.infoSection, { 
          backgroundColor: theme.colors.surface,
          shadowColor: theme.isDarkMode ? '#000' : '#666'
        }]}>
          <Text style={[styles.infoTitle, { color: theme.colors.text }]}>
            AI-Powered Sensitive Data Detection
          </Text>
          <Text style={[styles.infoDescription, { color: theme.colors.textSecondary }]}>
            Our advanced machine learning model identifies and protects sensitive information in your documents, including personal identifiers, financial data, and official IDs.
          </Text>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Key Features
        </Text>
        <View style={styles.featuresContainer}>
          {features.map((feature, index) => (
            <View 
              key={index} 
              style={[
                styles.featureCard, 
                { 
                  backgroundColor: theme.colors.surface,
                  shadowColor: theme.isDarkMode ? '#000' : '#666'
                }
              ]}
            >
              <LinearGradient
                colors={[theme.colors.primary, theme.isDarkMode ? '#2c0233' : '#7a1a87']}
                style={styles.featureIconContainer}
              >
                <FontAwesome name={feature.icon} size={24} color="#fff" />
              </LinearGradient>
              <Text style={[styles.featureTitle, { color: theme.colors.text }]}>{feature.title}</Text>
              <Text style={[styles.featureDescription, { color: theme.colors.textSecondary }]}>
                {feature.description}
              </Text>
            </View>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Protected Data Types
        </Text>
        <View style={[styles.dataTypesContainer, { 
          backgroundColor: theme.colors.surface,
          shadowColor: theme.isDarkMode ? '#000' : '#666'
        }]}>
          {sensitiveDataTypes.map((dataType, index) => (
            <View key={index} style={styles.dataTypeItem}>
              <LinearGradient
                colors={[theme.colors.primary, theme.isDarkMode ? '#2c0233' : '#7a1a87']}
                style={styles.dataTypeIconContainer}
              >
                <FontAwesome name={dataType.icon} size={16} color="#fff" />
              </LinearGradient>
              <Text style={[styles.dataTypeText, { color: theme.colors.text }]}>
                {dataType.name}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.actionContainer}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Scan Your Document</Text>
          
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => handleMediaPicker('gallery')}
          >
            <LinearGradient
              colors={[theme.colors.primary, theme.isDarkMode ? '#2c0233' : '#7a1a87']}
              style={styles.actionButtonGradient}
            >
              <FontAwesome name="file-image-o" size={24} color="#fff" />
              <Text style={styles.buttonText}>Select Media from Gallery</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => handleMediaPicker('camera')}
          >
            <LinearGradient
              colors={[theme.colors.primary, theme.isDarkMode ? '#2c0233' : '#7a1a87']}
              style={styles.actionButtonGradient}
            >
              <FontAwesome name="camera" size={24} color="#fff" />
              <Text style={styles.buttonText}>Capture Document with Camera</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.historyButton, { 
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.primary 
            }]}
            onPress={() => navigation.navigate('History')}
          >
            <FontAwesome name="history" size={24} color={theme.colors.primary} />
            <Text style={[styles.historyButtonText, { color: theme.colors.primary }]}>
              View Scan History
            </Text>
          </TouchableOpacity>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  carouselContainer: {
    marginTop: 10,
  },
  infoSection: {
    margin: 20,
    padding: 20,
    borderRadius: 20,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  infoDescription: {
    fontSize: 15,
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginTop: 25,
    marginBottom: 15,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  featureCard: {
    width: '48%',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 20,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  featureIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  dataTypesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: 20,
    padding: 20,
    borderRadius: 20,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  dataTypeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    paddingVertical: 10,
  },
  dataTypeIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  dataTypeText: {
    fontSize: 14,
    flex: 1,
  },
  actionContainer: {
    padding: 20,
    paddingBottom: 30,
  },
  actionButton: {
    borderRadius: 15,
    marginBottom: 12,
    overflow: 'hidden',
  },
  actionButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 12,
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 15,
    marginTop: 8,
    borderWidth: 1,
  },
  historyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
});

export default HomeScreen;
