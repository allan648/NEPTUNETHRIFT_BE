<script setup>
import { defineProps, defineEmits, ref, watch } from 'vue';
import axios from 'axios';

// Konfigurasi API
const API_URL = "http://localhost:3000/api";

// Props & Emits
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  // Menerima data Order dari Parent (Tabel)
  orderData: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['close']);
const orderItems = ref([]); // Wadah untuk menyimpan list barang
const isLoading = ref(false);

const close = () => {
  emit('close');
  orderItems.value = []; // Reset saat ditutup
};

// Format Rupiah
const formatRp = (price) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(price);
};

// Format Tanggal
const formatDate = (dateString) => {
  if (!dateString) return '-';
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('id-ID', options);
};


const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return 'https://via.placeholder.com/150?text=No+Image'; // Gambar cadangan jika null
  }
  // Jika path sudah ada http (misal dari internet), pakai langsung
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  // Jika path dari upload lokal, tambahkan URL backend
  // Pastikan imagePath dari DB diawali '/' (contoh: /uploads/abc.jpg)
  return `http://localhost:3000${imagePath}`; 
};

// --- LOGIKA UTAMA: FETCH ITEM SAAT MODAL DIBUKA ---
watch(() => props.show, async (isOpen) => {
  if (isOpen && props.orderData) {
    isLoading.value = true;
    try {
      // Panggil Backend untuk minta data "Barang apa aja yg dibeli di order ini?"
      const response = await axios.get(`${API_URL}/admin/orders/${props.orderData.id}`);
      orderItems.value = response.data.items;
    } catch (error) {
      console.error("Gagal ambil item:", error);
    } finally {
      isLoading.value = false;
    }
  }
});
</script>

<template>
  <transition name="modal-fade">
    <div
      v-if="show"
      class="fixed inset-0 z-50 flex items-center justify-center modal-blur-overlay"
      @click.self="close"
    >
      <div
        class="relative w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl m-4 max-h-[90vh] overflow-y-auto"
        style="animation: scaleIn 0.3s"
      >
        <div class="flex justify-between items-start mb-6">
          <h2 class="text-2xl font-bold text-gray-900">
            <span class="text-[#0B2F5C]">Detail</span> Transaksi
          </h2>
          <button @click="close" class="text-gray-400 hover:text-gray-800 transition-colors">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div v-if="orderData" class="space-y-4">

          <div class="bg-white p-4 rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-gray-100">
            <h3 class="font-bold text-gray-900 text-base mb-3">Informasi Pesanan</h3>
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-gray-400 font-medium text-sm">Order ID</span>
                <span class="text-gray-900 font-bold text-sm">#{{ orderData.id }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-400 font-medium text-sm">Tanggal Order</span>
                <span class="text-gray-900 font-bold text-sm">{{ formatDate(orderData.created_at) }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-400 font-medium text-sm">Pembeli</span>
                <span class="text-gray-900 font-bold text-sm">{{ orderData.recipient_name }}</span>
              </div>
               <div class="flex justify-between items-center">
                <span class="text-gray-400 font-medium text-sm">Telepon</span>
                <span class="text-gray-900 font-bold text-sm">{{ orderData.recipient_phone }}</span>
              </div>
              <div class="flex flex-col mt-2 pt-2 border-t border-gray-100">
                 <span class="text-gray-400 font-medium text-sm mb-1">Alamat Pengiriman:</span>
                 <p class="text-gray-900 text-sm leading-relaxed">{{ orderData.shipping_address }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white p-4 rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-gray-100">
            <h3 class="font-bold text-gray-900 text-base mb-3">Produk yang Dibeli</h3>
            
            <div v-if="isLoading" class="text-center py-4 text-gray-400 text-sm">Memuat item...</div>
            
            <div v-else class="space-y-4">
              <div v-for="(item, index) in orderItems" :key="index" class="flex gap-4 border-b border-gray-100 last:border-0 pb-3 last:pb-0">
                <div class="w-16 h-20 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden shrink-0 border">
                  <img
                    :src="getImageUrl(item.image)" 
                    alt="Product"
                    class="w-full h-full object-cover mix-blend-multiply"
                    @error="$event.target.src='https://via.placeholder.com/150?text=Error'" 
                  >
                </div>
                <div class="flex flex-col justify-center w-full">
                  <h4 class="font-bold text-gray-900 text-sm">{{ item.name }}</h4>
                  <div class="text-xs text-gray-500 mt-1 mb-1 space-y-0.5">
                    <p v-if="item.size">Size: <span class="text-gray-700 font-medium">{{ item.size }}</span></p>
                    <p>Qty: <span class="text-gray-700 font-medium">x{{ item.quantity }}</span></p>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="text-sm font-bold text-[#0B2F5C]">{{ formatRp(item.price) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white p-4 rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-gray-100">
             <div class="flex justify-between items-center mb-2">
               <h3 class="font-bold text-gray-900 text-base">Status Pembayaran</h3>
               <span 
                  class="text-xs font-bold px-3 py-1 rounded-full uppercase"
                  :class="{
                    'bg-yellow-100 text-yellow-800': orderData.status === 'pending',
                    'bg-green-100 text-green-800': orderData.status === 'paid',
                    'bg-blue-100 text-blue-800': orderData.status === 'shipped',
                    'bg-gray-100 text-gray-800': orderData.status === 'completed'
                  }"
               >
                 {{ orderData.status }}
               </span>
             </div>

             <div v-if="orderData.status === 'shipped'" class="flex justify-between items-center mb-4 p-2 bg-blue-50 rounded">
                <span class="text-xs text-blue-700 font-bold">Resi:</span>
                <span class="text-sm text-blue-900 font-mono font-bold">{{ orderData.tracking_number }}</span>
             </div>

             <div class="border-t border-dashed border-gray-300 pt-3 mt-3 flex justify-between items-end">
                <span class="text-gray-500 font-medium">Total Tagihan</span>
                <span class="text-xl font-bold text-[#0B2F5C]">{{ formatRp(orderData.total_price) }}</span>
             </div>
          </div>

        </div>

      </div>
    </div>
  </transition>
</template>

<style scoped>
@keyframes scaleIn {
  0% { transform: scale(0.9); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.3s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
.modal-blur-overlay {
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  background: rgba(0, 0, 0, 0.3); /* Sedikit digelapkan agar modal lebih pop-up */
}
</style>