<script setup>
import { ref, onMounted } from "vue";
import { RouterView } from "vue-router"; 
import axios from "axios";
import Sidebar from "@/components/Sidebar.vue"; 
import defaultAvatar from "@/asset/images/user_profile/default-avatar.png"; 

// 1. State untuk data user (dikirim ke Sidebar)
const userData = ref({
  username: "Loading...",
  email: "",
  image: defaultAvatar,
});

const API_URL = "http://localhost:3000/api/auth";
axios.defaults.withCredentials = true;

// 2. Fungsi Fetch Data untuk Sidebar
const fetchUserData = async () => {
  try {
    const response = await axios.get(`${API_URL}/status`);

    if (response.data.isAuthenticated) {
      userData.value = {
        username: response.data.username || "User",
        email: response.data.email || "No Email",
        image: response.data.avatar || defaultAvatar,
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
  <div class="container mx-auto flex flex-col lg:flex-row min-h-screen pt-4 pb-12 px-4 lg:px-8 gap-6">
    
    <div class="hidden lg:block w-64 flex-shrink-0">
      <Sidebar :user="userData" />
    </div>

    <main class="flex-1 bg-white rounded-xl shadow-sm min-h-[500px]">
      <RouterView />
    </main>
    
  </div>
</template>