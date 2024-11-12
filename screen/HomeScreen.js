import { FontAwesome } from '@expo/vector-icons'; // For icon usage
import { useNavigation } from '@react-navigation/native';
import { Video } from 'expo-av'; // Import for video playback
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const HomeScreen = () => {
  const navigation = useNavigation();
   const [selectedMedia, setSelectedMedia] = useState(null); // Stores selected media (image or video)
   const [uploading, setUploading] = useState(false); // Uploading state
   const [uploadStatus, setUploadStatus] = useState(''); // Success or error message
   const [uploadedMediaUrl, setUploadedMediaUrl] = useState(null); // URL for uploaded media

   const API_KEY = 'e83a364d3917e3867767d6982404f314'; // Replace with your ImgBB API key

   // Request image/video picker permission
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
         mediaTypes: ImagePicker.MediaTypeOptions.All,  // Allow both images and videos
         allowsEditing: true,
         quality: 1,
      });

      console.log('Media Picker Result:', result);  // Log the result

      if (!result.canceled) {
         setSelectedMedia(result.assets[0]); // Store the selected media (image or video)
         setUploadStatus(''); // Clear previous upload status
         setUploadedMediaUrl(null); // Clear any previous uploaded media URL
      } else {
         console.log('Media selection was cancelled');
      }
   };

   const uploadMedia = async (mediaUri, mediaType) => {
      if (!mediaUri) return;
      setUploading(true);
      setUploadStatus(''); // Clear previous status

      let formData = new FormData();
      formData.append('image', {
         uri: mediaUri,
         type: mediaType === 'video' ? 'video/mp4' : 'image/jpeg',  // Set MIME type based on media type
         name: mediaType === 'video' ? 'uploaded_video.mp4' : 'uploaded_image.jpg',
      });

      try {
         const response = await fetch(`https://api.imgbb.com/1/upload?key=${API_KEY}`, {
            method: 'POST',
            body: formData,
            headers: {
               'Content-Type': 'multipart/form-data',
            },
         });

         const data = await response.json();
         console.log('API Response:', data); // Debugging log

         if (data.success) {
            setUploadedMediaUrl(data.data.url); // Store URL of the uploaded media
            setUploadStatus('Media uploaded successfully!');
         } else {
            console.error('Upload failed:', data);
            setUploadStatus('Media upload failed. Please try again.');
         }
      } catch (error) {
         console.error('Upload error:', error);
         setUploadStatus('An error occurred during upload.');
      } finally {
         setUploading(false);
      }
   };

   return (
      <View style={styles.container}>
        
         <Text style={styles.title}>Protected Vision</Text>
         <View style={styles.card}>
            <Text style={styles.subtitle}>Choose Media</Text>
            <TouchableOpacity onPress={pickMediaFromGallery} style={styles.button}>
               <FontAwesome name="photo" size={24} color="white" />
               <Text style={styles.buttonText}>Select Media</Text>
            </TouchableOpacity>
         </View>

         {/* Preview selected media */}
         {selectedMedia && selectedMedia.type === 'image' && (
            <Image source={{ uri: selectedMedia.uri }} style={styles.mediaPreview} />
         )}
         {selectedMedia && selectedMedia.type === 'video' && (
            <Video
               source={{ uri: selectedMedia.uri }}
               style={styles.mediaPreview}
               useNativeControls
               resizeMode="contain"
               isLooping
            />
         )}

         {/* Submit Button to upload */}
         {selectedMedia && (
            <TouchableOpacity 
               style={[styles.button, { marginTop: 20 }]} 
               onPress={() => uploadMedia(selectedMedia.uri, selectedMedia.type)}
               disabled={uploading}
            >
               <FontAwesome name="upload" size={24} color="white" />
               <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
         )}

         {/* Uploading Indicator */}
         {uploading && <ActivityIndicator size="large" color="#0000ff" />}

         {/* Display upload status message */}
         {uploadStatus ? <Text style={styles.statusText}>{uploadStatus}</Text> : null}

         {/* Display uploaded media URL or preview */}
         {uploadedMediaUrl && (
            <>
               <Text style={styles.subtitle}>Uploaded Media URL:</Text>
               <Text selectable style={styles.urlText}>{uploadedMediaUrl}</Text>
            </>
         )}
      </View>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      backgroundColor: '#f7f7f7', // Light background color
   },
   title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#4CAF50', // Greenish color
      marginBottom: 20,
   },
   subtitle: {
      fontSize: 18,
      marginTop: 20,
      color: '#333', // Dark text for subtitles
   },
   card: {
      width: '80%',
      padding: 20,
      backgroundColor: '#fff',
      borderRadius: 10,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
      alignItems: 'center',
      marginBottom: 20,
   },
   button: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#4CAF50', // Green button
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 5,
   },
   buttonText: {
      fontSize: 16,
      color: 'white',
      marginLeft: 10,
   },
   mediaPreview: {
      width: 300,
      height: 300,
      marginVertical: 15,
      borderRadius: 10,
   },
   statusText: {
      fontSize: 16,
      color: 'green',
      marginVertical: 10,
      textAlign: 'center',
   },
   urlText: {
      color: 'blue',
      textAlign: 'center',
      marginBottom: 10,
   },
});

export default HomeScreen;
