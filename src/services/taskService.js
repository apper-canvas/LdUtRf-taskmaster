import { getApperClient, TableNames, handleApiError } from './apperService'

/**
 * Get tasks with optional filtering and pagination
 * @param {Object} params Query parameters for filtering and pagination
 * @returns {Promise<Object>} Tasks data with pagination info
 */
const getTasks = async (params = {}) => {
  try {
    const apperClient = getApperClient()
    
    // Default fields to retrieve
    const fields = [
      "Id", "Name", "title", "description", "status", "priority", 
      "due_date", "tags", "category", "is_favorite", "CreatedOn"
    ]
    
    // Default pagination
    const pagingInfo = params.pagingInfo || { limit: 20, offset: 0 }
    
    // Default sorting
    const orderBy = params.orderBy || [{ field: "CreatedOn", direction: "desc" }]
    
    // Build filters
    const filter = params.filter || {}
    
    // Fetch tasks
    const response = await apperClient.fetchRecords(TableNames.TASK, {
      fields,
      pagingInfo,
      orderBy,
      filter
    })
    
    return {
      data: response.data || [],
      totalCount: response.totalCount || 0,
      pageCount: response.pageCount || 0
    }
  } catch (error) {
    throw handleApiError(error)
  }
}

/**
 * Get a single task by ID
 * @param {number|string} id Task ID
 * @returns {Promise<Object>} Task data
 */
const getTaskById = async (id) => {
  try {
    const apperClient = getApperClient()
    
    const response = await apperClient.fetchRecords(TableNames.TASK, {
      fields: [
        "Id", "Name", "title", "description", "status", "priority", 
        "due_date", "tags", "category", "is_favorite", 
        "CreatedOn", "CreatedBy", "ModifiedOn"
      ],
      filter: { Id: id }
    })
    
    if (!response.data || response.data.length === 0) {
      throw new Error("Task not found")
    }
    
    return response.data[0]
  } catch (error) {
    throw handleApiError(error)
  }
}

/**
 * Create a new task
 * @param {Object} taskData Task data
 * @returns {Promise<Object>} Created task
 */
const createTask = async (taskData) => {
  try {
    const apperClient = getApperClient()
    
    // Ensure Name is set for the record
    const record = {
      ...taskData,
      Name: taskData.title || "New Task"
    }
    
    const response = await apperClient.createRecord(TableNames.TASK, {
      record
    })
    
    return response.data
  } catch (error) {
    throw handleApiError(error)
  }
}

/**
 * Update an existing task
 * @param {number|string} id Task ID
 * @param {Object} taskData Task data to update
 * @returns {Promise<Object>} Updated task
 */
const updateTask = async (id, taskData) => {
  try {
    const apperClient = getApperClient()
    
    // Ensure Name is updated if title changes
    const record = { ...taskData }
    if (taskData.title) {
      record.Name = taskData.title
    }
    
    const response = await apperClient.updateRecord(TableNames.TASK, id, {
      record
    })
    
    return response.data
  } catch (error) {
    throw handleApiError(error)
  }
}

/**
 * Delete a task
 * @param {number|string} id Task ID
 * @returns {Promise<boolean>} Success status
 */
const deleteTask = async (id) => {
  try {
    const apperClient = getApperClient()
    await apperClient.deleteRecord(TableNames.TASK, id)
    return true
  } catch (error) {
    throw handleApiError(error)
  }
}

/**
 * Assign a task to a project
 * @param {number|string} taskId Task ID
 * @param {number|string} projectId Project ID
 * @returns {Promise<Object>} Created task-project relationship
 */
const assignTaskToProject = async (taskId, projectId) => {
  try {
    const apperClient = getApperClient()
    
    const response = await apperClient.createRecord(TableNames.TASK_PROJECT, {
      record: {
        Name: `Task ${taskId} - Project ${projectId}`,
        task: taskId,
        project: projectId
      }
    })
    
    return response.data
  } catch (error) {
    throw handleApiError(error)
  }
}

/**
 * Remove a task from a project
 * @param {number|string} relationshipId Task-project relationship ID
 * @returns {Promise<boolean>} Success status
 */
const removeTaskFromProject = async (relationshipId) => {
  try {
    const apperClient = getApperClient()
    await apperClient.deleteRecord(TableNames.TASK_PROJECT, relationshipId)
    return true
  } catch (error) {
    throw handleApiError(error)
  }
}

// Export task service methods
export const taskService = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  assignTaskToProject,
  removeTaskFromProject
}