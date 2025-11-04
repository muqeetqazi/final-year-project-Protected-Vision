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

const AboutScreen = ({ navigation }) => {
  const theme = useTheme();

  const appInfo = {
    name: "Protected Vision",
    version: "1.0.0",
    build: "2024.12.001",
    description: "AI-powered sensitive data detection and protection for your documents and images."
  };

  const features = [
    {
      icon: "shield-checkmark",
      title: "AI-Powered Detection",
      description: "Advanced machine learning algorithms to identify sensitive information"
    },
    {
      icon: "lock-closed",
      title: "Secure Processing",
      description: "End-to-end encryption and secure document processing"
    },
    {
      icon: "flash",
      title: "Fast Analysis",
      description: "Quick processing with multiple speed options"
    },
    {
      icon: "eye-off",
      title: "Privacy First",
      description: "Your documents are processed securely and deleted after analysis"
    }
  ];

  const teamInfo = [
    {
      name: "Development Team",
      role: "Core Development",
      description: "Building the future of document security"
    },
    {
      name: "AI Research Team",
      role: "Machine Learning",
      description: "Advancing detection algorithms and accuracy"
    },
    {
      name: "Security Team",
      role: "Privacy & Security",
      description: "Ensuring your data remains protected"
    }
  ];

  const links = [
    {
      title: "Website",
      url: "https://protectedvision.com",
      icon: "globe"
    },
    {
      title: "GitHub",
      url: "https://github.com/protectedvision",
      icon: "logo-github"
    },
    {
      title: "Twitter",
      url: "https://twitter.com/protectedvision",
      icon: "logo-twitter"
    },
    {
      title: "LinkedIn",
      url: "https://linkedin.com/company/protectedvision",
      icon: "logo-linkedin"
    }
  ];

  const renderFeature = (feature, index) => (
    <View key={index} style={[styles.featureItem, { backgroundColor: theme.colors.surface }]}>
      <View style={[styles.featureIcon, { backgroundColor: theme.colors.primaryLight }]}>
        <Ionicons name={feature.icon} size={24} color={theme.colors.primary} />
      </View>
      <View style={styles.featureContent}>
        <Text style={[styles.featureTitle, { color: theme.colors.text }]}>
          {feature.title}
        </Text>
        <Text style={[styles.featureDescription, { color: theme.colors.textSecondary }]}>
          {feature.description}
        </Text>
      </View>
    </View>
  );

  const renderTeamMember = (member, index) => (
    <View key={index} style={[styles.teamItem, { backgroundColor: theme.colors.surface }]}>
      <View style={[styles.teamIcon, { backgroundColor: theme.colors.primaryLight }]}>
        <Ionicons name="people" size={24} color={theme.colors.primary} />
      </View>
      <View style={styles.teamContent}>
        <Text style={[styles.teamName, { color: theme.colors.text }]}>
          {member.name}
        </Text>
        <Text style={[styles.teamRole, { color: theme.colors.primary }]}>
          {member.role}
        </Text>
        <Text style={[styles.teamDescription, { color: theme.colors.textSecondary }]}>
          {member.description}
        </Text>
      </View>
    </View>
  );

  const renderLink = (link, index) => (
    <TouchableOpacity
      key={index}
      style={[styles.linkItem, { backgroundColor: theme.colors.surface }]}
      onPress={() => Linking.openURL(link.url)}
    >
      <View style={styles.linkIconContainer}>
        <Ionicons name={link.icon} size={24} color={theme.colors.primary} />
      </View>
      <Text style={[styles.linkText, { color: theme.colors.text }]}>
        {link.title}
      </Text>
      <Ionicons name="open-outline" size={20} color={theme.colors.textSecondary} />
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
        <Text style={styles.headerTitle}>About</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* App Info Section */}
        <View style={[styles.appInfoSection, { backgroundColor: theme.colors.surface }]}>
          <View style={[styles.appIcon, { backgroundColor: theme.colors.primary }]}>
            <Ionicons name="shield" size={48} color="#fff" />
          </View>
          <Text style={[styles.appName, { color: theme.colors.text }]}>
            {appInfo.name}
          </Text>
          <Text style={[styles.appVersion, { color: theme.colors.textSecondary }]}>
            Version {appInfo.version} (Build {appInfo.build})
          </Text>
          <Text style={[styles.appDescription, { color: theme.colors.textSecondary }]}>
            {appInfo.description}
          </Text>
        </View>

        {/* Features Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>
            Key Features
          </Text>
          {features.map(renderFeature)}
        </View>

        {/* Team Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>
            Our Team
          </Text>
          {teamInfo.map(renderTeamMember)}
        </View>

        {/* Links Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>
            Connect With Us
          </Text>
          {links.map(renderLink)}
        </View>

        {/* Copyright Section */}
        <View style={[styles.copyrightSection, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.copyrightText, { color: theme.colors.textSecondary }]}>
            © 2024 Protected Vision. All rights reserved.
          </Text>
          <Text style={[styles.copyrightText, { color: theme.colors.textSecondary }]}>
            Made with ❤️ for document security
          </Text>
        </View>

        {/* Technical Info */}
        <View style={[styles.techInfoSection, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.techInfoTitle, { color: theme.colors.text }]}>
            Technical Information
          </Text>
          <View style={styles.techInfoItem}>
            <Text style={[styles.techInfoLabel, { color: theme.colors.textSecondary }]}>
              Framework:
            </Text>
            <Text style={[styles.techInfoValue, { color: theme.colors.text }]}>
              React Native
            </Text>
          </View>
          <View style={styles.techInfoItem}>
            <Text style={[styles.techInfoLabel, { color: theme.colors.textSecondary }]}>
              Backend:
            </Text>
            <Text style={[styles.techInfoValue, { color: theme.colors.text }]}>
              Django REST Framework
            </Text>
          </View>
          <View style={styles.techInfoItem}>
            <Text style={[styles.techInfoLabel, { color: theme.colors.textSecondary }]}>
              AI Engine:
            </Text>
            <Text style={[styles.techInfoValue, { color: theme.colors.text }]}>
              Custom ML Models
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
    paddingTop: 70,
    paddingBottom: 30,
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 4,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  appInfoSection: {
    alignItems: 'center',
    padding: 24,
    borderRadius: 16,
    marginTop: 16,
    marginBottom: 24,
  },
  appIcon: {
    width: 80,
    height: 80,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 14,
    marginBottom: 12,
  },
  appDescription: {
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
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 18,
  },
  teamItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  teamIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  teamContent: {
    flex: 1,
  },
  teamName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  teamRole: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  teamDescription: {
    fontSize: 14,
    lineHeight: 18,
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  linkIconContainer: {
    width: 40,
    alignItems: 'center',
    marginRight: 12,
  },
  linkText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  copyrightSection: {
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  copyrightText: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 4,
  },
  techInfoSection: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
  },
  techInfoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  techInfoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  techInfoLabel: {
    fontSize: 14,
  },
  techInfoValue: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default AboutScreen;
