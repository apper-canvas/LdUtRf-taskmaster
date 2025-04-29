import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { format } from 'date-fns'
import { fetchTaskById, deleteTask } from '../store/taskSlice'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorDisplay from '../components/ErrorDisplay'
import { ArrowLeft, Edit, Trash2, Calendar, Tag, CheckSquare, Flag } from 'lucide-react'

function TaskDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { currentTask, loading, error } = useSelector(state => state.tasks)
  
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  
  useEffect(() => {
    if (id) {
      dispatch(fetchTaskById(id))
    }
  }, [dispatch, id])
  
  const handleDelete = async () => {
    await dispatch(deleteTask(id))
    navigate('/tasks')
  }
  
  const getStatusClass = (status) => {
    switch (status) {
      case 'To Do':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800'
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800'
      case 'Completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
    }
  }
  
  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800'
      case 'Medium':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800'
      case 'Low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
    }
  }
  
  return (
    <div>
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate('/tasks')}
          className="mr-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <ArrowLeft size={20} className="text-gray-600 dark:text-gray-400" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Task Details</h1>
      </div>
      
      {error && <ErrorDisplay error={error} onRetry={() => dispatch(fetchTaskById(id))} />}
      
      {loading ? (
        <LoadingSpinner />
      ) : currentTask ? (
        <>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{currentTask.title}</h2>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className={`px-3 py-1 inline-flex text-sm font-medium rounded-full border ${getStatusClass(currentTask.status)}`}>
                    <CheckSquare size={16} className="mr-1" />
                    {currentTask.status}
                  </span>
                  <span className={`px-3 py-1 inline-flex text-sm font-medium rounded-full border ${getPriorityClass(currentTask.priority)}`}>
                    <Flag size={16} className="mr-1" />
                    {currentTask.priority} Priority
                  </span>
                  {currentTask.due_date && (
                    <span className="px-3 py-1 inline-flex text-sm font-medium rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                      <Calendar size={16} className="mr-1" />
                      Due: {format(new Date(currentTask.due_date), 'MMM d, yyyy')}
                    </span>
                  )}
                  {currentTask.category && (
                    <span className="px-3 py-1 inline-flex text-sm font-medium rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                      <Tag size={16} className="mr-1" />
                      {currentTask.category}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex space-x-3">
                <Link
                  to={`/tasks/edit/${id}`}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <Edit size={16} className="mr-2" />
                  Edit
                </Link>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="inline-flex items-center px-4 py-2 border border-red-300 dark:border-red-600 text-sm font-medium rounded-md text-red-700 dark:text-red-300 bg-white dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-900/30"
                >
                  <Trash2 size={16} className="mr-2" />
                  Delete
                </button>
              </div>
            </div>
            
            <div className="px-6 py-5">
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Description</h3>
                <div className="bg-gray-50 dark:bg-gray-750 p-4 rounded-md border border-gray-200 dark:border-gray-700">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                    {currentTask.description || 'No description provided.'}
                  </p>
                </div>
              </div>
              
              {currentTask.tags && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {currentTask.tags.split(',').map((tag, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-sm rounded-full"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-6">
                <div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-500 dark:text-gray-400">
                  <div className="mb-2 sm:mb-0 sm:mr-6">
                    <span className="font-medium">Created:</span> {currentTask.CreatedOn ? format(new Date(currentTask.CreatedOn), 'MMM d, yyyy - h:mm a') : 'Unknown'}
                  </div>
                  {currentTask.ModifiedOn && (
                    <div>
                      <span className="font-medium">Last modified:</span> {format(new Date(currentTask.ModifiedOn), 'MMM d, yyyy - h:mm a')}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Delete Confirmation Modal */}
          {showDeleteConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm mx-auto">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Confirm Deletion</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Are you sure you want to delete this task? This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">Task not found</h3>
          <p className="mt-1 text-gray-500 dark:text-gray-400">The task you're looking for doesn't exist or has been deleted.</p>
          <div className="mt-6">
            <Link
              to="/tasks"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Tasks
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default TaskDetail