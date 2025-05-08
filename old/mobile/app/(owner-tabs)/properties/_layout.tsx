
import { Stack } from 'expo-router';
import { useAuth } from '../../../src/contexts/AuthContext';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function PropertiesLayout() {
  const { user } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (user && user.role !== 'owner') {
      // Redirect non-owner users
      router.replace('/(user-tabs)/profile');
    }
  }, [user, router]);
  
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="create" options={{ presentation: 'modal' }} />
      <Stack.Screen name="edit" options={{ presentation: 'modal' }} />
      <Stack.Screen name="details" />
    </Stack>
  );
}
