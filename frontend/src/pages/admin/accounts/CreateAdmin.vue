<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useRouter } from 'vue-router';

const router = useRouter();
const API_URL = "http://localhost:3000/api";
axios.defaults.withCredentials = true;

// --- STATE ---
const users = ref([]); // Pastikan inisialisasi sebagai array kosong
const searchQuery = ref('');
const isLoading = ref(true);

// --- 1. FETCH USERS ---
const fetchUsers = async () => {
  isLoading.value = true;
  try {
    // SESUAIKAN JALUR: 
    // /api (dari server.js) 
    // /admin (biasanya dari routes/index.js)
    // /users/list (dari userRoutes.js)
    const res = await axios.get(`${API_URL}/admin/users/list`);
    
    console.log("Data diterima:", res.data);
    users.value = Array.isArray(res.data) ? res.data : [];
  } catch (error) {
    console.error("Gagal mengambil daftar user:", error);
    users.value = [];
  } finally {
    isLoading.value = false;
  }
};

// --- 2. FILTER USERS (COMPUTED) ---
const filteredUsers = computed(() => {
  // Pengaman: Jika users bukan array, langsung return array kosong
  if (!Array.isArray(users.value)) return [];

  const query = searchQuery.value.toLowerCase();
  return users.value.filter(user => {
    // Tambahkan pengaman .toLowerCase() agar tidak error jika email/username null
    const name = (user.username || '').toLowerCase();
    const email = (user.email || '').toLowerCase();
    return name.includes(query) || email.includes(query);
  });
});

// --- 3. MAKE ADMIN FUNCTION ---
const makeAdmin = (user) => {
  Swal.fire({
    title: 'Jadikan Admin?',
    text: `User ${user.email} akan memiliki akses penuh ke panel admin.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#1e3a8a',
    confirmButtonText: 'Ya, Jadikan Admin',
    cancelButtonText: 'Batal'
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        // SESUAIKAN JALUR: /api/admin/users/:id/make-admin
        await axios.put(`${API_URL}/admin/users/${user.id}/make-admin`);
        Swal.fire('Berhasil!', 'Role user telah diperbarui.', 'success');
        fetchUsers(); 
      } catch (error) {
        Swal.fire('Gagal', 'Terjadi kesalahan server.', 'error');
      }
    }
  });
};

onMounted(() => {
  fetchUsers();
});
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-3xl font-semibold text-gray-800">Add New Admin</h1>
      <router-link to="/admin/accounts" class="text-indigo-600 font-medium hover:underline flex items-center gap-1">
        <span>←</span> Kembali ke Daftar Akun
      </router-link>
    </div>

    <div class="flex flex-col rounded-3xl border border-gray-300 bg-white overflow-hidden shadow-sm">
      
      <div class="p-6 border-b border-gray-200 bg-gray-50/50">
        <label class="block text-sm font-bold text-gray-700 mb-2">Cari User berdasarkan Email atau Nama:</label>
        <div class="relative">
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Ketik email atau username..." 
            class="w-full md:w-1/2 px-5 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 outline-none transition shadow-sm"
          />
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead class="bg-indigo-900 text-white uppercase text-xs font-bold">
            <tr>
              <th class="px-6 py-4">Username</th>
              <th class="px-6 py-4">Email Address</th>
              <th class="px-6 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-if="isLoading">
              <td colspan="3" class="px-6 py-12 text-center text-gray-500 italic">
                <div class="flex items-center justify-center gap-2">
                  <span class="animate-spin text-xl">⏳</span> Memuat data user...
                </div>
              </td>
            </tr>

            <tr v-else-if="filteredUsers.length === 0">
               <td colspan="3" class="px-6 py-12 text-center text-gray-500">
                 User tidak ditemukan atau belum ada data.
               </td>
            </tr>

            <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-indigo-50 transition duration-150">
              <td class="px-6 py-4 font-semibold text-gray-900">{{ user.username }}</td>
              <td class="px-6 py-4 text-gray-600">{{ user.email }}</td>
              <td class="px-6 py-4 text-right">
                <button 
                  @click="makeAdmin(user)"
                  class="bg-indigo-600 text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-indigo-800 transition shadow-md active:scale-95"
                >
                  Make Admin
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-spin {
  display: inline-block;
}
</style>