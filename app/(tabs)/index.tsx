import React, { useEffect } from 'react';
import { StyleSheet, View, ScrollView, RefreshControl, ActivityIndicator, Text } from 'react-native';
import { VerseCard } from '@/components/VerseCard';
import { PrayerInput } from '@/components/PrayerInput';
import { PrayerCard } from '@/components/PrayerCard';
import { EmptyState } from '@/components/EmptyState';
import { usePrayerStore } from '@/store/prayerStore';
import { useThemeStore } from '@/store/themeStore';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useThemeStore();
  const { 
    currentVerse, 
    prayers, 
    refreshDailyVerse, 
    lastVerseDate, 
    isLoadingVerse 
  } = usePrayerStore();
  const [refreshing, setRefreshing] = React.useState(false);

  // Check for a new verse on app load and component mount
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    
    // If we don't have a verse for today yet, or no verse at all, refresh it
    if (!lastVerseDate || lastVerseDate !== today || !currentVerse) {
      refreshDailyVerse();
    }
  }, []);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refreshDailyVerse();
    setRefreshing(false);
  }, [refreshDailyVerse]);

  const navigateToNewPrayer = () => {
    router.push('/prayers');
  };

  const recentPrayers = prayers.slice(0, 1);

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl 
          refreshing={refreshing} 
          onRefresh={onRefresh} 
          colors={[colors.primary]}
          tintColor={colors.primary}
        />
      }
    >
      {/* Verse of the Day Section */}
      {isLoadingVerse ? (
        <View style={[styles.loadingContainer, { backgroundColor: colors.card }]}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textLight }]}>Loading today's verse...</Text>
        </View>
      ) : currentVerse ? (
        <VerseCard verse={currentVerse} />
      ) : (
        <View style={[styles.errorContainer, { backgroundColor: colors.card }]}>
          <Text style={[styles.errorText, { color: colors.textLight }]}>
            Unable to load today's verse. Pull down to refresh.
          </Text>
        </View>
      )}
      
      {/* Prayer Input Section */}
      <PrayerInput />
      
      {/* Recent Prayers Section */}
      <View style={styles.recentPrayersSection}>
        {recentPrayers.length > 0 ? (
          <>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Prayer</Text>
            </View>
            {recentPrayers.map((prayer) => (
              <PrayerCard key={prayer.id} prayer={prayer} />
            ))}
          </>
        ) : (
          <EmptyState type="prayers" onAction={navigateToNewPrayer} />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingVertical: 16,
    paddingBottom: 32,
  },
  loadingContainer: {
    borderRadius: 16,
    padding: 40,
    marginHorizontal: 16,
    marginVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  recentPrayersSection: {
    marginTop: 16,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
});