import { NavLink } from 'react-router-dom'
import { Home, CheckSquare, FolderOpen, Settings, User } from 'lucide-react'

function Sidebar() {
  const navItems = [
    { path: '/', label: 'Dashboard', icon: <Home size={20} /> },
    { path: '/tasks', label: 'Tasks', icon: <CheckSquare size={20} /> },
    { path: '/projects', label: 'Projects', icon: <FolderOpen size={20} /> },
    { path: '/profile', label: 'Profile', icon: <User size={20} /> },
  ]

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">TaskMaster</h1>
      </div>
      
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-1">
          {navItems.map(item => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => 
                  `flex items-center px-4 py-3 rounded-md transition-colors ${
                    isActive 
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`
                }
                end={item.path === '/'}
              >
                <span className="mr-3">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <NavLink
          to="/settings"
          className={({ isActive }) => 
            `flex items-center px-4 py-3 rounded-md transition-colors ${
              isActive 
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`
          }
        >
          <span className="mr-3"><Settings size={20} /></span>
          <span className="font-medium">Settings</span>
        </NavLink>
      </div>
    </aside>
  )
}

export default Sidebar