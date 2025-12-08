<script setup>
import { ref, computed } from 'vue'
// HAPUS IMPORT SIDEBAR & AVATAR (Sudah diurus Layout)

import Vans from "@/asset/images/Vans.png";
import NikeShadow from "@/asset/images/NikeShadow.png";
import NewBalance from "@/asset/images/NewBalance.png";

// HAPUS USER PROFILE DUMMY

// Data reaktif untuk item di keranjang
const cartItems = ref([
  {
    id: 1,
    name: 'Nike Air Shadow 2.0',
    size: 'Large',
    color: 'White',
    price: 1450000,
    quantity: 1,
    imageUrl: NikeShadow
  },
  {
    id: 2,
    name: 'Vans Old Skool',
    size: 'Medium',
    color: 'Red',
    price: 1800000,
    quantity: 1,
    imageUrl: Vans
  },
  {
    id: 3,
    name: 'New Balance 574',
    size: 'Large',
    color: 'Blue',
    price: 2400000,
    quantity: 1,
    imageUrl: NewBalance
  }
])

// Fungsi-fungsi Cart (Tetap sama)
const increaseQuantity = (item) => {
  item.quantity++
}

const decreaseQuantity = (item) => {
  if (item.quantity > 1) {
    item.quantity--
  }
}

const removeItem = (itemId) => {
  cartItems.value = cartItems.value.filter(item => item.id !== itemId)
}

const totalPrice = computed(() => {
  return cartItems.value.reduce((total, item) => total + (item.price * item.quantity), 0)
})

const proceedToCheckout = () => {
  alert(`Checkout dengan total harga: Rp. ${totalPrice.value.toLocaleString()}`)
}
</script>

<template>
  <div class="w-full p-6 md:p-10">
    <div class="mx-auto max-w-4xl">
      <h1 class="text-3xl md:text-4xl font-bold text-gray-800 mb-8">My Cart</h1>

      <div class="space-y-6">
        <div
          v-for="item in cartItems"
          :key="item.id"
          class="flex flex-col sm:flex-row items-center gap-6 p-4 border border-gray-200 rounded-xl bg-white shadow-sm"
        >
          <div class="w-28 h-28 flex-shrink-0">
            <img
              :src="item.imageUrl"
              :alt="item.name"
              class="h-full w-full object-cover rounded-lg bg-gray-50"
            />
          </div>

          <div class="flex-grow text-center sm:text-left">
            <h2 class="text-lg font-bold text-gray-900">{{ item.name }}</h2>
            <p class="text-sm text-gray-500">Size: {{ item.size }}</p>
            <p class="text-sm text-gray-500">Color: {{ item.color }}</p>
            <p class="text-xl font-bold text-gray-900 mt-2">Rp. {{ item.price.toLocaleString() }}</p>
          </div>

          <div class="flex items-center gap-4">
            <div class="flex items-center rounded-full bg-gray-100 border border-gray-200">
              <button
                @click="decreaseQuantity(item)"
                class="px-3 py-1 text-lg font-bold text-gray-600 hover:bg-gray-200 rounded-l-full transition"
              >
                -
              </button>
              <span class="px-4 py-1 font-semibold min-w-[40px] text-center">{{ item.quantity }}</span>
              <button
                @click="increaseQuantity(item)"
                class="px-3 py-1 text-lg font-bold text-gray-600 hover:bg-gray-200 rounded-r-full transition"
              >
                +
              </button>
            </div>

            <button @click="removeItem(item.id)" class="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-full transition">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>

        <div v-if="cartItems.length === 0" class="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <p class="text-gray-500 text-lg">Your cart is empty.</p>
          <router-link to="/product" class="text-blue-600 font-semibold mt-2 inline-block">Start Shopping</router-link>
        </div>
      </div>

      <div v-if="cartItems.length > 0" class="mt-12 flex flex-col items-end gap-6 pt-6 border-t border-gray-100">
        <div class="text-right">
           <p class="text-sm text-gray-500 mb-1">Total Amount</p>
           <p class="text-3xl font-bold text-gray-900">
            Rp. {{ totalPrice.toLocaleString() }}
          </p>
        </div>
        <div>
          <button
            @click="proceedToCheckout"
            class="w-full sm:w-auto rounded-full bg-blue-700 px-8 py-4 text-lg font-bold text-white transition hover:bg-blue-800 shadow-lg shadow-blue-200"
          >
            Checkout Now
          </button>
        </div>
      </div>
    </div>
  </div>
</template>