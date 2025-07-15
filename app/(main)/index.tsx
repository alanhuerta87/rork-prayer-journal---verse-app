import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';
import { BookOpen, LogIn, BookText, Heart } from 'lucide-react-native';

export default function MainScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { colors } = useThemeStore();

  React.useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen 
        options={{ 
          title: 'My Prayer Journal',
          headerStyle: { backgroundColor: colors.card },
          headerTintColor: colors.text,
        }} 
      />
      
      <View style={styles.content}>
        <View style={styles.hero}>
          <Heart size={64} color={colors.primary} />
          <Text style={[styles.heroTitle, { color: colors.text }]}>My Prayer Journal</Text>
          <Text style={[styles.heroSubtitle, { color: colors.textLight }]}>
            Read the Bible and keep track of your spiritual journey
          </Text>
        </View>
        
        <View style={styles.features}>
          <View style={styles.featureItem}>
            <BookOpen size={24} color={colors.primary} />
            <Text style={[styles.featureText, { color: colors.textLight }]}>Read the Bible anytime</Text>
          </View>
          <View style={styles.featureItem}>
            <BookText size={24} color={colors.primary} />
            <Text style={[styles.featureText, { color: colors.textLight }]}>Save your prayers and thoughts</Text>
          </View>
          <View style={styles.featureItem}>
            <Heart size={24} color={colors.primary} />
            <Text style={[styles.featureText, { color: colors.textLight }]}>Track your spiritual growth</Text>
          </View>
        </View>
        
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push('/(auth)/login')}
          >
            <LogIn size={20} color={colors.white} />
            <Text style={[styles.primaryButtonText, { color: colors.white }]}>Sign In</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.secondaryButton, { borderColor: colors.border }]}
            onPress={() => router.push('/(auth)/signup')}
          >
            <Text style={[styles.secondaryButtonText, { color: colors.text }]}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 32,
    justifyContent: 'center',
  },
  hero: {
    alignItems: 'center',
    marginBottom: 48,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginTop: 16,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 22,
  },
  features: {
    marginBottom: 48,
    gap: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  featureText: {
    fontSize: 16,
    flex: 1,
  },
  actions: {
    gap: 12,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
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
});