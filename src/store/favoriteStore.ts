import { create } from 'zustand'
import type { Dog } from '@/types'

interface FavoriteState {
  favorites: Dog[]
  addFavorite: (dog: Dog) => void
  removeFavorite: (id: string) => void
  clearFavorites: () => void
}

export const useFavoriteStore = create<FavoriteState>((set) => ({
  favorites: [],
  addFavorite: (dog) =>
    set((state) => ({
      favorites: [...state.favorites, dog],
    })),
  removeFavorite: (id) =>
    set((state) => ({
      favorites: state.favorites.filter((dog) => dog.id !== id),
    })),
  clearFavorites: () => set({ favorites: [] }),
}))
