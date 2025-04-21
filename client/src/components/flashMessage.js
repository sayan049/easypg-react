import React from 'react';
import { useEffect } from 'react';

function FlashMessage({ message='xxx', type = 'error' }) {
  const [show, setShow] = React.useState(true);
  
  const [currentMessage, setCurrentMessage] = React.useState(message);

  const isError = type === 'error';

  
  useEffect(() => {

    if (message !== currentMessage) {
      setCurrentMessage(message);
      setShow(true);
      
      const timer = setTimeout(() => {
        setShow(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [message, currentMessage]);

  console.log('FlashMessage', message, type , type === 'error', show);


  // if (message == null){
  //   return null;
  // }

  if(type === 'error'){

  return (

      <>
   {isError && <div role="alert" className={`border-s-4 border-red-700 bg-red-50 p-4 absolute top-0 left-1/2 transform -translate-x-1/2 mt-4 rounded-md shadow-md ${show ? 'block' : 'hidden'}`} >
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
</div>}
{!isError && 
  <div role="alert" className={`rounded-md border border-gray-300 bg-white p-4 shadow-sm absolute top-0 left-1/2 transform -translate-x-1/2 mt-4 ${show ? '' : 'hidden'}`}>
    <div className="flex items-start gap-4">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="size-6 text-green-600"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
  
      <div className="flex-1">
        <strong className="font-medium text-gray-900"> Successfully signed up</strong>
  
        <p className="mt-0.5 text-sm text-gray-700">Please verify your email</p>
      </div>
  
      <button
        className="-m-3 rounded-full p-1.5 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700"
        type="button"
        aria-label="Dismiss alert"
        onClick={() => setShow(false)}
      >
        <span className="sr-only">Dismiss popup</span>
  
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </div>}
</>

  );}




}

export default FlashMessage;
