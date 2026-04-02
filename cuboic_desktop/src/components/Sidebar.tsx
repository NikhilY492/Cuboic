import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import ThemeToggle from './ThemeToggle'

const FULL_NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: '📊', roles: ['Admin', 'Owner', 'Manager', 'Cashier'] },
  { path: '/pos', label: 'POS Terminal', icon: '🛒', roles: ['Admin', 'Owner', 'Manager', 'Cashier', 'Waiter'] },
  { path: '/orders', label: 'Orders (KOT)', icon: '🧾', roles: ['Admin', 'Owner', 'Manager', 'Cashier', 'Waiter', 'Kitchen'] },
  { path: '/inventory', label: 'Inventory', icon: '📦', roles: ['Admin', 'Owner', 'Manager'] },
  { path: '/recipes', label: 'Recipes', icon: '🍳', roles: ['Admin', 'Owner', 'Manager'] },
  { path: '/settings', label: 'Settings', icon: '⚙️', roles: ['Admin', 'Owner', 'Manager'] },
]

export default function Sidebar() {
  const location = useLocation()
  const { user } = useAuth()
  const role = user?.role || 'Staff'

  const allowedNavItems = FULL_NAV_ITEMS.filter(item => item.roles.includes(role))

  return (
    <aside className="w-64 bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-900 h-full flex flex-col transition-colors duration-300">
      <div className="p-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-sm text-white">
            C
          </div>
          Cuboic OS
        </h1>
        <ThemeToggle />
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {allowedNavItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path)
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-900'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-zinc-200 dark:border-zinc-900">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-zinc-800 flex items-center justify-center text-blue-600 dark:text-zinc-400 font-bold text-xs">
            {role.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{role} Area</p>
            <p className="text-xs text-zinc-500 truncate">Outlet Active</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

