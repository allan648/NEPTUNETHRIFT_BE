<script setup>
import { reactive } from 'vue';

// State untuk data form
const productData = reactive({
  name: '',
  category: '',
  description: '',
  size: '',
  sizePrice: '',
  price: '',
  coverPhoto: null,
  morePhotos: []
});

// Dummy categories
const categories = [
  { id: 1, name: 'Shoes' },
  { id: 2, name: 'Apparel' },
  { id: 3, name: 'Accessories' },
];

// Fungsi simulasi upload
const handleFileUpload = (event, type) => {
  console.log(`File uploaded for ${type}`);
  // Logika handle file
};

// Fungsi submit
const createProduct = () => {
  console.log('Product Data:', productData);
  // Logika kirim ke API
};
</script>

<template>
  <div class="space-y-6">
    <!-- Header (Struktur sama dengan CreateAdmin) -->
    <div class="flex flex-col gap-2">
      <h1 class="text-3xl font-semibold">Add Product</h1>
    </div>

    <!-- Content Card -->
    <div class="flex flex-col rounded-3xl border border-gray-300 bg-white">
      <div class="p-8">

        <form @submit.prevent="createProduct">
          <div class="space-y-6">

            <!-- Cover Photo Upload -->
            <div>
              <label class="block text-base font-semibold text-gray-800 mb-2">Cover Photo</label>
              <div
                class="border-2 border-dashed border-blue-900/50 rounded-2xl bg-gray-50 h-48 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 transition-colors"
                @click="$refs.coverInput.click()"
              >
                <input type="file" ref="coverInput" class="hidden" @change="(e) => handleFileUpload(e, 'cover')" />
                <!-- Icon Image Placeholder -->
                <div class="bg-white p-3 rounded-lg shadow-sm mb-2">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-blue-900">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                </div>
                <p class="text-sm font-semibold text-blue-900">Click to add photos</p>
                <p class="text-xs text-gray-500 mt-1">or drag & drop</p>
              </div>
            </div>

            <!-- Name Input -->
            <div>
              <label for="name" class="block text-base font-semibold text-gray-800 mb-2">Name</label>
              <input
                v-model="productData.name"
                type="text"
                id="name"
                placeholder="Name of destination"
                class="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              >
            </div>

            <!-- Category Select -->
            <div>
              <label for="category" class="block text-base font-semibold text-gray-800 mb-2">Category</label>
              <div class="relative">
                <select
                  v-model="productData.category"
                  id="category"
                  class="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 appearance-none bg-white text-gray-700"
                >
                  <option value="" disabled selected>Select category</option>
                  <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                  <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>

            <!-- Description Textarea -->
            <div>
              <label for="description" class="block text-base font-semibold text-gray-800 mb-2">Description</label>
              <textarea
                v-model="productData.description"
                id="description"
                rows="4"
                placeholder="Description"
                class="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 resize-none"
              ></textarea>
            </div>

            <!-- Size & Price (Split Row) -->
            <div>
              <label class="block text-base font-semibold text-gray-800 mb-2">Size</label>
              <div class="flex items-center gap-3">
                <input
                  v-model="productData.size"
                  type="text"
                  placeholder="50"
                  class="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                >
                <span class="text-gray-500 font-bold">-</span>
                <input
                  v-model="productData.sizePrice"
                  type="text"
                  placeholder="Rp 120.000"
                  class="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                >
              </div>
            </div>

            <!-- Price Input -->
            <div>
              <label for="price" class="block text-base font-semibold text-gray-800 mb-2">Price</label>
              <input
                v-model="productData.price"
                type="text"
                id="price"
                placeholder="Rp 0"
                class="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              >
            </div>

            <!-- More Photo Upload -->
            <div>
              <label class="block text-base font-semibold text-gray-800 mb-2">More Photo</label>
              <div
                class="border-2 border-dashed border-blue-900/50 rounded-2xl bg-gray-50 h-32 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 transition-colors"
                @click="$refs.morePhotosInput.click()"
              >
                <input type="file" ref="morePhotosInput" multiple class="hidden" @change="(e) => handleFileUpload(e, 'more')" />
                <div class="bg-white p-2 rounded-lg shadow-sm mb-2">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-blue-900">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                </div>
                <p class="text-sm font-semibold text-blue-900">Click to add photos</p>
                <p class="text-xs text-gray-500 mt-0.5">or drag & drop</p>
              </div>
            </div>

          </div>

          <!-- Action Buttons -->
          <div class="mt-8 flex items-center space-x-4">
            <button
              type="submit"
              class="bg-blue-900 text-white font-semibold px-8 py-3 rounded-full hover:bg-blue-800 transition duration-300"
            >
              Create
            </button>

            <router-link
              :to="{ name: 'Products' }"
              class="bg-white text-gray-800 font-semibold px-8 py-3 border border-gray-300 rounded-full hover:bg-gray-100 transition duration-300 flex items-center justify-center"
            >
              Cancel
            </router-link>
          </div>
        </form>

      </div>
    </div>
  </div>
</template>

<style scoped>
/* Styling khusus untuk border dashed agar mirip design */
</style>
