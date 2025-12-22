<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
// 1. Import Store
import { useAuthStore } from '@/stores/authStore';

// Import ikon
import { User, Heart, ShoppingCart, Star, LogOut } from 'lucide-vue-next';
import defaultAvatar from '@/asset/images/user_profile/default-avatar.png';

const router = useRouter();
const authStore = useAuthStore(); // Gunakan Store

// 2. Data User (Computed dari Store)
// Kita pakai computed agar jika profile diupdate, sidebar otomatis berubah
const currentUser = computed(() => authStore.user);

// 3. Logika Avatar Pintar
const userAvatar = computed(() => {
  // Jika user belum load, pakai default
  if (!currentUser.value) return defaultAvatar;
  
  // Ambil avatar dari store (Backend kirim 'avatar', bukan 'image')
  return currentUser.value.avatar || defaultAvatar;
});

const userName = computed(() => currentUser.value?.username || 'Guest');
const userEmail = computed(() => currentUser.value?.email || '');

// Handle gambar error (jika link rusak)
const handleImageError = (e) => {
  e.target.src = defaultAvatar;
};

// 4. Fungsi Logout (Pakai Action dari Store)
const handleLogout = () => {
  // Panggil fungsi logout dari store yang sudah kita buat sebelumnya
  // Store yang akan mengurus API call + Redirect + Refresh
  authStore.logout();
};
</script>

<template>
  <aside class="hidden lg:flex flex-col min-w-64 border-r border-gray-200 bg-white min-h-[calc(100vh-100px)] p-6 rounded-l-xl">
    
    <div class="flex-1">
      
      <div class="flex items-center gap-3 mb-8 pb-8 border-b border-gray-100">
        <img
          :src="userAvatar"
          alt="Profile"
          class="w-12 h-12 rounded-full object-cover border-2 border-blue-600"
          @error="handleImageError"
          referrerpolicy="no-referrer"
        />
        
        <div class="overflow-hidden">
          <p class="font-bold text-gray-800 truncate text-sm" :title="userName">
            {{ userName }}
          </p>
          <p class="text-xs text-gray-500 truncate" :title="userEmail">
            {{ userEmail }}
          </p>
        </div>
      </div>

      <nav class="space-y-2">
        <RouterLink 
          :to="{ name: 'Profile' }" 
          class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group"
          :class="$route.path.includes('/user/profile') ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'"
        >
          <User class="w-5 h-5" />
          <span>My Profile</span>
        </RouterLink>

        <RouterLink 
          :to="{ name: 'Wishlist' }" 
          class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group"
          :class="$route.path.includes('/user/wishlist') ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'"
        >
          <Heart class="w-5 h-5" />
          <span>Wishlist</span>
        </RouterLink>

        <RouterLink 
          :to="{ name: 'Cart' }" 
          class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group"
          :class="$route.path.includes('/user/cart') ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'"
        >
          <ShoppingCart class="w-5 h-5" />
          <span>My Cart</span>
        </RouterLink>

        </nav>
    </div>

    <div class="mt-auto pt-6 border-t border-gray-100">
      <button 
        @click="handleLogout"
        class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all duration-200"
      >
        <LogOut class="w-5 h-5" />
        <span class="font-medium">Sign Out</span>
      </button>
    </div>

  </aside>
</template>