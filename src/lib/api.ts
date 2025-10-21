/**
 * API клиент для взаимодействия с backend
 */
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'https://wireops-backend-mhyinxjwaq-ew.a.run.app/api/v1'

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

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refresh_token')
        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refresh_token: refreshToken,
        })

        const { access_token, refresh_token } = response.data
        localStorage.setItem('access_token', access_token)
        localStorage.setItem('refresh_token', refresh_token)

        originalRequest.headers.Authorization = `Bearer ${access_token}`
        return api(originalRequest)
      } catch (refreshError) {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

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
  upload: async (file: File, projectId: number) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('project_id', projectId.toString())
    
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

  create: async (data: any) => {
    const response = await api.post('/materials', data)
    return response.data
  },
}

export default api


