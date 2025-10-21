import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { projectsApi, clientsApi } from '@/lib/api'
import { formatDateTime } from '@/lib/utils'
import { Plus, X } from 'lucide-react'

export default function ProjectsPage() {
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    client_id: '',
    system_type: 'CCTV',
    address: '',
    description: '',
    status: 'LEAD',
  })

  const queryClient = useQueryClient()

  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectsApi.getAll(),
  })

  const { data: clients } = useQuery({
    queryKey: ['clients'],
    queryFn: () => clientsApi.getAll(),
  })

  const createMutation = useMutation({
    mutationFn: (data: any) => projectsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      setShowModal(false)
      setFormData({
        name: '',
        client_id: '',
        system_type: 'CCTV',
        address: '',
        description: '',
        status: 'LEAD',
      })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const submitData = {
      ...formData,
      client_id: parseInt(formData.client_id),
    }
    createMutation.mutate(submitData)
  }

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
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Добавить проект</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Название проекта <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Клиент <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.client_id}
                    onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Выберите клиента</option>
                    {clients?.map((client: any) => (
                      <option key={client.id} value={client.id}>
                        {client.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Тип системы <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.system_type}
                    onChange={(e) => setFormData({ ...formData, system_type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="CCTV">Видеонаблюдение</option>
                    <option value="FIRE">ОПС</option>
                    <option value="ACCESS">СКУД</option>
                    <option value="INTERCOM">Домофоны</option>
                    <option value="ALARM">Сигнализация</option>
                    <option value="NETWORK">СКС</option>
                    <option value="OTHER">Другое</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Адрес <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Статус <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="LEAD">Лид</option>
                    <option value="ESTIMATION">Смета</option>
                    <option value="APPROVED">Согласовано</option>
                    <option value="IN_PROGRESS">В работе</option>
                    <option value="COMPLETED">Завершен</option>
                    <option value="CANCELLED">Отменен</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Описание
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400"
                >
                  {createMutation.isPending ? 'Сохранение...' : 'Сохранить'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
