import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { userService } from '../services/userService'
import { logoutUser } from '../store/userSlice'
import { TextInput, SubmitButton } from '../components/FormComponents'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorDisplay from '../components/ErrorDisplay'
import { User, Mail, Phone, LogOut, Save } from 'lucide-react'

function UserProfile() {
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.user)
  
  const [profileData, setProfileData] = useState({
    FirstName: '',
    LastName: '',
    Email: '',
    Phone: '',
  })
  
  const [userDetail, setUserDetail] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true)
        const userData = await userService.getUserProfile()
        setUserDetail(userData)
        
        if (userData) {
          setProfileData({
            FirstName: userData.FirstName || '',
            LastName: userData.LastName || '',
            Email: userData.Email || '',
            Phone: userData.Phone || '',
          })
        }
        
        setLoading(false)
      } catch (err) {
        console.error('Failed to fetch user profile:', err)
        setError('Failed to load user profile. Please try again.')
        setLoading(false)
      }
    }
    
    fetchUserProfile()
  }, [])
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccessMessage('')
    
    try {
      await userService.updateUserProfile(profileData)
      setSuccessMessage('Profile updated successfully')
      setIsSubmitting(false)
    } catch (err) {
      console.error('Failed to update profile:', err)
      setError('Failed to update profile. Please try again.')
      setIsSubmitting(false)
    }
  }
  
  const handleLogout = () => {
    dispatch(logoutUser())
  }
  
  if (loading) {
    return <LoadingSpinner />
  }
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Profile</h1>
      
      {error && <ErrorDisplay error={error} />}
      
      {successMessage && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800 dark:text-green-200">{successMessage}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 mb-4">
                <User size={40} />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {user?.firstName} {user?.lastName}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mt-1">{user?.emailAddress}</p>
              
              <button
                onClick={handleLogout}
                className="mt-6 inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <LogOut size={16} className="mr-2" />
                Logout
              </button>
            </div>
            
            <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="flex items-center py-2">
                <Mail size={16} className="text-gray-500 dark:text-gray-400 mr-2" />
                <span className="text-gray-500 dark:text-gray-400">{userDetail?.Email}</span>
              </div>
              {userDetail?.Phone && (
                <div className="flex items-center py-2">
                  <Phone size={16} className="text-gray-500 dark:text-gray-400 mr-2" />
                  <span className="text-gray-500 dark:text-gray-400">{userDetail.Phone}</span>
                </div>
              )}
            </div>
            
            <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Account Verification</h3>
              <div className="mt-2 space-y-2">
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full ${userDetail?.IsEmailVerified ? 'bg-green-500' : 'bg-red-500'} mr-2`}></div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Email: {userDetail?.IsEmailVerified ? 'Verified' : 'Not Verified'}
                  </span>
                </div>
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full ${userDetail?.IsPhoneVerified ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'} mr-2`}></div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Phone: {userDetail?.IsPhoneVerified ? 'Verified' : 'Not Verified'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Edit Profile</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <TextInput
                  label="First Name"
                  name="FirstName"
                  value={profileData.FirstName}
                  onChange={handleChange}
                  placeholder="Enter your first name"
                />
                
                <TextInput
                  label="Last Name"
                  name="LastName"
                  value={profileData.LastName}
                  onChange={handleChange}
                  placeholder="Enter your last name"
                />
                
                <TextInput
                  label="Email Address"
                  name="Email"
                  value={profileData.Email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  type="email"
                />
                
                <TextInput
                  label="Phone Number"
                  name="Phone"
                  value={profileData.Phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                />
              </div>
              
              <div className="mt-6">
                <SubmitButton
                  label={
                    <div className="flex items-center">
                      <Save size={16} className="mr-2" />
                      Save Changes
                    </div>
                  }
                  isSubmitting={isSubmitting}
                  className="w-full sm:w-auto"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfile