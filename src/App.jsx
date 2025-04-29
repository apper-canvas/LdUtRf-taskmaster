import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { checkAuthStatus } from './store/userSlice'

// Components
import Layout from './components/Layout'
import PrivateRoute from './components/PrivateRoute'
import LoadingSpinner from './components/LoadingSpinner'

// Pages
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import TaskList from './pages/TaskList'
import TaskDetail from './pages/TaskDetail'
import TaskForm from './pages/TaskForm'
import ProjectList from './pages/ProjectList'
import ProjectDetail from './pages/ProjectDetail'
import ProjectForm from './pages/ProjectForm'
import UserProfile from './pages/UserProfile'
import NotFound from './pages/NotFound'

function App() {
  const dispatch = useDispatch()
  const { isAuthChecked, isAuthenticated } = useSelector(state => state.user)

  useEffect(() => {
    dispatch(checkAuthStatus())
  }, [dispatch])

  if (!isAuthChecked) {
    return <LoadingSpinner fullScreen />
  }

  return (
    <Routes>
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
      <Route path="/signup" element={!isAuthenticated ? <Signup /> : <Navigate to="/" />} />
      
      <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="tasks">
          <Route index element={<TaskList />} />
          <Route path=":id" element={<TaskDetail />} />
          <Route path="new" element={<TaskForm />} />
          <Route path="edit/:id" element={<TaskForm />} />
        </Route>
        <Route path="projects">
          <Route index element={<ProjectList />} />
          <Route path=":id" element={<ProjectDetail />} />
          <Route path="new" element={<ProjectForm />} />
          <Route path="edit/:id" element={<ProjectForm />} />
        </Route>
        <Route path="profile" element={<UserProfile />} />
      </Route>
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App