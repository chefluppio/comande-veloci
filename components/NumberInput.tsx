
import React from 'react';

type NumberInputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const NumberInput: React.FC<NumberInputProps> = (props) => {
  return (
    <input
      type="number"
      {...props}
      className={`
        w-full px-4 py-2 
        border border-gray-300 dark:border-gray-600 
        rounded-lg bg-gray-50 dark:bg-gray-700 
        text-gray-900 dark:text-white 
        placeholder-gray-400 dark:placeholder-gray-500 
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
        transition duration-200
        [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
        ${props.className || ''}
      `}
    />
  );
};
