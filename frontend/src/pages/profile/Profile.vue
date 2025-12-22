<script setup>
import { ref, reactive, onMounted, onUpdated, watchEffect } from "vue";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";
// 1. Import SweetAlert2
import Swal from 'sweetalert2'; 
// 2. Import Store
import { useAuthStore } from '@/stores/authStore';

const API_URL = "http://localhost:3000/api";
axios.defaults.withCredentials = true;

const authStore = useAuthStore();

const profile = reactive({
  username: "",
  email: "",
  phone: "",
  address: "",
  image: null,     
  imageFile: null, 
  isGoogle: false,
});

const passwords = reactive({
  current: "",
  new: "",
  confirm: "",
});

const isLoading = ref(false);

// --- SINKRONISASI DATA ---
const fillProfileData = () => {
  if (authStore.user) {
    profile.username = authStore.user.username || "";
    profile.email = authStore.user.email || "";
    profile.phone = authStore.user.phone || ""; 
    profile.address = authStore.user.address || ""; 
    profile.image = authStore.user.avatar || null;
    profile.isGoogle = !!authStore.user.is_google || !!authStore.user.isGoogle; 
  }
};

// Handle Ganti Foto
const changePhoto = (event) => {
  const file = event.target.files[0];
  if (file) {
    // Validasi Ukuran (Opsional: Max 2MB)
    if (file.size > 2 * 1024 * 1024) {
        Swal.fire({
            icon: 'warning',
            title: 'File Terlalu Besar',
            text: 'Ukuran foto maksimal 2MB!',
            confirmButtonColor: '#000'
        });
        return;
    }
    profile.imageFile = file;
    profile.image = URL.createObjectURL(file);
  }
};

// Simpan Profil
const saveProfileSettings = async () => {
  isLoading.value = true;
  try {
    const formData = new FormData();
    formData.append('username', profile.username);
    formData.append('phone', profile.phone);
    formData.append('address', profile.address);
    
    if (profile.imageFile) {
      formData.append('avatar', profile.imageFile);
    }

    await axios.put(`${API_URL}/user/profile`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    // --- GANTI ALERT DENGAN SWEETALERT (SUCCESS) ---
    await Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Profil Anda telah diperbarui.',
        showConfirmButton: false,
        timer: 1500
    });
    
    // Refresh Data Store
    await authStore.checkAuth(); 

  } catch (error) {
    console.error("Gagal update:", error);
    // --- GANTI ALERT DENGAN SWEETALERT (ERROR) ---
    Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: 'Terjadi kesalahan saat menyimpan data. Coba lagi nanti.',
        confirmButtonColor: '#d33'
    });
  } finally {
    isLoading.value = false;
  }
};

const changePassword = async () => {
  if (passwords.new !== passwords.confirm) {
    // --- ALERT PASSWORD TIDAK COCOK ---
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Konfirmasi password baru tidak cocok!',
        confirmButtonColor: '#d33'
    });
    return;
  }
  
  // TODO: Sambungkan ke API Change Password
  Swal.fire({
      icon: 'info',
      title: 'Info',
      text: 'Fitur ganti password belum disambungkan ke API.',
      confirmButtonColor: '#000'
  });
};

// --- LIFECYCLE ---
onMounted(async () => {
  AOS.init({ once: true, duration: 1000, easing: "ease-out-quart" });
  await authStore.checkAuth();
  fillProfileData();
});

watchEffect(() => {
    if (authStore.user) {
        fillProfileData();
    }
});

onUpdated(() => {
  AOS.refresh();
});
</script>

<template>
  <div class="w-full p-6 md:p-10">
    <div class="mx-auto max-w-4xl">
      
      <h1 
        class="text-3xl font-bold text-gray-800 mb-8"
        data-aos="fade-down"
        data-aos-delay="100"
      >
        My Profile
      </h1>

      <section 
        class="flex flex-col items-center mb-12"
        data-aos="zoom-in"
        data-aos-delay="200"
      >
        <div class="relative group cursor-pointer">
          <div class="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
          
          <img
            :src="profile.image || 'https://via.placeholder.com/150'"
            alt="User Profile"
            class="relative h-36 w-36 rounded-full object-cover border-4 border-white shadow-xl transform transition-transform duration-500 group-hover:scale-105 group-hover:rotate-2"
            referrerpolicy="no-referrer"
          />
          
          <div class="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-white">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
              </svg>
          </div>

          <input type="file" accept="image/*" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" @change="changePhoto" />
        </div>
        
        <p class="mt-4 text-sm text-gray-500 font-medium" data-aos="fade-up" data-aos-delay="300">
          Click photo to upload new picture
        </p>
      </section>

      <section 
        class="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow duration-300 mb-8"
        data-aos="fade-up"
        data-aos-delay="400"
      >
        <form @submit.prevent="saveProfileSettings">
          <div class="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
            <h2 class="text-xl font-bold text-gray-800">Personal Information</h2>
            <span class="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">Active</span>
          </div>
          
          <div class="grid grid-cols-1 gap-6">
            <div class="group">
              <label class="block mb-2 text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">Email Address</label>
              <div class="relative">
                <input
                  v-model="profile.email"
                  type="email"
                  disabled
                  class="block w-full rounded-xl border border-gray-400 bg-gray-50 text-gray-500 px-4 py-3.5 transition-all duration-300 cursor-not-allowed"
                />
                <div class="absolute inset-y-0 right-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 text-gray-400">
                    <path fill-rule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clip-rule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            <div class="group">
              <label class="block mb-2 text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">Full Name</label>
              <input
                v-model="profile.username"
                type="text"
                :disabled="profile.isGoogle"
                class="block w-full rounded-xl border border-gray-400 px-4 py-3.5 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all duration-300 hover:border-blue-300"
              />
              <p v-if="profile.isGoogle" class="mt-1 text-xs text-gray-500 italic">
                *Nama akun Google tidak dapat diubah.
              </p>
            </div>

            <div class="group">
              <label class="block mb-2 text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">Phone Number</label>
              <input
                v-model="profile.phone"
                type="tel"
                placeholder="08..."
                class="block w-full rounded-xl border border-gray-400 px-4 py-3.5 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all duration-300 hover:border-blue-300"
              />
            </div>

            <div class="group">
              <label class="block mb-2 text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">Shipping Address</label>
              <textarea
                v-model="profile.address"
                rows="3"
                placeholder="Alamat lengkap pengiriman..."
                class="block w-full rounded-xl border border-gray-400 px-4 py-3.5 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all duration-300 hover:border-blue-300 resize-none"
              ></textarea>
            </div>
          </div>

          <div class="mt-8 flex justify-end">
            <button
              type="submit"
              :disabled="isLoading"
              class="relative overflow-hidden rounded-xl bg-blue-700 px-10 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-200 transition-all duration-300 hover:bg-blue-800 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span class="relative z-10">{{ isLoading ? 'Saving...' : 'Save Changes' }}</span>
            </button>
          </div>
        </form>
      </section>

      <section 
        class="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow duration-300"
        data-aos="fade-up"
        data-aos-delay="500"
      >
        <form @submit.prevent="changePassword">
          <h2 class="text-xl font-bold text-gray-800 border-b border-gray-100 pb-4 mb-6">
            Change Password
          </h2>
          
          <div class="space-y-6">
            <div>
              <label class="block mb-2 text-sm font-semibold text-gray-700">Current Password</label>
              <input v-model="passwords.current" type="password" class="block w-full rounded-xl border border-gray-400 px-4 py-3.5 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all duration-300" />
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block mb-2 text-sm font-semibold text-gray-700">New Password</label>
                <input v-model="passwords.new" type="password" class="block w-full rounded-xl border border-gray-400 px-4 py-3.5 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all duration-300" />
              </div>
              <div>
                <label class="block mb-2 text-sm font-semibold text-gray-700">Confirm Password</label>
                <input v-model="passwords.confirm" type="password" class="block w-full rounded-xl border border-gray-400 px-4 py-3.5 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all duration-300" />
              </div>
            </div>
          </div>

          <div class="mt-8 flex justify-end">
            <button
              type="submit"
              class="rounded-xl bg-gray-900 px-8 py-3.5 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:bg-black hover:shadow-xl hover:-translate-y-0.5 active:scale-95"
            >
              Update Password
            </button>
          </div>
        </form>
      </section>
    </div>
  </div>
</template>