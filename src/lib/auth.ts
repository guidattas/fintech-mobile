import * as SecureStore from 'expo-secure-store'
import { Platform } from 'react-native'

const TOKEN_KEY = 'mb_token'
const USER_KEY = 'mb_user'

// Web fallback: SecureStore não existe no web → localStorage
const isWeb = Platform.OS === 'web'

async function get(key: string): Promise<string | null> {
  if (isWeb) return typeof window !== 'undefined' ? window.localStorage.getItem(key) : null
  return SecureStore.getItemAsync(key)
}

async function set(key: string, value: string): Promise<void> {
  if (isWeb) {
    if (typeof window !== 'undefined') window.localStorage.setItem(key, value)
    return
  }
  await SecureStore.setItemAsync(key, value)
}

async function del(key: string): Promise<void> {
  if (isWeb) {
    if (typeof window !== 'undefined') window.localStorage.removeItem(key)
    return
  }
  await SecureStore.deleteItemAsync(key)
}

export const auth = {
  async getToken(): Promise<string | null> {
    return get(TOKEN_KEY)
  },
  async setToken(token: string): Promise<void> {
    await set(TOKEN_KEY, token)
  },
  async getUser<T = unknown>(): Promise<T | null> {
    const raw = await get(USER_KEY)
    if (!raw) return null
    try {
      return JSON.parse(raw) as T
    } catch {
      return null
    }
  },
  async setUser<T>(user: T): Promise<void> {
    await set(USER_KEY, JSON.stringify(user))
  },
  async clear(): Promise<void> {
    await del(TOKEN_KEY)
    await del(USER_KEY)
  },
}
