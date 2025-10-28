/**
 * AI-Калькулятор прибыльности проектов
 */
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuthStore } from '@/store/authStore'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

interface ProfitabilityRequest {
  client_budget: number
  max_client_budget?: number
  cameras_count: number
  cable_meters: number
  switches_count: number
  cabinets_count: number
  recorders_count: number
  cameras_cost: number
  cable_cost: number
  switches_cost: number
  cabinets_cost: number
  recorders_cost: number
  other_materials_cost: number
  monthly_rent: number
  monthly_fuel: number
  monthly_office_salaries: number
  monthly_taxes: number
  monthly_marketing: number
  monthly_other: number
  min_desired_profit: number
}

interface WorkerPaymentOption {
  option: string
  price_per_camera?: number
  total_project_payment?: number
  daily_rate_per_worker?: number
  total_workers_cost: number
  workers_needed: number
  estimated_days: number
  profit_margin: string
  recommendation: string
}

interface ProfitabilityResult {
  is_profitable: boolean
  profitability_verdict: string
  reasoning: string
  costs_breakdown: {
    materials_cost: number
    business_expenses_share: number
    total_fixed_costs: number
  }
  pricing_strategy: {
    minimum_price: number
    optimal_price: number
    maximum_price: number
    recommended_start_price: number
  }
  workers_payment_options: WorkerPaymentOption[]
  best_payment_option: string
  negotiation_strategy: {
    start_with: string
    minimum_acceptable: string
    walk_away_price: string
    tactics: string[]
  }
  risks: string[]
  opportunities: string[]
  summary: string
}

export default function AIProfitabilityPage() {
  const accessToken = useAuthStore((state) => state.accessToken)
  const logout = useAuthStore((state) => state.logout)
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState<ProfitabilityRequest>({
    client_budget: 100000,
    max_client_budget: 130000,
    cameras_count: 16,
    cable_meters: 1500,
    switches_count: 1,
    cabinets_count: 2,
    recorders_count: 1,
    cameras_cost: 80000,
    cable_cost: 30000,
    switches_cost: 15000,
    cabinets_cost: 10000,
    recorders_cost: 25000,
    other_materials_cost: 0,
    monthly_rent: 30000,
    monthly_fuel: 20000,
    monthly_office_salaries: 50000,
    monthly_taxes: 40000,
    monthly_marketing: 10000,
    monthly_other: 5000,
    min_desired_profit: 50000,
  })

  const analyzeMutation = useMutation({
    mutationFn: async (data: ProfitabilityRequest) => {
      if (!accessToken) {
        throw new Error('Вы не авторизованы. Пожалуйста, войдите в систему.')
      }
      
      try {
        const response = await axios.post<ProfitabilityResult>(
          `${API_URL}/estimates/ai/profitability-analysis`,
          data,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        )
        return response.data
      } catch (error: any) {
        if (error.response?.status === 401) {
          throw new Error('Ошибка авторизации. Попробуйте выйти и войти заново.')
        }
        if (error.response?.data?.detail) {
          throw new Error(error.response.data.detail)
        }
        throw new Error(error.message || 'Ошибка при анализе проекта')
      }
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    analyzeMutation.mutate(formData)
  }

  const handleChange = (field: keyof ProfitabilityRequest, value: number) => {
    setFormData({ ...formData, [field]: value })
  }

  const result = analyzeMutation.data

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            🤖 AI-Калькулятор Прибыльности
          </h1>
          <p className="text-gray-600 mt-2">
            Умный анализ проектов с помощью GPT-4o: прибыльность, стратегия торга, варианты оплаты монтажникам
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Клиент */}
              <div>
                <h3 className="text-lg font-semibold mb-3">💰 Бюджет клиента</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Бюджет клиента (₽)
                    </label>
                    <input
                      type="number"
                      value={formData.client_budget}
                      onChange={(e) => handleChange('client_budget', Number(e.target.value))}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Максимум до которого может дойти (₽)
                    </label>
                    <input
                      type="number"
                      value={formData.max_client_budget}
                      onChange={(e) => handleChange('max_client_budget', Number(e.target.value))}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Объем работ */}
              <div>
                <h3 className="text-lg font-semibold mb-3">📹 Объем работ</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Камеры (шт)</label>
                    <input
                      type="number"
                      value={formData.cameras_count}
                      onChange={(e) => handleChange('cameras_count', Number(e.target.value))}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Кабель (м)</label>
                    <input
                      type="number"
                      value={formData.cable_meters}
                      onChange={(e) => handleChange('cable_meters', Number(e.target.value))}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Коммутаторы</label>
                    <input
                      type="number"
                      value={formData.switches_count}
                      onChange={(e) => handleChange('switches_count', Number(e.target.value))}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Шкафы</label>
                    <input
                      type="number"
                      value={formData.cabinets_count}
                      onChange={(e) => handleChange('cabinets_count', Number(e.target.value))}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Регистраторы</label>
                    <input
                      type="number"
                      value={formData.recorders_count}
                      onChange={(e) => handleChange('recorders_count', Number(e.target.value))}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Стоимость материалов */}
              <div>
                <h3 className="text-lg font-semibold mb-3">📦 Себестоимость материалов</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Камеры (₽)</label>
                    <input
                      type="number"
                      value={formData.cameras_cost}
                      onChange={(e) => handleChange('cameras_cost', Number(e.target.value))}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Кабель (₽)</label>
                    <input
                      type="number"
                      value={formData.cable_cost}
                      onChange={(e) => handleChange('cable_cost', Number(e.target.value))}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Коммутаторы (₽)</label>
                    <input
                      type="number"
                      value={formData.switches_cost}
                      onChange={(e) => handleChange('switches_cost', Number(e.target.value))}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Шкафы (₽)</label>
                    <input
                      type="number"
                      value={formData.cabinets_cost}
                      onChange={(e) => handleChange('cabinets_cost', Number(e.target.value))}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Регистраторы (₽)</label>
                    <input
                      type="number"
                      value={formData.recorders_cost}
                      onChange={(e) => handleChange('recorders_cost', Number(e.target.value))}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Прочее (₽)</label>
                    <input
                      type="number"
                      value={formData.other_materials_cost}
                      onChange={(e) => handleChange('other_materials_cost', Number(e.target.value))}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                </div>
                <div className="mt-2 p-2 bg-gray-100 rounded">
                  <span className="font-semibold">Итого материалы: </span>
                  {(formData.cameras_cost + formData.cable_cost + formData.switches_cost + 
                    formData.cabinets_cost + formData.recorders_cost + formData.other_materials_cost).toLocaleString()} ₽
                </div>
              </div>

              {/* Постоянные расходы */}
              <div>
                <h3 className="text-lg font-semibold mb-3">💼 Постоянные расходы (месяц)</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Аренда (₽)</label>
                    <input
                      type="number"
                      value={formData.monthly_rent}
                      onChange={(e) => handleChange('monthly_rent', Number(e.target.value))}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">ГСМ (₽)</label>
                    <input
                      type="number"
                      value={formData.monthly_fuel}
                      onChange={(e) => handleChange('monthly_fuel', Number(e.target.value))}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Зарплаты офиса (₽)</label>
                    <input
                      type="number"
                      value={formData.monthly_office_salaries}
                      onChange={(e) => handleChange('monthly_office_salaries', Number(e.target.value))}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Налоги (₽)</label>
                    <input
                      type="number"
                      value={formData.monthly_taxes}
                      onChange={(e) => handleChange('monthly_taxes', Number(e.target.value))}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Реклама (₽)</label>
                    <input
                      type="number"
                      value={formData.monthly_marketing}
                      onChange={(e) => handleChange('monthly_marketing', Number(e.target.value))}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Прочее (₽)</label>
                    <input
                      type="number"
                      value={formData.monthly_other}
                      onChange={(e) => handleChange('monthly_other', Number(e.target.value))}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                </div>
                <div className="mt-2 p-2 bg-gray-100 rounded">
                  <span className="font-semibold">Итого расходы/месяц: </span>
                  {(formData.monthly_rent + formData.monthly_fuel + formData.monthly_office_salaries + 
                    formData.monthly_taxes + formData.monthly_marketing + formData.monthly_other).toLocaleString()} ₽
                </div>
              </div>

              {/* Желаемая прибыль */}
              <div>
                <h3 className="text-lg font-semibold mb-3">🎯 Желаемая прибыль</h3>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Минимальная прибыль на проект (₽)
                  </label>
                  <input
                    type="number"
                    value={formData.min_desired_profit}
                    onChange={(e) => handleChange('min_desired_profit', Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={analyzeMutation.isPending}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400"
              >
                {analyzeMutation.isPending ? '🤖 AI анализирует...' : '🚀 Проанализировать проект'}
              </button>
            </form>
          </div>

          {/* Results */}
          <div className="space-y-6">
            {analyzeMutation.isPending && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-center space-x-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="text-lg">AI анализирует проект...</span>
                </div>
              </div>
            )}

            {analyzeMutation.isError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="text-red-800 font-semibold mb-2">❌ Ошибка</h3>
                <p className="text-red-600 mb-4">{(analyzeMutation.error as Error).message}</p>
                {(analyzeMutation.error as Error).message.includes('авторизации') && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        logout()
                        navigate('/login')
                      }}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                      Выйти и войти заново
                    </button>
                    <button
                      onClick={() => window.location.reload()}
                      className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                    >
                      Обновить страницу
                    </button>
                  </div>
                )}
              </div>
            )}

            {result && (
              <>
                {/* Verdict */}
                <div className={`rounded-lg shadow-md p-6 ${result.is_profitable ? 'bg-green-50 border-2 border-green-500' : 'bg-red-50 border-2 border-red-500'}`}>
                  <h2 className="text-2xl font-bold mb-2">
                    {result.is_profitable ? '✅ ПРИБЫЛЬНЫЙ' : '❌ УБЫТОЧНЫЙ'}
                  </h2>
                  <p className="text-lg mb-3">{result.profitability_verdict}</p>
                  <p className="text-gray-700">{result.reasoning}</p>
                </div>

                {/* Pricing Strategy */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-bold mb-4">💰 Стратегия ценообразования</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-red-50 rounded">
                      <span className="font-medium">Минимальная цена (break-even):</span>
                      <span className="text-lg font-bold">{result.pricing_strategy.minimum_price.toLocaleString()} ₽</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                      <span className="font-medium">Оптимальная цена:</span>
                      <span className="text-lg font-bold text-blue-600">{result.pricing_strategy.optimal_price.toLocaleString()} ₽</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                      <span className="font-medium">Максимальная цена (для торга):</span>
                      <span className="text-lg font-bold text-green-600">{result.pricing_strategy.maximum_price.toLocaleString()} ₽</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-yellow-50 rounded border-2 border-yellow-400">
                      <span className="font-medium">🎯 Начать торг с:</span>
                      <span className="text-xl font-bold text-yellow-700">{result.pricing_strategy.recommended_start_price.toLocaleString()} ₽</span>
                    </div>
                  </div>
                </div>

                {/* Workers Payment Options */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-bold mb-4">👷 Варианты оплаты монтажникам</h3>
                  <div className="space-y-4">
                    {result.workers_payment_options.map((option, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-lg border-2 ${
                          option.option === result.best_payment_option
                            ? 'bg-green-50 border-green-500'
                            : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-lg">{option.option}</h4>
                          {option.option === result.best_payment_option && (
                            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                              ⭐ ЛУЧШИЙ
                            </span>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                          {option.price_per_camera && (
                            <div><span className="text-gray-600">За камеру:</span> <span className="font-semibold">{option.price_per_camera.toLocaleString()} ₽</span></div>
                          )}
                          {option.total_project_payment && (
                            <div><span className="text-gray-600">За проект:</span> <span className="font-semibold">{option.total_project_payment.toLocaleString()} ₽</span></div>
                          )}
                          {option.daily_rate_per_worker && (
                            <div><span className="text-gray-600">За день/чел:</span> <span className="font-semibold">{option.daily_rate_per_worker.toLocaleString()} ₽</span></div>
                          )}
                          <div><span className="text-gray-600">Всего оплата:</span> <span className="font-semibold">{option.total_workers_cost.toLocaleString()} ₽</span></div>
                          <div><span className="text-gray-600">Монтажников:</span> <span className="font-semibold">{option.workers_needed} чел</span></div>
                          <div><span className="text-gray-600">Срок:</span> <span className="font-semibold">{option.estimated_days} дней</span></div>
                          <div><span className="text-gray-600">Margin:</span> <span className="font-semibold text-green-600">{option.profit_margin}</span></div>
                        </div>
                        <p className="text-sm text-gray-600 italic">{option.recommendation}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Negotiation Strategy */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-bold mb-4">🤝 Стратегия торга</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-green-50 rounded">
                      <span className="font-medium">Начать с:</span>
                      <span className="ml-2 font-bold">{result.negotiation_strategy.start_with}</span>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded">
                      <span className="font-medium">Минимум принять:</span>
                      <span className="ml-2 font-bold">{result.negotiation_strategy.minimum_acceptable}</span>
                    </div>
                    <div className="p-3 bg-red-50 rounded">
                      <span className="font-medium">Уходить ниже:</span>
                      <span className="ml-2 font-bold">{result.negotiation_strategy.walk_away_price}</span>
                    </div>
                    <div className="mt-4">
                      <h4 className="font-semibold mb-2">Тактики торга:</h4>
                      <ul className="space-y-1">
                        {result.negotiation_strategy.tactics.map((tactic, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>{tactic}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Risks & Opportunities */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-bold mb-3 text-red-600">⚠️ Риски</h3>
                    <ul className="space-y-2">
                      {result.risks.map((risk, idx) => (
                        <li key={idx} className="text-sm">{risk}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-bold mb-3 text-green-600">✅ Возможности</h3>
                    <ul className="space-y-2">
                      {result.opportunities.map((opp, idx) => (
                        <li key={idx} className="text-sm">{opp}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-blue-50 border-2 border-blue-500 rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-bold mb-3">📊 Итоговая рекомендация</h3>
                  <p className="text-lg">{result.summary}</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

