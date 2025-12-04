import React from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
        <p className="text-gray-600 mb-4">
          We apologize for the inconvenience. Please try refreshing the page or come back later.
        </p>
        
        <div className="bg-gray-100 rounded-lg p-3 mb-4 text-left">
          <code className="text-sm text-gray-700 break-all">
            {error.message}
          </code>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={resetErrorBoundary}
            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </button>
          
          <button
            onClick={() => window.location.href = '/'}
            className="flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Home className="w-4 h-4 mr-2" />
            Go Home
          </button>
        </div>
        
        <p className="text-sm text-gray-500 mt-4">
          If the problem persists, please contact support.
        </p>
      </div>
    </div>
  );
}

function ErrorBoundary({ children }) {
  const handleError = (error, info) => {
    console.error('Error caught by boundary:', error, info);
    
    // Log error to monitoring service (e.g., Sentry)
    if (window.Sentry) {
      window.Sentry.captureException(error, { extra: info });
    }
  };

  const handleReset = () => {
    window.location.reload();
  };

  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={handleError}
      onReset={handleReset}
    >
      {children}
    </ReactErrorBoundary>
  );
}

export default ErrorBoundary;