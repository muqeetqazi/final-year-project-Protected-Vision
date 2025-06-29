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
   const theme = useTheme();

   const analyzeDocument = async () => {
      if (!media?.uri) return;
      setUploading(true);
      setUploadStatus('');
      try {
         let processedUri = media.blurResult;
         if (!processedUri) {
            setUploadStatus('No processed image found.');
            setUploading(false);
            return;
         }
         // If it's base64 and video, add prefix
         if (media.type === 'video' && !processedUri.startsWith('http') && !processedUri.startsWith('file:')) {
            processedUri = `data:video/mp4;base64,${processedUri}`;
         } else if (!processedUri.startsWith('http') && !processedUri.startsWith('file:')) {
            processedUri = `data:image/jpeg;base64,${processedUri}`;
         }
         navigation.navigate('Result', {
            media: {
               ...media,
               uri: processedUri,
               type: media.type
            }
         });
      } catch (error) {
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
