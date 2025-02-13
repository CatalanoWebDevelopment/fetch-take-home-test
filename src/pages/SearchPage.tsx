import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { LogOut, Heart, Filter } from 'lucide-react'
import { searchDogs, getDogs } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import { useFavoriteStore } from '@/store/favoriteStore'
import { SearchFilters } from '@/components/SearchFilters'
import { DogCard } from '@/components/DogCard'
import type { Dog } from '@/types'
import { Pagination } from '@/components/Pagination'
import { useMatchHandler } from '@/hooks/useMatchHandler'

export function SearchPage() {
  const navigate = useNavigate()
  const logout = useAuthStore((state) => state.logout)
  const { favorites, clearFavorites } = useFavoriteStore()
  const [dogs, setDogs] = useState<Dog[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filters, setFilters] = useState({
    breeds: [] as string[],
    ageMin: undefined as number | undefined,
    ageMax: undefined as number | undefined,
    sort: 'breed:asc',
    zipCodes: [] as string[],
  })

  const { handleMatch } = useMatchHandler(favorites)

  const fetchDogs = useCallback(
    async (page: number) => {
      try {
        setLoading(true)
        const searchResult = await searchDogs({
          ...filters,
          size: 20,
          from: (page - 1) * 20,
        })
        const dogsData = await getDogs(searchResult.resultIds)
        setDogs(dogsData)
        setTotalPages(Math.ceil(searchResult.total / 20))
      } catch (error) {
        console.error('Failed to fetch dogs', error)
        toast.error('Failed to fetch dogs')
      } finally {
        setLoading(false)
      }
    },
    [filters]
  )

  useEffect(() => {
    setCurrentPage(1)
    fetchDogs(1)
  }, [filters, fetchDogs])

  useEffect(() => {
    fetchDogs(currentPage)
  }, [currentPage, fetchDogs])

  const handleLogout = async () => {
    try {
      await logout()
      clearFavorites()
      navigate('/')
    } catch (error) {
      console.error('Logout Failed', error)
      toast.error('Logout failed')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900">Find Your Dog</h1>

            <div className="flex items-center gap-4 sm:ml-auto">
              <button
                onClick={handleMatch}
                className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <Heart className="w-5 h-5 sm:mr-2" />

                <span className="hidden sm:inline">Match</span>

                <span className="sm:hidden ml-1">({favorites.length})</span>
              </button>

              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="sm:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              >
                <Filter className="w-5 h-5" />
              </button>

              <button
                onClick={handleLogout}
                className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <LogOut className="w-5 h-5 sm:mr-2" />

                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div
            className={`lg:col-span-1 ${
              isFilterOpen ? 'fixed inset-0 z-30 bg-white p-4 overflow-y-auto' : 'hidden lg:block'
            }`}
          >
            {isFilterOpen && (
              <div className="flex justify-between items-center mb-4 lg:hidden">
                <h2 className="text-lg font-semibold">Filters</h2>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
            )}

            <SearchFilters onFiltersChange={setFilters} />
          </div>

          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {dogs.map((dog) => (
                    <DogCard key={dog.id} dog={dog} />
                  ))}
                </div>

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  setCurrentPage={setCurrentPage}
                />
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
