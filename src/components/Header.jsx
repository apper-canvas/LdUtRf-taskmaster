import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { logoutUser } from '../store/userSlice'
import { User, LogOut, Bell, Menu } from 'lucide-react'

function Header() {
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.user)

  const handleLogout = () => {
    dispatch(logoutUser())
  }

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button className="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
            <Menu size={20} />
          </button>
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white">TaskMaster</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
            <Bell size={20} className="text-gray-600 dark:text-gray-300" />
          </button>
          
          <div className="relative group">
            <button className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                {user?.firstName?.charAt(0) || user?.lastName?.charAt(0) || <User size={16} />}
              </div>
              <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300">
                {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'User'}
              </span>
            </button>
            
            <div className="hidden group-hover:block absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-10">
              <div className="py-2">
                <Link 
                  to="/profile" 
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Profile
                </Link>
                <button 
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <LogOut size={16} className="mr-2" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header