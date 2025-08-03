import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, FlatList, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useThemeStore } from '@/store/themeStore';
import { useAuthStore } from '@/store/authStore';
import { TranslationSelector } from '@/components/TranslationSelector';
import { usePrayerStore } from '@/store/prayerStore';
import { ChevronLeft, ChevronRight, Share2, BookmarkPlus, Book, ChevronDown, RefreshCw, Bookmark, CheckCircle } from 'lucide-react-native';
import { bibleBooks } from '@/constants/colors';
import { fetchBibleChapter, validateChapter } from '@/mocks/bibleContent';
import { readingPlans } from '@/mocks/readingPlans';
import { BibleVerse } from '@/types';

export default function BibleReaderScreen() {
  const router = useRouter();
  const { 
    book: bookParam, 
    bookId: bookIdParam, 
    chapter: chapterParam,
    planId,
    planDay,
    readingIndex 
  } = useLocalSearchParams<{ 
    book?: string; 
    bookId?: string; 
    chapter?: string;
    planId?: string;
    planDay?: string;
    readingIndex?: string;
  }>();
  const { 
    preferredTranslation, 
    addBookmark, 
    removeBookmark, 
    setLastReadingPosition, 
    getBookmarks,
    lastReadingPosition,
    getReadingProgress,
    updateReadingProgress
  } = usePrayerStore();
  const { colors } = useThemeStore();
  const { isAuthenticated } = useAuthStore();
  
  const bookId = bookIdParam || bookParam || lastReadingPosition?.bookId || 'john';
  const book = bibleBooks.find(b => b.id === bookId) || bibleBooks.find(b => b.id === 'john')!;
  
  const [chapter, setChapter] = useState<number>(
    chapterParam ? parseInt(chapterParam) : lastReadingPosition?.chapter || 1
  );
  const [verses, setVerses] = useState<BibleVerse[]>([]);
  const [loading, setLoading] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [showBookSelector, setShowBookSelector] = useState(false);
  const [showChapterSelector, setShowChapterSelector] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  // Reading plan state
  const currentPlan = planId ? readingPlans.find(p => p.id === planId) : null;
  const currentPlanDay = planDay ? parseInt(planDay) : null;
  const currentReadingIndex = readingIndex ? parseInt(readingIndex) : null;
  const planProgress = planId ? getReadingProgress(planId) : null;

  // Load chapter content when book, chapter, or translation changes
  useEffect(() => {
    console.log('Bible Reader - Preferred Translation:', preferredTranslation);
    console.log('Bible Reader - Book ID:', bookId, 'Chapter:', chapter);
    
    // Add a small delay to ensure the preferred translation is loaded from storage
    const timer = setTimeout(() => {
      loadChapter();
      checkBookmarkStatus();
      // Update last reading position only if authenticated
      if (isAuthenticated) {
        setLastReadingPosition(bookId, chapter);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [bookId, chapter, preferredTranslation]);
  
  const checkBookmarkStatus = () => {
    const bookmarks = getBookmarks();
    const isCurrentChapterBookmarked = bookmarks.some(
      b => b.bookId === bookId && b.chapter === chapter
    );
    setIsBookmarked(isCurrentChapterBookmarked);
  };

  const loadChapter = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Ensure we have a valid translation, fallback to kjv if not set
      const translationToUse = preferredTranslation || 'kjv';
      console.log('Loading chapter with translation:', translationToUse);
      
      const chapterVerses = await fetchBibleChapter(bookId, chapter, translationToUse);
      if (chapterVerses && chapterVerses.length > 0) {
        setVerses(chapterVerses);
      } else {
        setVerses([]);
        setError(`Unable to load ${book.name} chapter ${chapter}. This chapter may not be available in the ${translationToUse.toUpperCase()} translation.`);
      }
    } catch (error) {
      console.error('Error loading chapter:', error);
      setVerses([]);
      setError('Failed to load chapter content. Please check your internet connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePreviousChapter = async () => {
    if (chapter > 1) {
      setLoading(true);
      const newChapter = chapter - 1;
      const translationToUse = preferredTranslation || 'kjv';
      const isValid = await validateChapter(bookId, newChapter, translationToUse);
      if (isValid) {
        setChapter(newChapter);
      } else {
        setLoading(false);
        Alert.alert('Chapter Not Available', `Chapter ${newChapter} is not available in this translation.`);
      }
    }
  };

  const handleNextChapter = async () => {
    if (chapter < book.chapters) {
      setLoading(true);
      const newChapter = chapter + 1;
      const translationToUse = preferredTranslation || 'kjv';
      const isValid = await validateChapter(bookId, newChapter, translationToUse);
      if (isValid) {
        setChapter(newChapter);
      } else {
        setLoading(false);
        Alert.alert('Chapter Not Available', `Chapter ${newChapter} is not available in this translation.`);
      }
    }
  };

  const increaseFontSize = () => {
    if (fontSize < 24) {
      setFontSize(fontSize + 2);
    }
  };

  const decreaseFontSize = () => {
    if (fontSize > 12) {
      setFontSize(fontSize - 2);
    }
  };

  const selectBook = (selectedBookId: string) => {
    router.push(`/bible/reader?book=${selectedBookId}`);
    setShowBookSelector(false);
    setChapter(1); // Reset to chapter 1 when changing books
  };
  
  const toggleBookmark = () => {
    if (!isAuthenticated) {
      Alert.alert(
        'Sign In Required',
        'Please sign in to bookmark verses and save your reading progress.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Sign In', onPress: () => router.push('/(auth)/login') }
        ]
      );
      return;
    }
    
    if (isBookmarked) {
      removeBookmark(bookId, chapter);
      setIsBookmarked(false);
    } else {
      addBookmark(bookId, chapter);
      setIsBookmarked(true);
    }
  };

  const selectChapter = async (selectedChapter: number) => {
    setLoading(true);
    setShowChapterSelector(false);
    const translationToUse = preferredTranslation || 'kjv';
    const isValid = await validateChapter(bookId, selectedChapter, translationToUse);
    if (isValid) {
      setChapter(selectedChapter);
    } else {
      setLoading(false);
      Alert.alert('Chapter Not Available', `Chapter ${selectedChapter} is not available in this translation.`);
    }
  };

  const getChapterNumbers = (): number[] => {
    return Array.from({ length: book.chapters }, (_, i) => i + 1);
  };

  const handleRefresh = () => {
    loadChapter();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen 
        options={{ 
          title: `${book.name} ${chapter}`,
          headerStyle: { backgroundColor: colors.card },
          headerTintColor: colors.text,
        }} 
      />
      
      <View style={[styles.header, { 
        backgroundColor: colors.card,
        borderBottomColor: colors.gray[200],
      }]}>
        <TouchableOpacity 
          style={styles.bookSelector} 
          onPress={() => setShowBookSelector(true)}
        >
          <Text style={[styles.bookTitle, { color: colors.text }]}>{book.name}</Text>
          <ChevronDown size={16} color={colors.text} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.chapterSelector} 
          onPress={() => setShowChapterSelector(true)}
        >
          <Text style={[styles.chapterTitle, { color: colors.text }]}>Chapter {chapter}</Text>
          <ChevronDown size={16} color={colors.text} />
        </TouchableOpacity>
        
        <Text style={[styles.translation, { color: colors.gray[600] }]}>{(preferredTranslation || 'kjv').toUpperCase()}</Text>
      </View>
      
      <View style={[styles.controls, { 
        backgroundColor: colors.card,
        borderBottomColor: colors.gray[200],
      }]}>
        <View style={styles.fontControls}>
          <TouchableOpacity 
            style={[styles.fontButton, { backgroundColor: colors.gray[100] }]} 
            onPress={decreaseFontSize}
            disabled={fontSize <= 12}
          >
            <Text style={[
              styles.fontButtonText, 
              { color: colors.primary },
              fontSize <= 12 && [styles.disabledText, { color: colors.gray[400] }]
            ]}>A-</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.fontButton, { backgroundColor: colors.gray[100] }]} 
            onPress={increaseFontSize}
            disabled={fontSize >= 24}
          >
            <Text style={[
              styles.fontButtonText, 
              { color: colors.primary },
              fontSize >= 24 && [styles.disabledText, { color: colors.gray[400] }]
            ]}>A+</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} onPress={handleRefresh}>
            <RefreshCw size={20} color={colors.primary} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={toggleBookmark}>
            {isBookmarked ? (
              <Bookmark size={20} color={colors.primary} fill={colors.primary} />
            ) : (
              <BookmarkPlus size={20} color={colors.primary} />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Share2 size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
      
      <ScrollView style={styles.content}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.textLight }]}>Loading chapter...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={[styles.errorText, { color: colors.textLight }]}>{error}</Text>
            <TouchableOpacity 
              style={[styles.retryButton, { backgroundColor: colors.primary }]}
              onPress={loadChapter}
            >
              <Text style={[styles.retryButtonText, { color: colors.white }]}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : verses.length > 0 ? (
          verses.map((verse) => (
            <View key={verse.verse} style={styles.verseContainer}>
              <Text style={[styles.verseNumber, { fontSize, color: colors.primary }]}>{verse.verse}</Text>
              <Text style={[styles.verseText, { fontSize, color: colors.text }]}>{verse.text}</Text>
            </View>
          ))
        ) : (
          <View style={styles.errorContainer}>
            <Text style={[styles.errorText, { color: colors.textLight }]}>
              No content available for this chapter. Please try a different chapter or translation.
            </Text>
            <TouchableOpacity 
              style={[styles.retryButton, { backgroundColor: colors.primary }]}
              onPress={loadChapter}
            >
              <Text style={[styles.retryButtonText, { color: colors.white }]}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
      
      <View style={[styles.navigation, { 
        backgroundColor: colors.card,
        borderTopColor: colors.gray[200],
      }]}>
        <TouchableOpacity 
          style={styles.navButton} 
          onPress={handlePreviousChapter}
          disabled={chapter === 1 || loading}
        >
          <ChevronLeft 
            size={24} 
            color={(chapter === 1 || loading) ? colors.gray[400] : colors.primary} 
          />
          <Text style={[
            styles.navText, 
            { color: colors.primary },
            (chapter === 1 || loading) && [styles.disabledText, { color: colors.gray[400] }]
          ]}>Previous</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navButton} 
          onPress={handleNextChapter}
          disabled={chapter === book.chapters || loading}
        >
          <Text style={[
            styles.navText, 
            { color: colors.primary },
            (chapter === book.chapters || loading) && [styles.disabledText, { color: colors.gray[400] }]
          ]}>Next</Text>
          <ChevronRight 
            size={24} 
            color={(chapter === book.chapters || loading) ? colors.gray[400] : colors.primary} 
          />
        </TouchableOpacity>
      </View>

      {/* Book Selector Modal */}
      {showBookSelector && (
        <View style={[styles.selectorModal, { backgroundColor: colors.background }]}>
          <View style={[styles.selectorHeader, { borderBottomColor: colors.gray[200] }]}>
            <Text style={[styles.selectorTitle, { color: colors.text }]}>Select Book</Text>
            <TouchableOpacity onPress={() => setShowBookSelector(false)}>
              <Text style={{ color: colors.primary }}>Close</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={bibleBooks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={[styles.selectorItem, { 
                  backgroundColor: item.id === bookId ? colors.gray[100] : 'transparent',
                }]} 
                onPress={() => selectBook(item.id)}
              >
                <Book size={16} color={colors.primary} style={styles.bookIcon} />
                <View style={styles.bookItemInfo}>
                  <Text style={[styles.selectorItemText, { color: colors.text }]}>{item.name}</Text>
                  <Text style={[styles.testamentText, { color: colors.textLight }]}>
                    {item.testament === 'old' ? 'Old Testament' : 'New Testament'}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            style={styles.selectorList}
            contentContainerStyle={styles.selectorListContent}
          />
        </View>
      )}

      {/* Chapter Selector Modal */}
      {showChapterSelector && (
        <View style={[styles.selectorModal, { backgroundColor: colors.background }]}>
          <View style={[styles.selectorHeader, { borderBottomColor: colors.gray[200] }]}>
            <Text style={[styles.selectorTitle, { color: colors.text }]}>Select Chapter</Text>
            <TouchableOpacity onPress={() => setShowChapterSelector(false)}>
              <Text style={{ color: colors.primary }}>Close</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={getChapterNumbers()}
            keyExtractor={(item) => item.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={[styles.chapterSelectorItem, { 
                  backgroundColor: item === chapter ? colors.primary : colors.gray[100],
                }]} 
                onPress={() => selectChapter(item)}
              >
                <Text style={[
                  styles.chapterSelectorText, 
                  { color: item === chapter ? colors.white : colors.text }
                ]}>{item}</Text>
              </TouchableOpacity>
            )}
            style={styles.selectorList}
            contentContainerStyle={styles.chapterSelectorContent}
            numColumns={6}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  bookSelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bookTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginRight: 4,
  },
  chapterSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  chapterTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginRight: 4,
  },
  translation: {
    fontSize: 14,
    marginTop: 4,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  fontControls: {
    flexDirection: 'row',
  },
  fontButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginRight: 8,
  },
  fontButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  disabledText: {
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  verseContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  verseNumber: {
    fontWeight: '700',
    marginRight: 8,
    width: 24,
  },
  verseText: {
    flex: 1,
    lineHeight: 24,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  navText: {
    fontSize: 16,
    fontWeight: '500',
  },
  selectorModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
  selectorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  selectorTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  selectorList: {
    flex: 1,
  },
  selectorListContent: {
    padding: 16,
  },
  selectorItem: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectorItemText: {
    fontSize: 16,
    fontWeight: '500',
  },
  bookIcon: {
    marginRight: 12,
  },
  bookItemInfo: {
    flex: 1,
  },
  testamentText: {
    fontSize: 12,
    marginTop: 2,
  },
  chapterSelectorContent: {
    padding: 16,
  },
  chapterSelectorItem: {
    flex: 1,
    margin: 4,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  chapterSelectorText: {
    fontSize: 16,
    fontWeight: '600',
  },
});