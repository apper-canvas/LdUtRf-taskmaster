function LoadingSpinner({ fullScreen = false }) {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 z-50">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-700 dark:text-gray-300 font-medium">Loading...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="flex justify-center p-4">
      <div className="w-8 h-8 border-3 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
    </div>
  )
}

export default LoadingSpinner