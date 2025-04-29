import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { fetchTasks } from '../store/taskSlice'
import { fetchProjects } from '../store/projectSlice'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorDisplay from '../components/ErrorDisplay'
import Chart from 'react-apexcharts'
import { CheckSquare, Clock, AlertCircle, CheckCircle, PlusCircle, FolderOpen } from 'lucide-react'

function Dashboard() {
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.user)
  const { tasks, loading: tasksLoading, error: tasksError } = useSelector(state => state.tasks)
  const { projects, loading: projectsLoading, error: projectsError } = useSelector(state => state.projects)
  
  const [taskStats, setTaskStats] = useState({
    total: 0,
    todo: 0,
    inProgress: 0,
    completed: 0
  })
  
  useEffect(() => {
    dispatch(fetchTasks({ pagingInfo: { limit: 5, offset: 0 } }))
    dispatch(fetchProjects({ pagingInfo: { limit: 5, offset: 0 } }))
  }, [dispatch])
  
  useEffect(() => {
    if (tasks.length > 0) {
      const total = tasks.length
      const todo = tasks.filter(task => task.status === 'To Do').length
      const inProgress = tasks.filter(task => task.status === 'In Progress').length
      const completed = tasks.filter(task => task.status === 'Completed').length
      
      setTaskStats({ total, todo, inProgress, completed })
    }
  }, [tasks])
  
  const isLoading = tasksLoading || projectsLoading
  const error = tasksError || projectsError
  
  // Chart options for task status
  const chartOptions = {
    series: [taskStats.todo, taskStats.inProgress, taskStats.completed],
    chartOptions: {
      labels: ['To Do', 'In Progress', 'Completed'],
      colors: ['#F59E0B', '#3B82F6', '#10B981'],
      legend: {
        position: 'bottom'
      },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }]
    }
  }
  
  // Upcoming due tasks
  const upcomingTasks = tasks
    .filter(task => task.status !== 'Completed' && task.due_date)
    .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
    .slice(0, 5)
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>
      
      {error && <ErrorDisplay error={error} />}
      
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200 mr-4">
                  <CheckSquare size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Tasks</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">{taskStats.total}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-200 mr-4">
                  <Clock size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">In Progress</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">{taskStats.inProgress}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-200 mr-4">
                  <AlertCircle size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">To Do</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">{taskStats.todo}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-200 mr-4">
                  <CheckCircle size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">{taskStats.completed}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Task Status</h2>
              </div>
              
              {taskStats.total > 0 ? (
                <div className="py-4">
                  <Chart 
                    options={chartOptions.chartOptions}
                    series={chartOptions.series}
                    type="pie"
                    height={300}
                  />
                </div>
              ) : (
                <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                  <p>No tasks available</p>
                </div>
              )}
            </div>
            
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Upcoming Due Tasks</h2>
                <Link 
                  to="/tasks/new" 
                  className="text-sm flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                >
                  <PlusCircle size={16} className="mr-1" /> Add Task
                </Link>
              </div>
              
              {upcomingTasks.length > 0 ? (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {upcomingTasks.map(task => (
                    <Link 
                      key={task.Id} 
                      to={`/tasks/${task.Id}`}
                      className="flex items-center justify-between py-3 hover:bg-gray-50 dark:hover:bg-gray-750 px-2 rounded-md"
                    >
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-3 ${
                          task.priority === 'High' 
                            ? 'bg-red-500' 
                            : task.priority === 'Medium' 
                              ? 'bg-amber-500' 
                              : 'bg-green-500'
                        }`}></div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white">{task.title}</h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {task.status} · {task.category}
                          </p>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Due {task.due_date ? format(new Date(task.due_date), 'MMM d, yyyy') : 'No date'}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                  <p>No upcoming tasks</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Projects</h2>
              <Link 
                to="/projects/new" 
                className="text-sm flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                <PlusCircle size={16} className="mr-1" /> Add Project
              </Link>
            </div>
            
            {projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.slice(0, 3).map(project => (
                  <Link 
                    key={project.Id}
                    to={`/projects/${project.Id}`}
                    className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750"
                  >
                    <div className="flex items-start">
                      <div className="p-2 rounded-md bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200 mr-3">
                        <FolderOpen size={20} />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">{project.Name}</h3>
                        <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">{project.status}</div>
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${project.progress || 0}%` }}></div>
                          </div>
                          <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 flex justify-between">
                            <span>Progress</span>
                            <span>{project.progress || 0}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                <p>No projects available</p>
              </div>
            )}
            
            {projects.length > 3 && (
              <div className="mt-4 text-center">
                <Link 
                  to="/projects" 
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                >
                  View all projects
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default Dashboard