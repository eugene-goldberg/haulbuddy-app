// app/choice.tsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

export default function ChoiceScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>How will you use HaulBuddy?</Text>
      
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/choice1/screen1')}
      >
        <Text style={styles.buttonText}>I need a truck</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/choice2/screen1')}
      >
        <Text style={styles.buttonText}>I own a truck</Text>
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
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 60,
    color: '#2196F3',
    textAlign: 'center',
  },
  button: {
    width: '100%',
    backgroundColor: '#e6f7ff',
    paddingVertical: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#d1e8ff',
  },
  buttonText: {
    color: '#333',
    fontSize: 22,
    fontWeight: '500',
  },
});