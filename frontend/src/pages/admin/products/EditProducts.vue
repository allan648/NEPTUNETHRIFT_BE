<script setup>
import { reactive, ref, onMounted } from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useRouter, useRoute } from 'vue-router'; // Butuh useRoute untuk ambil ID

const router = useRouter();
const route = useRoute(); // <--- Untuk ambil ID dari URL
const API_URL = "http://localhost:3000/api";

const form = reactive({
  name: '',
  category_id: '',
  brand_id: '',
  condition: 5,
  size: '',
  price: '',
  description: ''
});

// State File & Preview
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

// FUNGSI PENTING: Ambil data produk lama
const fetchProductData = async () => {
  try {
    const id = route.params.id; // Ambil ID dari URL
    const response = await axios.get(`${API_URL}/products/${id}`); // Pakai API Public detail produk yg sudah ada
    const data = response.data.product;

    // Isi Form
    form.name = data.name;
    form.price = data.price;
    form.description = data.description;
    form.condition = data.condition;
    form.size = data.size;
    form.brand_id = data.brand_id;
    form.category_id = data.category_id;

    // Isi Preview (Tampilkan foto lama)
    previews.image = data.image;
    previews.image_2 = data.image_2;
    previews.image_3 = data.image_3;

  } catch (error) {
    Swal.fire("Error", "Gagal mengambil data produk", "error");
    router.push({ name: 'Products' });
  }
};

const handleFileChange = (event, key) => {
  const selectedFile = event.target.files[0];
  if (selectedFile) {
    files[key] = selectedFile;
    previews[key] = URL.createObjectURL(selectedFile); // Ganti preview jadi foto baru
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
    formData.append('category_id', form.category_id);
    
    // Hanya kirim file jika user mengupload file baru
    if (files.image) formData.append('image', files.image);
    if (files.image_2) formData.append('image_2', files.image_2);
    if (files.image_3) formData.append('image_3', files.image_3);

    const id = route.params.id;
    // Pakai Method PUT untuk Update
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
  await fetchProductData(); // Load data saat halaman dibuka
});
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-2">
      <h1 class="text-3xl font-semibold">Edit Product</h1>
    </div>

    <div class="flex flex-col rounded-3xl border border-gray-300 bg-white">
      <div class="p-8">
        <form @submit.prevent="updateProduct">
          <div class="space-y-8">

            <div>
              <label class="block text-base font-semibold text-gray-800 mb-4">Product Photos</label>
              <div class="flex flex-wrap gap-6">
                <div class="flex flex-col gap-2">
                   <span class="text-xs font-bold text-gray-500 uppercase">Main Photo</span>
                   <div class="w-40 h-40 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50 flex flex-col items-center justify-center cursor-pointer overflow-hidden relative group" @click="$refs.inputImage1.click()">
                    <input type="file" ref="inputImage1" class="hidden" accept="image/*" @change="(e) => handleFileChange(e, 'image')" />
                    <img v-if="previews.image" :src="previews.image" class="absolute inset-0 w-full h-full object-cover" />
                    <div v-else class="text-gray-400">📷 Upload</div>
                    <div class="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center text-white font-bold text-sm">Change</div>
                  </div>
                </div>

                <div class="flex flex-col gap-2">
                   <span class="text-xs font-bold text-gray-500 uppercase">Side / Back</span>
                   <div class="w-40 h-40 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50 flex flex-col items-center justify-center cursor-pointer overflow-hidden relative group" @click="$refs.inputImage2.click()">
                    <input type="file" ref="inputImage2" class="hidden" accept="image/*" @change="(e) => handleFileChange(e, 'image_2')" />
                    <img v-if="previews.image_2" :src="previews.image_2" class="absolute inset-0 w-full h-full object-cover" />
                    <div v-else class="text-gray-400">📷 Upload</div>
                    <div class="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center text-white font-bold text-sm">Change</div>
                  </div>
                </div>

                <div class="flex flex-col gap-2">
                   <span class="text-xs font-bold text-gray-500 uppercase">Detail / Tag</span>
                   <div class="w-40 h-40 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50 flex flex-col items-center justify-center cursor-pointer overflow-hidden relative group" @click="$refs.inputImage3.click()">
                    <input type="file" ref="inputImage3" class="hidden" accept="image/*" @change="(e) => handleFileChange(e, 'image_3')" />
                    <img v-if="previews.image_3" :src="previews.image_3" class="absolute inset-0 w-full h-full object-cover" />
                    <div v-else class="text-gray-400">📷 Upload</div>
                    <div class="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center text-white font-bold text-sm">Change</div>
                  </div>
                </div>
              </div>
            </div>

            <hr class="border-gray-200">

            <div class="space-y-6">
                <div>
                  <label class="block text-base font-semibold text-gray-800 mb-2">Product Name</label>
                  <input v-model="form.name" type="text" class="w-full px-4 py-3 border border-gray-300 rounded-full" >
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label class="block text-base font-semibold text-gray-800 mb-2">Brand</label>
                        <select v-model="form.brand_id" class="w-full px-4 py-3 border border-gray-300 rounded-full bg-white">
                            <option v-for="brand in brands" :key="brand.id" :value="brand.id">{{ brand.name }}</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-base font-semibold text-gray-800 mb-2">Category</label>
                        <select v-model="form.category_id" class="w-full px-4 py-3 border border-gray-300 rounded-full bg-white">
                            <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                        </select>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label class="block text-base font-semibold text-gray-800 mb-2">Size</label>
                      <input v-model="form.size" type="number" class="w-full px-4 py-3 border border-gray-300 rounded-full">
                    </div>
                    <div>
                      <label class="block text-base font-semibold text-gray-800 mb-2">Price (Rp)</label>
                      <input v-model="form.price" type="number" class="w-full px-4 py-3 border border-gray-300 rounded-full">
                    </div>
                </div>

                <div>
                    <label class="block text-base font-semibold text-gray-800 mb-2">Condition</label>
                    <select v-model="form.condition" class="w-full px-4 py-3 border border-gray-300 rounded-full bg-white">
                        <option :value="5">✨ 5 - Like New</option>
                        <option :value="4">👌 4 - Excellent</option>
                        <option :value="3">🛡️ 3 - Good</option>
                        <option :value="2">⚠️ 2 - Fair</option>
                        <option :value="1">💀 1 - Bad</option>
                    </select>
                </div>

                <div>
                  <label class="block text-base font-semibold text-gray-800 mb-2">Description</label>
                  <textarea v-model="form.description" rows="4" class="w-full px-4 py-3 border border-gray-300 rounded-2xl resize-none"></textarea>
                </div>
            </div>

            <div class="mt-8 flex items-center space-x-4">
              <button type="submit" :disabled="isLoading" class="bg-blue-900 text-white font-semibold px-8 py-3 rounded-full hover:bg-blue-800 transition disabled:opacity-50">
                <span v-if="isLoading">Updating...</span>
                <span v-else>Save Changes</span>
              </button>
              <router-link :to="{ name: 'Products' }" class="bg-white text-gray-800 font-semibold px-8 py-3 border border-gray-300 rounded-full hover:bg-gray-100">Cancel</router-link>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>