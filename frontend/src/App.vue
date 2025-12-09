<script setup>
import Navbar from '@/components/navbar.vue';
import { useAuthStore } from '@/stores/authStore';
import { RouterView } from 'vue-router'

const authStore = useAuthStore(); // Inisialisasi
</script>

<template>
  
  
    <RouterView />
  
  <LoginModal
    v-if="authStore.showLoginModal" 
    :show="authStore.showLoginModal"
    @close="authStore.closeLoginModal()"
  />
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
}

.title {
  font-family: "Montserrat", sans-serif;
  font-weight: 700; /* Bold */
}

.paragraph {
  font-family: "Montserrat", sans-serif;
  font-weight: 400; /* Regular */
}
.decorative-title {
  font-family: "Bitcount Single Ink", cursive;
  font-weight: 400; /* Atur ketebalan sesuai selera */
  font-size: 2.5rem;
  text-align: center;
}
</style>
