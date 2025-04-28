import { Redirect } from 'expo-router';

export default function Index() {
  // Redirect to the welcome screen (tabs index) first
  return <Redirect href="/(tabs)" />;
}