/**
 * RainSense — Axios API Service
 * Centralises all backend communication.
 */
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

// Request interceptor — log in dev
api.interceptors.request.use((config) => {
  if (import.meta.env.DEV) {
    console.debug(`[API] ${config.method?.toUpperCase()} ${config.url}`, config.data)
  }
  return config
})

// Response interceptor — normalise errors
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.error ||
      err.response?.data?.message ||
      (err.code === 'ECONNABORTED' ? 'Request timed out. Please try again.' : null) ||
      (err.message === 'Network Error' ? 'Cannot reach the server. Make sure the backend is running.' : null) ||
      'Something went wrong. Please try again.'
    return Promise.reject(new Error(message))
  }
)

/**
 * POST /predict
 * @param {{ temperature: number, humidity: number, wind_speed: number }} payload
 * @returns {Promise<{rain: string, rainfall: string, confidence: number, condition: string}>}
 */
export const predictRain = async (payload) => {
  const { data } = await api.post('/predict', payload)
  return data
}

/**
 * GET /health
 */
export const checkHealth = async () => {
  const { data } = await api.get('/health')
  return data
}

export default api
