<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const API_URL = "http://localhost:3000/api";
axios.defaults.withCredentials = true;

const user = ref(null);
const orders = ref([]);
const stats = ref({
  total_orders: 0,
  total_spent: 0
});
const isLoading = ref(true);

const formatRp = (price) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
};

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('id-ID', options);
};

const fetchUserDetail = async () => {
  // Pastikan ambil ID dari params
  const userId = route.params.id; 

  if (!userId) {
    console.error("ID User tidak terbaca dari URL. Periksa rute!");
    return;
  }

  isLoading.value = true;
  try {
    // Pastikan URL Backend sudah benar: /api/admin/users/:id/detail
    const res = await axios.get(`${API_URL}/admin/users/${userId}/detail`);
    user.value = res.data.profile;
    orders.value = res.data.orders;
    stats.value = res.data.stats;
  } catch (error) {
    console.error("Gagal load detail user", error);
  } finally {
    isLoading.value = false;
  }
};
onMounted(fetchUserDetail);
</script>

<template>
  <div class="space-y-6 pb-10">
    <div class="flex flex-col gap-2">
      <h1 class="text-3xl font-semibold text-gray-800">Detail User & Aktivitas</h1>
      <nav class="text-sm font-medium text-gray-500">
        <ol class="list-none p-0 inline-flex items-center space-x-2">
          <li>Users</li>
          <li><span class="mx-2">></span></li>
          <li class="text-indigo-600">User Detail</li>
        </ol>
      </nav>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-indigo-900 text-white p-6 rounded-3xl shadow-sm">
        <p class="text-indigo-200 text-sm font-medium">Total Pengeluaran</p>
        <h3 class="text-2xl font-bold mt-1">{{ formatRp(stats.total_spent || 0) }}</h3>
      </div>
      <div class="bg-white border border-gray-300 p-6 rounded-3xl shadow-sm">
        <p class="text-gray-500 text-sm font-medium">Total Pesanan</p>
        <h3 class="text-2xl font-bold mt-1 text-gray-800">{{ stats.total_orders || 0 }} Order</h3>
      </div>
      <div class="bg-white border border-gray-300 p-6 rounded-3xl shadow-sm">
        <p class="text-gray-500 text-sm font-medium">Member Sejak</p>
        <h3 class="text-xl font-bold mt-1 text-gray-800">{{ user ? formatDate(user.createdAt) : '-' }}</h3>
      </div>
    </div>

    <div class="flex flex-col rounded-3xl border border-gray-300 bg-white shadow-sm overflow-hidden">
      <div class="p-8 border-b border-gray-100">
        <h2 class="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
          <span class="p-2 bg-indigo-100 rounded-lg text-indigo-600 text-sm">👤</span> Profil User
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6" v-if="user">
          <div>
            <label class="block text-sm font-bold text-gray-500 mb-1 uppercase tracking-wider">Username</label>
            <p class="text-gray-800 font-semibold text-lg">{{ user.username }}</p>
          </div>
          <div>
            <label class="block text-sm font-bold text-gray-500 mb-1 uppercase tracking-wider">Email</label>
            <p class="text-gray-800 font-semibold text-lg">{{ user.email }}</p>
          </div>
          <div>
            <label class="block text-sm font-bold text-gray-500 mb-1 uppercase tracking-wider">Phone</label>
            <p class="text-gray-800 font-semibold text-lg">{{ user.phone || 'N/A' }}</p>
          </div>
        </div>
      </div>

      <div class="p-8">
        <h2 class="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
          <span class="p-2 bg-indigo-100 rounded-lg text-indigo-600 text-sm">🛍️</span> Riwayat Order Terakhir
        </h2>
        
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead class="bg-gray-50 text-gray-500 uppercase text-xs font-bold">
              <tr>
                <th class="px-4 py-4">ID Order</th>
                <th class="px-4 py-4">Tanggal</th>
                <th class="px-4 py-4 text-right">Total Tagihan</th>
                <th class="px-4 py-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-if="orders.length === 0">
                <td colspan="4" class="px-4 py-10 text-center text-gray-400 italic">Belum ada riwayat transaksi.</td>
              </tr>
              <tr v-for="order in orders" :key="order.id" class="hover:bg-gray-50 transition">
                <td class="px-4 py-4 font-mono text-sm text-indigo-600 font-bold">#{{ order.id }}</td>
                <td class="px-4 py-4 text-gray-600 text-sm">{{ formatDate(order.created_at) }}</td>
                <td class="px-4 py-4 text-right font-bold text-gray-800">{{ formatRp(order.total_price) }}</td>
                <td class="px-4 py-4 text-center">
                  <span 
                    class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                    :class="{
                      'bg-green-100 text-green-700': order.status === 'paid' || order.status === 'completed',
                      'bg-yellow-100 text-yellow-700': order.status === 'pending',
                      'bg-red-100 text-red-700': order.status === 'cancelled',
                      'bg-blue-100 text-blue-700': order.status === 'shipped' || order.status === 'delivered'
                    }"
                  >
                    {{ order.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="mt-8">
          <router-link
            to="/admin/accounts"
            class="inline-flex items-center text-gray-600 font-bold hover:text-indigo-600 transition duration-300"
          >
            ← Kembali ke Daftar Akun
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>