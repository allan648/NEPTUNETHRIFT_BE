<script setup>
import { reactive } from 'vue';

// Menggunakan reactive untuk state objek
// Diisi dummy data sesuai gambar referensi
const adminData = reactive({
  username: 'Udin Surudin',
  email: 'udinganteng@gmail.com',
  phoneNumber: '081234567891',
});

// Fungsi untuk handle submit form
const updateAdmin = () => {
  // Logika update ke server
  console.log('Data Admin yang akan diupdate:', adminData);
  // Contoh: axios.put('/api/admin/1', adminData)...
};
</script>

<template>
  <div class="space-y-6">
    <!-- Header (Structure matches CreateAdmin) -->
    <div class="flex flex-col gap-2">
      <h1 class="text-3xl font-semibold">Edit Admin</h1>
    </div>

    <!-- Content Card -->
    <div class="flex flex-col rounded-3xl border border-gray-300 bg-white">
      <div class="p-8">

        <!-- Form Content -->
        <form @submit.prevent="updateAdmin">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

            <!-- Username Input -->
            <div>
              <label for="username" class="block text-base font-semibold text-gray-800 mb-2">Username</label>
              <input
                v-model="adminData.username"
                type="text"
                id="username"
                placeholder="Username"
                class="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              >
            </div>

            <!-- Phone Number Input (Moved here to match screenshot layout) -->
            <div>
              <label for="phone-number" class="block text-base font-semibold text-gray-800 mb-2">Phone Number</label>
              <input
                v-model="adminData.phoneNumber"
                type="tel"
                id="phone-number"
                placeholder="Phone number"
                class="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              >
            </div>

            <!-- Email Input -->
            <div class="md:col-span-1">
              <label for="email" class="block text-base font-semibold text-gray-800 mb-2">Email</label>
              <input
                v-model="adminData.email"
                type="email"
                id="email"
                placeholder="Email"
                class="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              >
            </div>

          </div>

          <!-- Action Buttons -->
          <div class="mt-8 flex items-center space-x-4">
            <button
              type="submit"
              class="bg-blue-900 text-white font-semibold px-8 py-3 rounded-full hover:bg-blue-800 transition duration-300"
            >
              Save
            </button>

            <router-link
              :to="{ name: 'Accounts' }"
              class="bg-white text-gray-800 font-semibold px-8 py-3 border border-gray-300 rounded-full hover:bg-gray-100 transition duration-300 flex items-center justify-center"
            >
              Cancel
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
