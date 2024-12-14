import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000/api'
})

export const studentAPI = {
  getAll: () => api.get('/students'),
  getStats: () => api.get('/students/stats'),
  create: (data) => api.post('/students', data),
  update: (id, data) => api.put(`/students/${id}`, data),
  delete: (id) => api.delete(`/students/${id}`)
}

export const userAPI = {
  getAll: () => api.get('/users'),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`)
} 