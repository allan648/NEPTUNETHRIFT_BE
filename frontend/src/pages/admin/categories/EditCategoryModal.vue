<script setup>
import { ref, watch } from 'vue';

// 1. Props
// 'show': untuk visibilitas modal
// 'categoryData': objek data kategori yang dipilih untuk diedit (misal: { id: 1, name: 'Sneakers' })
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  categoryData: {
    type: Object,
    default: () => ({ name: '' })
  }
});

// 2. Emits
const emit = defineEmits(['close', 'submit']);

// State lokal untuk menampung nama yang sedang diedit
const editedName = ref('');

// 3. Watcher
// Setiap kali modal dibuka atau data berubah, isi input dengan nama kategori yang ada
watch(
  () => props.categoryData,
  (newData) => {
    if (newData && newData.name) {
      editedName.value = newData.name;
    } else {
      editedName.value = '';
    }
  },
  { immediate: true, deep: true }
);

const close = () => {
  emit('close');
};

const handleEdit = () => {
  // Kirim data yang sudah diedit kembali ke parent
  emit('submit', { ...props.categoryData, name: editedName.value });
  close();
};
</script>

<template>
  <transition name="modal-fade">
    <!-- Overlay Background -->
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
        <!-- Tombol Close (X) -->
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
          <h2 class="text-3xl font-bold text-[#0B2F5C] mb-2">Edit Category</h2>
        </div>

        <!-- Form Container -->
        <div class="border border-gray-200 rounded-3xl p-8 mb-8">
          <label class="block text-xl font-bold text-gray-900 mb-4">Category Name</label>
          <input
            v-model="editedName"
            type="text"
            placeholder="Category Name"
            class="w-full px-6 py-3.5 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent text-gray-700 placeholder-gray-400 transition-all"
          >
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center gap-4">
          <button
            @click="handleEdit"
            class="bg-[#0B2F5C] text-white text-base font-semibold px-10 py-3 rounded-full hover:bg-blue-900 transition duration-300 shadow-md"
          >
            Edit
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
