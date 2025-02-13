interface CheckboxProps {
  label: string
  checked: boolean
  onChange: () => void
}

export function Checkbox({ label, checked, onChange }: CheckboxProps) {
  return (
    <label className="flex items-center space-x-2 cursor-pointer">
      <input
        type="checkbox"
        className="w-5 h-5 rounded border-gray-300 text-blue-600"
        checked={checked}
        onChange={onChange}
      />

      <span className="text-sm text-gray-700">{label}</span>
    </label>
  )
}
