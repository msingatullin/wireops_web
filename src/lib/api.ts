/**
 * API клиент для взаимодействия с backend
 */
import axios from 'axios'

// Убираем /v1 из URL по умолчанию
const API_URL = import.meta.env.VITE_API_URL || 'https://wireops-backend-mhyinxjwaq-ew.a.run.app/api'

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor для добавления токена к запросам
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor для обработки ошибок авторизации
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Проверяем, что ошибка 401 и это не повторный запрос после обновления токена
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true // Помечаем запрос как повторный

      try {
        const refreshToken = localStorage.getItem('refresh_token')
        // Используем чистый axios для запроса обновления, чтобы избежать бесконечного цикла интерцептора
        const response = await axios.post(`${API_URL}/auth/refresh`, null, { // Передаем null вместо данных, если API не требует тело
             headers: {
                // Возможно, ваш API ожидает refresh_token в заголовке или теле по-другому
                // Уточните формат запроса /auth/refresh
                'Authorization': `Bearer ${refreshToken}` // Пример, если токен в заголовке
                // или используйте data: { refresh_token: refreshToken } если в теле
            }
        })

        const { access_token, refresh_token } = response.data
        localStorage.setItem('access_token', access_token)
        localStorage.setItem('refresh_token', refresh_token)

        // Обновляем заголовок оригинального запроса
        originalRequest.headers.Authorization = `Bearer ${access_token}`
        // Повторяем оригинальный запрос с новым токеном
        return api(originalRequest)
      } catch (refreshError) {
        // Если обновление токена не удалось, выходим из системы
        console.error("Не удалось обновить токен:", refreshError)
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        // Используем window.location для перенаправления, чтобы очистить состояние приложения
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    // Для всех других ошибок просто пробрасываем их дальше
    return Promise.reject(error)
  }
)

// Auth API
export const authApi = {
  login: async (email: string, password: string) => {
    const params = new URLSearchParams()
    params.append('username', email)
    params.append('password', password)

    const response = await api.post('/auth/login', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    return response.data
  },

  register: async (data: any) => {
    const response = await api.post('/auth/register', data)
    return response.data
  },
}

// Clients API
export const clientsApi = {
  getAll: async (params?: any) => {
    const response = await api.get('/clients', { params })
    return response.data
  },

  getOne: async (id: number) => {
    const response = await api.get(`/clients/${id}`)
    return response.data
  },

  create: async (data: any) => {
    const response = await api.post('/clients', data)
    return response.data
  },

  update: async (id: number, data: any) => {
    const response = await api.patch(`/clients/${id}`, data)
    return response.data
  },

  delete: async (id: number) => {
    await api.delete(`/clients/${id}`)
  },
}

// Projects API
export const projectsApi = {
  getAll: async (params?: any) => {
    const response = await api.get('/projects', { params })
    return response.data
  },

  getOne: async (id: number) => {
    const response = await api.get(`/projects/${id}`)
    return response.data
  },

  create: async (data: any) => {
    const response = await api.post('/projects', data)
    return response.data
  },

  update: async (id: number, data: any) => {
    const response = await api.patch(`/projects/${id}`, data)
    return response.data
  },

  delete: async (id: number) => {
    await api.delete(`/projects/${id}`)
  },
}

// Documents API
export const documentsApi = {
  upload: async (file: File, projectId?: number, // Сделаем projectId необязательным
                 documentType?: string, title?: string, description?: string) => {
    const formData = new FormData()
    formData.append('file', file)
    if (projectId) formData.append('project_id', projectId.toString())
    if (documentType) formData.append('document_type', documentType)
    if (title) formData.append('title', title)
    if (description) formData.append('description', description)


    const response = await api.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  analyze: async (documentId: number) => {
    const response = await api.post(`/documents/${documentId}/analyze`)
    return response.data
  },

  getForProject: async (projectId: number) => {
    const response = await api.get(`/documents/project/${projectId}`)
    return response.data
  },

   getOne: async (documentId: number) => {
    const response = await api.get(`/documents/${documentId}`)
    return response.data
  },
}

// Workers API
export const workersApi = {
  getAll: async (params?: any) => {
    const response = await api.get('/workers', { params })
    return response.data
  },

  getOne: async (id: number) => {
    const response = await api.get(`/workers/${id}`)
    return response.data
  },

  create: async (data: any) => {
    const response = await api.post('/workers', data)
    return response.data
  },

  assign: async (data: any) => {
    const response = await api.post('/workers/assign', data)
    return response.data
  },

  reassign: async (workerId: number, data: any) => {
    const response = await api.post(`/workers/${workerId}/reassign`, data)
    return response.data
  },

  getAssignments: async (workerId: number, params?: any) => {
    const response = await api.get(`/workers/${workerId}/assignments`, { params })
    return response.data
  },

  getCurrentProject: async (workerId: number) => {
     const response = await api.get(`/workers/${workerId}/current-project`)
     return response.data
  },

  getProjectWorkers: async (projectId: number, params?: any) => {
     const response = await api.get(`/workers/projects/${projectId}/workers`, { params })
     return response.data
  },

  calculatePayment: async (assignmentId: number, data: any) => {
      const response = await api.post(`/workers/assignments/${assignmentId}/calculate-payment`, data)
      return response.data
  },

  completeAssignment: async (assignmentId: number) => {
      const response = await api.patch(`/workers/assignments/${assignmentId}/complete`)
      return response.data
  },


  getAvailable: async () => {
    const response = await api.get('/workers/available')
    return response.data
  },
}

// Materials API
export const materialsApi = {
  getAll: async (params?: any) => {
    const response = await api.get('/materials', { params })
    return response.data
  },

   getOne: async (id: number) => {
    const response = await api.get(`/materials/${id}`)
    return response.data
  },

  create: async (data: any) => {
    const response = await api.post('/materials', data)
    return response.data
  },

  update: async (id: number, data: any) => {
    const response = await api.patch(`/materials/${id}`, data)
    return response.data
  },

   delete: async (id: number) => {
    await api.delete(`/materials/${id}`)
  },
}

// Estimates API
export const estimatesApi = {
  getAll: async (params?: any) => {
    const response = await api.get('/estimates', { params })
    return response.data
  },

   getOne: async (id: number) => {
    const response = await api.get(`/estimates/${id}`)
    return response.data
  },

  create: async (data: any) => {
    const response = await api.post('/estimates', data)
    return response.data
  },

   calculate: async (data: any) => {
      const response = await api.post('/estimates/calculate', data)
      return response.data
   },

   analyzeProfitability: async (data: any) => {
       const response = await api.post('/estimates/ai/profitability-analysis', data)
       return response.data
   },

   quickProfitabilityCheck: async (data: any) => {
        const response = await api.post('/estimates/ai/quick-profitability-check', data)
        return response.data
   }
}

// Finance API
export const financeApi = {
  getTransactions: async (params?: any) => {
    const response = await api.get('/finance/transactions', { params })
    return response.data
  },

  getSummary: async (params?: any) => {
    const response = await api.get('/finance/transactions/summary', { params })
    return response.data
  },

  createTransaction: async (data: any) => {
    const response = await api.post('/finance/transactions', data)
    return response.data
  },

  getCategories: async () => {
      const response = await api.get('/finance/categories')
      return response.data
  },

   createCategory: async (data: any) => {
      const response = await api.post('/finance/categories', data)
      return response.data
   },

   getFuelLogs: async (params?: any) => {
       const response = await api.get('/finance/fuel', { params })
       return response.data
   },

    createFuelLog: async (data: any) => {
        const response = await api.post('/finance/fuel', data)
        return response.data
    },

    getFuelSummary: async (params?: any) => {
        const response = await api.get('/finance/fuel/summary', { params })
        return response.data
    }
}

// Analytics API
export const analyticsApi = {
    getDashboard: async (params?: any) => {
        const response = await api.get('/analytics/dashboard', { params })
        return response.data
    },
    getProjectsByType: async () => {
        const response = await api.get('/analytics/projects/by-type')
        return response.data
    },
    getMonthlyFinance: async (params?: any) => {
        const response = await api.get('/analytics/finance/monthly', { params })
        return response.data
    },
     getProjectsTimeline: async (params?: any) => {
        const response = await api.get('/analytics/projects/timeline', { params })
        return response.data
     },
     getPerformanceMetrics: async () => {
         const response = await api.get('/analytics/performance')
         return response.data
     }
}


export default api
