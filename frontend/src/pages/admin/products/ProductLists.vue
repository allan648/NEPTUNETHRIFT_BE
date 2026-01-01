<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'
import { RouterLink } from 'vue-router'

// Icons
import Show from '@/components/icons/Show.vue'
import TrashCan from '@/components/icons/TrashCan.vue'
import Search from '@/components/icons/Search.vue'
import Edit from '@/components/icons/Edit.vue'
import Plus from '@/components/icons/Plus.vue'

// --- CONFIG ---
const API_URL = "http://localhost:3000/api"
axios.defaults.withCredentials = true 

// --- STATE ---
const products = ref([])
const isLoading = ref(false)
const searchQuery = ref("")

// --- FUNCTIONS ---

// 1. Fetch Products (Admin mengambil semua data termasuk yang inactive)
const fetchProducts = async () => {
  isLoading.value = true
  try {
    // Tambahkan parameter admin=true agar backend mengirim semua data (termasuk yang inactive)
    const url = searchQuery.value 
      ? `${API_URL}/admin/products?search=${searchQuery.value}&admin=true`
      : `${API_URL}/admin/products?admin=true`
      
    const response = await axios.get(url)
    products.value = response.data
  } catch (error) {
    console.error("Gagal load produk:", error)
  } finally {
    isLoading.value = false
  }
}

// 2. Soft Delete (Sembunyikan dari User)
const deleteProduct = (id, name) => {
  Swal.fire({
    title: `Nonaktifkan ${name}?`,
    text: "Produk tidak akan muncul di halaman pembeli, tapi data tetap ada di Admin.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Ya, Nonaktifkan!',
    cancelButtonText: 'Batal'
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await axios.put(`${API_URL}/admin/products/${id}/soft-delete`)
        Swal.fire('Berhasil!', 'Produk telah dinonaktifkan.', 'success')
        fetchProducts() 
      } catch (error) {
        Swal.fire('Gagal!', 'Gagal mengubah status produk.', 'error')
      }
    }
  })
}

// 3. Restore (Aktifkan Kembali)
const restoreProduct = (id, name) => {
  Swal.fire({
    title: `Aktifkan ${name}?`,
    text: "Produk akan muncul kembali di halaman pembeli.",
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#16a34a',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Ya, Aktifkan!',
    cancelButtonText: 'Batal'
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await axios.put(`${API_URL}/admin/products/${id}/restore`)
        Swal.fire('Berhasil!', 'Produk sekarang aktif kembali.', 'success')
        fetchProducts() 
      } catch (error) {
        Swal.fire('Gagal!', 'Gagal mengaktifkan produk.', 'error')
      }
    }
  })
}

const formatRp = (price) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0
  }).format(price)
}

onMounted(() => {
  fetchProducts()
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-between gap-3 flex-wrap">
      <h1 class="text-3xl font-semibold text-gray-800">Product Management</h1>
    </div>

    <div class="flex flex-col rounded-3xl border border-gray-300 bg-white shadow-sm overflow-hidden">
      <div class="flex flex-col p-4">
        
        <div class="flex justify-between sm:items-center flex-col sm:flex-row gap-4 mb-4">
          <div class="border border-gray-300 gap-2 px-4 py-2 flex items-center w-full sm:w-1/2 rounded-full bg-gray-50">
            <Search class="size-5 text-gray-400" />
            <input
              v-model="searchQuery"
              @keyup.enter="fetchProducts" 
              type="text"
              class="w-full text-sm focus:outline-none bg-transparent"
              placeholder="Cari nama produk..."
            />
          </div>
          <router-link
            :to="{ name: 'Createproduct' }"
            class="flex px-6 py-2.5 hover:bg-blue-800 text-sm gap-2 items-center justify-center font-bold bg-blue-700 rounded-full text-white transition-all shadow-md"
          >
            <Plus class="size-5" /> New Product
          </router-link>
        </div>

        <div class="overflow-hidden border border-gray-200 rounded-2xl">
          <div class="max-w-full overflow-x-auto">
            <table class="min-w-180 w-full text-left">
              <thead class="bg-blue-800 text-xs text-white uppercase tracking-wider">
                  <tr>
                    <th class="p-4 w-12 text-center">NO</th>
                    <th class="p-4 w-24">IMAGE</th>
                    <th class="p-4">PRODUCT DETAILS</th>
                    <th class="p-4">STATUS</th> 
                    <th class="p-4 font-semibold text-end">PRICE</th>
                    <th class="p-4 text-center">ACTION</th>
                  </tr>
                </thead>

                <tbody class="divide-y divide-gray-100">
                  <tr v-if="isLoading">
                    <td colspan="6" class="p-8 text-center text-gray-500 italic">Loading data...</td>
                  </tr>

                  <tr v-else-if="products.length === 0">
                    <td colspan="6" class="p-8 text-center text-gray-500">No products found.</td>
                  </tr>

                  <tr v-else v-for="(product, index) in products" :key="product.id" 
                      class="text-sm transition-colors hover:bg-blue-50/30"
                      :class="{'opacity-60 bg-gray-50': product.status === 'inactive'}"
                  >
                    <td class="p-4 text-center text-gray-500 font-medium">{{ index + 1 }}</td>
                                      
                    <td class="p-4">
                       <img :src="product.image || 'https://via.placeholder.com/80'" class="w-16 h-16 object-cover rounded-xl border border-gray-200 shadow-sm" />
                    </td>

                    <td class="p-4">
                       <div class="flex flex-col gap-1">
                         <span class="font-bold text-gray-900 text-base" :class="{'line-through': product.status === 'inactive'}">
                            {{ product.name }}
                         </span>
                         <div class="flex gap-2 items-center">
                            <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-700 uppercase">{{ product.category_name }}</span>
                            <span class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{{ product.brand_name }}</span>
                         </div>
                       </div>
                    </td>

                    <td class="p-4">
                        <span :class="product.status === 'active' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'" 
                              class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border">
                            {{ product.status }}
                        </span>
                    </td>

                    <td class="p-4 text-end font-bold text-gray-900">{{ formatRp(product.price) }}</td>

                    <td class="p-4">
                        <div class="flex gap-2 items-center justify-center">
                            <router-link :to="{ name: 'Detailproduct', params: { id: product.id } }" class="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all" title="Detail">
                                <Show class="size-4" />
                            </router-link>

                            <template v-if="product.status === 'active'">
                                <router-link :to="{ name: 'Editproduct', params: { id: product.id } }" class="p-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-white shadow-sm transition-all" title="Edit">
                                    <Edit class="size-4" />
                                </router-link>
                                
                                <button @click="deleteProduct(product.id, product.name)" class="p-2 rounded-lg bg-red-500 hover:bg-red-600 text-white shadow-sm transition-all" title="Nonaktifkan">
                                    <TrashCan class="size-4" />
                                </button>
                            </template>

                            <template v-else>
                                <button @click="restoreProduct(product.id, product.name)" 
                                        class="p-2 rounded-lg bg-green-500 hover:bg-green-600 text-white shadow-sm transition-all flex items-center gap-1" title="Aktifkan Kembali">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    <span class="text-[10px] font-bold">RESTORE</span>
                                </button>
                            </template>
                        </div>
                    </td>
                  </tr>
                </tbody>
            </table>
          </div>
        </div>

        <div class="mt-4 px-2 flex justify-between items-center text-sm text-gray-500">
            <p>Total Item: <span class="font-bold text-gray-800">{{ products.length }}</span></p>
            <div class="flex gap-4">
                <span class="flex items-center gap-1"><span class="w-3 h-3 bg-green-500 rounded-full"></span> Active</span>
                <span class="flex items-center gap-1"><span class="w-3 h-3 bg-red-500 rounded-full"></span> Inactive (Hidden)</span>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>