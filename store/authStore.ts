import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  deleteAccount: () => Promise<boolean>;
  setLoading: (loading: boolean) => void;
}

// Mock authentication - in a real app, this would connect to your backend
const mockLogin = async (email: string, password: string): Promise<User | null> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simple validation - in real app, this would be server-side
  if (email && password.length >= 6) {
    return {
      id: Date.now().toString(),
      email,
      name: email.split('@')[0],
      createdAt: new Date().toISOString(),
    };
  }
  return null;
};

const mockSignup = async (email: string, password: string, name: string): Promise<User | null> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simple validation - in real app, this would be server-side
  if (email && password.length >= 6 && name.trim()) {
    return {
      id: Date.now().toString(),
      email,
      name: name.trim(),
      createdAt: new Date().toISOString(),
    };
  }
  return null;
};

const mockDeleteAccount = async (): Promise<boolean> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // In a real app, this would make an API call to delete the user's account
  // and all associated data from the server
  return true;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      
      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const user = await mockLogin(email, password);
          if (user) {
            set({ user, isAuthenticated: true, isLoading: false });
            return true;
          } else {
            set({ isLoading: false });
            return false;
          }
        } catch (error) {
          console.error('Login error:', error);
          set({ isLoading: false });
          return false;
        }
      },
      
      signup: async (email: string, password: string, name: string) => {
        set({ isLoading: true });
        try {
          const user = await mockSignup(email, password, name);
          if (user) {
            set({ user, isAuthenticated: true, isLoading: false });
            return true;
          } else {
            set({ isLoading: false });
            return false;
          }
        } catch (error) {
          console.error('Signup error:', error);
          set({ isLoading: false });
          return false;
        }
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false });
        // Clear prayer data when logging out
        AsyncStorage.removeItem('prayer-journal-storage');
      },
      
      deleteAccount: async () => {
        set({ isLoading: true });
        try {
          const success = await mockDeleteAccount();
          if (success) {
            // Clear all user data
            set({ user: null, isAuthenticated: false, isLoading: false });
            // Clear prayer data when deleting account
            AsyncStorage.removeItem('prayer-journal-storage');
            return true;
          } else {
            set({ isLoading: false });
            return false;
          }
        } catch (error) {
          console.error('Delete account error:', error);
          set({ isLoading: false });
          return false;
        }
      },
      
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: 'prayer-journal-auth',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);