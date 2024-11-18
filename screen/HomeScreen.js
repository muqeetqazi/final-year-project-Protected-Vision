import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const HomeScreen = () => {
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
         <View style={styles.card}>
            <Text style={styles.subtitle}>Choose Media</Text>
            <TouchableOpacity onPress={pickMediaFromGallery} style={styles.button}>
               <FontAwesome name="photo" size={24} color="white" />
               <Text style={styles.buttonText}>Select Media</Text>
            </TouchableOpacity>
            <TouchableOpacity
               onPress={() => openCamera('image')}
               style={[styles.button, { marginTop: 10 }]}
            >
               <FontAwesome name="camera" size={24} color="white" />
               <Text style={styles.buttonText}>Capture Image</Text>
            </TouchableOpacity>
            <TouchableOpacity
               onPress={() => openCamera('video')}
               style={[styles.button, { marginTop: 10 }]}
            >
               <FontAwesome name="video-camera" size={24} color="white" />
               <Text style={styles.buttonText}>Capture Video</Text>
            </TouchableOpacity>
         </View>
      </ScrollView>
   );
};

const styles = StyleSheet.create({
   container: { flex: 1, backgroundColor: '#f7f7f7' },
   scrollContent: { alignItems: 'center', justifyContent: 'center', padding: 20 },
   title: { fontSize: 28, fontWeight: 'bold', color: '#43034d', marginBottom: 20 },
   subtitle: { fontSize: 18, marginTop: 20, color: '#333' },
   card: { width: '80%', padding: 20, backgroundColor: '#fff', borderRadius: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8, elevation: 5, alignItems: 'center', marginBottom: 20 },
   button: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#43034d', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 5 },
   buttonText: { fontSize: 16, color: 'white', marginLeft: 10 },
});

export default HomeScreen;
