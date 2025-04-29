import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import LoadingSpinner from './LoadingSpinner'

function PrivateRoute({ children }) {
  const { isAuthenticated, isAuthChecked, loading } = useSelector(state => state.user)

  if (loading || !isAuthChecked) {
    return <LoadingSpinner fullScreen />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default PrivateRoute