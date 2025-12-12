<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import ArrowRight from '@/components/icons/ArrowRight.vue'
import Show from '@/components/icons/Show.vue'
import TrashCan from '@/components/icons/TrashCan.vue'
import Search from '@/components/icons/Search.vue'
import Edit from '@/components/icons/Edit.vue'
import Plus from '@/components/icons/Plus.vue'

// --- SETUP API ---
const API_URL = "http://localhost:3000/api"
axios.defaults.withCredentials = true

// --- STATE ---
const users = ref([])
const isLoading = ref(false)
const searchQuery = ref("") // Untuk fitur search nanti

// --- FUNCTIONS ---

// 1. Fetch Data dari Database
const fetchUsers = async () => {
  isLoading.value = true
  try {
    const response = await axios.get(`${API_URL}/admin/users`)
    users.value = response.data
  } catch (error) {
    console.error("Gagal ambil data users:", error)
    alert("Gagal memuat data user.")
  } finally {
    isLoading.value = false
  }
}

// 2. Soft Delete (Nonaktifkan User)
const softDeleteUser = async (id, username) => {
  const confirmDelete = confirm(`Apakah Anda yakin ingin menghapus user ${username}?`)
  if (!confirmDelete) return

  try {
    await axios.put(`${API_URL}/admin/users/${id}/deactivate`)
    
    alert("User berhasil dihapus (dinonaktifkan).")
    // Refresh data tanpa reload halaman
    fetchUsers() 
  } catch (error) {
    console.error("Gagal delete:", error)
    alert("Terjadi kesalahan saat menghapus user.")
  }
}

// Load data saat halaman dibuka
onMounted(() => {
  fetchUsers()
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-between gap-3 flex-wrap">
      <h1 class="text-3xl font-semibold">Account Management</h1>
    </div>

    <div class="flex flex-col rounded-3xl border border-gray-300 bg-white shadow-sm">
      <div class="flex flex-col p-4">
        
        <div class="flex justify-between sm:items-center flex-col sm:flex-row gap-4">
          <div
            class="border border-gray-300 gap-2 px-2.5 order-2 sm:order-1 py-2 flex items-center w-full sm:w-1/2 rounded-full"
          >
            <Search class="size-6 text-gray-400" />
            <input
              v-model="searchQuery"
              type="text"
              class="w-full text-xs md:text-sm focus:outline-none bg-transparent"
              placeholder="Search by username or email..."
            />
          </div>

          <router-link
            :to="{ name: 'Createadmin' }"
            class="whitespace-nowrap flex px-4.5 order-1 sm:order-2 py-2.5 cursor-pointer w-fit hover:bg-blue-600 text-sm gap-2 items-center justify-center font-medium bg-blue-700 rounded-full text-white transition-all"
          >
            <Plus class="size-5" /> New User
          </router-link>
        </div>

        <div class="mt-4 overflow-hidden border border-gray-300 rounded-2xl">
          <div class="max-w-full overflow-x-auto">
            <table class="min-w-180 w-full">
              <thead class="bg-blue-700 text-xs text-white">
                <tr>
                  <th class="p-4 text-start font-semibold w-12">NO</th>
                  <th class="p-4 text-start font-semibold">USERNAME</th>
                  <th class="p-4 text-start font-semibold">EMAIL</th>
                  <th class="p-4 text-start font-semibold">PHONE</th>
                  <th class="p-4 text-start font-semibold">ROLE</th>
                  <th class="p-4 text-start font-semibold">ACTION</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                
                <tr v-if="isLoading">
                  <td colspan="6" class="p-8 text-center text-gray-500">
                    Loading data...
                  </td>
                </tr>

                <tr v-else-if="users.length === 0">
                  <td colspan="6" class="p-8 text-center text-gray-500">
                    Belum ada data user.
                  </td>
                </tr>

                <tr
                  v-for="(user, index) in users"
                  :key="user.id"
                  class="text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <td class="p-4 text-gray-900">{{ index + 1 }}</td>
                  
                  <td class="p-4 text-gray-900 font-semibold flex items-center gap-2">
                    <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 uppercase">
                      {{ (user.username || 'User').substring(0,2) }}
                    </div>
                    
                    {{ user.username || 'No Name' }}
                  </td>
                  
                  <td class="p-4">{{ user.email }}</td>
                  <td class="p-4">{{ user.phone || '-' }}</td>
                  
                  <td class="p-4">
                    <span 
                      class="px-2 py-1 rounded-full text-xs font-bold"
                      :class="user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'"
                    >
                      {{ user.role ? user.role.toUpperCase() : '-' }}
                    </span>
                  </td>

                  <td class="p-4 flex gap-2">
                    <router-link
                      :to="{ name: 'Editadmin', params: { id: user.id } }" 
                      title="Edit"
                      class="flex items-center justify-center p-2 rounded-md bg-yellow-400 hover:bg-yellow-500 transition-colors shadow-sm"
                    >
                      <Edit class="size-4 text-white" />
                    </router-link>

                    <router-link
                      :to="{ name: 'Detailaccount', params: { id: user.id } }"
                      title="Detail"
                      class="flex items-center justify-center p-2 rounded-md bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm"
                    >
                      <Show class="size-4 text-white" />
                    </router-link>
                    
                    <button
                      @click="softDeleteUser(user.id, user.username)"
                      title="Delete"
                      class="flex items-center justify-center p-2 rounded-md bg-red-600 hover:bg-red-700 transition-colors shadow-sm"
                    >
                      <TrashCan class="size-4 text-white" />
                    </button>
                  </td>
                </tr>

              </tbody>
            </table>
          </div>
        </div>

        <div class="flex justify-between items-center gap-3 flex-wrap mt-4 px-2">
          <div class="text-sm text-gray-600">
            Total Users: <span class="font-medium">{{ users.length }}</span>
          </div>
          </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}
</style>