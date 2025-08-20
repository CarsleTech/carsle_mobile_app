// app/index.tsx
import { useAuth } from '@/contexts/AuthContext';
import { Redirect } from 'expo-router';

export default function Index() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null; // or loading screen
  }

  // if (user) {
  //   return <Redirect href="/(tabs)" />;
  // }
return <Redirect href="/(tabs)" />;
  // return <Redirect href="/(auth)/login" />;
}