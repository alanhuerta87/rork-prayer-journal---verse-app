import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightColors, darkColors, createThemeColors, themeColors } from '@/constants/colors';

type ThemeType = 'light' | 'dark';
type ThemeColorType = keyof typeof themeColors;

interface ThemeState {
  theme: ThemeType;
  themeColor: ThemeColorType;
  colors: typeof lightColors;
  notifications: boolean;
  reminderTime: Date;
  toggleTheme: () => void;
  setTheme: (theme: ThemeType) => void;
  setThemeColor: (color: ThemeColorType) => void;
  setNotifications: (enabled: boolean) => void;
  setReminderTime: (time: Date) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'light',
      themeColor: 'blue',
      colors: lightColors,
      notifications: false,
      reminderTime: (() => {
        const defaultTime = new Date();
        defaultTime.setHours(9, 0, 0, 0);
        return defaultTime;
      })(),
      
      toggleTheme: () => {
        set((state) => {
          const newTheme = state.theme === 'light' ? 'dark' : 'light';
          return {
            theme: newTheme,
            colors: createThemeColors(state.themeColor, newTheme === 'dark'),
          };
        });
      },
      
      setTheme: (theme: ThemeType) => {
        const { themeColor } = get();
        set({
          theme,
          colors: createThemeColors(themeColor, theme === 'dark'),
        });
      },
      
      setThemeColor: (color: ThemeColorType) => {
        const { theme } = get();
        set({
          themeColor: color,
          colors: createThemeColors(color, theme === 'dark'),
        });
      },
      
      setNotifications: (enabled: boolean) => {
        set({ notifications: enabled });
      },
      
      setReminderTime: (time: Date) => {
        set({ reminderTime: time });
      },
    }),
    {
      name: 'prayer-journal-theme',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        theme: state.theme,
        themeColor: state.themeColor,
        notifications: state.notifications,
        reminderTime: state.reminderTime.toISOString(),
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Ensure reminderTime is a proper Date object
          if (typeof state.reminderTime === 'string') {
            state.reminderTime = new Date(state.reminderTime);
          } else if (!state.reminderTime || !(state.reminderTime instanceof Date)) {
            // Fallback to default time if invalid
            const defaultTime = new Date();
            defaultTime.setHours(9, 0, 0, 0);
            state.reminderTime = defaultTime;
          }
          
          // Ensure colors are properly set based on current theme
          state.colors = createThemeColors(state.themeColor, state.theme === 'dark');
        }
      },
    }
  )
);