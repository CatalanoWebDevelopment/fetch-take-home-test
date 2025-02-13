import { useEffect, useState, Dispatch, SetStateAction, useCallback } from 'react'
import { Search } from 'lucide-react'
import { getBreeds, searchLocations } from '@/lib/api'
import type { Location } from '@/types'

interface SearchFiltersProps {
  onFiltersChange: Dispatch<
    SetStateAction<{
      breeds: string[]
      ageMin: number | undefined
      ageMax: number | undefined
      sort: string
      zipCodes: string[]
    }>
  >
}

export function SearchFilters({ onFiltersChange }: SearchFiltersProps) {
  const [breeds, setBreeds] = useState<string[]>([])
  const [selectedBreeds, setSelectedBreeds] = useState<string[]>([])
  const [ageRange, setAgeRange] = useState({ min: '', max: '' })
  const [sort, setSort] = useState('breed:asc')
  const [locationSearch, setLocationSearch] = useState('')
  const [locations, setLocations] = useState<Location[]>([])
  const [selectedLocations, setSelectedLocations] = useState<Location[]>([])
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        const breedList = await getBreeds()

        setBreeds(breedList)
      } catch (error) {
        console.error('Failed to fetch breeds:', error)
      }
    }

    fetchBreeds()
  }, [])

  const handleBreedChange = (breed: string) => {
    setSelectedBreeds((prev) =>
      prev.includes(breed) ? prev.filter((b) => b !== breed) : [...prev, breed]
    )
  }

  const handleLocationSearch = useCallback(async () => {
    if (locationSearch.length < 2) return

    setIsSearching(true)

    try {
      const { results } = await searchLocations({
        city: locationSearch,
        size: 10,
      })

      setLocations(results)
    } catch (error) {
      console.error('Failed to search locations:', error)
    } finally {
      setIsSearching(false)
    }
  }, [locationSearch])

  const handleLocationSelect = (location: Location) => {
    if (!selectedLocations.find((loc) => loc.zip_code === location.zip_code)) {
      setSelectedLocations((prev) => [...prev, location])
    }

    setLocationSearch('')
    setLocations([])
  }

  const removeLocation = (zipCode: string) => {
    setSelectedLocations((prev) => prev.filter((loc) => loc.zip_code !== zipCode))
  }

  useEffect(() => {
    onFiltersChange({
      breeds: selectedBreeds,
      ageMin: ageRange.min ? parseInt(ageRange.min) : undefined,
      ageMax: ageRange.max ? parseInt(ageRange.max) : undefined,
      sort,
      zipCodes: selectedLocations.map((loc) => loc.zip_code),
    })
  }, [selectedBreeds, ageRange, sort, selectedLocations, onFiltersChange])

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (locationSearch) {
        handleLocationSearch()
      }
    }, 300)

    return () => clearTimeout(debounce)
  }, [locationSearch, handleLocationSearch])

  return (
    <div className="bg-white rounded-lg shadow-md p-4 space-y-4 lg:sticky lg:top-24">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Sort by</label>

        <select
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="breed:asc">Breed (A-Z)</option>
          <option value="breed:desc">Breed (Z-A)</option>
          <option value="age:asc">Age (Youngest First)</option>
          <option value="age:desc">Age (Oldest First)</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Age Range</label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            value={ageRange.min}
            onChange={(e) => setAgeRange((prev) => ({ ...prev, min: e.target.value }))}
          />

          <input
            type="number"
            placeholder="Max"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            value={ageRange.max}
            onChange={(e) => setAgeRange((prev) => ({ ...prev, max: e.target.value }))}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>

        <div className="relative">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by city..."
              className="w-full rounded-md border border-gray-300 pl-10 pr-3 py-2 text-sm"
              value={locationSearch}
              onChange={(e) => setLocationSearch(e.target.value)}
            />

            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>

          {isSearching && (
            <div className="absolute inset-x-0 top-full mt-1 p-2 bg-white rounded-md shadow-lg border border-gray-200 z-10">
              <div className="animate-pulse flex justify-center">
                <div className="h-5 w-5 bg-blue-200 rounded-full"></div>
              </div>
            </div>
          )}

          {locations.length > 0 && (
            <div className="absolute inset-x-0 top-full mt-1 bg-white rounded-md shadow-lg border border-gray-200 max-h-48 overflow-y-auto z-10">
              {locations.map((location) => (
                <button
                  key={location.zip_code}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 text-sm"
                  onClick={() => handleLocationSelect(location)}
                >
                  {location.city}, {location.state} ({location.zip_code})
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mt-2 space-y-2">
          {selectedLocations.map((location) => (
            <div
              key={location.zip_code}
              className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md"
            >
              <span className="text-sm text-gray-600">
                {location.city}, {location.state}
              </span>

              <button
                onClick={() => removeLocation(location.zip_code)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Breeds</label>

        <div className="max-h-48 overflow-y-auto space-y-2 rounded-md border border-gray-200 p-2">
          {breeds.map((breed) => (
            <label key={breed} className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                checked={selectedBreeds.includes(breed)}
                onChange={() => handleBreedChange(breed)}
              />
              <span className="ml-2 text-sm text-gray-600">{breed}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}
