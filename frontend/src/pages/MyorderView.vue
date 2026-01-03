<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useRouter } from 'vue-router';

const router = useRouter();
const API_URL = "http://localhost:3000/api";
axios.defaults.withCredentials = true;

const orders = ref([]);
const isLoading = ref(true);
const activeTab = ref('pending'); 

const tabs = [
  { id: 'all', label: 'Semua' },
  { id: 'pending', label: 'Belum Bayar' },
  { id: 'packed', label: 'Dikemas' },
  { id: 'sent', label: 'Dikirim' },
  { id: 'completed', label: 'Selesai' },
];

const formatRp = (price) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(price);
};

const fetchOrders = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get(`${API_URL}/orders`);
    orders.value = response.data.orders || response.data;
  } catch (error) {
    console.error("Gagal load order", error);
    if (error.response?.status === 401) router.push('/');
  } finally {
    isLoading.value = false;
  }
};

// --- LOGIKA FILTERING (UPDATE) ---
const filteredOrders = computed(() => {
  if (activeTab.value === 'all') return orders.value;
  
  if (activeTab.value === 'pending') return orders.value.filter(o => o.status === 'pending');
  
  if (activeTab.value === 'packed') return orders.value.filter(o => o.status === 'paid');
  
  // TAB DIKIRIM: Menampilkan yang sedang jalan (shipped) ATAU sudah sampai (delivered)
  if (activeTab.value === 'sent') {
      return orders.value.filter(o => o.status === 'shipped' || o.status === 'delivered');
  }

  if (activeTab.value === 'completed') return orders.value.filter(o => o.status === 'completed');

  return [];
});

// --- FUNGSI 1: CEK STATUS BAYAR ---
const checkStatusManual = async (orderId) => {
    // Tampilkan loading yang lebih cantik
    Swal.fire({
        title: 'Sinkronisasi...',
        text: 'Memverifikasi pembayaran dengan sistem Midtrans',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
    });

    try {
        // Menggunakan PUT sesuai route update status kamu
        const response = await axios.put(`${API_URL}/orders/${orderId}/status`);
        
        if (response.data.status === 'paid') {
            await Swal.fire('Lunas!', 'Pembayaran sudah terverifikasi. Barang akan segera kami kemas.', 'success');
            fetchOrders(); 
            activeTab.value = 'packed'; // Pindah tab otomatis
        } else if (response.data.status === 'cancelled') {
            await Swal.fire('Dibatalkan', 'Pesanan ini telah kedaluwarsa atau dibatalkan.', 'error');
            fetchOrders();
        } else {
            // Jika masih pending
            Swal.fire('Pending', 'Kami belum menerima konfirmasi pembayaran dari bank/merchant.', 'info');
        }
    } catch (error) {
        // Jika backend kirim 404 (Belum ada interaksi Midtrans)
        if (error.response?.status === 404) {
            Swal.fire('Belum Ada Aksi', 'Silakan klik tombol "Bayar Sekarang" terlebih dahulu.', 'info');
        } else {
            Swal.fire('Gagal', 'Gagal sinkronisasi. Coba lagi dalam beberapa saat.', 'error');
        }
    }
};

// --- FUNGSI 2: KONFIRMASI TERIMA BARANG (Hanya saat status DELIVERED) ---
const handleComplete = (orderId) => {
    Swal.fire({
        title: 'Pesanan Diterima?',
        text: "Pastikan barang sudah sampai dan sesuai. Transaksi akan diselesaikan.",
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Ya, Terima Barang',
        confirmButtonColor: '#16a34a'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                // Panggil Endpoint Selesaikan Pesanan
                await axios.put(`${API_URL}/orders/${orderId}/complete`);
                
                Swal.fire('Terima Kasih!', 'Transaksi selesai.', 'success');
                
                // Update Lokal
                const target = orders.value.find(o => o.id === orderId);
                if (target) target.status = 'completed';

                // Pindah ke tab Selesai
                activeTab.value = 'completed'; 
            } catch (error) {
                console.error(error);
                Swal.fire('Gagal', 'Gagal update status.', 'error');
            }
        }
    });
};

const handlePay = (order) => {
    if (order.snap_token) {
        window.snap.pay(order.snap_token, {
            onSuccess: function(result) { 
                // Jika sukses, baru cek ke backend untuk ubah status jadi 'paid'
                checkStatusManual(order.id); 
            },
            onPending: function(result) { 
                Swal.fire('Menunggu', 'Silakan selesaikan pembayaran sesuai instruksi di aplikasi.', 'info'); 
            },
            onError: function(result) { 
                Swal.fire('Gagal', 'Pembayaran gagal, silakan coba lagi.', 'error'); 
            },
            onClose: function() { 
                // PERBAIKAN: Jangan panggil checkStatusManual di sini agar tidak spam log [SKIP] di BE.
                // Karena user belum bayar, status di DB pasti tetap 'pending'.
                Swal.fire({
                    title: 'Belum Bayar?',
                    text: 'Pesananmu tetap tersimpan. Kamu bisa bayar kapan saja sebelum stok habis.',
                    icon: 'warning'
                });
            }
        });
    } else {
        Swal.fire('Error', 'Sesi pembayaran tidak ditemukan. Silakan hubungi admin.', 'error');
    }
};

const handleCancel = (orderId) => {
    Swal.fire({
        title: 'Batalkan Pesanan?',
        text: "Yakin ingin membatalkan pesanan ini?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ya, Hapus',
        confirmButtonColor: '#d33'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                await axios.delete(`${API_URL}/orders/${orderId}`);
                orders.value = orders.value.filter(o => o.id !== orderId);
                Swal.fire('Dibatalkan!', '', 'success');
            } catch (error) {
                Swal.fire('Gagal', 'Gagal hapus pesanan', 'error');
            }
        }
    });
};

onMounted(() => {
  fetchOrders();
});
</script>

<template>
  <div class="min-h-screen bg-gray-100 font-sans pb-20 pt-20">
    <div class="max-w-4xl mx-auto px-4">
      
      <h1 class="text-2xl font-bold text-blue-900 mb-6">Pesanan Saya</h1>

      <div class="bg-white shadow-sm rounded-t-lg sticky top-16 z-30 flex overflow-x-auto no-scrollbar border-b border-gray-200">
        <button 
            v-for="tab in tabs" 
            :key="tab.id"
            @click="activeTab = tab.id"
            class="flex-shrink-0 px-6 py-4 text-sm font-medium transition-colors relative whitespace-nowrap"
            :class="activeTab === tab.id ? 'text-blue-900 border-b-2 border-blue-900' : 'text-gray-500 hover:text-blue-700'"
        >
            {{ tab.label }}
        </button>
      </div>

      <div v-if="isLoading" class="py-20 text-center">
          <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-900 mx-auto"></div>
          <p class="text-gray-400 mt-2 text-sm">Memuat pesanan...</p>
      </div>

      <div v-else class="space-y-4 mt-4">
          <div v-if="filteredOrders.length === 0" class="bg-white p-10 rounded text-center shadow-sm">
              <p class="text-gray-500">Tidak ada pesanan di tab <strong>{{ tabs.find(t => t.id === activeTab).label }}</strong>.</p>
          </div>

          <div v-for="order in filteredOrders" :key="order.id" class="bg-white shadow-sm rounded-sm p-5 border border-gray-100">
              
              <div class="flex justify-between items-center border-b border-gray-100 pb-3 mb-3">
                  <div class="text-sm font-bold text-gray-800">
                      Order ID: #{{ order.id }} 
                  </div>
                  
                  <div class="text-sm font-bold uppercase tracking-wide"
                       :class="{
                         'text-yellow-600': order.status === 'pending',
                         'text-green-600': order.status === 'paid',
                         'text-blue-600': order.status === 'shipped',
                         'text-purple-600': order.status === 'delivered',
                         'text-gray-600': order.status === 'completed'
                       }">
                      <span v-if="order.status === 'pending'">BELUM BAYAR</span>
                      <span v-else-if="order.status === 'paid'">DIKEMAS</span>
                      <span v-else-if="order.status === 'shipped'">DIKIRIM</span>
                      <span v-else-if="order.status === 'delivered'">SAMPAI</span>
                      <span v-else-if="order.status === 'completed'">SELESAI</span>
                      <span v-else>{{ order.status }}</span>
                  </div>
              </div>

              <div v-if="order.items && order.items.length > 0">
                  <div v-for="(item, idx) in order.items" :key="idx" class="flex gap-4 mb-4 last:mb-0">
                      <img :src="item.image || 'https://via.placeholder.com/80'" class="w-20 h-20 object-cover rounded border">
                      <div class="flex-grow">
                          <h3 class="text-sm font-medium text-gray-900 line-clamp-2">{{ item.name }}</h3>
                          <p class="text-xs text-gray-500">x {{ item.quantity }}</p>
                      </div>
                      <div class="text-right">
                          <p class="text-sm font-medium text-blue-900">{{ formatRp(item.price) }}</p>
                      </div>
                  </div>
              </div>

              <div class="border-t border-dashed border-gray-200 pt-4 mt-2 flex flex-col md:flex-row justify-between items-end gap-4">
                  <div class="text-right w-full md:w-auto">
                      <p class="text-xs text-gray-500">Total:</p>
                      <p class="text-xl font-bold text-blue-900">{{ formatRp(order.total_price) }}</p>
                  </div>

                  <div class="flex gap-2 w-full md:w-auto flex-wrap justify-end">
                      
                      <button v-if="order.status === 'pending'" @click="handleCancel(order.id)" class="px-4 py-2 border border-red-200 text-red-600 text-sm font-medium rounded hover:bg-red-50">
                          Batalkan
                      </button>
                      <button v-if="order.status === 'pending'" @click="checkStatusManual(order.id)" class="px-4 py-2 border border-blue-600 text-blue-600 text-sm font-bold rounded hover:bg-blue-50">
                          🔄 Cek Status
                      </button>
                      <button v-if="order.status === 'pending'" @click="handlePay(order)" class="px-6 py-2 bg-blue-900 text-white text-sm font-bold rounded hover:bg-blue-800">
                          Bayar Sekarang
                      </button>
                      
                      <button v-if="order.status === 'paid'" class="px-6 py-2 bg-gray-100 text-gray-500 text-sm font-bold rounded cursor-not-allowed">
                          Menunggu Pengiriman
                      </button>

                      <div v-if="order.status === 'shipped' || order.status === 'delivered'" class="text-right flex flex-col items-end gap-2">
                          <div>
                              <p class="text-xs text-gray-500">Resi:</p>
                              <p class="text-sm font-bold text-blue-800 tracking-wider">{{ order.tracking_number }}</p>
                          </div>
                          
                          <div v-if="order.status === 'shipped'" class="text-xs text-orange-500 font-medium italic bg-orange-50 px-3 py-1 rounded">
                              🚚 Paket sedang dalam perjalanan...
                          </div>

                          <button 
                            v-if="order.status === 'delivered'"
                            @click="handleComplete(order.id)"
                            class="px-4 py-2 bg-green-600 text-white text-sm font-bold rounded hover:bg-green-700 shadow-sm animate-pulse"
                          >
                             ✅ Konfirmasi Pesanan Diterima
                          </button>
                      </div>
                  </div>
              </div>
             <div v-if="order.status === 'pending'" class="text-end pt-2">
                <p class="text-bold text-gray-400">
                    Klik cek status jika sudah melakukan pembayaran
                </p>
            </div>

          </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>