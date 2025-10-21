import { useQuery } from '@tanstack/react-query'
import { projectsApi } from '@/lib/api'
import { formatDateTime } from '@/lib/utils'
import { Plus } from 'lucide-react'

export default function ProjectsPage() {
  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectsApi.getAll(),
  })

  const getSystemTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      'CCTV': 'Видеонаблюдение',
      'FIRE': 'ОПС',
      'ACCESS': 'СКУД',
      'INTERCOM': 'Домофоны',
      'ALARM': 'Сигнализация',
      'NETWORK': 'СКС',
      'OTHER': 'Другое',
    }
    return types[type] || type
  }

  const getStatusLabel = (status: string) => {
    const statuses: Record<string, string> = {
      'LEAD': 'Лид',
      'ESTIMATION': 'Смета',
      'APPROVED': 'Согласовано',
      'IN_PROGRESS': 'В работе',
      'COMPLETED': 'Завершен',
      'CANCELLED': 'Отменен',
    }
    return statuses[status] || status
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'LEAD': 'bg-blue-100 text-blue-800',
      'ESTIMATION': 'bg-yellow-100 text-yellow-800',
      'APPROVED': 'bg-purple-100 text-purple-800',
      'IN_PROGRESS': 'bg-green-100 text-green-800',
      'COMPLETED': 'bg-gray-100 text-gray-800',
      'CANCELLED': 'bg-red-100 text-red-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Проекты</h1>
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          <Plus className="w-5 h-5 mr-2" />
          Добавить проект
        </button>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <p className="mt-2 text-sm text-gray-500">Загрузка проектов...</p>
            </div>
          ) : projects && projects.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Название
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Тип системы
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Адрес
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Статус
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Создан
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {projects.map((project: any) => (
                    <tr key={project.id} className="hover:bg-gray-50 cursor-pointer">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {project.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {getSystemTypeLabel(project.system_type)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {project.address}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(project.status)}`}>
                          {getStatusLabel(project.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDateTime(project.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Нет проектов</h3>
              <p className="mt-1 text-sm text-gray-500">
                Создайте первый проект для начала работы.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
