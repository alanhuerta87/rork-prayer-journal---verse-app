export type PrayerStatus = 'ongoing' | 'answered' | 'archived';
export type PrayerCategory = 'gratitude' | 'requests' | 'intercession' | 'praise' | 'confession' | 'general';

export interface Prayer {
  id: string;
  title: string;
  content: string;
  date: string;
  isFavorite: boolean;
  tags?: string[];
  customTags?: string[];
  category: PrayerCategory;
  status: PrayerStatus;
  answeredDate?: string;
  notes?: string;
}

export interface DailyVerse {
  reference: string;
  text: string;
  translation: string;
  date: string;
}

export interface BibleVerse {
  verse: number;
  text: string;
  highlighted?: boolean;
  note?: string;
}

export interface ReadingPlan {
  id: string;
  name: string;
  description: string;
  duration: number; // days
  readings: ReadingPlanDay[];
}

export interface ReadingPlanDay {
  day: number;
  readings: ReadingReference[];
}

export interface ReadingReference {
  bookId: string;
  chapter: number;
  verses?: number[];
}

export interface UserReadingProgress {
  planId: string;
  currentDay: number;
  completedDays: number[];
  startDate: string;
}

export interface BibleBook {
  id: string;
  name: string;
  testament: 'old' | 'new';
  chapters: number;
}

export type BibleTranslation = 'kjv' | 'niv' | 'nkjv' | 'nlt' | 'esv' | 'msg';

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  card: string;
  text: string;
  textLight: string;
  border: string;
  success: string;
  error: string;
  white: string;
  black: string;
  gray: {
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
}