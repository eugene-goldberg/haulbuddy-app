import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { router } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';

export default function OnboardingLayout() {
  const { user, userRole, isLoading } = useAuth();
  
  // Only redirect if coming directly to onboarding
  useEffect(() => {
    console.log('Onboarding layout - Auth state:', {
      isAuthenticated: !!user,
      isLoading,
      userEmail: user?.email,
      fromWelcomeScreen: router.canGoBack()
    });
    
    // Only redirect if user is authenticated AND we didn't navigate here from the welcome screen
    // This prevents redirection loops when coming from the welcome screen's continue button
    if (!isLoading && user && !router.canGoBack()) {
      console.log('User is already authenticated, redirecting from onboarding');
      if (userRole === 'owner') {
        router.replace('/owner-dashboard');
      } else {
        router.replace('/(tabs)');
      }
    }
  }, [user, userRole, isLoading]);

  // Don't prevent rendering because we need to see the onboarding screens when not logged in
  
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#ffffff' },
        animation: 'slide_from_right',
      }}
    />
  );
}