import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';
import { useFavouritesStore } from './favoritesStore';

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  hasHydrated: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
  setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,
      hasHydrated: false,
      login: (user) => {
        useFavouritesStore.getState().setActiveUser(user.email);
        set({ user, isLoggedIn: true });
      },
      logout: () => {
        useFavouritesStore.getState().setActiveUser(null);
        set({ user: null, isLoggedIn: false });
      },
      updateUser: (user) => set({ user }),
      setHasHydrated: (state) => set({ hasHydrated: state }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        isLoggedIn: state.isLoggedIn,
      }),
      onRehydrateStorage: () => {
        return (state) => {
          if (state?.user) {
            useFavouritesStore.getState().setActiveUser(state.user.email);
          }
          if (state) {
            state.setHasHydrated(true);
          }
        };
      },
    }
  )
);
