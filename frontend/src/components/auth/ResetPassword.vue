<script setup>
import { ref, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import Swal from 'sweetalert2';

const route = useRoute();
const router = useRouter();

const form = reactive({
  password: '',
  confirmPassword: ''
});

const isLoading = ref(false);

const handleReset = async () => {
  if (form.password !== form.confirmPassword) {
    Swal.fire({ icon: 'warning', text: 'Password tidak cocok!' });
    return;
  }

  isLoading.value = true;
  const token = route.query.token; // Token dari email

  try {
    const API_URL = "http://localhost:3000/api/auth";
    
    await axios.post(`${API_URL}/reset-password`, {
        token: token,
        newPassword: form.password
    });

    await Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Password Anda telah diperbarui. Silakan login dengan password baru.',
        confirmButtonColor: '#1d4ed8'
    });

    router.push('/'); // Kembali ke Home

  } catch (error) {
    Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: error.response?.data?.message || 'Link reset invalid/expired.',
    });
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <div class="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
      <h2 class="text-2xl font-bold text-center mb-6 text-gray-800">Reset Password Baru</h2>
      
      <form @submit.prevent="handleReset" class="space-y-4">
        <div>
           <label class="block text-sm font-medium mb-1">Password Baru</label>
           <input v-model="form.password" type="password" placeholder="••••••••" class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 outline-none" required />
        </div>
        
        <div>
           <label class="block text-sm font-medium mb-1">Konfirmasi Password</label>
           <input v-model="form.confirmPassword" type="password" placeholder="••••••••" class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 outline-none" required />
        </div>

        <button type="submit" :disabled="isLoading" class="w-full bg-blue-700 text-white py-3 rounded-xl font-bold hover:bg-blue-800 transition">
            {{ isLoading ? 'Memproses...' : 'Ubah Password' }}
        </button>
      </form>
    </div>
  </div>
</template>