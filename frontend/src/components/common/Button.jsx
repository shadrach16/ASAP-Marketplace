import React from 'react';
import { Link } from 'react-router-dom';

const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  fullWidth = false,
  onClick,
  disabled = false,
  className = "",
  to=false
}) => {
  const baseStyle =
    'py-2 px-4 text-gray-800 font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-150 ease-in-out';

  const styles = {
    primary:
      'bg-blue-600 text-white hover:bg-primary-dark focus:ring-primary-light',
    secondary:
      'bg-white text-gray-900 border border-border hover:bg-background-light focus:ring-primary-light',
  };

  const width = fullWidth ? 'w-full' : '';
  const disabledStyle = disabled
    ? 'opacity-50 cursor-not-allowed'
    : 'opacity-100';

  return (to ? 
    <Link to={to}>
     <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${styles[variant]} ${width} ${disabledStyle} ${className}`}
    >
      {children}
    </button></Link>:
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${styles[variant]} ${width} ${disabledStyle} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;