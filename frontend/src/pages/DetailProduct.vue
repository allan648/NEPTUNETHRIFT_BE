<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import Swal from 'sweetalert2'; 
import { useAuthStore } from '@/stores/authStore'; 

// --- CONFIG ---
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const API_URL = "http://localhost:3000/api";

axios.defaults.withCredentials = true;

// --- STATE ---
const product = ref(null);
const relatedProducts = ref([]);
const activeImage = ref(null);
const gallery = ref([]);
const isLoading = ref(true);

// --- FUNCTIONS ---

const formatRp = (price) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(price);
};

// Hitung Persentase Diskon
const getDiscountPercentage = (oldPrice, newPrice) => {
  return Math.round(((oldPrice - newPrice) / oldPrice) * 100);
};

const fetchProductDetail = async () => {
  isLoading.value = true;
  try {
    const id = route.params.id;
    const response = await axios.get(`${API_URL}/products/${id}`);
    
    product.value = response.data.product;
    relatedProducts.value = response.data.related;

    // Reset & Fill Gallery
    gallery.value = [];
    if (product.value.image) gallery.value.push(product.value.image);
    if (product.value.image_2) gallery.value.push(product.value.image_2);
    if (product.value.image_3) gallery.value.push(product.value.image_3);

    if (gallery.value.length > 0) activeImage.value = gallery.value[0];
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (error) {
    console.error("Gagal load detail", error);
    Swal.fire('Error', 'Produk tidak ditemukan', 'error');
  } finally {
    isLoading.value = false;
  }
};

const openRelated = (id) => {
  router.push({ name: 'DetailProduct', params: { id: id } });
};

const addToCart = async () => {
  if (!authStore.isAuthenticated) {
    Swal.fire({
      icon: 'warning',
      title: 'Sign In Required',
      text: 'Silakan login terlebih dahulu untuk menambah barang ke keranjang!',
      showCancelButton: true,
      confirmButtonText: 'Login Sekarang',
      confirmButtonColor: '#000000',
    }).then((result) => {
      if (result.isConfirmed) authStore.openLoginModal();
    });
    return;
  }

  try {
    await axios.post(`${API_URL}/cart`, { product_id: product.value.id });
    Swal.fire({
      icon: 'success',
      title: 'Berhasil!',
      text: 'Produk telah ditambahkan ke keranjang.',
      showCancelButton: true,
      confirmButtonText: 'Lihat Keranjang',
      confirmButtonColor: '#000000',
    }).then((result) => {
      if (result.isConfirmed) router.push({ name: 'Cart' });
    });
  } catch (error) {
    const msg = error.response?.data?.message || 'Gagal menambahkan ke keranjang';
    Swal.fire({ icon: 'info', title: 'Info', text: msg });
  }
};

onMounted(() => fetchProductDetail());
watch(() => route.params.id, () => fetchProductDetail());
</script>

<template>
  <main class="bg-white px-8 sm:px-16 lg:px-[140px] pb-24 min-h-screen">
    
    <div v-if="isLoading" class="flex justify-center items-center h-[60vh]">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
    </div>

    <div v-else-if="product" class="container mx-auto py-8">
      
      <section class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        <div class="flex flex-col-reverse md:flex-row gap-4">
          <div class="flex md:flex-col gap-3 overflow-x-auto custom-scrollbar md:w-24">
            <img v-for="(img, index) in gallery" :key="index" :src="img" 
                 class="w-20 h-24 object-cover cursor-pointer rounded-xl border-2 transition-all shadow-sm" 
                 :class="activeImage === img ? 'border-black opacity-100' : 'border-transparent opacity-60'" 
                 @click="activeImage = img">
          </div>
          <div class="flex-1 bg-gray-50 rounded-3xl flex items-center justify-center p-6 aspect-square relative overflow-hidden group">
            <img :src="activeImage" class="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110">
            
            <div class="absolute top-6 left-6 flex flex-col gap-2">
              <span class="bg-black text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
                {{ product.condition === 5 ? '✨ Brand New' : '🛡️ Authentic' }}
              </span>
              <span v-if="product.is_promotion" class="bg-red-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl animate-pulse">
                🔥 Hot Deal
              </span>
            </div>
          </div>
        </div>

        <div class="flex flex-col">
          <p class="text-gray-400 text-xs font-black uppercase tracking-widest mb-2">{{ product.brand_name }} / {{ product.category_name }}</p>
          <h1 class="text-4xl md:text-5xl font-black mb-6 uppercase tracking-tighter leading-none">{{ product.name }}</h1>
          
          <div class="flex items-center mb-8 bg-gray-50 w-fit px-4 py-2 rounded-full border border-gray-100">
             <div class="flex text-yellow-400 mr-2">
                <svg v-for="i in 5" :key="i" class="w-4 h-4" :class="i <= product.condition ? 'fill-current' : 'text-gray-200'" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
             </div>
             <span class="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Condition: {{ product.condition }}/5</span>
          </div>

          <div class="mb-10">
            <div v-if="product.is_promotion" class="flex flex-col gap-1">
              <div class="flex items-center gap-4">
                <span class="text-5xl font-black text-red-600 tracking-tighter">{{ formatRp(product.discount_price) }}</span>
                <span class="text-xl text-gray-300 line-through font-bold">{{ formatRp(product.price) }}</span>
              </div>
              <div class="mt-2">
                <span class="bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-md">
                  SAVE {{ getDiscountPercentage(product.price, product.discount_price) }}% OFF
                </span>
              </div>
            </div>
            <div v-else>
              <span class="text-5xl font-black text-black tracking-tighter">{{ formatRp(product.price) }}</span>
            </div>
          </div>

          <div class="mb-10 border-y border-gray-100 py-8">
            <h3 class="text-xs font-black mb-4 text-gray-400 uppercase tracking-widest text-center md:text-left">Available Size</h3>
            <div class="flex justify-center md:justify-start">
              <div class="w-20 h-14 flex flex-col items-center justify-center border-2 border-black bg-black text-white rounded-2xl shadow-xl transform hover:scale-105 transition cursor-default">
                <span class="text-[10px] font-bold opacity-60 uppercase leading-none mb-1">Size</span>
                <span class="text-xl font-black leading-none">{{ product.size }}</span>
              </div>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row gap-4">
            <button @click="addToCart" class="flex-1 bg-black text-white font-black py-5 px-8 rounded-2xl hover:bg-blue-700 transition-all transform active:scale-95 shadow-2xl flex items-center justify-center gap-3 uppercase tracking-widest text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              Add to Cart
            </button>
          </div>
          <p class="text-center md:text-left text-[10px] text-gray-400 mt-4 font-medium uppercase tracking-widest italic">
            *This is a unique thrift item. Only one unit available in stock.
          </p>
        </div>
      </section>

      <section class="mt-24 max-w-4xl mx-auto">
        <h2 class="text-xs font-black mb-6 text-gray-400 uppercase tracking-[0.3em] text-center italic">Product Story & Details</h2>
        <div class="prose max-w-none text-gray-600 leading-relaxed text-center text-lg whitespace-pre-line px-4">
          {{ product.description }}
        </div>
      </section>

      <section class="mt-32">
        <div class="flex items-center justify-between mb-12">
           <h2 class="text-2xl font-black uppercase tracking-tighter">You Might Also Like</h2>
           <router-link to="/product" class="text-xs font-black uppercase border-b-2 border-black pb-1 hover:text-blue-600 transition">View All</router-link>
        </div>
        
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="related in relatedProducts" :key="related.id" class="group cursor-pointer" @click="openRelated(related.id)">
            <div class="bg-gray-50 rounded-3xl mb-4 overflow-hidden aspect-[4/5] relative border border-gray-100 shadow-sm transition-all hover:shadow-xl">
                <div v-if="related.is_promotion" class="absolute top-3 left-3 bg-red-600 text-white text-[8px] font-black px-2 py-1 rounded-md z-10 shadow-lg">SALE</div>
                
                <img :src="related.image || 'https://via.placeholder.com/200'" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
            </div>
            <div class="px-2 text-center">
              <h3 class="font-black text-gray-900 text-sm truncate uppercase tracking-tighter mb-1">{{ related.name }}</h3>
              <div class="flex items-center justify-center gap-2">
                <span v-if="related.is_promotion" class="text-red-600 font-black text-xs">{{ formatRp(related.discount_price) }}</span>
                <span :class="related.is_promotion ? 'text-gray-300 line-through text-[10px]' : 'text-gray-500 font-bold text-xs'">
                  {{ formatRp(related.price) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
    </div>
  </main>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { height: 4px; width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
</style>