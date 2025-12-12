<script setup>
import { ref, computed, onMounted, onUpdated } from 'vue'
import AOS from "aos";
import "aos/dist/aos.css";

// Import Gambar Dummy
import Vans from "@/asset/images/Vans.png";
import NikeShadow from "@/asset/images/NikeShadow.png";
import NewBalance from "@/asset/images/NewBalance.png";

// Data Dummy Cart
const cartItems = ref([
  {
    id: 1,
    name: 'Nike Air Shadow 2.0 White',
    size: 'Large',
    color: 'White',
    price: 1450000,
    quantity: 1,
    imageUrl: NikeShadow
  },
  {
    id: 2,
    name: 'Vans Old Skool Classic Red',
    size: 'Medium',
    color: 'Red',
    price: 1800000,
    quantity: 1,
    imageUrl: Vans
  },
  {
    id: 3,
    name: 'New Balance 574 Core',
    size: 'Large',
    color: 'Blue',
    price: 2400000,
    quantity: 1,
    imageUrl: NewBalance
  }
])

// Logic Cart
const increaseQuantity = (item) => {
  item.quantity++
}

const decreaseQuantity = (item) => {
  if (item.quantity > 1) {
    item.quantity--
  }
}

const removeItem = (itemId) => {
  // Hapus item dengan efek visual (tunggu animasi CSS selesai jika ada, tapi AOS handle basic-nya)
  cartItems.value = cartItems.value.filter(item => item.id !== itemId)
  setTimeout(() => AOS.refresh(), 100); // Refresh posisi elemen lain
}

const totalPrice = computed(() => {
  return cartItems.value.reduce((total, item) => total + (item.price * item.quantity), 0)
})

const proceedToCheckout = () => {
  alert(`Checkout dengan total harga: Rp. ${totalPrice.value.toLocaleString()}`)
}

// Inisialisasi AOS
onMounted(() => {
  AOS.init({
    once: true,
    duration: 800,
    easing: "ease-out-cubic", // Easing sedikit berbeda agar terasa lebih "berbobot"
  });
});

onUpdated(() => {
  AOS.refresh();
});
</script>

<template>
  <div class="w-full p-6 md:p-10">
    <div class="mx-auto max-w-4xl">
      
      <div 
        class="flex items-center justify-between mb-8"
        data-aos="fade-down"
        data-aos-delay="100"
      >
        <h1 class="text-3xl md:text-4xl font-bold text-gray-800">My Cart</h1>
        <span class="text-gray-500 text-sm">{{ cartItems.length }} Items</span>
      </div>

      <div class="space-y-6">
        <div
          v-for="(item, index) in cartItems"
          :key="item.id"
          class="flex flex-col sm:flex-row items-center gap-6 p-4 border border-gray-200 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
          
          data-aos="fade-up"
          :data-aos-delay="150 + (index * 100)"
        >
          <div class="w-28 h-28 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden">
            <img
              :src="item.imageUrl"
              :alt="item.name"
              class="h-full w-full object-cover mix-blend-multiply hover:scale-105 transition-transform duration-500"
            />
          </div>

          <div class="flex-grow text-center sm:text-left w-full sm:w-auto">
            <h2 class="text-lg font-bold text-gray-900 mb-1">{{ item.name }}</h2>
            <div class="flex items-center justify-center sm:justify-start gap-4 text-sm text-gray-500 mb-2">
              <span class="bg-gray-100 px-2 py-0.5 rounded text-xs font-medium text-gray-600">Size: {{ item.size }}</span>
              <span class="flex items-center gap-1">
                <span class="w-3 h-3 rounded-full border border-gray-300" :style="{ backgroundColor: item.color.toLowerCase() }"></span>
                {{ item.color }}
              </span>
            </div>
            <p class="text-xl font-bold text-blue-700">Rp {{ item.price.toLocaleString('id-ID') }}</p>
          </div>

          <div class="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto mt-2 sm:mt-0 border-t sm:border-0 pt-4 sm:pt-0 border-gray-100">
            
            <div class="flex items-center rounded-full bg-gray-50 border border-gray-200 shadow-sm">
              <button
                @click="decreaseQuantity(item)"
                class="w-8 h-8 flex items-center justify-center text-lg font-bold text-gray-500 hover:text-blue-600 hover:bg-white rounded-full transition-all"
              >
                -
              </button>
              <span class="w-10 text-center font-semibold text-gray-800">{{ item.quantity }}</span>
              <button
                @click="increaseQuantity(item)"
                class="w-8 h-8 flex items-center justify-center text-lg font-bold text-gray-500 hover:text-blue-600 hover:bg-white rounded-full transition-all"
              >
                +
              </button>
            </div>

            <button 
              @click="removeItem(item.id)" 
              class="text-gray-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-full transition-all"
              title="Remove Item"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        <div 
          v-if="cartItems.length === 0" 
          class="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300"
          data-aos="zoom-in"
        >
          <div class="bg-white w-20 h-20 mx-auto rounded-full flex items-center justify-center shadow-sm mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10 text-gray-400">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
          </div>
          <p class="text-gray-500 text-lg font-medium">Keranjang kamu kosong.</p>
          <router-link to="/product" class="text-blue-600 font-semibold mt-2 inline-block hover:underline">Mulai Belanja</router-link>
        </div>
      </div>

      <div 
        v-if="cartItems.length > 0" 
        class="mt-10 pt-8 border-t border-gray-100"
        data-aos="fade-up"
        data-aos-delay="500"
        data-aos-offset="10"
      >
        <div class="flex flex-col sm:flex-row justify-between items-center gap-6">
          <div class="text-center sm:text-left">
             <p class="text-gray-500 text-sm mb-1">Total Pesanan</p>
             <p class="text-3xl font-extrabold text-gray-900 tracking-tight">
              Rp {{ totalPrice.toLocaleString('id-ID') }}
            </p>
            <p class="text-xs text-gray-400 mt-1">Termasuk pajak (jika ada)</p>
          </div>

          <button
            @click="proceedToCheckout"
            class="w-full sm:w-auto group relative px-8 py-4 bg-gray-900 text-white font-bold rounded-full overflow-hidden shadow-xl shadow-blue-900/20 hover:shadow-2xl hover:shadow-blue-900/40 transition-all duration-300 active:scale-95"
          >
            <div class="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600 to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span class="relative flex items-center justify-center gap-2">
              Proceed to Checkout
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4 group-hover:translate-x-1 transition-transform">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </span>
          </button>
        </div>
      </div>

    </div>
  </div>
</template>