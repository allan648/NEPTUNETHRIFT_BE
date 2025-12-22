<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import Swal from 'sweetalert2';

// --- CONFIG ---
const route = useRoute(); // Ambil ID dari URL
const API_URL = "http://localhost:3000/api";

// --- STATE ---
const product = ref({}); // Tempat menyimpan data asli
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
  if (num === 5) return '✨ 5 - Like New';
  if (num === 4) return '👌 4 - Excellent';
  if (num === 3) return '🛡️ 3 - Good';
  if (num === 2) return '⚠️ 2 - Fair';
  return '💀 1 - Bad';
};

// 3. Fetch Data Produk
const fetchProductDetail = async () => {
  isLoading.value = true;
  try {
    const id = route.params.id;
    // Panggil API Public (karena isinya sama saja: detail produk)
    const response = await axios.get(`${API_URL}/products/${id}`);
    
    // API mengembalikan { product: {...}, related: [...] }
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
  <div class="space-y-6">
    <div class="flex flex-col gap-2">
      <h1 class="text-3xl font-semibold">Detail Product</h1>
      
      <nav class="text-sm font-medium text-gray-500">
         <router-link :to="{ name: 'Products' }" class="hover:text-blue-600">Products</router-link>
         <span class="mx-2">></span>
         <span class="text-gray-800">{{ product.name || 'Loading...' }}</span>
      </nav>
    </div>

    <div v-if="isLoading" class="p-10 text-center bg-white rounded-3xl border border-gray-200">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-700 mx-auto"></div>
        <p class="mt-4 text-gray-500">Loading product details...</p>
    </div>

    <div v-else class="flex flex-col rounded-3xl border border-gray-300 bg-white shadow-sm">
      <div class="p-8">

        <form @submit.prevent>
          <div class="space-y-8">

            <div>
              <label class="block text-base font-semibold text-gray-800 mb-4">Product Photos</label>
              <div class="flex flex-wrap gap-6">
                
                <div class="flex flex-col gap-2">
                   <span class="text-xs font-bold text-gray-500 uppercase">Main Photo</span>
                   <div class="w-40 h-40 rounded-2xl overflow-hidden border border-gray-200 bg-gray-50">
                     <img 
                        :src="product.image || 'https://via.placeholder.com/150'" 
                        class="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                     >
                   </div>
                </div>

                <div class="flex flex-col gap-2">
                   <span class="text-xs font-bold text-gray-500 uppercase">Side / Back</span>
                   <div class="w-40 h-40 rounded-2xl overflow-hidden border border-gray-200 bg-gray-50">
                     <img 
                        v-if="product.image_2"
                        :src="product.image_2" 
                        class="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                     >
                     <div v-else class="w-full h-full flex items-center justify-center text-gray-400 text-xs italic">No Image</div>
                   </div>
                </div>

                <div class="flex flex-col gap-2">
                   <span class="text-xs font-bold text-gray-500 uppercase">Detail / Tag</span>
                   <div class="w-40 h-40 rounded-2xl overflow-hidden border border-gray-200 bg-gray-50">
                     <img 
                        v-if="product.image_3"
                        :src="product.image_3" 
                        class="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                     >
                     <div v-else class="w-full h-full flex items-center justify-center text-gray-400 text-xs italic">No Image</div>
                   </div>
                </div>

              </div>
            </div>

            <hr class="border-gray-200">

            <div class="space-y-6">

                <div>
                  <label class="block text-base font-semibold text-gray-800 mb-2">Product Name</label>
                  <input
                    :value="product.name"
                    disabled
                    type="text"
                    class="w-full px-4 py-3 border border-gray-300 rounded-full bg-gray-50 text-gray-700 cursor-text"
                  >
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label class="block text-base font-semibold text-gray-800 mb-2">Brand</label>
                        <input
                            :value="product.brand_name" 
                            disabled
                            class="w-full px-4 py-3 border border-gray-300 rounded-full bg-gray-50 text-gray-700"
                        >
                    </div>
                    <div>
                        <label class="block text-base font-semibold text-gray-800 mb-2">Category</label>
                        <input
                            :value="product.category_name" 
                            disabled
                            class="w-full px-4 py-3 border border-gray-300 rounded-full bg-gray-50 text-gray-700"
                        >
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label class="block text-base font-semibold text-gray-800 mb-2">Size</label>
                      <input
                        :value="product.size"
                        disabled
                        class="w-full px-4 py-3 border border-gray-300 rounded-full bg-gray-50 text-gray-700"
                      >
                    </div>
                    <div>
                      <label class="block text-base font-semibold text-gray-800 mb-2">Price</label>
                      <input
                        :value="formatRp(product.price)"
                        disabled
                        class="w-full px-4 py-3 border border-gray-300 rounded-full bg-gray-50 text-gray-700 font-medium"
                      >
                    </div>
                </div>

                <div>
                    <label class="block text-base font-semibold text-gray-800 mb-2">Condition</label>
                    <input
                        :value="getConditionText(product.condition)"
                        disabled
                        class="w-full px-4 py-3 border border-gray-300 rounded-full bg-gray-50 text-gray-700"
                    >
                </div>

                <div>
                  <label class="block text-base font-semibold text-gray-800 mb-2">Description</label>
                  <textarea
                    :value="product.description"
                    disabled
                    rows="4"
                    class="w-full px-4 py-3 border border-gray-300 rounded-2xl bg-gray-50 text-gray-700 resize-none"
                  ></textarea>
                </div>
            </div>

          </div>

          <div class="mt-8 flex items-center space-x-4">
            <router-link
              :to="{ name: 'Products' }"
              class="bg-white text-gray-800 font-semibold px-8 py-3 border border-gray-300 rounded-full hover:bg-gray-100 transition duration-300 flex items-center justify-center min-w-[120px]"
            >
              Back
            </router-link>
            
            <router-link
              :to="{ name: 'Editproduct', params: { id: product.id } }"
              class="bg-yellow-400 text-white font-semibold px-8 py-3 rounded-full hover:bg-yellow-500 transition duration-300 flex items-center justify-center min-w-[120px]"
            >
              Edit This
            </router-link>
          </div>
        </form>

      </div>
    </div>
  </div>
</template>