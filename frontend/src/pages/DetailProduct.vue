<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router'; // Import wajib
import axios from 'axios';

const route = useRoute();   // Untuk baca ID dari URL
const router = useRouter(); // Untuk pindah halaman
const API_URL = "http://localhost:3000/api";

// --- STATE ---
const product = ref(null);
const relatedProducts = ref([]);
const activeImage = ref(null);
const gallery = ref([]);
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

// 2. Fetch Detail Produk
const fetchProductDetail = async () => {
  isLoading.value = true;
  try {
    // Ambil ID dari URL saat ini
    const id = route.params.id;
    
    // Request ke Backend
    const response = await axios.get(`${API_URL}/products/${id}`);
    
    product.value = response.data.product;
    relatedProducts.value = response.data.related;

    // Gabungkan 3 foto menjadi 1 Gallery
    gallery.value = [];
    if (product.value.image) gallery.value.push(product.value.image);
    if (product.value.image_2) gallery.value.push(product.value.image_2);
    if (product.value.image_3) gallery.value.push(product.value.image_3);

    // Set foto pertama jadi default
    if (gallery.value.length > 0) {
      activeImage.value = gallery.value[0];
    }
    
    // Scroll ke paling atas setiap kali ganti produk
    window.scrollTo(0, 0);

  } catch (error) {
    console.error("Gagal load detail", error);
  } finally {
    isLoading.value = false;
  }
};

// 3. Fungsi Klik Produk Related (YANG SEBELUMNYA ERROR)
const openRelated = (id) => {
  console.log("Pindah ke produk ID:", id);
  // PERBAIKAN: Gunakan nama 'DetailProduct' (Sesuai router/index.js Anda)
  router.push({ name: 'DetailProduct', params: { id: id } });
};

// --- LIFECYCLE ---
onMounted(() => {
  fetchProductDetail();
});

// --- PENTING: WATCHER ---
// Memantau perubahan ID di URL. 
// Jika user klik produk lain di "You Might Also Like", URL berubah, 
// maka fungsi fetchProductDetail() harus dijalankan ulang.
watch(() => route.params.id, (newId, oldId) => {
  fetchProductDetail();
});
</script>

<template>
  <main class="bg-white px-8 sm:px-16 lg:px-[140px] pb-24 md:pb-30 min-h-screen">
    
    <div v-if="isLoading" class="flex justify-center items-center h-96">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
    </div>

    <div v-else-if="product" class="container mx-auto px-4 py-8">
      
      <section class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        <div class="flex flex-col-reverse md:flex-row gap-4">
          <div class="flex md:flex-col gap-3 justify-center md:justify-start overflow-x-auto md:overflow-visible">
            <img
              v-for="(img, index) in gallery"
              :key="index"
              :src="img"
              alt="Thumbnail"
              class="w-20 h-24 object-cover cursor-pointer rounded-md border-2 transition-all hover:opacity-80"
              :class="activeImage === img ? 'border-black' : 'border-transparent'"
              @click="activeImage = img"
            >
          </div>
          
          <div class="flex-1 bg-gray-100 rounded-2xl flex items-center justify-center p-4 aspect-square overflow-hidden relative">
            <img 
                :src="activeImage" 
                alt="Main product" 
                class="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 hover:scale-110"
            >
             <span class="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                {{ product.condition === 5 ? '✨ Like New' : '🛡️ Pre-Loved' }}
             </span>
          </div>
        </div>

        <div>
          <h1 class="text-3xl md:text-4xl font-extrabold mb-2 uppercase">{{ product.name }}</h1>
          
          <div class="flex items-center gap-2 mb-4 text-sm text-gray-500">
             <span class="bg-gray-200 px-2 py-1 rounded text-xs font-bold text-gray-700">{{ product.brand_name }}</span>
             <span>•</span>
             <span class="bg-gray-200 px-2 py-1 rounded text-xs font-bold text-gray-700">{{ product.category_name }}</span>
          </div>

          <div class="flex items-center mb-6">
             <div class="flex text-yellow-400">
                <svg v-for="i in 5" :key="i" class="w-5 h-5" :class="i <= product.condition ? 'fill-current' : 'text-gray-300'" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
             </div>
             <span class="ml-2 text-sm text-gray-500">({{ product.condition }}/5 Condition)</span>
          </div>

          <div class="flex items-baseline gap-3 mb-8"> 
            <span class="text-4xl font-bold text-black">{{ formatRp(product.price) }}</span>
            <span class="text-green-600 text-sm font-semibold bg-green-100 px-2 py-1 rounded">Ready Stock</span>
          </div>

          <div class="mb-8">
            <h3 class="text-sm font-semibold mb-3 text-gray-500 uppercase tracking-wide">Available Size</h3>
            <div class="flex gap-2">
              <div class="w-16 h-12 flex items-center justify-center border-2 border-black bg-black text-white font-bold rounded-lg cursor-default shadow-md">
                {{ product.size }}
              </div>
            </div>
            <p class="text-xs text-gray-400 mt-2">*This item is unique (only 1 stock available).</p>
          </div>

          <div class="flex items-center gap-4">
            <button class="w-full bg-black text-white font-bold py-4 px-6 rounded-xl hover:bg-gray-800 transition-all transform active:scale-95 shadow-lg flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Add to Cart
            </button>
          </div>
        </div>
      </section>

      <section class="mt-16 border-t pt-10">
        <h2 class="text-2xl font-extrabold mb-6">Description</h2>
        <div class="prose max-w-none text-gray-600 leading-relaxed whitespace-pre-line">
            {{ product.description }}
        </div>
      </section>

      <section class="mt-20">
        <h2 class="text-3xl font-extrabold text-center mb-10 uppercase tracking-tight">You Might Also Like</h2>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div 
            v-for="related in relatedProducts" 
            :key="related.id" 
            class="group cursor-pointer"
            @click="openRelated(related.id)"
          >
            <div class="bg-gray-100 rounded-xl mb-3 overflow-hidden aspect-[4/5] relative">
                <img 
                    :src="related.image || 'https://via.placeholder.com/200'" 
                    :alt="related.name" 
                    class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                >
            </div>
            <h3 class="font-bold text-gray-900 truncate">{{ related.name }}</h3>
            <p class="text-gray-500 text-sm">{{ formatRp(related.price) }}</p>
          </div>
        </div>
      </section>
      
    </div>
  </main>
</template>

<style scoped>
/* Tambahan styling jika perlu */
</style>