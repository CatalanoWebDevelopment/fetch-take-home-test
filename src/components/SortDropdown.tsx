import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

interface SortDropdownProps {
  sort: string
  setSort: (sort: string) => void
}

export function SortDropdown({ sort, setSort }: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)

  const options = [
    { value: 'breed:asc', label: 'Breed (A-Z)' },
    { value: 'breed:desc', label: 'Breed (Z-A)' },
    { value: 'age:asc', label: 'Age (Youngest First)' },
    { value: 'age:desc', label: 'Age (Oldest First)' },
  ]

  const selectedOption = options.find((option) => option.value === sort)

  return (
    <div className="relative w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center rounded-md border border-gray-300 p-2 text-left bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        {selectedOption ? selectedOption.label : 'Select an option'}

        <span className="ml-2">
          <ChevronDown />
        </span>
      </button>

      {isOpen && (
        <div className="absolute mt-1 w-full rounded-md border border-gray-300 bg-white shadow-lg z-10">
          {options.map((option) => (
            <button
              key={option.value}
              className="w-full text-left px-4 py-2 hover:bg-gray-100"
              onClick={() => {
                setSort(option.value)
                setIsOpen(false)
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
