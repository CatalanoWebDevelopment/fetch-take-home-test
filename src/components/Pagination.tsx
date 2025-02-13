import { FC, Dispatch, SetStateAction } from 'react'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  setCurrentPage: Dispatch<SetStateAction<number>>
  totalPages: number
}

export const Pagination: FC<PaginationProps> = ({ currentPage, setCurrentPage, totalPages }) => {
  const maxVisiblePages = window.innerWidth < 640 ? 3 : 5
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1)
  }

  const pages = []
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }

  return (
    <div className="mt-8 flex items-center justify-center space-x-1 sm:space-x-2">
      <button
        onClick={() => setCurrentPage(1)}
        disabled={currentPage === 1}
        className="hidden sm:block p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        aria-label="First page"
      >
        <ChevronsLeft className="w-5 h-5" />
      </button>
      <button
        onClick={() => setCurrentPage((prev) => prev - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        aria-label="Previous page"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {startPage > 1 && (
        <>
          <button
            onClick={() => setCurrentPage(1)}
            className="hidden sm:block px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50"
          >
            1
          </button>
          {startPage > 2 && <span className="hidden sm:block px-2 text-gray-500">...</span>}
        </>
      )}

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => setCurrentPage(page)}
          className={`px-3 sm:px-4 py-2 rounded-md text-sm ${
            currentPage === page
              ? 'bg-blue-600 text-white border border-blue-600'
              : 'border border-gray-300 hover:bg-gray-50'
          }`}
        >
          {page}
        </button>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && (
            <span className="hidden sm:block px-2 text-gray-500">...</span>
          )}
          <button
            onClick={() => setCurrentPage(totalPages)}
            className="hidden sm:block px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50"
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => setCurrentPage((prev) => prev + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        aria-label="Next page"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
      <button
        onClick={() => setCurrentPage(totalPages)}
        disabled={currentPage === totalPages}
        className="hidden sm:block p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        aria-label="Last page"
      >
        <ChevronsRight className="w-5 h-5" />
      </button>
    </div>
  )
}
