import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const HistoryScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>History</Text>
      {/* Add your history screen content here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default HistoryScreen; 