import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <h1 className="text-6xl font-extrabold text-gray-900 dark:text-white">404</h1>
        <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">Page Not Found</h2>
        <p className="mt-2 text-base text-gray-600 dark:text-gray-400">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-8">
          <Link 
            to="/"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFound