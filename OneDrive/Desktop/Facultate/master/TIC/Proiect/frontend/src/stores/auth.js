import { createStore } from 'vuex'
import axios from 'axios'
import { auth } from '..//firebaseConfig.js'
import { signInWithCustomToken } from 'firebase/auth'

const API_URL = 'http://localhost:3000/api/auth'

export const store = createStore({
  state: {
    user: JSON.parse(localStorage.getItem('user')) || null,
    loading: false,
    error: null,
  },

  mutations: {
    SET_USER(state, user) {
      state.user = user
      state.isAuthenticated = !!user
      if (user) {
        localStorage.setItem('user', JSON.stringify(user))
      } else {
        localStorage.removeItem('user')
      }
    },

    SET_LOADING(state, loading) {
      state.loading = loading
    },

    SET_ERROR(state, error) {
      state.error = error
    },

    CLEAR_ERROR(state) {
      state.error = null
    },
  },

  actions: {
    async register({ commit }, { email, password, fullName }) {
      try {
        commit('SET_LOADING', true)
        commit('CLEAR_ERROR')

        const response = await axios.post(`${API_URL}/register`, {
          email,
          password,
          fullName,
        })

        return { success: true }
      } catch (error) {
        const errorMessage = error.response?.data?.error || 'Registration failed'
        commit('SET_ERROR', errorMessage)
        return { success: false, error: errorMessage }
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async login({ commit }, { email, password }) {
      try {
        commit('SET_LOADING', true)
        commit('CLEAR_ERROR')

        const response = await axios.post(`${API_URL}/login`, {
          email,
          password,
        })

        if (response.data.success) {
          const userData = response.data.data
          try {
            const userCredential = await signInWithCustomToken(auth, userData.token)
            const idToken = await userCredential.user.getIdToken()

            commit('SET_USER', {
              ...userData,
              token: idToken,
            })
            return { success: true }
          } catch (firebaseError) {
            console.error('Firebase auth error:', firebaseError)
            throw new Error('Failed to authenticate with Firebase')
          }
        } else {
          throw new Error(response.data.error || 'Login failed')
        }
      } catch (error) {
        console.error('Login error:', error)
        const errorMessage = error.response?.data?.error || error.message || 'Login failed'
        commit('SET_ERROR', errorMessage)
        return { success: false, error: errorMessage }
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async logout({ commit }) {
      try {
        commit('SET_LOADING', true)

        await axios.post(`${API_URL}/logout`)

        commit('SET_USER', null)
        return { success: true }
      } catch (error) {
        commit('SET_ERROR', 'Logout failed')
        return { success: false, error: 'Logout failed' }
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async getCurrentUser({ commit }) {
      try {
        const response = await axios.get(`${API_URL}/current`)
        commit('SET_USER', response.data)
        return { success: true }
      } catch (error) {
        commit('SET_USER', null)
        return { success: false }
      }
    },
    clearError({ commit }) {
      commit('CLEAR_ERROR')
    },
  },

  getters: {
    isAuthenticated: (state) => state.isAuthenticated,
    currentUser: (state) => state.user,
    loading: (state) => state.loading,
    error: (state) => state.error,
  },
})

axios.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'))
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  return config
})

export default store
