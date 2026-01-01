<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import Swal from 'sweetalert2';

// --- CONFIG ---
const route = useRoute();
const API_URL = "http://localhost:3000/api";

// --- STATE ---
const product = ref({});
const isLoading = ref(true);

// --- FUNCTIONS ---

// 1. Format Rupiah
const formatRp = (price) => {
  if (!price) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(price);
};

// 2. Helper Kondisi (Angka ke Text)
const getConditionText = (num) => {
  const conditions = {
    5: '✨ 5 - Like New',
    4: '👌 4 - Excellent',
    3: '🛡️ 3 - Good',
    2: '⚠️ 2 - Fair',
    1: '💀 1 - Bad'
  };
  return conditions[num] || 'Unknown';
};

// 3. Fetch Data Produk
const fetchProductDetail = async () => {
  isLoading.value = true;
  try {
    const id = route.params.id;
    const response = await axios.get(`${API_URL}/products/${id}`);
    product.value = response.data.product;
  } catch (error) {
    console.error(error);
    Swal.fire('Error', 'Gagal memuat data produk', 'error');
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchProductDetail();
});
</script>

<template>
  <div class="space-y-6 pb-10">
    <div class="flex flex-col gap-2">
      <div class="flex items-center gap-3 flex-wrap">
        <h1 class="text-3xl font-semibold text-gray-800">Detail Product</h1>
        <span v-if="product.is_promotion" 
              class="bg-orange-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-md animate-pulse">
          🔥 On Promotion
        </span>
      </div>
      
      <nav class="text-sm font-medium text-gray-500">
          <router-link :to="{ name: 'Products' }" class="hover:text-blue-600 transition">Products Management</router-link>
          <span class="mx-2">></span>
          <span class="text-gray-800 font-bold">{{ product.name || 'Loading...' }}</span>
      </nav>
    </div>

    <div v-if="isLoading" class="p-20 text-center bg-white rounded-3xl border border-gray-200 shadow-sm">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
        <p class="mt-4 text-gray-500 font-medium">Fetching product data...</p>
    </div>

    <div v-else class="flex flex-col rounded-3xl border border-gray-300 bg-white shadow-md overflow-hidden transition-all">
      <div class="p-8">
        <form @submit.prevent>
          <div class="space-y-8">

            <div>
              <label class="block text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span class="p-1.5 bg-blue-100 text-blue-600 rounded-md">🖼️</span> Product Photos
              </label>
              <div class="flex flex-wrap gap-6">
                <div class="flex flex-col gap-2">
                   <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Main Photo</span>
                   <div class="w-44 h-44 rounded-3xl overflow-hidden border-2 border-gray-100 bg-gray-50 shadow-inner group">
                     <img :src="product.image || 'https://via.placeholder.com/150'" 
                          class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
                   </div>
                </div>
                <div class="flex flex-col gap-2">
                   <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Side View</span>
                   <div class="w-44 h-44 rounded-3xl overflow-hidden border-2 border-gray-100 bg-gray-50 shadow-inner group">
                     <img v-if="product.image_2" :src="product.image_2" 
                          class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
                     <div v-else class="w-full h-full flex items-center justify-center text-gray-400 text-xs italic">Empty</div>
                   </div>
                </div>
                <div class="flex flex-col gap-2">
                   <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Details</span>
                   <div class="w-44 h-44 rounded-3xl overflow-hidden border-2 border-gray-100 bg-gray-50 shadow-inner group">
                     <img v-if="product.image_3" :src="product.image_3" 
                          class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
                     <div v-else class="w-full h-full flex items-center justify-center text-gray-400 text-xs italic">Empty</div>
                   </div>
                </div>
              </div>
            </div>

            <hr class="border-gray-100">

            <div class="space-y-6">
                <div>
                  <label class="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Product Name</label>
                  <p class="text-xl font-bold text-gray-900 bg-gray-50 px-5 py-3 rounded-2xl border border-gray-100 italic">
                    "{{ product.name }}"
                  </p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label class="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Brand</label>
                        <div class="px-5 py-3 border border-gray-100 rounded-full bg-indigo-50 text-indigo-700 font-bold">
                            {{ product.brand_name }}
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Category</label>
                        <div class="px-5 py-3 border border-gray-100 rounded-full bg-blue-50 text-blue-700 font-bold">
                            {{ product.category_name }}
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label class="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Size</label>
                      <div class="px-5 py-3 border border-gray-100 rounded-full bg-gray-50 text-gray-800 font-bold text-lg">
                        EU {{ product.size }}
                      </div>
                    </div>
                    <div>
                      <label class="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Pricing</label>
                      
                      <div v-if="product.is_promotion" class="flex flex-col gap-1 p-3 bg-orange-50 border border-orange-100 rounded-2xl">
                        <div class="flex items-center gap-3">
                          <span class="text-2xl font-black text-orange-600">{{ formatRp(product.discount_price) }}</span>
                          <span class="text-sm text-gray-400 line-through decoration-red-500 font-bold">{{ formatRp(product.price) }}</span>
                        </div>
                        <div class="text-[11px] font-black text-green-600 uppercase">
                          ✨ PROFIT REDUCED BY {{ Math.round((1 - product.discount_price / product.price) * 100) }}% FOR PROMO
                        </div>
                      </div>

                      <div v-else class="px-5 py-3 border border-gray-100 rounded-full bg-gray-900 text-white font-black text-xl">
                        {{ formatRp(product.price) }}
                      </div>
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Product Condition</label>
                    <div class="px-5 py-3 border border-gray-100 rounded-full bg-gray-50 text-gray-800 font-semibold">
                        {{ getConditionText(product.condition) }}
                    </div>
                </div>

                <div>
                  <label class="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Description</label>
                  <div class="w-full px-6 py-4 border border-gray-100 rounded-3xl bg-gray-50 text-gray-600 leading-relaxed italic">
                    {{ product.description || 'No description provided.' }}
                  </div>
                </div>
            </div>
          </div>

          <div class="mt-10 flex items-center gap-4">
            <router-link :to="{ name: 'Products' }" class="flex-1 md:flex-none bg-white text-gray-800 font-bold px-10 py-4 border-2 border-gray-200 rounded-full hover:bg-gray-50 transition shadow-sm text-center">
              Back to List
            </router-link>
            
            <router-link :to="{ name: 'Editproduct', params: { id: product.id } }" class="flex-1 md:flex-none bg-blue-700 text-white font-bold px-10 py-4 rounded-full hover:bg-blue-800 transition shadow-lg text-center active:scale-95">
              Edit Product Info
            </router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: .7; }
}
</style>