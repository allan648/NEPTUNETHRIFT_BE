<script setup>
//import { defineProps, defineEmits } from 'vue';

// 1. Props & Emits
defineProps({
  show: {
    type: Boolean,
    default: false
  },
  // Opsional: Jika ingin data dinamis nanti, bisa tambahkan prop 'transaction'
});

const emit = defineEmits(['close']);

const close = () => {
  emit('close');
};
</script>

<template>
  <transition name="modal-fade">
    <!-- Overlay Background (Konsisten dengan Create Category) -->
    <div
      v-if="show"
      class="fixed inset-0 z-50 flex items-center justify-center modal-blur-overlay"
      @click.self="close"
    >
      <!-- Modal Content -->
      <div
        class="relative w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl m-4 max-h-[90vh] overflow-y-auto custom-scrollbar"
        style="animation: scaleIn 0.3s"
      >
        <!-- Header -->
        <div class="flex justify-between items-start mb-6">
          <h2 class="text-2xl font-bold text-[#0B2F5C]">
            Transaction <span class="text-gray-800">History's</span>
          </h2>
          <button
            @click="close"
            class="text-gray-400 hover:text-gray-800 transition-colors"
          >
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="space-y-4">
          <!-- CARD 1: Status & Tanggal -->
          <div class="bg-white p-4 rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-gray-100">
            <h3 class="font-bold text-gray-900 text-lg mb-3">Pesanan Selesai</h3>
            <div class="flex justify-between items-center mb-2">
              <span class="text-gray-400 font-medium text-sm">Code Item</span>
              <span class="text-gray-900 font-bold text-sm">3673</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-400 font-medium text-sm">Tanggal Pembelian</span>
              <span class="text-gray-900 font-bold text-sm">25 November 2025</span>
            </div>
          </div>

          <!-- CARD 2: Detail Produk -->
          <div class="bg-white p-4 rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-gray-100">
            <h3 class="font-bold text-gray-900 text-sm mb-3">Detail Produk</h3>
            <div class="flex gap-4">
              <!-- Image Placeholder -->
              <div class="w-20 h-24 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
                  alt="Product"
                  class="w-full h-full object-cover"
                >
              </div>
              <div class="flex flex-col justify-center w-full">
                <h4 class="font-bold text-gray-900">Skinny Fit Jeans</h4>
                <div class="text-xs text-gray-500 mt-1 mb-2">
                  <p>Size: Large</p>
                  <p>Color: Blue</p>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-xl font-bold text-gray-900">$130</span>
                  <span class="text-gray-400 text-sm line-through decoration-1">$160</span>
                  <span class="bg-red-100 text-red-500 text-xs font-bold px-2 py-0.5 rounded-full">-30%</span>
                </div>
              </div>
            </div>
          </div>

          <!-- CARD 3: Info Pengiriman -->
          <div class="bg-white p-4 rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-gray-100">
            <h3 class="font-bold text-gray-900 text-lg mb-3">Info Pengiriman</h3>
            <div class="space-y-2 text-sm">
              <div class="flex">
                <span class="w-24 text-gray-400 font-medium shrink-0">Kurir :</span>
                <span class="text-gray-900 font-semibold">Yunus Yuven</span>
              </div>
              <div class="flex">
                <span class="w-24 text-gray-400 font-medium shrink-0">No Resi :</span>
                <span class="text-gray-900 font-semibold">Yunus Yuven</span>
              </div>
              <div class="flex">
                <span class="w-24 text-gray-400 font-medium shrink-0">Alamat :</span>
                <span class="text-gray-900 font-semibold leading-relaxed">
                  Kampial Residence II, Benoa, Kec. Kuta Sel., Kabupaten Badung, Bali, 80361
                  <br>Kuta Selatan, Kab. Badung
                  <br>Bali 80361
                </span>
              </div>
            </div>
          </div>

          <!-- CARD 4: Rincian Pembayaran -->
          <div class="bg-white p-4 rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-gray-100">
            <h3 class="font-bold text-gray-900 text-lg mb-3">Rincian Pembayaran</h3>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-400 font-medium">Metode Pembayaran</span>
                <span class="text-gray-900 font-bold">BCA Virtual Account</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400 font-medium">Subtotal Harga Barang</span>
                <span class="text-gray-900 font-bold">Rp. 300.000</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400 font-medium">Promo (Diskon)</span>
                <span class="text-gray-900 font-bold">Rp. 30.000</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400 font-medium">Total Ongkos Kirim</span>
                <span class="text-gray-900 font-bold">Rp. 10.000</span>
              </div>
              <div class="flex justify-between pb-2 border-b border-dashed border-gray-200">
                <span class="text-gray-400 font-medium">Biaya Jasa Aplikasi</span>
                <span class="text-gray-900 font-bold">Rp. 5.000</span>
              </div>
              <div class="flex justify-between pt-1">
                <span class="text-gray-900 font-bold text-base">Total Pembayaran</span>
                <span class="text-gray-900 font-bold text-xl">Rp. 285.000</span>
              </div>
            </div>
          </div>

        </div>

        <!-- Footer Help -->
        <div class="mt-6 flex justify-end">
          <a href="#" class="text-[#0B2F5C] font-bold text-lg hover:underline cursor-pointer">
            Need help?
          </a>
        </div>

      </div>
    </div>
  </transition>
</template>

<style scoped>
/* Styling Animasi & Overlay (Sama dengan CreateCategory) */
@keyframes scaleIn {
  0% {
    transform: scale(0.9);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-blur-overlay {
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  background: rgba(255, 255, 255, 0.4);
  box-shadow: inset 0 0 100px rgba(0,0,0,0.1);
}

/* Custom Scrollbar untuk konten panjang */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>
