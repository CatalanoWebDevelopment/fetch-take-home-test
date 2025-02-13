import { Heart } from 'lucide-react'
import type { Dog } from '@/types'
import { useFavoriteStore } from '@/store/favoriteStore'

interface DogCardProps {
  dog: Dog
}

export function DogCard({ dog }: DogCardProps) {
  const { favorites, addFavorite, removeFavorite } = useFavoriteStore()
  const isFavorite = favorites.some((fav) => fav.id === dog.id)

  const toggleFavorite = () => {
    if (isFavorite) {
      removeFavorite(dog.id)
    } else {
      addFavorite(dog)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col">
      <div className="relative pt-[75%]">
        <img
          src={dog.img}
          alt={dog.name}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
        <button
          onClick={toggleFavorite}
          className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
        >
          <Heart
            className={`w-6 h-6 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
          />
        </button>
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{dog.name}</h3>
        <div className="space-y-1 text-sm">
          <p className="text-gray-600">
            <span className="font-medium">Breed:</span> {dog.breed}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Age:</span> {dog.age} years
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Location:</span> {dog.zip_code}
          </p>
        </div>
      </div>
    </div>
  )
}
