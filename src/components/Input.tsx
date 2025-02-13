import clsx from 'clsx'
import { ChangeEventHandler } from 'react'

interface InputProps {
  value: string
  type: string
  onChange: ChangeEventHandler<HTMLInputElement>
  className?: string
  placeholder?: string
}

export function Input({ value, type, onChange, className, placeholder = '' }: InputProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className={clsx(
        'w-full rounded-md border border-gray-300 px-3 py-2 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none',
        className
      )}
      value={value}
      onChange={onChange}
    />
  )
}
