import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Prayer, DailyVerse, BibleTranslation } from '@/types';
import { getTodayVerse, getVerseForDate } from '@/mocks/verses';

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
  addPrayer: (prayer: Omit<Prayer, 'id' | 'date' | 'isFavorite'>) => void;
  updatePrayer: (prayer: Prayer) => void;
  deletePrayer: (id: string) => void;
  clearAllPrayers: () => void;
  toggleFavorite: (id: string) => void;
  setPreferredTranslation: (translation: BibleTranslation) => void;
  refreshDailyVerse: () => Promise<void>;
  loadVerseForDate: (date: Date) => Promise<void>;
  addBookmark: (bookId: string, chapter: number, verse?: number) => void;
  removeBookmark: (bookId: string, chapter: number) => void;
  setLastReadingPosition: (bookId: string, chapter: number, verse?: number) => void;
  getBookmarks: () => BookmarkState[];
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
      
      addPrayer: (prayer) => {
        const newPrayer: Prayer = {
          id: Date.now().toString(),
          date: new Date().toISOString(),
          isFavorite: false,
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
        set((state) => ({
          bookmarks: state.bookmarks.filter(
            b => !(b.bookId === bookId && b.chapter === chapter)
          )
        }));
      },
      
      setLastReadingPosition: (bookId: string, chapter: number, verse?: number) => {
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
        return get().bookmarks;
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
      }),
    }
  )
);