import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react'; // Import the required icons

/**
 * A dedicated component for password input with a show/hide toggle.
 * Assumes basic styling and props mirroring a generic FormInput.
 */
const PasswordInput = ({ id, name, label, value, onChange, required, disabled, placeholder }) => {
    // State to toggle between 'password' and 'text' input types
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };

    return (
        <div className="relative">
            <label htmlFor={id} className="block text-sm font-medium text-text-secondary mb-1">
                {label}
            </label>
            <div className="relative">
                <input
                    id={id}
                    name={name}
                    // Toggle input type based on state
                    type={showPassword ? 'text' : 'password'}
                    value={value}
                    onChange={onChange}
                    required={required}
                    disabled={disabled}
                    placeholder={placeholder}
                    className="block w-full p-2 pr-10 border border-border rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                />
                
                {/* Password Toggle Button */}
                <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    disabled={disabled}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 disabled:opacity-50 transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                    {/* Choose the icon based on current visibility state */}
                    {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                    ) : (
                        <Eye className="h-5 w-5" />
                    )}
                </button>
            </div>
        </div>
    );
};

export default PasswordInput;