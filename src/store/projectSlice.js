import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { projectService } from '../services/projectService'

// Fetch all projects
export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async (params, { rejectWithValue }) => {
    try {
      return await projectService.getProjects(params)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

// Fetch single project
export const fetchProjectById = createAsyncThunk(
  'projects/fetchProjectById',
  async (id, { rejectWithValue }) => {
    try {
      return await projectService.getProjectById(id)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

// Create new project
export const createProject = createAsyncThunk(
  'projects/createProject',
  async (projectData, { rejectWithValue }) => {
    try {
      return await projectService.createProject(projectData)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

// Update project
export const updateProject = createAsyncThunk(
  'projects/updateProject',
  async ({ id, projectData }, { rejectWithValue }) => {
    try {
      return await projectService.updateProject(id, projectData)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

// Delete project
export const deleteProject = createAsyncThunk(
  'projects/deleteProject',
  async (id, { rejectWithValue }) => {
    try {
      await projectService.deleteProject(id)
      return id
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

// Fetch project tasks
export const fetchProjectTasks = createAsyncThunk(
  'projects/fetchProjectTasks',
  async (projectId, { rejectWithValue }) => {
    try {
      return await projectService.getProjectTasks(projectId)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const initialState = {
  projects: [],
  currentProject: null,
  projectTasks: [],
  loading: false,
  error: null,
  totalCount: 0,
  pageCount: 0
}

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    clearCurrentProject: (state) => {
      state.currentProject = null
    },
    setProjectError: (state, action) => {
      state.error = action.payload
      state.loading = false
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all projects
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false
        state.projects = action.payload.data
        state.totalCount = action.payload.totalCount
        state.pageCount = action.payload.pageCount
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Fetch project by id
      .addCase(fetchProjectById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.loading = false
        state.currentProject = action.payload
      })
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Create project
      .addCase(createProject.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.loading = false
        state.projects.unshift(action.payload)
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Update project
      .addCase(updateProject.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.loading = false
        state.currentProject = action.payload
        state.projects = state.projects.map(project => 
          project.Id === action.payload.Id ? action.payload : project
        )
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Delete project
      .addCase(deleteProject.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.loading = false
        state.projects = state.projects.filter(project => project.Id !== action.payload)
        if (state.currentProject && state.currentProject.Id === action.payload) {
          state.currentProject = null
        }
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Fetch project tasks
      .addCase(fetchProjectTasks.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProjectTasks.fulfilled, (state, action) => {
        state.loading = false
        state.projectTasks = action.payload
      })
      .addCase(fetchProjectTasks.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

export const { clearCurrentProject, setProjectError } = projectSlice.actions
export default projectSlice.reducer