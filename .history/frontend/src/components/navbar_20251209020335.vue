<script setup>
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router"; // 1. Import useRouter
import axios from 'axios';
// Import LoginModal
import LoginModal from "@/components/auth/LoginModal.vue";

import defaultAvatar from "@/asset/images/user_profile/default-avatar.png";
import logofootwear from "@/asset/images/Footwear.png";
import cartIcon from "@/asset/images/icons/cart.png";
import EnvelopeIcon from "@/asset/images/icons/envelope.png";


// --- SIMULASI STATUS LOGIN ---
axios.defaults.withCredentials = true;
const isAuthenticated = ref(false); // false = belum login
const API_URL = "http://localhost:3000/api/auth";
// State untuk modal login
const showLoginModal = ref(false);

const isSticky = ref(false);
const isSidebarOpen = ref(false);
const isUserOpen = ref(false);
const navbarRef = ref(null);
const navHeight = ref(0);
const route = useRoute();
const router = useRouter(); // 2. Inisialisasi router
// 3. State untuk search bar
const searchTerm = ref("");
const currentUserAvatar = ref(defaultAvatar);
const currentUsername = ref("User");
// 4. Fungsi untuk menangani pencarian
const handleSearch = () => {
  if (!searchTerm.value.trim()) return; // Jangan cari jika kosong
  router.push({ path: '/product', query: { search: searchTerm.value } });
};

const toggleUserDropdown = () => {
  isUserOpen.value = !isUserOpen.value;
};
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

// 5. Modifikasi handleScroll untuk memicu search bar
const handleScroll = () => {
  if (navbarRef.value) {
    // Tampilkan search bar setelah scroll lebih dari 80px
    isSticky.value = window.scrollY > 80;
  }
};

const closeOnClickOutside = (event) => {
  if (!event.target.closest(".user-dropdown")) {
    isUserOpen.value = false;
  }
};

onMounted(async () => { // Tambahkan async di sini
  // 1. Panggil fungsi cek login SEGERA saat navbar dimuat
  await checkAuthStatus();
  nextTick(() => {
    if (navbarRef.value) {
      navHeight.value = navbarRef.value.offsetHeight;
    }
  });
  window.addEventListener("scroll", handleScroll);
  window.addEventListener("click", closeOnClickOutside);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
  window.removeEventListener("click", closeOnClickOutside);
});

const handleLogout = async () => {
    try {
        await axios.post(`${API_URL}/logout`);
        // Setelah logout berhasil
        isAuthenticated.value = false; // Set status login false
        isUserOpen.value = false; // Tutup dropdown
        alert("Anda berhasil logout.");
    } catch (error) {
        console.error("Logout failed:", error);
        alert("Gagal logout. Coba lagi.");
    }
};

const checkAuthStatus = async () => {
    try {
        const response = await axios.get(`${API_URL}/status`);
        isAuthenticated.value = response.data.isAuthenticated;

        if (response.data.isAuthenticated) {
            // Set Avatar
            if (response.data.avatar) {
                currentUserAvatar.value = response.data.avatar;
            } else {
                currentUserAvatar.value = defaultAvatar;
            }

            // Set Username (Ambil dari response backend)
            currentUsername.value = response.data.username || "User"; 
        }
    } catch (error) {
        console.error("Error checking auth status:", error);
        isAuthenticated.value = false;
    }
}
</script>

<template>
  <!-- Placeholder untuk mencegah konten melompat saat navbar menjadi sticky -->
  <div v-if="isSticky" :style="{ height: navHeight + 'px' }"></div>

  <!-- Navigasi Utama -->
  <nav
    ref="navbarRef"
    class="w-full transition-all duration-300 z-50"
    :class="{
      'fixed top-0 left-0 right-0 bg-white shadow-lg': isSticky,
      'relative bg-white shadow-md': !isSticky,
    }"
  >
    <div class="container mx-auto flex justify-between items-center px-6 py-3">
      <!-- Logo + Brand -->
      <RouterLink to="/" class="flex items-center space-x-2">
        <img :src="logofootwear" alt="Logo" class="h-8 w-8" />
        <span class="font-extrabold text-xl">
          <span class="text-blue-700">NEPTUNE</span>THRIFT
        </span>
      </RouterLink>

      <!-- PERUBAHAN DI SINI: Bagian Tengah (Search Bar DAN Menu) -->
      <div class="hidden md:flex flex-grow items-center justify-center px-8 space-x-12">
        <!-- Search Bar (Hanya muncul saat sticky) -->
        <form
          v-if="isSticky"
          @submit.prevent="handleSearch"
          class="w-full max-w-md"
        >
          <div class="relative">
            <input
              type="text"
              v-model="searchTerm"
              placeholder="Cari sepatu impianmu..."
              class="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
        </form>

        <!-- Menu Tengah (Sekarang selalu tampil di desktop) -->
        <ul class="flex items-center space-x-12">
           <li class="group flex flex-col items-center">
            <RouterLink
              to="/product"
              class="font-medium text-blue-700 transition-colors duration-300 group-hover:text-blue-500"
              :class="{ 'text-blue-500': route.path === '/product' }"
            >
              Product
            </RouterLink>
            <span
              class="mt-1 h-0.5 bg-blue-500 rounded-full transition-all duration-400 ease-out"
              :class="{
                'w-8': route.path === '/product',
                'w-0 group-hover:w-8': route.path !== '/product',
              }"
            ></span>
          </li>
          <li class="group flex flex-col items-center">
            <RouterLink
              to="/promo"
              class="font-medium text-blue-700 transition-colors duration-300 group-hover:text-blue-500"
              :class="{ 'text-blue-500': route.path === '/promo' }"
            >
              Promo
            </RouterLink>
            <span
              class="mt-1 h-0.5 bg-blue-500 rounded-full transition-all duration-400 ease-out"
              :class="{
                'w-8': route.path === '/promo',
                'w-0 group-hover:w-8': route.path !== '/promo',
              }"
            ></span>
          </li>
          <li class="group flex flex-col items-center">
            <RouterLink
              to="/about"
              class="font-medium text-blue-700 transition-colors duration-300 group-hover:text-blue-500"
              :class="{ 'text-blue-500': route.path === '/about' }"
            >
              About
            </RouterLink>
            <span
              class="mt-1 h-0.5 bg-blue-500 rounded-full transition-all duration-400 ease-out"
              :class="{
                'w-8': route.path === '/about',
                'w-0 group-hover:w-8': route.path !== '/about',
              }"
            ></span>
          </li>
        </ul>
      </div>

      <!-- Ikon Hamburger (Mobile) -->
      <div class="md:hidden">
        <button @click="toggleSidebar" aria-label="Toggle sidebar">
          <svg class="h-6 w-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>

      <!-- GRUP KANAN: Keranjang + Akun (Desktop) -->
      <div class="hidden md:flex items-center space-x-10">
        <!-- Ikon Keranjang Belanja -->
        <div class="group flex flex-col items-center">
          <RouterLink to="/user/cart" aria-label="View Shopping Cart">
            <img :src="cartIcon" alt="Shopping Cart" class="h-10 w-10 transition-transform duration-300 group-hover:scale-110" />
          </RouterLink>
          <span
            class="mt-1 h-0.5 bg-blue-500 rounded-full transition-all duration-400 ease-out"
            :class="{
              'w-8': route.path === '/user/cart',
              'w-0 group-hover:w-8': route.path !== '/user/cart',
            }"
          ></span>
        </div>

        <div class="group flex flex-col items-center">
          <RouterLink to="/myorder" aria-label="View My Orders">
            <img :src="EnvelopeIcon" alt="Notification" class=" mt-1 h-8 w-8 transition-transform duration-300 group-hover:scale-110" />
          </RouterLink>
          <span
            class="mt-1 h-0.5 bg-blue-500 rounded-full transition-all duration-400 ease-out"
            :class="{
              'w-8': route.path === '/myorder',
              'w-0 group-hover:w-8': route.path !== '/myorder',
            }"
          ></span>
        </div>

        <!-- Avatar/User -->
        <div>
          <div v-if="isAuthenticated" class="relative user-dropdown">
            <button @click="toggleUserDropdown" class="focus:outline-none block">
              <img :src="currentUserAvatar" alt="User" class="h-10 w-10 rounded-full object-cover border-2 border-transparent transition-all hover:border-blue-500 hover:scale-105" />
            </button>
            <div v-if="isUserOpen" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl z-20 py-1">
              <RouterLink to="/user/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"> My Profile </RouterLink>
              <RouterLink to="/admin/dashboard" class="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"> My Dashboard </RouterLink>
              <a href="#" @click.prevent="handleLogout()" class="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"> Sign Out </a>
            </div>
          </div>
          <div v-else>
            <button @click="showLoginModal = true" class="flex items-center gap-2 font-medium text-white bg-blue-700 hover:bg-blue-600 px-4 py-2 rounded-full transition-colors">
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path fill-rule="evenodd" d="M7.5 3.75A1.5 1.5 0 006 5.25v13.5a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5V15a.75.75 0 011.5 0v3.75a3 3 0 01-3 3h-6a3 3 0 01-3-3V5.25a3 3 0 013-3h6a3 3 0 013 3V9A.75.75 0 0115 9V5.25a1.5 1.5 0 00-1.5-1.5h-6zm10.72 4.72a.75.75 0 011.06 0l3 3a.75.75 0 010 1.06l-3 3a.75.75 0 11-1.06-1.06l1.72-1.72H9a.75.75 0 010-1.5h10.94l-1.72-1.72a.75.75 0 010-1.06z" clip-rule="evenodd" />
              </svg>
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>

  <!-- Sidebar (Mobile) -->
  <div
    v-if="isSidebarOpen"
    class="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden"
    @click="isSidebarOpen = false"
  ></div>
  <aside
    class="fixed top-0 left-0 w-64 h-full bg-white z-60 transform transition-transform duration-300 ease-in-out md:hidden"
    :class="isSidebarOpen ? 'translate-x-0' : '-translate-x-full'"
  >
    <div class="p-4">
       <div class="flex justify-between items-center mb-8">
        <span class="font-extrabold text-lg"><span class="text-blue-700">NEPTUNE</span>THRIFT</span>
        <button @click="isSidebarOpen = false">
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <nav class="flex flex-col space-y-4">
        <RouterLink to="/product" @click="isSidebarOpen = false" class="font-medium text-blue-700 hover:text-blue-500 text-lg">Product</RouterLink>
        <RouterLink to="/promo" @click="isSidebarOpen = false" class="font-medium text-blue-700 hover:text-blue-500 text-lg">Promo</RouterLink>
        <RouterLink to="/about" @click="isSidebarOpen = false" class="font-medium text-blue-700 hover:text-blue-500 text-lg">About</RouterLink>
        <RouterLink to="/user/cart" @click="isSidebarOpen = false" class="flex items-center gap-3 font-medium text-blue-700 hover:text-blue-500 text-lg">
          <img :src="cartIcon" alt="Cart" class="h-6 w-6" />
          <span>Cart</span>
        </RouterLink>
        <hr class="my-4" />
        <div v-if="isAuthenticated" class="space-y-4">
          <RouterLink to="/user/profile" @click="isSidebarOpen = false" class="font-medium text-blue-700 hover:text-blue-500 text-lg">My Profile</RouterLink>
          <a href="#" @click.prevent="handleLogout(); isSidebarOpen = false;" class="font-medium text-blue-700 hover:text-blue-500 text-lg">Sign Out</a>
        </div>
        <div v-else>
          <button @click="showLoginModal = true; isSidebarOpen = false" class="w-full flex items-center justify-center gap-2 font-medium text-white bg-blue-700 hover:bg-blue-600 px-4 py-2 rounded-full transition-colors">
             <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path fill-rule="evenodd" d="M7.5 3.75A1.5 1.5 0 006 5.25v13.5a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5V15a.75.75 0 011.5 0v3.75a3 3 0 01-3 3h-6a3 3 0 01-3-3V5.25a3 3 0 013-3h6a3 3 0 013 3V9A.75.75 0 0115 9V5.25a1.5 1.5 0 00-1.5-1.5h-6zm10.72 4.72a.75.75 0 011.06 0l3 3a.75.75 0 010 1.06l-3 3a.75.75 0 11-1.06-1.06l1.72-1.72H9a.75.75 0 010-1.5h10.94l-1.72-1.72a.75.75 0 010-1.06z" clip-rule="evenodd" />
              </svg>
            Sign In
          </button>
        </div>
      </nav>
    </div>
  </aside>

  <!-- Tambahkan LoginModal di akhir template -->
  <LoginModal
    :show="showLoginModal"
    @close="showLoginModal = false"
    @login-success="(data) => {
      console.log('Login success:', data);
      isAuthenticated = true;   // Set status login true
      showLoginModal = false;    // Tutup modal
    }"
  />
</template>
