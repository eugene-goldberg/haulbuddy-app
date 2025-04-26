// ./choice1/screen1.tsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

export default function Choice1Screen1() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choice 1 - Screen 1</Text>
      <Text style={styles.content}>
        This is the first screen in the first flow. From here, you can continue to the next screen or go back to make a different choice.
      </Text>
      
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/choice1/screen2')}
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
    backgroundColor: '#e6efff',
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
    backgroundColor: '#4a80f5',
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
    borderColor: '#4a80f5',
  },
  secondaryButtonText: {
    color: '#4a80f5',
    fontSize: 16,
    fontWeight: 'bold',
  },
});