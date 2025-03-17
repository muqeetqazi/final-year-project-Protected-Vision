import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
    Alert,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useTheme } from '../app/context/ThemeContext';

const { width } = Dimensions.get('window');

const SubscriptionScreen = ({ navigation }) => {
  const theme = useTheme();
  const [selectedPlan, setSelectedPlan] = useState('premium');

  const plans = [
    {
      id: 'standard',
      name: 'Standard',
      price: 'Free',
      features: [
        'Up to 10 scans per month',
        'Basic sensitive data detection',
        'Email support',
        'Standard processing speed',
      ],
      limitations: [
        'Limited scan resolution',
        'No batch processing',
        'No advanced detection types',
      ],
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '$9.99/month',
      features: [
        'Unlimited scans',
        'Advanced sensitive data detection',
        'Priority email & chat support',
        'High-speed processing',
        'Batch processing',
        'Data redaction tools',
        'Export & reporting',
      ],
      limitations: [],
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 'Contact Us',
      features: [
        'Everything in Premium',
        'Custom detection rules',
        'API access',
        'Dedicated support',
        'Team management',
        'Advanced analytics',
        'Custom integrations',
      ],
      limitations: [],
    },
  ];

  const handleSubscribe = () => {
    if (selectedPlan === 'standard') {
      Alert.alert(
        'Standard Plan',
        'You are already on the Standard plan. Would you like to upgrade to Premium?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Upgrade', 
            onPress: () => setSelectedPlan('premium')
          }
        ]
      );
    } else if (selectedPlan === 'premium') {
      Alert.alert(
        'Subscribe to Premium',
        'You will be charged $9.99/month after the trial period. Continue?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Subscribe', 
            onPress: () => {
              Alert.alert(
                'Subscription Successful',
                'You are now subscribed to the Premium plan!',
                [{ text: 'OK', onPress: () => navigation.navigate('Profile') }]
              );
            }
          }
        ]
      );
    } else if (selectedPlan === 'enterprise') {
      Alert.alert(
        'Enterprise Plan',
        'Please contact our sales team at sales@protectedvision.com to set up your Enterprise plan.',
        [{ text: 'OK' }]
      );
    }
  };

  const renderFeature = (feature, included) => (
    <View key={feature} style={styles.featureItem}>
      <Ionicons 
        name={included ? "checkmark-circle" : "close-circle"} 
        size={20} 
        color={included ? theme.colors.success : theme.colors.error} 
        style={styles.featureIcon}
      />
      <Text style={[styles.featureText, { color: theme.colors.text }]}>
        {feature}
      </Text>
    </View>
  );

  const renderPlanCard = (plan) => {
    const isSelected = selectedPlan === plan.id;
    const isPremium = plan.id === 'premium';
    
    return (
      <TouchableOpacity
        key={plan.id}
        style={[
          styles.planCard,
          { backgroundColor: theme.colors.surface },
          isSelected && { borderColor: theme.colors.primary, borderWidth: 2 },
          isPremium && styles.premiumCard
        ]}
        onPress={() => setSelectedPlan(plan.id)}
      >
        {isPremium && (
          <View style={[styles.popularBadge, { backgroundColor: theme.colors.primary }]}>
            <Text style={styles.popularText}>MOST POPULAR</Text>
          </View>
        )}
        
        <Text style={[styles.planName, { color: theme.colors.text }]}>
          {plan.name}
        </Text>
        
        <Text style={[styles.planPrice, { color: theme.colors.primary }]}>
          {plan.price}
        </Text>
        
        {plan.id === 'standard' && (
          <Text style={[styles.noCardText, { color: theme.colors.textSecondary }]}>
            No credit card required
          </Text>
        )}
        
        <View style={styles.featuresContainer}>
          {plan.features.map(feature => renderFeature(feature, true))}
          {plan.limitations.map(limitation => renderFeature(limitation, false))}
        </View>
        
        <TouchableOpacity
          style={[
            styles.selectButton,
            isSelected ? 
              { backgroundColor: theme.colors.primary } : 
              { backgroundColor: 'transparent', borderColor: theme.colors.border, borderWidth: 1 }
          ]}
          onPress={() => setSelectedPlan(plan.id)}
        >
          <Text 
            style={[
              styles.selectButtonText, 
              { color: isSelected ? '#fff' : theme.colors.text }
            ]}
          >
            {isSelected ? 'Selected' : 'Select'}
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <LinearGradient
        colors={[theme.colors.primary, theme.isDarkMode ? '#2c0233' : '#7a1a87']}
        style={styles.header}
      >
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Subscription Plans</Text>
          <Text style={styles.headerSubtitle}>Choose the plan that works for you</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollView}>
        <View style={styles.plansContainer}>
          {plans.map(renderPlanCard)}
        </View>

        <View style={[styles.infoCard, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.infoHeader}>
            <MaterialCommunityIcons 
              name="shield-check" 
              size={24} 
              color={theme.colors.primary} 
            />
            <Text style={[styles.infoTitle, { color: theme.colors.text }]}>
              All Plans Include
            </Text>
          </View>
          
          <View style={styles.infoFeatures}>
            {[
              'Secure cloud storage',
              'Cross-platform access',
              'Regular app updates',
              'Cancel anytime',
            ].map(feature => (
              <View key={feature} style={styles.infoFeatureItem}>
                <Ionicons 
                  name="checkmark" 
                  size={18} 
                  color={theme.colors.primary} 
                />
                <Text style={[styles.infoFeatureText, { color: theme.colors.text }]}>
                  {feature}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.subscribeButton, { backgroundColor: theme.colors.primary }]}
          onPress={handleSubscribe}
        >
          <Text style={styles.subscribeButtonText}>
            {selectedPlan === 'standard' ? 'Continue with Free Plan' : 
             selectedPlan === 'premium' ? 'Subscribe Now' : 'Contact Sales'}
          </Text>
        </TouchableOpacity>

        <Text style={[styles.termsText, { color: theme.colors.textSecondary }]}>
          By subscribing, you agree to our Terms of Service and Privacy Policy.
          You can cancel your subscription anytime from your profile.
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 8,
    marginBottom: 16,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
    marginTop: -20,
  },
  plansContainer: {
    padding: 16,
  },
  planCard: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
    overflow: 'hidden',
  },
  premiumCard: {
    paddingTop: 36,
  },
  popularBadge: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingVertical: 6,
    alignItems: 'center',
  },
  popularText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  planName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  planPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  noCardText: {
    fontSize: 14,
    marginBottom: 16,
  },
  featuresContainer: {
    marginVertical: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureIcon: {
    marginRight: 8,
  },
  featureText: {
    fontSize: 14,
  },
  selectButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  selectButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  infoCard: {
    margin: 16,
    marginTop: 0,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  infoFeatures: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  infoFeatureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginBottom: 12,
  },
  infoFeatureText: {
    fontSize: 14,
    marginLeft: 8,
  },
  subscribeButton: {
    margin: 16,
    marginTop: 0,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  subscribeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  termsText: {
    fontSize: 12,
    textAlign: 'center',
    marginHorizontal: 16,
    marginBottom: 30,
  },
});

export default SubscriptionScreen; 