import axios from 'axios'

const API_URL = 'http://localhost:3000/api'

export const userAPI = {
  getAll: () => axios.get(`${API_URL}/users`),
  getById: (id) => axios.get(`${API_URL}/users/${id}`),
  create: (data) => axios.post(`${API_URL}/users`, data),
  update: (id, data) => axios.put(`${API_URL}/users/${id}`, data),
  delete: (id) => axios.delete(`${API_URL}/users/${id}`)
} 