import { Link, useLocation } from "react-router-dom"
import { BarChart3 } from "lucide-react"
import { menuItems } from "../config/navigation"

const Sidebar = () => {
  const location = useLocation()

  return (
    <div className="bg-gradient-to-b from-success to-success/80 w-64 min-h-screen fixed left-0 top-0 text-white shadow-xl">
      {/* Logo/Header */}
      <div className="p-6 border-b border-white/20">
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <BarChart3 className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg">HMS</h1>
            <p className="text-white/80 text-xs">Hospital Management</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="p-4">
        <div className="mb-6">
          <h3 className="text-white/60 text-xs font-medium uppercase tracking-wider mb-3">
            MENU
          </h3>
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.href
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-white/20 text-white shadow-lg"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>

      </nav>

    </div>
  )
}

export default Sidebar 