<script setup>
import { ref, onMounted, onUnmounted, nextTick, computed } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import axios from 'axios';
import Swal from 'sweetalert2';

// Import Store
import { useAuthStore } from '@/stores/authStore';

// Import Komponen & Aset
import LoginModal from "@/components/auth/LoginModal.vue";
import defaultAvatar from "@/asset/images/user_profile/default-avatar.png";
import logofootwear from "@/asset/images/Footwear.png";
import cartIcon from "@/asset/images/icons/cart.png";
import EnvelopeIcon from "@/asset/images/icons/envelope.png";

// --- INISIALISASI ---
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore(); 

// --- STATE DARI STORE (COMPUTED) ---
const isAuthenticated = computed(() => authStore.isAuthenticated);
const currentUserAvatar = computed(() => authStore.user?.avatar || defaultAvatar);
const currentUsername = computed(() => authStore.user?.username || "User");
const isAdmin = computed(() => authStore.user?.role === 'admin');

const showLoginModal = computed({
  get: () => authStore.showLoginModal,
  set: (val) => val ? authStore.openLoginModal() : authStore.closeLoginModal()
});

// --- STATE LOKAL NAVBAR ---
const isSticky = ref(false);
const isSidebarOpen = ref(false);
const isUserOpen = ref(false);
const navbarRef = ref(null);
const navHeight = ref(0);
const searchTerm = ref("");

// --- FUNGSI PROTEKSI NAVIGASI ---
const handleProtectedNav = (path) => {
  if (isAuthenticated.value) {
    router.push(path);
  } else {
    Swal.fire({
      icon: 'warning',
      title: 'Akses Dibatasi',
      text: 'Silakan login untuk mengakses fitur ini.',
      showCancelButton: true,
      confirmButtonText: 'Login Sekarang',
      cancelButtonColor: '#d33',
      confirmButtonColor: '#000000',
    }).then((result) => {
      if (result.isConfirmed) authStore.openLoginModal();
    });
  }
};

const handleSearch = () => {
  if (!searchTerm.value.trim()) return;
  router.push({ path: '/product', query: { search: searchTerm.value } });
};

const toggleUserDropdown = () => isUserOpen.value = !isUserOpen.value;
const toggleSidebar = () => isSidebarOpen.value = !isSidebarOpen.value;

const handleScroll = () => {
  if (navbarRef.value) isSticky.value = window.scrollY > 80;
};

const closeOnClickOutside = (event) => {
  if (!event.target.closest(".user-dropdown")) isUserOpen.value = false;
};

const handleLogout = async () => {
    Swal.fire({
        title: 'Sign Out?',
        text: "Anda yakin ingin keluar?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        confirmButtonText: 'Ya, Keluar'
    }).then(async (result) => {
        if (result.isConfirmed) {
            await authStore.logout();
            isUserOpen.value = false;
            Swal.fire('Signed Out', 'Anda berhasil keluar.', 'success');
            router.push('/');
        }
    });
};

// --- LIFECYCLE HOOKS ---
onMounted(async () => {
  await authStore.checkAuth();
  
  nextTick(() => {
    if (navbarRef.value) navHeight.value = navbarRef.value.offsetHeight;
  });
  
  window.addEventListener("scroll", handleScroll);
  window.addEventListener("click", closeOnClickOutside);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
  window.removeEventListener("click", closeOnClickOutside);
});
</script>

<template>
  <div v-if="isSticky" :style="{ height: navHeight + 'px' }"></div>

  <nav
    ref="navbarRef"
    class="w-full transition-all duration-300 z-50"
    :class="{
      'fixed top-0 left-0 right-0 bg-white shadow-lg': isSticky,
      'relative bg-white shadow-md': !isSticky,
    }"
  >
    <div class="container mx-auto flex justify-between items-center px-6 py-3">
      
      <RouterLink to="/" class="flex items-center space-x-2">
        <img :src="logofootwear" alt="Logo" class="h-8 w-8" />
        <span class="font-extrabold text-xl uppercase">
          <span class="text-blue-700">Neptune</span>Thrift
        </span>
      </RouterLink>

      <div class="hidden md:flex flex-grow items-center justify-center px-8 space-x-12">
        <form v-if="isSticky" @submit.prevent="handleSearch" class="w-full max-w-md">
          <div class="relative">
            <input v-model="searchTerm" type="text" placeholder="Cari sepatu impianmu..." class="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clip-rule="evenodd" /></svg>
            </div>
          </div>
        </form>

        <ul class="flex items-center space-x-12">
          <li class="group flex flex-col items-center">
            <RouterLink to="/product" class="font-medium text-blue-700 hover:text-blue-500 transition" :class="{ 'text-blue-500': route.path === '/product' }">Product</RouterLink>
            <span class="mt-1 h-0.5 bg-blue-500 rounded-full transition-all duration-400" :class="route.path === '/product' ? 'w-8' : 'w-0 group-hover:w-8'"></span>
          </li>
          <li class="group flex flex-col items-center">
            <RouterLink to="/promo" class="font-medium text-blue-700 hover:text-blue-500 transition" :class="{ 'text-blue-500': route.path === '/promo' }">Promo</RouterLink>
            <span class="mt-1 h-0.5 bg-blue-500 rounded-full transition-all duration-400" :class="route.path === '/promo' ? 'w-8' : 'w-0 group-hover:w-8'"></span>
          </li>
          <li class="group flex flex-col items-center">
            <RouterLink to="/about" class="font-medium text-blue-700 hover:text-blue-500 transition" :class="{ 'text-blue-500': route.path === '/about' }">About</RouterLink>
            <span class="mt-1 h-0.5 bg-blue-500 rounded-full transition-all duration-400" :class="route.path === '/about' ? 'w-8' : 'w-0 group-hover:w-8'"></span>
          </li>
        </ul>
      </div>

      <div class="md:hidden">
        <button @click="toggleSidebar" aria-label="Toggle sidebar">
          <svg class="h-6 w-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
        </button>
      </div>

      <div class="hidden md:flex items-center space-x-10">
        <div class="group flex flex-col items-center cursor-pointer relative"> 
          <a @click.prevent="handleProtectedNav('/user/cart')" class="relative">
            <img :src="cartIcon" alt="Cart" class="h-10 w-10 transition duration-300 group-hover:scale-110" />
          </a>
          <span class="mt-1 h-0.5 bg-blue-500 rounded-full transition-all duration-400" :class="route.path === '/user/cart' ? 'w-8' : 'w-0 group-hover:w-8'"></span>
        </div>

        <div class="group flex flex-col items-center cursor-pointer">
          <a @click.prevent="handleProtectedNav('/myorder')">
            <img :src="EnvelopeIcon" alt="Orders" class="mt-1 h-8 w-8 transition duration-300 group-hover:scale-110" />
          </a>
          <span class="mt-1 h-0.5 bg-blue-500 rounded-full transition-all duration-400" :class="route.path === '/myorder' ? 'w-8' : 'w-0 group-hover:w-8'"></span>
        </div>

        <div>
          <div v-if="isAuthenticated" class="relative user-dropdown">
            <button @click="toggleUserDropdown" class="focus:outline-none">
              <img :src="currentUserAvatar" alt="User" class="h-10 w-10 rounded-full object-cover border-2 border-transparent hover:border-blue-500 transition-all hover:scale-105" />
            </button>
            <div v-if="isUserOpen" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl z-20 py-1 border">
              <RouterLink to="/user/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"> My Profile </RouterLink>
              <RouterLink v-if="isAdmin" to="/admin/dashboard" class="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"> My Dashboard </RouterLink>
              <a href="#" @click.prevent="handleLogout" class="block px-4 py-2 text-sm text-red-600 hover:bg-red-50"> Sign Out </a>
            </div>
          </div>
          <div v-else>
            <button @click="authStore.openLoginModal()" class="flex items-center gap-2 font-medium text-white bg-blue-700 hover:bg-blue-600 px-5 py-2 rounded-full transition shadow-md">
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>

  <div v-if="isSidebarOpen" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden" @click="isSidebarOpen = false"></div>
  <aside class="fixed top-0 left-0 w-[280px] h-full bg-white z-[70] shadow-2xl transform transition-transform duration-300 md:hidden flex flex-col" :class="isSidebarOpen ? 'translate-x-0' : '-translate-x-full'">
    <div class="p-6 flex justify-between items-center border-b">
      <span class="font-extrabold text-xl text-blue-700">NEPTUNE THRIFT</span>
      <button @click="isSidebarOpen = false" class="p-2 rounded-full hover:bg-gray-100">
        <svg class="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
    </div>
    <div class="flex-1 overflow-y-auto p-4">
      <nav class="flex flex-col space-y-2">
        <RouterLink to="/product" @click="isSidebarOpen = false" class="flex items-center gap-4 px-4 py-3 rounded-xl text-gray-700 hover:bg-blue-50 transition">Product</RouterLink>
        <RouterLink to="/promo" @click="isSidebarOpen = false" class="flex items-center gap-4 px-4 py-3 rounded-xl text-gray-700 hover:bg-blue-50 transition">Promo</RouterLink>
        <RouterLink to="/about" @click="isSidebarOpen = false" class="flex items-center gap-4 px-4 py-3 rounded-xl text-gray-700 hover:bg-blue-50 transition">About</RouterLink>
        <a @click.prevent="handleProtectedNav('/user/cart'); isSidebarOpen = false" class="flex items-center gap-4 px-4 py-3 rounded-xl text-gray-700 hover:bg-blue-50 transition cursor-pointer">Cart</a>
      </nav>
    </div>
    <div class="p-4 border-t bg-gray-50">
      <div v-if="isAuthenticated" class="flex flex-col gap-2">
        <RouterLink to="/user/profile" @click="isSidebarOpen = false" class="flex items-center justify-center px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-700 font-medium transition">My Profile</RouterLink>
        <button @click="handleLogout" class="py-3 rounded-xl text-red-600 font-medium hover:bg-red-50 transition w-full">Sign Out</button>
      </div>
      <div v-else>
        <button @click="authStore.openLoginModal(); isSidebarOpen = false" class="w-full py-3 rounded-xl bg-blue-700 text-white font-bold transition active:scale-95">Sign In / Register</button>
      </div>
    </div>
  </aside>

  <LoginModal :show="showLoginModal" @close="authStore.closeLoginModal()" @login-success="authStore.checkAuth()" />
</template>