import axios, { type AxiosResponse } from "axios"
import { signOut } from "next-auth/react"
import { cookieStorage } from "./cookies"

// Create axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor to attach auth token
api.interceptors.request.use(
  (config) => {
    // Get token from cookies (set by NextAuth)
    const token =
      cookieStorage.getItem("next-auth.session-token") || cookieStorage.getItem("__Secure-next-auth.session-token")

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - sign out and redirect
      await signOut({ callbackUrl: "/sign-in" })
    }

    return Promise.reject(error)
  },
)

// Typed API helpers
export const apiClient = {
  get: <T = any>(url: string, config?: any): Promise<AxiosResponse<T>> => api.get(url, config),
  post: <T = any>(url: string, data?: any, config?: any): Promise<AxiosResponse<T>> => api.post(url, data, config),
  put: <T = any>(url: string, data?: any, config?: any): Promise<AxiosResponse<T>> => api.put(url, data, config),
  patch: <T = any>(url: string, data?: any, config?: any): Promise<AxiosResponse<T>> => api.patch(url, data, config),
  delete: <T = any>(url: string, config?: any): Promise<AxiosResponse<T>> => api.delete(url, config),
}

export default api
