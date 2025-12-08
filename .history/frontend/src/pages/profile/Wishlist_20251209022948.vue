<script setup>
import { ref } from 'vue'
// HAPUS IMPORT SIDEBAR

import NikeAirMax1 from "@/asset/images/NikeAirMax1.png";
import Vans from "@/asset/images/Vans.png";

// Data Dummy Wishlist
const wishlistItems = ref([
  {
    id: 1,
    name: 'Patta x Nike Air Max 1',
    rating: 3.5,
    price: 2400000,
    originalPrice: 2600000,
    discount: 20,
    imageUrl: NikeAirMax1,
    isWishlisted: true
  },
  {
    id: 2,
    name: 'Nike Air Force 1',
    rating: 4.5,
    price: 1200000,
    originalPrice: null,
    discount: null,
    imageUrl: Vans,
    isWishlisted: true
  }
])

// Fungsi Hapus dari Wishlist
const removeFromWishlist = (item) => {
  // Hapus item dari array
  wishlistItems.value = wishlistItems.value.filter(i => i.id !== item.id);
  // Di sini nanti panggil API backend untuk delete wishlist
}
</script>

<template>
  <div class="w-full p-6 md:p-10">
    <div class="mx-auto max-w-7xl">
      <h1 class="text-3xl font-bold text-gray-800 mb-8">My Wishlist</h1>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        <div 
          v-for="item in wishlistItems" 
          :key="item.id"
          class="group relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
        >

          <button
            @click="removeFromWishlist(item)"
            class="absolute top-3 right-3 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-red-50 transition-colors duration-200 group-hover:scale-110"
            title="Remove from Wishlist"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 text-red-500">
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>
          </button>

          <div class="aspect-square w-full overflow-hidden bg-gray-50">
            <img 
              :src="item.imageUrl" 
              :alt="item.name" 
              class="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500" 
            />
          </div>

          <div class="p-5 flex flex-col gap-2">
            <h3 class="text-lg font-bold text-gray-900 truncate" :title="item.name">
              {{ item.name }}
            </h3>

            <div class="flex items-center gap-1">
              <svg v-for="n in 5" :key="n" class="w-4 h-4" :class="n <= Math.round(item.rating) ? 'text-yellow-400' : 'text-gray-200'" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.16c.969 0 1.371 1.24.588 1.81l-3.363 2.444a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.363-2.444a1 1 0 00-1.175 0l-3.363 2.444c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.07 9.384c-.783-.57-.38-1.81.588-1.81h4.16a1 1 0 00.95-.69L9.049 2.927z" />
              </svg>
              <span class="text-gray-400 text-xs ml-1">({{ item.rating }})</span>
            </div>

            <div class="mt-2">
               <div class="flex items-baseline gap-2">
                 <p class="text-xl font-bold text-gray-900">Rp. {{ item.price.toLocaleString('id-ID') }}</p>
                 <span v-if="item.originalPrice" class="text-sm text-gray-400 line-through">
                    Rp. {{ item.originalPrice.toLocaleString('id-ID') }}
                 </span>
               </div>
            </div>

            <button class="w-full mt-3 py-2.5 rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-blue-700 transition-colors">
              Add to Cart
            </button>
          </div>
        </div>

        <div v-if="wishlistItems.length === 0" class="col-span-full text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <p class="text-gray-500 text-lg">Your wishlist is empty.</p>
          <router-link to="/product" class="text-blue-600 font-semibold mt-2 inline-block">Explore Products</router-link>
        </div>

      </div>
    </div>
  </div>
</template>