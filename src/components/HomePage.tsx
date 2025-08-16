import Sidebar from "./Sidebar"
import Dashboard from "./Dashboard"

const HomePage = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Sidebar />
      <Dashboard />
    </div>
  )
}

export default HomePage