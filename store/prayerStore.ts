import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Prayer, DailyVerse, BibleTranslation, PrayerCategory, PrayerStatus, ReadingPlan, UserReadingProgress } from '@/types';
import { getTodayVerse, getVerseForDate } from '@/mocks/verses';
import { useAuthStore } from './authStore';

interface BookmarkState {
  bookId: string;
  chapter: number;
  verse?: number;
  translation: BibleTranslation;
  timestamp: string;
}

interface PrayerState {
  prayers: Prayer[];
  currentVerse: DailyVerse | null;
  lastVerseDate: string | null;
  preferredTranslation: BibleTranslation;
  isLoadingVerse: boolean;
  bookmarks: BookmarkState[];
  lastReadingPosition: BookmarkState | null;
  readingProgress: UserReadingProgress[];
  verseHighlights: { [key: string]: { highlighted: boolean; note?: string } };
  customTags: string[];
  addPrayer: (prayer: Omit<Prayer, 'id' | 'date' | 'isFavorite' | 'status'>) => void;
  updatePrayer: (prayer: Prayer) => void;
  deletePrayer: (id: string) => void;
  clearAllPrayers: () => void;
  toggleFavorite: (id: string) => void;
  updatePrayerStatus: (id: string, status: PrayerStatus, answeredDate?: string) => void;
  filterPrayersByCategory: (category?: PrayerCategory) => Prayer[];
  filterPrayersByStatus: (status?: PrayerStatus) => Prayer[];
  setPreferredTranslation: (translation: BibleTranslation) => void;
  refreshDailyVerse: () => Promise<void>;
  loadVerseForDate: (date: Date) => Promise<void>;
  addBookmark: (bookId: string, chapter: number, verse?: number) => void;
  removeBookmark: (bookId: string, chapter: number) => void;
  setLastReadingPosition: (bookId: string, chapter: number, verse?: number) => void;
  getBookmarks: () => BookmarkState[];
  startReadingPlan: (planId: string) => void;
  updateReadingProgress: (planId: string, day: number) => void;
  getReadingProgress: (planId: string) => UserReadingProgress | null;
  highlightVerse: (bookId: string, chapter: number, verse: number, note?: string) => void;
  removeVerseHighlight: (bookId: string, chapter: number, verse: number) => void;
  getVerseHighlight: (bookId: string, chapter: number, verse: number) => { highlighted: boolean; note?: string } | null;
  addCustomTag: (tag: string) => void;
  removeCustomTag: (tag: string) => void;
  getCustomTags: () => string[];
}

export const usePrayerStore = create<PrayerState>()(
  persist(
    (set, get) => ({
      prayers: [],
      currentVerse: null,
      lastVerseDate: null,
      preferredTranslation: 'kjv', // Updated to match available translations
      isLoadingVerse: false,
      bookmarks: [],
      lastReadingPosition: null,
      readingProgress: [],
      verseHighlights: {},
      customTags: [],
      
      addPrayer: (prayer) => {
        const newPrayer: Prayer = {
          id: Date.now().toString(),
          date: new Date().toISOString(),
          isFavorite: false,
          status: 'ongoing',
          category: prayer.category || 'general',
          ...prayer,
        };
        
        set((state) => ({
          prayers: [newPrayer, ...state.prayers],
        }));
      },
      
      updatePrayer: (updatedPrayer) => {
        set((state) => ({
          prayers: state.prayers.map((prayer) => 
            prayer.id === updatedPrayer.id ? updatedPrayer : prayer
          ),
        }));
      },
      
      deletePrayer: (id) => {
        set((state) => ({
          prayers: state.prayers.filter((prayer) => prayer.id !== id),
        }));
      },
      
      clearAllPrayers: () => {
        set({ prayers: [] });
      },
      
      toggleFavorite: (id) => {
        set((state) => ({
          prayers: state.prayers.map((prayer) => 
            prayer.id === id 
              ? { ...prayer, isFavorite: !prayer.isFavorite } 
              : prayer
          ),
        }));
      },
      
      updatePrayerStatus: (id, status, answeredDate) => {
        set((state) => ({
          prayers: state.prayers.map((prayer) => 
            prayer.id === id 
              ? { 
                  ...prayer, 
                  status,
                  answeredDate: status === 'answered' ? (answeredDate || new Date().toISOString()) : prayer.answeredDate
                } 
              : prayer
          ),
        }));
      },
      
      filterPrayersByCategory: (category) => {
        const { prayers } = get();
        return category ? prayers.filter(prayer => prayer.category === category) : prayers;
      },
      
      filterPrayersByStatus: (status) => {
        const { prayers } = get();
        return status ? prayers.filter(prayer => prayer.status === status) : prayers;
      },
      
      setPreferredTranslation: (translation) => {
        set({ preferredTranslation: translation });
        // Refresh verse with new translation
        get().refreshDailyVerse();
      },
      
      refreshDailyVerse: async () => {
        const today = new Date().toISOString().split('T')[0];
        const { lastVerseDate, preferredTranslation } = get();
        
        // Only update if it's a new day or first time, or if we don't have a current verse
        if (!lastVerseDate || lastVerseDate !== today || !get().currentVerse) {
          set({ isLoadingVerse: true });
          
          try {
            const newVerse = await getTodayVerse(preferredTranslation);
            set({ 
              currentVerse: newVerse,
              lastVerseDate: today,
              isLoadingVerse: false
            });
          } catch (error) {
            console.error('Error refreshing daily verse:', error);
            set({ isLoadingVerse: false });
          }
        }
      },
      
      loadVerseForDate: async (date: Date) => {
        const { preferredTranslation } = get();
        set({ isLoadingVerse: true });
        
        try {
          const verse = await getVerseForDate(date, preferredTranslation);
          set({ 
            currentVerse: verse,
            isLoadingVerse: false
          });
        } catch (error) {
          console.error('Error loading verse for date:', error);
          set({ isLoadingVerse: false });
        }
      },
      
      addBookmark: (bookId: string, chapter: number, verse?: number) => {
        // Only allow bookmarking if authenticated
        const authStore = useAuthStore.getState();
        if (!authStore.isAuthenticated) {
          return;
        }
        
        const { preferredTranslation, bookmarks } = get();
        const existingIndex = bookmarks.findIndex(
          b => b.bookId === bookId && b.chapter === chapter
        );
        
        const newBookmark: BookmarkState = {
          bookId,
          chapter,
          verse,
          translation: preferredTranslation,
          timestamp: new Date().toISOString()
        };
        
        if (existingIndex >= 0) {
          // Update existing bookmark
          const updatedBookmarks = [...bookmarks];
          updatedBookmarks[existingIndex] = newBookmark;
          set({ bookmarks: updatedBookmarks });
        } else {
          // Add new bookmark
          set({ bookmarks: [newBookmark, ...bookmarks] });
        }
      },
      
      removeBookmark: (bookId: string, chapter: number) => {
        // Only allow removing bookmarks if authenticated
        const authStore = useAuthStore.getState();
        if (!authStore.isAuthenticated) {
          return;
        }
        
        set((state) => ({
          bookmarks: state.bookmarks.filter(
            b => !(b.bookId === bookId && b.chapter === chapter)
          )
        }));
      },
      
      setLastReadingPosition: (bookId: string, chapter: number, verse?: number) => {
        // Only save reading position if authenticated
        const authStore = useAuthStore.getState();
        if (!authStore.isAuthenticated) {
          return;
        }
        
        const { preferredTranslation } = get();
        set({
          lastReadingPosition: {
            bookId,
            chapter,
            verse,
            translation: preferredTranslation,
            timestamp: new Date().toISOString()
          }
        });
      },
      
      getBookmarks: () => {
        // Only return bookmarks if authenticated
        const authStore = useAuthStore.getState();
        if (!authStore.isAuthenticated) {
          return [];
        }
        return get().bookmarks;
      },
      
      startReadingPlan: (planId) => {
        const authStore = useAuthStore.getState();
        if (!authStore.isAuthenticated) {
          return;
        }
        
        const { readingProgress } = get();
        const existingProgress = readingProgress.find(p => p.planId === planId);
        
        if (!existingProgress) {
          const newProgress: UserReadingProgress = {
            planId,
            currentDay: 1,
            completedDays: [],
            startDate: new Date().toISOString()
          };
          
          set((state) => ({
            readingProgress: [...state.readingProgress, newProgress]
          }));
        }
      },
      
      updateReadingProgress: (planId, day) => {
        const authStore = useAuthStore.getState();
        if (!authStore.isAuthenticated) {
          return;
        }
        
        set((state) => ({
          readingProgress: state.readingProgress.map(progress =>
            progress.planId === planId
              ? {
                  ...progress,
                  currentDay: Math.max(progress.currentDay, day + 1),
                  completedDays: [...new Set([...progress.completedDays, day])]
                }
              : progress
          )
        }));
      },
      
      getReadingProgress: (planId) => {
        const authStore = useAuthStore.getState();
        if (!authStore.isAuthenticated) {
          return null;
        }
        
        const { readingProgress } = get();
        return readingProgress.find(p => p.planId === planId) || null;
      },
      
      highlightVerse: (bookId, chapter, verse, note) => {
        const authStore = useAuthStore.getState();
        if (!authStore.isAuthenticated) {
          return;
        }
        
        const key = `${bookId}-${chapter}-${verse}`;
        set((state) => ({
          verseHighlights: {
            ...state.verseHighlights,
            [key]: { highlighted: true, note }
          }
        }));
      },
      
      removeVerseHighlight: (bookId, chapter, verse) => {
        const authStore = useAuthStore.getState();
        if (!authStore.isAuthenticated) {
          return;
        }
        
        const key = `${bookId}-${chapter}-${verse}`;
        set((state) => {
          const newHighlights = { ...state.verseHighlights };
          delete newHighlights[key];
          return { verseHighlights: newHighlights };
        });
      },
      
      getVerseHighlight: (bookId, chapter, verse) => {
        const authStore = useAuthStore.getState();
        if (!authStore.isAuthenticated) {
          return null;
        }
        
        const key = `${bookId}-${chapter}-${verse}`;
        const { verseHighlights } = get();
        return verseHighlights[key] || null;
      },
      
      addCustomTag: (tag) => {
        const trimmedTag = tag.trim();
        if (!trimmedTag) return;
        
        set((state) => {
          if (!state.customTags.includes(trimmedTag)) {
            return { customTags: [...state.customTags, trimmedTag] };
          }
          return state;
        });
      },
      
      removeCustomTag: (tag) => {
        set((state) => ({
          customTags: state.customTags.filter(t => t !== tag)
        }));
      },
      
      getCustomTags: () => {
        return get().customTags;
      },
    }),
    {
      name: 'prayer-journal-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Don't persist the current verse and loading state
      partialize: (state) => ({
        prayers: state.prayers,
        lastVerseDate: state.lastVerseDate,
        preferredTranslation: state.preferredTranslation,
        bookmarks: state.bookmarks,
        lastReadingPosition: state.lastReadingPosition,
        readingProgress: state.readingProgress,
        verseHighlights: state.verseHighlights,
        customTags: state.customTags,
      }),
    }
  )
);