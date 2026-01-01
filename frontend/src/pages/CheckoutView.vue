<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useRouter } from 'vue-router';

const router = useRouter();
// STATUS LOADING
const isLoading = ref(true); 
const isRetrying = ref(false); // Status sinkronisasi
const retryCount = ref(0);     
const isProcessing = ref(false); 

const API_URL = "http://localhost:3000/api";
axios.defaults.withCredentials = true;

// DATA
const checkoutItems = ref([]); 
const currentUser = ref(null);
const useMyAddress = ref(true);
const shippingCost = ref(0); 

const form = reactive({
  recipient_name: '',
  recipient_phone: '',
  shipping_address: '',
});

// --- FUNGSI LOAD DATA (Smart Fetch) ---
const fetchDataWithRetry = async (attempt = 1) => {
    try {
        const timestamp = new Date().getTime();
        const cartRes = await axios.get(`${API_URL}/cart?_t=${timestamp}`);
        const allItems = cartRes.data.items || cartRes.data;
        const selected = allItems.filter(item => item.is_selected === 1 || item.is_selected === true);

        // JIKA DATA ADA
        if (selected.length > 0) {
            checkoutItems.value = selected;
            isLoading.value = false;
            isRetrying.value = false;
            return; 
        } 
        
        // JIKA MASIH KOSONG (Retry Logic jika database lambat banget)
        if (attempt <= 3) { 
            console.log(`Data belum siap, mencoba lagi... (${attempt})`);
            retryCount.value = attempt;
            setTimeout(() => { fetchDataWithRetry(attempt + 1); }, 1000);
        } else {
            isLoading.value = false;
            await Swal.fire({ icon: 'warning', title: 'Keranjang Kosong', text: 'Tidak ada barang yang dipilih.', confirmButtonText: 'Kembali' });
            router.push('/user/cart');
        }

    } catch (error) {
        if (error.response?.status === 401) router.push('/');
    }
};

// --- ON MOUNTED (DENGAN TIMEOUT 2 DETIK) ---
onMounted(async () => {
  // 1. Ambil Profil User (Langsung)
  try {
    const userRes = await axios.get(`${API_URL}/auth/status`);
    if (userRes.data.user) {
        currentUser.value = userRes.data.user;
        fillFormWithProfile();
    }
  } catch (e) { console.error("Skip profil loading"); }

  // 2. SET TIMEOUT 2 DETIK UNTUK REFRESH DATA KERANJANG
  // Ini memberi waktu agar database selesai menyimpan centangan dari halaman sebelumnya
  isRetrying.value = true; // Nyalakan pesan "Menyiapkan..."
  
  setTimeout(() => {
      fetchDataWithRetry(1); // Panggil data setelah 2 detik
  }, 2000); 
});

// --- COMPUTED ---
const subTotalProduk = computed(() => {
    return checkoutItems.value.reduce((total, item) => {
        // Gunakan discount_price jika is_promotion aktif
        const activePrice = item.is_promotion === 1 ? item.discount_price : item.price;
        return total + (activePrice * item.quantity);
    }, 0);
});

const totalPayment = computed(() => {
    return subTotalProduk.value + shippingCost.value + 1000; 
});

// --- HELPERS ---
const fillFormWithProfile = () => {
    if (currentUser.value) {
        form.recipient_name = currentUser.value.username || ''; 
        form.recipient_phone = currentUser.value.phone || '';   
        form.shipping_address = currentUser.value.address || ''; 
    }
};

const clearForm = () => {
    form.recipient_name = ''; form.recipient_phone = ''; form.shipping_address = '';
};

const toggleAddressMode = () => {
    useMyAddress.value = !useMyAddress.value;
    if (useMyAddress.value) fillFormWithProfile(); else clearForm();
};

const formatRp = (price) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
};

// --- CREATE ORDER ---
const handleCreateOrder = async () => {
    // 1. Validasi Input
    if (!form.recipient_name || !form.shipping_address || !form.recipient_phone) {
        Swal.fire({ 
            icon: 'warning', 
            title: 'Alamat Belum Lengkap', 
            text: 'Mohon lengkapi Nama, Telepon, dan Alamat.' 
        });
        return;
    }

    isProcessing.value = true;

    try {
        // 2. Request ke Backend untuk Buat Order & Dapat Token
        const response = await axios.post(`${API_URL}/orders`, {
            recipient_name: form.recipient_name,
            recipient_phone: form.recipient_phone,
            shipping_address: form.shipping_address,
            shipping_city: "-", 
            note: "" 
        });

        // 3. AMBIL TOKENNYA
        const snapToken = response.data.snap_token;

        // 4. CEK: Apakah Tokennya Ada?
        if (snapToken) {
            
            // Panggil popup Midtrans Snap
            window.snap.pay(snapToken, {
                // A. Jika Pembayaran SUKSES
                onSuccess: function(result) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Berhasil!',
                        text: 'Pembayaran sukses diterima.',
                        confirmButtonText: 'Lihat Pesanan'
                    }).then(() => {
                        // Berpindah halaman HANYA setelah user klik tombol di alert
                        router.push('/myorder');
                    });
                },
                
                // B. Jika Pembayaran PENDING
                onPending: function(result) {
                    Swal.fire({
                        icon: 'info',
                        title: 'Menunggu Pembayaran',
                        text: 'Silakan selesaikan pembayaran Anda sesuai instruksi.',
                        confirmButtonText: 'Ke Riwayat Pesanan'
                    }).then(() => {
                        router.push('/myorder');
                    });
                },
                
                // C. Jika Pembayaran GAGAL
                onError: function(result) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Gagal',
                        text: 'Terjadi kesalahan pada proses pembayaran.',
                        confirmButtonText: 'Tutup'
                    });
                    // Tidak langsung redirect agar user bisa mencoba kembali jika perlu
                },
                
                // D. Jika User MENUTUP Popup (Klik tombol silang X)
                onClose: function() {
                    Swal.fire({
                        title: 'Belum Selesai?',
                        text: 'Tenang, pesanan Anda sudah tersimpan. Anda bisa melanjutkannya nanti di menu Pesanan Saya.',
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonText: 'Ke Pesanan Saya',
                        cancelButtonText: 'Tetap di Sini'
                    }).then((result) => {
                        // Redirect HANYA jika user memilih untuk pindah ke halaman pesanan
                        if (result.isConfirmed) {
                            router.push('/myorder');
                        }
                    });
                }
            });

        } else {
            // Jika token tidak ada, arahkan ke myorder untuk cek manual
            router.push('/myorder');
        }

    } catch (error) {
        console.error(error);
        Swal.fire({ 
            icon: 'error', 
            title: 'Gagal', 
            text: error.response?.data?.message || 'Terjadi kesalahan saat membuat pesanan.' 
        });
    } finally {
        isProcessing.value = false;
    }
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 font-sans pb-20">
    
    <div class="bg-white shadow-sm sticky top-0 z-40 border-b border-gray-200">
        <div class="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
            <h1 class="text-xl text-blue-900 font-bold border-r border-gray-300 pr-4">NeptuneThrift</h1>
            <span class="text-lg text-gray-700">Checkout</span>
        </div>
    </div>

    <div v-if="isLoading" class="flex flex-col items-center justify-center py-32 h-[80vh]">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mb-6"></div>
        
        <h2 v-if="isRetrying" class="text-lg font-bold text-blue-900 animate-pulse transition-all">
           Sinkronisasi data keranjang...
        </h2>
        <p v-if="isRetrying" class="text-sm text-gray-500 mt-2">Mohon tunggu sebentar.</p>
        
        <h2 v-else class="text-lg font-bold text-gray-700">Memuat Checkout...</h2>
    </div>

    <div v-else class="max-w-6xl mx-auto px-4 mt-6 space-y-4">
        
        <div class="bg-white shadow-sm rounded-sm overflow-hidden relative p-6">
            <div class="absolute top-0 left-0 w-full h-[3px] bg-[repeating-linear-gradient(45deg,#EA5455,#EA5455_30px,#fff_30px,#fff_40px,#004C8C,#004C8C_70px,#fff_70px,#fff_80px)]"></div>
            
            <div class="flex items-center gap-2 mb-4 text-blue-900 font-bold text-lg">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" /></svg>
                Alamat Pengiriman
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                 <div>
                    <label class="block text-gray-500 text-xs font-bold uppercase mb-1">Nama Penerima</label>
                    <input v-model="form.recipient_name" type="text" class="w-full bg-gray-50 border border-gray-200 rounded p-2 focus:bg-white focus:border-blue-500 outline-none transition-colors" placeholder="Nama Lengkap">
                 </div>
                 <div>
                    <label class="block text-gray-500 text-xs font-bold uppercase mb-1">No. Handphone</label>
                    <input v-model="form.recipient_phone" type="text" class="w-full bg-gray-50 border border-gray-200 rounded p-2 focus:bg-white focus:border-blue-500 outline-none transition-colors" placeholder="08xx">
                 </div>
                 <div class="md:col-span-2">
                    <label class="block text-gray-500 text-xs font-bold uppercase mb-1">Alamat Lengkap</label>
                    <textarea 
                        v-model="form.shipping_address" 
                        rows="3" 
                        class="w-full bg-gray-50 border border-gray-200 rounded p-2 focus:bg-white focus:border-blue-500 outline-none transition-colors" 
                        placeholder="Nama Jalan, Gedung, No. Rumah, Kelurahan, Kecamatan, Kota, Kode Pos"
                    ></textarea>
                 </div>
            </div>
            
            <button @click="toggleAddressMode" class="mt-4 text-xs text-blue-600 font-bold uppercase tracking-wide hover:underline border border-blue-600 px-3 py-1 rounded hover:bg-blue-50 transition-colors">
                {{ useMyAddress ? 'Input Manual' : 'Gunakan Data Profil' }}
            </button>
        </div>

        <div class="bg-white shadow-sm rounded-sm p-6">
            <div class="hidden md:flex items-center text-sm text-gray-500 mb-4 pb-2 border-b">
                <div class="w-1/2">Produk Dipesan</div>
                <div class="w-1/6 text-center">Harga Satuan</div>
                <div class="w-1/6 text-center">Jumlah</div>
                <div class="w-1/6 text-right">Subtotal Produk</div>
            </div>

            <div v-for="item in checkoutItems" :key="item.cart_id" class="flex flex-col md:flex-row items-center gap-4 py-4 border-b border-gray-100 last:border-0">
    <div class="w-full md:w-1/2 flex items-center gap-3">
        <img :src="item.image || 'https://via.placeholder.com/150'" class="w-14 h-14 object-cover rounded border">
        <div>
            <p class="line-clamp-1 font-medium text-gray-800">{{ item.name }}</p>
            <p class="text-xs text-gray-500">Variasi: {{ item.size || 'All Size' }}</p>
        </div>
    </div>
    
    <div class="w-full md:w-1/6 text-center text-gray-600 text-sm hidden md:block">
        <div v-if="item.is_promotion === 1">
            <p class="font-bold text-red-600">{{ formatRp(item.discount_price) }}</p>
            <p class="text-[10px] line-through text-gray-400">{{ formatRp(item.price) }}</p>
        </div>
        <p v-else>{{ formatRp(item.price) }}</p>
    </div>

    <div class="w-full md:w-1/6 text-center text-gray-600 text-sm hidden md:block">
        {{ item.quantity }}
    </div>

    <div class="w-full md:w-1/6 text-right font-bold text-gray-800">
        {{ formatRp((item.is_promotion === 1 ? item.discount_price : item.price) * item.quantity) }}
    </div>
</div>

            <div class="border-t border-dashed border-gray-200 mt-4 pt-4 flex flex-col md:flex-row md:items-center justify-end gap-4">
                <div class="flex items-center justify-between md:justify-end gap-6 md:w-1/3">
                    
                   
                </div>
            </div>
        </div>

        <div class="bg-white shadow-sm rounded-sm p-6 mb-10">
            <div class="flex flex-col md:flex-row justify-between items-start gap-8 border-b border-gray-200 pb-6 mb-6">
                <div class="w-full md:w-1/2">
                    <h3 class="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wide">Metode Pembayaran</h3>
                    <div class="flex gap-3">
                        <button class="px-4 py-2 border border-blue-600 bg-blue-50 text-blue-700 font-semibold text-sm rounded transition-all shadow-sm">Transfer Bank</button>
                        <button class="px-4 py-2 border border-gray-200 text-gray-400 font-medium text-sm rounded cursor-not-allowed" disabled>COD (Nonaktif)</button>
                    </div>
                </div>

                <div class="w-full md:w-1/3 space-y-2">
                    <div class="flex justify-between text-sm text-gray-600"><span>Subtotal Produk</span><span>{{ formatRp(subTotalProduk) }}</span></div>
                    <!-- <div class="flex justify-between text-sm text-gray-600"><span>Total Ongkos Kirim</span><span>{{ formatRp(shippingCost) }}</span></div> -->
                    <div class="flex justify-between text-sm text-gray-600"><span>Biaya Layanan</span><span>Rp 1.000</span></div>
                    <div class="flex justify-between text-lg font-bold text-gray-800 pt-2 border-t mt-2">
                        <span>Total Pembayaran</span>
                        <span class="text-2xl text-blue-900">{{ formatRp(totalPayment) }}</span>
                    </div>
                </div>
            </div>

            <div class="flex flex-col items-end gap-4">
                <div class="w-full border-t border-dashed border-gray-200"></div>
                <div class="flex items-center justify-end gap-6 pt-2">
                    <button 
                        @click="handleCreateOrder"
                        :disabled="isProcessing"
                        class="bg-blue-900 text-white font-bold py-3 px-12 text-lg rounded shadow-lg hover:bg-blue-800 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        <span v-if="isProcessing" class="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                        <span v-else>Buat Pesanan</span>
                    </button>
                </div>
            </div>
        </div>

    </div>
  </div>
</template>