import React from 'react';

const FormTextArea = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  required,
  disabled,
  rows = 4, // Default to 4 rows
  maxLength,
  icon: Icon, // Optional icon prop
}) => {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-text-secondary mb-1"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          // Position icon at the top-left
          <div className="absolute left-3 top-3.5 flex items-center pointer-events-none">
            {Icon}
          </div>
        )}
        <textarea
          id={id}
          name={id}
          rows={rows}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          maxLength={maxLength}
          className={`block w-full px-3 py-2 border border-border rounded-md shadow-sm 
                    focus:outline-none focus:ring-primary focus:border-primary 
                    disabled:bg-gray-100 disabled:cursor-not-allowed
                    ${Icon ? 'pl-10 pt-3' : ''}`} // Add padding if icon
        />
        {/* Character counter */}
        {maxLength && (
          <div className="absolute bottom-2 right-2 text-xs text-text-light">
            {value.length} / {maxLength}
          </div>
        )}
      </div>
    </div>
  );
};

export default FormTextArea;