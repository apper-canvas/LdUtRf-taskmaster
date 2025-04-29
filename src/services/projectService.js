import { getApperClient, TableNames, handleApiError } from './apperService'

/**
 * Get projects with optional filtering and pagination
 * @param {Object} params Query parameters for filtering and pagination
 * @returns {Promise<Object>} Projects data with pagination info
 */
const getProjects = async (params = {}) => {
  try {
    const apperClient = getApperClient()
    
    // Default fields to retrieve
    const fields = [
      "Id", "Name", "description", "status", "due_date", 
      "progress", "category", "CreatedOn"
    ]
    
    // Default pagination
    const pagingInfo = params.pagingInfo || { limit: 20, offset: 0 }
    
    // Default sorting
    const orderBy = params.orderBy || [{ field: "CreatedOn", direction: "desc" }]
    
    // Build filters
    const filter = params.filter || {}
    
    // Fetch projects
    const response = await apperClient.fetchRecords(TableNames.PROJECT, {
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
 * Get a single project by ID
 * @param {number|string} id Project ID
 * @returns {Promise<Object>} Project data
 */
const getProjectById = async (id) => {
  try {
    const apperClient = getApperClient()
    
    const response = await apperClient.fetchRecords(TableNames.PROJECT, {
      fields: [
        "Id", "Name", "description", "status", "due_date", 
        "progress", "category", "CreatedOn", "CreatedBy", "ModifiedOn"
      ],
      filter: { Id: id }
    })
    
    if (!response.data || response.data.length === 0) {
      throw new Error("Project not found")
    }
    
    return response.data[0]
  } catch (error) {
    throw handleApiError(error)
  }
}

/**
 * Create a new project
 * @param {Object} projectData Project data
 * @returns {Promise<Object>} Created project
 */
const createProject = async (projectData) => {
  try {
    const apperClient = getApperClient()
    
    const response = await apperClient.createRecord(TableNames.PROJECT, {
      record: projectData
    })
    
    return response.data
  } catch (error) {
    throw handleApiError(error)
  }
}

/**
 * Update an existing project
 * @param {number|string} id Project ID
 * @param {Object} projectData Project data to update
 * @returns {Promise<Object>} Updated project
 */
const updateProject = async (id, projectData) => {
  try {
    const apperClient = getApperClient()
    
    const response = await apperClient.updateRecord(TableNames.PROJECT, id, {
      record: projectData
    })
    
    return response.data
  } catch (error) {
    throw handleApiError(error)
  }
}

/**
 * Delete a project
 * @param {number|string} id Project ID
 * @returns {Promise<boolean>} Success status
 */
const deleteProject = async (id) => {
  try {
    const apperClient = getApperClient()
    await apperClient.deleteRecord(TableNames.PROJECT, id)
    return true
  } catch (error) {
    throw handleApiError(error)
  }
}

/**
 * Get tasks associated with a project
 * @param {number|string} projectId Project ID
 * @returns {Promise<Array>} List of tasks
 */
const getProjectTasks = async (projectId) => {
  try {
    const apperClient = getApperClient()
    
    // First get task-project relationships
    const relationshipsResponse = await apperClient.fetchRecords(TableNames.TASK_PROJECT, {
      fields: ["Id", "task"],
      filter: { project: projectId }
    })
    
    if (!relationshipsResponse.data || relationshipsResponse.data.length === 0) {
      return []
    }
    
    // Extract task IDs
    const taskIds = relationshipsResponse.data.map(rel => rel.task)
    
    // Fetch the actual tasks
    const tasksResponse = await apperClient.fetchRecords(TableNames.TASK, {
      fields: [
        "Id", "Name", "title", "description", "status", "priority", 
        "due_date", "tags", "category", "is_favorite"
      ],
      filter: { Id: { $in: taskIds } }
    })
    
    return tasksResponse.data || []
  } catch (error) {
    throw handleApiError(error)
  }
}

// Export project service methods
export const projectService = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getProjectTasks
}