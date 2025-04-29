import { getApperClient, getApperUI, TableNames, handleApiError } from './apperService'

/**
 * Check if user is authenticated
 * @returns {Promise<Object|null>} User data if authenticated, null otherwise
 */
const checkAuth = async () => {
  try {
    // Retrieve user data from localStorage if available
    const userData = localStorage.getItem('user')
    return userData ? JSON.parse(userData) : null
  } catch (error) {
    console.error("Error checking authentication:", error)
    return null
  }
}

/**
 * Get the current user profile
 * @returns {Promise<Object>} User profile data
 */
const getUserProfile = async () => {
  try {
    const apperClient = getApperClient()
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    
    // Fetch user record from User table
    if (user && user.userId) {
      const response = await apperClient.fetchRecords(TableNames.USER, {
        filter: { Id: user.userId },
        fields: [
          "Id", "FirstName", "LastName", "Email", "AvatarUrl", 
          "Phone", "IsEmailVerified", "IsPhoneVerified"
        ]
      })
      
      if (response && response.data && response.data.length > 0) {
        return response.data[0]
      }
    }
    
    return null
  } catch (error) {
    throw handleApiError(error)
  }
}

/**
 * Update user profile
 * @param {Object} profileData User profile data to update
 * @returns {Promise<Object>} Updated user profile
 */
const updateUserProfile = async (profileData) => {
  try {
    const apperClient = getApperClient()
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    
    if (!user || !user.userId) {
      throw new Error("User not authenticated")
    }
    
    const response = await apperClient.updateRecord(TableNames.USER, user.userId, {
      record: profileData
    })
    
    return response.data
  } catch (error) {
    throw handleApiError(error)
  }
}

/**
 * Logout the current user
 * @returns {Promise<void>}
 */
const logout = async () => {
  try {
    // Remove user data from localStorage
    localStorage.removeItem('user')
    return true
  } catch (error) {
    throw handleApiError(error)
  }
}

// Export user service methods
export const userService = {
  checkAuth,
  getUserProfile,
  updateUserProfile,
  logout
}