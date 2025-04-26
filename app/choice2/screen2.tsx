// ./choice2/screen2.tsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

export default function Choice2Screen2() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choice 2 - Screen 2</Text>
      <Text style={styles.content}>
        This is the final screen in the second flow. You've completed the second path successfully!
      </Text>
      
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/')}
      >
        <Text style={styles.buttonText}>Return to Start</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.button, styles.secondaryButton]}
        onPress={() => router.push('/choice2/screen1')}
      >
        <Text style={styles.secondaryButtonText}>Back to Previous Screen</Text>
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