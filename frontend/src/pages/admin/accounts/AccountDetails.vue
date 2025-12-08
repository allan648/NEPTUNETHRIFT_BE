<script setup>
import { reactive } from 'vue';

// Data dummy sesuai tampilan di gambar referensi
// Dalam implementasi nyata, data ini diambil dari API berdasarkan ID route
const userDetail = reactive({
  username: 'Udin Surudin',
  email: 'udinganteng@gmail.com',
  phoneNumber: '081234567891',
});
</script>

<template>
  <div class="space-y-6">
    <!-- Header (Struktur sama dengan CreateAdmin) -->
    <div class="flex flex-col gap-2">
      <h1 class="text-3xl font-semibold">Detail User</h1>

      <!-- Breadcrumb -->
      <nav class="text-sm font-medium text-gray-500" aria-label="Breadcrumb">
        <ol class="list-none p-0 inline-flex items-center space-x-2">
          <li><span>Users</span></li>
          <li><span class="mx-2">></span></li>
          <li><span>Management</span></li>
          <li><span class="mx-2">></span></li>
          <li class="text-gray-800"><span>Detail</span></li>
        </ol>
      </nav>
    </div>

    <!-- Content Card -->
    <div class="flex flex-col rounded-3xl border border-gray-300 bg-white">
      <div class="p-8">

        <!-- Form Layout (Read Only) -->
        <form @submit.prevent>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

            <!-- Username Input -->
            <div>
              <label class="block text-base font-semibold text-gray-800 mb-2">Username</label>
              <input
                :value="userDetail.username"
                disabled
                type="text"
                class="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none bg-gray-100 text-gray-600 cursor-not-allowed"
              >
            </div>

            <!-- Phone Number Input -->
            <div>
              <label class="block text-base font-semibold text-gray-800 mb-2">Phone Number</label>
              <input
                :value="userDetail.phoneNumber"
                disabled
                type="text"
                class="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none bg-gray-100 text-gray-600 cursor-not-allowed"
              >
            </div>

            <!-- Email Input -->
            <div class="md:col-span-1">
              <label class="block text-base font-semibold text-gray-800 mb-2">Email</label>
              <input
                :value="userDetail.email"
                disabled
                type="email"
                class="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none bg-gray-100 text-gray-600 cursor-not-allowed"
              >
            </div>

          </div>

          <!-- Action Buttons -->
          <div class="mt-8 flex items-center space-x-4">
            <!-- Tombol Back sesuai gambar -->
            <router-link
              :to="{ name: 'Accounts' }"
              class="bg-white text-gray-800 font-semibold px-8 py-3 border border-gray-300 rounded-full hover:bg-gray-100 transition duration-300 flex items-center justify-center min-w-[120px]"
            >
              Back
            </router-link>
          </div>
        </form>

      </div>
    </div>
  </div>
</template>

<style scoped>
/* Styling tambahan jika diperlukan */
</style>
