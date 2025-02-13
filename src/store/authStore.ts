import { create } from 'zustand'
import { login as apiLogin, logout as apiLogout } from '@/lib/api'
import type { LoginCredentials } from '@/types'

interface AuthState {
  isAuthenticated: boolean
  user: LoginCredentials | null
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => Promise<void>
}

const getInitialState = () => {
  const storedAuth = sessionStorage.getItem('auth')

  if (storedAuth) {
    try {
      const { isAuthenticated, user } = JSON.parse(storedAuth)

      return { isAuthenticated, user }
    } catch (error) {
      console.error('Failed to parse stored auth state:', error)
    }
  }
  return { isAuthenticated: false, user: null }
}

export const useAuthStore = create<AuthState>((set) => {
  const initialState = getInitialState()

  return {
    ...initialState,
    login: async (credentials) => {
      await apiLogin(credentials)
      const newState = { isAuthenticated: true, user: credentials }

      sessionStorage.setItem('auth', JSON.stringify(newState))
      set(newState)
    },
    logout: async () => {
      await apiLogout()

      sessionStorage.removeItem('auth')

      set({ isAuthenticated: false, user: null })
    },
  }
})
