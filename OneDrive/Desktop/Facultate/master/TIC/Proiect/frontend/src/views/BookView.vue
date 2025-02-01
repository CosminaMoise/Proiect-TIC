<template>
  <div class="books-container">
    <div class="books-header">
      <h1>My Library</h1>
      <button class="btn btn-primary" @click="logout">Logout</button>
    </div>
    <div class="books-content">
      <p>Welcome to your library!</p>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  setup() {
    const store = useStore()
    const router = useRouter()

    const logout = async () => {
      await store.dispatch('logout')
      router.push('/login')
    }

    return {
      logout,
    }
  },
}
</script>

<style scoped>
.books-container {
  padding: 20px;
}

.books-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.books-header h1 {
  color: var(--text-color);
}

.books-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
</style>
