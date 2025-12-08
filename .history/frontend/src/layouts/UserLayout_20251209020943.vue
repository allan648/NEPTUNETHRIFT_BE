<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Sidebar from '@/components/Sidebar.vue'; // Sesuaikan path component sidebar Anda
import defaultAvatar from '@/assets/images/user_profile/default-avatar.png';

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
      // 3. Mapping data dari Backend ke format Props Sidebar
      userData.value = {
        username: response.data.username || 'User',
        email: response.data.email || 'No Email',
        // Jika avatar null, pakai default
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