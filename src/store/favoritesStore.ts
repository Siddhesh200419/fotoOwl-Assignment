import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PicsumImage } from '../types';

type FavouritesMap = Record<string, PicsumImage>;

interface PersistedFavouritesState {
  favouritesByUser: Record<string, FavouritesMap>;
}

interface FavouritesState extends PersistedFavouritesState {
  /** Active user's favourites (derived from favouritesByUser). */
  favourites: FavouritesMap;
  activeUserEmail: string | null;
  setActiveUser: (email: string | null) => void;
  addFavourite: (image: PicsumImage) => void;
  removeFavourite: (id: string) => void;
  isFavourite: (id: string) => boolean;
  toggleFavourite: (image: PicsumImage) => void;
}

function normalizeEmail(email: string): string {
  return email.toLowerCase();
}

export const useFavouritesStore = create<FavouritesState>()(
  persist(
    (set, get) => ({
      favouritesByUser: {},
      favourites: {},
      activeUserEmail: null,

      setActiveUser: (email) => {
        const normalizedEmail = email ? normalizeEmail(email) : null;
        set((state) => ({
          activeUserEmail: normalizedEmail,
          favourites: normalizedEmail
            ? (state.favouritesByUser[normalizedEmail] ?? {})
            : {},
        }));
      },

      addFavourite: (image) => {
        const email = get().activeUserEmail;
        if (!email) return;

        set((state) => {
          const userFavourites = { ...state.favourites, [image.id]: image };
          return {
            favourites: userFavourites,
            favouritesByUser: {
              ...state.favouritesByUser,
              [email]: userFavourites,
            },
          };
        });
      },

      removeFavourite: (id) => {
        const email = get().activeUserEmail;
        if (!email) return;

        set((state) => {
          const userFavourites = { ...state.favourites };
          delete userFavourites[id];
          return {
            favourites: userFavourites,
            favouritesByUser: {
              ...state.favouritesByUser,
              [email]: userFavourites,
            },
          };
        });
      },

      isFavourite: (id) => id in get().favourites,

      toggleFavourite: (image) => {
        if (get().isFavourite(image.id)) {
          get().removeFavourite(image.id);
        } else {
          get().addFavourite(image);
        }
      },
    }),
    {
      name: 'favourites-storage',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
      migrate: (persistedState) => {
        const state = persistedState as
          | PersistedFavouritesState
          | { favourites?: FavouritesMap }
          | undefined;

        if (state && 'favouritesByUser' in state) {
          return { favouritesByUser: state.favouritesByUser };
        }

        // Legacy global favourites are discarded to prevent cross-account leaks.
        return { favouritesByUser: {} };
      },
      partialize: (state) => ({
        favouritesByUser: state.favouritesByUser,
      }),
      onRehydrateStorage: () => (state) => {
        // Lazy import avoids circular dependency with authStore.
        const { useAuthStore } = require('./authStore') as typeof import('./authStore');
        const authUser = useAuthStore.getState().user;
        if (state && authUser) {
          state.setActiveUser(authUser.email);
        }
      },
    }
  )
);

/** Subscribe only to whether a single image is favourited — avoids re-rendering the whole gallery. */
export function useIsFavourite(id: string): boolean {
  return useFavouritesStore((state) => id in state.favourites);
}

export function useToggleFavourite() {
  return useFavouritesStore((state) => state.toggleFavourite);
}
