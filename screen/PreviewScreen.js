import { FontAwesome } from '@expo/vector-icons';
import { Video } from 'expo-av';
import React, { useState } from 'react';
import { ActivityIndicator, Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../app/context/ThemeContext';

const { width, height } = Dimensions.get('window');

const PreviewScreen = ({ route, navigation }) => {
   const { media } = route.params;
   const [uploading, setUploading] = useState(false);
   const [uploadStatus, setUploadStatus] = useState('');
   const [uploadedMediaUrl, setUploadedMediaUrl] = useState(null);
   const theme = useTheme();

   const API_KEY = 'e83a364d3917e3867767d6982404f314';

   const analyzeDocument = async () => {
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

         // In a real app, this would be your ML model API endpoint
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
            setUploadStatus('Document analyzed successfully!');
            
            // Mock sensitive data detection results
            const mockDetectionResults = {
               sensitiveDataFound: true,
               detectedItems: [
                  { type: 'Credit Card Number', confidence: 0.95, location: 'Top right' },
                  { type: 'Email Address', confidence: 0.89, location: 'Middle section' },
                  { type: 'Phone Number', confidence: 0.92, location: 'Bottom left' },
                  { type: 'National ID', confidence: 0.97, location: 'Header' }
               ],
               riskLevel: 'High',
               recommendations: [
                  'Redact credit card information',
                  'Remove personal identifiers before sharing',
                  'Encrypt document for storage'
               ]
            };
            
            // Navigate to Result screen with detection results
            navigation.navigate('Result', { 
               media: {
                  ...media,
                  uploadedUrl: data.data.url
               },
               detectionResults: mockDetectionResults
            });
         } else {
            setUploadStatus('Analysis failed. Please try again.');
         }
      } catch (error) {
         console.error('Analysis error:', error);
         setUploadStatus('An error occurred during document analysis.');
      } finally {
         setUploading(false);
      }
   };

   if (!media?.uri) {
      return (
         <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.errorText, { color: theme.colors.error }]}>No document selected</Text>
         </View>
      );
   }

   return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
         {/* Header */}
         <View style={[styles.header, { 
            backgroundColor: theme.colors.surface,
            borderBottomColor: theme.colors.border
         }]}>
            <TouchableOpacity
               style={styles.backButton}
               onPress={() => navigation.goBack()}
            >
               <FontAwesome name="arrow-left" size={24} color={theme.colors.primary} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Document Preview</Text>
            <View style={{ width: 24 }} />
         </View>

         {/* Document Preview Container */}
         <View style={[styles.mediaContainer, { backgroundColor: theme.isDarkMode ? '#000' : '#f0f0f0' }]}>
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

         {/* Info Banner */}
         <View style={[styles.infoBanner, { backgroundColor: theme.colors.primary }]}>
            <FontAwesome name="info-circle" size={20} color="#fff" style={styles.infoIcon} />
            <Text style={styles.infoText}>
               Our AI will scan this document for sensitive information such as IDs, financial data, and personal identifiers.
            </Text>
         </View>

         {/* Action Buttons */}
         <View style={[styles.actionContainer, { 
            backgroundColor: theme.colors.surface,
            shadowColor: theme.isDarkMode ? '#000' : '#888'
         }]}>
            {uploading ? (
               <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={theme.colors.primary} />
                  <Text style={[styles.loadingText, { color: theme.colors.primary }]}>
                     Analyzing document for sensitive information...
                  </Text>
               </View>
            ) : (
               <>
                  <TouchableOpacity
                     style={[styles.button, styles.submitButton, { backgroundColor: theme.colors.primary }]}
                     onPress={analyzeDocument}
                  >
                     <FontAwesome name="search" size={24} color="white" />
                     <Text style={styles.buttonText}>Analyze for Sensitive Data</Text>
                  </TouchableOpacity>

         <TouchableOpacity
                     style={[styles.button, styles.retakeButton, { 
                        backgroundColor: theme.colors.surface,
                        borderColor: theme.colors.primary 
                     }]}
            onPress={() => navigation.goBack()}
        >
                     <FontAwesome name="refresh" size={24} color={theme.colors.primary} />
                     <Text style={[styles.buttonText, { color: theme.colors.primary }]}>Scan Different Document</Text>
        </TouchableOpacity>
            </>
    )}

            {/* Status Display */}
            {uploadStatus && (
               <View style={[styles.statusContainer, { backgroundColor: theme.colors.background }]}>
                  <Text style={[
                     styles.statusText,
                     { color: uploadStatus.includes('successfully') ? theme.colors.success : theme.colors.error }
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
   },
   header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingTop: 50,
      paddingBottom: 20,
      borderBottomWidth: 1,
   },
   headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
   },
   backButton: {
      padding: 8,
   },
   mediaContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
   },
   mediaPreview: {
      width: width,
      height: height * 0.4,
   },
   infoBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
   },
   infoIcon: {
      marginRight: 10,
   },
   infoText: {
      color: '#fff',
      fontSize: 14,
      flex: 1,
      lineHeight: 20,
   },
   actionContainer: {
      padding: 20,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
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
      fontWeight: '500',
      textAlign: 'center',
   },
   statusContainer: {
      marginTop: 20,
      padding: 15,
      borderRadius: 12,
   },
   statusText: {
      fontSize: 16,
      textAlign: 'center',
      fontWeight: '500',
   },
   errorText: {
      fontSize: 16,
      textAlign: 'center',
      marginTop: 20,
   },
});

export default PreviewScreen;
