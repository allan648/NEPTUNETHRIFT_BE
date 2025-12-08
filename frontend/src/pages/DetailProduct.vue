<script>
import NikeAirForce1 from "@/asset/images/NikeAirForce1.png";
import NikeAirMax1 from "@/asset/images/NikeAirMax1.png";
import Vans from "@/asset/images/Vans.png";
import NikeShadow from "@/asset/images/NikeShadow.png";
import NewBalance from "@/asset/images/NewBalance.png";
export default {
  name: 'ProductDetailPage',
  data() {
    return {
      product: {
        name: 'ONE LIFE GRAPHIC T-SHIRT',
        rating: 4.5,
        discountPrice: 2600000,
        originalPrice: 3000000,
        discount: '-40%',
        description: 'This graphic t-shirt which is perfect for any occasion. Crafted from a soft and breathable fabric, it offers superior comfort and style.',
        images: [
          NikeAirForce1, // main
          NikeAirMax1, // back
          Vans, // model
        ],
      },
      activeImage: NewBalance,
      // 2. Fitur size diubah menggunakan angka
      availableSizes: [40, 41, 42, 43, 44],
      selectedSize: 42,
      // 1. Fitur quantity dihapus dari data
      relatedProducts: [
        { id: 1, name: 'Polo with Contrast Trims', rating: 4.0, originalPrice: 2420000, discountPrice: 2120000, discount: '-20%', image: Vans },
        { id: 2, name: 'Gradient Graphic T-shirt', rating: 3.5, originalPrice: 1450000, image: NikeAirForce1 },
        { id: 3, name: 'Polo with Tipping Details', rating: 4.5, originalPrice: 1800000, image: NikeAirMax1 },
        { id: 4, name: 'Black Striped T-shirt', rating: 5.0, originalPrice: 1500000, discountPrice: 1200000, discount: '-30%', image: NikeShadow },
      ]
    }
  },
  methods: {
    setActiveImage(image) {
      this.activeImage = image;
    },
    selectSize(size) {
      this.selectedSize = size;
    },
    // 1. Fitur quantity dihapus dari methods
  }
}
</script>

<template>
  <main class="bg-white px-8 sm:px-16 lg:px-[140px] pb-24 md:pb-30">
    <div class="container mx-auto px-4 py-8">
      <!-- Product Details Section -->
      <section class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <!-- Image Gallery -->
        <div class="flex flex-col-reverse md:flex-row gap-4">
          <div class="flex md:flex-col gap-3 justify-center">
            <img
              v-for="(image, index) in product.images"
              :key="index"
              :src="image"
              alt="Product thumbnail"
              class="w-20 h-24 object-cover cursor-pointer rounded-md border-2"
              :class="activeImage === image ? 'border-black' : 'border-transparent'"
              @click="setActiveImage(image)"
            >
          </div>
          <div class="flex-1 bg-gray-100 rounded-lg flex items-center justify-center p-4">
            <img :src="activeImage" alt="Main product" class="w-full max-w-md object-contain">
          </div>
        </div>

        <!-- Product Information -->
        <div>
          <h1 class="text-3xl md:text-4xl font-extrabold mb-2">{{ product.name }}</h1>
          <div class="flex items-center mb-4">

          </div>

          <div class="flex items-baseline gap-3 mb-6"> <!-- Memberi jarak bawah lebih besar -->
            <span class="text-3xl font-bold text-black">Rp.{{ product.discountPrice }}</span>
            <span class="text-2xl text-gray-400 line-through">Rp.{{ product.originalPrice }}</span>
            <span class="bg-red-100 text-red-500 text-sm font-semibold px-2 py-0.5 rounded">{{ product.discount }}</span>
          </div>

          <!-- 3. Deskripsi dihapus dari sini -->

          <div class="mb-6">
            <h3 class="text-sm font-semibold mb-2">Available Sizes</h3>
            <div class="flex gap-2">
              <button
                v-for="size in availableSizes" :key="size"
                @click="selectSize(size)"
                class="px-5 py-2 border rounded-lg text-sm"
                :class="selectedSize === size ? 'bg-black text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
              >
                {{ size }}
              </button>
            </div>
          </div>

          <!-- 1. Fitur quantity dihapus dari sini -->
          <div class="flex items-center gap-4">
            <button class="w-full bg-black text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors">
              Add to Cart
            </button>
          </div>
        </div>
      </section>

      <!-- 3. Deskripsi dipindahkan ke sini -->
      <section class="mt-16">
        <h2 class="text-2xl font-extrabold mb-4">Description</h2>
        <p class="text-gray-600">
            {{ product.description }}
        </p>
      </section>

      <!-- You Might Also Like Section -->
      <section class="mt-20">
        <h2 class="text-3xl font-extrabold text-center mb-8">YOU MIGHT ALSO LIKE</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="related in relatedProducts" :key="related.id" class="text-center">
            <div class="bg-gray-100 rounded-lg p-4 mb-2 overflow-hidden">
                <img :src="related.image" :alt="related.name" class="w-full h-auto object-cover hover:scale-105 transition-transform duration-300">
            </div>
            <h3 class="font-semibold text-gray-800">{{ related.name }}</h3>
            <div class="flex justify-center items-center my-1">
                <div class="flex text-yellow-400">
                    <svg v-for="i in 5" :key="i" class="w-4 h-4" :class="i <= Math.floor(related.rating) ? 'text-yellow-400' : 'text-gray-300'" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                </div>
                <span class="text-xs text-gray-500 ml-1">{{ related.rating.toFixed(1) }}/5</span>
            </div>
             <p class="font-bold text-gray-900">
                <span v-if="related.discountPrice" class="text-red-500">Rp.{{ related.discountPrice }}</span>
                <span v-if="related.originalPrice && related.discountPrice" class="text-gray-500 line-through ml-2">Rp.{{ related.originalPrice }}</span>
                <span v-if="!related.discountPrice">Rp.{{ related.originalPrice }}</span>
                <span v-if="related.discount" class="bg-red-100 text-red-500 text-xs font-semibold ml-2 px-2 py-0.5 rounded">{{ related.discount }}</span>
            </p>
          </div>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
/* Scoped styles can be added here if needed, but Tailwind should cover most cases. */
</style>
