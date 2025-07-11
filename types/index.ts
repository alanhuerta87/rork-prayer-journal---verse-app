export interface Prayer {
  id: string;
  title: string;
  content: string;
  date: string;
  isFavorite: boolean;
  tags?: string[];
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