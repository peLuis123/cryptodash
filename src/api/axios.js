import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_COINGECKO_BASE_URL ?? 'https://api.coingecko.com/api/v3'
const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT ?? 10000)
const API_KEY = import.meta.env.VITE_COINGECKO_API_KEY

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
})

apiClient.interceptors.request.use(
  (config) => {
    const nextConfig = { ...config }

    nextConfig.headers = {
      Accept: 'application/json',
      ...nextConfig.headers,
    }

    if (API_KEY) {
      nextConfig.headers['x-cg-pro-api-key'] = API_KEY
    }

    const authToken = localStorage.getItem('auth_token')
    if (authToken) {
      nextConfig.headers.Authorization = `Bearer ${authToken}`
    }

    return nextConfig
  },
  (error) => Promise.reject(error),
)

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const normalizedError = {
      status: error.response?.status ?? 0,
      message: error.response?.data?.error || error.response?.data?.message || error.message || 'Unexpected API error',
      data: error.response?.data,
      original: error,
    }

    return Promise.reject(normalizedError)
  },
)

export default apiClient