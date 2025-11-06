import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { API_CONFIG } from '../app/config/api';
import { useAuth } from '../app/context/AuthContext';
import { useTheme } from '../app/context/ThemeContext';
import { TokenManager } from '../app/services/AuthService';

const { width } = Dimensions.get('window');

const EditProfileScreen = ({ navigation }) => {
  const theme = useTheme();
  const { user, updateUser, logout } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [originalProfileImage, setOriginalProfileImage] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
  });
  const [userStats, setUserStats] = useState({
    total_documents_saved: 0,
    total_documents_processed: 0,
    total_sensitive_items_detected: 0,
    total_non_detected_items: 0,
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [hasChanges, setHasChanges] = useState(false);

  // Load profile data on component mount
  useEffect(() => {
    loadProfileData();
  }, []);

  // Check for changes when form data changes
  useEffect(() => {
    checkForChanges();
  }, [formData, profileImage]);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      const accessToken = await TokenManager.getAccessToken();
      
      console.log('Loading profile data...');
      const response = await axios.get(
        `${API_CONFIG.BASE_URL}/auth/profile/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Profile data loaded:', response.data);
      
      const userData = response.data;
      
      // Set form data
      setFormData({
        username: userData.username || '',
        first_name: userData.first_name || '',
        last_name: userData.last_name || '',
        email: userData.email || '',
      });

      // Set profile image
      if (userData.profile_image) {
        setOriginalProfileImage(userData.profile_image);
      }

      // Set user stats (read-only)
      setUserStats({
        total_documents_saved: userData.total_documents_saved || 0,
        total_documents_processed: userData.total_documents_processed || 0,
        total_sensitive_items_detected: userData.total_sensitive_items_detected || 0,
        total_non_detected_items: userData.total_non_detected_items || 0,
      });

    } catch (error) {
      console.error('Error loading profile data:', error);
      
      if (error.response?.status === 401) {
        Alert.alert(
          'Session Expired',
          'Your session has expired. Please log in again.',
          [
            {
              text: 'OK',
              onPress: async () => {
                await logout();
                navigation.replace('Auth');
              },
            },
          ]
        );
        return;
      }

      Alert.alert('Error', 'Failed to load profile data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const checkForChanges = () => {
    const hasFormChanges = user && (
      formData.username !== (user.username || '') ||
      formData.first_name !== (user.first_name || '') ||
      formData.last_name !== (user.last_name || '') ||
      formData.email !== (user.email || '')
    );
    
    const hasImageChanges = profileImage !== null;
    
    setHasChanges(hasFormChanges || hasImageChanges);
  };

  const handleImagePicker = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant camera roll permissions to update your profile picture.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setProfileImage(result.assets[0]);
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear field-specific error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.username.trim()) {
      errors.username = 'Username is required.';
    }
    if (!formData.first_name.trim()) {
      errors.first_name = 'First name is required.';
    }
    if (!formData.last_name.trim()) {
      errors.last_name = 'Last name is required.';
    }
    if (!formData.email.trim()) {
      errors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveProfile = async () => {
    if (!validateForm()) return;

    try {
      setSaving(true);
      setFieldErrors({});
      const accessToken = await TokenManager.getAccessToken();
      
      console.log('Saving profile...');
      console.log('Form data:', formData);
      console.log('Profile image changed:', profileImage !== null);

      let response;

      if (profileImage) {
        // Send FormData for image update
        const formDataToSend = new FormData();
        formDataToSend.append('username', formData.username.trim());
        formDataToSend.append('first_name', formData.first_name.trim());
        formDataToSend.append('last_name', formData.last_name.trim());
        formDataToSend.append('email', formData.email.trim());
        formDataToSend.append('profile_image', {
          uri: profileImage.uri,
          name: 'profile_image.jpg',
          type: 'image/jpeg',
        });

        console.log('Sending FormData with image...');
        response = await axios.put(
          `${API_CONFIG.BASE_URL}/auth/profile/`,
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );
      } else {
        // Send JSON for text-only update
        const updateData = {
          username: formData.username.trim(),
          first_name: formData.first_name.trim(),
          last_name: formData.last_name.trim(),
          email: formData.email.trim(),
        };

        console.log('Sending JSON data...');
        response = await axios.put(
          `${API_CONFIG.BASE_URL}/auth/profile/`,
          updateData,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        );
      }

      console.log('Profile update response:', response.data);

      // Update local user context
      updateUser(response.data);

      Alert.alert(
        'Success',
        'Profile updated successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error('Profile update error:', error);
      
      if (error.response?.status === 401) {
        Alert.alert(
          'Session Expired',
          'Your session has expired. Please log in again.',
          [
            {
              text: 'OK',
              onPress: async () => {
                await logout();
                navigation.replace('Auth');
              },
            },
          ]
        );
        return;
      }

      // Handle field-specific errors
      if (error.response?.data && typeof error.response.data === 'object') {
        const backendErrors = error.response.data;
        const fieldErrors = {};
        
        // Map backend field errors to form fields
        Object.keys(backendErrors).forEach(field => {
          if (Array.isArray(backendErrors[field]) && backendErrors[field].length > 0) {
            fieldErrors[field] = backendErrors[field][0]; // Take first error message
          }
        });
        
        setFieldErrors(fieldErrors);
        
        // Show general error if no specific field errors
        if (Object.keys(fieldErrors).length === 0) {
          const errorMessage = error.response.data.detail || 
                              error.response.data.message || 
                              'Failed to update profile. Please try again.';
          Alert.alert('Error', errorMessage);
        }
      } else {
        Alert.alert('Error', 'Failed to update profile. Please try again.');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      Alert.alert(
        'Discard Changes',
        'You have unsaved changes. Are you sure you want to discard them?',
        [
          { text: 'Keep Editing', style: 'cancel' },
          { text: 'Discard', style: 'destructive', onPress: () => navigation.goBack() },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.primary }]}>
        <StatusBar barStyle={theme.isDarkMode ? "light-content" : "dark-content"} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.primary }]}>
      <StatusBar barStyle={theme.isDarkMode ? "light-content" : "dark-content"} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={handleCancel}
        >
          <FontAwesome name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity 
          style={[styles.saveButton, { opacity: saving || !hasChanges ? 0.6 : 1 }]}
          onPress={handleSaveProfile}
          disabled={saving || !hasChanges}
        >
          {saving ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Save</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={[styles.content, { backgroundColor: theme.colors.background }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        {/* Profile Image Section */}
        <LinearGradient
          colors={[theme.colors.primary, theme.isDarkMode ? '#2c0233' : '#7a1a87']}
          style={styles.profileGradient}
        >
          <View style={styles.profileImageSection}>
            <View style={styles.profileImageContainer}>
              <Image
                source={
                  profileImage 
                    ? { uri: profileImage.uri }
                    : originalProfileImage
                    ? { uri: originalProfileImage }
                    : require('../assets/images/default-avatar.jpg')
                }
                style={styles.profileImage}
              />
              <TouchableOpacity 
                style={styles.editImageButton}
                onPress={handleImagePicker}
              >
                <FontAwesome name="camera" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
            <Text style={styles.editImageText}>Tap to change photo</Text>
          </View>
        </LinearGradient>

        {/* Form Section */}
        <View style={[styles.formContainer, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Personal Information
          </Text>

          {/* Username */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Username *</Text>
            <TextInput
              style={[
                styles.textInput, 
                { 
                  backgroundColor: theme.colors.background,
                  color: theme.colors.text,
                  borderColor: fieldErrors.username ? theme.colors.error : theme.colors.border
                }
              ]}
              value={formData.username}
              onChangeText={(text) => handleInputChange('username', text)}
              placeholder="Enter your username"
              placeholderTextColor={theme.colors.textSecondary}
              autoCapitalize="none"
            />
            {fieldErrors.username && (
              <Text style={[styles.errorText, { color: theme.colors.error }]}>
                {fieldErrors.username}
              </Text>
            )}
          </View>

          {/* First Name */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.colors.text }]}>First Name *</Text>
            <TextInput
              style={[
                styles.textInput, 
                { 
                  backgroundColor: theme.colors.background,
                  color: theme.colors.text,
                  borderColor: fieldErrors.first_name ? theme.colors.error : theme.colors.border
                }
              ]}
              value={formData.first_name}
              onChangeText={(text) => handleInputChange('first_name', text)}
              placeholder="Enter your first name"
              placeholderTextColor={theme.colors.textSecondary}
            />
            {fieldErrors.first_name && (
              <Text style={[styles.errorText, { color: theme.colors.error }]}>
                {fieldErrors.first_name}
              </Text>
            )}
          </View>

          {/* Last Name */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Last Name *</Text>
            <TextInput
              style={[
                styles.textInput, 
                { 
                  backgroundColor: theme.colors.background,
                  color: theme.colors.text,
                  borderColor: fieldErrors.last_name ? theme.colors.error : theme.colors.border
                }
              ]}
              value={formData.last_name}
              onChangeText={(text) => handleInputChange('last_name', text)}
              placeholder="Enter your last name"
              placeholderTextColor={theme.colors.textSecondary}
            />
            {fieldErrors.last_name && (
              <Text style={[styles.errorText, { color: theme.colors.error }]}>
                {fieldErrors.last_name}
              </Text>
            )}
          </View>

          {/* Email - Read Only */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Email Address</Text>
            <TextInput
              style={[
                styles.textInput, 
                { 
                  backgroundColor: theme.colors.background,
                  color: theme.colors.textSecondary,
                  borderColor: theme.colors.border
                }
              ]}
              value={formData.email}
              editable={false}
              placeholder="Email address"
              placeholderTextColor={theme.colors.textSecondary}
            />
            <Text style={[styles.readOnlyText, { color: theme.colors.textSecondary }]}>
              Email cannot be changed
            </Text>
          </View>
        </View>

        {/* Statistics Section - Read Only */}
        

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.cancelButton, { borderColor: theme.colors.border }]}
            onPress={handleCancel}
          >
            <Text style={[styles.cancelButtonText, { color: theme.colors.text }]}>
              Cancel
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.saveButtonLarge, 
              { 
                backgroundColor: theme.colors.primary,
                opacity: saving || !hasChanges ? 0.6 : 1 
              }
            ]}
            onPress={handleSaveProfile}
            disabled={saving || !hasChanges}
          >
            {saving ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>Save Changes</Text>
            )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 70,
    paddingBottom: 30,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 4,
  },
  saveButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  profileGradient: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingBottom: 30,
  },
  profileImageSection: {
    alignItems: 'center',
    paddingTop: 30,
  },
  profileImageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#fff',
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#43034d',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  editImageText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 10,
  },
  formContainer: {
    margin: 20,
    borderRadius: 15,
    padding: 20,
    elevation: 3,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
  },
  statsContainer: {
    margin: 20,
    marginTop: 0,
    borderRadius: 15,
    padding: 20,
    elevation: 3,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
  },
  errorText: {
    fontSize: 14,
    marginTop: 5,
  },
  readOnlyText: {
    fontSize: 12,
    marginTop: 5,
    fontStyle: 'italic',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 20,
    marginBottom: 30,
  },
  cancelButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonLarge: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    marginLeft: 10,
    alignItems: 'center',
  },
});

export default EditProfileScreen;