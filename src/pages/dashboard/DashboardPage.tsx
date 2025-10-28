export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Дашборд</h1>
      
      {/* Статистика */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-2xl font-semibold text-gray-900">0</div>
              </div>
            </div>
            <div className="mt-4">
              <div className="text-sm font-medium text-gray-500">Активных проектов</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-2xl font-semibold text-gray-900">0</div>
              </div>
            </div>
            <div className="mt-4">
              <div className="text-sm font-medium text-gray-500">Клиентов</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-2xl font-semibold text-gray-900">0 ₽</div>
              </div>
            </div>
            <div className="mt-4">
              <div className="text-sm font-medium text-gray-500">Выручка за месяц</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-2xl font-semibold text-gray-900">0</div>
              </div>
            </div>
            <div className="mt-4">
              <div className="text-sm font-medium text-gray-500">Работников</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Недавние проекты */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Недавние проекты
          </h3>
          <div className="text-sm text-gray-500">
            Пока нет проектов. Создайте первый проект!
          </div>
        </div>
      </div>
    </div>
  )
}


