import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { router } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';

export default function OnboardingLayout() {
  const { user, userRole, isLoading } = useAuth();
  
  // Check authentication and redirect if needed
  useEffect(() => {
    if (!isLoading && user) {
      // User is already authenticated, redirect based on role
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