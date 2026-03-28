import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useThemeStore } from '@/store/themeStore';
import { usePrayerStore } from '@/store/prayerStore';
import { useAuthStore } from '@/store/authStore';
import { BookOpen, Calendar, CheckCircle, Play, Clock } from 'lucide-react-native';
import { readingPlans } from '@/mocks/readingPlans';
import { ReadingPlan } from '@/types';

export default function ReadingPlansScreen() {
  const router = useRouter();
  const { colors } = useThemeStore();
  const { startReadingPlan, getReadingProgress } = usePrayerStore();
  const { isAuthenticated } = useAuthStore();

  const handleStartPlan = (plan: ReadingPlan) => {
    if (!isAuthenticated) {
      Alert.alert(
        'Sign In Required',
        'Please sign in to start a reading plan and track your progress.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Sign In', onPress: () => router.push('/(auth)/login') }
        ]
      );
      return;
    }

    const existingProgress = getReadingProgress(plan.id);
    if (existingProgress) {
      Alert.alert(
        'Continue Reading Plan',
        `You're already on day ${existingProgress.currentDay} of this plan. Would you like to continue?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Continue', onPress: () => router.push(`/bible/plan/${plan.id}`) }
        ]
      );
    } else {
      Alert.alert(
        'Start Reading Plan',
        `Are you ready to begin "${plan.name}"? This plan will take ${plan.duration} days to complete.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Start Plan', 
            onPress: () => {
              startReadingPlan(plan.id);
              router.push(`/bible/plan/${plan.id}`);
            }
          }
        ]
      );
    }
  };

  const renderPlanCard = ({ item: plan }: { item: ReadingPlan }) => {
    const progress = isAuthenticated ? getReadingProgress(plan.id) : null;
    const isStarted = !!progress;
    const completionPercentage = progress 
      ? Math.round((progress.completedDays.length / plan.duration) * 100)
      : 0;

    return (
      <TouchableOpacity
        style={[styles.planCard, { 
          backgroundColor: colors.card,
          shadowColor: colors.black,
          borderColor: colors.gray[200],
        }]}
        onPress={() => handleStartPlan(plan)}
        activeOpacity={0.7}
      >
        <View style={styles.planHeader}>
          <View style={[styles.planIcon, { backgroundColor: colors.primary + '20' }]}>
            <BookOpen size={24} color={colors.primary} />
          </View>
          <View style={styles.planInfo}>
            <Text style={[styles.planTitle, { color: colors.text }]}>{plan.name}</Text>
            <Text style={[styles.planDescription, { color: colors.gray[600] }]}>
              {plan.description}
            </Text>
          </View>
        </View>

        <View style={styles.planDetails}>
          <View style={styles.planStat}>
            <Calendar size={16} color={colors.gray[500]} />
            <Text style={[styles.planStatText, { color: colors.gray[600] }]}>
              {plan.duration} days
            </Text>
          </View>
          
          {isStarted && (
            <View style={styles.planStat}>
              <CheckCircle size={16} color={colors.success} />
              <Text style={[styles.planStatText, { color: colors.success }]}>
                {completionPercentage}% complete
              </Text>
            </View>
          )}
        </View>

        <View style={styles.planFooter}>
          {isStarted ? (
            <View style={styles.continueButton}>
              <Play size={16} color={colors.primary} />
              <Text style={[styles.continueButtonText, { color: colors.primary }]}>
                Continue - Day {progress?.currentDay}
              </Text>
            </View>
          ) : (
            <View style={styles.startButton}>
              <Clock size={16} color={colors.gray[500]} />
              <Text style={[styles.startButtonText, { color: colors.gray[600] }]}>
                Tap to start
              </Text>
            </View>
          )}
        </View>

        {isStarted && (
          <View style={[styles.progressBar, { backgroundColor: colors.gray[200] }]}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  backgroundColor: colors.primary,
                  width: `${completionPercentage}%`
                }
              ]} 
            />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen 
        options={{ 
          title: 'Reading Plans',
          headerStyle: { backgroundColor: colors.card },
          headerTintColor: colors.text,
        }} 
      />
      
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Bible Reading Plans</Text>
        <Text style={[styles.headerSubtitle, { color: colors.gray[600] }]}>
          Choose a plan to guide your daily Bible reading
        </Text>
      </View>

      <FlatList
        data={readingPlans}
        keyExtractor={(item) => item.id}
        renderItem={renderPlanCard}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  planCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  planIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  planInfo: {
    flex: 1,
  },
  planTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  planDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  planDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  planStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  planStatText: {
    fontSize: 14,
    marginLeft: 6,
    fontWeight: '500',
  },
  planFooter: {
    marginBottom: 12,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  startButtonText: {
    fontSize: 14,
    marginLeft: 8,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
});