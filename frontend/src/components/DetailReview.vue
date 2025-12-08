<script setup>
// 1. HAPUS 'defineProps' dan 'defineEmits' dari import
import DefaultAvatar from '@/asset/images/user_profile/default-avatar.png';

// 2. TAMBAHKAN 'show' ke dalam defineProps
defineProps({
  review: {
    type: Object,
    required: true
  },
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
    <!-- 3. TAMBAHKAN v-if="show" di sini (sudah Anda lakukan, ini benar) -->
    <div
      v-if="show"
      class="fixed inset-0 z-50 flex items-center justify-center modal-blur-overlay"
      @click.self="close"
    >
      <div
        class="relative w-full max-w-lg rounded-xl bg-white p-8 shadow-2xl m-4"
        style="animation: scaleIn 0.3s"
      >
        <!-- Konten lainnya tetap sama -->
        <button
          @click="close"
          class="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
          aria-label="Close"
        >
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 class="text-2xl font-bold text-gray-900 mb-6">Comment Detail's</h2>

        <div class="space-y-4">
          <div class="flex items-center gap-4">
            <img :src="review.user.avatar || DefaultAvatar" alt="User Avatar" class="h-14 w-14 rounded-full object-cover" />
            <div>
              <p class="font-semibold text-gray-500">Account</p>
              <p class="font-bold text-gray-800">{{ review.user.name }}</p>
            </div>
          </div>
          <div>
            <p class="font-semibold text-gray-500 mb-1">Rate</p>
            <div class="flex items-center">
              <svg v-for="star in 5" :key="star" class="h-6 w-6" :class="star <= review.rating ? 'text-yellow-400' : 'text-gray-300'" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.368-2.448a1 1 0 00-1.175 0l-3.368 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.25 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" />
              </svg>
            </div>
          </div>
          <div>
            <p class="font-semibold text-gray-500">Comment</p>
            <p class="mt-1 text-gray-700 leading-relaxed">{{ review.text }}</p>
          </div>
        </div>
        <div class="mt-8 flex items-center justify-between">
          <button class="rounded-full bg-blue-800 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-600">
            Delete
          </button>
          <a href="#" class="font-semibold text-blue-800 underline hover:text-blue-600">Need help?</a>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
@keyframes scaleIn {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
.modal-blur-overlay {
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  background: rgba(255, 255, 255, 0.25);
}
</style>
