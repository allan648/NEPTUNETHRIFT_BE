<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

// --- CONFIG ---
const API_URL = "http://localhost:3000/api";

// --- STATE ---
const promoProducts = ref([]);
const isLoading = ref(true);

// --- FUNCTIONS ---

// 1. Ambil Produk Khusus Promo
const fetchPromoProducts = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get(`${API_URL}/products`);
    
    // Ambil data (cek apakah di response.data.products atau langsung di response.data)
    const rawData = response.data.products || response.data;

    if (Array.isArray(rawData)) {
      // PERBAIKAN: Tambahkan pengecekan p.status === 'active'
      promoProducts.value = rawData.filter(p => 
        (p.is_promotion === 1 || p.is_promotion === '1') && 
        p.status === 'active'
      );
    } else {
      console.error("Data bukan merupakan array:", rawData);
    }
    
  } catch (error) {
    console.error("Gagal memuat produk promo:", error);
  } finally {
    isLoading.value = false;
  }
};

// 2. Format Rupiah
const formatRp = (price) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(price);
};

// 3. Hitung Persentase Diskon secara dinamis
const calculateDiscount = (original, promo) => {
  const diff = original - promo;
  return Math.round((diff / original) * 100);
};

onMounted(() => {
  fetchPromoProducts();
});
</script>

<template>
  <main class="container mx-auto py-8 px-6 sm:px-16 lg:px-[140px] pb-24 md:pb-30">
    <div class="mb-4 text-sm text-gray-500" data-aos="fade-down">
      <router-link to="/" class="hover:text-blue-600">Home</router-link>
      <span class="mx-2">></span>
      <span class="font-semibold text-gray-700">Promo</span>
    </div>

    <div class="flex flex-col md:flex-row -mx-4">
      <aside class="w-full md:w-1/4 px-4 mb-8 md:mb-0" data-aos="fade-right">
         <div class="sticky top-24 p-6 bg-gray-50 rounded-3xl border border-gray-100">
            <h2 class="text-xl font-bold mb-4">Filters</h2>
            <p class="text-xs text-gray-400 uppercase font-black tracking-widest">Flash Sale Active</p>
         </div>
      </aside>

      <div class="w-full md:w-3/4 px-4">
        <div class="flex flex-col sm:flex-row justify-between items-center mb-6" data-aos="fade-up">
          <h1 class="text-4xl font-black italic tracking-tighter text-gray-900 mb-4 sm:mb-0 uppercase">Special Promo 🔥</h1>
          <div class="text-sm text-gray-500 font-medium">
            <span v-if="!isLoading">Showing {{ promoProducts.length }} Promo Items</span>
          </div>
        </div>

        <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div v-for="i in 3" :key="i" class="animate-pulse bg-gray-100 h-80 rounded-3xl"></div>
        </div>

        <div v-else-if="promoProducts.length === 0" class="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-300">
            <p class="text-gray-500 font-bold uppercase tracking-widest">Belum ada produk promo saat ini.</p>
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" data-aos="fade-up">
          <div
            v-for="(product, idx) in promoProducts"
            :key="product.id"
            class="group"
          >
            <div class="bg-gray-100 rounded-3xl p-4 mb-4 overflow-hidden relative shadow-sm border border-gray-100">
              <div class="absolute top-4 left-4 z-10 bg-red-600 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg">
                -{{ calculateDiscount(product.price, product.discount_price) }}%
              </div>
              
              <router-link :to="`/detailproduct/${product.id}`">
                <img
                    :src="product.image"
                    :alt="product.name"
                    class="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </router-link>
            </div>

            <div class="px-2">
                <h3 class="font-bold text-gray-900 text-lg truncate uppercase tracking-tight">{{ product.name }}</h3>
                <p class="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2">{{ product.brand_name }}</p>
                
                <div class="flex items-center gap-2 mb-3">
                    <span class="text-red-600 font-black text-lg">{{ formatRp(product.discount_price) }}</span>
                    <span class="text-gray-400 line-through text-xs font-bold">{{ formatRp(product.price) }}</span>
                </div>

                <router-link 
                    :to="`/product/${product.id}`"
                    class="block w-full text-center bg-gray-900 text-white py-3 rounded-full text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-colors"
                >
                    View Detail
                </router-link>
            </div>
          </div>
        </div>

        <div v-if="promoProducts.length > 0" class="flex justify-center items-center mt-12">
           <button class="px-6 py-2 border-2 border-gray-900 rounded-full font-black text-xs uppercase hover:bg-gray-900 hover:text-white transition">Load More</button>
        </div>
      </div>
    </div>
  </main>
</template>