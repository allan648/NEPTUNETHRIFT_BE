<script setup>
import { ref } from 'vue'
import NikeAirMax1 from "@/asset/images/NikeAirMax1.png";
import Vans from "@/asset/images/Vans.png";

// Data Dummy Wishlist
const wishlistItems = ref([
  {
    id: 1,
    name: 'Patta x Nike Air Max 1 Noise Aqua',
    rating: 3.5,
    price: 2400000,
    originalPrice: 2600000,
    discount: 20,
    imageUrl: NikeAirMax1,
  },
  {
    id: 2,
    name: 'Nike Air Force 1 Triple White',
    rating: 4.5,
    price: 1200000,
    originalPrice: null,
    discount: null,
    imageUrl: Vans,
  },
  {
    id: 3,
    name: 'New Balance 550 White Grey',
    rating: 5,
    price: 1890000,
    originalPrice: null,
    discount: null,
    imageUrl: Vans, // Ganti dengan gambar yang sesuai
  },
  {
    id: 4,
    name: 'Adidas Samba OG',
    rating: 4,
    price: 2100000,
    originalPrice: 2500000,
    discount: 15,
    imageUrl: NikeAirMax1, // Ganti dengan gambar yang sesuai
  }
])

const removeFromWishlist = (item) => {
  wishlistItems.value = wishlistItems.value.filter(i => i.id !== item.id);
}

const addToCart = (item) => {
  alert(`${item.name} added to cart!`);
}
</script>

<template>
  <div class="w-full p-4 md:p-8">
    <div class="mx-auto max-w-7xl">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-gray-800">My Wishlist</h1>
        <span class="text-sm text-gray-500">{{ wishlistItems.length }} Items</span>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        
        <div 
          v-for="item in wishlistItems" 
          :key="item.id"
          class="group relative bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300"
        >

          <button
            @click="removeFromWishlist(item)"
            class="absolute top-2 right-2 z-10 p-1.5 bg-white/80 backdrop-blur-sm rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            title="Remove"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
              <path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clip-rule="evenodd" />
            </svg>
          </button>

          <div class="aspect-square w-full bg-gray-50 relative overflow-hidden">
            <img 
              :src="item.imageUrl" 
              :alt="item.name" 
              class="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500" 
            />
            
            <div v-if="item.discount" class="absolute bottom-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm">
              -{{ item.discount }}%
            </div>
          </div>

          <div class="p-3">
            <h3 class="text-sm font-medium text-gray-800 truncate mb-1" :title="item.name">
              {{ item.name }}
            </h3>

            <div class="flex items-center gap-1 mb-2">
              <svg class="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.16c.969 0 1.371 1.24.588 1.81l-3.363 2.444a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.363-2.444a1 1 0 00-1.175 0l-3.363 2.444c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.07 9.384c-.783-.57-.38-1.81.588-1.81h4.16a1 1 0 00.95-.69L9.049 2.927z" />
              </svg>
              <span class="text-xs text-gray-500">{{ item.rating }}</span>
            </div>

            <div class="flex flex-col mb-3">
               <p class="text-sm font-bold text-gray-900">Rp {{ item.price.toLocaleString('id-ID') }}</p>
               <p v-if="item.originalPrice" class="text-[10px] text-gray-400 line-through">
                  Rp {{ item.originalPrice.toLocaleString('id-ID') }}
               </p>
            </div>

            <button 
              @click="addToCart(item)"
              class="w-full flex items-center justify-center gap-2 py-2 rounded-md bg-gray-900 text-white text-xs font-semibold hover:bg-blue-600 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3.5 h-3.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
              Add to Cart
            </button>
          </div>
        </div>

        <div v-if="wishlistItems.length === 0" class="col-span-full flex flex-col items-center justify-center py-16 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12 text-gray-300 mb-2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
          </svg>
          <p class="text-gray-500 text-sm">Wishlist kamu kosong.</p>
          <router-link to="/product" class="text-blue-600 text-sm font-semibold mt-1 hover:underline">Cari barang sekarang</router-link>
        </div>

      </div>
    </div>
  </div>
</template>