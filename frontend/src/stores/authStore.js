import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import router from '@/router' // Pastikan router di-import untuk redirect

export const useAuthStore = defineStore('auth', () => {
  // --- STATE ---
  const isAuthenticated = ref(false)
  const showLoginModal = ref(false) // Kontrol modal dari sini
  const user = ref(null)

  const API_URL = "http://localhost:3000/api/auth"
  axios.defaults.withCredentials = true

  // --- ACTIONS ---

  function openLoginModal() {
    showLoginModal.value = true
  }

  function closeLoginModal() {
    showLoginModal.value = false
  }

  // Cek ke Backend apakah user sedang login
  async function checkAuth() {
    try {
      const response = await axios.get(`${API_URL}/status`)
      
      isAuthenticated.value = response.data.isAuthenticated
      
      // Simpan data user jika login, null jika tidak
      user.value = response.data.isAuthenticated ? response.data : null
      
      return isAuthenticated.value
    } catch (error) {
      console.error("Gagal cek auth:", error)
      isAuthenticated.value = false
      user.value = null
      return false
    }
  }

  // Fungsi Logout Lengkap (Backend + Frontend Cleanup + Redirect)
  async function logout() {
    try {
      await axios.post(`${API_URL}/logout`)
    } catch (error) {
      console.error("Error saat logout:", error)
    } finally {
      // 1. Bersihkan State Pinia
      isAuthenticated.value = false
      user.value = null
      
      // 2. Redirect paksa ke Dashboard (Home)
      // Ini yang membuat user 'terlempar' dari Cart saat logout
      router.push('/')

      // 3. Refresh Halaman (Opsional tapi disarankan)
      // Agar sisa-sisa data cache di browser benar-benar bersih
      setTimeout(() => {
        window.location.reload()
      }, 100)
    }
  }

  return {
    isAuthenticated,
    showLoginModal,
    user,
    openLoginModal,
    closeLoginModal,
    checkAuth,
    logout
  }
})