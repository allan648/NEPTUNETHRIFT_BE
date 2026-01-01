<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue' // Tambah onBeforeUnmount
import axios from 'axios';
import Swal from 'sweetalert2';
import { useRouter } from 'vue-router';

const router = useRouter();
const API_URL = "http://localhost:3000/api";
axios.defaults.withCredentials = true;

// --- STATE ---
const cartItems = ref([]);
const isLoading = ref(true);
const isCheckingOut = ref(false);

// --- FUNCTIONS ---

const formatRp = (price) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(price);
};

const fetchCart = async () => {
  isLoading.value = true;
  try {
    const timestamp = new Date().getTime(); 
    const response = await axios.get(`${API_URL}/cart?_t=${timestamp}`);
    const rawItems = response.data.items || response.data;
    
    // PENGECEKAN: Filter hanya produk yang statusnya 'active'
    // Produk yang 'inactive' (terjual/dihapus) otomatis hilang dari daftar
    cartItems.value = rawItems
        .filter(item => item.status === 'active') 
        .map(item => ({
            ...item,
            is_selected: item.is_selected === 1 || item.is_selected === true
        }));

  } catch (error) {
    if (error.response && error.response.status === 401) router.push('/');
  } finally {
    isLoading.value = false;
  }
};

const toggleItemSelection = async (item) => {
    try {
        await axios.put(`${API_URL}/cart/${item.cart_id}`, {
            is_selected: item.is_selected
        });
    } catch (error) {
        item.is_selected = !item.is_selected; 
    }
};

const selectAll = computed({
    get: () => cartItems.value.length > 0 && cartItems.value.every(item => item.is_selected),
    set: async (value) => {
        cartItems.value.forEach(item => item.is_selected = value);
        try {
            const promises = cartItems.value.map(item => 
                axios.put(`${API_URL}/cart/${item.cart_id}`, { is_selected: value })
            );
            await Promise.all(promises);
        } catch (error) {
            console.error("Gagal select all", error);
        }
    }
});

const removeItem = (cartId, productName) => {
  Swal.fire({
    title: 'Hapus Item?',
    text: `Hapus ${productName}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    confirmButtonText: 'Ya, Hapus'
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await axios.delete(`${API_URL}/cart/${cartId}`);
        cartItems.value = cartItems.value.filter(item => item.cart_id !== cartId);
        Swal.fire({ title: 'Terhapus!', icon: 'success', timer: 1000, showConfirmButton: false });
      } catch (error) {
        Swal.fire('Error', 'Gagal hapus', 'error');
      }
    }
  });
};

// --- PERBAIKAN LOGIKA TOTAL HARGA ---
const totalPrice = computed(() => {
  return cartItems.value
    .filter(item => item.is_selected)
    .reduce((total, item) => {
      // Jika promo aktif, gunakan discount_price, jika tidak gunakan price asli
      const priceToUse = item.is_promotion === 1 ? item.discount_price : item.price;
      return total + (priceToUse * item.quantity);
    }, 0);
});
const selectedCount = computed(() => {
    return cartItems.value.filter(item => item.is_selected).length;
});

const proceedToCheckout = async () => {
  if (selectedCount.value === 0) {
      Swal.fire('Pilih Barang', 'Silakan centang minimal satu barang.', 'info');
      return;
  }

  isCheckingOut.value = true;

  try {
      const selectedItems = cartItems.value.filter(item => item.is_selected);
      const promises = selectedItems.map(item => 
          axios.put(`${API_URL}/cart/${item.cart_id}`, { is_selected: true })
      );
      await Promise.all(promises);

      await new Promise(resolve => setTimeout(resolve, 800)); 

      router.push('/checkout');

  } catch (error) {
      console.error("Error", error);
      isCheckingOut.value = false;
  }
};

// --- LOGIKA HARD RELOAD 1x ---

onMounted(() => {
  // 1. Cek apakah di sesi ini kita sudah pernah reload halaman ini?
  const hasReloaded = sessionStorage.getItem('cart_reloaded');

  if (!hasReloaded) {
    // JIKA BELUM:
    // a. Simpan tanda bahwa kita akan reload
    sessionStorage.setItem('cart_reloaded', 'true');
    
    // b. Lakukan Hard Reload
    window.location.reload();
  } else {
    // JIKA SUDAH:
    // Jalankan fetch data seperti biasa (tanpa reload lagi)
    fetchCart(); 
  }
});

// Saat user meninggalkan halaman ini (ke Home/Checkout/dll)
onBeforeUnmount(() => {
  // Hapus tanda reload.
  // Jadi, jika user BALIK LAGI ke sini nanti, halaman akan reload lagi 1x.
  sessionStorage.removeItem('cart_reloaded');
});

</script>

<template>
  <div class="w-full p-6 md:p-10 min-h-screen pt-24">
    <div class="mx-auto max-w-4xl">
      
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-3xl md:text-4xl font-bold text-gray-800">My Cart</h1>
        <span class="text-gray-500 text-sm" v-if="!isLoading">{{ cartItems.length }} Items</span>
      </div>

      <div v-if="isLoading" class="flex justify-center py-20">
         <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>

      <div v-else class="space-y-6">
        
        <div v-if="cartItems.length > 0" class="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-gray-200 sticky top-20 z-10">
            <input 
                type="checkbox" 
                v-model="selectAll" 
                class="w-5 h-5 text-blue-900 rounded focus:ring-blue-500 cursor-pointer"
            >
            <label class="font-semibold text-gray-700 cursor-pointer select-none" @click="selectAll = !selectAll">
                Pilih Semua ({{ cartItems.length }})
            </label>
        </div>

        <div
          v-for="(item, index) in cartItems"
          :key="item.cart_id"
          class="flex flex-col sm:flex-row items-center gap-6 p-4 border border-gray-200 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
          :class="{'border-blue-500 ring-1 ring-blue-100': item.is_selected}"
        >
          <div class="self-start sm:self-center pt-2 sm:pt-0">
             <input 
                type="checkbox" 
                v-model="item.is_selected" 
                @change="toggleItemSelection(item)"
                class="w-5 h-5 text-blue-900 rounded focus:ring-blue-500 cursor-pointer"
             >
          </div>

          <div class="w-28 h-28 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden relative border border-gray-100">
            <img :src="item.image || 'https://via.placeholder.com/150'" class="h-full w-full object-cover mix-blend-multiply">
          </div>

              <div class="flex-grow text-center sm:text-left w-full sm:w-auto">
                <h2 class="text-lg font-bold text-gray-900 mb-1">{{ item.name }}</h2>
                <div class="flex items-center justify-center sm:justify-start gap-4 text-sm text-gray-500 mb-2">
                  <span v-if="item.size" class="bg-gray-100 px-2 py-0.5 rounded text-xs font-medium text-gray-600">Size: {{ item.size }}</span>
                  <span class="flex items-center gap-1 text-xs font-medium text-blue-600">Condition: {{ item.condition }}/5</span>
                </div>

                <div v-if="item.is_promotion === 1" class="flex flex-col sm:items-start items-center">
                  <p class="text-xl font-black text-red-600 leading-none">{{ formatRp(item.discount_price) }}</p>
                  <p class="text-xs text-gray-400 line-through mt-1">{{ formatRp(item.price) }}</p>
                </div>
                <p v-else class="text-xl font-bold text-blue-700">{{ formatRp(item.price) }}</p>
              </div>

          <div class="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto mt-2 sm:mt-0 border-t sm:border-0 pt-4 sm:pt-0 border-gray-100">
            <div class="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
                <span>Qty:</span><span class="font-bold text-gray-900">{{ item.quantity }}</span>
            </div>
            <button @click="removeItem(item.cart_id, item.name)" class="text-gray-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-full transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          </div>
        </div>

        <div v-if="cartItems.length === 0" class="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
          <p class="text-gray-500 text-lg font-medium">Keranjang kosong.</p>
          <router-link to="/product" class="text-blue-600 font-semibold mt-2 inline-block hover:underline">Mulai Belanja</router-link>
        </div>
      </div>

      <div v-if="cartItems.length > 0 && !isLoading" class="sticky bottom-0 mt-8 p-4 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] rounded-t-2xl z-20">
        <div class="flex flex-col sm:flex-row justify-between items-center gap-6 max-w-4xl mx-auto">
          <div class="text-center sm:text-left">
             <p class="text-gray-500 text-sm mb-1">Total ({{ selectedCount }} Barang)</p>
             <p class="text-3xl font-extrabold text-gray-900 tracking-tight">{{ formatRp(totalPrice) }}</p>
          </div>

          <button
            @click="proceedToCheckout"
            :disabled="selectedCount === 0 || isCheckingOut"
            class="w-full sm:w-auto group relative px-8 py-4 bg-gray-900 text-white font-bold rounded-full overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
             <span v-if="isCheckingOut">
                <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
             </span>
             <span v-else>Checkout ({{ selectedCount }})</span>
          </button>
        </div>
      </div>

    </div>
  </div>
</template>