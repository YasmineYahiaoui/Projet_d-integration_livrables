import React, { forwardRef } from 'react';

const Input = forwardRef(({
                              id,
                              name,
                              label,
                              type = 'text',
                              placeholder = '',
                              helperText,
                              error,
                              required = false,
                              disabled = false,
                              className = '',
                              prefix,
                              suffix,
                              fullWidth = false,
                              ...props
                          }, ref) => {
    const inputClasses = `px-3 py-2 border ${
        error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-[#5CB1B1] focus:border-[#5CB1B1]'
    } rounded-md focus:outline-none ${disabled ? 'bg-gray-100 text-gray-500' : 'bg-white'} ${
        prefix ? 'pl-10' : ''
    } ${suffix ? 'pr-10' : ''}`;

    return (
        <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
            {label && (
                <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <div className="relative">
                {prefix && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        {prefix}
                    </div>
                )}

                <input
                    id={id}
                    name={name}
                    type={type}
                    ref={ref}
                    className={inputClasses}
                    placeholder={placeholder}
                    disabled={disabled}
                    required={required}
                    {...props}
                />

                {suffix && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        {suffix}
                    </div>
                )}
            </div>

            {(helperText || error) && (
                <p className={`mt-1 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
                    {error || helperText}
                </p>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;