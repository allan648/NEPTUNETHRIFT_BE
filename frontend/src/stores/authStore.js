import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false)
  const showLoginModal = ref(false)

  function openLoginModal() {
    showLoginModal.value = true
  }

  function closeLoginModal() {
    showLoginModal.value = false
  }

  function login(user) {
    isAuthenticated.value = true
    closeLoginModal()
    console.log("User logged in:", user)
  }

  function logout() {
    isAuthenticated.value = false
  }

  return {
    isAuthenticated,
    showLoginModal,
    openLoginModal,
    closeLoginModal,
    login,
    logout
  }
})
