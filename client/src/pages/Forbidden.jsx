import React from 'react';
import { Link } from 'react-router-dom';

const Forbidden = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 px-4">
    <div className="bg-white shadow-lg rounded-xl p-10 flex flex-col items-center max-w-md w-full">
      <div className="text-primary/80 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
        </svg>
      </div>
      <h1 className="text-4xl font-bold text-gray-800 mb-2">403</h1>
      <h2 className="text-xl font-semibold text-gray-700 mb-2">Access Forbidden</h2>
      <p className="text-gray-500 mb-6 text-center">You do not have permission to access this page.<br/>If you believe this is a mistake, please contact support.</p>
      <Link
        to="/"
        className="inline-block bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-6 rounded transition-colors duration-200 shadow"
      >
        Go to Home
      </Link>
    </div>
  </div>
);

export default Forbidden; 