import { createStore } from 'vuex'
import axios from 'axios'

const API_URL = 'http://localhost:5173/api/auth'

export const store = createStore({
  state: {
    user: JSON.parse(localStorage.getItem('user')) || null,
    loading: false,
    error: null,
    isAuthenticated: false,
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

        commit('SET_USER', response.data)
        return { success: true }
      } catch (error) {
        const errorMessage = error.response?.data?.error || 'Login failed'
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
