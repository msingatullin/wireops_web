import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  FileText,
  Package,
  UserCog,
  DollarSign,
  BarChart3,
  LogOut,
  Brain,
} from 'lucide-react'

const navigation = [
  { name: 'Дашборд', href: '/', icon: LayoutDashboard },
  { name: 'Клиенты', href: '/clients', icon: Users },
  { name: 'Проекты', href: '/projects', icon: FolderKanban },
  { name: 'Сметы', href: '/estimates', icon: FileText },
  { name: '🤖 AI-Анализ', href: '/estimates/ai-profitability', icon: Brain },
  { name: 'Материалы', href: '/materials', icon: Package },
  { name: 'Работники', href: '/workers', icon: UserCog },
  { name: 'Финансы', href: '/finance', icon: DollarSign },
  { name: 'Аналитика', href: '/analytics', icon: BarChart3 },
]

export default function DashboardLayout() {
  const location = useLocation()
  const logout = useAuthStore((state) => state.logout)
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center h-16 px-6 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-900">WireOps</h1>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                    ${isActive
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
          
          {/* Logout */}
          <div className="p-3 border-t border-gray-200">
            <button
              onClick={logout}
              className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Выход
            </button>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="pl-64">
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}


