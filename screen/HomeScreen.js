import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CarouselComponent from '../screen/components/Carousel';

const { width: viewportWidth } = Dimensions.get('window');

const HomeScreen = () => {
   const carouselData = [
      {
        image: require('../assets/images/lock1.jpg'),
        text: 'Protect Your Data',
      },
      {
        image: require('../assets/images/lock2.jpeg'),
        text: 'YOUR OPINION MATTERS TO US WE WELCOME YOUR OPINIONS AND SUGGESTIONS',
      },
      {
        image: require('../assets/images/lock1.jpg'),
        text: 'PROTECT YOUR CRITICAL PERSONAL INFORMATION',
      },
      {
        image: require('../assets/images/bank.jpg'),
        text: 'PROTECT YOUR BANKING INFORMATION',
      },
   ];

   const navigation = useNavigation();
   const [selectedMedia, setSelectedMedia] = useState(null);

   useEffect(() => {
      const requestPermissions = async () => {
         const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
         if (status !== 'granted') {
            alert('Permission to access gallery is required!');
         }
      };
      requestPermissions();
   }, []);

   const pickMediaFromGallery = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
         mediaTypes: ImagePicker.MediaTypeOptions.All,
         allowsEditing: true,
         quality: 1,
      });

      if (!result.canceled) {
         setSelectedMedia(result.assets[0]);
         navigation.navigate('PreviewScreen', { media: result.assets[0] });
      }
   };

   const openCamera = async (mediaType) => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
         alert('Permission to access camera is required!');
         return;
      }

      let result = await ImagePicker.launchCameraAsync({
         mediaTypes:
            mediaType === 'video'
               ? ImagePicker.MediaTypeOptions.Videos
               : ImagePicker.MediaTypeOptions.Images,
         allowsEditing: true,
         quality: 1,
      });

      if (!result.canceled) {
         setSelectedMedia(result.assets[0]);
         navigation.navigate('PreviewScreen', { media: result.assets[0] });
      }
   };

   return (
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
         <Text style={styles.title}>Protected Vision</Text>
         
         {/* Carousel Section */}
         <View style={styles.carouselContainer}>
            <CarouselComponent data={carouselData} />
         </View>

         {/* Card Section */}
         <View style={styles.card}>
            <Text style={styles.subtitle}>Choose Media</Text>
            <TouchableOpacity onPress={pickMediaFromGallery} style={styles.button}>
               <FontAwesome name="photo" size={24} color="white" />
               <Text style={styles.buttonText}>Select Media</Text>
            </TouchableOpacity>
            <TouchableOpacity
               onPress={() => openCamera('image')}
               style={[styles.button, { marginTop: 15 }]}
            >
               <FontAwesome name="camera" size={24} color="white" />
               <Text style={styles.buttonText}>Capture Image</Text>
            </TouchableOpacity>
            <TouchableOpacity
               onPress={() => openCamera('video')}
               style={[styles.button, { marginTop: 15 }]}
            >
               <FontAwesome name="video-camera" size={24} color="white" />
               <Text style={styles.buttonText}>Capture Video</Text>
            </TouchableOpacity>
         </View>
      </ScrollView>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#f7f7f7',
   },
   scrollContent: {
      alignItems: 'center',
      paddingVertical: 20,
   },
   title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#43034d',
      marginBottom: 20,
   },
   carouselContainer: {
      width: viewportWidth ,
      marginBottom: 20,
   },
   card: {
      width: '90%',
      backgroundColor: '#fff',
      borderRadius: 10,
      padding: 20,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 5,
      marginBottom: 20,
   },
   subtitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 20,
   },
   button: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#43034d',
      paddingVertical: 15,
      paddingHorizontal: 25,
      borderRadius: 8,
      width: '100%',
   },
   buttonText: {
      fontSize: 16,
      color: 'white',
      marginLeft: 10,
   },
});

export default HomeScreen;
