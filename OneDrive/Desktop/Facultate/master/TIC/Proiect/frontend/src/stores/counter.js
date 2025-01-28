// src/store/index.js
import { createStore } from 'vuex'

export default createStore({
  state: {
    user: null,
    books: [],
    isLoading: false
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user
    },
    SET_BOOKS(state, books) {
      state.books = books
    },
    SET_LOADING(state, status) {
      state.isLoading = status
    }
  },
  actions: {
    async fetchBooks({ commit }) {
      commit('SET_LOADING', true)
      try {
        // Firebase fetch logic here
        commit('SET_BOOKS', books)
      } catch (error) {
        console.error(error)
      } finally {
        commit('SET_LOADING', false)
      }
    }
  }
})