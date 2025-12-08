<script setup>
import { ref, onMounted } from 'vue';
import { RouterView } from 'vue-router';
import axios from 'axios';
import Sidebar from '@/components/Sidebar.vue'; 
import defaultAvatar from '@/assets/images/user_profile/default-avatar.png'; // Pastikan path ini benar!

// 1. WADAH DATA (STATE)
// Ini adalah data yang akan kita kirim ke Sidebar
const userData = ref({
  username: 'Memuat...', // Default text sebelum data ditarik
  email: '...',
  image: defaultAvatar
});

const API_URL = "http://localhost:3000/api/auth";
axios.defaults.withCredentials = true;

// 2. FUNGSI FETCH DATA (TUGAS PARENT)
const fetchUserData = async () => {
  try {
    // Panggil API backend untuk cek siapa yang login
    const response = await axios.get(`${API_URL}/status`);
    
    if (response.data.isAuthenticated) {
      // Masukkan data dari backend ke wadah state
      userData.value = {
        username: response.data.username || 'User',
        email: response.data.email || '', 
        image: response.data.avatar || defaultAvatar
      };
    }
  } catch (error) {
    console.error("Gagal mengambil data user:", error);
  }
};

// 3. JALANKAN SAAT LAYOUT DIBUKA
onMounted(() => {
  fetchUserData();
});
</script>

<template>
  <div class="container mx-auto flex flex-col lg:flex-row min-h-screen pt-4 pb-12 px-4 lg:px-8 gap-6">
    
    <div class="hidden lg:block w-64 flex-shrink-0">
      <Sidebar :user="userData" />
    </div>

    <main class="flex-1 bg-white rounded-xl shadow-sm min-h-[500px]">
      <RouterView />
    </main>
    
  </div>
</template>