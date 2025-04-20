import React from 'react';

function FlashMessage({ message, type = 'info' }) {
  console.log('FlashMessage', message, type);
  const baseStyles = 'p-4 rounded-2xl shadow-md flex items-center gap-3 text-sm sm:text-base';
  const typeStyles = {
    success: 'bg-green-100 text-green-800 border border-green-300',
    error: 'bg-red-100 text-red-800 border border-red-300',
    warning: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
    info: 'bg-blue-100 text-blue-800 border border-blue-300',
  };
  if(type === 'error'){

  return (

      <>
    <div role="alert" className="border-s-4 border-red-700 bg-red-50 p-4 absolute top-0 left-1/2 transform -translate-x-1/2 mt-4 rounded-md shadow-md">
  <div className="flex items-center gap-2 text-red-700">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
      <path
        fillRule="evenodd"
        d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
        clipRule="evenodd"
      />
    </svg>

    <strong className="font-medium"> Something went wrong </strong>
  </div>

  <p className="mt-2 text-sm text-red-700">
   {message}
  </p>
</div>
</>

  );}



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
