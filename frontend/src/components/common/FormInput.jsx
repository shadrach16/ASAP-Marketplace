import React from 'react';

const FormInput = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  autoComplete,
  className,
  labelClassName
}) => {
  return (
    <div>
      <label
        htmlFor={id}
        className={ labelClassName ? labelClassName :`  block text-sm font-medium text-text-secondary `}
      >
        {label}
      </label>
      <div className="mt-2">
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          className={`block w-full px-3  py-2 border border-border rounded-md shadow-sm 
          placeholder-text-light focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent sm:text-md ${className}`}
        />
      </div>
    </div>
  );
};

export default FormInput;