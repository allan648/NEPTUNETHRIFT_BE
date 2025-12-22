<script setup>
import { ref, reactive, onMounted, watch, nextTick } from 'vue';
import axios from 'axios';
import AOS from "aos";
import "aos/dist/aos.css";

// --- 1. TAMBAHKAN DUA BARIS PENTING INI ---
import { useRouter } from 'vue-router'; // Import fungsi router
const router = useRouter();             // Aktifkan router
// ------------------------------------------

const API_URL = "http://localhost:3000/api";

// --- STATE ---
const products = ref([]);
const brands = ref([]);
const categories = ref([]);
const isLoading = ref(true);

// State Filter
const filters = reactive({
  brand_id: '',
  category_id: '',
  sort: 'newest'
});

// --- FUNCTIONS ---

// 1. Format Rupiah
const formatRp = (price) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(price);
};

// 2. Fungsi Pindah Halaman (Sekarang 'router' sudah dikenali!)
const goToDetail = (id) => {
  console.log("Navigasi ke ID:", id); // Cek console untuk memastikan ID ada
  router.push({ name: 'DetailProduct', params: { id: id } });
};

// 3. Fetch Data Sidebar (Brand & Category)
const fetchMetadata = async () => {
  try {
    const response = await axios.get(`${API_URL}/metadata`);
    brands.value = response.data.brands;
    categories.value = response.data.categories;
  } catch (error) {
    console.error("Gagal load filter", error);
  }
};

// 4. Fetch Products
const fetchProducts = async () => {
  isLoading.value = true;
  try {
    const params = {
      brand_id: filters.brand_id || undefined,
      category_id: filters.category_id || undefined,
      sort: filters.sort
    };

    const response = await axios.get(`${API_URL}/products`, { params });
    products.value = response.data;
    
    nextTick(() => {
      AOS.refresh();
    });

  } catch (error) {
    console.error("Gagal load produk", error);
  } finally {
    isLoading.value = false;
  }
};

// --- LIFECYCLE ---
onMounted(() => {
  AOS.init({ once: true, duration: 800, easing: "ease-in-out" });
  fetchMetadata(); 
  fetchProducts(); 
});

watch(filters, () => {
  fetchProducts();
});
</script>

<template>
  <main class="container mx-auto py-8 px-6 sm:px-16 lg:px-[140px] pb-24 md:pb-30 overflow-hidden">
    <div class="mb-4 text-sm text-gray-500" data-aos="fade-down" data-aos-delay="100">
      <router-link to="/" class="hover:text-black">Home</router-link>
      <span class="mx-2">></span>
      <span class="font-medium text-black">Collections</span>
    </div>

    <div class="flex flex-col md:flex-row -mx-4">
      
      <aside class="w-full md:w-1/4 px-4 mb-8 md:mb-0" data-aos="fade-right" data-aos-delay="200">
        <div class="sticky top-24"> <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold">Filters</h2>
            <button 
              @click="Object.assign(filters, { brand_id: '', category_id: '', sort: 'newest' })" 
              class="text-xs text-red-500 hover:underline"
            >
              Reset
            </button>
          </div>

          <div class="border-t py-4">
            <h3 class="font-semibold mb-3">Categories</h3>
            <div class="space-y-2 max-h-48 overflow-y-auto">
              <div class="flex items-center">
                <input type="radio" id="cat_all" value="" v-model="filters.category_id" class="h-4 w-4 text-black focus:ring-black border-gray-300">
                <label for="cat_all" class="ml-3 text-sm text-gray-600 cursor-pointer">All Categories</label>
              </div>
              <div v-for="cat in categories" :key="cat.id" class="flex items-center">
                <input 
                  type="radio" 
                  :id="'cat_'+cat.id" 
                  :value="cat.id" 
                  v-model="filters.category_id"
                  class="h-4 w-4 text-black focus:ring-black border-gray-300"
                >
                <label :for="'cat_'+cat.id" class="ml-3 text-sm text-gray-600 cursor-pointer">{{ cat.name }}</label>
              </div>
            </div>
          </div>

          <div class="border-t py-4">
            <h3 class="font-semibold mb-3">Brands</h3>
            <div class="space-y-2 max-h-48 overflow-y-auto">
              <div class="flex items-center">
                <input type="radio" id="brand_all" value="" v-model="filters.brand_id" class="h-4 w-4 text-black focus:ring-black border-gray-300">
                <label for="brand_all" class="ml-3 text-sm text-gray-600 cursor-pointer">All Brands</label>
              </div>
              <div v-for="brand in brands" :key="brand.id" class="flex items-center">
                <input 
                  type="radio" 
                  :id="'brand_'+brand.id" 
                  :value="brand.id" 
                  v-model="filters.brand_id"
                  class="h-4 w-4 text-black focus:ring-black border-gray-300"
                >
                <label :for="'brand_'+brand.id" class="ml-3 text-sm text-gray-600 cursor-pointer">{{ brand.name }}</label>
              </div>
            </div>
          </div>

        </div>
      </aside>

      <div class="w-full md:w-3/4 px-4">
        
        <div class="flex flex-col sm:flex-row justify-between items-center mb-6" data-aos="fade-up" data-aos-delay="300">
          <h1 class="text-3xl font-bold mb-4 sm:mb-0">All Products</h1>
          <div class="flex items-center text-sm text-gray-500">
            <span>Showing {{ products.length }} Items</span>
            <div class="ml-4">
              <select v-model="filters.sort" class="border-gray-300 rounded-md text-sm focus:ring-black focus:border-black py-1">
                <option value="newest">Newest Arrivals</option>
                <option value="low_high">Price: Low to High</option>
                <option value="high_low">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        <div v-if="isLoading" class="flex justify-center py-20">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        </div>

        <div v-else-if="products.length === 0" class="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <p class="text-gray-500 text-lg">No products found matching your filters.</p>
            <button @click="Object.assign(filters, { brand_id: '', category_id: '' })" class="mt-4 text-blue-600 font-semibold hover:underline">Clear Filters</button>
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="(product, idx) in products"
            :key="product.id"
            class="group cursor-pointer"
            :data-aos="'fade-up'"
            :data-aos-delay="idx * 50"
            @click="goToDetail(product.id)"
          >
            <div class="bg-gray-100 rounded-2xl relative overflow-hidden aspect-square mb-3">
               <span 
                class="absolute top-3 left-3 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider text-white shadow-sm z-10"
                :class="product.condition >= 4 ? 'bg-black' : 'bg-orange-500'"
               >
                 {{ product.condition === 5 ? 'Like New' : 'Used' }}
               </span>

               <img
                :src="product.image || 'https://via.placeholder.com/300'"
                :alt="product.name"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
               />

               <div class="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <button class="bg-white text-black px-6 py-2 rounded-full font-bold text-sm shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    View Detail
                  </button>
               </div>
            </div>

            <div class="space-y-1">
               <div class="flex justify-between items-start">
                 <div>
                    <h3 class="font-bold text-gray-900 text-lg leading-tight group-hover:text-blue-700 transition-colors">{{ product.name }}</h3>
                    <p class="text-xs text-gray-500 uppercase tracking-wide">{{ product.brand_name }} • {{ product.category_name }}</p>
                 </div>
               </div>

               <div class="flex items-center gap-1">
                 <div class="flex text-yellow-400">
                    <svg v-for="i in 5" :key="i" class="w-3.5 h-3.5" :class="i <= product.condition ? 'fill-current' : 'text-gray-300'" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                 </div>
                 <span class="text-xs text-gray-400">({{ product.condition }}/5 Cond.)</span>
               </div>
               
               <p class="font-bold text-gray-900 text-lg">
                 {{ formatRp(product.price) }}
               </p>
            </div>
          </div>
        </div>

        <div v-if="products.length > 0" class="flex justify-center mt-12 border-t border-gray-100 pt-8">
            <span class="text-sm text-gray-400">Showing all available products</span>
        </div>

      </div>
    </div>
  </main>
</template>

<style scoped>
/* Transisi halus */
</style>