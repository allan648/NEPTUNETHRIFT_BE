<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'
import { RouterLink } from 'vue-router'

// Icons
import ArrowRight from '@/components/icons/ArrowRight.vue'
import Show from '@/components/icons/Show.vue'
import TrashCan from '@/components/icons/TrashCan.vue'
import Search from '@/components/icons/Search.vue'
import Edit from '@/components/icons/Edit.vue'
import Plus from '@/components/icons/Plus.vue'

// --- CONFIG ---
const API_URL = "http://localhost:3000/api"
axios.defaults.withCredentials = true // Wajib agar session Admin terbaca

// --- STATE ---
const products = ref([])
const isLoading = ref(false)
const searchQuery = ref("")

// --- FUNCTIONS ---

// 1. Fetch Products
const fetchProducts = async () => {
  isLoading.value = true
  try {
    // Kita panggil endpoint yang sudah kita buat tadi (support search juga)
    const url = searchQuery.value 
      ? `${API_URL}/admin/products?search=${searchQuery.value}`
      : `${API_URL}/admin/products`
      
    const response = await axios.get(url)
    products.value = response.data
  } catch (error) {
    console.error("Gagal load produk:", error)
    Swal.fire('Error', 'Gagal memuat data produk', 'error')
  } finally {
    isLoading.value = false
  }
}

// 2. Delete Product
const deleteProduct = (id, name) => {
  Swal.fire({
    title: `Hapus ${name}?`,
    text: "Data yang dihapus tidak dapat dikembalikan!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Ya, Hapus!',
    cancelButtonText: 'Batal'
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await axios.delete(`${API_URL}/admin/products/${id}`)
        Swal.fire('Terhapus!', 'Produk berhasil dihapus.', 'success')
        fetchProducts() // Refresh table
      } catch (error) {
        Swal.fire('Gagal!', 'Terjadi kesalahan saat menghapus.', 'error')
      }
    }
  })
}

// 3. Format Rupiah
const formatRp = (price) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(price)
}

// Load saat halaman dibuka
onMounted(() => {
  fetchProducts()
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-between gap-3 flex-wrap">
      <h1 class="text-3xl font-semibold">Product Management</h1>
    </div>

    <div class="flex flex-col rounded-3xl border border-gray-300 bg-white shadow-sm">
      <div class="flex flex-col p-4">
        
        <div class="flex justify-between sm:items-center flex-col sm:flex-row gap-4">
          <div class="border border-gray-300 gap-2 px-2.5 order-2 sm:order-1 py-2 flex items-center w-full sm:w-1/2 rounded-full">
            <Search class="size-6 text-gray-400" />
            <input
              v-model="searchQuery"
              @keyup.enter="fetchProducts" 
              type="text"
              class="w-full text-xs md:text-sm focus:outline-none bg-transparent"
              placeholder="Search by product name..."
            />
          </div>
          <router-link
            :to="{ name: 'Createproduct' }"
            class="whitespace-nowrap flex px-4.5 order-1 sm:order-2 py-2.5 cursor-pointer w-fit hover:bg-blue-600 text-sm gap-2 items-center justify-center font-medium bg-blue-700 rounded-full text-white transition-all"
          >
            <Plus class="size-5" /> New Product
          </router-link>
        </div>

        <div class="mt-4 overflow-hidden border border-gray-300 rounded-2xl">
          <div class="max-w-full overflow-x-auto">
            <table class="min-w-180 w-full">
              <thead class="bg-blue-700 text-xs text-white">
  <tr>
    <th class="p-4 text-start font-semibold w-12">NO</th>
    <th class="p-4 text-start font-semibold w-24">IMAGE</th>
    <th class="p-4 text-start font-semibold">PRODUCT DETAILS</th>
    <th class="p-4 text-start font-semibold">PRICE</th>
    <th class="p-4 text-start font-semibold">CONDITION</th> 
    <th class="p-4 text-start font-semibold">ACTION</th>
  </tr>
</thead>

<tbody>
  <tr v-for="(product, index) in products" :key="product.id" class="text-sm text-gray-700 hover:bg-gray-50 transition-colors">
    <td class="p-4 text-gray-900">{{ index + 1 }}</td>
                  
    <td class="p-4">
       <img :src="product.image || 'https://via.placeholder.com/80'" class="w-16 h-16 object-cover rounded-lg border border-gray-200" />
    </td>

    <td class="p-4">
       <div class="flex flex-col gap-1">
         <span class="font-bold text-gray-900 text-base">{{ product.name }}</span>
         <div class="flex gap-2">
            <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-800 text-white uppercase">{{ product.brand_name }}</span>
            <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 uppercase">{{ product.category_name }}</span>
         </div>
       </div>
    </td>

    <td class="p-4 font-medium text-green-700">{{ formatRp(product.price) }}</td>

    <td class="p-4">
      <div class="flex flex-col gap-1">
        <span class="font-bold text-xs" 
          :class="{
            'text-green-600': product.condition >= 5,
            'text-blue-600': product.condition === 4,
            'text-yellow-600': product.condition === 3,
            'text-orange-600': product.condition === 2,
            'text-red-600': product.condition <= 1
          }"
        >
          {{ 
            product.condition === 5 ? '✨ Like New (5/5)' :
            product.condition === 4 ? '👌 Excellent (4/5)' :
            product.condition === 3 ? '🛡️ Good (3/5)' :
            product.condition === 2 ? '⚠️ Fair (2/5)' :
            '💀 Bad (1/5)'
          }}
        </span>
        
        <div class="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div 
            class="h-full rounded-full"
            :class="{
              'bg-green-500': product.condition >= 5,
              'bg-blue-500': product.condition === 4,
              'bg-yellow-500': product.condition === 3,
              'bg-orange-500': product.condition === 2,
              'bg-red-500': product.condition <= 1
            }"
            :style="{ width: (product.condition / 5 * 100) + '%' }"
          ></div>
        </div>
      </div>
    </td>
    <td class="p-4 flex gap-2 items-center h-full pt-8">
        <router-link :to="{ name: 'Editproduct', params: { id: product.id } }" class="flex items-center justify-center p-2 rounded-md bg-yellow-400 hover:bg-yellow-500 text-white shadow-sm"><Edit class="size-4" /></router-link>
         <router-link :to="{ name: 'Detailproduct', params: { id: product.id } }" class="flex items-center justify-center p-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white shadow-sm"><Show class="size-4" /></router-link>
         <button @click="deleteProduct(product.id, product.name)" class="flex items-center justify-center p-2 rounded-md bg-red-600 hover:bg-red-700 text-white shadow-sm"><TrashCan class="size-4" /></button>
    </td>
  </tr>
</tbody>
            </table>
          </div>
        </div>

        <div class="flex justify-between items-center gap-3 flex-wrap mt-3 px-2">
          <div class="text-sm text-gray-600">
            Total Products: <span class="font-medium">{{ products.length }}</span>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
/* Styling tambahan jika perlu */
</style>