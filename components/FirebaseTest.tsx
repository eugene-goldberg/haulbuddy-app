import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';

export default function FirebaseTest() {
  const [status, setStatus] = useState('Firebase connection test');
  const [error, setError] = useState<string | null>(null);

  const testFirebaseConnection = async () => {
    try {
      setError(null);
      setStatus('Testing Firebase connection...');
      
      const testEmail = `test${Math.floor(Math.random() * 10000)}@example.com`;
      const testPassword = 'password123';
      
      // Attempt to create a test user
      try {
        const result = await createUserWithEmailAndPassword(auth, testEmail, testPassword);
        setStatus(`Firebase connection successful! Created test user: ${result.user?.email}`);
        
        // Clean up by signing out
        await signOut(auth);
      } catch (err: any) {
        if (err.code === 'auth/email-already-in-use') {
          setStatus('Firebase connection successful! (Email already in use)');
        } else {
          throw err;
        }
      }
    } catch (err: any) {
      console.error('Firebase test error:', err);
      setStatus('Firebase connection failed');
      setError(err.message);
      Alert.alert('Firebase Error', err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Firebase Connection Test</Text>
      <Text style={styles.status}>Status: {status}</Text>
      {error && <Text style={styles.error}>{error}</Text>}
      <View style={styles.buttonContainer}>
        <Button title="Test Firebase Connection" onPress={testFirebaseConnection} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    margin: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  status: {
    marginBottom: 10,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
});