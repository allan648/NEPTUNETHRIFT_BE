<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue';
import axios from 'axios';

// --- CONFIG ---
const API_URL = "http://localhost:3000/api";

// --- STATE ---
const promoProducts = ref([]);
const brands = ref([]);
const categories = ref([]);
const isLoading = ref(true);
const displayLimit = ref(3); // State untuk membatasi tampilan (Awal: 3)

// State Filter
const filters = reactive({
  brand_id: '',
  category_id: ''
});

// --- FUNCTIONS ---

// 1. Ambil Produk & Metadata (Brand/Category)
const fetchData = async () => {
  isLoading.value = true;
  try {
    const [prodRes, metaRes] = await Promise.all([
      axios.get(`${API_URL}/products?promo=true`), 
      axios.get(`${API_URL}/metadata`)
    ]);

    const rawData = prodRes.data.products || prodRes.data;
    if (Array.isArray(rawData)) {
      // Filter: Hanya yang PROMO dan masih ACTIVE (Belum Terjual)
      promoProducts.value = rawData.filter(p => 
        (p.is_promotion === 1 || p.is_promotion === '1') && p.status === 'active'
      );
    }
    
    brands.value = metaRes.data.brands || [];
    categories.value = metaRes.data.categories || [];
  } catch (error) {
    console.error("Gagal memuat data:", error);
  } finally {
    isLoading.value = false;
  }
};

// 2. Logic Filter (Hasil filter murni)
const filteredProducts = computed(() => {
  return promoProducts.value.filter(product => {
    const matchCategory = !filters.category_id || product.category_id == filters.category_id;
    const matchBrand = !filters.brand_id || product.brand_id == filters.brand_id;
    return matchCategory && matchBrand;
  });
});

// 3. Logic Load More (Data yang benar-benar tampil di layar)
const displayedProducts = computed(() => {
  return filteredProducts.value.slice(0, displayLimit.value);
});

// 4. Handle Klik Load More
const handleLoadMore = () => {
  displayLimit.value = filteredProducts.value.length; // Langsung tampilkan semua
};

// 5. Reset Limit saat filter berubah
watch(filters, () => {
  displayLimit.value = 3;
});

const formatRp = (price) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0
  }).format(price);
};

const calculateDiscount = (original, promo) => {
  if (!original || !promo) return 0;
  return Math.round(((original - promo) / original) * 100);
};

onMounted(() => {
  fetchData();
});
</script>

<template>
  <main class="container mx-auto py-8 px-6 sm:px-16 lg:px-[140px] pb-24 md:pb-30">
    <div class="mb-4 text-sm text-gray-500">
      <router-link to="/" class="hover:text-blue-600">Home</router-link>
      <span class="mx-2">></span>
      <span class="font-semibold text-gray-700">Promo</span>
    </div>

    <div class="flex flex-col md:flex-row -mx-4">
      <aside class="w-full md:w-1/4 px-4 mb-8 md:mb-0">
        <div class="sticky top-24 p-6 bg-gray-50 rounded-3xl border border-gray-100">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold text-gray-900">Filters</h2>
            <button 
              @click="Object.assign(filters, { brand_id: '', category_id: '' })"
              class="text-xs text-red-500 font-bold uppercase hover:underline"
            >
              Reset
            </button>
          </div>

          <div class="mb-8">
            <h3 class="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Category</h3>
            <div class="space-y-3">
              <label class="flex items-center cursor-pointer group">
                <input type="radio" value="" v-model="filters.category_id" class="hidden">
                <span class="text-sm transition-all" :class="!filters.category_id ? 'font-bold text-blue-700 underline' : 'text-gray-500 group-hover:text-black'">All Categories</span>
              </label>
              <label v-for="cat in categories" :key="cat.id" class="flex items-center cursor-pointer group">
                <input type="radio" :value="cat.id" v-model="filters.category_id" class="hidden">
                <span class="text-sm transition-all" :class="filters.category_id == cat.id ? 'font-bold text-blue-700 underline' : 'text-gray-500 group-hover:text-black'">{{ cat.name }}</span>
              </label>
            </div>
          </div>

          <div>
            <h3 class="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Brand</h3>
            <div class="space-y-3">
              <label class="flex items-center cursor-pointer group">
                <input type="radio" value="" v-model="filters.brand_id" class="hidden">
                <span class="text-sm transition-all" :class="!filters.brand_id ? 'font-bold text-blue-700 underline' : 'text-gray-500 group-hover:text-black'">All Brands</span>
              </label>
              <label v-for="brand in brands" :key="brand.id" class="flex items-center cursor-pointer group">
                <input type="radio" :value="brand.id" v-model="filters.brand_id" class="hidden">
                <span class="text-sm transition-all" :class="filters.brand_id == brand.id ? 'font-bold text-blue-700 underline' : 'text-gray-500 group-hover:text-black'">{{ brand.name }}</span>
              </label>
            </div>
          </div>
        </div>
      </aside>

      <div class="w-full md:w-3/4 px-4">
        <div class="flex flex-col sm:flex-row justify-between items-center mb-8">
          <h1 class="text-4xl font-black italic tracking-tighter text-gray-900 uppercase">Special Promo 🔥</h1>
          <div class="text-[10px] text-gray-400 font-black uppercase tracking-widest">
            <span v-if="!isLoading">{{ filteredProducts.length }} Items Found</span>
          </div>
        </div>

        <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div v-for="i in 3" :key="i" class="animate-pulse bg-gray-100 h-96 rounded-3xl"></div>
        </div>

        <div v-else-if="filteredProducts.length === 0" class="text-center py-24 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
            <p class="text-gray-400 font-black uppercase tracking-widest">No promo products match your filters.</p>
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
          <div v-for="product in displayedProducts" :key="product.id" class="group cursor-pointer">
            <div class="bg-gray-100 rounded-3xl mb-4 overflow-hidden relative aspect-square border border-gray-100 shadow-sm transition-all group-hover:shadow-xl">
              <div class="absolute top-4 left-4 z-10 bg-red-600 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg">
                -{{ calculateDiscount(product.price, product.discount_price) }}%
              </div>

              <div class="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[9px] font-black text-gray-800 shadow-sm uppercase tracking-tighter">
                {{ product.condition >= 5 ? '✨ Like New' : '🛡️ Authentic' }}
              </div>
              
              <router-link :to="`/detailproduct/${product.id}`">
                <img :src="product.image" :alt="product.name" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              </router-link>
            </div>

            <div class="px-2">
              <h3 class="font-black text-gray-900 text-lg truncate uppercase tracking-tighter leading-tight group-hover:text-blue-700 transition-colors">{{ product.name }}</h3>
              
              <div class="flex items-center justify-between mt-1 mb-3">
                <p class="text-[10px] text-gray-400 font-black uppercase tracking-widest">{{ product.brand_name }}</p>
                
                <div class="flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">
                  <div class="flex text-yellow-400">
                    <svg v-for="i in 5" :key="i" class="w-2.5 h-2.5" :class="i <= product.condition ? 'fill-current' : 'text-gray-200'" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <span class="text-[9px] text-gray-400 font-black">{{ product.condition || 0 }}/5</span>
                </div>
              </div>
              
              <div class="flex items-center gap-3 mb-4">
                <span class="text-red-600 font-black text-xl tracking-tighter">{{ formatRp(product.discount_price) }}</span>
                <span class="text-gray-300 line-through text-xs font-bold">{{ formatRp(product.price) }}</span>
              </div>

              <router-link :to="`/detailproduct/${product.id}`" class="block w-full text-center bg-gray-900 text-white py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-700 transition-all active:scale-95 shadow-lg">
                View Detail
              </router-link>
            </div>
          </div>
        </div>

        <div v-if="filteredProducts.length > displayLimit" class="flex justify-center items-center mt-16 border-t border-gray-100 pt-10">
           <button 
             @click="handleLoadMore"
             class="px-10 py-3 border-2 border-black rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-black hover:text-white transition-all active:scale-95 shadow-md"
           >
             Load More Collections
           </button>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.sticky {
  position: -webkit-sticky;
  position: sticky;
}
</style>