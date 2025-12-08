<script setup>
import defaultAvatar from '@/asset/images/user_profile/default-avatar.png'

// Komponen sekarang menerima data pengguna melalui 'props'
// Ini membuatnya independen dari state management (seperti Pinia/authStore)
defineProps({
  user: {
    type: Object,
    required: true,
    // Menyediakan nilai default untuk mencegah error jika prop tidak dikirim
    default: () => ({
      username: 'FIKY KNJT',
      email: 'fkyknjt@gmail.com',
      image: defaultAvatar,
    })
  }
})


</script>

<template>
  <aside class="hidden lg:block min-w-56 xl:min-w-70 min-h-screen border-r border-gray-300 p-6">
    <div class="flex flex-col gap-6">
      <!-- Info Pengguna, sekarang menggunakan data dari 'props' -->
      <div class="gap-2 flex flex-col xl:flex-row items-center">
        <img
          v-if="user.image"
          :src="user.image"
          alt="User Profile"
          class="size-12 object-cover rounded-full border-2 border-blue-700"
        />
        <img
          v-else
          :src="defaultAvatar"
          alt="Default Profile"
          class="size-12 rounded-full border-2 border-neu-200 object-cover"
        />
        <div class="flex flex-col items-center xl:items-start gap-[2px]">
          <p class="font-medium whitespace-nowrap text-xs md:text-sm">
            {{ user.username }}
          </p>
          <p class="text-sm text-neu-500">{{ user.email }}</p>
        </div>
      </div>

      <!-- Tautan Navigasi (tidak ada perubahan di sini) -->
      <ul class="flex flex-col gap-6">
        <li>
          <RouterLink
            :to="{ name: 'Profile' }"
            class="flex gap-3 items-center py-2.5 px-2 font-medium hover:bg-blue-300 transition-all duration-50 rounded-xl"
            :class="$route.path.startsWith('/user/profile') ? 'bg-blue-300 text-pr-500' : ''"
          >
            <User
              class="size-5"
              :class="$route.path.startsWith('/user/profile') ? ' text-pr-500' : 'text-neu-500'"
            />Profile
          </RouterLink>
        </li>
        <li>
          <RouterLink
            :to="{ name: 'Wishlist' }"
            class="flex gap-3 items-center py-2.5 px-2 font-medium hover:bg-blue-300 transition-all duration-50 rounded-xl"
            :class="$route.path.startsWith('/user/wishlist') ? 'bg-blue-300 text-pr-500' : ''"
          >
            <Heart
              class="size-5"
              :class="$route.path.startsWith('/user/wishlist') ? ' text-pr-500' : 'text-neu-500'"
            />Wishlist
          </RouterLink>
        </li>
        <li>
          <RouterLink
            :to="{ name: 'Cart' }"
            class="flex gap-3 items-center py-2.5 px-2 font-medium hover:bg-blue-300 transition-all duration-50 rounded-xl"
            :class="$route.path.startsWith('/user/cart') ? 'bg-blue-300 text-pr-500' : ''"
          >
            <ShoppingCart
              class="size-5"
              :class="$route.path.startsWith('/user/cart') ? ' text-pr-500' : 'text-neu-500'"
            />Cart
          </RouterLink>
        </li>
        <li>
          <RouterLink
            :to="{ name: 'Review' }"
            class="flex gap-3 items-center py-2.5 px-2 font-medium hover:bg-blue-300 transition-all duration-50 rounded-xl"
            :class="$route.path.startsWith('/user/review') ? 'bg-blue-300 text-pr-500' : ''"
          >
            <Star
              class="size-5"
              :class="$route.path.startsWith('/user/review') ? ' text-pr-500' : 'text-neu-500'"
            />Review
          </RouterLink>
        </li>
      </ul>
    </div>
  </aside>
</template>
