import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchTaskById, createTask, updateTask, clearCurrentTask } from '../store/taskSlice'
import { fetchProjects } from '../store/projectSlice'
import { 
  TextInput, 
  TextareaInput, 
  SelectInput, 
  MultiSelectInput, 
  DateInput, 
  CheckboxInput,
  SubmitButton
} from '../components/FormComponents'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorDisplay from '../components/ErrorDisplay'
import { ArrowLeft } from 'lucide-react'

function TaskForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const { currentTask, loading, error } = useSelector(state => state.tasks)
  const { projects } = useSelector(state => state.projects)
  const isEditMode = !!id
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'To Do',
    priority: 'Medium',
    due_date: '',
    category: '',
    tags: '',
    is_favorite: false,
    project: ''
  })
  
  const [formErrors, setFormErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  useEffect(() => {
    if (isEditMode) {
      dispatch(fetchTaskById(id))
    } else {
      dispatch(clearCurrentTask())
    }
    
    dispatch(fetchProjects())
    
    return () => {
      dispatch(clearCurrentTask())
    }
  }, [dispatch, id, isEditMode])
  
  useEffect(() => {
    if (currentTask && isEditMode) {
      setFormData({
        title: currentTask.title || '',
        description: currentTask.description || '',
        status: currentTask.status || 'To Do',
        priority: currentTask.priority || 'Medium',
        due_date: currentTask.due_date || '',
        category: currentTask.category || '',
        tags: currentTask.tags || '',
        is_favorite: currentTask.is_favorite || false,
        project: ''
      })
    }
  }, [currentTask, isEditMode])
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }
  
  const validateForm = () => {
    const errors = {}
    
    if (!formData.title.trim()) {
      errors.title = 'Title is required'
    }
    
    if (!formData.status) {
      errors.status = 'Status is required'
    }
    
    if (!formData.priority) {
      errors.priority = 'Priority is required'
    }
    
    return errors
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }
    
    setIsSubmitting(true)
    
    try {
      if (isEditMode) {
        await dispatch(updateTask({ id, taskData: formData })).unwrap()
      } else {
        await dispatch(createTask(formData)).unwrap()
      }
      
      navigate('/tasks')
    } catch (err) {
      setFormErrors({ submit: err.message || 'Failed to save task. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const statusOptions = [
    { value: 'To Do', label: 'To Do' },
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Completed', label: 'Completed' }
  ]
  
  const priorityOptions = [
    { value: 'Low', label: 'Low' },
    { value: 'Medium', label: 'Medium' },
    { value: 'High', label: 'High' }
  ]
  
  const categoryOptions = [
    { value: 'Personal', label: 'Personal' },
    { value: 'Work', label: 'Work' },
    { value: 'Health', label: 'Health' },
    { value: 'Finance', label: 'Finance' },
    { value: 'Education', label: 'Education' }
  ]
  
  const tagOptions = [
    { value: 'Work', label: 'Work' },
    { value: 'Personal', label: 'Personal' },
    { value: 'Home', label: 'Home' },
    { value: 'Study', label: 'Study' },
    { value: 'Errands', label: 'Errands' },
    { value: 'Shopping', label: 'Shopping' },
    { value: 'Health', label: 'Health' },
    { value: 'Finance', label: 'Finance' }
  ]
  
  const projectOptions = projects.map(project => ({
    value: project.Id.toString(),
    label: project.Name
  }))
  
  const pageTitle = isEditMode ? 'Edit Task' : 'Create New Task'
  
  if (loading && isEditMode) {
    return <LoadingSpinner />
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{pageTitle}</h1>
      </div>
      
      {error && <ErrorDisplay error={error} />}
      {formErrors.submit && <ErrorDisplay error={formErrors.submit} />}
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <TextInput
                  label="Task Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter task title"
                  error={formErrors.title}
                  required
                />
              </div>
              
              <div className="md:col-span-2">
                <TextareaInput
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter task description"
                  rows={4}
                />
              </div>
              
              <SelectInput
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                options={statusOptions}
                error={formErrors.status}
                required
              />
              
              <SelectInput
                label="Priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                options={priorityOptions}
                error={formErrors.priority}
                required
              />
              
              <DateInput
                label="Due Date"
                name="due_date"
                value={formData.due_date}
                onChange={handleChange}
              />
              
              <SelectInput
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                options={categoryOptions}
                placeholder="Select a category"
              />
              
              <div className="md:col-span-2">
                <MultiSelectInput
                  label="Tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  options={tagOptions}
                  placeholder="Select tags"
                />
              </div>
              
              <SelectInput
                label="Assign to Project"
                name="project"
                value={formData.project}
                onChange={handleChange}
                options={projectOptions}
                placeholder="Select a project (optional)"
              />
              
              <CheckboxInput
                label="Mark as Favorite"
                name="is_favorite"
                checked={formData.is_favorite}
                onChange={handleChange}
              />
            </div>
            
            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={() => navigate('/tasks')}
                className="mr-3 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <SubmitButton
                label={isEditMode ? 'Save Changes' : 'Create Task'}
                isSubmitting={isSubmitting}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default TaskForm