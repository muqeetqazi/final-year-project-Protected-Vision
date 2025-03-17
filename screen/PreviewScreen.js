import { FontAwesome } from '@expo/vector-icons';
import { Video } from 'expo-av';
import React, { useState } from 'react';
import { ActivityIndicator, Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

const PreviewScreen = ({ route, navigation }) => {
   const { media } = route.params;
   const [uploading, setUploading] = useState(false);
   const [uploadStatus, setUploadStatus] = useState('');
   const [uploadedMediaUrl, setUploadedMediaUrl] = useState(null);

   const API_KEY = 'e83a364d3917e3867767d6982404f314';

   const uploadMedia = async () => {
      if (!media?.uri) return;
      setUploading(true);
      setUploadStatus('');

      try {
         const formData = new FormData();
         formData.append('image', {
            uri: media.uri,
            type: media.type === 'video' ? 'video/mp4' : 'image/jpeg',
            name: media.type === 'video' ? 'uploaded_video.mp4' : 'uploaded_image.jpg',
         });

         const response = await fetch(`https://api.imgbb.com/1/upload?key=${API_KEY}`, {
            method: 'POST',
            body: formData,
            headers: {
               'Content-Type': 'multipart/form-data',
            },
         });

         const data = await response.json();

         if (data.success) {
            setUploadedMediaUrl(data.data.url);
            setUploadStatus('Media uploaded successfully!');
            // Navigate to Result screen after successful upload
            navigation.navigate('Result', { 
               media: {
                  ...media,
                  uploadedUrl: data.data.url
               }
            });
         } else {
            setUploadStatus('Upload failed. Please try again.');
         }
      } catch (error) {
         console.error('Upload error:', error);
         setUploadStatus('An error occurred during upload.');
      } finally {
         setUploading(false);
      }
   };

   if (!media?.uri) {
      return (
         <View style={styles.container}>
            <Text style={styles.errorText}>No media selected</Text>
         </View>
      );
   }

   return (
      <View style={styles.container}>
         {/* Header */}
         <View style={styles.header}>
            <TouchableOpacity 
               style={styles.backButton}
               onPress={() => navigation.goBack()}
            >
               <FontAwesome name="arrow-left" size={24} color="#43034d" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Preview</Text>
            <View style={{ width: 24 }} />
         </View>

         {/* Media Preview Container */}
         <View style={styles.mediaContainer}>
            {media.type === 'video' ? (
               <Video 
                  source={{ uri: media.uri }} 
                  style={styles.mediaPreview}
                  useNativeControls
                  resizeMode="contain"
                  shouldPlay={false}
                  isLooping
               />
            ) : (
               <Image 
                  source={{ uri: media.uri }} 
                  style={styles.mediaPreview}
                  resizeMode="contain"
               />
            )}
         </View>

         {/* Action Buttons */}
         <View style={styles.actionContainer}>
            {uploading ? (
               <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#43034d" />
                  <Text style={styles.loadingText}>Uploading...</Text>
               </View>
            ) : (
               <>
                  <TouchableOpacity
                     style={[styles.button, styles.submitButton]}
                     onPress={uploadMedia}
                  >
                     <FontAwesome name="upload" size={24} color="white" />
                     <Text style={styles.buttonText}>Submit for Analysis</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                     style={[styles.button, styles.retakeButton]}
                     onPress={() => navigation.goBack()}
                  >
                     <FontAwesome name="refresh" size={24} color="#43034d" />
                     <Text style={[styles.buttonText, { color: '#43034d' }]}>Take New Photo</Text>
                  </TouchableOpacity>
               </>
            )}

            {/* Status Display */}
            {uploadStatus && (
               <View style={styles.statusContainer}>
                  <Text style={[
                     styles.statusText,
                     { color: uploadStatus.includes('successfully') ? '#4CAF50' : '#f44336' }
                  ]}>
                     {uploadStatus}
                  </Text>
               </View>
            )}
         </View>
      </View>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#f8f9fa',
   },
   header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingTop: 50,
      paddingBottom: 20,
      backgroundColor: '#fff',
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
   },
   headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#43034d',
   },
   backButton: {
      padding: 8,
   },
   mediaContainer: {
      flex: 1,
      backgroundColor: '#000',
      justifyContent: 'center',
      alignItems: 'center',
   },
   mediaPreview: {
      width: width,
      height: height * 0.4,
   },
   actionContainer: {
      backgroundColor: '#fff',
      padding: 20,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      shadowColor: '#000',
      shadowOffset: {
         width: 0,
         height: -3,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4.65,
      elevation: 6,
   },
   button: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 15,
      paddingHorizontal: 30,
      borderRadius: 12,
      marginVertical: 8,
   },
   submitButton: {
      backgroundColor: '#43034d',
   },
   retakeButton: {
      backgroundColor: '#fff',
      borderWidth: 1,
      borderColor: '#43034d',
   },
   buttonText: {
      fontSize: 18,
      fontWeight: '600',
      color: '#fff',
      marginLeft: 12,
   },
   loadingContainer: {
      alignItems: 'center',
      padding: 20,
   },
   loadingText: {
      marginTop: 12,
      fontSize: 16,
      color: '#43034d',
      fontWeight: '500',
   },
   statusContainer: {
      marginTop: 20,
      padding: 15,
      borderRadius: 12,
      backgroundColor: '#f8f9fa',
   },
   statusText: {
      fontSize: 16,
      textAlign: 'center',
      fontWeight: '500',
   },
   errorText: {
      fontSize: 16,
      color: '#f44336',
      textAlign: 'center',
      marginTop: 20,
   },
});

export default PreviewScreen;
