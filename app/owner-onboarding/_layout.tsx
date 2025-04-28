import { Stack } from 'expo-router';

export default function OwnerOnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#f5f5f5' },
        animation: 'slide_from_right',
      }}
    />
  );
}