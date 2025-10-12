import { FontAwesome } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Dimensions,
    FlatList,
    Image,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useTheme } from '../app/context/ThemeContext';

const { width } = Dimensions.get('window');

const HistoryScreen = ({ navigation }) => {
  const theme = useTheme();
  
  // Mock history data
  const [historyData] = useState([
    {
      id: '1',
      date: '2023-03-17',
      time: '14:30',
      documentName: 'Bank Statement.pdf',
      detectedItems: [
        { type: 'Credit Card Number', confidence: 0.95 },
        { type: 'Account Number', confidence: 0.92 }
      ],
      riskLevel: 'High',
      thumbnail: require('../assets/images/bank.jpg')
    },
    {
      id: '2',
      date: '2023-03-15',
      time: '10:15',
      documentName: 'Passport Scan.jpg',
      detectedItems: [
        { type: 'National ID', confidence: 0.98 },
        { type: 'Date of Birth', confidence: 0.94 }
      ],
      riskLevel: 'High',
      thumbnail: require('../assets/images/lock1.jpg')
    },
    {
      id: '3',
      date: '2023-03-10',
      time: '09:45',
      documentName: 'Medical Report.pdf',
      detectedItems: [
        { type: 'Medical ID', confidence: 0.91 },
        { type: 'Personal Information', confidence: 0.88 }
      ],
      riskLevel: 'Medium',
      thumbnail: require('../assets/images/lock2.jpeg')
    },
    {
      id: '4',
      date: '2023-03-05',
      time: '16:20',
      documentName: 'Tax Return.pdf',
      detectedItems: [
        { type: 'Social Security Number', confidence: 0.97 },
        { type: 'Financial Data', confidence: 0.93 }
      ],
      riskLevel: 'High',
      thumbnail: require('../assets/images/bank.jpg')
    },
    {
      id: '5',
      date: '2023-03-01',
      time: '11:05',
      documentName: 'Resume.docx',
      detectedItems: [
        { type: 'Phone Number', confidence: 0.89 },
        { type: 'Email Address', confidence: 0.96 }
      ],
      riskLevel: 'Low',
      thumbnail: require('../assets/images/lock1.jpg')
    }
  ]);

  const getRiskLevelColor = (level) => {
    switch(level.toLowerCase()) {
      case 'high': return '#FF3B30';
      case 'medium': return '#FF9500';
      case 'low': return '#34C759';
      default: return theme.colors.text;
    }
  };

  const renderHistoryItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.historyItem, { backgroundColor: theme.colors.surface }]}
      onPress={() => navigation.navigate('Result', { 
        media: { uri: item.thumbnail },
        detectionResults: {
          sensitiveDataFound: true,
          detectedItems: item.detectedItems.map(di => ({...di, location: 'Document'})),
          riskLevel: item.riskLevel,
          recommendations: [
            'Secure document with encryption',
            'Limit sharing of this document',
            'Consider redacting sensitive information'
          ]
        }
      })}
    >
      <View style={styles.historyItemContent}>
        <Image 
          source={item.thumbnail} 
          style={styles.thumbnail}
          resizeMode="cover"
        />
        <View style={styles.historyItemDetails}>
          <Text style={[styles.documentName, { color: theme.colors.text }]} numberOfLines={1}>
            {item.documentName}
          </Text>
          <Text style={[styles.dateTime, { color: theme.colors.textSecondary }]}>
            {item.date} • {item.time}
          </Text>
          <View style={styles.detectedItemsContainer}>
            {item.detectedItems.map((detectedItem, index) => (
              <View key={index} style={styles.detectedItemBadge}>
                <Text style={styles.detectedItemText} numberOfLines={1}>
                  {detectedItem.type}
                </Text>
              </View>
            ))}
          </View>
        </View>
        <View style={[styles.riskLevelBadge, { backgroundColor: getRiskLevelColor(item.riskLevel) + '20' }]}>
          <Text style={[styles.riskLevelText, { color: getRiskLevelColor(item.riskLevel) }]}>
            {item.riskLevel}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome name="arrow-left" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Scan History</Text>
        <TouchableOpacity>
          <FontAwesome name="search" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {historyData.length > 0 ? (
          <FlatList
            data={historyData}
            renderItem={renderHistoryItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <FontAwesome name="history" size={60} color={theme.colors.textSecondary} />
            <Text style={[styles.emptyText, { color: theme.colors.text }]}>
              No scan history yet
            </Text>
            <Text style={[styles.emptySubtext, { color: theme.colors.textSecondary }]}>
              Your document scan history will appear here
            </Text>
            <TouchableOpacity 
              style={[styles.scanButton, { backgroundColor: theme.colors.primary }]}
              onPress={() => navigation.navigate('Home')}
            >
              <FontAwesome name="file-image-o" size={20} color="#fff" />
              <Text style={styles.scanButtonText}>Scan a Document</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 30 : 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 10,
  },
  listContainer: {
    paddingBottom: 20,
  },
  historyItem: {
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
    overflow: 'hidden',
  },
  historyItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  historyItemDetails: {
    flex: 1,
    marginLeft: 15,
  },
  documentName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  dateTime: {
    fontSize: 12,
    marginBottom: 8,
  },
  detectedItemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  detectedItemBadge: {
    backgroundColor: 'rgba(67, 3, 77, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  detectedItemText: {
    fontSize: 10,
    color: '#43034d',
    fontWeight: '500',
  },
  riskLevelBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    marginLeft: 10,
  },
  riskLevelText: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
});

export default HistoryScreen; 