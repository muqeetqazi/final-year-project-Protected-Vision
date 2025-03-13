import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ResultScreen = ({ route, navigation }) => {
  const { media } = route.params || {};

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome name="arrow-left" size={24} color="#43034d" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Analysis Result</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        {media && (
          <Image
            source={{ uri: media.uri }}
            style={styles.mediaPreview}
            resizeMode="contain"
          />
        )}

        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Detection Results</Text>
          {/* Add your detection results here */}
          <Text style={styles.resultText}>No sensitive content detected</Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Home')}
        >
          <FontAwesome name="home" size={24} color="white" />
          <Text style={styles.buttonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
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
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#43034d',
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  mediaPreview: {
    width: 300,
    height: 300,
    borderRadius: 10,
    marginBottom: 20,
  },
  resultContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '100%',
    marginBottom: 20,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#43034d',
    marginBottom: 10,
  },
  resultText: {
    fontSize: 16,
    color: '#666',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#43034d',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
  },
});

export default ResultScreen; 