<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import Swal from 'sweetalert2';

const route = useRoute();
const router = useRouter();
const status = ref('Verifying...'); 

onMounted(async () => {
  const token = route.query.token; // Ambil ?token=... dari URL

  if (!token) {
    status.value = "Token tidak ditemukan.";
    return;
  }

  try {
    const API_URL = "http://localhost:3000/api/auth";
    
    // Kirim token ke backend
    await axios.post(`${API_URL}/verify-email`, { token });

    // Sukses!
    status.value = "Verifikasi Berhasil!";
    
    await Swal.fire({
      icon: 'success',
      title: 'Akun Terverifikasi!',
      text: 'Email Anda valid. Silakan login sekarang.',
      confirmButtonText: 'Login',
      confirmButtonColor: '#1d4ed8'
    });

    // Arahkan ke Home (nanti user buka modal login sendiri)
    router.push('/');

  } catch (error) {
    console.error(error);
    status.value = "Verifikasi Gagal.";
    
    Swal.fire({
      icon: 'error',
      title: 'Gagal',
      text: error.response?.data?.message || 'Token kedaluwarsa atau salah.',
      confirmButtonColor: '#d33'
    }).then(() => {
        router.push('/'); // Balikin ke home meski gagal
    });
  }
});
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-50">
    <div class="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md w-full">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto mb-4"></div>
        <h2 class="text-2xl font-bold text-gray-800">Memproses Verifikasi...</h2>
        <p class="text-gray-500 mt-2">{{ status }}</p>
    </div>
  </div>
</template>