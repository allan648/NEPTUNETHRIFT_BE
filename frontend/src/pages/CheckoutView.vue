<script setup>
import { ref, reactive, onMounted, watch, computed } from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useRouter, onBeforeRouteLeave } from 'vue-router'; // Tambah onBeforeRouteLeave jika perlu

const router = useRouter();
const isLoading = ref(false);
const API_URL = "http://localhost:3000/api";
axios.defaults.withCredentials = true;

// Data Keranjang & User
const cartItems = ref([]);
const currentUser = ref(null);
const useMyAddress = ref(true);

const form = reactive({
  recipient_name: '',
  recipient_phone: '',
  shipping_address: '',
  shipping_city: ''
});

// --- FUNGSI UTAMA: AMBIL DATA (Dipisahkan agar bisa dipanggil ulang) ---
const loadCheckoutData = async () => {
  try {
    // 1. Ambil Profil User
    const userRes = await axios.get(`${API_URL}/auth/status`);
    if (userRes.data.user) {
        currentUser.value = userRes.data.user;
        // Hanya isi form otomatis jika user belum mengetik apa-apa (biar tidak menimpa ketikan user)
        if (!form.recipient_name && useMyAddress.value) {
            fillFormWithProfile();
        }
    }

    // 2. AMBIL KERANJANG (DENGAN ANTI-CACHE)
    // Trik: Tambahkan ?t=timestamp agar browser selalu minta data BARU ke server
    const timestamp = new Date().getTime(); 
    const cartRes = await axios.get(`${API_URL}/cart?_t=${timestamp}`); 
    
    // Update data
    cartItems.value = cartRes.data.items || cartRes.data;

  } catch (error) {
    console.error("Gagal memuat data checkout:", error);
  }
};

// --- LIFECYCLE ---
onMounted(() => {
    loadCheckoutData();
});

// --- COMPUTED & WATCHERS ---
const cartTotal = computed(() => {
    return cartItems.value.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);
});

const fillFormWithProfile = () => {
    if (currentUser.value) {
        form.recipient_name = currentUser.value.username || ''; 
        form.recipient_phone = currentUser.value.phone || '';   
        form.shipping_address = currentUser.value.address || ''; 
        form.shipping_city = currentUser.value.city || '';       
    }
};

const clearForm = () => {
    form.recipient_name = '';
    form.recipient_phone = '';
    form.shipping_address = '';
    form.shipping_city = '';
};

watch(useMyAddress, (isUsingProfile) => {
    if (isUsingProfile) {
        fillFormWithProfile();
    } else {
        clearForm();
    }
});

// --- HANDLE CHECKOUT ---
const handleCheckout = async () => {
    if (!form.recipient_name || !form.shipping_address || !form.recipient_phone || !form.shipping_city) {
        Swal.fire({ icon: 'warning', title: 'Alamat Belum Lengkap', text: 'Mohon lengkapi semua data pengiriman.' });
        return;
    }

    if (cartItems.value.length === 0) {
        Swal.fire('Keranjang Kosong', 'Belanja dulu yuk!', 'warning');
        return;
    }

    isLoading.value = true;

    try {
        const response = await axios.post(`${API_URL}/orders`, {
            recipient_name: form.recipient_name,
            recipient_phone: form.recipient_phone,
            shipping_address: form.shipping_address,
            shipping_city: form.shipping_city
        });

        const newOrderId = response.data.order_id;
        
        await Swal.fire({
            icon: 'success',
            title: 'Pesanan Dibuat!',
            text: 'Mengarahkan ke pembayaran...',
            timer: 1500,
            showConfirmButton: false
        });

        router.push('/my-order'); 

    } catch (error) {
        console.error(error);
        Swal.fire({
            icon: 'error',
            title: 'Gagal Checkout',
            text: error.response?.data?.message || 'Terjadi kesalahan server.',
        });
    } finally {
        isLoading.value = false;
    }
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans mt-16">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 mb-8 text-center sm:text-left">Checkout Pengiriman</h1>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <div class="lg:col-span-7">
            <div class="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
                <h2 class="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    📍 Alamat Tujuan
                </h2>

                <div class="mb-6 bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start sm:items-center gap-3">
                    <input 
                        type="checkbox" 
                        id="toggleAddress" 
                        v-model="useMyAddress"
                        class="w-5 h-5 mt-1 sm:mt-0 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                    >
                    <label for="toggleAddress" class="text-gray-700 font-medium cursor-pointer select-none text-sm sm:text-base">
                        Gunakan data dari Profil Saya (Auto-fill)
                        <p class="text-xs text-gray-500 font-normal mt-1">Uncheck jika ingin mengirim ke alamat lain / kado.</p>
                    </label>
                </div>

                <form @submit.prevent="handleCheckout" class="space-y-5">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-1">Nama Penerima</label>
                            <input v-model="form.recipient_name" type="text" class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-100 outline-none" placeholder="Nama Lengkap" required>
                        </div>
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-1">Nomor HP</label>
                            <input v-model="form.recipient_phone" type="tel" class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-100 outline-none" placeholder="Contoh: 0812..." required>
                        </div>
                    </div>

                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-1">Kota / Kabupaten</label>
                        <input v-model="form.shipping_city" type="text" class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-100 outline-none" placeholder="Contoh: Jakarta Selatan" required>
                    </div>

                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-1">Alamat Lengkap</label>
                        <textarea v-model="form.shipping_address" rows="3" class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-100 outline-none" placeholder="Jalan, Nomor Rumah, RT/RW, Kecamatan..." required></textarea>
                    </div>
                </form>
            </div>
        </div>

        <div class="lg:col-span-5">
            <div class="bg-white rounded-2xl shadow-sm p-6 sm:p-8 sticky top-24">
                <h2 class="text-xl font-bold text-gray-800 mb-6">Ringkasan Pesanan</h2>

                <div class="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    
                    <div v-if="cartItems.length === 0" class="text-center py-4 text-gray-500 italic">
                        Keranjang kosong...
                    </div>

                    <div v-for="item in cartItems" :key="item.id" class="flex gap-4 items-center">
                        <div class="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                            <img 
                                :src="item.image || 'https://via.placeholder.com/150'" 
                                :alt="item.name" 
                                class="w-full h-full object-cover mix-blend-multiply"
                            >
                        </div>
                        
                        <div class="flex-grow">
                            <h4 class="text-sm font-bold text-gray-800 line-clamp-2">{{ item.name }}</h4>
                            <p v-if="item.size" class="text-xs text-gray-500 mt-0.5">Size: {{ item.size }}</p>
                            <p class="text-xs text-gray-500">Jumlah: {{ item.quantity }}x</p>
                        </div>

                        <div class="text-sm font-semibold text-gray-900">
                            Rp {{ (item.price * item.quantity).toLocaleString('id-ID') }}
                        </div>
                    </div>
                </div>

                <div class="border-t border-dashed border-gray-300 my-4"></div>

                <div class="flex justify-between items-center mb-8">
                    <span class="text-lg font-bold text-gray-600">Total Tagihan</span>
                    <span class="text-2xl font-extrabold text-blue-700">Rp {{ cartTotal.toLocaleString('id-ID') }}</span>
                </div>

                <button 
                    @click="handleCheckout" 
                    :disabled="isLoading || cartItems.length === 0"
                    class="w-full bg-blue-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                >
                    <span v-if="isLoading">
                        <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    </span>
                    <span v-else>Buat Pesanan</span>
                </button>

                <p class="text-xs text-gray-400 text-center mt-4">
                    Dengan membuat pesanan, Anda menyetujui Syarat & Ketentuan kami.
                </p>
            </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>