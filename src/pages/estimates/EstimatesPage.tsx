import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { estimatesApi, projectsApi } from '@/lib/api'
import { Plus, Calculator, X } from 'lucide-react'

export default function EstimatesPage() {
  const [showCalculator, setShowCalculator] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    project_id: '',
    status: 'DRAFT',
    notes: '',
  })

  const queryClient = useQueryClient()

  const { data: estimates, isLoading } = useQuery({
    queryKey: ['estimates'],
    queryFn: () => estimatesApi.getAll(),
  })

  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectsApi.getAll(),
  })

  const createMutation = useMutation({
    mutationFn: (data: any) => {
      console.log('Creating estimate with data:', data)
      return estimatesApi.create(data)
    },
    onSuccess: (response) => {
      console.log('Estimate created successfully:', response)
      queryClient.invalidateQueries({ queryKey: ['estimates'] })
      setShowModal(false)
      setFormData({
        name: '',
        project_id: '',
        status: 'DRAFT',
        notes: '',
      })
      alert('Смета успешно создана!')
    },
    onError: (error: any) => {
      console.error('Error creating estimate:', error)
      console.error('Error response:', error.response?.data)
      alert(`Ошибка при создании сметы: ${error.response?.data?.detail || error.message}`)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const submitData = {
      ...formData,
      project_id: parseInt(formData.project_id),
    }
    console.log('Submitting estimate form with data:', submitData)
    createMutation.mutate(submitData)
  }

  const getStatusLabel = (status: string) => {
    const statuses: Record<string, string> = {
      'DRAFT': 'Черновик',
      'SENT': 'Отправлен',
      'APPROVED': 'Согласован',
      'REJECTED': 'Отклонен',
    }
    return statuses[status] || status
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'DRAFT': 'bg-gray-100 text-gray-800',
      'SENT': 'bg-blue-100 text-blue-800',
      'APPROVED': 'bg-green-100 text-green-800',
      'REJECTED': 'bg-red-100 text-red-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Сметы</h1>
        <div className="flex gap-3">
          <button
            onClick={() => setShowCalculator(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <Calculator className="w-5 h-5 mr-2" />
            Калькулятор
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="w-5 h-5 mr-2" />
            Создать смету
          </button>
        </div>
      </div>

      {showCalculator && (
        <div className="mb-8 bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Калькулятор сметы</h2>
            <button
              onClick={() => setShowCalculator(false)}
              className="text-gray-400 hover:text-gray-500"
            >
              ✕
            </button>
          </div>

          <form className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Тип системы
              </label>
              <select className="w-full border-gray-300 rounded-md shadow-sm">
                <option value="cctv">Видеонаблюдение</option>
                <option value="fire">Пожарная сигнализация</option>
                <option value="access">СКУД</option>
                <option value="intercom">Домофоны</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Площадь (кв.м)
              </label>
              <input
                type="number"
                className="w-full border-gray-300 rounded-md shadow-sm"
                placeholder="500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Количество точек
              </label>
              <input
                type="number"
                className="w-full border-gray-300 rounded-md shadow-sm"
                placeholder="10"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Длина кабеля (м)
              </label>
              <input
                type="number"
                className="w-full border-gray-300 rounded-md shadow-sm"
                placeholder="200"
              />
            </div>

            <div className="col-span-2">
              <button
                type="button"
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Рассчитать
              </button>
            </div>
          </form>

          <div className="mt-6 border-t pt-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-gray-900">—</div>
                <div className="text-sm text-gray-500">Материалы</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">—</div>
                <div className="text-sm text-gray-500">Работы</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-indigo-600">—</div>
                <div className="text-sm text-gray-500">Итого</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <p className="mt-2 text-sm text-gray-500">Загрузка смет...</p>
            </div>
          ) : estimates && estimates.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Название
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Проект
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Статус
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Сумма
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Дата
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {estimates.map((estimate: any) => (
                    <tr key={estimate.id} className="hover:bg-gray-50 cursor-pointer">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {estimate.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        Проект #{estimate.project_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(estimate.status)}`}>
                          {getStatusLabel(estimate.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {estimate.total_cost ? estimate.total_cost.toLocaleString() + ' ₽' : '—'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(estimate.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Calculator className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Нет смет</h3>
              <p className="mt-1 text-sm text-gray-500">
                Создайте первую смету или используйте калькулятор
              </p>
              <div className="mt-6">
                <button
                  onClick={() => setShowCalculator(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <Calculator className="w-5 h-5 mr-2" />
                  Открыть калькулятор
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Создать смету</h2>
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
                    Название сметы <span className="text-red-500">*</span>
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
                    Проект <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.project_id}
                    onChange={(e) => setFormData({ ...formData, project_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Выберите проект</option>
                    {projects?.map((project: any) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
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
                    <option value="DRAFT">Черновик</option>
                    <option value="SENT">Отправлен</option>
                    <option value="APPROVED">Согласован</option>
                    <option value="REJECTED">Отклонен</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Примечания
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
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
