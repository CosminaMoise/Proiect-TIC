<template>
  <div v-if="show" class="modal-overlay">
    <div class="modal-content">
      <h2>Edit Book</h2>

      <form @submit.prevent="handleSubmit" class="edit-form">
        <div class="form-group">
          <label>Title:</label>
          <input v-model="formData.title" type="text" :placeholder="book.title" />
        </div>

        <div class="form-group">
          <label>Author:</label>
          <input v-model="formData.author" type="text" :placeholder="book.author" />
        </div>

        <div class="form-group">
          <label>Publisher:</label>
          <input v-model="formData.publisher" type="text" :placeholder="book.publisher" />
        </div>

        <div class="form-group">
          <label>Publish Year:</label>
          <input v-model="formData.publishYear" type="number" :placeholder="book.publishYear" />
        </div>

        <div class="form-group">
          <label>Publish Location:</label>
          <input
            v-model="formData.publishLocation"
            type="text"
            :placeholder="book.publishLocation"
          />
        </div>

        <div class="form-group">
          <label>Description:</label>
          <textarea
            v-model="formData.description"
            rows="4"
            :placeholder="book.description"
          ></textarea>
        </div>

        <div class="form-group">
          <label>Image URL:</label>
          <input
            v-model="formData.imageUrl"
            type="url"
            :placeholder="book.imageUrl || 'Enter image URL'"
          />
        </div>

        <div class="modal-actions">
          <button type="button" class="btn btn-secondary" @click="closeModal">Cancel</button>
          <button type="submit" class="btn btn-primary" :disabled="loading || !hasChanges">
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
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import axios from 'axios'

export default {
  props: {
    show: Boolean,
    book: Object,
  },

  emits: ['close', 'book-updated'],

  setup(props, { emit }) {
    const store = useStore()
    const loading = ref(false)
    const error = ref('')
    const formData = ref({})

    watch(
      () => props.show,
      (newVal) => {
        if (newVal) {
          formData.value = {}
        }
      },
    )

    const hasChanges = computed(() => {
      return Object.keys(formData.value).some((key) => {
        return (
          formData.value[key] !== undefined &&
          formData.value[key] !== null &&
          formData.value[key] !== '' &&
          formData.value[key] !== props.book[key]
        )
      })
    })

    const closeModal = () => {
      formData.value = {}
      error.value = ''
      emit('close')
    }

    const handleSubmit = async () => {
      try {
        if (!hasChanges.value) {
          return
        }
        loading.value = true
        error.value = ''

        const changedData = Object.keys(formData.value).reduce((acc, key) => {
          if (
            formData.value[key] !== undefined &&
            formData.value[key] !== null &&
            formData.value[key] !== '' &&
            formData.value[key] !== props.book[key]
          ) {
            acc[key] = formData.value[key]
          }
          return acc
        }, {})

        const response = await axios.put(
          `http://localhost:3000/api/books/${props.book.id}`,
          changedData,
          {
            headers: {
              Authorization: `Bearer ${store.getters.currentUser?.token}`,
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
      hasChanges,
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
