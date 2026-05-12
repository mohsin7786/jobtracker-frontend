import axios from 'axios'

const API = axios.create({
  // baseURL: 'http://localhost:5000/api'
  baseURL: 'https://jobtracker-backend-n5ht.onrender.com/api'
})

// Har request mein token automatically add ho
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const registerUser = (data) => API.post('/auth/register', data)
export const loginUser = (data) => API.post('/auth/login', data)
export const getJobs = () => API.get('/jobs')
export const addJob = (data) => API.post('/jobs', data)
export const updateJob = (id, data) => API.put(`/jobs/${id}`, data)
export const deleteJob = (id) => API.delete(`/jobs/${id}`)