
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', className, children, ...props }) => {
  const baseClasses = `
    inline-flex items-center justify-center 
    px-6 py-3 border border-transparent 
    text-base font-medium rounded-lg 
    shadow-sm focus:outline-none focus:ring-2 
    focus:ring-offset-2 dark:focus:ring-offset-gray-800
    transition-transform transform active:scale-95 duration-200
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const variantClasses = {
    primary: `
      text-white bg-blue-600 
      hover:bg-blue-700 
      focus:ring-blue-500
    `,
    secondary: `
      text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-gray-700
      hover:bg-blue-200 dark:hover:bg-gray-600
      focus:ring-blue-500
    `,
  };

  return (
    <button
      {...props}
      className={`${baseClasses} ${variantClasses[variant]} ${className || ''}`}
    >
      {children}
    </button>
  );
};
