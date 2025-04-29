import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { taskService } from '../services/taskService'

// Fetch all tasks
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (params, { rejectWithValue }) => {
    try {
      return await taskService.getTasks(params)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

// Fetch single task
export const fetchTaskById = createAsyncThunk(
  'tasks/fetchTaskById',
  async (id, { rejectWithValue }) => {
    try {
      return await taskService.getTaskById(id)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

// Create new task
export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData, { rejectWithValue }) => {
    try {
      return await taskService.createTask(taskData)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

// Update task
export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, taskData }, { rejectWithValue }) => {
    try {
      return await taskService.updateTask(id, taskData)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

// Delete task
export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (id, { rejectWithValue }) => {
    try {
      await taskService.deleteTask(id)
      return id
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const initialState = {
  tasks: [],
  currentTask: null,
  loading: false,
  error: null,
  totalCount: 0,
  pageCount: 0
}

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    clearCurrentTask: (state) => {
      state.currentTask = null
    },
    setTaskError: (state, action) => {
      state.error = action.payload
      state.loading = false
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all tasks
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false
        state.tasks = action.payload.data
        state.totalCount = action.payload.totalCount
        state.pageCount = action.payload.pageCount
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Fetch task by id
      .addCase(fetchTaskById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTaskById.fulfilled, (state, action) => {
        state.loading = false
        state.currentTask = action.payload
      })
      .addCase(fetchTaskById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Create task
      .addCase(createTask.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false
        state.tasks.unshift(action.payload)
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Update task
      .addCase(updateTask.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false
        state.currentTask = action.payload
        state.tasks = state.tasks.map(task => 
          task.Id === action.payload.Id ? action.payload : task
        )
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Delete task
      .addCase(deleteTask.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false
        state.tasks = state.tasks.filter(task => task.Id !== action.payload)
        if (state.currentTask && state.currentTask.Id === action.payload) {
          state.currentTask = null
        }
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

export const { clearCurrentTask, setTaskError } = taskSlice.actions
export default taskSlice.reducer