import React from 'react';

function FlashMessage({ message, type = 'info' }) {
  const baseStyles = 'p-4 rounded-2xl shadow-md flex items-center gap-3 text-sm sm:text-base';
  const typeStyles = {
    success: 'bg-green-100 text-green-800 border border-green-300',
    error: 'bg-red-100 text-red-800 border border-red-300',
    warning: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
    info: 'bg-blue-100 text-blue-800 border border-blue-300',
  };

  return (
    <div className={`${baseStyles} ${typeStyles[type]} max-w-md mx-auto my-4 absolute`}>
      <span className="material-icons-outlined">
        {type === 'success' && 'check_circle'}
        {type === 'error' && 'error'}
        {type === 'warning' && 'warning'}
        {type === 'info' && 'info'}
      </span>
      <span>{message}</span>
    </div>
  );
}

export default FlashMessage;
