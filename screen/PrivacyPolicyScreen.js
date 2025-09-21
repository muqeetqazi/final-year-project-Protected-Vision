import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useTheme } from '../app/context/ThemeContext';

const PrivacyPolicyScreen = ({ navigation }) => {
  const theme = useTheme();

  const privacySections = [
    {
      id: 1,
      title: "Information We Collect",
      content: [
        "• Account information (email, username) for authentication",
        "• Documents and images you upload for processing",
        "• Usage analytics to improve our services",
        "• Device information for app optimization",
        "• Processing results and detection data"
      ]
    },
    {
      id: 2,
      title: "How We Use Your Information",
      content: [
        "• Process your documents to detect sensitive information",
        "• Provide and improve our AI detection services",
        "• Send you important updates about the app",
        "• Analyze usage patterns to enhance user experience",
        "• Ensure security and prevent fraud"
      ]
    },
    {
      id: 3,
      title: "Data Security",
      content: [
        "• All data is encrypted in transit and at rest",
        "• Documents are processed securely and deleted after analysis",
        "• We use industry-standard security protocols",
        "• Access to your data is strictly limited to authorized personnel",
        "• Regular security audits and updates"
      ]
    },
    {
      id: 4,
      title: "Data Sharing",
      content: [
        "• We do not sell your personal information to third parties",
        "• Data may be shared with trusted service providers for processing",
        "• Information may be disclosed if required by law",
        "• Anonymous usage statistics may be used for research",
        "• Your explicit consent is required for any other sharing"
      ]
    },
    {
      id: 5,
      title: "Your Rights",
      content: [
        "• Access your personal data at any time",
        "• Request correction of inaccurate information",
        "• Delete your account and associated data",
        "• Opt-out of non-essential communications",
        "• Export your data in a portable format"
      ]
    },
    {
      id: 6,
      title: "Data Retention",
      content: [
        "• Account data is retained while your account is active",
        "• Processed documents are deleted immediately after analysis",
        "• Usage analytics are retained for up to 2 years",
        "• Inactive accounts are deleted after 3 years",
        "• Legal requirements may extend retention periods"
      ]
    },
    {
      id: 7,
      title: "Cookies and Tracking",
      content: [
        "• We use essential cookies for app functionality",
        "• Analytics cookies help us improve the service",
        "• You can control cookie preferences in settings",
        "• Third-party services may use their own cookies",
        "• No tracking for advertising purposes"
      ]
    },
    {
      id: 8,
      title: "Children's Privacy",
      content: [
        "• Our service is not intended for children under 13",
        "• We do not knowingly collect data from children",
        "• Parents should supervise their children's app usage",
        "• Contact us if you believe we have collected child data",
        "• We will delete any such data immediately"
      ]
    },
    {
      id: 9,
      title: "International Transfers",
      content: [
        "• Your data may be processed in different countries",
        "• We ensure adequate protection for international transfers",
        "• Standard contractual clauses are used where applicable",
        "• Data processing follows applicable privacy laws",
        "• You can request information about data location"
      ]
    },
    {
      id: 10,
      title: "Changes to This Policy",
      content: [
        "• We may update this policy from time to time",
        "• Significant changes will be communicated via the app",
        "• Continued use implies acceptance of changes",
        "• Previous versions are available upon request",
        "• Last updated: December 2024"
      ]
    }
  ];

  const renderPrivacySection = (section) => (
    <View key={section.id} style={[styles.section, { backgroundColor: theme.colors.surface }]}>
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
        {section.title}
      </Text>
      {section.content.map((item, index) => (
        <Text key={index} style={[styles.sectionContent, { color: theme.colors.textSecondary }]}>
          {item}
        </Text>
      ))}
    </View>
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
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Introduction */}
        <View style={[styles.introSection, { backgroundColor: theme.colors.surface }]}>
          <Ionicons name="shield-checkmark" size={48} color={theme.colors.primary} />
          <Text style={[styles.introTitle, { color: theme.colors.text }]}>
            Your Privacy Matters
          </Text>
          <Text style={[styles.introDescription, { color: theme.colors.textSecondary }]}>
            We are committed to protecting your privacy and ensuring the security of your personal information. This policy explains how we collect, use, and safeguard your data.
          </Text>
          <Text style={[styles.lastUpdated, { color: theme.colors.textSecondary }]}>
            Last updated: December 2024
          </Text>
        </View>

        {/* Privacy Sections */}
        {privacySections.map(renderPrivacySection)}

        {/* Contact Section */}
        <View style={[styles.contactSection, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.contactTitle, { color: theme.colors.text }]}>
            Questions About Privacy?
          </Text>
          <Text style={[styles.contactDescription, { color: theme.colors.textSecondary }]}>
            If you have any questions about this Privacy Policy or how we handle your data, please contact us:
          </Text>
          <View style={styles.contactInfo}>
            <View style={styles.contactItem}>
              <Ionicons name="mail" size={20} color={theme.colors.primary} />
              <Text style={[styles.contactText, { color: theme.colors.textSecondary }]}>
                privacy@protectedvision.com
              </Text>
            </View>
            <View style={styles.contactItem}>
              <Ionicons name="time" size={20} color={theme.colors.primary} />
              <Text style={[styles.contactText, { color: theme.colors.textSecondary }]}>
                Response within 48 hours
              </Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.colors.textSecondary }]}>
            By using Protected Vision, you agree to the terms outlined in this Privacy Policy.
          </Text>
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
  introSection: {
    alignItems: 'center',
    padding: 24,
    borderRadius: 16,
    marginTop: 16,
    marginBottom: 24,
  },
  introTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  introDescription: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 12,
  },
  lastUpdated: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  section: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  sectionContent: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  contactSection: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  contactDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  contactInfo: {
    marginTop: 8,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactText: {
    fontSize: 14,
    marginLeft: 12,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default PrivacyPolicyScreen;
