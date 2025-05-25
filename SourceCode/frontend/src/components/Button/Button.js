import React from 'react';

const Button = ({ children, className = '', type = 'button', variant = 'primary', size, onClick, ...props }) => {
  const sizeClass = size ? `btn-${size}` : '';
  return (
    <button
      type={type}
      className={`btn btn-${variant} ${sizeClass} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;