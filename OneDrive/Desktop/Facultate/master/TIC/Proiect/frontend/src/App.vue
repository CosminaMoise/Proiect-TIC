// src/App.vue
<template>
  <nav class="navbar">
    <router-link to="/">Home</router-link>
    <router-link to="/books">Books</router-link>
    <router-link v-if="!user" to="/login">Login</router-link>
    <button v-else @click="logout">Logout</button>
  </nav>
  
  <router-view></router-view>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const user = computed(() => store.state.user)

const logout = async () => {
  // Implement logout logic
}
</script>

<style>
.navbar {
  padding: 1rem;
  display: flex;
  gap: 1rem;
}

@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
  }
}
</style>