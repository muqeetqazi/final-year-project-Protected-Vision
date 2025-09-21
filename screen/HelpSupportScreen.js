import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useTheme } from '../app/context/ThemeContext';

const HelpSupportScreen = ({ navigation }) => {
  const theme = useTheme();

  const faqData = [
    {
      id: 1,
      question: "How does sensitive data detection work?",
      answer: "Our AI-powered system analyzes your documents and images to identify sensitive information like personal details, financial data, and confidential content using advanced machine learning algorithms."
    },
    {
      id: 2,
      question: "Is my data secure?",
      answer: "Yes, we use end-to-end encryption and follow strict privacy protocols. Your documents are processed securely and never stored permanently on our servers."
    },
    {
      id: 3,
      question: "What file formats are supported?",
      answer: "We support common image formats (JPEG, PNG, PDF) and document formats. The app will guide you through the supported formats when you upload files."
    },
    {
      id: 4,
      question: "How accurate is the detection?",
      answer: "Our detection accuracy varies by model and content type. The 'Auto' model provides balanced accuracy, while specialized models offer higher precision for specific document types."
    },
    {
      id: 5,
      question: "Can I process multiple documents at once?",
      answer: "Currently, you can process one document at a time to ensure optimal accuracy and security. Batch processing may be available in future updates."
    }
  ];

  const supportOptions = [
    {
      id: 1,
      title: "Email Support",
      description: "Get help via email within 24 hours",
      icon: "mail",
      action: () => Linking.openURL('mailto:support@protectedvision.com?subject=App Support Request')
    },
    {
      id: 2,
      title: "Live Chat",
      description: "Chat with our support team",
      icon: "chatbubbles",
      action: () => {
        // In a real app, this would open a chat interface
        alert('Live chat feature coming soon!');
      }
    },
    {
      id: 3,
      title: "User Guide",
      description: "Comprehensive app documentation",
      icon: "book",
      action: () => {
        // In a real app, this would open a user guide
        alert('User guide coming soon!');
      }
    },
    {
      id: 4,
      title: "Report Bug",
      description: "Report issues or bugs",
      icon: "bug",
      action: () => Linking.openURL('mailto:bugs@protectedvision.com?subject=Bug Report')
    }
  ];

  const renderFAQItem = (item) => (
    <View key={item.id} style={[styles.faqItem, { backgroundColor: theme.colors.surface }]}>
      <Text style={[styles.faqQuestion, { color: theme.colors.text }]}>
        {item.question}
      </Text>
      <Text style={[styles.faqAnswer, { color: theme.colors.textSecondary }]}>
        {item.answer}
      </Text>
    </View>
  );

  const renderSupportOption = (option) => (
    <TouchableOpacity
      key={option.id}
      style={[styles.supportOption, { backgroundColor: theme.colors.surface }]}
      onPress={option.action}
    >
      <View style={styles.supportIconContainer}>
        <Ionicons name={option.icon} size={24} color={theme.colors.primary} />
      </View>
      <View style={styles.supportContent}>
        <Text style={[styles.supportTitle, { color: theme.colors.text }]}>
          {option.title}
        </Text>
        <Text style={[styles.supportDescription, { color: theme.colors.textSecondary }]}>
          {option.description}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Welcome Section */}
        <View style={[styles.welcomeSection, { backgroundColor: theme.colors.surface }]}>
          <Ionicons name="help-circle" size={48} color={theme.colors.primary} />
          <Text style={[styles.welcomeTitle, { color: theme.colors.text }]}>
            How can we help you?
          </Text>
          <Text style={[styles.welcomeDescription, { color: theme.colors.textSecondary }]}>
            Find answers to common questions or get in touch with our support team.
          </Text>
        </View>

        {/* FAQ Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>
            Frequently Asked Questions
          </Text>
          {faqData.map(renderFAQItem)}
        </View>

        {/* Support Options */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>
            Get Support
          </Text>
          {supportOptions.map(renderSupportOption)}
        </View>

        {/* Contact Info */}
        <View style={[styles.contactSection, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.contactTitle, { color: theme.colors.text }]}>
            Contact Information
          </Text>
          <View style={styles.contactItem}>
            <Ionicons name="mail" size={20} color={theme.colors.primary} />
            <Text style={[styles.contactText, { color: theme.colors.textSecondary }]}>
              support@protectedvision.com
            </Text>
          </View>
          <View style={styles.contactItem}>
            <Ionicons name="time" size={20} color={theme.colors.primary} />
            <Text style={[styles.contactText, { color: theme.colors.textSecondary }]}>
              Support Hours: 9 AM - 6 PM (EST)
            </Text>
          </View>
        </View>
      </ScrollView>
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
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  welcomeSection: {
    alignItems: 'center',
    padding: 24,
    borderRadius: 16,
    marginTop: 16,
    marginBottom: 24,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeDescription: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  faqItem: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    lineHeight: 20,
  },
  supportOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  supportIconContainer: {
    width: 40,
    alignItems: 'center',
    marginRight: 12,
  },
  supportContent: {
    flex: 1,
  },
  supportTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  supportDescription: {
    fontSize: 14,
  },
  contactSection: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactText: {
    fontSize: 14,
    marginLeft: 12,
  },
});

export default HelpSupportScreen;
