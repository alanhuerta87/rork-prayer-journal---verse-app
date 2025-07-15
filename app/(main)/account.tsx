import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';
import { LogIn, BookText, Settings, User } from 'lucide-react-native';

export default function AccountScreen() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const { colors } = useThemeStore();

  if (!isAuthenticated) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Stack.Screen 
          options={{ 
            title: 'Sign In',
            headerStyle: { backgroundColor: colors.card },
            headerTintColor: colors.text,
          }} 
        />
        
        <View style={styles.authPrompt}>
          <LogIn size={64} color={colors.primary} />
          <Text style={[styles.authPromptTitle, { color: colors.text }]}>Welcome to My Prayer Journal</Text>
          <Text style={[styles.authPromptSubtitle, { color: colors.textLight }]}>
            Sign in to access your prayers, bookmarks, and personalized reading experience
          </Text>
          
          <View style={styles.authButtons}>
            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: colors.primary }]}
              onPress={() => router.push('/(auth)/login')}
            >
              <Text style={[styles.primaryButtonText, { color: colors.white }]}>Sign In</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.secondaryButton, { borderColor: colors.border }]}
              onPress={() => router.push('/(auth)/signup')}
            >
              <Text style={[styles.secondaryButtonText, { color: colors.text }]}>Create Account</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.features}>
            <Text style={[styles.featuresTitle, { color: colors.text }]}>With an account you can:</Text>
            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <BookText size={20} color={colors.primary} />
                <Text style={[styles.featureText, { color: colors.textLight }]}>Save and organize your prayers</Text>
              </View>
              <View style={styles.featureItem}>
                <User size={20} color={colors.primary} />
                <Text style={[styles.featureText, { color: colors.textLight }]}>Bookmark favorite verses</Text>
              </View>
              <View style={styles.featureItem}>
                <Settings size={20} color={colors.primary} />
                <Text style={[styles.featureText, { color: colors.textLight }]}>Customize your reading experience</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }

  // If authenticated, redirect to the full tabs experience
  React.useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen 
        options={{ 
          title: 'My Account',
          headerStyle: { backgroundColor: colors.card },
          headerTintColor: colors.text,
        }} 
      />
      
      <View style={styles.loadingContainer}>
        <Text style={[styles.loadingText, { color: colors.text }]}>Loading...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  authPrompt: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  authPromptTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 24,
    textAlign: 'center',
  },
  authPromptSubtitle: {
    fontSize: 16,
    marginTop: 12,
    textAlign: 'center',
    lineHeight: 22,
  },
  authButtons: {
    width: '100%',
    marginTop: 32,
    gap: 12,
  },
  primaryButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  features: {
    marginTop: 48,
    width: '100%',
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  featuresList: {
    gap: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 16,
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
});