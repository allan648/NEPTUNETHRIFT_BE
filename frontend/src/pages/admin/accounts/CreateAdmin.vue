<script setup>
import { ref, reactive, computed } from 'vue';

// Menggunakan ref untuk state primitif
const passwordVisible = ref(false);

// Menggunakan reactive untuk state objek
const adminData = reactive({
  username: '',
  email: '',
  password: '',
  phoneNumber: '',
});

// Computed property untuk mengubah tipe input password secara dinamis
const passwordFieldType = computed(() => {
  return passwordVisible.value ? 'text' : 'password';
});

// Fungsi untuk toggle visibilitas password
const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value;
};

// Fungsi untuk handle submit form
const createAdmin = () => {
  // Di sini Anda akan menambahkan logika untuk mengirim data ke server
  console.log('Data Admin yang akan dibuat:', adminData);
  // Contoh: alert('Admin berhasil dibuat!');
};
</script>

<template>
  <div class="space-y-6">
    <!-- Header (Structure matches accountlists) -->
    <div class="flex flex-col gap-2">
      <h1 class="text-3xl font-semibold">Create Admin</h1>
    </div>

    <!-- Content Card (Container structure matches accountlists: rounded-3xl, border-gray-300) -->
    <div class="flex flex-col rounded-3xl border border-gray-300 bg-white">
      <div class="p-8">

        <!-- Form Content (From createadmin request) -->
        <form @submit.prevent="createAdmin">
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

            <!-- Email Input -->
            <div>
              <label for="email" class="block text-base font-semibold text-gray-800 mb-2">Email</label>
              <input
                v-model="adminData.email"
                type="email"
                id="email"
                placeholder="Email"
                class="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              >
            </div>

            <!-- Password Input -->
            <div>
              <label for="password" class="block text-base font-semibold text-gray-800 mb-2">Password</label>
              <div class="relative">
                <input
                  v-model="adminData.password"
                  :type="passwordFieldType"
                  id="password"
                  placeholder="Password"
                  class="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                >
                <button type="button" @click="togglePasswordVisibility" class="absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                  <svg v-if="!passwordVisible" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7 .946-3.111 3.523-5.515 6.7-6.525M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M3 3l4.35 4.35" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Phone Number Input -->
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
          </div>

          <!-- Action Buttons -->
          <div class="mt-8 flex items-center space-x-4">
            <button
              type="submit"
              class="bg-blue-900 text-white font-semibold px-8 py-3 rounded-full hover:bg-blue-800 transition duration-300"
            >
              Create
            </button>

            <!-- BUTTON CANCEL DIUBAH MENJADI ROUTER-LINK -->
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
/* Styling tambahan yang spesifik untuk komponen ini bisa ditambahkan di sini jika perlu */
</style>
