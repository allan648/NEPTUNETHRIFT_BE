<script setup>
import { RouterLink } from 'vue-router'
import { User, Heart, ShoppingCart, Star } from 'lucide-vue-next' // Sesuaikan import icon Anda
import defaultAvatar from '@/asset/images/user_profile/default-avatar.png' // Pastikan path asset benar (pakai 's' di assets biasanya)

// Props
defineProps({
  user: {
    type: Object,
    required: true,
    default: () => ({
      username: 'Loading...',
      email: '...',
      image: defaultAvatar,
    })
  }
})

// Fungsi handle error gambar (sama seperti Navbar)
const handleImageError = (e) => {
  e.target.src = defaultAvatar;
}
</script>

<template>
  <aside class="hidden lg:block min-w-56 xl:min-w-70 min-h-screen border-r border-gray-300 p-6">
    <div class="flex flex-col gap-6">
      
      <div class="gap-2 flex flex-col xl:flex-row items-center">
        <img
          :src="user.image || defaultAvatar"
          alt="User Profile"
          class="size-12 object-cover rounded-full border-2 border-blue-700"
          @error="handleImageError" 
        />
        
        <div class="flex flex-col items-center xl:items-start gap-[2px]">
          <p class="font-medium whitespace-nowrap text-xs md:text-sm">
            {{ user.username }}
          </p>
          <p class="text-sm text-neu-500">{{ user.email }}</p>
        </div>
      </div>

      <ul class="flex flex-col gap-6">
         </ul>
    </div>
  </aside>
</template>