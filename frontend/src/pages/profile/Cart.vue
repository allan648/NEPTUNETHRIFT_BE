<script setup>
import { ref, computed, reactive } from 'vue'
import Sidebar from '@/components/Sidebar.vue' // Pastikan path ini benar
import DefaultAvatar from '@/asset/images/user_profile/default-avatar.png' // Import avatar default
import Vans from "@/asset/images/Vans.png";
import NikeShadow from "@/asset/images/NikeShadow.png";
import NewBalance from "@/asset/images/NewBalance.png";
// Data reaktif untuk informasi pengguna yang akan dikirim ke Sidebar
const userProfile = reactive({
  username: 'FIKY KNJT',
  email: 'fkyknjt@gmail.com',
  image: DefaultAvatar,
})

// Data reaktif untuk item di keranjang. Anda bisa menggantinya dengan data dari API.
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

// Fungsi untuk menambah kuantitas item
const increaseQuantity = (item) => {
  item.quantity++
}

// Fungsi untuk mengurangi kuantitas item, dengan batas minimal 1
const decreaseQuantity = (item) => {
  if (item.quantity > 1) {
    item.quantity--
  }
}

// Fungsi untuk menghapus item dari keranjang
const removeItem = (itemId) => {
  cartItems.value = cartItems.value.filter(item => item.id !== itemId)
}

// Menghitung total harga secara otomatis menggunakan computed property
const totalPrice = computed(() => {
  return cartItems.value.reduce((total, item) => total + (item.price * item.quantity), 0)
})

// Fungsi untuk proses checkout
const proceedToCheckout = () => {
  // Tambahkan logika checkout Anda di sini
  alert(`Checkout dengan total harga: $${totalPrice.value}`)
}
</script>

<template>
  <div class="flex">
    <!-- Mengirim data pengguna ke Sidebar -->
    <Sidebar :user="userProfile" />

    <!-- Konten Utama Halaman Keranjang -->
    <main class="w-full p-8 md:p-12">
      <div class="mx-auto max-w-4xl">
        <h1 class="text-3xl md:text-4xl font-bold text-gray-800 mb-8">My Cart</h1>

        <!-- Daftar Item Keranjang -->
        <div class="space-y-6">
          <div
            v-for="item in cartItems"
            :key="item.id"
            class="flex flex-col sm:flex-row items-center gap-6 p-4 border border-gray-200 rounded-xl"
          >
            <!-- Gambar Produk -->
            <div class="w-28 h-28 flex-shrink-0">
              <img
                :src="item.imageUrl"
                :alt="item.name"
                class="h-full w-full object-cover rounded-lg bg-gray-100"
              />
            </div>

            <!-- Detail Produk -->
            <div class="flex-grow text-center sm:text-left">
              <h2 class="text-lg font-bold text-gray-900">{{ item.name }}</h2>
              <p class="text-sm text-gray-500">Size: {{ item.size }}</p>
              <p class="text-sm text-gray-500">Color: {{ item.color }}</p>
              <p class="text-xl font-bold text-gray-900 mt-2">Rp.{{ item.price }}</p>
            </div>

            <!-- Aksi (Kuantitas & Hapus) -->
            <div class="flex items-center gap-4">
              <!-- Pengatur Kuantitas -->
              <div class="flex items-center rounded-full bg-gray-100">
                <button
                  @click="decreaseQuantity(item)"
                  class="px-3 py-1 text-lg font-bold text-gray-600 hover:bg-gray-200 rounded-l-full"
                >
                  -
                </button>
                <span class="px-4 py-1 font-semibold">{{ item.quantity }}</span>
                <button
                  @click="increaseQuantity(item)"
                  class="px-3 py-1 text-lg font-bold text-gray-600 hover:bg-gray-200 rounded-r-full"
                >
                  +
                </button>
              </div>

              <!-- Tombol Hapus -->
              <button @click="removeItem(item.id)" class="text-red-500 hover:text-red-700">
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

          <!-- Pesan jika keranjang kosong -->
          <div v-if="cartItems.length === 0" class="text-center py-10">
            <p class="text-gray-500">Your cart is empty.</p>
          </div>
        </div>

        <!-- Total Harga dan Checkout -->
        <div v-if="cartItems.length > 0" class="mt-12 flex flex-col items-end gap-6">
          <div class="pr-2">
            <p class="text-2xl md:text-xl font-bold text-gray-800">
              Total Price: Rp.{{ totalPrice }}
            </p>
          </div>
          <div>
            <button
              @click="proceedToCheckout"
              class="w-full sm:w-auto rounded-full bg-blue-700 px-6 py-3 text-md font-bold text-white transition hover:bg-blue-500"
            >
              Check out now
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
