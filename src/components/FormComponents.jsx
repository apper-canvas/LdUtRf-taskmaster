import { useState } from 'react'

// Text input component
export function TextInput({ 
  label, 
  name, 
  value, 
  onChange, 
  placeholder = '', 
  error = '', 
  type = 'text',
  required = false
}) {
  return (
    <div className="mb-4">
      <label 
        htmlFor={name} 
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border ${
          error ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
        } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white`}
        required={required}
      />
      {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  )
}

// Textarea component
export function TextareaInput({
  label,
  name,
  value,
  onChange,
  placeholder = '',
  error = '',
  rows = 3,
  required = false
}) {
  return (
    <div className="mb-4">
      <label 
        htmlFor={name} 
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className={`w-full px-3 py-2 border ${
          error ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
        } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white`}
        required={required}
      />
      {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  )
}

// Select component
export function SelectInput({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  error = '',
  required = false
}) {
  return (
    <div className="mb-4">
      <label 
        htmlFor={name} 
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full px-3 py-2 border ${
          error ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
        } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white`}
        required={required}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  )
}

// Multi-select component with tags
export function MultiSelectInput({
  label,
  name,
  value = [],
  onChange,
  options = [],
  placeholder = 'Select options',
  error = '',
  required = false
}) {
  const [isOpen, setIsOpen] = useState(false)
  
  const selectedValues = Array.isArray(value) ? value : value.split(',').filter(v => v)
  
  const handleToggleOption = (optionValue) => {
    let newValues
    
    if (selectedValues.includes(optionValue)) {
      newValues = selectedValues.filter(v => v !== optionValue)
    } else {
      newValues = [...selectedValues, optionValue]
    }
    
    // Call onChange with the new array or string based on original type
    if (Array.isArray(value)) {
      onChange({ target: { name, value: newValues } })
    } else {
      onChange({ target: { name, value: newValues.join(',') } })
    }
  }
  
  const handleRemoveValue = (optionValue) => {
    const newValues = selectedValues.filter(v => v !== optionValue)
    
    if (Array.isArray(value)) {
      onChange({ target: { name, value: newValues } })
    } else {
      onChange({ target: { name, value: newValues.join(',') } })
    }
  }
  
  return (
    <div className="mb-4">
      <label 
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <div className="relative">
        <div 
          className={`w-full px-3 py-2 border ${
            error ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
          } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white min-h-[42px] cursor-pointer flex flex-wrap items-center`}
          onClick={() => setIsOpen(!isOpen)}
        >
          {selectedValues.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {selectedValues.map(val => {
                const option = options.find(o => o.value === val)
                return (
                  <div 
                    key={val} 
                    className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 text-xs rounded px-2 py-1 flex items-center"
                  >
                    <span>{option?.label || val}</span>
                    <button 
                      type="button"
                      className="ml-1 text-blue-500 hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-100"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemoveValue(val)
                      }}
                    >
                      &times;
                    </button>
                  </div>
                )
              })}
            </div>
          ) : (
            <span className="text-gray-500 dark:text-gray-400">{placeholder}</span>
          )}
        </div>
        
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto">
            {options.map((option) => (
              <div 
                key={option.value}
                className={`px-4 py-2 cursor-pointer ${
                  selectedValues.includes(option.value) 
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                onClick={(e) => {
                  e.stopPropagation()
                  handleToggleOption(option.value)
                }}
              >
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    checked={selectedValues.includes(option.value)}
                    onChange={() => {}}
                    className="mr-2"
                  />
                  {option.label}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  )
}

// Checkbox input
export function CheckboxInput({
  label,
  name,
  checked,
  onChange,
  error = ''
}) {
  return (
    <div className="mb-4">
      <div className="flex items-center">
        <input
          type="checkbox"
          id={name}
          name={name}
          checked={checked}
          onChange={onChange}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label 
          htmlFor={name} 
          className="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
        </label>
      </div>
      {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  )
}

// Date input
export function DateInput({
  label,
  name,
  value,
  onChange,
  error = '',
  required = false
}) {
  return (
    <div className="mb-4">
      <label 
        htmlFor={name} 
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type="date"
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full px-3 py-2 border ${
          error ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
        } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white`}
        required={required}
      />
      {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  )
}

// Submit button
export function SubmitButton({
  label = 'Submit',
  isSubmitting = false,
  className = ''
}) {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isSubmitting ? (
        <div className="flex items-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing...
        </div>
      ) : (
        label
      )}
    </button>
  )
}