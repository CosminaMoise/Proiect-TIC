<template>
  <div class="register-container">
    <div class="register-box">
      <h2>Create a new account</h2>
      <p class="redirect-text">
        Or
        <router-link to="/login">sign in to your account</router-link>
      </p>

      <form @submit.prevent="handleSubmit">
        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <div class="form-group">
          <label for="fullName">Full name</label>
          <input
            v-model="fullName"
            id="fullName"
            type="text"
            required
            placeholder="Enter your full name"
          >
        </div>

        <div class="form-group">
          <label for="email">Email address</label>
          <input
            v-model="email"
            id="email"
            type="email"
            required
            placeholder="Enter your email"
          >
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            v-model="password"
            id="password"
            type="password"
            required
            placeholder="Enter your password"
          >
        </div>

        <button type="submit" :disabled="loading">
          {{ loading ? 'Loading...' : 'Create account' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  setup() {
    const store = useStore()
    const router = useRouter()
    
    const email = ref('')
    const password = ref('')
    const fullName = ref('')
    
    const loading = computed(() => store.getters.loading)
    const error = computed(() => store.getters.error)

    const handleSubmit = async () => {
      const success = await store.dispatch('register', {
        email: email.value,
        password: password.value,
        fullName: fullName.value
      })

      if (success) {
        router.push('/login')
      }
    }

    return {
      email,
      password,
      fullName,
      loading,
      error,
      handleSubmit
    }
  }
}
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  padding: 20px;
}

.register-box {
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 10px;
  font-size: 24px;
}

.redirect-text {
  text-align: center;
  margin-bottom: 30px;
  color: #666;
}

.redirect-text a {
  color: #4a90e2;
  text-decoration: none;
}

.redirect-text a:hover {
  text-decoration: underline;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.3s;
}

input:focus {
  outline: none;
  border-color: #4a90e2;
  box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
}

button {
  width: 100%;
  padding: 12px;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #357abd;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.error-message {
  background-color: #fee;
  color: #e44;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 20px;
  text-align: center;
}

@media (max-width: 480px) {
  .register-box {
    padding: 20px;
  }

  input, button {
    padding: 10px;
  }
}
</style>