<script setup>
import { ref } from 'vue';

// 1. Props untuk mengontrol visibilitas (sama seperti DetailReview.vue)
defineProps({
  show: {
    type: Boolean,
    default: false
  }
});

// 2. Emits untuk menutup modal atau mengirim data
const emit = defineEmits(['close', 'create']);

const categoryName = ref('');

const close = () => {
  emit('close');
  // Reset form saat ditutup jika diperlukan
  categoryName.value = '';
};

const handleCreate = () => {
  // Logika simpan data
  console.log('Creating category:', categoryName.value);
  emit('create', categoryName.value);
  close(); // Tutup modal setelah create
};
</script>

<template>
  <transition name="modal-fade">
    <!-- Overlay Background (Sama seperti DetailReview.vue) -->
    <div
      v-if="show"
      class="fixed inset-0 z-50 flex items-center justify-center modal-blur-overlay"
      @click.self="close"
    >
      <!-- Modal Content -->
      <div
        class="relative w-full max-w-2xl rounded-xl bg-white p-10 shadow-2xl m-4"
        style="animation: scaleIn 0.3s"
      >
        <!-- Tombol Close (X) di pojok kanan atas -->
        <button
          @click="close"
          class="absolute top-6 right-6 text-gray-400 hover:text-gray-800 transition-colors"
          aria-label="Close"
        >
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Header: Title & Breadcrumb -->
        <div class="mb-6">
          <h2 class="text-3xl font-bold text-blue-950 mb-2">Create Category</h2>
        </div>

        <!-- Form Container (Bordered Box sesuai gambar) -->
        <div class="border border-gray-200 rounded-3xl p-8 mb-8">
          <label class="block text-xl font-bold text-gray-900 mb-4">Category Name</label>
          <input
            v-model="categoryName"
            type="text"
            placeholder="Category Name?"
            class="w-full px-6 py-3.5 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent text-gray-700 placeholder-gray-400 transition-all"
          >
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center gap-4">
          <button
            @click="handleCreate"
            class="bg-[#0B2F5C] text-white text-base font-semibold px-10 py-3 rounded-full hover:bg-blue-900 transition duration-300 shadow-md"
          >
            Create
          </button>
          <button
            @click="close"
            class="bg-white text-gray-900 text-base font-semibold px-10 py-3 border border-gray-800 rounded-full hover:bg-gray-50 transition duration-300"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  </transition>
</template>

<style scoped>
/* Styling animasi dan backdrop sama persis dengan DetailReview.vue */
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
  /* Menggunakan backdrop blur seperti referensi */
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  background: rgba(255, 255, 255, 0.4); /* Background putih transparan */
  box-shadow: inset 0 0 100px rgba(0,0,0,0.1);
}
</style>
