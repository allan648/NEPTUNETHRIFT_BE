<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
// Icons
import Show from '@/components/icons/Show.vue'
import TrashCan from '@/components/icons/TrashCan.vue'
import Search from '@/components/icons/Search.vue'
import Edit from '@/components/icons/Edit.vue'
import Plus from '@/components/icons/Plus.vue'
import Refresh from '@/components/icons/Refresh.vue' // Icon baru untuk restore (bisa pakai icon lain jika belum ada)
// --- SETUP API ---
const API_URL = "http://localhost:3000/api"
axios.defaults.withCredentials = true

// --- STATE ---
const users = ref([])
const isLoading = ref(false)
const searchQuery = ref("") 
const currentUserId = ref(null)

// --- FUNCTIONS ---

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

const fetchCurrentAdmin = async () => {
  try {
    // Kita pakai endpoint status yang sudah ada
    const response = await axios.get(`${API_URL}/auth/status`)
    if (response.data.isAuthenticated) {
      currentUserId.value = response.data.userId // Simpan ID admin yang sedang login
    }
  } catch (error) {
    console.error("Gagal cek user login:", error)
  }
}

// Logic Pintar: Toggle Status (Matikan / Hidupkan)
const toggleUserStatus = async (user) => {
  const isActive = user.is_active === 1 || user.is_active === true;
  const action = isActive ? "menonaktifkan" : "mengaktifkan kembali";
  
  const confirmAction = confirm(`Apakah Anda yakin ingin ${action} user ${user.username}?`);
  if (!confirmAction) return;

  try {
    if (isActive) {
      // Jika Aktif -> Matikan (Deactivate)
      await axios.put(`${API_URL}/admin/users/${user.id}/deactivate`);
    } else {
      // Jika Mati -> Hidupkan (Activate)
      await axios.put(`${API_URL}/admin/users/${user.id}/activate`);
    }
    
    // Refresh data otomatis
    fetchUsers();
    
  } catch (error) {
    console.error("Gagal update status:", error);
    alert("Terjadi kesalahan sistem.");
  }
}

onMounted(() => {
  fetchUsers()
  fetchCurrentAdmin()
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
          <div class="border border-gray-300 gap-2 px-2.5 order-2 sm:order-1 py-2 flex items-center w-full sm:w-1/2 rounded-full">
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
                  <th class="p-4 text-center font-semibold">STATUS</th> 
                  <th class="p-4 text-start font-semibold">ACTION</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                
                <tr v-if="isLoading">
                  <td colspan="7" class="p-8 text-center text-gray-500">Loading data...</td>
                </tr>

                <tr v-else-if="users.length === 0">
                  <td colspan="7" class="p-8 text-center text-gray-500">Belum ada data user.</td>
                </tr>

                <tr
                  v-for="(user, index) in users"
                  :key="user.id"
                  class="text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  :class="{'bg-gray-50 opacity-75': !user.is_active}" 
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
                      :class="user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'"
                    >
                      {{ user.role ? user.role.toUpperCase() : '-' }}
                    </span>
                  </td>

                  <td class="p-4 text-center">
                    <span 
                      class="px-3 py-1 rounded-full text-xs font-bold border"
                      :class="user.is_active ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'"
                    >
                      {{ user.is_active ? 'ACTIVE' : 'INACTIVE' }}
                    </span>
                  </td>

                  <td class="p-4 flex gap-2">
                      
                      <router-link
                        v-if="user.id !== currentUserId" 
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
                        v-if="user.id !== currentUserId"
                        @click="toggleUserStatus(user)"
                        :title="user.is_active ? 'Deactivate User' : 'Activate User'"
                        class="flex items-center justify-center p-2 rounded-md transition-colors shadow-sm"
                        :class="user.is_active ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'"
                      >
                        <TrashCan v-if="user.is_active" class="size-4 text-white" />
                        <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4 text-white">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                        </svg>
                      </button>

                      <span 
                        v-else 
                        class="px-3 py-2 text-xs font-bold text-gray-400 border border-gray-200 rounded-md select-none"
                      >
                        YOU
                      </span>

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
/* Efek visual untuk baris user yang non-aktif */
tr.opacity-75 {
  background-color: #f9fafb;
}
</style>