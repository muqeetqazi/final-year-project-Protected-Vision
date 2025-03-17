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
import CarouselComponent from './components/Carousel';

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
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
      const options = {
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      };

      if (type === 'camera') {
        const result = await ImagePicker.launchCameraAsync({
          ...options,
          mediaTypes: [ImagePicker.MediaType.Images],
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
          const selectedAsset = result.assets[0];
          setSelectedMedia(selectedAsset);
          navigation.navigate('Preview', { 
            media: {
              uri: selectedAsset.uri,
              type: 'image',
              width: selectedAsset.width,
              height: selectedAsset.height
            }
          });
        }
      } else {
        const result = await ImagePicker.launchImageLibraryAsync({
          ...options,
          mediaTypes: [ImagePicker.MediaType.Images, ImagePicker.MediaType.Videos],
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
          const selectedAsset = result.assets[0];
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
      }
    } catch (error) {
      console.error('Error picking media:', error);
      alert('Error accessing media. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <FontAwesome name="user-circle" size={30} color="#43034d" />
        </TouchableOpacity>
        <Text style={styles.title}>Protected Vision</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <FontAwesome name="cog" size={30} color="#43034d" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <CarouselComponent data={carouselData} />

        <View style={styles.featuresContainer}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureCard}>
              <FontAwesome name={feature.icon} size={30} color="#43034d" />
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>
                {feature.description}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.actionContainer}>
          <Text style={styles.sectionTitle}>Protect Your Content</Text>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleMediaPicker('gallery')}
          >
            <FontAwesome name="image" size={24} color="#fff" />
            <Text style={styles.buttonText}>Select from Gallery</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleMediaPicker('camera')}
          >
            <FontAwesome name="camera" size={24} color="#fff" />
            <Text style={styles.buttonText}>Take Photo/Video</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.historyButton}
            onPress={() => navigation.navigate('History')}
          >
            <FontAwesome name="history" size={24} color="#43034d" />
            <Text style={styles.historyButtonText}>View History</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#43034d',
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
    backgroundColor: '#fff',
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
    color: '#43034d',
    marginTop: 10,
  },
  featureDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
  },
  actionContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#43034d',
    marginBottom: 15,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#43034d',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#43034d',
  },
  historyButtonText: {
    color: '#43034d',
    fontSize: 16,
    marginLeft: 10,
  },
});

export default HomeScreen;
