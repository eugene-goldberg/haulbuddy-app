import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Dimensions,
  Alert,
  ActivityIndicator
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { registerUser } from '../../contexts/auth-service';
import { useAuth } from '../../contexts/AuthContext';

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { refreshUserRole } = useAuth();

  const handleSignUp = async () => {
    // Validate form
    if (!name || !email || !password) {
      setErrorMessage('Please fill out all fields');
      return;
    }
    
    // Validate password strength
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long');
      return;
    }
    
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      const user = await registerUser({ name, email, password });
      console.log('Signup successful!', user);
      await refreshUserRole();
      
      // Explicitly navigate to the tabs route - AuthRoute will handle redirections
      router.replace('/(tabs)');
    } catch (error: any) {
      setErrorMessage(error.message);
      console.error('Signup error:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // In a real app, this would handle Google OAuth
    Alert.alert('Feature Coming Soon', 'Google login is not yet implemented.');
  };

  const handleLogin = () => {
    router.push('/onboarding/login');
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topSection}>
        {/* Solid color background instead of image */}
        <View style={styles.gradientPlaceholder} />
      </View>
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.contentContainer}>
            <Text style={styles.title}>Create Your Account</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Name</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="person-outline" size={20} color="#888" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter name"
                  value={name}
                  onChangeText={setName}
                  placeholderTextColor="#999"
                />
              </View>
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="mail-outline" size={20} color="#888" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="adrian@jsmastery.pr"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor="#999"
                />
              </View>
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={20} color="#888" style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  placeholder="Enter password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  placeholderTextColor="#999"
                />
                <TouchableOpacity onPress={toggleShowPassword} style={styles.eyeIcon}>
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="#888"
                  />
                </TouchableOpacity>
              </View>
            </View>
            
            {errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}
            
            <TouchableOpacity
              style={styles.signUpButton}
              onPress={handleSignUp}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.signUpButtonText}>Sign Up</Text>
              )}
            </TouchableOpacity>
            
            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>Or</Text>
              <View style={styles.divider} />
            </View>
            
            <TouchableOpacity
              style={styles.googleButton}
              onPress={handleGoogleLogin}
            >
              <View style={styles.googleIconContainer}>
                <Text style={styles.googleIcon}>G</Text>
              </View>
              <Text style={styles.googleButtonText}>Log In with Google</Text>
            </TouchableOpacity>
            
            <View style={styles.loginTextContainer}>
              <Text style={styles.loginQuestion}>Already have an account? </Text>
              <TouchableOpacity onPress={handleLogin}>
                <Text style={styles.loginLink}>Log in</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  errorText: {
    color: '#d32f2f',
    marginBottom: 10,
    textAlign: 'center',
  },
  topSection: {
    height: height * 0.2,
    backgroundColor: '#333',
  },
  gradientPlaceholder: {
    flex: 1,
    backgroundColor: '#444',
  },
  keyboardAvoidView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  contentContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    marginTop: -24,
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 50,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  passwordInput: {
    paddingRight: 40, // Space for the eye icon
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
  },
  signUpButton: {
    backgroundColor: '#0A84FF',
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 24,
    shadowColor: '#0A84FF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  signUpButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    color: '#888',
    paddingHorizontal: 16,
    fontSize: 16,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 30,
    paddingVertical: 14,
    marginBottom: 24,
  },
  googleIconContainer: {
    marginRight: 12,
  },
  googleIcon: {
    color: '#DB4437',
    fontSize: 20,
    fontWeight: 'bold',
  },
  googleButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  },
  loginTextContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  loginQuestion: {
    color: '#666',
    fontSize: 14,
  },
  loginLink: {
    color: '#0A84FF',
    fontSize: 14,
    fontWeight: '500',
  },
});