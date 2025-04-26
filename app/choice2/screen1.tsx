// ./choice2/screen1.tsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

export default function Choice2Screen1() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choice 2 - Screen 1</Text>
      <Text style={styles.content}>
        This is the first screen in the second flow. This path is different from the first choice path.
      </Text>
      
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/choice2/screen2')}
      >
        <Text style={styles.buttonText}>Continue to Next Screen</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.button, styles.secondaryButton]}
        onPress={() => router.push('/choice')}
      >
        <Text style={styles.secondaryButtonText}>Back to Choices</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#ffe6e6',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  content: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    color: '#555',
    lineHeight: 24,
  },
  button: {
    width: '80%',
    backgroundColor: '#f55e4a',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#f55e4a',
  },
  secondaryButtonText: {
    color: '#f55e4a',
    fontSize: 16,
    fontWeight: 'bold',
  },
});