import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../app/context/AuthContext';
import { useTheme } from '../app/context/ThemeContext';

const { width, height } = Dimensions.get('window');

const AuthScreen = ({ navigation }) => {
  const theme = useTheme();
  const { login, register, isLoading, error, clearError, isAuthenticated } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Clear errors when switching between login/signup
  useEffect(() => {
    clearError();
    setValidationErrors({});
  }, [isLogin, clearError]);

  // Navigate to Home when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigation.replace('Home');
    }
  }, [isAuthenticated, navigation]);

  const validateForm = () => {
    const errors = {};

    // Email validation
    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!password.trim()) {
      errors.password = 'Password is required';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters long';
    }

    // Sign up specific validations
    if (!isLogin) {
      if (!firstName.trim()) {
        errors.firstName = 'First name is required';
      }
      if (!lastName.trim()) {
        errors.lastName = 'Last name is required';
      }
      if (!username.trim()) {
        errors.username = 'Username is required';
      }
      if (!confirmPassword.trim()) {
        errors.confirmPassword = 'Please confirm your password';
      } else if (password !== confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAuth = async () => {
    if (!validateForm()) {
      return;
    }

    clearError();

    if (isLogin) {
      const result = await login(email.trim(), password);
      if (result.success) {
        navigation.replace('Home');
      } else {
        Alert.alert('Login Failed', result.error || 'Invalid credentials');
      }
    } else {
      const userData = {
        email: email.trim(),
        password,
        password2: confirmPassword,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        username: username.trim(),
      };

      const result = await register(userData);
      if (result.success) {
        Alert.alert(
          'Registration Successful',
          result.message || 'Account created successfully. Please login.',
          [
            {
              text: 'OK',
              onPress: () => {
                setIsLogin(true);
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                setFirstName('');
                setLastName('');
                setUsername('');
              }
            }
          ]
        );
      } else {
        Alert.alert('Registration Failed', result.error || 'Failed to create account');
      }
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setValidationErrors({});
    clearError();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        <LinearGradient
          colors={[theme.colors.primary, theme.isDarkMode ? '#2c0233' : '#7a1a87']}
          style={styles.headerGradient}
        >
          <View style={styles.logoContainer}>
          <Image
              source={require('../assets/images/icon.png')}
            style={styles.logo}
              resizeMode="contain"
          />
            <Text style={styles.appName}>Protected Vision</Text>
            <Text style={styles.tagline}>
              Secure your sensitive information with AI
          </Text>
        </View>
        </LinearGradient>

        <View style={[styles.authContainer, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tabButton,
                isLogin && [styles.activeTab, { borderBottomColor: theme.colors.primary }]
              ]}
              onPress={() => setIsLogin(true)}
            >
              <Text
                style={[
                  styles.tabText,
                  isLogin ? { color: theme.colors.primary, fontWeight: 'bold' } : { color: theme.colors.textSecondary }
                ]}
              >
                Login
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tabButton,
                !isLogin && [styles.activeTab, { borderBottomColor: theme.colors.primary }]
              ]}
              onPress={() => setIsLogin(false)}
            >
              <Text
                style={[
                  styles.tabText,
                  !isLogin ? { color: theme.colors.primary, fontWeight: 'bold' } : { color: theme.colors.textSecondary }
                ]}
              >
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.formContainer}>
            {!isLogin && (
              <>
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: theme.colors.text }]}>First Name</Text>
                  <View style={[
                    styles.inputContainer, 
                    { 
                      backgroundColor: theme.isDarkMode ? '#2a2a2a' : '#f5f5f5',
                      borderColor: validationErrors.firstName ? theme.colors.error : 'transparent',
                      borderWidth: validationErrors.firstName ? 1 : 0
                    }
                  ]}>
                    <FontAwesome name="user" size={20} color={theme.colors.primary} style={styles.inputIcon} />
                    <TextInput
                      style={[styles.input, { color: theme.colors.text }]}
                      placeholder="Enter your first name"
                      placeholderTextColor={theme.colors.textSecondary}
                      value={firstName}
                      onChangeText={setFirstName}
                    />
                  </View>
                  {validationErrors.firstName && (
                    <Text style={[styles.errorText, { color: theme.colors.error }]}>
                      {validationErrors.firstName}
                    </Text>
                  )}
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Last Name</Text>
                  <View style={[
                    styles.inputContainer, 
                    { 
                      backgroundColor: theme.isDarkMode ? '#2a2a2a' : '#f5f5f5',
                      borderColor: validationErrors.lastName ? theme.colors.error : 'transparent',
                      borderWidth: validationErrors.lastName ? 1 : 0
                    }
                  ]}>
                    <FontAwesome name="user" size={20} color={theme.colors.primary} style={styles.inputIcon} />
                    <TextInput
                      style={[styles.input, { color: theme.colors.text }]}
                      placeholder="Enter your last name"
                      placeholderTextColor={theme.colors.textSecondary}
                      value={lastName}
                      onChangeText={setLastName}
                    />
                  </View>
                  {validationErrors.lastName && (
                    <Text style={[styles.errorText, { color: theme.colors.error }]}>
                      {validationErrors.lastName}
                    </Text>
                  )}
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Username</Text>
                  <View style={[
                    styles.inputContainer, 
                    { 
                      backgroundColor: theme.isDarkMode ? '#2a2a2a' : '#f5f5f5',
                      borderColor: validationErrors.username ? theme.colors.error : 'transparent',
                      borderWidth: validationErrors.username ? 1 : 0
                    }
                  ]}>
                    <FontAwesome name="at" size={20} color={theme.colors.primary} style={styles.inputIcon} />
                    <TextInput
                      style={[styles.input, { color: theme.colors.text }]}
                      placeholder="Choose a username"
                      placeholderTextColor={theme.colors.textSecondary}
                      value={username}
                      onChangeText={setUsername}
                      autoCapitalize="none"
                    />
                  </View>
                  {validationErrors.username && (
                    <Text style={[styles.errorText, { color: theme.colors.error }]}>
                      {validationErrors.username}
                    </Text>
                  )}
                </View>
              </>
            )}

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Email</Text>
              <View style={[
                styles.inputContainer, 
                { 
                  backgroundColor: theme.isDarkMode ? '#2a2a2a' : '#f5f5f5',
                  borderColor: validationErrors.email ? theme.colors.error : 'transparent',
                  borderWidth: validationErrors.email ? 1 : 0
                }
              ]}>
                <FontAwesome name="envelope" size={20} color={theme.colors.primary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: theme.colors.text }]}
                  placeholder="Enter your email"
                  placeholderTextColor={theme.colors.textSecondary}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
              {validationErrors.email && (
                <Text style={[styles.errorText, { color: theme.colors.error }]}>
                  {validationErrors.email}
                </Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Password</Text>
              <View style={[
                styles.inputContainer, 
                { 
                  backgroundColor: theme.isDarkMode ? '#2a2a2a' : '#f5f5f5',
                  borderColor: validationErrors.password ? theme.colors.error : 'transparent',
                  borderWidth: validationErrors.password ? 1 : 0
                }
              ]}>
                <FontAwesome name="lock" size={20} color={theme.colors.primary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: theme.colors.text }]}
                  placeholder="Enter your password"
                  placeholderTextColor={theme.colors.textSecondary}
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <FontAwesome
                    name={showPassword ? 'eye-slash' : 'eye'}
                    size={20}
                    color={theme.colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>
              {validationErrors.password && (
                <Text style={[styles.errorText, { color: theme.colors.error }]}>
                  {validationErrors.password}
                </Text>
              )}
            </View>

            {!isLogin && (
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Confirm Password</Text>
                <View style={[
                  styles.inputContainer, 
                  { 
                    backgroundColor: theme.isDarkMode ? '#2a2a2a' : '#f5f5f5',
                    borderColor: validationErrors.confirmPassword ? theme.colors.error : 'transparent',
                    borderWidth: validationErrors.confirmPassword ? 1 : 0
                  }
                ]}>
                  <FontAwesome name="lock" size={20} color={theme.colors.primary} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { color: theme.colors.text }]}
                    placeholder="Confirm your password"
                    placeholderTextColor={theme.colors.textSecondary}
                    secureTextEntry={!showConfirmPassword}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                  />
                  <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                    <FontAwesome
                      name={showConfirmPassword ? 'eye-slash' : 'eye'}
                      size={20}
                      color={theme.colors.textSecondary}
                    />
                  </TouchableOpacity>
                </View>
                {validationErrors.confirmPassword && (
                  <Text style={[styles.errorText, { color: theme.colors.error }]}>
                    {validationErrors.confirmPassword}
                  </Text>
                )}
              </View>
            )}

          {isLogin && (
              <TouchableOpacity style={styles.forgotPasswordContainer}>
                <Text style={[styles.forgotPasswordText, { color: theme.colors.primary }]}>
                  Forgot Password?
                </Text>
            </TouchableOpacity>
          )}

            <TouchableOpacity
              style={[
                styles.authButton, 
                { 
                  backgroundColor: isLoading ? theme.colors.textSecondary : theme.colors.primary,
                  opacity: isLoading ? 0.7 : 1
                }
              ]}
              onPress={handleAuth}
              disabled={isLoading}
            >
              <Text style={styles.authButtonText}>
                {isLoading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
              </Text>
            </TouchableOpacity>

            {error && (
              <View style={[styles.errorContainer, { backgroundColor: theme.colors.error + '20' }]}>
                <FontAwesome name="exclamation-triangle" size={16} color={theme.colors.error} />
                <Text style={[styles.errorMessage, { color: theme.colors.error }]}>
                  {error}
                </Text>
              </View>
            )}

            <View style={styles.orContainer}>
              <View style={[styles.orLine, { backgroundColor: theme.colors.border }]} />
              <Text style={[styles.orText, { color: theme.colors.textSecondary }]}>OR</Text>
              <View style={[styles.orLine, { backgroundColor: theme.colors.border }]} />
          </View>

          <View style={styles.socialButtonsContainer}>
              <TouchableOpacity
                style={[styles.socialButton, { backgroundColor: theme.isDarkMode ? '#2a2a2a' : '#f5f5f5' }]}
              >
              <FontAwesome name="google" size={20} color="#DB4437" />
                <Text style={[styles.socialButtonText, { color: theme.colors.text }]}>
                  Google
                </Text>
            </TouchableOpacity>
              <TouchableOpacity
                style={[styles.socialButton, { backgroundColor: theme.isDarkMode ? '#2a2a2a' : '#f5f5f5' }]}
              >
              <FontAwesome name="facebook" size={20} color="#4267B2" />
                <Text style={[styles.socialButtonText, { color: theme.colors.text }]}>
                  Facebook
                </Text>
            </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.footerContainer}>
          <Text style={[styles.footerText, { color: theme.colors.textSecondary }]}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <Text
              style={[styles.footerLink, { color: theme.colors.primary }]}
              onPress={toggleAuthMode}
            >
              {isLogin ? 'Sign Up' : 'Login'}
            </Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
  headerGradient: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  authContainer: {
    marginTop: -20,
    marginHorizontal: 20,
    borderRadius: 20,
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4.65,
    elevation: 7,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 16,
  },
  formContainer: {
    paddingHorizontal: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 50,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    fontSize: 14,
  },
  authButton: {
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  authButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  orLine: {
    flex: 1,
    height: 1,
  },
  orText: {
    marginHorizontal: 10,
    fontSize: 14,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48%',
    height: 50,
    borderRadius: 10,
  },
  socialButtonText: {
    marginLeft: 10,
    fontSize: 14,
    fontWeight: '500',
  },
  footerContainer: {
    marginTop: 30,
    marginBottom: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
  },
  footerLink: {
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  errorMessage: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
});

export default AuthScreen; 