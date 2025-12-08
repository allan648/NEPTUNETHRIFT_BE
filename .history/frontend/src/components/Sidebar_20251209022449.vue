<script setup>
import { useRouter } from 'vue-router';
import axios from 'axios';
// Import ikon. Pastikan library lucide-vue-next sudah diinstall
import { User, Heart, ShoppingCart, Star, LogOut } from 'lucide-vue-next';
import defaultAvatar from '@/asset/images/user_profile/default-avatar.png';

// Menerima data dari UserLayout
defineProps({
  user: {
    type: Object,
    required: true,
    // Default placeholder yang netral
    default: () => ({
      username: 'Loading...', 
      email: '',
      image: defaultAvatar,
    })
  }
});

const router = useRouter();
const API_URL = "http://localhost:3000/api/auth";

// 1. Handle jika gambar rusak/error
const handleImageError = (e) => {
  e.target.src = defaultAvatar;
};

// 2. Fungsi Logout
const handleLogout = async () => {
  const confirmLogout = confirm("Apakah Anda yakin ingin keluar?");
  if (!confirmLogout) return;

  try {
    await axios.post(`${API_URL}/logout`);
    // Redirect ke Home
    router.push('/');
    // Refresh agar state bersih
    setTimeout(() => {
      window.location.reload();
    }, 100);
  } catch (error) {
    console.error("Gagal logout:", error);
    alert("Gagal logout.");
  }
};
</script>

<template>
  <aside class="hidden lg:flex flex-col min-w-64 border-r border-gray-200 bg-white min-h-[calc(100vh-100px)] p-6 rounded-l-xl">
    
    <div class="flex-1">
      
      <div class="flex items-center gap-3 mb-8 pb-8 border-b border-gray-100">
        <img
          :src="user.image || defaultAvatar"
          alt="Profile"
          class="w-12 h-12 rounded-full object-cover border-2 border-blue-600"
          @error="handleImageError"
          referrerpolicy="no-referrer"
        />
        <div class="overflow-hidden">
          <p class="font-bold text-gray-800 truncate text-sm" :title="user.username">
            {{ user.username }}
          </p>
          <p class="text-xs text-gray-500 truncate" :title="user.email">
            {{ user.email }}
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

        <RouterLink 
          :to="{ name: 'Review' }" 
          class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group"
          :class="$route.path.includes('/user/review') ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'"
        >
          <Star class="w-5 h-5" />
          <span>My Reviews</span>
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