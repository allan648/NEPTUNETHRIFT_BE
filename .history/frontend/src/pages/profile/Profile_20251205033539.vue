<script setup>
import { reactive } from 'vue'
import Sidebar from '@/components/Sidebar.vue' // Pastikan path ini sudah benar
import DefaultAvatar from '@/asset/images/user_profile/default-avatar.png' // Pastikan path ini sudah benar

// Data reaktif untuk informasi profil pengguna
const profile = reactive({
  username: 'FIKY KNJT',
  email: 'fkyknjt@gmail.com',
  phone: '081234567891',
  image: DefaultAvatar,
})

// Data reaktif untuk form ganti password
const passwords = reactive({
  current: '',
  new: '',
  confirm: '',
})

// --- FUNGSI-FUNGSI YANG HILANG ---
// Placeholder untuk fungsi ganti foto
const changePhoto = (event) => {
  const file = event.target.files[0]
  if (file) {
    profile.image = URL.createObjectURL(file)
    // Di sini Anda bisa menambahkan logika untuk mengunggah file ke server
    console.log('Foto profil dipilih:', file.name)
  }
}

// Placeholder untuk fungsi simpan profil
const saveProfileSettings = () => {
  // Di sini Anda akan menambahkan logika untuk mengirim data `profile` ke API
  console.log('Menyimpan data profil:', profile)
  alert('Pengaturan profil disimpan!')
}

// Placeholder untuk fungsi ganti password
const changePassword = () => {
  // Di sini Anda akan menambahkan logika validasi dan pengiriman data `passwords` ke API
  if (passwords.new !== passwords.confirm) {
    alert('Konfirmasi password baru tidak cocok!')
    return
  }
  console.log('Mengganti password...')
  alert('Password berhasil diubah!')
}
</script>

<template>
  <!--
    Struktur layout diperbaiki menggunakan flexbox untuk menempatkan sidebar
    di samping konten utama.
  -->
  <div class="flex">
    <!--
      Kirimkan data 'profile' dari komponen ini ke komponen Sidebar
      melalui prop 'user'.
    -->
    <Sidebar :user="profile" />

    <!-- Konten utama sekarang akan mengisi sisa ruang yang tersedia -->
    <main class="w-full p-8 md:p-12">
      <div class="mx-auto max-w-4xl">
        <h1 class="text-4xl font-bold text-gray-800 mb-8">Profile</h1>

        <!-- Foto Profil -->
        <section class="flex flex-col items-center mb-12">
          <img
            :src="profile.image"
            alt="User Profile"
            class="h-32 w-32 rounded-full object-cover mb-4 border-2 border-gray-200"
          />
          <label
            class="cursor-pointer rounded-full bg-blue-700 border border-gray-300 px-6 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            Change Photo
            <input type="file" accept="image/*,.png,.jpeg,.jpg" class="hidden" @change="changePhoto" />
          </label>
          <p class="mt-2 text-xs text-gray-500">
            Format: JPG, JPEG, PNG. Ukuran maks: 2MB.
          </p>
        </section>

        <!-- Form Profil -->
        <section class="mx-auto max-w-screen border p-6 rounded-md border-gray-300 shadow-sm sm:shadow-md">
          <form @submit.prevent="saveProfileSettings">
            <h2 class="mb-6 text-xl font-bold text-gray-800"><span class="text-blue-700">Profile</span> Settings</h2>
            <div class="space-y-6">
              <div>
                <label class="block mb-2 text-sm font-medium text-gray-700">Username</label>
                <input v-model="profile.username" type="text"
                  class="block w-full rounded-full border-gray-300 px-4 py-2.5 shadow-sm focus:border-emerald-500 focus:ring focus:ring-emerald-200 focus:outline-none" />
              </div>
              <div>
                <label class="block mb-2 text-sm font-medium text-gray-700">Email</label>
                <input v-model="profile.email" type="email"
                  class="block w-full rounded-full border-gray-300 px-4 py-2.5 shadow-sm focus:border-emerald-500 focus:ring focus:ring-emerald-200 focus:outline-none" />
              </div>
              <div>
                <label class="block mb-2 text-sm font-medium text-gray-700">Phone</label>
                <input v-model="profile.phone" type="tel"
                  class="block w-full rounded-full border-gray-300 px-4 py-2.5 shadow-sm focus:border-emerald-500 focus:ring focus:ring-emerald-200 focus:outline-none" />
              </div>
            </div>
            <div class="mt-6 flex justify-end">
              <button type="submit"
                class="rounded-full bg-blue-700 px-8 py-2 text-sm font-bold text-white transition hover:bg-blue-500">
                Save
              </button>
            </div>
          </form>
        </section>

        <hr class="border-gray-400 mx-auto my-12 max-w-screen" />

        <!-- Form Password -->
        <section class="mx-auto max-w-screen border p-6 rounded-md border-gray-300 shadow-sm sm:shadow-md">
          <form @submit.prevent="changePassword">
            <h2 class="text-xl font-bold text-gray-800"><span class="text-blue-700">Change</span> Password</h2>
            <p class="mt-1 mb-6 text-sm text-gray-500">
              Pastikan akun Anda menggunakan password yang panjang dan acak agar tetap aman.
            </p>
            <div class="space-y-6">
              <div>
                <label class="block mb-2 text-sm font-medium text-gray-700">Current Password</label>
                <input v-model="passwords.current" type="password"
                  class="block w-full rounded-full border-gray-300 px-4 py-2.5 shadow-sm focus:border-emerald-500 focus:ring focus:ring-emerald-200 focus:outline-none" />
              </div>
              <div>
                <label class="block mb-2 text-sm font-medium text-gray-700">New Password</label>
                <input v-model="passwords.new" type="password"
                  class="block w-full rounded-full border-gray-300 px-4 py-2.5 shadow-sm focus:border-emerald-500 focus:ring focus:ring-emerald-200 focus:outline-none" />
              </div>
              <div>
                <label class="block mb-2 text-sm font-medium text-gray-700">Confirm Password</label>
                <input v-model="passwords.confirm" type="password"
                  class="block w-full rounded-full border-gray-300 px-4 py-2.5 shadow-sm focus:border-emerald-500 focus:ring focus:ring-emerald-200 focus:outline-none" />
              </div>
            </div>
            <div class="mt-6 flex justify-end">
              <button type="submit"
                class="rounded-full bg-blue-700 px-6 py-2 text-sm font-bold text-white transition hover:bg-blue-500">
                Change Password
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  </div>
</template>
