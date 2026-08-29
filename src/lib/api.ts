import axios from 'axios'
import Constants from 'expo-constants'
import { Platform } from 'react-native'
import { auth } from './auth'

// Base URL:
// - Web: localhost:3002
// - iOS Simulator: localhost funciona
// - Android emulator: precisa 10.0.2.2
// - Dispositivo físico: IP da máquina na LAN (defina EXPO_PUBLIC_API_URL)
function getBaseURL(): string {
  const fromEnv = process.env.EXPO_PUBLIC_API_URL
  if (fromEnv) return fromEnv
  if (Platform.OS === 'android') return 'http://10.0.2.2:3002'
  return 'http://localhost:3002'
}

export const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 15000,
})

api.interceptors.request.use(async (config) => {
  const token = await auth.getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (r) => r,
  async (err) => {
    if (err?.response?.status === 401) {
      await auth.clear()
    }
    return Promise.reject(err)
  },
)

export const authApi = {
  login: (email: string, password: string) =>
    api.post<{ accessToken: string; user?: unknown }>('/auth/login-representante', {
      email,
      password,
    }),
}

export const walletApi = {
  balance: () =>
    api.get<{ saldo: number; balance?: number; totalBalance?: number; blockedBalance?: number }>(
      '/wallet',
    ),
}

export interface Transaction {
  id: string
  type: string
  category: string | null
  amount: number
  status: string
  referenceId: string | null
  description: string | null
  walletId: string
  createdAt: string
}

export const transactionsApi = {
  list: () => api.get<Transaction[]>('/transactions'),
}

export interface PixCharge {
  id: string
  provider: string
  amount: number
  status: string
  qrCode: string
  description?: string
  message?: string
}

export const pixApi = {
  create: (amount: number, description?: string) =>
    api.post<PixCharge>('/pix/create', { amount, description, provider: 'auto' }),
  simulate: (id: string) => api.post(`/pix/${id}/simulate`),
}

export const devicesApi = {
  register: (token: string, platform: 'ios' | 'android') =>
    api.post('/devices/register', { token, platform }),
}
