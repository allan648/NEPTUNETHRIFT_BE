<script setup>
//import { defineProps, defineEmits } from 'vue';

// Props
defineProps({
  show: {
    type: Boolean,
    default: false
  },
  // Data dinamis (opsional), default value disesuaikan dengan gambar
  commentData: {
    type: Object,
    default: () => ({
      username: 'Fiky_KNJT_066',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      rating: 5,
      text: 'Websitenya ramah dan mudah untuk mencari sepatu thrift yanhg bagus disini, harganya juga ramah di kantong mahasiswa'
    })
  }
});

const emit = defineEmits(['close']);

const close = () => {
  emit('close');
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
      <!-- Modal Content Container -->
      <div
        class="relative w-full max-w-xl rounded-xl bg-white p-8 shadow-2xl m-4"
        style="animation: scaleIn 0.3s"
      >
        <!-- Header: Title & Close Button -->
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-3xl font-bold text-gray-900">
            <span class="text-[#0B2F5C]">Comment</span> Detail's
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

        <!-- Inner Card (White box with shadow) -->
        <div class="bg-white rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-gray-50 p-6 mb-8">

          <!-- Avatar -->
          <div class="mb-4">
            <img
              :src="commentData.avatar"
              alt="User Avatar"
              class="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
            >
          </div>

          <!-- Account Info Row -->
          <div class="flex justify-between items-center mb-3">
            <span class="font-bold text-gray-900 text-base">Account</span>
            <span class="font-bold text-gray-900 text-base">{{ commentData.username }}</span>
          </div>

          <!-- Rate Row -->
          <div class="flex justify-between items-center mb-4">
            <span class="font-bold text-gray-900 text-base">Rate</span>
            <div class="flex gap-1">
              <!-- Render Stars dynamically -->
              <svg
                v-for="i in 5"
                :key="i"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="w-5 h-5"
                :class="i <= commentData.rating ? 'text-yellow-400' : 'text-gray-300'"
              >
                <path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>

          <!-- Comment Section -->
          <div>
            <span class="font-bold text-gray-900 text-base block mb-1">Comment</span>
            <p class="text-gray-600 text-sm leading-relaxed">
              {{ commentData.text }}
            </p>
          </div>
        </div>

        <!-- Footer Link -->
        <div class="flex justify-end">
          <a href="#" class="text-[#0B2F5C] font-bold text-lg hover:underline cursor-pointer">
            Need help?
          </a>
        </div>

      </div>
    </div>
  </transition>
</template>

<style scoped>
/* Styling Animasi & Overlay (Konsisten dengan modal lainnya) */
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
