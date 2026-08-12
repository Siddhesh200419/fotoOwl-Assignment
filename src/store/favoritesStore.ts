import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PicsumImage } from '../types';

interface FavouritesState {
  /** Map of image ID → full PicsumImage object */
  favourites: Record<string, PicsumImage>;
  addFavourite: (image: PicsumImage) => void;
  removeFavourite: (id: string) => void;
  isFavourite: (id: string) => boolean;
  toggleFavourite: (image: PicsumImage) => void;
}

export const useFavouritesStore = create<FavouritesState>()(
  persist(
    (set, get) => ({
      favourites: {},

      addFavourite: (image) =>
        set((state) => ({
          favourites: { ...state.favourites, [image.id]: image },
        })),

      removeFavourite: (id) =>
        set((state) => {
          const next = { ...state.favourites };
          delete next[id];
          return { favourites: next };
        }),

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
