import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
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
import { useTheme } from '../app/context/ThemeContext';

const { width, height } = Dimensions.get('window');

const AuthScreen = ({ navigation }) => {
  const theme = useTheme();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleAuth = () => {
    // For demo purposes, just navigate to Home
      navigation.replace('Home');
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
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
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Full Name</Text>
                <View style={[styles.inputContainer, { backgroundColor: theme.isDarkMode ? '#2a2a2a' : '#f5f5f5' }]}>
                  <FontAwesome name="user" size={20} color={theme.colors.primary} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { color: theme.colors.text }]}
                    placeholder="Enter your full name"
                    placeholderTextColor={theme.colors.textSecondary}
                    value={name}
                    onChangeText={setName}
                  />
                </View>
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Email</Text>
              <View style={[styles.inputContainer, { backgroundColor: theme.isDarkMode ? '#2a2a2a' : '#f5f5f5' }]}>
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
          </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Password</Text>
              <View style={[styles.inputContainer, { backgroundColor: theme.isDarkMode ? '#2a2a2a' : '#f5f5f5' }]}>
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
          </View>

          {isLogin && (
              <TouchableOpacity style={styles.forgotPasswordContainer}>
                <Text style={[styles.forgotPasswordText, { color: theme.colors.primary }]}>
                  Forgot Password?
                </Text>
            </TouchableOpacity>
          )}

            <TouchableOpacity
              style={[styles.authButton, { backgroundColor: theme.colors.primary }]}
              onPress={handleAuth}
            >
              <Text style={styles.authButtonText}>
                {isLogin ? 'Login' : 'Sign Up'}
            </Text>
          </TouchableOpacity>

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
});

export default AuthScreen; 