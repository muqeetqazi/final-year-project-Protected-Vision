import { FontAwesome } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import FormData from 'form-data';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useAuth } from '../app/context/AuthContext';
import { useTheme } from '../app/context/ThemeContext';
// import { detectBlur } from '../app/services/BlurDetectionService'; // Moved to PreviewScreen
import NotificationService from '../app/services/NotificationService';
import CarouselComponent from './components/Carousel';

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const theme = useTheme();
  const { incrementDocumentSaved, incrementDocumentProcessed, incrementSensitiveDetected, incrementNonDetected } = useAuth();
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [documentId, setDocumentId] = useState(null);
  const [uploading, setUploading] = useState(false);
  // Processing moved to PreviewScreen

  const carouselData = [
    {
      image: require('../assets/images/lock1.jpg'),
      text: 'Protect Your Passwords',
    },
    {
      image: require('../assets/images/lock2.jpeg'),
      text: 'AI-Powered Sensitive Data Detection',
    },
    {
      image: require('../assets/images/bank.jpg'),
      text: 'Secure Credit Card & Personal Information',
    },
  ];

  const features = [
    {
      icon: 'id-card',
      title: 'Driver License Detection',
      description: 'Protect driver\'s license data',
    },
    {
      icon: 'credit-card',
      title: 'Credit Card Protection',
      description: 'Secure credit card numbers',
    },
    {
      icon: 'envelope',
      title: 'Email Address Security',
      description: 'Find and protect emails',
    },
    {
      icon: 'hashtag',
      title: 'Transaction & Reference IDs',
      description: 'Detect IDs and account numbers',
    },
    {
      icon: 'key',
      title: 'Password Protection',
      description: 'Detect login credentials',
    },
    {
      icon: 'id-badge',
      title: 'Personal Identification Numbers',
      description: 'Detect personal ID numbers',
    },
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
    
    // Request audio permission for video recording
    const { status: audioStatus } = await Audio.requestPermissionsAsync();
    
    if (cameraStatus !== 'granted' || libraryStatus !== 'granted') {
      alert('Sorry, we need camera and media library permissions to make this work!');
    }
    if (audioStatus !== 'granted') {
      console.warn('Audio permission not granted - video recording may not work');
    }
  };

   const handleMediaPicker = async (type, mediaType = 'all') => {
     try {
       let result;
       if (type === 'camera') {
         if (mediaType === 'video') {
           // Explicitly capture video
           result = await ImagePicker.launchCameraAsync({
             mediaTypes: ImagePicker.MediaTypeOptions.Videos,
             allowsEditing: false,
             videoMaxDuration: 60, // 60 seconds max
           });
         } else {
           // Capture photo (default)
           result = await ImagePicker.launchCameraAsync({
             mediaTypes: ImagePicker.MediaTypeOptions.Images,
             allowsEditing: false,
             quality: 1,
           });
         }
       } else {
         result = await ImagePicker.launchImageLibraryAsync({
           allowsEditing: false,
           quality: 1,
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
        setUploading(true);
        
        try {
          // Create FormData for Django upload
          const formData = new FormData();
          
          const documentTitle = `Document ${new Date().toISOString()}`;
          const fileType = selectedAsset.type === 'video' ? 'video' : 'image';
          const fileName = selectedAsset.type === 'video' ? 'video.mp4' : 'image.jpg';
          const mimeType = selectedAsset.type === 'video' ? 'video/mp4' : 'image/jpeg';
          
          formData.append("title", documentTitle);
          formData.append("file_type", fileType);
          formData.append("file", {
            uri: selectedAsset.uri,
            name: fileName,
            type: mimeType,
          });

          // Debugging: Log all form entries
          console.log("=== FormData Debug ===");
          for (let pair of formData.entries()) {
            console.log(pair[0] + ": ", pair[1]);
          }
          console.log("=====================");

          // Get access token for debugging
          const { TokenManager } = require('../app/services/AuthService');
          const accessToken = await TokenManager.getAccessToken();
          
          // Log request headers
          console.log("Upload headers:", {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'multipart/form-data'
          });

          // Make direct axios call for better error handling
          const { API_CONFIG } = require('../app/config/api');
          
          const uploadUrl = `${API_CONFIG.BASE_URL}/documents/`;
          console.log("Upload URL:", uploadUrl);
          
          try {
            const response = await axios.post(
              uploadUrl,
              formData,
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                  'Content-Type': 'multipart/form-data',
                },
              }
            );
            console.log("Upload success:", response.data);
            
            const uploadResult = {
              success: true,
              data: response.data
            };
            
            if (uploadResult.success) {
              const docId = uploadResult.data.id;
              setDocumentId(docId);
              
              // Update local stats
              await incrementDocumentSaved();
              
              // Determine file type for navigation
              let navType = 'image';
              if (selectedAsset.type === 'video' || (selectedAsset.uri && selectedAsset.uri.endsWith('.mp4'))) {
                navType = 'video';
              }

              // Navigate to PreviewScreen with document ID
              navigation.navigate('Preview', {
                media: {
                  uri: selectedAsset.uri,
                  type: navType,
                  width: selectedAsset.width,
                  height: selectedAsset.height,
                  documentId: docId, // Pass Django document ID
                }
              });
            }
            
          } catch (axiosError) {
            // Enhanced error logging
            if (axiosError.response) {
              console.log("Upload failed:", axiosError.response.status, axiosError.response.data);
              console.log("Response headers:", axiosError.response.headers);
              console.log("Request config:", axiosError.config);
              alert(`Upload failed: ${axiosError.response.status} - ${JSON.stringify(axiosError.response.data)}`);
            } else if (axiosError.request) {
              console.log("Upload error - No response received:", axiosError.request);
              alert('Upload failed: No response from server');
            } else {
              console.log("Upload error:", axiosError.message);
              alert(`Upload error: ${axiosError.message}`);
            }
            return;
          }
        } catch (error) {
          console.error('Upload error:', error);
          alert('Error uploading document. Please try again.');
        } finally {
          setUploading(false);
        }
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
            Our advanced machine learning model identifies and protects sensitive information in your photo and Videos, including personal identifiers, financial data, and vehicle number plates.
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
                <FontAwesome name={feature.icon} size={18} color="#fff" />
              </LinearGradient>
              <Text style={[styles.featureTitle, { color: theme.colors.text }]}>{feature.title}</Text>
            </View>
          ))}
        </View>

        <View style={styles.actionContainer}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Scan Your Document</Text>
          
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.colors.primary, marginTop: 10 }]}
            onPress={() => handleMediaPicker('gallery')}
            disabled={uploading}
          >
            <LinearGradient
              colors={[theme.colors.primary, theme.isDarkMode ? '#2c0233' : '#7a1a87']}
              style={styles.actionButtonGradient}
            >
              {uploading ? (
                <>
                  <ActivityIndicator size="small" color="#fff" />
                  <Text style={styles.buttonText}>Uploading...</Text>
                </>
              ) : (
                <>
                  <FontAwesome name="file-image-o" size={24} color="#fff" />
                  <Text style={styles.buttonText}>Select Media from Gallery</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.colors.primary, marginTop: 15 }]}
            onPress={() => handleMediaPicker('camera', 'photo')}
            disabled={uploading}
          >
            <LinearGradient
              colors={[theme.colors.primary, theme.isDarkMode ? '#2c0233' : '#7a1a87']}
              style={styles.actionButtonGradient}
            >
              {uploading ? (
                <>
                  <ActivityIndicator size="small" color="#fff" />
                  <Text style={styles.buttonText}>Uploading...</Text>
                </>
              ) : (
                <>
                  <FontAwesome name="camera" size={24} color="#fff" />
                  <Text style={styles.buttonText}>Capture with Camera</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.colors.primary, marginTop: 15 }]}
            onPress={() => handleMediaPicker('camera', 'video')}
            disabled={uploading}
          >
            <LinearGradient
              colors={[theme.colors.primary, theme.isDarkMode ? '#2c0233' : '#7a1a87']}
              style={styles.actionButtonGradient}
            >
              {uploading ? (
                <>
                  <ActivityIndicator size="small" color="#fff" />
                  <Text style={styles.buttonText}>Uploading...</Text>
                </>
              ) : (
                <>
                  <FontAwesome name="video-camera" size={24} color="#fff" />
                  <Text style={styles.buttonText}>Capture Video with Camera</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

        </View>
      </ScrollView>

      {/* Processing moved to PreviewScreen */}

      {/* Model selection moved to PreviewScreen */}
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
    paddingHorizontal: 30,
    paddingBottom: 30,
    paddingTop: Platform.OS === 'ios' ? 100 : 70,
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
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 12,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  featureCard: {
    width: '48%',
    padding: 14,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 14,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
  },
  actionContainer: {
    padding: 20,
    paddingBottom: 30,
    marginTop: 20,
    marginBottom: 20,
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
});

export default HomeScreen;
