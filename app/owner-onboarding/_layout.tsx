import { Stack } from 'expo-router';
import { OnboardingProvider } from '../../contexts/OnboardingContext';

export default function OwnerOnboardingLayout() {
  return (
    <OnboardingProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#f5f5f5' },
          animation: 'slide_from_right',
        }}
      />
    </OnboardingProvider>
  );
}