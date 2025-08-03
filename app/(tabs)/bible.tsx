import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { TranslationSelector } from '@/components/TranslationSelector';
import { BookmarksList } from '@/components/BookmarksList';
import { useThemeStore } from '@/store/themeStore';
import { usePrayerStore } from '@/store/prayerStore';
import { useAuthStore } from '@/store/authStore';
import { useRouter, Stack } from 'expo-router';
import { BookOpen, ChevronRight, Search, X, Bookmark, History, Calendar, Play, Clock } from 'lucide-react-native';
import { bibleBooks } from '@/constants/colors';
import { readingPlans } from '@/mocks/readingPlans';

export default function BibleScreen() {
  const router = useRouter();
  const { colors } = useThemeStore();
  const { lastReadingPosition, startReadingPlan, getReadingProgress } = usePrayerStore();
  const { isAuthenticated } = useAuthStore();
  const [activeTestament, setActiveTestament] = React.useState<'old' | 'new'>('new');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeTab, setActiveTab] = React.useState<'books' | 'bookmarks' | 'plans'>('books');

  const filteredBooks = bibleBooks
    .filter(book => book.testament === activeTestament)
    .filter(book => 
      searchQuery ? book.name.toLowerCase().includes(searchQuery.toLowerCase()) : true
    );

  const handleOpenReader = (bookId: string) => {
    router.push({
      pathname: '/bible/reader',
      params: { book: bookId }
    });
  };
  
  const handleContinueReading = () => {
    if (lastReadingPosition) {
      router.push({
        pathname: '/bible/reader',
        params: { book: lastReadingPosition.bookId }
      });
    }
  };
  
  const getBookName = (bookId: string) => {
    const book = bibleBooks.find(b => b.id === bookId);
    return book?.name || bookId;
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const handleStartPlan = (planId: string) => {
    const plan = readingPlans.find(p => p.id === planId);
    if (!plan) return;

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

  const oldTestamentCount = bibleBooks.filter(book => book.testament === 'old').length;
  const newTestamentCount = bibleBooks.filter(book => book.testament === 'new').length;

  // Get active reading plans and featured plans
  const activeReadingPlans = isAuthenticated ? readingPlans.filter(plan => {
    const progress = getReadingProgress(plan.id);
    return progress && progress.completedDays.length < plan.duration;
  }) : [];
  
  // Get the first 3 reading plans for featured display
  const featuredPlans = readingPlans.slice(0, 3);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen 
        options={{ 
          title: 'Bible',
          headerStyle: { backgroundColor: colors.card },
          headerTintColor: colors.text,
        }} 
      />
      
      <TranslationSelector />
      
      {/* Continue Reading Section */}
      {lastReadingPosition && activeTab === 'books' && (
        <View style={[styles.continueReadingContainer, { 
          backgroundColor: colors.card,
          borderColor: colors.primary 
        }]}>
          <View style={styles.continueReadingContent}>
            <History size={20} color={colors.primary} />
            <View style={styles.continueReadingText}>
              <Text style={[styles.continueReadingTitle, { color: colors.text }]}>Continue Reading</Text>
              <Text style={[styles.continueReadingSubtitle, { color: colors.textLight }]}>
                {getBookName(lastReadingPosition.bookId)} {lastReadingPosition.chapter}
              </Text>
            </View>
          </View>
          <TouchableOpacity 
            style={[styles.continueButton, { backgroundColor: colors.primary }]}
            onPress={handleContinueReading}
          >
            <Text style={[styles.continueButtonText, { color: colors.white }]}>Continue</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {/* Tab Selector */}
      <View style={styles.tabSelector}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            { borderBottomColor: colors.gray[300] },
            activeTab === 'books' && [styles.activeTabButton, { borderBottomColor: colors.primary }],
          ]}
          onPress={() => setActiveTab('books')}
          activeOpacity={0.7}
        >
          <BookOpen size={16} color={activeTab === 'books' ? colors.primary : colors.gray[600]} />
          <Text
            style={[
              styles.tabButtonText,
              { color: colors.gray[600] },
              activeTab === 'books' && [styles.activeTabButtonText, { color: colors.primary }],
            ]}
          >
            Books
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tabButton,
            { borderBottomColor: colors.gray[300] },
            activeTab === 'bookmarks' && [styles.activeTabButton, { borderBottomColor: colors.primary }],
          ]}
          onPress={() => setActiveTab('bookmarks')}
          activeOpacity={0.7}
        >
          <Bookmark size={16} color={activeTab === 'bookmarks' ? colors.primary : colors.gray[600]} />
          <Text
            style={[
              styles.tabButtonText,
              { color: colors.gray[600] },
              activeTab === 'bookmarks' && [styles.activeTabButtonText, { color: colors.primary }],
            ]}
          >
            Bookmarks
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tabButton,
            { borderBottomColor: colors.gray[300] },
            activeTab === 'plans' && [styles.activeTabButton, { borderBottomColor: colors.primary }],
          ]}
          onPress={() => setActiveTab('plans')}
          activeOpacity={0.7}
        >
          <Calendar size={16} color={activeTab === 'plans' ? colors.primary : colors.gray[600]} />
          <Text
            style={[
              styles.tabButtonText,
              { color: colors.gray[600] },
              activeTab === 'plans' && [styles.activeTabButtonText, { color: colors.primary }],
            ]}
          >
            Plans
          </Text>
        </TouchableOpacity>
      </View>
      
      {activeTab === 'books' && (
        <>
          <View style={[styles.searchContainer, { backgroundColor: colors.card }]}>
            <View style={[styles.searchInputContainer, { backgroundColor: colors.gray[100] }]}>
              <Search size={18} color={colors.gray[500]} style={styles.searchIcon} />
              <TextInput
                style={[styles.searchInput, { color: colors.text }]}
                placeholder="Search books..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor={colors.gray[400]}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
                  <X size={18} color={colors.gray[500]} />
                </TouchableOpacity>
              )}
            </View>
          </View>
          
          <View style={styles.testamentSelector}>
            <TouchableOpacity
              style={[
                styles.testamentButton,
                { borderBottomColor: colors.gray[300] },
                activeTestament === 'old' && [styles.activeTestamentButton, { borderBottomColor: colors.primary }],
              ]}
              onPress={() => setActiveTestament('old')}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.testamentButtonText,
                  { color: colors.gray[600] },
                  activeTestament === 'old' && [styles.activeTestamentButtonText, { color: colors.primary }],
                ]}
              >
                Old Testament ({oldTestamentCount})
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.testamentButton,
                { borderBottomColor: colors.gray[300] },
                activeTestament === 'new' && [styles.activeTestamentButton, { borderBottomColor: colors.primary }],
              ]}
              onPress={() => setActiveTestament('new')}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.testamentButtonText,
                  { color: colors.gray[600] },
                  activeTestament === 'new' && [styles.activeTestamentButtonText, { color: colors.primary }],
                ]}
              >
                New Testament ({newTestamentCount})
              </Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.booksList} showsVerticalScrollIndicator={false}>
            {filteredBooks.map((book) => (
              <TouchableOpacity
                key={book.id}
                style={[styles.bookItem, { 
                  borderBottomColor: colors.gray[200],
                  backgroundColor: colors.card 
                }]}
                onPress={() => handleOpenReader(book.id)}
                activeOpacity={0.7}
              >
                <View style={styles.bookItemContent}>
                  <BookOpen size={20} color={colors.primary} style={styles.bookIcon} />
                  <View style={styles.bookInfo}>
                    <Text style={[styles.bookName, { color: colors.text }]}>{book.name}</Text>
                    <Text style={[styles.chapterCount, { color: colors.textLight }]}>
                      {book.chapters} chapter{book.chapters !== 1 ? 's' : ''}
                    </Text>
                  </View>
                </View>
                <ChevronRight size={20} color={colors.gray[400]} />
              </TouchableOpacity>
            ))}
            
            {filteredBooks.length === 0 && (
              <View style={styles.noResults}>
                <Text style={[styles.noResultsText, { color: colors.textLight }]}>
                  No books found matching "{searchQuery}"
                </Text>
              </View>
            )}
            
            <View style={styles.footer}>
              <Text style={[styles.footerText, { color: colors.textLight }]}>
                {activeTestament === 'old' ? 'Old Testament' : 'New Testament'} • {filteredBooks.length} books
              </Text>
              <Text style={[styles.footerSubtext, { color: colors.gray[400] }]}>
                Tap any book to start reading
              </Text>
            </View>
          </ScrollView>
        </>
      )}
      
      {activeTab === 'bookmarks' && (
        <BookmarksList />
      )}
      
      {activeTab === 'plans' && (
        <View style={styles.plansContainer}>
          <View style={styles.plansHeader}>
            <Text style={[styles.plansTitle, { color: colors.text }]}>Reading Plans</Text>
            <Text style={[styles.plansSubtitle, { color: colors.gray[600] }]}>
              Structured Bible reading to deepen your faith journey
            </Text>
          </View>
          
          {/* Active Reading Plans Section */}
          {activeReadingPlans.length > 0 && (
            <View style={styles.activeSection}>
              <Text style={[styles.activeSectionTitle, { color: colors.text }]}>Continue Reading</Text>
              {activeReadingPlans.map((plan) => {
                const progress = getReadingProgress(plan.id)!;
                const completionPercentage = Math.round((progress.completedDays.length / plan.duration) * 100);
                
                return (
                  <TouchableOpacity
                    key={plan.id}
                    style={[styles.activePlanCard, { 
                      backgroundColor: colors.card,
                      borderColor: colors.primary,
                      shadowColor: colors.black,
                    }]}
                    onPress={() => router.push(`/bible/plan/${plan.id}`)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.activePlanHeader}>
                      <View style={[styles.activePlanIcon, { backgroundColor: colors.primary + '20' }]}>
                        <BookOpen size={20} color={colors.primary} />
                      </View>
                      <View style={styles.activePlanInfo}>
                        <Text style={[styles.activePlanTitle, { color: colors.text }]}>{plan.name}</Text>
                        <Text style={[styles.activePlanProgress, { color: colors.gray[600] }]}>
                          Day {progress.currentDay} of {plan.duration} • {completionPercentage}% complete
                        </Text>
                      </View>
                      <View style={[styles.continueIndicator, { backgroundColor: colors.primary + '20' }]}>
                        <Play size={16} color={colors.primary} />
                      </View>
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
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
          
          <TouchableOpacity
            style={[styles.viewAllPlansButton, { 
              backgroundColor: colors.primary,
              shadowColor: colors.black,
            }]}
            onPress={() => router.push('/bible/reading-plans')}
            activeOpacity={0.8}
          >
            <Calendar size={20} color={colors.white} />
            <Text style={[styles.viewAllPlansText, { color: colors.white }]}>
              View All Reading Plans
            </Text>
            <ChevronRight size={20} color={colors.white} />
          </TouchableOpacity>
          
          <View style={styles.plansFeatures}>
            {featuredPlans.map((plan, index) => {
              const progress = isAuthenticated ? getReadingProgress(plan.id) : null;
              const isStarted = !!progress;
              const iconColors = [colors.primary, colors.success, '#F59E0B'];
              const iconColor = iconColors[index] || colors.primary;
              
              return (
                <TouchableOpacity
                  key={plan.id}
                  style={[styles.featureItem, styles.clickableFeatureItem, { 
                    backgroundColor: colors.card,
                    borderColor: colors.gray[200],
                  }]}
                  onPress={() => handleStartPlan(plan.id)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.featureIcon, { backgroundColor: iconColor + '20' }]}>
                    <BookOpen size={20} color={iconColor} />
                  </View>
                  <View style={styles.featureText}>
                    <Text style={[styles.featureTitle, { color: colors.text }]}>{plan.name}</Text>
                    <Text style={[styles.featureDescription, { color: colors.gray[600] }]}>
                      {plan.description}
                    </Text>
                    <View style={styles.planMeta}>
                      <Text style={[styles.planDuration, { color: colors.gray[500] }]}>
                        {plan.duration} days
                      </Text>
                      {isStarted && (
                        <View style={styles.planStatus}>
                          <Play size={12} color={colors.primary} />
                          <Text style={[styles.planStatusText, { color: colors.primary }]}>
                            Day {progress?.currentDay}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                  <View style={styles.featureAction}>
                    {isStarted ? (
                      <View style={[styles.continueIndicator, { backgroundColor: colors.primary + '20' }]}>
                        <Play size={16} color={colors.primary} />
                      </View>
                    ) : (
                      <View style={[styles.startIndicator, { backgroundColor: colors.gray[100] }]}>
                        <Clock size={16} color={colors.gray[500]} />
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  continueReadingContainer: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  continueReadingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  continueReadingText: {
    marginLeft: 12,
    flex: 1,
  },
  continueReadingTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  continueReadingSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  continueButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  continueButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  tabSelector: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderBottomWidth: 2,
    gap: 6,
  },
  activeTabButton: {
    borderBottomWidth: 2,
  },
  tabButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  activeTabButtonText: {
    fontWeight: '600',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  clearButton: {
    padding: 8,
  },
  testamentSelector: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginVertical: 16,
  },
  testamentButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
  },
  activeTestamentButton: {
    borderBottomWidth: 2,
  },
  testamentButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  activeTestamentButtonText: {
    fontWeight: '600',
  },
  booksList: {
    flex: 1,
  },
  bookItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  bookItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bookIcon: {
    marginRight: 12,
  },
  bookInfo: {
    flex: 1,
  },
  bookName: {
    fontSize: 16,
    fontWeight: '500',
  },
  chapterCount: {
    fontSize: 14,
    marginTop: 2,
  },
  noResults: {
    padding: 20,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 16,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    fontWeight: '500',
  },
  footerSubtext: {
    fontSize: 12,
    marginTop: 4,
  },
  plansContainer: {
    flex: 1,
    padding: 16,
  },
  plansHeader: {
    marginBottom: 24,
  },
  plansTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  plansSubtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  viewAllPlansButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 32,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  viewAllPlansText: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 12,
  },
  plansFeatures: {
    gap: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clickableFeatureItem: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  planMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 12,
  },
  planDuration: {
    fontSize: 12,
    fontWeight: '500',
  },
  planStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  planStatusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  featureAction: {
    marginLeft: 12,
  },
  continueIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeSection: {
    marginBottom: 32,
  },
  activeSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  activePlanCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  activePlanHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  activePlanIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activePlanInfo: {
    flex: 1,
  },
  activePlanTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  activePlanProgress: {
    fontSize: 14,
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