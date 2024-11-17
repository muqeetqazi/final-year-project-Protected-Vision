import { FontAwesome } from '@expo/vector-icons';
import { Video } from 'expo-av';
import React, { useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const PreviewScreen = ({ route, navigation }) => {
   const { media } = route.params; // Get the media passed from HomeScreen
   const [uploading, setUploading] = useState(false);
   const [uploadStatus, setUploadStatus] = useState('');
   const [uploadedMediaUrl, setUploadedMediaUrl] = useState(null);

   const API_KEY = 'e83a364d3917e3867767d6982404f314'; // Replace with your ImgBB API key

   const uploadMedia = async (mediaUri, mediaType) => {
      if (!mediaUri) return;
      setUploading(true);
      setUploadStatus('');

      let formData = new FormData();
      formData.append('image', {
         uri: mediaUri,
         type: mediaType === 'video' ? 'video/mp4' : 'image/jpeg',
         name: mediaType === 'video' ? 'uploaded_video.mp4' : 'uploaded_image.jpg',
      });

    try {
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${API_KEY}`, {
            method: 'POST',
            body: formData,
            headers: { 'Content-Type': 'multipart/form-data' },
         });

         const data = await response.json();

         if (data.success) {
            setUploadedMediaUrl(data.data.url);
            setUploadStatus('Media uploaded successfully!');
         } else {
            setUploadStatus('Media upload failed. Please try again.');
         }
      } catch (error) {
         setUploadStatus('An error occurred during upload.');
      } finally {
         setUploading(false);
      }
   };

   return (
      <View style={styles.container}>
         <Text style={styles.title}>Preview</Text>
         {media.type === 'image' && <Image source={{ uri: media.uri }} style={styles.mediaPreview} />}
         {media.type === 'video' && (
            <Video source={{ uri: media.uri }} style={styles.mediaPreview} useNativeControls resizeMode="contain" isLooping />
         )}

         {uploading ? (
            <ActivityIndicator size="large" color="#0000ff" />
         ) : (
            <TouchableOpacity
               style={[styles.button, { marginTop: 20 }]}
               onPress={() => uploadMedia(media.uri, media.type)}
            >
    <FontAwesome name="upload" size={24} color="white" />
               <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
         )}

         <TouchableOpacity
            style={[styles.button, { marginTop: 10 }]}
            onPress={() => navigation.goBack()}
        >
            <FontAwesome name="redo" size={24} color="white" />
            <Text style={styles.buttonText}>Retake</Text>
        </TouchableOpacity>

        {uploadStatus && <Text style={styles.statusText}>{uploadStatus}</Text>}
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
   container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f7f7f7' },
   title: { fontSize: 28, fontWeight: 'bold', color: '#4CAF50', marginBottom: 20 },
   mediaPreview: { width: 300, height: 300, marginVertical: 15, borderRadius: 10 },
   button: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#4CAF50', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 5 },
   buttonText: { fontSize: 16, color: 'white', marginLeft: 10 },
   statusText: { fontSize: 16, color: 'green', marginVertical: 10, textAlign: 'center' },
   urlText: { color: 'blue', textAlign: 'center', marginBottom: 10 },
});

export default PreviewScreen;
