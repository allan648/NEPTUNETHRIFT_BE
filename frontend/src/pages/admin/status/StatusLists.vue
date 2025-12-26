<script setup>
import { ref, onMounted, computed } from 'vue' 
import axios from 'axios' 
import ArrowRight from '@/components/icons/ArrowRight.vue'
import Show from '@/components/icons/Show.vue'
import TrashCan from '@/components/icons/TrashCan.vue'
import Search from '@/components/icons/Search.vue'
import Swal from 'sweetalert2'

// Import Modal Component
import StatusProductDetailModal from '@/pages/admin/status/StatusDetails.vue'

const API_URL = "http://localhost:3000/api"

// PENTING: Aktifkan credentials agar Cookie Token Admin terbaca
axios.defaults.withCredentials = true; 

// --- STATE ---
const showDetailModal = ref(false)
const selectedOrder = ref(null)
const orders = ref([]) 
const isLoading = ref(true)
const searchQuery = ref('') 

// --- FETCH DATA ---
const fetchOrders = async () => {
  isLoading.value = true
  try {
    const response = await axios.get(`${API_URL}/admin/orders`)
    orders.value = response.data.orders
  } catch (error) {
    console.error("Gagal ambil data order:", error)
    if(error.response && (error.response.status === 401 || error.response.status === 403)) {
        Swal.fire('Akses Ditolak', 'Silakan login kembali sebagai Admin.', 'warning')
    }
  } finally {
    isLoading.value = false
  }
}

// --- FILTER ---
const filteredOrders = computed(() => {
  if (!searchQuery.value) return orders.value
  return orders.value.filter(order => 
    order.recipient_name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    order.id.toString().includes(searchQuery.value) ||
    order.status.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const formatRp = (price) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(price)
}

// --- ACTIONS MODAL ---
const openDetail = (order) => {
  selectedOrder.value = order 
  showDetailModal.value = true
}

const closeDetail = () => {
  showDetailModal.value = false
  selectedOrder.value = null
}

// --- LOGIKA 1: INPUT RESI (Status: PAID -> SHIPPED) ---
const handleInputResi = async (order) => {
    const { value: resi } = await Swal.fire({
        title: 'Input Nomor Resi',
        text: `Masukkan resi untuk pesanan #${order.id}`,
        input: 'text',
        inputPlaceholder: 'Contoh: JNE-882912',
        showCancelButton: true,
        confirmButtonText: 'Kirim & Notifikasi Email',
        confirmButtonColor: '#1e3a8a',
        inputValidator: (value) => {
            if (!value) return 'Nomor resi wajib diisi!'
        }
    });

    if (resi) {
        Swal.fire({
            title: 'Memproses...',
            text: 'Menyimpan resi dan mengirim email...',
            didOpen: () => Swal.showLoading()
        });

        try {
            await axios.put(`${API_URL}/admin/orders/${order.id}/send`, { 
                tracking_number: resi 
            });
            
            Swal.fire('Berhasil!', 'Resi disimpan & Email terkirim ke pembeli.', 'success');
            
            // Update tampilan tabel secara realtime
            if (order) {
                order.status = 'shipped';
                order.tracking_number = resi;
            }

        } catch (error) {
            console.error(error);
            Swal.fire('Gagal', 'Gagal mengirim data. Cek console.', 'error');
        }
    }
};

// --- LOGIKA 2: TANDAI SAMPAI (Status: SHIPPED -> DELIVERED) ---
const handleMarkDelivered = async (order) => {
    Swal.fire({
        title: 'Barang Sudah Sampai?',
        text: "Sistem akan mengirim email konfirmasi ke pembeli.",
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Ya, Tandai Sampai',
        confirmButtonColor: '#16a34a'
    }).then(async (result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: 'Updating...',
                didOpen: () => Swal.showLoading()
            });

            try {
                // Panggil Endpoint Backend Baru
                await axios.put(`${API_URL}/admin/orders/${order.id}/deliver`);
                
                // Update UI Lokal
                order.status = 'delivered'; 
                
                Swal.fire('Berhasil', 'Status diubah jadi SAMPAI. Menunggu konfirmasi user.', 'success');
            } catch (error) {
                console.error(error);
                Swal.fire('Gagal', 'Error update status', 'error');
            }
        }
    });
};

onMounted(() => {
  fetchOrders()
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-between gap-3 flex-wrap">
      <h1 class="text-3xl font-semibold">Daftar Pesanan Masuk</h1> 
    </div>

    <div class="flex flex-col rounded-3xl border border-gray-300">
      <div class="flex flex-col p-4">
        
        <div class="flex justify-between sm:items-center flex-col sm:flex-row gap-4">
          <div class="border border-gray-300 gap-2 px-2.5 order-2 sm:order-1 py-2 flex items-center w-full sm:w-1/2 rounded-full">
            <Search class="size-6" />
            <input
              v-model="searchQuery"
              type="text"
              class="w-full text-xs md:text-sm focus:outline-none"
              placeholder="Cari ID Order atau Nama Pembeli..."
            />
          </div>
        </div>

        <div class="mt-4 overflow-hidden border border-gray-300 rounded-2xl">
          <div class="max-w-full overflow-x-auto">
            <table class="min-w-180 w-full">
              <thead class="bg-blue-700 text-xs text-white">
                <tr>
                  <th class="p-4 text-start font-semibold w-12">ID</th>
                  <th class="p-4 text-start font-semibold">PEMBELI</th> 
                  <th class="p-4 text-start font-semibold">TOTAL</th>   
                  <th class="p-4 text-start font-semibold">STATUS</th>  
                  <th class="p-4 text-start font-semibold">RESI / ALAMAT</th>
                  <th class="p-4 text-start font-semibold">ACTION</th>
                </tr>
              </thead>
              
              <tbody v-if="isLoading">
                 <tr><td colspan="6" class="p-4 text-center">Memuat data...</td></tr>
              </tbody>

              <tbody v-else>
                <tr
                  v-for="order in filteredOrders"
                  :key="order.id"
                  class="text-sm text-gray-700 border-b border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  <td class="p-4 text-gray-900 font-bold">#{{ order.id }}</td>
                  
                  <td class="p-4">
                    <div class="font-bold text-gray-900">{{ order.recipient_name }}</div>
                    <div class="text-xs text-gray-500">{{ order.recipient_phone }}</div>
                  </td>
                  
                  <td class="p-4 font-medium">{{ formatRp(order.total_price) }}</td>
                  
                  <td class="p-4">
                    <span 
                      class="px-3 py-1 rounded-full text-xs font-bold"
                      :class="{
                        'bg-yellow-100 text-yellow-800': order.status === 'pending',
                        'bg-green-100 text-green-800': order.status === 'paid',
                        'bg-blue-100 text-blue-800': order.status === 'shipped',
                        'bg-purple-100 text-purple-800': order.status === 'delivered',
                        'bg-gray-100 text-gray-800': order.status === 'completed'
                      }"
                    >
                      {{ order.status.toUpperCase() }}
                    </span>
                  </td>
                  
                  <td class="p-4">
                    <div v-if="order.tracking_number" class="text-blue-600 font-bold">{{ order.tracking_number }}</div>
                    <div v-else class="text-gray-400 text-xs italic">Belum dikirim</div>
                    <div class="text-xs text-gray-500 mt-1 truncate w-40">{{ order.shipping_address }}</div>
                  </td>

                  <td class="p-4 flex gap-3 items-center">
                    
                    <button
                      v-if="order.status === 'paid'"
                      @click="handleInputResi(order)"
                      title="Input Resi & Kirim"
                      class="flex items-center justify-center px-3 py-2 rounded-md bg-blue-600 hover:bg-blue-700 transition-colors text-white gap-1"
                    >
                       <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                        </svg>
                       <span class="text-xs font-bold">Kirim</span>
                    </button>

                    <button
                      v-if="order.status === 'shipped'"
                      @click="handleMarkDelivered(order)"
                      title="Tandai Barang Sampai"
                      class="flex items-center justify-center px-3 py-2 rounded-md bg-green-600 hover:bg-green-700 transition-colors text-white gap-1"
                    >
                       <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                       </svg>
                       <span class="text-xs font-bold">Sampai</span>
                    </button>

                    <button
                      @click="openDetail(order)"
                      title="Lihat Detail Pesanan"
                      class="flex items-center justify-center p-2 rounded-md bg-[#295F98] hover:bg-blue-800 transition-colors"
                    >
                      <Show class="size-5 text-white" />
                    </button>

                    <button
                      title="Hapus Order"
                      class="flex items-center justify-center p-2 rounded-md bg-[#E02424] hover:bg-red-700 transition-colors"
                    >
                      <TrashCan class="size-5 text-white" />
                    </button>
                  </td>
                </tr>
                
                <tr v-if="filteredOrders.length === 0">
                    <td colspan="6" class="p-8 text-center text-gray-500">Tidak ada data pesanan.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="flex justify-between items-center gap-3 flex-wrap mt-3">
          <div class="text-sm text-gray-600">
            Showing {{ filteredOrders.length }} Entries
          </div>
        </div>
      </div>
    </div>

    <StatusProductDetailModal
      :show="showDetailModal"
      :order-data="selectedOrder" 
      @close="closeDetail"
    />
  </div>
</template>

<style scoped>
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>