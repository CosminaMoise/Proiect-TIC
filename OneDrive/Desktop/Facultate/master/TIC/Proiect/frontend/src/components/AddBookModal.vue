<template>
  <div v-if="show" class="modal-overlay">
    <div class="modal-content">
      <div class="modal-header">
        <h2>Add New Book</h2>
        <button class="close-button" @click="closeModal">&times;</button>
      </div>

      <form @submit.prevent="handleSubmit" class="add-book-form">
        <div class="form-group">
          <label for="title">Title:</label>
          <input v-model="formData.title" id="title" type="text" required />
        </div>

        <div class="form-group">
          <label for="author">Author:</label>
          <input v-model="formData.author" id="author" type="text" required />
        </div>

        <div class="form-group">
          <label for="publisher">Publisher:</label>
          <input v-model="formData.publisher" id="publisher" type="text" required />
        </div>

        <div class="form-row">
          <div class="form-group half">
            <label for="publishYear">Publish Year:</label>
            <input
              v-model="formData.publishYear"
              id="publishYear"
              type="number"
              required
              min="1000"
              :max="currentYear"
            />
          </div>

          <div class="form-group half">
            <label for="publishLocation">Publish Location:</label>
            <input v-model="formData.publishLocation" id="publishLocation" type="text" required />
          </div>
        </div>

        <div class="form-group">
          <label for="description">Description:</label>
          <textarea v-model="formData.description" id="description" rows="4" required></textarea>
        </div>

        <div class="form-group">
          <label for="imageUrl">Image URL (optional):</label>
          <input v-model="formData.imageUrl" id="imageUrl" type="url" />
        </div>

        <div class="error-message" v-if="error">
          {{ error }}
        </div>

        <div class="form-actions">
          <button type="button" class="btn btn-secondary" @click="closeModal">Cancel</button>
          <button type="submit" class="btn btn-primary" :disabled="loading">
            {{ loading ? 'Adding Book...' : 'Add Book' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useStore } from 'vuex'
import axios from 'axios'

export default {
  props: {
    show: Boolean,
  },

  emits: ['close', 'book-added'],

  setup(props, { emit }) {
    const store = useStore()
    const currentYear = new Date().getFullYear()
    const loading = ref(false)
    const error = ref('')
    const formData = ref({
      title: '',
      author: '',
      publisher: '',
      publishYear: currentYear,
      publishLocation: '',
      description: '',
      imageUrl: '',
    })

    const closeModal = () => {
      formData.value = {
        title: '',
        author: '',
        publisher: '',
        publishYear: currentYear,
        publishLocation: '',
        description: '',
        imageUrl: '',
      }
      error.value = ''
      emit('close')
    }

    const handleSubmit = async () => {
      try {
        loading.value = true
        error.value = ''

        console.log('Current token:', store.getters.currentUser?.token)

        const response = await axios.post(
          'http://localhost:3000/api/books/create',
          formData.value,
          {
            headers: {
              Authorization: `Bearer ${store.getters.currentUser?.token}`,
            },
          },
        )

        emit('book-added', response.data.data)
        closeModal()
      } catch (err) {
        error.value = err.response?.data?.error || 'Failed to add book'
      } finally {
        loading.value = false
      }
    }

    return {
      formData,
      loading,
      error,
      currentYear,
      closeModal,
      handleSubmit,
    }
  },
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
}

.add-book-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.form-row {
  display: flex;
  gap: 15px;
}

.form-group.half {
  width: 50%;
}

label {
  font-weight: 500;
  color: #333;
}

input,
textarea {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

input:focus,
textarea:focus {
  outline: none;
  border-color: #4a90e2;
  box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
}

textarea {
  resize: vertical;
  min-height: 100px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.error-message {
  background-color: #fee;
  color: #e44;
  padding: 10px;
  border-radius: 4px;
  font-size: 14px;
}

.btn {
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  border: none;
}

.btn-primary {
  background-color: #4a90e2;
  color: white;
}

.btn-primary:hover {
  background-color: #357abd;
}

.btn-primary:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: #f0f0f0;
  color: #333;
}

.btn-secondary:hover {
  background-color: #e4e4e4;
}
</style>
