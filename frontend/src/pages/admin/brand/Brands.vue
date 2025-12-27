<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'

// Icons
import ArrowRight from '@/components/icons/ArrowRight.vue'
import TrashCan from '@/components/icons/TrashCan.vue'
import Search from '@/components/icons/Search.vue'
import Edit from '@/components/icons/Edit.vue'
import Plus from '@/components/icons/Plus.vue'

// --- CONFIG ---
const API_URL = "http://localhost:3000/api/admin/brands"
axios.defaults.withCredentials = true 

// --- STATE ---
const brands = ref([])
const searchQuery = ref("")
const isLoading = ref(false)

// --- FETCH DATA ---
const fetchBrands = async () => {
  isLoading.value = true
  try {
    const response = await axios.get(API_URL)
    brands.value = response.data
  } catch (error) {
    console.error("Gagal memuat brand:", error)
  } finally {
    isLoading.value = false
  }
}

const filteredBrands = computed(() => {
  return brands.value.filter(b => 
    b.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

// --- ACTIONS ---
const handleAddBrand = async () => {
  const { value: name } = await Swal.fire({
    title: 'Tambah Brand Baru',
    input: 'text',
    inputLabel: 'Nama Brand',
    showCancelButton: true,
    confirmButtonText: 'Simpan',
    inputValidator: (value) => {
      if (!value) return 'Nama tidak boleh kosong!'
    }
  })

  if (name) {
    try {
      await axios.post(API_URL, { name })
      Swal.fire('Berhasil', 'Brand ditambahkan', 'success')
      fetchBrands()
    } catch (e) { Swal.fire('Gagal', 'Gagal menambah data', 'error') }
  }
}

const handleEditBrand = async (brand) => {
  const { value: name } = await Swal.fire({
    title: 'Edit Brand',
    input: 'text',
    inputValue: brand.name,
    showCancelButton: true,
    confirmButtonText: 'Update'
  })

  if (name && name !== brand.name) {
    try {
      await axios.put(`${API_URL}/${brand.id}`, { name })
      Swal.fire('Berhasil', 'Brand diperbarui', 'success')
      fetchBrands()
    } catch (e) { Swal.fire('Gagal', 'Gagal update data', 'error') }
  }
}

const deleteBrand = async (id, name) => {
  const result = await Swal.fire({
    title: `Hapus Brand ${name}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    confirmButtonText: 'Ya, Hapus!'
  })

  if (result.isConfirmed) {
    try {
      await axios.delete(`${API_URL}/${id}`)
      Swal.fire('Terhapus!', 'Brand berhasil dihapus.', 'success')
      fetchBrands()
    } catch (e) { Swal.fire('Gagal', 'Gagal hapus data', 'error') }
  }
}

onMounted(fetchBrands)
</script>

<template>
  <div class="space-y-6">
    <h1 class="text-3xl font-semibold">Brand Management</h1>

    <div class="flex flex-col rounded-3xl border border-gray-300 bg-white shadow-sm overflow-hidden">
      <div class="p-4 flex justify-between items-center flex-wrap gap-4">
        <div class="border border-gray-300 gap-2 px-3 py-2 flex items-center w-full sm:w-1/2 rounded-full">
          <Search class="size-5 text-gray-400" />
          <input v-model="searchQuery" type="text" class="w-full text-sm focus:outline-none bg-transparent" placeholder="Cari brand..." />
        </div>
        <button @click="handleAddBrand" class="px-6 py-2.5 bg-blue-700 text-white text-sm font-medium rounded-full hover:bg-blue-800 flex items-center gap-2">
          <Plus class="size-5" /> New Brand
        </button>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-blue-700 text-white text-xs uppercase">
            <tr>
              <th class="p-4 text-center w-16">No</th>
              <th class="p-4 text-left">Brand Name</th>
              <th class="p-4 text-center w-32">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-if="isLoading"><td colspan="3" class="p-8 text-center text-gray-500 italic">Memuat data...</td></tr>
            <tr v-for="(brand, index) in filteredBrands" :key="brand.id" class="hover:bg-gray-50">
              <td class="p-4 text-center">{{ index + 1 }}</td>
              <td class="p-4 font-semibold">{{ brand.name }}</td>
              <td class="p-4 flex gap-2 justify-center">
                <button @click="handleEditBrand(brand)" class="p-2 bg-yellow-400 rounded-lg hover:bg-yellow-500"><Edit class="size-4" /></button>
                <button @click="deleteBrand(brand.id, brand.name)" class="p-2 bg-red-600 rounded-lg hover:bg-red-700 text-white"><TrashCan class="size-4" /></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>