import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getApperUI, getApperClient } from '../services/apperService'
import { setUser, setError } from '../store/userSlice'
import ErrorDisplay from '../components/ErrorDisplay'

function Login() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { error, isAuthenticated } = useSelector(state => state.user)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
      return
    }

    try {
      const ApperUI = getApperUI()
      const apperClient = getApperClient()
      
      // Initialize ApperUI login component
      ApperUI.setup(apperClient, {
        target: '#authentication',
        view: 'login',
        onSuccess: (user) => {
          // Store user in localStorage for persistence
          localStorage.setItem('user', JSON.stringify(user))
          
          // Update Redux store
          dispatch(setUser(user))
          
          // Navigate to dashboard
          navigate('/')
        },
        onError: (error) => {
          console.error('Authentication error:', error)
          dispatch(setError(error.message || 'Login failed. Please try again.'))
        }
      })
      
      // Show the login UI
      ApperUI.showLogin('#authentication')
      setIsLoading(false)
    } catch (error) {
      console.error('Error setting up authentication:', error)
      dispatch(setError('Failed to load authentication. Please refresh the page.'))
      setIsLoading(false)
    }
  }, [dispatch, navigate, isAuthenticated])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">TaskMaster</h1>
          <h2 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white">Sign in to your account</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Or{' '}
            <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
              create a new account
            </Link>
          </p>
        </div>
        
        {error && <ErrorDisplay error={error} />}
        
        <div className="mt-8">
          {isLoading ? (
            <div className="flex justify-center">
              <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
          ) : (
            <div id="authentication" className="min-h-[400px]"></div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Login