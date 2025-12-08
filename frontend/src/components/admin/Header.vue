<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import defaultAvatar from '@/asset/images/user_profile/default-avatar.png'

// -- DATA UNTUK KONTROL UI --
// Mengontrol visibilitas sidebar pada mode mobile
const isSidebarOpen = ref(false)
// Mengontrol visibilitas dropdown menu pengguna
const isUserOpen = ref(false)
// Mengontrol status otentikasi pengguna (gantilah dengan state management Anda, misal: Pinia/Vuex)
const isAuthenticated = ref(true) // Set `true` untuk tampilan login, `false` untuk non-login

const emit = defineEmits(['sidebarOpen'])

// -- METHODS --
// Fungsi untuk membuka/menutup sidebar
const handleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
  emit('sidebarOpen', isSidebarOpen.value)
}

// Fungsi untuk membuka/menutup dropdown pengguna
const toggleUserDropdown = () => {
  isUserOpen.value = !isUserOpen.value
}

// Fungsi untuk proses logout
const handleLogout = () => {
  isAuthenticated.value = false
  isUserOpen.value = false // Tutup dropdown setelah logout
  // Tambahkan logika logout Anda di sini (misal: panggil API, hapus token)
}
</script>

<template>
  <div
    class="sticky top-0 w-full z-50 flex justify-between items-center p-3.5 bg-gray-50 border-b border-gray-300"
  >
    <!-- Tombol Hamburger untuk Mobile -->
    <div class="lg:hidden">
      <button
        @click="handleSidebar"
        class="cursor-pointer flex items-center justify-center p-2.5 rounded-lg"
        aria-label="Toggle sidebar"
      >
        <HamburgerMenu v-if="!isSidebarOpen" class="text-gray-600 size-4.5" />
        <Exit v-else class="text-gray-600 size-4.5" />
      </button>
    </div>

    <!-- Avatar/User Section -->
    <div class="relative ml-auto">
      <!-- Jika pengguna sudah login -->
      <div v-if="isAuthenticated">
        <button
          @click="toggleUserDropdown"
          class="flex items-center gap-3 focus:outline-none"
        >
          <img
            :src="defaultAvatar"
            alt="User Avatar"
            class="size-9 rounded-full object-cover border-2 border-gray-200 transition-all hover:border-blue-500"
          />
          <p class="text-gray-900 gap-0.5 flex items-center font-medium text-sm max-w-36 line-clamp-1">
            <span class="hidden sm:block">Admin</span><!-- Ganti dengan nama user dinamis -->
            <ArrowDown class="text-gray-900 size-4" />
          </p>
        </button>

        <!-- Dropdown Menu Pengguna -->
        <div
          v-if="isUserOpen"
          class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl z-20 py-1 border border-gray-200"
        >
          <RouterLink
            to="../"
            class="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
          >
            Home
          </RouterLink>
          <RouterLink
            to="/user/profile"
            class="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
          >
            My Profile
          </RouterLink>
          <RouterLink
            to="/admin/dashboard"
            class="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
          >
            My Dashboard
          </RouterLink>
          <a
            href="#"
            @click.prevent="handleLogout"
            class="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
          >
            Sign Out
          </a>
        </div>
      </div>

      <!-- Jika pengguna belum login -->
      <div v-else>
        <button
          class="flex items-center gap-2 font-medium text-white bg-blue-700 hover:bg-blue-600 px-4 py-2 rounded-full transition-colors"
        >
          <svg
            class="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M7.5 3.75A1.5 1.5 0 006 5.25v13.5a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5V15a.75.75 0 011.5 0v3.75a3 3 0 01-3 3h-6a3 3 0 01-3-3V5.25a3 3 0 013-3h6a3 3 0 013 3V9A.75.75 0 0115 9V5.25a1.5 1.5 0 00-1.5-1.5h-6zm10.72 4.72a.75.75 0 011.06 0l3 3a.75.75 0 010 1.06l-3 3a.75.75 0 11-1.06-1.06l1.72-1.72H9a.75.75 0 010-1.5h10.94l-1.72-1.72a.75.75 0 010-1.06z"
              clip-rule="evenodd"
            />
          </svg>
          Sign In
        </button>
      </div>
    </div>
  </div>
</template>
