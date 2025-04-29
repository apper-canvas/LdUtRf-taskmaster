import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { fetchProjects, deleteProject } from '../store/projectSlice'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorDisplay from '../components/ErrorDisplay'
import { SelectInput } from '../components/FormComponents'
import { PlusCircle, Search, Filter, Trash2, Edit, ExternalLink, SortAsc, SortDesc } from 'lucide-react'

function ProjectList() {
  const dispatch = useDispatch()
  const { projects, loading, error, totalCount, pageCount } = useSelector(state => state.projects)
  
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    status: '',
    category: ''
  })
  const [sortField, setSortField] = useState('CreatedOn')
  const [sortDirection, setSortDirection] = useState('desc')
  const [currentPage, setCurrentPage] = useState(0)
  const [showFilters, setShowFilters] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)
  
  const pageSize = 10
  
  useEffect(() => {
    loadProjects()
  }, [filters, sortField, sortDirection, currentPage])
  
  const loadProjects = () => {
    // Build filter object
    const filter = {}
    
    if (searchTerm) {
      filter.$or = [
        { Name: { $containsi: searchTerm } },
        { description: { $containsi: searchTerm } }
      ]
    }
    
    if (filters.status) {
      filter.status = filters.status
    }
    
    if (filters.category) {
      filter.category = filters.category
    }
    
    dispatch(fetchProjects({
      filter,
      orderBy: [{ field: sortField, direction: sortDirection }],
      pagingInfo: { limit: pageSize, offset: currentPage * pageSize }
    }))
  }
  
  const handleSearchSubmit = (e) => {
    e.preventDefault()
    loadProjects()
  }
  
  const handleFilterChange = (e) => {
    setFilters(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }
  
  const handleSortToggle = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }
  
  const handleClearFilters = () => {
    setFilters({
      status: '',
      category: ''
    })
    setSearchTerm('')
  }
  
  const handleDeleteProject = async (id) => {
    await dispatch(deleteProject(id))
    setShowDeleteConfirm(null)
    loadProjects()
  }
  
  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'Planning', label: 'Planning' },
    { value: 'Active', label: 'Active' },
    { value: 'Completed', label: 'Completed' },
    { value: 'On Hold', label: 'On Hold' }
  ]
  
  const categoryOptions = [
    { value: '', label: 'All Categories' },
    { value: 'Personal', label: 'Personal' },
    { value: 'Work', label: 'Work' },
    { value: 'Health', label: 'Health' },
    { value: 'Finance', label: 'Finance' },
    { value: 'Education', label: 'Education' }
  ]
  
  const getSortIcon = (field) => {
    if (sortField !== field) return null
    
    return sortDirection === 'asc' 
      ? <SortAsc size={16} className="ml-1" />
      : <SortDesc size={16} className="ml-1" />
  }
  
  const getStatusClass = (status) => {
    switch (status) {
      case 'Planning':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
      case 'Active':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
      case 'Completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      case 'On Hold':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    }
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Projects</h1>
        <Link 
          to="/projects/new" 
          className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <PlusCircle size={16} className="mr-2" />
          New Project
        </Link>
      </div>
      
      {error && <ErrorDisplay error={error} onRetry={loadProjects} />}
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row gap-4">
            <form onSubmit={handleSearchSubmit} className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search projects..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                />
              </div>
            </form>
            
            <div className="flex items-center">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Filter size={16} className="mr-2" />
                Filters {Object.values(filters).some(f => f) && '(Active)'}
              </button>
            </div>
          </div>
          
          {showFilters && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectInput
                label="Status"
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                options={statusOptions}
              />
              
              <SelectInput
                label="Category"
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                options={categoryOptions}
              />
              
              <div className="md:col-span-2 flex justify-end">
                <button
                  onClick={handleClearFilters}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          )}
        </div>
        
        {loading ? (
          <LoadingSpinner />
        ) : projects.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSortToggle('Name')}
                    >
                      <div className="flex items-center">
                        Project {getSortIcon('Name')}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSortToggle('status')}
                    >
                      <div className="flex items-center">
                        Status {getSortIcon('status')}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSortToggle('due_date')}
                    >
                      <div className="flex items-center">
                        Due Date {getSortIcon('due_date')}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSortToggle('progress')}
                    >
                      <div className="flex items-center">
                        Progress {getSortIcon('progress')}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSortToggle('category')}
                    >
                      <div className="flex items-center">
                        Category {getSortIcon('category')}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {projects.map(project => (
                    <tr key={project.Id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{project.Name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                          {project.description?.substring(0, 50) || 'No description'}
                          {project.description?.length > 50 ? '...' : ''}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(project.status)}`}>
                          {project.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {project.due_date ? format(new Date(project.due_date), 'MMM d, yyyy') : 'No due date'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                          <div 
                            className="bg-blue-600 h-2.5 rounded-full" 
                            style={{ width: `${project.progress || 0}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-right mt-1 text-gray-500 dark:text-gray-400">
                          {project.progress || 0}%
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-400">{project.category || 'Uncategorized'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-3">
                          <Link to={`/projects/${project.Id}`} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                            <ExternalLink size={16} />
                          </Link>
                          <Link to={`/projects/edit/${project.Id}`} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                            <Edit size={16} />
                          </Link>
                          <button 
                            onClick={() => setShowDeleteConfirm(project.Id)}
                            className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {totalCount > pageSize && (
              <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                    disabled={currentPage === 0}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(pageCount - 1, prev + 1))}
                    disabled={currentPage >= pageCount - 1}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Showing <span className="font-medium">{currentPage * pageSize + 1}</span> to{' '}
                      <span className="font-medium">
                        {Math.min((currentPage + 1) * pageSize, totalCount)}
                      </span>{' '}
                      of <span className="font-medium">{totalCount}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                        disabled={currentPage === 0}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="sr-only">Previous</span>
                        &larr;
                      </button>
                      
                      {/* Page numbers */}
                      {[...Array(pageCount).keys()].map(page => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`relative inline-flex items-center px-4 py-2 border ${
                            currentPage === page
                              ? 'bg-blue-50 dark:bg-blue-900 border-blue-500 dark:border-blue-600 text-blue-600 dark:text-blue-400'
                              : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                          } text-sm font-medium`}
                        >
                          {page + 1}
                        </button>
                      ))}
                      
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(pageCount - 1, prev + 1))}
                        disabled={currentPage >= pageCount - 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="sr-only">Next</span>
                        &rarr;
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No projects found</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating a new project.</p>
            <div className="mt-6">
              <Link
                to="/projects/new"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PlusCircle size={16} className="-ml-1 mr-2" />
                New Project
              </Link>
            </div>
          </div>
        )}
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm mx-auto">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Confirm Deletion</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Are you sure you want to delete this project? This action cannot be undone. All associated tasks will be unlinked.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteProject(showDeleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProjectList