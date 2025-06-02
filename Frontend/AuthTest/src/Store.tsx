import { create } from 'zustand'

import api from './api'       // το axios instance που ήδη έχεις

interface User {
  id: number
  username: string
  email: string
}

interface AuthState {
  token: string | null
  username: string | null
  isLoading: boolean
  error: string | null

  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  clearError: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('Token'),
  username: localStorage.getItem('Username'),
  isLoading: false,
  error: null,

  // login action
  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await api.post('/login/', { email, password })
      //  response.data = { user: {id, username, email}, token }
      const { user, token } = response.data as { user: User; token: string }

      // store  state & localStorage
      localStorage.setItem('Token', token)
      localStorage.setItem('Username', user.username)
      set({
        token,
        username: user.username,
        isLoading: false,
        error: null,
      })
    } catch (err: any) {
      let msg = 'Login failed'
      if (err.response && err.response.data) {
        msg =
          typeof err.response.data.detail === 'string'
            ? err.response.data.detail
            : 'Login failed'
      }
      set({
        token: null,
        username: null,
        isLoading: false,
        error: msg,
      })
      localStorage.removeItem('Token')
      localStorage.removeItem('Username')
    }
  },

  // logout action
  logout: async () => {
    set({ isLoading: true, error: null })
    try {
      await api.post('/logout/', {})
    } catch {
      // Αν το logout API αποτύχει, clean το local state
    } finally {
      localStorage.removeItem('Token')
      localStorage.removeItem('Username')
      set({
        token: null,
        username: null,
        isLoading: false,
        error: null,
      })
    }
  },

  clearError: () => set({ error: null }),
}))
    