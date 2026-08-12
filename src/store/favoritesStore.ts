import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PicsumImage } from '../types';

type FavouritesMap = Record<string, PicsumImage>;

interface FavouritesState {
  favouritesByUser: Record<string, FavouritesMap>;
  favourites: FavouritesMap;
  activeUserEmail: string | null;
  setActiveUser: (email: string | null) => void;
  toggleFavourite: (image: PicsumImage) => void;
}

export const useFavouritesStore = create<FavouritesState>()(
  persist(
    (set, get) => ({
      favouritesByUser: {},
      favourites: {},
      activeUserEmail: null,

      setActiveUser: (email) => {
        const key = email?.toLowerCase() ?? null;
        set((state) => ({
          activeUserEmail: key,
          favourites: key ? (state.favouritesByUser[key] ?? {}) : {},
        }));
      },

      toggleFavourite: (image) => {
        const email = get().activeUserEmail;
        if (!email) return;

        set((state) => {
          const current = { ...(state.favouritesByUser[email] ?? {}) };
          if (image.id in current) delete current[image.id];
          else current[image.id] = image;

          return {
            favourites: current,
            favouritesByUser: { ...state.favouritesByUser, [email]: current },
          };
        });
      },
    }),
    {
      name: 'favourites-storage',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
      migrate: (state) => {
        if (state && typeof state === 'object' && 'favouritesByUser' in state) {
          return { favouritesByUser: (state as { favouritesByUser: Record<string, FavouritesMap> }).favouritesByUser };
        }
        return { favouritesByUser: {} };
      },
      partialize: (state) => ({ favouritesByUser: state.favouritesByUser }),
      onRehydrateStorage: () => (state) => {
        const { useAuthStore } = require('./authStore') as typeof import('./authStore');
        const user = useAuthStore.getState().user;
        if (state && user) state.setActiveUser(user.email);
      },
    }
  )
);

export function useIsFavourite(id: string) {
  return useFavouritesStore((state) => id in state.favourites);
}
