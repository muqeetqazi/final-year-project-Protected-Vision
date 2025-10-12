import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../../app/context/ThemeContext';

const { width, height } = Dimensions.get('window');

const BeautifulAlert = ({
  visible,
  type = 'success', // success, error, warning, info
  title,
  message,
  confirmText = 'OK',
  cancelText = 'Cancel',
  showCancel = false,
  onConfirm,
  onCancel,
  onClose,
  icon,
  autoClose = false,
  autoCloseDelay = 3000,
}) => {
  const theme = useTheme();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    if (visible) {
      // Entrance animation
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto close if enabled
      if (autoClose) {
        const timer = setTimeout(() => {
          handleClose();
        }, autoCloseDelay);
        return () => clearTimeout(timer);
      }
    } else {
      // Reset animations
      scaleAnim.setValue(0);
      opacityAnim.setValue(0);
      slideAnim.setValue(50);
    }
  }, [visible]);

  const handleClose = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 50,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose?.();
    });
  };

  const handleConfirm = () => {
    onConfirm?.();
    handleClose();
  };

  const handleCancel = () => {
    onCancel?.();
    handleClose();
  };

  const getAlertConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: icon || 'check-circle',
          colors: [theme.colors.success, theme.isDarkMode ? '#02B8A8' : '#45a049'],
          backgroundColor: theme.isDarkMode ? '#1A2F2E' : '#E8F5E8',
          iconColor: theme.colors.success,
        };
      case 'error':
        return {
          icon: icon || 'times-circle',
          colors: [theme.colors.error, theme.isDarkMode ? '#B71C1C' : '#d32f2f'],
          backgroundColor: theme.isDarkMode ? '#2F1A1A' : '#FFEBEE',
          iconColor: theme.colors.error,
        };
      case 'warning':
        return {
          icon: icon || 'exclamation-triangle',
          colors: [theme.colors.warning, theme.isDarkMode ? '#E6A700' : '#F57C00'],
          backgroundColor: theme.isDarkMode ? '#2F2A1A' : '#FFF3E0',
          iconColor: theme.colors.warning,
        };
      case 'info':
        return {
          icon: icon || 'info-circle',
          colors: [theme.colors.info, theme.isDarkMode ? '#1565C0' : '#1976D2'],
          backgroundColor: theme.isDarkMode ? '#1A1F2F' : '#E3F2FD',
          iconColor: theme.colors.info,
        };
      default:
        return {
          icon: icon || 'info-circle',
          colors: [theme.colors.primary, theme.colors.primaryDark],
          backgroundColor: theme.colors.surface,
          iconColor: theme.colors.primary,
        };
    }
  };

  const config = getAlertConfig();

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={handleClose}
    >
      <Animated.View
        style={[
          styles.overlay,
          {
            backgroundColor: theme.isDarkMode ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.5)',
            opacity: opacityAnim,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.overlayTouchable}
          activeOpacity={1}
          onPress={handleClose}
        >
          <Animated.View
            style={[
              styles.container,
              {
                backgroundColor: theme.colors.surface,
                transform: [
                  { scale: scaleAnim },
                  { translateY: slideAnim },
                ],
              },
            ]}
          >
            {/* Header with gradient */}
            <LinearGradient
              colors={config.colors}
              style={styles.header}
            >
              <View style={styles.iconContainer}>
                <FontAwesome
                  name={config.icon}
                  size={32}
                  color="#fff"
                />
              </View>
            </LinearGradient>

            {/* Content */}
            <View style={styles.content}>
              <Text style={[styles.title, { color: theme.colors.text }]}>
                {title}
              </Text>
              <Text style={[styles.message, { color: theme.colors.textSecondary }]}>
                {message}
              </Text>
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              {showCancel && (
                <TouchableOpacity
                  style={[
                    styles.button,
                    styles.cancelButton,
                    { borderColor: theme.colors.border },
                  ]}
                  onPress={handleCancel}
                >
                  <Text style={[styles.cancelButtonText, { color: theme.colors.textSecondary }]}>
                    {cancelText}
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[styles.button, styles.confirmButton]}
                onPress={handleConfirm}
              >
                <LinearGradient
                  colors={config.colors}
                  style={styles.confirmButtonGradient}
                >
                  <Text style={styles.confirmButtonText}>
                    {confirmText}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayTouchable: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  container: {
    width: width * 0.85,
    maxWidth: 400,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
    overflow: 'hidden',
  },
  header: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 12,
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    overflow: 'hidden',
  },
  cancelButton: {
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButton: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  confirmButtonGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BeautifulAlert;
