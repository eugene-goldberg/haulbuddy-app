import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ChoiceScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>How will you use HaulBuddy?</Text>
      
      <TouchableOpacity
        style={styles.choiceButton}
        onPress={() => router.push('/choice1/screen1')}
      >
        <Text style={styles.choiceButtonText}>I need a truck</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.choiceButton}
        onPress={() => router.push('/owner-onboarding')}
      >
        <Text style={styles.choiceButtonText}>I own a truck</Text>
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
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#0096FF',
    textAlign: 'center',
  },
  choiceButton: {
    width: '80%',
    backgroundColor: '#E6F7FF',
    paddingVertical: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#d0d0d0',
  },
  choiceButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
  },
});