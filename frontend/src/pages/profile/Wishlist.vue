<script setup>
import { ref } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import NikeAirMax1 from "@/asset/images/NikeAirMax1.png";
import Vans from "@/asset/images/Vans.png";

const wishlistItems = ref([
  {
    id: 1,
    name: 'Patta x Nike Air Max 1',
    rating: 3.5,
    price: 2400000,
    originalPrice: 2600000,
    discount: 20,
    imageUrl: NikeAirMax1,
    isWishlisted: true // 1. Menambahkan state untuk wishlist
  },
  {
    id: 2,
    name: 'Nike Air Force 1',
    rating: 4.5,
    price: 1200000,
    originalPrice: null,
    discount: null,
    imageUrl: Vans,
    isWishlisted: true // 1. Menambahkan state untuk wishlist
  }
])

// 2. Fungsi untuk mengubah status wishlist
const toggleWishlist = (item) => {
  item.isWishlisted = !item.isWishlisted;
  // Di aplikasi nyata, Anda mungkin ingin mengirim perubahan ini ke server
  console.log(`Item ${item.id} isWishlisted: ${item.isWishlisted}`);
}


// Komponen untuk menampilkan bintang rating
const StarRating = {
  props: {
    rating: {
      type: Number,
      required: true
    }
  },
  template: `
    <div class="flex items-center">
      <template v-for="n in 5" :key="n">
        <svg class="w-5 h-5" :class="n <= rating ? 'text-yellow-400' : 'text-gray-300'" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.16c.969 0 1.371 1.24.588 1.81l-3.363 2.444a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.363-2.444a1 1 0 00-1.175 0l-3.363 2.444c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.07 9.384c-.783-.57-.38-1.81.588-1.81h4.16a1 1 0 00.95-.69L9.049 2.927z" />
        </svg>
      </template>
      <span class="text-gray-500 text-sm ml-2">{{ rating }}/5</span>
    </div>
  `
}
</script>

<template>
  <div class="flex">
    <Sidebar />
    <main class="w-full p-8 md:p-12">
      <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl md:text-4xl font-bold text-gray-800 mb-8">Wishlist</h1>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-8">
        <div v-for="item in wishlistItems" :key="item.id"
             class="group relative bg-white rounded-lg shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-xl">

          <!-- 3. Tombol Wishlist (Ikon Hati) -->
          <button
            @click="toggleWishlist(item)"
            class="absolute top-3 right-3 z-10 p-1.5 bg-white rounded-full hover:bg-white transition-colors duration-300"
            aria-label="Toggle Wishlist"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              class="w-6 h-6"
              :class="item.isWishlisted ? 'fill-red-500 stroke-red-500' : 'fill-none stroke-gray-500'"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
          </button>

          <!-- Gambar Produk -->
          <div class="aspect-square w-full overflow-hidden">
            <img :src="item.imageUrl" :alt="item.name" class="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300" />
          </div>

          <!-- Detail Produk -->
          <div class="p-4 flex flex-col gap-1">
            <h3 class="text-lg font-bold text-gray-900 truncate">
              {{ item.name }}
            </h3>

            <StarRating :rating="item.rating" />

            <!-- Info Harga -->
            <div class="flex items-center gap-3 mt-1">
              <p class="text-xl font-bold text-gray-900">Rp.{{ item.price.toLocaleString('id-ID') }}</p>
            </div>
            <div class="flex items-center gap-2 -mt-1" v-if="item.originalPrice">
               <p class="text-md text-gray-400 line-through">
                Rp.{{ item.originalPrice.toLocaleString('id-ID') }}
              </p>
              <span v-if="item.discount" class="text-sm font-semibold text-red-600 bg-red-100 px-2 py-0.5 rounded-md">
                -{{ item.discount }}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</div>
</template>
