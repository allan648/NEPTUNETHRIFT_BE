<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2' // Rekomendasi untuk alert yang cantik

// Icons
import ArrowRight from '@/components/icons/ArrowRight.vue'
import TrashCan from '@/components/icons/TrashCan.vue'
import Search from '@/components/icons/Search.vue'
import Edit from '@/components/icons/Edit.vue'
import Plus from '@/components/icons/Plus.vue'

// Import Modal Components
import CreateCategory from '@/pages/admin/categories/CreateCategoryModal.vue'
import EditCategoryModal from '@/pages/admin/categories/EditCategoryModal.vue'

// --- CONFIG ---
const API_URL = "http://localhost:3000/api/admin/categories"
axios.defaults.withCredentials = true 

// --- STATE ---
const categories = ref([])
const searchQuery = ref("")
const isLoading = ref(false)
const showCreateModal = ref(false)
const showEditModal = ref(false)
const selectedCategory = ref(null)

// --- FETCH DATA (Read) ---
const fetchCategories = async () => {
  isLoading.value = true
  try {
    const response = await axios.get(API_URL)
    categories.value = response.data
  } catch (error) {
    console.error("Gagal memuat kategori:", error)
  } finally {
    isLoading.value = false
  }
}

// --- LOGIC SEARCH (Client Side) ---
const filteredCategories = computed(() => {
  return categories.value.filter(cat => 
    cat.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

// --- LOGIC CREATE ---
const handleNewCategory = async (name) => {
  try {
    await axios.post(API_URL, { name })
    Swal.fire('Berhasil', 'Kategori ditambahkan', 'success')
    fetchCategories() // Refresh data
    showCreateModal.value = false
  } catch (error) {
    Swal.fire('Gagal', 'Gagal menambah kategori', 'error')
  }
}

// --- LOGIC EDIT ---
const openEditModal = (category) => {
  selectedCategory.value = { ...category }
  showEditModal.value = true
}

const handleUpdateCategory = async (updatedCategory) => {
  try {
    await axios.put(`${API_URL}/${updatedCategory.id}`, { name: updatedCategory.name })
    Swal.fire('Berhasil', 'Kategori diperbarui', 'success')
    fetchCategories()
    showEditModal.value = false
  } catch (error) {
    Swal.fire('Gagal', 'Gagal update data', 'error')
  }
}

// --- LOGIC DELETE ---
const deleteCategory = async (id, name) => {
  const result = await Swal.fire({
    title: `Hapus ${name}?`,
    text: "Tindakan ini tidak dapat dibatalkan!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    confirmButtonText: 'Ya, Hapus!'
  })

  if (result.isConfirmed) {
    try {
      await axios.delete(`${API_URL}/${id}`)
      Swal.fire('Terhapus!', 'Kategori berhasil dihapus.', 'success')
      fetchCategories()
    } catch (error) {
      Swal.fire('Gagal!', 'Kategori ini mungkin sedang digunakan oleh produk.', 'error')
    }
  }
}

// Load data saat komponen dipasang
onMounted(() => {
  fetchCategories()
})
</script>
<template>
  <div class="space-y-6">
    <div class="flex justify-between gap-3 flex-wrap">
      <h1 class="text-3xl font-semibold">Categories</h1>
    </div>

    <div class="flex flex-col rounded-3xl border border-gray-300 bg-white shadow-sm">
      <div class="flex flex-col p-4">
        <div class="flex justify-between sm:items-center flex-col sm:flex-row gap-4">
          <div class="border border-gray-300 gap-2 px-2.5 order-2 sm:order-1 py-2 flex items-center w-full sm:w-1/2 rounded-full">
            <Search class="size-6 text-gray-400" />
            <input
              v-model="searchQuery"
              type="text"
              class="w-full text-xs md:text-sm focus:outline-none bg-transparent"
              placeholder="Search category name..."
            />
          </div>

          <button
            @click="showCreateModal = true"
            class="whitespace-nowrap flex px-6 py-2.5 hover:bg-blue-600 text-sm gap-2 items-center justify-center font-medium bg-blue-700 rounded-full text-white transition-all"
          >
            <Plus class="size-5" /> New Category
          </button>
        </div>

        <div class="mt-4 overflow-hidden border border-gray-300 rounded-2xl">
          <div class="max-w-full overflow-x-auto">
            <table class="min-w-180 w-full">
              <thead class="bg-blue-700 text-xs text-white">
                <tr>
                  <th class="p-4 text-start font-semibold w-12 text-center">NO</th>
                  <th class="p-4 text-start font-semibold">NAME</th>
                  <th class="p-4 text-start font-semibold text-center">ACTION</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="isLoading">
                    <td colspan="3" class="p-8 text-center text-gray-500">Loading data...</td>
                </tr>
                <tr
                  v-for="(category, index) in filteredCategories"
                  :key="category.id"
                  class="text-sm text-gray-900 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td class="p-4 text-center">{{ index + 1 }}</td>
                  <td class="p-4 font-semibold uppercase tracking-wide">{{ category.name }}</td>
                  <td class="p-4 flex gap-3 justify-center">
                    <button @click="openEditModal(category)" class="p-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-white shadow-sm">
                      <Edit class="size-5" />
                    </button>
                    <button @click="deleteCategory(category.id, category.name)" class="p-2 rounded-lg bg-red-600 hover:bg-red-700 text-white shadow-sm">
                      <TrashCan class="size-5" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div v-if="filteredCategories.length === 0 && !isLoading" class="text-center py-12 text-gray-500 italic">
          No categories found.
        </div>
      </div>
    </div>

    <CreateCategory :show="showCreateModal" @close="showCreateModal = false" @create="handleNewCategory" />
    <EditCategoryModal :show="showEditModal" :categoryData="selectedCategory" @close="showEditModal = false" @submit="handleUpdateCategory" />
  </div>
</template>

<style scoped>
button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}
</style>
