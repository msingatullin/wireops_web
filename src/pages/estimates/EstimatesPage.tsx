import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Plus, Calculator } from 'lucide-react'

export default function EstimatesPage() {
  const [showCalculator, setShowCalculator] = useState(false)
  
  const { data: estimates, isLoading } = useQuery({
    queryKey: ['estimates'],
    queryFn: async () => {
      const response = await api.get('/estimates')
      return response.data
    },
  })
  
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
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
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
            <div>Загрузка...</div>
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
                    <tr key={estimate.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {estimate.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        Проект #{estimate.project_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {estimate.status}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {estimate.total_cost.toLocaleString()} ₽
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
    </div>
  )
}
