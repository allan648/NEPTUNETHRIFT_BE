<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import axios from 'axios'
import Swal from 'sweetalert2'
import defaultAvatar from '@/asset/images/user_profile/default-avatar.png'

const router = useRouter()
const API_URL = "http://localhost:3000/api"

// -- STATE --
const isSidebarOpen = ref(false)
const isUserOpen = ref(false)
const isAuthenticated = ref(false)
const currentUser = ref(null) // Menyimpan data user dari backend

const emit = defineEmits(['sidebarOpen'])

// -- FUNGSI AMBIL DATA USER --
const checkAuthStatus = async () => {
  try {
    const res = await axios.get(`${API_URL}/auth/status`)
    if (res.data.user) {
      isAuthenticated.value = true
      currentUser.value = res.data.user
    } else {
      isAuthenticated.value = false
    }
  } catch (error) {
    isAuthenticated.value = false
    console.error("User not authenticated")
  }
}

// -- METHODS --
const handleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
  emit('sidebarOpen', isSidebarOpen.value)
}

const toggleUserDropdown = () => {
  isUserOpen.value = !isUserOpen.value
}

const handleLogout = async () => {
  try {
    await axios.post(`${API_URL}/auth/logout`)
    isAuthenticated.value = false
    currentUser.value = null
    isUserOpen.value = false
    
    await Swal.fire({
      icon: 'success',
      title: 'Logged Out',
      text: 'Sampai jumpa lagi!',
      timer: 1500,
      showConfirmButton: false
    })
    
    router.push('/') // Redirect ke home/login
  } catch (error) {
    Swal.fire('Error', 'Gagal logout', 'error')
  }
}

onMounted(() => {
  checkAuthStatus()
})
</script>
<template>
  <div class="sticky top-0 w-full z-50 flex justify-between items-center p-3.5 bg-gray-50 border-b border-gray-300">
    <div class="lg:hidden">
      <button @click="handleSidebar" class="p-2.5 rounded-lg">
        <HamburgerMenu v-if="!isSidebarOpen" class="text-gray-600 size-4.5" />
        <Exit v-else class="text-gray-600 size-4.5" />
      </button>
    </div>

    <div class="relative ml-auto">
      <div v-if="isAuthenticated && currentUser">
        <button @click="toggleUserDropdown" class="flex items-center gap-3 focus:outline-none group">
          <img
            :src="currentUser.avatar || defaultAvatar"
            alt="User Avatar"
            class="size-9 rounded-full object-cover border-2 border-gray-200 transition-all group-hover:border-blue-500"
          />
          <div class="text-left hidden sm:block">
            <p class="text-gray-900 font-bold text-sm leading-none flex items-center gap-1">
              {{ currentUser.username }}
              <ArrowDown class="size-3 text-gray-500" />
            </p>
            <p class="text-[10px] text-gray-500 font-medium uppercase tracking-tight">
              {{ currentUser.role }}
            </p>
          </div>
        </button>

        <div v-if="isUserOpen" class="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl z-20 py-2 border border-gray-100 overflow-hidden">
          <div class="px-4 py-2 border-b border-gray-50 mb-1">
            <p class="text-xs text-gray-400">Signed in as</p>
            <p class="text-sm font-bold text-gray-800 truncate">{{ currentUser.email }}</p>
          </div>

          <RouterLink to="/" class="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">🏠 Home</RouterLink>
          <RouterLink to="/user/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">👤 My Profile</RouterLink>
          
          <RouterLink v-if="currentUser.role === 'admin'" to="/admin/dashboard" class="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">📊 Admin Panel</RouterLink>
          
          <hr class="my-1 border-gray-50" />
          <button @click="handleLogout" class="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium">
            🚪 Sign Out
          </button>
        </div>
      </div>

      <div v-else>
        <RouterLink to="/login" class="flex items-center gap-2 font-bold text-white bg-blue-700 hover:bg-blue-800 px-6 py-2 rounded-full transition-all shadow-md active:scale-95">
          Sign In
        </RouterLink>
      </div>
    </div>
  </div>
</template>