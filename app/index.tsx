import { Redirect } from 'expo-router';

export default function Index() {
  // Always show the welcome screen (tabs index) first
  return <Redirect href="/(tabs)" />;
}