import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { userService } from '../services/userService'

// Check if user is already authenticated
export const checkAuthStatus = createAsyncThunk(
  'user/checkAuthStatus',
  async (_, { rejectWithValue }) => {
    try {
      return await userService.checkAuth()
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

// Logout user
export const logoutUser = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      await userService.logout()
      return null
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const initialState = {
  user: null,
  isAuthenticated: false,
  isAuthChecked: false,
  loading: false,
  error: null
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload
      state.isAuthenticated = !!action.payload
      state.isAuthChecked = true
      state.error = null
    },
    clearUser: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.error = null
    },
    setError: (state, action) => {
      state.error = action.payload
      state.loading = false
    }
  },
  extraReducers: (builder) => {
    builder
      // Check auth status
      .addCase(checkAuthStatus.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.isAuthenticated = !!action.payload
        state.isAuthChecked = true
      })
      .addCase(checkAuthStatus.rejected, (state, action) => {
        state.loading = false
        state.user = null
        state.isAuthenticated = false
        state.isAuthChecked = true
        state.error = action.payload
      })
      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.loading = true
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null
        state.isAuthenticated = false
        state.loading = false
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

export const { setUser, clearUser, setError } = userSlice.actions
export default userSlice.reducer