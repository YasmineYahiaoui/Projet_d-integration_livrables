import React, { forwardRef } from 'react';

const Select = forwardRef(({
                               id,
                               name,
                               label,
                               options = [],
                               placeholder = 'Sélectionner une option',
                               error,
                               helperText,
                               required = false,
                               disabled = false,
                               className = '',
                               fullWidth = false,
                               ...props
                           }, ref) => {
    const selectClasses = `px-3 py-2 border ${
        error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-[#5CB1B1] focus:border-[#5CB1B1]'
    } rounded-md focus:outline-none ${disabled ? 'bg-gray-100 text-gray-500' : 'bg-white'} appearance-none`;

    return (
        <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
            {label && (
                <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <div className="relative">
                <select
                    id={id}
                    name={name}
                    ref={ref}
                    className={`${selectClasses} pr-10 ${fullWidth ? 'w-full' : ''}`}
                    disabled={disabled}
                    required={required}
                    {...props}
                >
                    {placeholder && (
                        <option value="" disabled={required}>
                            {placeholder}
                        </option>
                    )}

                    {options.map((option) => (
                        <option
                            key={option.value || option.id || option}
                            value={option.value !== undefined ? option.value : option.id !== undefined ? option.id : option}
                        >
                            {option.label || option.nom || option}
                        </option>
                    ))}
                </select>

                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </div>
            </div>

            {(helperText || error) && (
                <p className={`mt-1 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
                    {error || helperText}
                </p>
            )}
        </div>
    );
});

Select.displayName = 'Select';

export default Select;