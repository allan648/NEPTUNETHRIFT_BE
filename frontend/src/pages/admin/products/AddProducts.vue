<script setup>
import { reactive, ref, onMounted } from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useRouter } from 'vue-router';

const router = useRouter();
const API_URL = "http://localhost:3000/api";

// --- STATE ---
const form = reactive({
  name: '',
  category_id: '',
  brand_id: '',
  condition: 5,
  size: '',
  price: '',
  description: ''
});

// State untuk 3 Gambar
const files = reactive({
  image: null,
  image_2: null,
  image_3: null
});

const previews = reactive({
  image: null,
  image_2: null,
  image_3: null
});

const categories = ref([]);
const brands = ref([]);
const isLoading = ref(false);

// --- FUNCTIONS ---

const fetchMetadata = async () => {
  try {
    const response = await axios.get(`${API_URL}/admin/products/metadata`);
    brands.value = response.data.brands;
    categories.value = response.data.categories;
  } catch (error) {
    console.error("Gagal load metadata", error);
  }
};

// Handle File Upload (General Function)
const handleFileChange = (event, key) => {
  const selectedFile = event.target.files[0];
  if (selectedFile) {
    files[key] = selectedFile;
    previews[key] = URL.createObjectURL(selectedFile);
  }
};

const createProduct = async () => {
  // Validasi Wajib (Minimal foto utama harus ada)
  if (!form.name || !form.price || !form.size || !form.category_id || !form.brand_id || !files.image) {
    Swal.fire('Ups!', 'Data belum lengkap (Pastikan Foto Utama terisi).', 'warning');
    return;
  }

  isLoading.value = true;

  try {
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('price', form.price);
    formData.append('description', form.description);
    formData.append('condition', form.condition);
    formData.append('size', form.size);
    formData.append('brand_id', form.brand_id);
    formData.append('category_id', form.category_id);
    
    // Append 3 Images
    if (files.image) formData.append('image', files.image);
    if (files.image_2) formData.append('image_2', files.image_2);
    if (files.image_3) formData.append('image_3', files.image_3);

    await axios.post(`${API_URL}/admin/products`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    Swal.fire('Sukses!', 'Produk berhasil ditambahkan', 'success');
    router.push({ name: 'Products' });

  } catch (error) {
    console.error(error);
    Swal.fire('Gagal', 'Terjadi kesalahan sistem', 'error');
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchMetadata();
});
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-2">
      <h1 class="text-3xl font-semibold">Add Product</h1>
    </div>

    <div class="flex flex-col rounded-3xl border border-gray-300 bg-white">
      <div class="p-8">
        <form @submit.prevent="createProduct">
          <div class="space-y-8">
            <div>
              <label class="block text-base font-semibold text-gray-800 mb-4">Product Photos</label>
              
              <div class="flex flex-wrap gap-6">
                
                <div class="flex flex-col gap-2">
                   <span class="text-xs font-bold text-gray-500 uppercase tracking-wide">Main Photo *</span>
                   <div 
                    class="w-40 h-40 border-2 border-dashed border-blue-900/40 rounded-2xl bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 transition-colors overflow-hidden relative group"
                    @click="$refs.inputImage1.click()"
                  >
                    <input type="file" ref="inputImage1" class="hidden" accept="image/*" @change="(e) => handleFileChange(e, 'image')" />
                    <img v-if="previews.image" :src="previews.image" class="absolute inset-0 w-full h-full object-cover" />
                    <div v-else class="flex flex-col items-center p-2 text-center">
                        <div class="bg-white p-2 rounded-full shadow-sm mb-1">📷</div>
                        <span class="text-[10px] font-semibold text-blue-900">Upload<br>Main</span>
                    </div>
                  </div>
                </div>

                <div class="flex flex-col gap-2">
                   <span class="text-xs font-bold text-gray-500 uppercase tracking-wide">Side / Back</span>
                   <div 
                    class="w-40 h-40 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors overflow-hidden relative group"
                    @click="$refs.inputImage2.click()"
                  >
                    <input type="file" ref="inputImage2" class="hidden" accept="image/*" @change="(e) => handleFileChange(e, 'image_2')" />
                    <img v-if="previews.image_2" :src="previews.image_2" class="absolute inset-0 w-full h-full object-cover" />
                    <div v-else class="flex flex-col items-center p-2 text-center">
                        <div class="bg-white p-2 rounded-full shadow-sm mb-1 text-gray-400">📷</div>
                        <span class="text-[10px] font-semibold text-gray-500">Upload<br>Side</span>
                    </div>
                  </div>
                </div>

                <div class="flex flex-col gap-2">
                   <span class="text-xs font-bold text-gray-500 uppercase tracking-wide">Detail / Tag</span>
                   <div 
                    class="w-40 h-40 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors overflow-hidden relative group"
                    @click="$refs.inputImage3.click()"
                  >
                    <input type="file" ref="inputImage3" class="hidden" accept="image/*" @change="(e) => handleFileChange(e, 'image_3')" />
                    <img v-if="previews.image_3" :src="previews.image_3" class="absolute inset-0 w-full h-full object-cover" />
                    <div v-else class="flex flex-col items-center p-2 text-center">
                        <div class="bg-white p-2 rounded-full shadow-sm mb-1 text-gray-400">📷</div>
                        <span class="text-[10px] font-semibold text-gray-500">Upload<br>Detail</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            <hr class="border-gray-200">

            <div class="space-y-6">
                <div>
                  <label class="block text-base font-semibold text-gray-800 mb-2">Product Name *</label>
                  <input v-model="form.name" type="text" class="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200" placeholder="Ex: Nike Air Jordan 1">
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label class="block text-base font-semibold text-gray-800 mb-2">Brand *</label>
                        <div class="relative">
                            <select v-model="form.brand_id" class="w-full px-4 py-3 border border-gray-300 rounded-full bg-white appearance-none">
                                <option value="" disabled>Select Brand</option>
                                <option v-for="brand in brands" :key="brand.id" :value="brand.id">{{ brand.name }}</option>
                            </select>
                            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">▼</div>
                        </div>
                    </div>
                    <div>
                        <label class="block text-base font-semibold text-gray-800 mb-2">Category *</label>
                        <div class="relative">
                            <select v-model="form.category_id" class="w-full px-4 py-3 border border-gray-300 rounded-full bg-white appearance-none">
                                <option value="" disabled>Select Category</option>
                                <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                            </select>
                            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">▼</div>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label class="block text-base font-semibold text-gray-800 mb-2">Size (Number) *</label>
                      <input v-model="form.size" type="number" class="w-full px-4 py-3 border border-gray-300 rounded-full" placeholder="Ex: 40">
                    </div>
                    <div>
                      <label class="block text-base font-semibold text-gray-800 mb-2">Price (Rp) *</label>
                      <input v-model="form.price" type="number" class="w-full px-4 py-3 border border-gray-300 rounded-full" placeholder="Ex: 1500000">
                    </div>
                </div>

                <div>
                    <label class="block text-base font-semibold text-gray-800 mb-2">Condition (1-5) *</label>
                    <div class="relative">
                        <select v-model="form.condition" class="w-full px-4 py-3 border border-gray-300 rounded-full bg-white appearance-none">
                            <option :value="5">✨ 5 - Like New</option>
                            <option :value="4">👌 4 - Excellent</option>
                            <option :value="3">🛡️ 3 - Good</option>
                            <option :value="2">⚠️ 2 - Fair</option>
                            <option :value="1">💀 1 - Bad</option>
                        </select>
                        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">▼</div>
                    </div>
                </div>

                <div>
                  <label class="block text-base font-semibold text-gray-800 mb-2">Description</label>
                  <textarea v-model="form.description" rows="4" class="w-full px-4 py-3 border border-gray-300 rounded-2xl resize-none" placeholder="Description..."></textarea>
                </div>
            </div>

            <div class="mt-8 flex items-center space-x-4">
              <button type="submit" :disabled="isLoading" class="bg-blue-900 text-white font-semibold px-8 py-3 rounded-full hover:bg-blue-800 transition disabled:opacity-50">
                <span v-if="isLoading">Uploading...</span>
                <span v-else>Create Product</span>
              </button>
              <router-link :to="{ name: 'Products' }" class="bg-white text-gray-800 font-semibold px-8 py-3 border border-gray-300 rounded-full hover:bg-gray-100">Cancel</router-link>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>