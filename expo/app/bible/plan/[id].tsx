import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useThemeStore } from '@/store/themeStore';
import { usePrayerStore } from '@/store/prayerStore';
import { useAuthStore } from '@/store/authStore';
import { BookOpen, CheckCircle, Circle, Calendar, ArrowRight } from 'lucide-react-native';
import { readingPlans } from '@/mocks/readingPlans';
import { ReadingPlan, ReadingPlanDay } from '@/types';

export default function ReadingPlanDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useThemeStore();
  const { getReadingProgress, updateReadingProgress, startReadingPlan } = usePrayerStore();
  const { isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const plan = readingPlans.find(p => p.id === id);
  const progress = isAuthenticated ? getReadingProgress(id!) : null;

  useEffect(() => {
    if (!plan) {
      Alert.alert('Plan Not Found', 'The requested reading plan could not be found.', [
        { text: 'OK', onPress: () => router.back() }
      ]);
      return;
    }

    if (!isAuthenticated) {
      Alert.alert(
        'Sign In Required',
        'Please sign in to access reading plans.',
        [
          { text: 'Cancel', onPress: () => router.back() },
          { text: 'Sign In', onPress: () => router.push('/(auth)/login') }
        ]
      );
      return;
    }

    // Start the plan if not already started
    if (!progress) {
      startReadingPlan(id!);
    }
  }, [plan, isAuthenticated, progress, id]);

  if (!plan || !isAuthenticated) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </View>
    );
  }

  const handleDayPress = (day: ReadingPlanDay) => {
    if (!progress) return;

    const isCompleted = progress.completedDays.includes(day.day);
    const isCurrentOrPast = day.day <= progress.currentDay;

    if (!isCurrentOrPast && day.day > progress.currentDay + 1) {
      Alert.alert(
        'Complete Previous Days',
        'Please complete the previous days before moving ahead.',
        [{ text: 'OK' }]
      );
      return;
    }

    if (isCompleted) {
      Alert.alert(
        'Day Already Completed',
        'You have already completed this day. Would you like to read it again?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Read Again', onPress: () => navigateToReading(day) }
        ]
      );
    } else {
      navigateToReading(day);
    }
  };

  const navigateToReading = (day: ReadingPlanDay) => {
    // Navigate to the first reading of the day
    if (day.readings.length > 0) {
      const firstReading = day.readings[0];
      router.push({
        pathname: '/bible/reader',
        params: {
          bookId: firstReading.bookId,
          chapter: firstReading.chapter.toString(),
          planId: id,
          planDay: day.day.toString(),
          readingIndex: '0'
        }
      });
    }
  };

  const markDayComplete = (dayNumber: number) => {
    if (progress && !progress.completedDays.includes(dayNumber)) {
      updateReadingProgress(id!, dayNumber);
    }
  };

  const renderDayItem = ({ item: day }: { item: ReadingPlanDay }) => {
    if (!progress) return null;

    const isCompleted = progress.completedDays.includes(day.day);
    const isCurrentDay = day.day === progress.currentDay;
    const isAvailable = day.day <= progress.currentDay;
    const isFuture = day.day > progress.currentDay;

    return (
      <TouchableOpacity
        style={[
          styles.dayCard,
          {
            backgroundColor: colors.card,
            borderColor: isCurrentDay ? colors.primary : colors.gray[200],
            opacity: isFuture ? 0.6 : 1,
          }
        ]}
        onPress={() => handleDayPress(day)}
        disabled={loading}
        activeOpacity={0.7}
      >
        <View style={styles.dayHeader}>
          <View style={styles.dayInfo}>
            <View style={styles.dayNumber}>
              {isCompleted ? (
                <CheckCircle size={24} color={colors.success} />
              ) : (
                <Circle size={24} color={isCurrentDay ? colors.primary : colors.gray[400]} />
              )}
              <Text style={[
                styles.dayText,
                {
                  color: isCompleted ? colors.success : isCurrentDay ? colors.primary : colors.text,
                  fontWeight: isCurrentDay ? '700' : '600'
                }
              ]}>
                Day {day.day}
              </Text>
            </View>
            {isCurrentDay && (
              <View style={[styles.currentBadge, { backgroundColor: colors.primary }]}>
                <Text style={[styles.currentBadgeText, { color: colors.white }]}>Current</Text>
              </View>
            )}
          </View>
          <ArrowRight size={20} color={colors.gray[400]} />
        </View>

        <View style={styles.readingsContainer}>
          {day.readings.map((reading, index) => (
            <View key={index} style={styles.readingItem}>
              <BookOpen size={16} color={colors.gray[500]} />
              <Text style={[styles.readingText, { color: colors.gray[600] }]}>
                {reading.bookId.charAt(0).toUpperCase() + reading.bookId.slice(1)} {reading.chapter}
                {reading.verses ? `:${reading.verses.join(', ')}` : ''}
              </Text>
            </View>
          ))}
        </View>
      </TouchableOpacity>
    );
  };

  const completionPercentage = progress 
    ? Math.round((progress.completedDays.length / plan.duration) * 100)
    : 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen 
        options={{ 
          title: plan.name,
          headerStyle: { backgroundColor: colors.card },
          headerTintColor: colors.text,
        }} 
      />
      
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <Text style={[styles.planTitle, { color: colors.text }]}>{plan.name}</Text>
        <Text style={[styles.planDescription, { color: colors.gray[600] }]}>
          {plan.description}
        </Text>
        
        <View style={styles.progressSection}>
          <View style={styles.progressInfo}>
            <View style={styles.progressStat}>
              <Calendar size={16} color={colors.primary} />
              <Text style={[styles.progressStatText, { color: colors.text }]}>
                Day {progress?.currentDay || 1} of {plan.duration}
              </Text>
            </View>
            <Text style={[styles.progressPercentage, { color: colors.primary }]}>
              {completionPercentage}% Complete
            </Text>
          </View>
          
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
        </View>
      </View>

      <FlatList
        data={plan.readings}
        keyExtractor={(item) => `day-${item.day}`}
        renderItem={renderDayItem}
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
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  planTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  planDescription: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 20,
  },
  progressSection: {
    marginTop: 8,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressStat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressStatText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  progressPercentage: {
    fontSize: 16,
    fontWeight: '700',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  listContent: {
    padding: 16,
  },
  dayCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dayInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dayNumber: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dayText: {
    fontSize: 18,
    marginLeft: 8,
  },
  currentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 12,
  },
  currentBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  readingsContainer: {
    gap: 8,
  },
  readingItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readingText: {
    fontSize: 14,
    marginLeft: 8,
    fontWeight: '500',
  },
});