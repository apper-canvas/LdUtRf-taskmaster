// Apper Client Service Initialization
// This service provides a singleton instance of ApperClient for the application

// Canvas ID from the application configuration
const CANVAS_ID = "81ebd0a197324205ae8f579afd9c1cd5"

// Singleton instance of ApperClient
let apperClientInstance = null

/**
 * Get the ApperClient instance, creating it if it doesn't exist
 * @returns {Object} ApperClient instance
 */
export const getApperClient = () => {
  if (!apperClientInstance) {
    // Make sure the SDK is loaded
    if (!window.ApperSDK) {
      throw new Error("Apper SDK not loaded. Please make sure the script is included in index.html")
    }
    
    const { ApperClient } = window.ApperSDK
    apperClientInstance = new ApperClient(CANVAS_ID)
  }
  
  return apperClientInstance
}

/**
 * Get the ApperUI component for authentication
 * @returns {Object} ApperUI instance
 */
export const getApperUI = () => {
  if (!window.ApperSDK) {
    throw new Error("Apper SDK not loaded. Please make sure the script is included in index.html")
  }
  
  return window.ApperSDK.ApperUI
}

/**
 * Table names from the database schema
 */
export const TableNames = {
  USER: "User",
  TASK: "task3",
  PROJECT: "project2",
  TASK_PROJECT: "task_project"
}

/**
 * Helper function to handle API errors
 * @param {Error} error The error object
 * @returns {Object} Standardized error object
 */
export const handleApiError = (error) => {
  console.error("API Error:", error)
  
  if (error.response) {
    return {
      message: error.response.data?.message || "Server error occurred",
      status: error.response.status,
      details: error.response.data
    }
  }
  
  return {
    message: error.message || "An unexpected error occurred",
    details: error
  }
}

// Default export as a service object
export default {
  getApperClient,
  getApperUI,
  TableNames,
  handleApiError,
  CANVAS_ID
}