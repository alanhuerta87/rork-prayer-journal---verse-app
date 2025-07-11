import { Tabs, router } from 'expo-router';
import React, { useEffect } from 'react';
import { useThemeStore } from '@/store/themeStore';
import { useAuthStore } from '@/store/authStore';
import { Home, BookOpen, BookText, Settings } from 'lucide-react-native';
import { Platform } from 'react-native';
import { AppLogo } from '@/components/AppLogo';

export default function TabLayout() {
  const { theme, colors } = useThemeStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/(auth)/login');
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return null;
  }
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          elevation: 0,
          shadowOpacity: 0,
          height: Platform.OS === 'ios' ? 90 : 75, // Increased height for better visibility
          paddingBottom: Platform.OS === 'ios' ? 30 : 15, // More padding for iOS safe area
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          paddingBottom: Platform.OS === 'ios' ? 0 : 8, // Adjust label positioning
        },
        tabBarIconStyle: {
          marginTop: Platform.OS === 'ios' ? 0 : 6, // Adjust icon positioning
        },
        headerStyle: {
          backgroundColor: colors.card,
          shadowColor: 'transparent',
          elevation: 0,
        },
        headerTitleStyle: {
          fontWeight: '600',
          color: colors.text,
        },
        headerRight: () => <AppLogo size={28} />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
          headerTitle: "My Prayer Journal",
        }}
      />
      <Tabs.Screen
        name="prayers"
        options={{
          title: "Prayers",
          tabBarIcon: ({ color, size }) => <BookText size={size} color={color} />,
          headerTitle: "My Prayers",
        }}
      />
      <Tabs.Screen
        name="bible"
        options={{
          title: "Bible",
          tabBarIcon: ({ color, size }) => <BookOpen size={size} color={color} />,
          headerTitle: "Bible",
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
          headerTitle: "Settings",
        }}
      />
    </Tabs>
  );
}