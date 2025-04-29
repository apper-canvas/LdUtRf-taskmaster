import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProjectById, createProject, updateProject, clearCurrentProject } from '../store/projectSlice'
import { 
  TextInput, 
  TextareaInput, 
  SelectInput, 
  DateInput, 
  SubmitButton
} from '../components/FormComponents'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorDisplay from '../components/ErrorDisplay'
import { ArrowLeft } from 'lucide-react'

function ProjectForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const { currentProject, loading, error } = useSelector(state => state.projects)
  const isEditMode = !!id
  
  const [formData, setFormData] = useState({
    Name: '',
    description: '',
    status: 'Planning',
    due_date: '',
    progress: 0,
    category: ''
  })
  
  const [formErrors, setFormErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  useEffect(() => {
    if (isEditMode) {
      dispatch(fetchProjectById(id))
    } else {
      dispatch(clearCurrentProject())
    }
    
    return () => {
      dispatch(clearCurrentProject())
    }
  }, [dispatch, id, isEditMode])
  
  useEffect(() => {
    if (currentProject && isEditMode) {
      setFormData({
        Name: currentProject.Name || '',
        description: currentProject.description || '',
        status: currentProject.status || 'Planning',
        due_date: currentProject.due_date || '',
        progress: currentProject.progress || 0,
        category: currentProject.category || ''
      })
    }
  }, [currentProject, isEditMode])
  
  const handleChange = (e) => {
    const { name, value, type } = e.target
    
    // Convert progress to number
    if (name === 'progress') {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'number' ? parseInt(value, 10) || 0 : value
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
    
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
    
    if (!formData.Name.trim()) {
      errors.Name = 'Project name is required'
    }
    
    if (!formData.status) {
      errors.status = 'Status is required'
    }
    
    if (formData.progress < a0 || formData.progress > 100) {
      errors.progress = 'Progress must be between 0 and 100'
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
        await dispatch(updateProject({ id, projectData: formData })).unwrap()
      } else {
        await dispatch(createProject(formData)).unwrap()
      }
      
      navigate('/projects')
    } catch (err) {
      setFormErrors({ submit: err.message || 'Failed to save project. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const statusOptions = [
    { value: 'Planning', label: 'Planning' },
    { value: 'Active', label: 'Active' },
    { value: 'Completed', label: 'Completed' },
    { value: 'On Hold', label: 'On Hold' }
  ]
  
  const categoryOptions = [
    { value: 'Personal', label: 'Personal' },
    { value: 'Work', label: 'Work' },
    { value: 'Health', label: 'Health' },
    { value: 'Finance', label: 'Finance' },
    { value: 'Education', label: 'Education' }
  ]
  
  const pageTitle = isEditMode ? 'Edit Project' : 'Create New Project'
  
  if (loading && isEditMode) {
    return <LoadingSpinner />
  }
  
  return (
    <div>
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate('/projects')}
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
                  label="Project Name"
                  name="Name"
                  value={formData.Name}
                  onChange={handleChange}
                  placeholder="Enter project name"
                  error={formErrors.Name}
                  required
                />
              </div>
              
              <div className="md:col-span-2">
                <TextareaInput
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter project description"
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
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Progress (%)
                </label>
                <div className="flex items-center">
                  <input
                    type="range"
                    name="progress"
                    value={formData.progress}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    step="5"
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                  <span className="ml-3 text-gray-700 dark:text-gray-300 min-w-[40px] text-right">
                    {formData.progress}%
                  </span>
                </div>
                {formErrors.progress && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.progress}</p>
                )}
              </div>
            </div>
            
            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={() => navigate('/projects')}
                className="mr-3 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <SubmitButton
                label={isEditMode ? 'Save Changes' : 'Create Project'}
                isSubmitting={isSubmitting}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ProjectForm