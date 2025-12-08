<script setup>
import { reactive } from 'vue';

// Data Dummy untuk simulasi tampilan Detail
const productDetail = reactive({
  name: 'New Balance 550 White Green',
  category: 1, // ID Category (Shoes)
  description: 'The New Balance 550 White Green is a vintage basketball-inspired sneaker featuring a premium leather upper, perforated details, and signature "N" branding.',
  size: '42',
  sizePrice: 'Rp 120.000',
  price: 'Rp 2.500.000',
  coverPhoto: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
  morePhotos: [
    'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
  ]
});

// Dummy categories untuk mapping select box
const categories = [
  { id: 1, name: 'Shoes' },
  { id: 2, name: 'Apparel' },
  { id: 3, name: 'Accessories' },
];
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col gap-2">
      <h1 class="text-3xl font-semibold">Detail Product</h1>

      <!-- Breadcrumb -->
      <nav class="text-sm font-medium text-gray-500" aria-label="Breadcrumb">
        <ol class="list-none p-0 inline-flex items-center space-x-2">
          <li><span>Katalog</span></li>
          <li><span class="mx-2">></span></li>
          <li><span>Destinations</span></li>
          <li><span class="mx-2">></span></li>
          <li class="text-gray-800"><span>Detail Product</span></li>
        </ol>
      </nav>
    </div>

    <!-- Content Card -->
    <div class="flex flex-col rounded-3xl border border-gray-300 bg-white">
      <div class="p-8">

        <form @submit.prevent>
          <div class="space-y-6">

            <!-- Cover Photo Display -->
            <div>
              <label class="block text-base font-semibold text-gray-800 mb-2">Cover Photo</label>
              <div class="relative w-full h-64 rounded-2xl overflow-hidden shadow-sm">
                <img :src="productDetail.coverPhoto" alt="Cover" class="w-full h-full object-cover">
              </div>
            </div>

            <!-- Name Input (Read Only) -->
            <div>
              <label class="block text-base font-semibold text-gray-800 mb-2">Name</label>
              <input
                :value="productDetail.name"
                disabled
                type="text"
                class="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none bg-gray-100 text-gray-600 cursor-not-allowed"
              >
            </div>

            <!-- Category Select (Read Only) -->
            <div>
              <label class="block text-base font-semibold text-gray-800 mb-2">Category</label>
              <div class="relative">
                <select
                  :value="productDetail.category"
                  disabled
                  class="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none appearance-none bg-gray-100 text-gray-600 cursor-not-allowed"
                >
                  <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                  <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>

            <!-- Description Textarea (Read Only) -->
            <div>
              <label class="block text-base font-semibold text-gray-800 mb-2">Description</label>
              <textarea
                :value="productDetail.description"
                disabled
                rows="4"
                class="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none bg-gray-100 text-gray-600 cursor-not-allowed resize-none"
              ></textarea>
            </div>

            <!-- Size & Price Split (Read Only) -->
            <div>
              <label class="block text-base font-semibold text-gray-800 mb-2">Size</label>
              <div class="flex items-center gap-3">
                <input
                  :value="productDetail.size"
                  disabled
                  type="text"
                  class="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none bg-gray-100 text-gray-600 cursor-not-allowed"
                >
                <span class="text-gray-500 font-bold">-</span>
                <input
                  :value="productDetail.sizePrice"
                  disabled
                  type="text"
                  class="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none bg-gray-100 text-gray-600 cursor-not-allowed"
                >
              </div>
            </div>

            <!-- Price Input (Read Only) -->
            <div>
              <label class="block text-base font-semibold text-gray-800 mb-2">Price</label>
              <input
                :value="productDetail.price"
                disabled
                type="text"
                class="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none bg-gray-100 text-gray-600 cursor-not-allowed"
              >
            </div>

            <!-- More Photo Display -->
            <div>
              <label class="block text-base font-semibold text-gray-800 mb-2">More Photo</label>

              <!-- Photos Grid -->
              <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div v-for="(photo, index) in productDetail.morePhotos" :key="index" class="relative group">
                  <img :src="photo" class="w-full h-32 object-cover rounded-xl shadow-sm" alt="Product variation">

                  <!-- Tanda X (Hanya visual sesuai gambar, tidak ada fungsi delete) -->
                  <div class="absolute -top-2 -right-2 bg-white text-gray-400 rounded-full p-1 shadow-md cursor-not-allowed">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                </div>
              </div>
              <!-- Tidak ada kotak upload karena ini halaman Detail -->
            </div>

          </div>

          <!-- Action Buttons -->
          <div class="mt-8 flex items-center space-x-4">
            <router-link
              :to="{ name: 'Products' }"
              class="bg-white text-gray-800 font-semibold px-8 py-3 border border-gray-300 rounded-full hover:bg-gray-100 transition duration-300 flex items-center justify-center min-w-[120px]"
            >
              Back
            </router-link>
          </div>
        </form>

      </div>
    </div>
  </div>
</template>

<style scoped>
/* Styling tambahan jika diperlukan */
</style>
