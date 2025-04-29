import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice'
import taskReducer from './taskSlice'
import projectReducer from './projectSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    tasks: taskReducer,
    projects: projectReducer
  }
})