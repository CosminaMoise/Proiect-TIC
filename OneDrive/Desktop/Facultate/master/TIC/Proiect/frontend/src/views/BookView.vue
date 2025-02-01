<template>
  <div class="books-container">
    <div class="books-header">
      <div class="header-left">
        <h1>Library Books</h1>
      </div>
      <div class="header-right">
        <button @click="openAddModal" class="btn btn-add">Add New Book</button>
        <button @click="logout" class="btn btn-logout">Logout</button>
      </div>
    </div>
    <div class="books-container">
      <div class="books-header">
        <h1>Library Books</h1>
        <div class="user-controls">
          <span class="welcome-text">Welcome, {{ currentUser?.fullName }}</span>
          <button class="btn btn-primary" @click="logout">Logout</button>
        </div>
      </div>

      <div v-if="loading" class="loading-state">Loading books...</div>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <div v-if="books.length" class="books-grid">
        <div v-for="book in books" :key="book.id" class="book-card">
          <div class="book-image">
            <img :src="book.imageUrl || '/default-book.jpg'" :alt="book.title" />
          </div>
          <div class="book-info">
            <h3>{{ book.title }}</h3>
            <p class="book-author">by {{ book.author }}</p>
            <p class="book-details">
              Published: {{ book.publishYear }}<br />
              Publisher: {{ book.publisher }}<br />
              Location: {{ book.publishLocation }}
            </p>
            <p class="book-description">{{ book.description }}</p>
            <div class="book-uploader">
              <span class="uploader-label">Added by:</span>
              <span class="uploader-name">{{ book.metadata?.createdBy || 'Unknown' }}</span>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="!loading" class="empty-state">No books found in the library.</div>
    </div>
    <div v-for="book in books" :key="book.id" class="book-card">
      <div class="book-image">
        <img :src="book.imageUrl || '/default-book.jpg'" :alt="book.title" />
      </div>
      <div class="book-info">
        <h3>{{ book.title }}</h3>
        <p class="book-author">by {{ book.author }}</p>
        <p class="book-details">
          Published: {{ book.publishYear }}<br />
          Publisher: {{ book.publisher }}<br />
          Location: {{ book.publishLocation }}
        </p>
        <p class="book-description">{{ book.description }}</p>
        <div class="book-uploader">
          <span class="uploader-label">Added by:</span>
          <span class="uploader-name">{{ book.metadata?.createdBy || 'Unknown' }}</span>
        </div>

        <button @click="openEditModal(book)" class="btn btn-edit">Edit Book</button>

        <button
          v-if="book.metadata?.createdBy === currentUser?.uid"
          @click="deleteBook(book.id)"
          class="btn btn-delete"
        >
          Delete Book
        </button>
      </div>
    </div>
    <EditBookModal
      :show="showEditModal"
      :book="selectedBook"
      @close="closeEditModal"
      @book-updated="handleBookUpdated"
    />
    <AddBookModal :show="showAddModal" @close="closeAddModal" @book-added="handleBookAdded" />
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import axios from 'axios'
import EditModel from '../components/EditBookModel.js'
import AddBookModal from '../components/AddBookModal.vue'

export default {
  components: {
    EditBookModal,
    AddBookModal,
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    const books = ref([])
    const loading = ref(true)
    const error = ref(null)

    const currentUser = computed(() => store.getters.currentUser)

    const fetchBooks = async () => {
      try {
        loading.value = true
        error.value = null

        const response = await axios.get('http://localhost:1234/api/books', {
          headers: {
            Authorization: `Bearer ${currentUser.value?.token}`,
          },
        })

        books.value = response.data.data
      } catch (err) {
        error.value = 'Failed to load books: ' + (err.response?.data?.error || err.message)
      } finally {
        loading.value = false
      }
    }

    const logout = async () => {
      await store.dispatch('logout')
      router.push('/login')
    }

    onMounted(fetchBooks)

    const deleteBook = async (bookId) => {
      try {
        if (!confirm('Are you sure you want to delete this book?')) {
          return
        }

        loading.value = true

        await axios.delete(`http://localhost:1234/api/books/${bookId}`, {
          headers: {
            Authorization: `Bearer ${currentUser.value?.token}`,
          },
        })

        await fetchBooks()
      } catch (err) {
        error.value = 'Failed to delete book: ' + (err.response?.data?.error || err.message)
      } finally {
        loading.value = false
      }
    }

    const openEditModal = (book) => {
      selectedBook.value = book
      showEditModal.value = true
    }

    const closeEditModal = () => {
      showEditModal.value = false
      selectedBook.value = null
    }

    const handleBookUpdated = (updatedBook) => {
      const index = books.value.findIndex((b) => b.id === updatedBook.id)
      if (index !== -1) {
        books.value[index] = updatedBook
      }
      closeEditModal()
    }
    const showAddModal = ref(false)

    const openAddModal = () => {
      showAddModal.value = true
    }

    const closeAddModal = () => {
      showAddModal.value = false
    }

    const handleBookAdded = (newBook) => {
      books.value.unshift(newBook) 
    }

    return {
      books,
      loading,
      error,
      currentUser,
      logout,
      showEditModal,
      selectedBook,
      openEditModal,
      closeEditModal,
      handleBookUpdated,
      showAddModal,
      openAddModal,
      closeAddModal,
      handleBookAdded,
    }
  },
}
</script>

<style scoped>
.books-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.books-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.user-controls {
  display: flex;
  align-items: center;
  gap: 20px;
}

.welcome-text {
  font-size: 16px;
  color: #666;
}

.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px 0;
}

.book-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s;
}

.book-card:hover {
  transform: translateY(-5px);
}

.book-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.book-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.book-info {
  padding: 20px;
}

.book-info h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.book-author {
  color: #666;
  font-style: italic;
  margin: 5px 0;
}

.book-details {
  font-size: 14px;
  color: #666;
  margin: 10px 0;
  line-height: 1.4;
}

.book-description {
  font-size: 14px;
  color: #444;
  margin: 10px 0;
  line-height: 1.5;
}

.book-uploader {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #eee;
  font-size: 14px;
}

.uploader-label {
  color: #666;
}

.uploader-name {
  font-weight: bold;
  color: #333;
}

.loading-state {
  text-align: center;
  padding: 40px;
  color: #666;
}

.error-message {
  background-color: #fee;
  color: #e44;
  padding: 15px;
  border-radius: 8px;
  margin: 20px 0;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #666;
  background: white;
  border-radius: 8px;
  margin: 20px 0;
}

@media (max-width: 768px) {
  .books-header {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
    text-align: center;
  }

  .user-controls {
    flex-direction: column;
  }

  .books-grid {
    grid-template-columns: 1fr;
  }
}

.btn-delete {
  margin-top: 15px;
  background-color: #dc3545;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-delete:hover {
  background-color: #c82333;
}

.btn-delete:disabled {
  background-color: #e9a1a8;
  cursor: not-allowed;
}

.book-actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #eee;
}

.btn-edit {
  background-color: #ffc107;
  color: #000;
}

.btn-edit:hover {
  background-color: #e0a800;
}

.books-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.header-right {
  display: flex;
  gap: 15px;
}

.btn-add {
  background-color: #4caf50;
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-add:hover {
  background-color: #45a049;
}

.btn-logout {
  background-color: #f44336;
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
}

.btn-logout:hover {
  background-color: #da190b;
}
</style>
