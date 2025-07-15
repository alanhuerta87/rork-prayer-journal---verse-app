import { useEffect } from 'react';
import { router } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';

export default function IndexScreen() {
  const { isAuthenticated } = useAuthStore();
  const { colors } = useThemeStore();

  useEffect(() => {
    // Small delay to prevent flash
    const timer = setTimeout(() => {
      router.replace('/(main)');
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={{ 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center', 
      backgroundColor: colors.background 
    }}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}