<script setup>
import { reactive, ref, onMounted } from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const API_URL = "http://localhost:3000/api";

const form = reactive({
  name: '',
  category_id: '',
  brand_id: '',
  condition: 5,
  size: '',
  price: '',
  description: '',
  is_promotion: 0, 
  discount_price: 0
});

const files = reactive({ image: null, image_2: null, image_3: null });
const previews = reactive({ image: null, image_2: null, image_3: null });
const categories = ref([]);
const brands = ref([]);
const isLoading = ref(false);

// --- FUNCTIONS ---

const fetchMetadata = async () => {
  try {
    const response = await axios.get(`${API_URL}/admin/products/metadata`);
    brands.value = response.data.brands;
    categories.value = response.data.categories;
  } catch (error) { console.error(error); }
};

const fetchProductData = async () => {
  try {
    const id = route.params.id;
    const response = await axios.get(`${API_URL}/products/${id}`);
    const data = response.data.product;

    form.name = data.name;
    form.price = data.price;
    form.description = data.description;
    form.condition = data.condition;
    form.size = data.size;
    form.brand_id = data.brand_id;
    form.category_id = data.category_id;
    form.is_promotion = data.is_promotion;
    form.discount_price = data.discount_price;

    previews.image = data.image;
    previews.image_2 = data.image_2;
    previews.image_3 = data.image_3;
  } catch (error) {
    Swal.fire("Error", "Gagal mengambil data produk", "error");
    router.push({ name: 'Products' });
  }
};

// --- FUNGSI REUSABLE UNTUK INPUT DISKON ---
const askForDiscount = async () => {
  if (!form.price || form.price <= 0) {
    Swal.fire('Peringatan', 'Isi harga utama produk terlebih dahulu!', 'warning');
    form.is_promotion = 0;
    return false;
  }

  const { value: discountPercent } = await Swal.fire({
    title: 'Atur Diskon Produk',
    input: 'number',
    inputLabel: 'Masukkan persentase diskon (1-99)',
    inputPlaceholder: 'Contoh: 20',
    showCancelButton: true,
    confirmButtonColor: '#1e3a8a',
    inputAttributes: { min: 1, max: 99 },
    inputValidator: (value) => {
      if (!value || value < 1 || value > 99) {
        return 'Masukkan angka antara 1 sampai 99%';
      }
    }
  });

  if (discountPercent) {
    const reduction = (form.price * discountPercent) / 100;
    form.discount_price = Math.round(form.price - reduction);
    
    Swal.fire({
      icon: 'success',
      title: 'Diskon Terpasang!',
      text: `Harga promo menjadi: Rp ${form.discount_price.toLocaleString()}`,
      timer: 1500,
      showConfirmButton: false
    });
    return true;
  }
  return false;
};

// --- HANDLE TOGGLE CHECKBOX ---
const handlePromotionToggle = async () => {
  if (form.is_promotion) {
    const success = await askForDiscount();
    if (!success) {
      // Jika cancel atau gagal, kembalikan checkbox ke mati
      form.is_promotion = 0;
      form.discount_price = 0;
    }
  } else {
    // Jika uncheck, reset harga diskon
    form.discount_price = 0;
  }
};

const handleFileChange = (event, key) => {
  const selectedFile = event.target.files[0];
  if (selectedFile) {
    files[key] = selectedFile;
    previews[key] = URL.createObjectURL(selectedFile);
  }
};

const updateProduct = async () => {
  isLoading.value = true;
  try {
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('price', form.price);
    formData.append('description', form.description);
    formData.append('condition', form.condition);
    formData.append('size', form.size);
    formData.append('brand_id', form.brand_id);
    formData.append('is_promotion', form.is_promotion ? 1 : 0);
    formData.append('discount_price', form.discount_price || 0);
    formData.append('category_id', form.category_id);
    
    if (files.image) formData.append('image', files.image);
    if (files.image_2) formData.append('image_2', files.image_2);
    if (files.image_3) formData.append('image_3', files.image_3);

    const id = route.params.id;
    await axios.put(`${API_URL}/admin/products/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    Swal.fire('Sukses!', 'Produk berhasil diperbarui', 'success');
    router.push({ name: 'Products' });

  } catch (error) {
    console.error(error);
    Swal.fire('Gagal', 'Terjadi kesalahan sistem', 'error');
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  await fetchMetadata();
  await fetchProductData();
});
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-2">
      <h1 class="text-3xl font-semibold text-gray-800">Edit Product</h1>
    </div>

    <div class="flex flex-col rounded-3xl border border-gray-300 bg-white shadow-sm overflow-hidden">
      <div class="p-8">
        <form @submit.prevent="updateProduct">
          <div class="space-y-8">

            <div>
              <label class="block text-base font-semibold text-gray-800 mb-4 uppercase tracking-widest">Product Photos</label>
              <div class="flex flex-wrap gap-6">
                <div class="flex flex-col gap-2">
                   <span class="text-[10px] font-bold text-gray-400 uppercase">Main Photo</span>
                   <div class="w-40 h-40 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50 flex flex-col items-center justify-center cursor-pointer overflow-hidden relative group" @click="$refs.inputImage1.click()">
                    <input type="file" ref="inputImage1" class="hidden" accept="image/*" @change="(e) => handleFileChange(e, 'image')" />
                    <img v-if="previews.image" :src="previews.image" class="absolute inset-0 w-full h-full object-cover" />
                    <div v-else class="text-gray-400 text-xs">📷 Upload</div>
                    <div class="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center text-white font-bold text-xs">CHANGE</div>
                  </div>
                </div>
                <div class="flex flex-col gap-2">
                   <span class="text-[10px] font-bold text-gray-400 uppercase">Side View</span>
                   <div class="w-40 h-40 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50 flex flex-col items-center justify-center cursor-pointer overflow-hidden relative group" @click="$refs.inputImage2.click()">
                    <input type="file" ref="inputImage2" class="hidden" accept="image/*" @change="(e) => handleFileChange(e, 'image_2')" />
                    <img v-if="previews.image_2" :src="previews.image_2" class="absolute inset-0 w-full h-full object-cover" />
                    <div v-else class="text-gray-400 text-xs">📷 Upload</div>
                    <div class="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center text-white font-bold text-xs">CHANGE</div>
                  </div>
                </div>
                <div class="flex flex-col gap-2">
                   <span class="text-[10px] font-bold text-gray-400 uppercase">Details</span>
                   <div class="w-40 h-40 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50 flex flex-col items-center justify-center cursor-pointer overflow-hidden relative group" @click="$refs.inputImage3.click()">
                    <input type="file" ref="inputImage3" class="hidden" accept="image/*" @change="(e) => handleFileChange(e, 'image_3')" />
                    <img v-if="previews.image_3" :src="previews.image_3" class="absolute inset-0 w-full h-full object-cover" />
                    <div v-else class="text-gray-400 text-xs">📷 Upload</div>
                    <div class="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center text-white font-bold text-xs">CHANGE</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
              <div>
                <label class="block text-base font-semibold text-gray-800 mb-2">Price (Rp)</label>
                <input v-model="form.price" type="number" class="w-full px-5 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 outline-none transition">
              </div>

              <div class="flex items-center space-x-4 p-4 bg-gray-50 border border-gray-200 rounded-3xl shadow-sm">
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="form.is_promotion" :true-value="1" :false-value="0" @change="handlePromotionToggle" class="sr-only peer">
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-900"></div>
                </label>
                <div class="flex-1">
                  <span class="text-sm font-bold text-gray-800 uppercase tracking-tight">Aktifkan Promo?</span>
                  
                  <div v-if="form.is_promotion && form.discount_price > 0" class="flex items-center gap-3 mt-1">
                    <p class="text-sm text-green-600 font-black">
                      Rp {{ form.discount_price.toLocaleString() }}
                    </p>
                    <button 
                      type="button" 
                      @click="askForDiscount" 
                      class="text-[10px] bg-blue-700 text-white px-3 py-1 rounded-full font-bold hover:bg-blue-800 transition shadow-sm active:scale-95"
                    >
                      UBAH DISKON
                    </button>
                  </div>
                  <p v-else class="text-xs text-gray-400 italic">Toggle untuk pasang harga coret</p>
                </div>
              </div>
            </div>

            <hr class="border-gray-100">

            <div class="space-y-6">
              <div>
                <label class="block text-base font-semibold text-gray-800 mb-2">Product Name</label>
                <input v-model="form.name" type="text" class="w-full px-5 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 outline-none">
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-base font-semibold text-gray-800 mb-2">Brand</label>
                  <select v-model="form.brand_id" class="w-full px-5 py-3 border border-gray-300 rounded-full bg-white cursor-pointer">
                    <option v-for="brand in brands" :key="brand.id" :value="brand.id">{{ brand.name }}</option>
                  </select>
                </div>
                <div>
                  <label class="block text-base font-semibold text-gray-800 mb-2">Category</label>
                  <select v-model="form.category_id" class="w-full px-5 py-3 border border-gray-300 rounded-full bg-white cursor-pointer">
                    <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                  </select>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-base font-semibold text-gray-800 mb-2">Size</label>
                  <input v-model="form.size" type="number" class="w-full px-5 py-3 border border-gray-300 rounded-full" placeholder="Contoh: 42">
                </div>
                <div>
                  <label class="block text-base font-semibold text-gray-800 mb-2">Condition</label>
                  <select v-model="form.condition" class="w-full px-5 py-3 border border-gray-300 rounded-full bg-white cursor-pointer">
                    <option :value="5">✨ 5 - Like New</option>
                    <option :value="4">👌 4 - Excellent</option>
                    <option :value="3">🛡️ 3 - Good</option>
                    <option :value="2">⚠️ 2 - Fair</option>
                    <option :value="1">💀 1 - Bad</option>
                  </select>
                </div>
              </div>

              <div>
                <label class="block text-base font-semibold text-gray-800 mb-2">Description</label>
                <textarea v-model="form.description" rows="4" class="w-full px-6 py-4 border border-gray-300 rounded-3xl resize-none focus:ring-2 focus:ring-blue-500 outline-none"></textarea>
              </div>
            </div>

            <div class="mt-8 flex items-center gap-4">
              <button type="submit" :disabled="isLoading" class="flex-1 bg-blue-900 text-white font-bold px-10 py-4 rounded-full hover:bg-blue-800 transition disabled:opacity-50 shadow-lg active:scale-95 uppercase tracking-widest">
                <span v-if="isLoading">Syncing...</span>
                <span v-else>Apply Changes</span>
              </button>
              <router-link :to="{ name: 'Products' }" class="flex-1 bg-white text-gray-800 font-bold px-10 py-4 border-2 border-gray-200 rounded-full hover:bg-gray-50 transition text-center uppercase tracking-widest shadow-sm">
                Cancel
              </router-link>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>