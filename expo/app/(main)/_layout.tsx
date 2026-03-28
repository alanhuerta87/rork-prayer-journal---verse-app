import { Tabs, router } from 'expo-router';
import React from 'react';
import { useThemeStore } from '@/store/themeStore';
import { useAuthStore } from '@/store/authStore';
import { BookOpen, BookText, Settings, LogIn, Home } from 'lucide-react-native';
import { Platform, TouchableOpacity } from 'react-native';
import { AppLogo } from '@/components/AppLogo';

export default function MainLayout() {
  const { theme, colors } = useThemeStore();
  const { isAuthenticated } = useAuthStore();

  const handleAuthPress = () => {
    if (isAuthenticated) {
      router.push('/(tabs)');
    } else {
      router.push('/(auth)/login');
    }
  };
  
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
          height: Platform.OS === 'ios' ? 90 : 75,
          paddingBottom: Platform.OS === 'ios' ? 30 : 15,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          paddingBottom: Platform.OS === 'ios' ? 0 : 8,
        },
        tabBarIconStyle: {
          marginTop: Platform.OS === 'ios' ? 0 : 6,
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
        name="bible"
        options={{
          title: "Bible",
          tabBarIcon: ({ color, size }) => <BookOpen size={size} color={color} />,
          headerTitle: "Bible",
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: isAuthenticated ? "My Account" : "Sign In",
          tabBarIcon: ({ color, size }) => 
            isAuthenticated ? <BookText size={size} color={color} /> : <LogIn size={size} color={color} />,
          headerTitle: isAuthenticated ? "My Prayer Journal" : "Sign In",
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            handleAuthPress();
          },
        }}
      />
    </Tabs>
  );
}