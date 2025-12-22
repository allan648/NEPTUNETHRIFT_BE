<script setup>
import { ref, computed, onMounted, onUpdated, nextTick } from 'vue'
import axios from 'axios';
import Swal from 'sweetalert2';
import { useRouter } from 'vue-router';
import AOS from "aos";
import "aos/dist/aos.css";

const router = useRouter();
const API_URL = "http://localhost:3000/api";
axios.defaults.withCredentials = true; // Wajib agar session terbaca

// --- STATE ---
const cartItems = ref([]);
const isLoading = ref(true);

// --- FUNCTIONS ---

// 1. Format Rupiah
const formatRp = (price) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(price);
};

// 2. Ambil Data Keranjang dari API
const fetchCart = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get(`${API_URL}/cart`);
    cartItems.value = response.data.items;
    
    // Refresh animasi AOS setelah data dimuat
    nextTick(() => {
      AOS.refresh();
    });

  } catch (error) {
    console.error("Gagal load cart", error);
    // Jika sesi habis (401), lempar ke home/login
    if (error.response && error.response.status === 401) {
        router.push('/');
    }
  } finally {
    isLoading.value = false;
  }
};

// 3. Hapus Item (API)
const removeItem = (cartId, productName) => {
  Swal.fire({
    title: 'Hapus Item?',
    text: `Hapus ${productName} dari keranjang?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Ya, Hapus',
    cancelButtonText: 'Batal'
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await axios.delete(`${API_URL}/cart/${cartId}`);
        
        // Hapus dari state lokal biar responsif (tanpa reload)
        cartItems.value = cartItems.value.filter(item => item.cart_id !== cartId);
        
        Swal.fire({
            title: 'Terhapus!',
            text: 'Item berhasil dihapus.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
        });
        
        setTimeout(() => AOS.refresh(), 100); 

      } catch (error) {
        Swal.fire('Error', 'Gagal menghapus item', 'error');
      }
    }
  });
};

// 4. Hitung Total (Computed)
const totalPrice = computed(() => {
  return cartItems.value.reduce((total, item) => total + (item.price * item.quantity), 0);
});

// 5. Checkout Dummy
const proceedToCheckout = () => {
  if (cartItems.value.length === 0) return;
  
  Swal.fire({
    title: 'Checkout',
    text: 'Fitur Checkout akan segera hadir di modul selanjutnya!',
    icon: 'info'
  });
};

// --- LIFECYCLE ---
onMounted(() => {
  AOS.init({
    once: true,
    duration: 800,
    easing: "ease-out-cubic",
  });
  fetchCart(); // Load data saat halaman dibuka
});

onUpdated(() => {
  AOS.refresh();
});
</script>

<template>
  <div class="w-full p-6 md:p-10 min-h-screen">
    <div class="mx-auto max-w-4xl">
      
      <div 
        class="flex items-center justify-between mb-8"
        data-aos="fade-down"
        data-aos-delay="100"
      >
        <h1 class="text-3xl md:text-4xl font-bold text-gray-800">My Cart</h1>
        <span class="text-gray-500 text-sm" v-if="!isLoading">{{ cartItems.length }} Items</span>
      </div>

      <div v-if="isLoading" class="flex justify-center py-20">
         <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>

      <div v-else class="space-y-6">
        
        <div
          v-for="(item, index) in cartItems"
          :key="item.cart_id"
          class="flex flex-col sm:flex-row items-center gap-6 p-4 border border-gray-200 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
          data-aos="fade-up"
          :data-aos-delay="150 + (index * 50)"
        >
          <div class="w-28 h-28 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden relative border border-gray-100">
            <img
              :src="item.image || 'https://via.placeholder.com/150'"
              :alt="item.name"
              class="h-full w-full object-cover mix-blend-multiply hover:scale-105 transition-transform duration-500"
            />
          </div>

          <div class="flex-grow text-center sm:text-left w-full sm:w-auto">
            <h2 class="text-lg font-bold text-gray-900 mb-1">{{ item.name }}</h2>
            
            <div class="flex items-center justify-center sm:justify-start gap-4 text-sm text-gray-500 mb-2">
              <span class="bg-gray-100 px-2 py-0.5 rounded text-xs font-medium text-gray-600">Size: {{ item.size }}</span>
              
              <span class="flex items-center gap-1 text-xs font-medium" 
                :class="{
                    'text-green-600': item.condition >= 5,
                    'text-blue-600': item.condition === 4,
                    'text-yellow-600': item.condition === 3,
                    'text-orange-600': item.condition <= 2
                }"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                   <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Condition: {{ item.condition }}/5
              </span>
            </div>
            
            <p class="text-xl font-bold text-blue-700">{{ formatRp(item.price) }}</p>
          </div>

          <div class="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto mt-2 sm:mt-0 border-t sm:border-0 pt-4 sm:pt-0 border-gray-100">
            
            <div class="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
                <span>Qty:</span>
                <span class="font-bold text-gray-900">{{ item.quantity }}</span>
            </div>

            <button 
              @click="removeItem(item.cart_id, item.name)" 
              class="text-gray-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-full transition-all"
              title="Remove Item"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        <div 
          v-if="cartItems.length === 0" 
          class="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300"
          data-aos="zoom-in"
        >
          <div class="bg-white w-20 h-20 mx-auto rounded-full flex items-center justify-center shadow-sm mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10 text-gray-400">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
          </div>
          <p class="text-gray-500 text-lg font-medium">Keranjang kamu kosong.</p>
          <router-link :to="{ name: 'Product' }" class="text-blue-600 font-semibold mt-2 inline-block hover:underline">Mulai Belanja</router-link>
        </div>
      </div>

      <div 
        v-if="cartItems.length > 0 && !isLoading" 
        class="mt-10 pt-8 border-t border-gray-100"
        data-aos="fade-up"
        data-aos-delay="500"
        data-aos-offset="10"
      >
        <div class="flex flex-col sm:flex-row justify-between items-center gap-6">
          <div class="text-center sm:text-left">
             <p class="text-gray-500 text-sm mb-1">Total Pesanan</p>
             <p class="text-3xl font-extrabold text-gray-900 tracking-tight">
              {{ formatRp(totalPrice) }}
            </p>
            <p class="text-xs text-gray-400 mt-1">Termasuk pajak (jika ada)</p>
          </div>

          <button
            @click="proceedToCheckout"
            class="w-full sm:w-auto group relative px-8 py-4 bg-gray-900 text-white font-bold rounded-full overflow-hidden shadow-xl shadow-blue-900/20 hover:shadow-2xl hover:shadow-blue-900/40 transition-all duration-300 active:scale-95"
          >
            <div class="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600 to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span class="relative flex items-center justify-center gap-2">
              Proceed to Checkout
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4 group-hover:translate-x-1 transition-transform">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </span>
          </button>
        </div>
      </div>

    </div>
  </div>
</template>