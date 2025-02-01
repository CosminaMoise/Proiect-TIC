<template>
  <div v-if="show" class="modal-overlay">
    <div class="modal-content">
      <h2>Edit Book</h2>

      <form @submit.prevent="handleSubmit" class="edit-form">
        <div class="form-group">
          <label>Title:</label>
          <input v-model="formData.title" type="text" required />
        </div>

        <div class="form-group">
          <label>Author:</label>
          <input v-model="formData.author" type="text" required />
        </div>

        <div class="form-group">
          <label>Publisher:</label>
          <input v-model="formData.publisher" type="text" required />
        </div>

        <div class="form-group">
          <label>Publish Year:</label>
          <input v-model="formData.publishYear" type="number" required />
        </div>

        <div class="form-group">
          <label>Publish Location:</label>
          <input v-model="formData.publishLocation" type="text" required />
        </div>

        <div class="form-group">
          <label>Description:</label>
          <textarea v-model="formData.description" rows="4" required></textarea>
        </div>

        <div class="form-group">
          <label>Image URL:</label>
          <input v-model="formData.imageUrl" type="url" />
        </div>

        <div class="modal-actions">
          <button type="button" class="btn btn-secondary" @click="closeModal">Cancel</button>
          <button type="submit" class="btn btn-primary" :disabled="loading">
            {{ loading ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </form>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script>
import { ref, defineProps, defineEmits } from 'vue'
import axios from 'axios'

export default {
  props: {
    show: Boolean,
    book: Object,
  },

  emits: ['close', 'book-updated'],

  setup(props, { emit }) {
    const loading = ref(false)
    const error = ref('')
    const formData = ref({ ...props.book })

    const closeModal = () => {
      emit('close')
    }

    const handleSubmit = async () => {
      try {
        loading.value = true
        error.value = ''

        const response = await axios.put(
          `http://localhost:1234/api/books/${props.book.id}`,
          formData.value,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          },
        )

        emit('book-updated', response.data.data)
        closeModal()
      } catch (err) {
        error.value = err.response?.data?.error || 'Failed to update book'
      } finally {
        loading.value = false
      }
    }

    return {
      formData,
      loading,
      error,
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
  padding: 30px;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.form-group label {
  font-weight: bold;
  color: #333;
}

.form-group input,
.form-group textarea {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.error-message {
  margin-top: 15px;
  padding: 10px;
  background-color: #fee;
  color: #e44;
  border-radius: 4px;
}
</style>
