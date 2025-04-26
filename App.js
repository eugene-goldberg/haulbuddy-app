// First import - must be at the top
import 'react-native-gesture-handler';

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';

// Welcome Screen
function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome!</Text>
      <Text style={styles.subtitle}>
        This app demonstrates navigation between different user flows
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Choice')}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

// Choice Screen
function ChoiceScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose a Path</Text>
      <Text style={styles.subtitle}>
        Select one of the following options to continue
      </Text>
      
      <TouchableOpacity
        style={[styles.button, styles.button1]}
        onPress={() => navigation.navigate('Choice1Screen1')}
      >
        <Text style={styles.buttonText}>Choice 1</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.button, styles.button2]}
        onPress={() => navigation.navigate('Choice2Screen1')}
      >
        <Text style={styles.buttonText}>Choice 2</Text>
      </TouchableOpacity>
    </View>
  );
}

// Choice 1 - Screen 1
function Choice1Screen1({ navigation }) {
  return (
    <View style={[styles.container, { backgroundColor: '#e6efff' }]}>
      <Text style={styles.title}>Choice 1 - Screen 1</Text>
      <Text style={styles.content}>
        This is the first screen in the first flow. From here, you can continue to the next screen or go back to make a different choice.
      </Text>
      
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Choice1Screen2')}
      >
        <Text style={styles.buttonText}>Continue to Next Screen</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.button, styles.secondaryButton]}
        onPress={() => navigation.navigate('Choice')}
      >
        <Text style={styles.secondaryButtonText}>Back to Choices</Text>
      </TouchableOpacity>
    </View>
  );
}

// Choice 1 - Screen 2
function Choice1Screen2({ navigation }) {
  return (
    <View style={[styles.container, { backgroundColor: '#e6efff' }]}>
      <Text style={styles.title}>Choice 1 - Screen 2</Text>
      <Text style={styles.content}>
        This is the final screen in the first flow. You've completed the first path successfully!
      </Text>
      
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Welcome')}
      >
        <Text style={styles.buttonText}>Return to Start</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.button, styles.secondaryButton]}
        onPress={() => navigation.navigate('Choice1Screen1')}
      >
        <Text style={styles.secondaryButtonText}>Back to Previous Screen</Text>
      </TouchableOpacity>
    </View>
  );
}

// Choice 2 - Screen 1
function Choice2Screen1({ navigation }) {
  return (
    <View style={[styles.container, { backgroundColor: '#ffe6e6' }]}>
      <Text style={styles.title}>Choice 2 - Screen 1</Text>
      <Text style={styles.content}>
        This is the first screen in the second flow. This path is different from the first choice path.
      </Text>
      
      <TouchableOpacity
        style={[styles.button, styles.button2]}
        onPress={() => navigation.navigate('Choice2Screen2')}
      >
        <Text style={styles.buttonText}>Continue to Next Screen</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.button, styles.secondaryButton2]}
        onPress={() => navigation.navigate('Choice')}
      >
        <Text style={styles.secondaryButtonText2}>Back to Choices</Text>
      </TouchableOpacity>
    </View>
  );
}

// Choice 2 - Screen 2
function Choice2Screen2({ navigation }) {
  return (
    <View style={[styles.container, { backgroundColor: '#ffe6e6' }]}>
      <Text style={styles.title}>Choice 2 - Screen 2</Text>
      <Text style={styles.content}>
        This is the final screen in the second flow. You've completed the second path successfully!
      </Text>
      
      <TouchableOpacity
        style={[styles.button, styles.button2]}
        onPress={() => navigation.navigate('Welcome')}
      >
        <Text style={styles.buttonText}>Return to Start</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.button, styles.secondaryButton2]}
        onPress={() => navigation.navigate('Choice2Screen1')}
      >
        <Text style={styles.secondaryButtonText2}>Back to Previous Screen</Text>
      </TouchableOpacity>
    </View>
  );
}

// Create the navigator
const Stack = createStackNavigator();

// App component with navigation setup
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen 
          name="Welcome" 
          component={WelcomeScreen} 
          options={{ title: 'Welcome' }} 
        />
        <Stack.Screen 
          name="Choice" 
          component={ChoiceScreen} 
          options={{ title: 'Make a Choice' }} 
        />
        <Stack.Screen 
          name="Choice1Screen1" 
          component={Choice1Screen1} 
          options={{ title: 'Choice 1 - Screen 1' }} 
        />
        <Stack.Screen 
          name="Choice1Screen2" 
          component={Choice1Screen2} 
          options={{ title: 'Choice 1 - Screen 2' }} 
        />
        <Stack.Screen 
          name="Choice2Screen1" 
          component={Choice2Screen1} 
          options={{ title: 'Choice 2 - Screen 1' }} 
        />
        <Stack.Screen 
          name="Choice2Screen2" 
          component={Choice2Screen2} 
          options={{ title: 'Choice 2 - Screen 2' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    color: '#666',
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
  button1: {
    backgroundColor: '#4a80f5',
  },
  button2: {
    backgroundColor: '#f55e4a',
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
  secondaryButton2: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#f55e4a',
  },
  secondaryButtonText2: {
    color: '#f55e4a',
    fontSize: 16,
    fontWeight: 'bold',
  },
});