import { FontAwesome } from '@expo/vector-icons';
import { Video } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { ActivityIndicator, Dimensions, Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../app/context/AuthContext';
import { useTheme } from '../app/context/ThemeContext';
import { detectBlur } from '../app/services/BlurDetectionService';

const { width, height } = Dimensions.get('window');

const PreviewScreen = ({ route, navigation }) => {
   const { media } = route.params;
   const { incrementDocumentSaved } = useAuth();
   const [uploading, setUploading] = useState(false);
   const [uploadStatus, setUploadStatus] = useState('');
   const [selectedModel, setSelectedModel] = useState('auto');
   const [selectedTrack, setSelectedTrack] = useState('fast');
   const [showModelSelection, setShowModelSelection] = useState(false);
   const theme = useTheme();

   const models = [
     { id: 'auto', name: 'Auto', description: 'Automatically detect the best model', icon: 'magic' },
     { id: 'plate', name: 'Plate', description: 'Optimized for license plates', icon: 'car' },
     { id: 'card', name: 'Card', description: 'Optimized for ID cards and documents', icon: 'id-card' },
     { id: 'text', name: 'Text', description: 'Optimized for text recognition', icon: 'file-text' },
   ];

   const tracks = [
     { id: 'fast', name: 'Fast', description: 'Quick processing with good accuracy', icon: 'bolt' },
     { id: 'slow', name: 'Slow', description: 'Thorough processing with high accuracy', icon: 'clock-o' },
   ];

   const analyzeDocument = async () => {
      if (!media?.uri) return;
      setUploading(true);
      setUploadStatus('Processing document...');
      
      try {
         // Track document upload
         await incrementDocumentSaved();
         
         // Determine file type and name
         let fileType = 'image/jpeg';
         let fileName = 'image.jpg';
         if (media.type === 'video' || (media.uri && media.uri.endsWith('.mp4'))) {
            fileType = 'video/mp4';
            fileName = 'video.mp4';
         }

         // Process document with selected model
         const resultPayload = await detectBlur(
            media.uri,
            fileType,
            fileName,
            selectedModel,
            undefined // API_KEY
         );

         // Prepare processed URI
         let processedUri = resultPayload?.base64;
         if (!processedUri) {
            setUploadStatus('No processed result found.');
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
               type: media.type,
               documentId: media.documentId,
               meta: resultPayload?.meta
            }
         });
      } catch (error) {
         console.error('Analysis error:', error);
         setUploadStatus('An error occurred during document analysis.');
      } finally {
         setUploading(false);
      }
   };

   const getSelectedModelInfo = () => {
      return models.find(model => model.id === selectedModel) || models[0];
   };

   const getSelectedTrackInfo = () => {
      return tracks.find(track => track.id === selectedTrack) || tracks[0];
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

         <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
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

            {/* Model Selection */}
            <View style={[styles.sectionContainer, { backgroundColor: theme.colors.surface }]}>
               <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Detection Model</Text>
               <TouchableOpacity
                  style={[styles.selectionCard, { 
                     backgroundColor: theme.colors.background,
                     borderColor: theme.colors.primary 
                  }]}
                  onPress={() => setShowModelSelection(true)}
               >
                  <View style={styles.selectionContent}>
                     <View style={[styles.selectionIcon, { backgroundColor: theme.colors.primary }]}>
                        <FontAwesome name={getSelectedModelInfo().icon} size={20} color="#fff" />
                     </View>
                     <View style={styles.selectionText}>
                        <Text style={[styles.selectionName, { color: theme.colors.text }]}>
                           {getSelectedModelInfo().name}
                        </Text>
                        <Text style={[styles.selectionDescription, { color: theme.colors.textSecondary }]}>
                           {getSelectedModelInfo().description}
                        </Text>
                     </View>
                     <FontAwesome name="chevron-right" size={16} color={theme.colors.textSecondary} />
                  </View>
               </TouchableOpacity>
            </View>

            {/* Track Selection */}
            <View style={[styles.sectionContainer, { backgroundColor: theme.colors.surface }]}>
               <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Processing Speed</Text>
               <View style={styles.trackContainer}>
                  {tracks.map((track) => (
                     <TouchableOpacity
                        key={track.id}
                        style={[
                           styles.trackCard,
                           { 
                              backgroundColor: selectedTrack === track.id ? theme.colors.primary : theme.colors.background,
                              borderColor: selectedTrack === track.id ? theme.colors.primary : theme.colors.border
                           }
                        ]}
                        onPress={() => setSelectedTrack(track.id)}
                     >
                        <View style={styles.trackContent}>
                           <FontAwesome 
                              name={track.icon} 
                              size={18} 
                              color={selectedTrack === track.id ? '#fff' : theme.colors.primary} 
                           />
                           <Text style={[
                              styles.trackName,
                              { color: selectedTrack === track.id ? '#fff' : theme.colors.text }
                           ]}>
                              {track.name}
                           </Text>
                        </View>
                        <Text style={[
                           styles.trackDescription,
                           { color: selectedTrack === track.id ? 'rgba(255,255,255,0.8)' : theme.colors.textSecondary }
                        ]}>
                           {track.description}
                        </Text>
                     </TouchableOpacity>
                  ))}
               </View>
            </View>

            {/* Info Banner */}
            <View style={[styles.infoBanner, { backgroundColor: theme.colors.primary }]}>
               <FontAwesome name="info-circle" size={20} color="#fff" style={styles.infoIcon} />
               <Text style={styles.infoText}>
                  Our AI will scan this document for sensitive information such as IDs, financial data, and personal identifiers.
               </Text>
            </View>
         </ScrollView>

         {/* Action Buttons */}
         <View style={[styles.actionContainer, { 
            backgroundColor: theme.colors.surface,
            shadowColor: theme.isDarkMode ? '#000' : '#888'
         }]}>
            {uploading ? (
               <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={theme.colors.primary} />
                  <Text style={[styles.loadingText, { color: theme.colors.primary }]}>
                     {uploadStatus || 'Analyzing document for sensitive information...'}
                  </Text>
               </View>
            ) : (
               <>
                  <TouchableOpacity
                     style={[styles.button, styles.submitButton, { backgroundColor: theme.colors.primary }]}
                     onPress={analyzeDocument}
                     disabled={uploading}
                  >
                     <LinearGradient
                        colors={[theme.colors.primary, theme.isDarkMode ? '#2c0233' : '#7a1a87']}
                        style={styles.buttonGradient}
                     >
                        <FontAwesome name="search" size={24} color="white" />
                        <Text style={styles.buttonText}>Analyze for Sensitive Data</Text>
                     </LinearGradient>
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
            {uploadStatus && !uploading && (
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

         {/* Model Selection Modal */}
         <Modal
            visible={showModelSelection}
            transparent
            animationType="slide"
            onRequestClose={() => setShowModelSelection(false)}
         >
            <View style={styles.modalOverlay}>
               <View style={[styles.modalContainer, { backgroundColor: theme.colors.surface }]}>
                  <View style={styles.modalHeader}>
                     <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Choose Detection Model</Text>
                     <TouchableOpacity
                        style={styles.modalCloseButton}
                        onPress={() => setShowModelSelection(false)}
                     >
                        <FontAwesome name="times" size={20} color={theme.colors.textSecondary} />
                     </TouchableOpacity>
                  </View>
                  
                  <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
                     {models.map((model) => (
                        <TouchableOpacity
                           key={model.id}
                           style={[
                              styles.modelCard,
                              { 
                                 backgroundColor: selectedModel === model.id ? theme.colors.primary : theme.colors.background,
                                 borderColor: selectedModel === model.id ? theme.colors.primary : theme.colors.border
                              }
                           ]}
                           onPress={() => {
                              setSelectedModel(model.id);
                              setShowModelSelection(false);
                           }}
                        >
                           <View style={styles.modelContent}>
                              <View style={[
                                 styles.modelIcon,
                                 { 
                                    backgroundColor: selectedModel === model.id ? 'rgba(255,255,255,0.2)' : theme.colors.primary 
                                 }
                              ]}>
                                 <FontAwesome 
                                    name={model.icon} 
                                    size={24} 
                                    color={selectedModel === model.id ? '#fff' : '#fff'} 
                                 />
                              </View>
                              <View style={styles.modelText}>
                                 <Text style={[
                                    styles.modelName,
                                    { color: selectedModel === model.id ? '#fff' : theme.colors.text }
                                 ]}>
                                    {model.name}
                                 </Text>
                                 <Text style={[
                                    styles.modelDescription,
                                    { color: selectedModel === model.id ? 'rgba(255,255,255,0.8)' : theme.colors.textSecondary }
                                 ]}>
                                    {model.description}
                                 </Text>
                              </View>
                              {selectedModel === model.id && (
                                 <FontAwesome name="check-circle" size={20} color="#fff" />
                              )}
                           </View>
                        </TouchableOpacity>
                     ))}
                  </ScrollView>
               </View>
            </View>
         </Modal>
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
   scrollView: {
      flex: 1,
   },
   mediaContainer: {
      height: height * 0.35,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
   },
   mediaPreview: {
      width: width,
      height: height * 0.35,
   },
   sectionContainer: {
      marginHorizontal: 20,
      marginBottom: 20,
      borderRadius: 16,
      padding: 20,
      shadowOffset: {
         width: 0,
         height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
   },
   sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 16,
   },
   selectionCard: {
      borderRadius: 12,
      borderWidth: 1,
      padding: 16,
   },
   selectionContent: {
      flexDirection: 'row',
      alignItems: 'center',
   },
   selectionIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
   },
   selectionText: {
      flex: 1,
   },
   selectionName: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 4,
   },
   selectionDescription: {
      fontSize: 14,
   },
   trackContainer: {
      flexDirection: 'row',
      gap: 12,
   },
   trackCard: {
      flex: 1,
      borderRadius: 12,
      borderWidth: 1,
      padding: 16,
      alignItems: 'center',
   },
   trackContent: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
   },
   trackName: {
      fontSize: 16,
      fontWeight: '600',
      marginLeft: 8,
   },
   trackDescription: {
      fontSize: 12,
      textAlign: 'center',
      lineHeight: 16,
   },
   infoBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      marginHorizontal: 20,
      marginBottom: 20,
      borderRadius: 12,
   },
   infoIcon: {
      marginRight: 12,
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
      borderRadius: 12,
      marginVertical: 8,
      overflow: 'hidden',
   },
   buttonGradient: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 15,
      paddingHorizontal: 30,
   },
   submitButton: {
      backgroundColor: '#43034d',
   },
   retakeButton: {
      backgroundColor: '#fff',
      borderWidth: 1,
      borderColor: '#43034d',
      paddingVertical: 15,
      paddingHorizontal: 30,
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
   // Modal styles
   modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'flex-end',
   },
   modalContainer: {
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      maxHeight: height * 0.7,
   },
   modalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: '#e0e0e0',
   },
   modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
   },
   modalCloseButton: {
      padding: 8,
   },
   modalContent: {
      padding: 20,
   },
   modelCard: {
      borderRadius: 12,
      borderWidth: 1,
      marginBottom: 12,
      padding: 16,
   },
   modelContent: {
      flexDirection: 'row',
      alignItems: 'center',
   },
   modelIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
   },
   modelText: {
      flex: 1,
   },
   modelName: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 4,
   },
   modelDescription: {
      fontSize: 14,
      lineHeight: 20,
   },
});

export default PreviewScreen;
