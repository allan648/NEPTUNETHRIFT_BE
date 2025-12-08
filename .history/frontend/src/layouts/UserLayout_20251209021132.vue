<script setup>
import { ref, onMounted } from 'vue';
import { RouterView } from 'vue-router';
import axios from 'axios';
import Sidebar from '@/components/Sidebar.vue'; // Pastikan path ini benar
import defaultAvatar from '@/assets/images/user_profile/default-avatar.png'; // Pastikan path asset benar

// 1. Siapkan wadah data untuk dilempar ke Sidebar
const userData = ref({
  username: 'Loading...',
  email: '...',
  image: defaultAvatar
});

// Konfigurasi Axios
const API_URL = "http://localhost:3000/api/auth";
axios.defaults.withCredentials = true;

// 2. Fungsi Fetch Data dari Backend
const fetchUserData = async () => {
  try {
    const response = await axios.get(`${API_URL}/status`);
    
    // Jika user login, update data
    if (response.data.isAuthenticated) {
      userData.value = {
        username: response.data.username || 'User',
        email: response.data.email || 'No Email', // Backend harus kirim email (sesuai diskusi sebelumnya)
        image: response.data.avatar || defaultAvatar
      };
    }
  } catch (error) {
    console.error("Gagal mengambil data user:", error);
  }
};

// 3. Panggil saat layout dimuat
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