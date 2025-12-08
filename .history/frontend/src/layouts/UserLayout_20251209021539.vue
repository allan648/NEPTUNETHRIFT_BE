<script setup>
import { ref, onMounted } from 'vue';
import { RouterView } from 'vue-router'; // Penting untuk merender halaman anak (Profile/Cart)
import axios from 'axios';
import Sidebar from '@/components/Sidebar.vue'; // Pastikan path ke sidebar benar
import defaultAvatar from '@/asset/images/user_profile/default-avatar.png'; // Pastikan path benar

// 1. State untuk data user yang akan dikirim ke Sidebar
const userData = ref({
  username: 'Loading...',
  email: '',
  image: defaultAvatar
});

const API_URL = "http://localhost:3000/api/auth";
axios.defaults.withCredentials = true;

// 2. Fungsi Fetch Data (Mirip checkAuthStatus di Navbar)
const fetchUserData = async () => {
  try {
    const response = await axios.get(`${API_URL}/status`);
    
    if (response.data.isAuthenticated) {
      // 3. Masukkan data dari Backend ke variabel userData
      userData.value = {
        username: response.data.username || 'User',
        email: response.data.email || 'No Email',
        image: response.data.avatar || defaultAvatar 
      };
    }
  } catch (error) {
    console.error("Gagal mengambil data user untuk sidebar:", error);
  }
};

onMounted(() => {
  fetchUserData();
});
</script>

<template>
  <div class="flex min-h-screen bg-gray-50">
    
    <Sidebar :user="userData" />

    <main class="flex-1 p-6">
      <RouterView />
    </main>
    
  </div>
</template>