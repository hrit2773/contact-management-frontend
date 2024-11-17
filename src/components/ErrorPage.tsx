import React from 'react';
import { useNavigate } from 'react-router-dom';

type ErrorPageProps = {
  errorCode?: string;
  errorMessage: string;
};

const ErrorPage: React.FC<ErrorPageProps> = ({
  errorCode = '404',
  errorMessage,
}) => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
        <h1 className="text-6xl font-bold text-red-600">{errorCode}</h1>
        <p className="mt-4 text-lg">{errorMessage}</p>
        <button
          onClick={handleGoHome}
          className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          Go Back Home
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
