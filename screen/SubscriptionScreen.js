import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const SubscriptionScreen = ({ navigation }) => {
  const subscriptionPlans = [
    {
      type: 'Standard',
      price: '$4.99/month',
      features: [
        'Basic content protection',
        'Up to 50 scans per month',
        'Email support',
        'Standard processing speed',
      ],
      color: '#43034d',
    },
    {
      type: 'Premium',
      price: '$9.99/month',
      features: [
        'Advanced content protection',
        'Unlimited scans',
        'Priority support 24/7',
        'Faster processing speed',
        'Custom watermarks',
        'Batch processing',
        'Advanced analytics',
      ],
      color: '#2c0133',
    },
  ];

  const handleSubscribe = (planType) => {
    // In a real app, this would integrate with a payment system
    Alert.alert(
      'Subscribe to ' + planType,
      'This will integrate with your payment system.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Subscribe',
          onPress: () => {
            // Handle subscription logic
            Alert.alert('Success', `Subscribed to ${planType} plan successfully!`);
            navigation.navigate('Dashboard');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome name="arrow-left" size={24} color="#43034d" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Subscription Plans</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.subtitle}>Choose the plan that works for you</Text>

        {subscriptionPlans.map((plan, index) => (
          <View
            key={index}
            style={[
              styles.planCard,
              { backgroundColor: plan.type === 'Premium' ? plan.color : '#fff' },
            ]}
          >
            <Text
              style={[
                styles.planType,
                { color: plan.type === 'Premium' ? '#fff' : plan.color },
              ]}
            >
              {plan.type}
            </Text>
            <Text
              style={[
                styles.planPrice,
                { color: plan.type === 'Premium' ? '#fff' : '#333' },
              ]}
            >
              {plan.price}
            </Text>
            <View style={styles.featuresContainer}>
              {plan.features.map((feature, featureIndex) => (
                <View key={featureIndex} style={styles.featureRow}>
                  <FontAwesome
                    name="check-circle"
                    size={16}
                    color={plan.type === 'Premium' ? '#fff' : '#4CAF50'}
                  />
                  <Text
                    style={[
                      styles.featureText,
                      { color: plan.type === 'Premium' ? '#fff' : '#666' },
                    ]}
                  >
                    {feature}
                  </Text>
                </View>
              ))}
            </View>
            <TouchableOpacity
              style={[
                styles.subscribeButton,
                {
                  backgroundColor:
                    plan.type === 'Premium' ? '#fff' : plan.color,
                },
              ]}
              onPress={() => handleSubscribe(plan.type)}
            >
              <Text
                style={[
                  styles.subscribeButtonText,
                  {
                    color: plan.type === 'Premium' ? plan.color : '#fff',
                  },
                ]}
              >
                Subscribe Now
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#43034d',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  planCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  planType: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  planPrice: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  featuresContainer: {
    marginBottom: 20,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  featureText: {
    marginLeft: 10,
    fontSize: 16,
  },
  subscribeButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  subscribeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SubscriptionScreen; 