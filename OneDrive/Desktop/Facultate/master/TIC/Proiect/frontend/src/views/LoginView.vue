<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
          <div>
              <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
                  Sign in to your account
              </h2>
          </div>
          
          <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
              <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {{ error }}
              </div>
              
              <div class="rounded-md shadow-sm space-y-4">
                  <div>
                      <label for="email" class="sr-only">Email address</label>
                      <input
                          id="email"
                          v-model="email"
                          type="email"
                          required
                          class="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300"
                          placeholder="Email address"
                      >
                  </div>
                  <div>
                      <label for="password" class="sr-only">Password</label>
                      <input
                          id="password"
                          v-model="password"
                          type="password"
                          required
                          class="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300"
                          placeholder="Password"
                      >
                  </div>
              </div>

              <div>
                  <button
                      type="submit"
                      :disabled="loading"
                      class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                      <span v-if="loading">Signing in...</span>
                      <span v-else>Sign in</span>
                  </button>
              </div>
          </form>
      </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

const handleLogin = async () => {
  try {
      loading.value = true;
      error.value = '';

      // Firebase Authentication
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(
          auth, 
          email.value, 
          password.value
      );

      // Get the ID token
      const idToken = await userCredential.user.getIdToken();

      // Send token to backend
      const response = await axios.post('http://localhost:1234/api/login', {
          idToken
      });

      // Store user data
      authStore.setUser(response.data);
      
      // Navigate to dashboard or home
      router.push('/dashboard');
  } catch (err) {
      error.value = err.message;
  } finally {
      loading.value = false;
  }
};
</script>