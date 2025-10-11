import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { BarChart3, TrendingUp, Clock, Award } from 'lucide-react'

export default function AnalyticsPage() {
  const { data: dashboard } = useQuery({
    queryKey: ['analytics', 'dashboard'],
    queryFn: async () => {
      const response = await api.get('/analytics/dashboard')
      return response.data
    },
  })
  
  const { data: projectsByType } = useQuery({
    queryKey: ['analytics', 'projects-by-type'],
    queryFn: async () => {
      const response = await api.get('/analytics/projects/by-type')
      return response.data
    },
  })
  
  const { data: performance } = useQuery({
    queryKey: ['analytics', 'performance'],
    queryFn: async () => {
      const response = await api.get('/analytics/performance')
      return response.data
    },
  })
  
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Аналитика</h1>
      
      {/* Метрики эффективности */}
      {performance && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Clock className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Среднее время
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {performance.avg_completion_days} дней
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Award className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Выполнено в срок
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {performance.on_time_rate}%
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Конверсия лидов
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {performance.conversion_rate}%
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BarChart3 className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Завершено проектов
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {performance.completed_projects}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Распределение по типам */}
      {projectsByType && projectsByType.length > 0 && (
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Проекты по типам систем
          </h2>
          <div className="space-y-4">
            {projectsByType.map((item: any) => (
              <div key={item.system_type}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-900">{item.system_type}</span>
                  <span className="text-gray-500">
                    {item.count} проектов • {item.total_cost.toLocaleString()} ₽
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{
                      width: `${(item.count / projectsByType.reduce((acc: number, i: any) => acc + i.count, 0)) * 100}%`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Финансовая сводка */}
      {dashboard && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Финансы за период ({dashboard.period_days} дней)
          </h2>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <div className="text-sm text-gray-500">Доходы</div>
              <div className="text-2xl font-bold text-green-600 mt-1">
                {dashboard.finance.income.toLocaleString()} ₽
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Расходы</div>
              <div className="text-2xl font-bold text-red-600 mt-1">
                {dashboard.finance.expense.toLocaleString()} ₽
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Прибыль</div>
              <div className="text-2xl font-bold text-indigo-600 mt-1">
                {dashboard.finance.balance.toLocaleString()} ₽
              </div>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            Рентабельность: {dashboard.finance.profit_margin}%
          </div>
        </div>
      )}
    </div>
  )
}
