import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import {
  Animated,
  Dimensions,
  ScrollView,
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
  const [scaleAnim] = useState(new Animated.Value(1));

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
      // Animate button press
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();

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
        
        // Add file size validation (optional, 50MB limit)
        const fileSize = selectedAsset.fileSize || 0;
        if (fileSize > 50 * 1024 * 1024) { // 50MB in bytes
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

  const renderFeatureCard = (feature, index) => (
    <Animated.View 
      key={index} 
      style={[
        styles.featureCard, 
        { 
          backgroundColor: theme.colors.surface,
          transform: [{ scale: scaleAnim }]
        }
      ]}
    >
      <View style={[styles.featureIconContainer, { backgroundColor: theme.colors.primaryLight }]}>
        <FontAwesome name={feature.icon} size={24} color={theme.colors.primary} />
      </View>
      <Text style={[styles.featureTitle, { color: theme.colors.text }]}>{feature.title}</Text>
      <Text style={[styles.featureDescription, { color: theme.colors.textSecondary }]}>
        {feature.description}
      </Text>
    </Animated.View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
        <TouchableOpacity 
          style={styles.headerButton} 
          onPress={() => navigation.navigate('Profile')}
        >
          <FontAwesome name="user-circle" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Protected Vision</Text>
        <TouchableOpacity 
          style={styles.headerButton} 
          onPress={() => navigation.navigate('Settings')}
        >
          <FontAwesome name="cog" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <CarouselComponent data={carouselData} />

        <View style={[styles.infoSection, { 
          backgroundColor: theme.colors.surface,
          shadowColor: theme.isDarkMode ? '#000' : 'rgba(0,0,0,0.3)'
        }]}>
          <View style={[styles.infoBadge, { backgroundColor: theme.colors.primary }]}>
            <FontAwesome name="shield" size={16} color="#fff" />
            <Text style={styles.infoBadgeText}>AI-Powered</Text>
          </View>
          <Text style={[styles.infoTitle, { color: theme.colors.text }]}>
            Sensitive Data Detection
          </Text>
          <Text style={[styles.infoDescription, { color: theme.colors.textSecondary }]}>
            Our advanced machine learning model identifies and protects sensitive information in your documents, including personal identifiers, financial data, and official IDs.
          </Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Key Features
          </Text>
          <TouchableOpacity>
            <Text style={[styles.seeAllText, { color: theme.colors.primary }]}>See All</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.featuresContainer}>
          {features.map((feature, index) => renderFeatureCard(feature, index))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Protected Data Types
          </Text>
        </View>
        
        <View style={[styles.dataTypesContainer, { 
          backgroundColor: theme.colors.surface,
          shadowColor: theme.isDarkMode ? '#000' : 'rgba(0,0,0,0.3)'
        }]}>
          {sensitiveDataTypes.map((dataType, index) => (
            <View key={index} style={styles.dataTypeItem}>
              <View style={[styles.dataTypeIconContainer, { backgroundColor: theme.colors.primaryLight }]}>
                <FontAwesome name={dataType.icon} size={14} color={theme.colors.primary} />
              </View>
              <Text style={[styles.dataTypeText, { color: theme.colors.text }]}>
                {dataType.name}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.actionContainer}>
          <Text style={[styles.actionTitle, { color: theme.colors.text }]}>
            Scan Your Document
          </Text>
          
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => handleMediaPicker('gallery')}
            activeOpacity={0.8}
          >
            <View style={styles.actionButtonContent}>
              <View style={styles.actionIconContainer}>
                <FontAwesome name="file-image-o" size={22} color={theme.colors.buttonText} />
              </View>
              <View style={styles.actionTextContainer}>
                <Text style={[styles.buttonText, { color: theme.colors.buttonText }]}>
                  Select from Gallery
                </Text>
                <Text style={styles.buttonSubText}>
                  Choose existing photos or documents
                </Text>
              </View>
              <FontAwesome name="chevron-right" size={16} color={theme.colors.buttonText} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => handleMediaPicker('camera')}
            activeOpacity={0.8}
          >
            <View style={styles.actionButtonContent}>
              <View style={styles.actionIconContainer}>
                <FontAwesome name="camera" size={22} color={theme.colors.buttonText} />
              </View>
              <View style={styles.actionTextContainer}>
                <Text style={[styles.buttonText, { color: theme.colors.buttonText }]}>
                  Capture with Camera
                </Text>
                <Text style={styles.buttonSubText}>
                  Take a photo of your document
                </Text>
              </View>
              <FontAwesome name="chevron-right" size={16} color={theme.colors.buttonText} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.historyButton, { 
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.primary 
            }]}
            onPress={() => navigation.navigate('History')}
            activeOpacity={0.8}
          >
            <FontAwesome name="history" size={20} color={theme.colors.primary} />
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
    paddingTop: 50,
    paddingBottom: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
   
  },
  scrollContent: {
    paddingBottom: 30,
  },
  infoSection: {
    margin: 20,
    padding: 20,
    borderRadius: 16,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    position: 'relative',
    overflow: 'visible',
  },
  infoBadge: {
    position: 'absolute',
    top: -12,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  infoBadgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
    marginLeft: 5,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 12,
  },
  infoDescription: {
    fontSize: 14,
    lineHeight: 22,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 25,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  featureCard: {
    width: '48%',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4.65,
    elevation: 6,
    alignItems: 'center',
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
    textAlign: 'center',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  dataTypesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: 20,
    padding: 20,
    borderRadius: 16,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4.65,
    elevation: 5,
  },
  dataTypeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    paddingVertical: 8,
  },
  dataTypeIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  dataTypeText: {
    fontSize: 13,
    fontWeight: '500',
  },
  actionContainer: {
    padding: 20,
  },
  actionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  actionButton: {
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4.65,
    elevation: 6,
    overflow: 'hidden',
  },
  actionButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  actionIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  actionTextContainer: {
    flex: 1,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonSubText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    marginTop: 8,
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  historyButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default HomeScreen;