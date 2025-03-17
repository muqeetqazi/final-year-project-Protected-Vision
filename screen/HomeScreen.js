import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useTheme } from '../app/context/ThemeContext';
import CarouselComponent from './components/Carousel';

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const theme = useTheme();
  const [selectedMedia, setSelectedMedia] = useState(null);

  const carouselData = [
    {
      image: require('../assets/images/lock1.jpg'),
      text: 'Protect Your Sensitive Content',
    },
    {
      image: require('../assets/images/lock2.jpeg'),
      text: 'Advanced AI Detection',
    },
    {
      image: require('../assets/images/bank.jpg'),
      text: 'Secure & Private',
    },
  ];

  const features = [
    {
      icon: 'shield',
      title: 'Content Protection',
      description: 'Detect and protect sensitive content automatically',
    },
    {
      icon: 'eye',
      title: 'AI Detection',
      description: 'Advanced AI algorithms for accurate detection',
    },
    {
      icon: 'lock',
      title: 'Privacy First',
      description: 'Your data stays private and secure',
    },
  ];

  useEffect(() => {
    requestPermissions();
  }, []);

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

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <FontAwesome name="user-circle" size={30} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text }]}>Protected Vision</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <FontAwesome name="cog" size={30} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <CarouselComponent data={carouselData} />

        <View style={styles.featuresContainer}>
          {features.map((feature, index) => (
            <View key={index} style={[styles.featureCard, { backgroundColor: theme.colors.surface }]}>
              <FontAwesome name={feature.icon} size={30} color={theme.colors.primary} />
              <Text style={[styles.featureTitle, { color: theme.colors.text }]}>{feature.title}</Text>
              <Text style={[styles.featureDescription, { color: theme.colors.textSecondary }]}>
                {feature.description}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.actionContainer}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Protect Your Content</Text>
          
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => handleMediaPicker('gallery')}
          >
            <FontAwesome name="image" size={24} color={theme.colors.buttonText} />
            <Text style={[styles.buttonText, { color: theme.colors.buttonText }]}>Select from Gallery</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => handleMediaPicker('camera')}
          >
            <FontAwesome name="camera" size={24} color={theme.colors.buttonText} />
            <Text style={[styles.buttonText, { color: theme.colors.buttonText }]}>Take Photo/Video</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.historyButton, { 
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.primary 
            }]}
            onPress={() => navigation.navigate('History')}
          >
            <FontAwesome name="history" size={24} color={theme.colors.primary} />
            <Text style={[styles.historyButtonText, { color: theme.colors.primary }]}>View History</Text>
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 20,
  },
  featureCard: {
    width: '48%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  featureDescription: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
  },
  actionContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 16,
    marginLeft: 10,
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    borderWidth: 1,
  },
  historyButtonText: {
    fontSize: 16,
    marginLeft: 10,
  },
});

export default HomeScreen;
