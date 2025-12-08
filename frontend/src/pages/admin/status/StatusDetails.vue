<script setup>
//import { defineProps, defineEmits } from 'vue';

// Props & Emits
defineProps({
  show: {
    type: Boolean,
    default: false
  }
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
        class="relative w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl m-4"
        style="animation: scaleIn 0.3s"
      >
        <!-- Header -->
        <div class="flex justify-between items-start mb-6">
          <h2 class="text-2xl font-bold text-gray-900">
            <span class="text-[#0B2F5C]">Status</span> Product Detail
          </h2>
          <!-- Tombol Close -->
          <button
            @click="close"
            class="text-gray-400 hover:text-gray-800 transition-colors"
          >
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Body Content -->
        <div class="space-y-4">

          <!-- CARD 1: Informasi -->
          <div class="bg-white p-4 rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-gray-100">
            <h3 class="font-bold text-gray-900 text-base mb-3">Informasi</h3>
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-gray-400 font-medium text-sm">Code Item</span>
                <span class="text-gray-900 font-bold text-sm">3673</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-400 font-medium text-sm">Tanggal Pembelian</span>
                <span class="text-gray-900 font-bold text-sm">25 November 2025</span>
              </div>
            </div>
          </div>

          <!-- CARD 2: Detail Produk -->
          <div class="bg-white p-4 rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-gray-100">
            <h3 class="font-bold text-gray-900 text-base mb-3">Detail Produk</h3>
            <div class="flex gap-4">
              <!-- Product Image -->
              <div class="w-20 h-24 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden shrink-0">
                <!-- Placeholder Image Jeans -->
                <img
                  src="https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
                  alt="Skinny Fit Jeans"
                  class="w-full h-full object-cover mix-blend-multiply"
                >
              </div>

              <!-- Product Info -->
              <div class="flex flex-col justify-center w-full">
                <h4 class="font-bold text-gray-900">Skinny Fit Jeans</h4>
                <div class="text-xs text-gray-500 mt-1 mb-2 space-y-0.5">
                  <p>Size: <span class="text-gray-500">Large</span></p>
                  <p>Color: <span class="text-gray-500">Blue</span></p>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-2xl font-bold text-gray-900">$130</span>
                  <span class="text-gray-400 text-sm line-through font-medium">$160</span>
                  <span class="bg-red-100 text-red-400 text-[10px] font-bold px-2 py-0.5 rounded-full">-30%</span>
                </div>
              </div>
            </div>
          </div>

          <!-- CARD 3: Status -->
          <div class="bg-white p-4 rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-gray-100 flex justify-between items-center h-16">
            <h3 class="font-bold text-gray-900 text-base">Status</h3>
            <span class="bg-[#86EFAC] text-green-900 text-sm font-semibold px-6 py-1.5 rounded-full">
              Ready
            </span>
          </div>

        </div>

        <!-- Footer Link -->
        <div class="mt-8 flex justify-end">
          <a href="#" class="text-[#0B2F5C] font-bold text-lg hover:underline cursor-pointer">
            Need help?
          </a>
        </div>

      </div>
    </div>
  </transition>
</template>

<style scoped>
/* Styling Animasi & Overlay (Sama persis dengan CreateCategory) */
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
</style>
