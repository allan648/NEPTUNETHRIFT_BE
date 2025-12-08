<script setup>
import { ref, reactive, onMounted } from "vue";
import axios from "axios";

// Konfigurasi Axios
const API_URL = "http://localhost:3000/api";
axios.defaults.withCredentials = true;

// State untuk Form Profile
const profile = reactive({
  username: "",
  email: "",
  phone: "",
  address: "", // Tambahkan alamat
  image: null, // URL gambar
});

// State untuk Form Password
const passwords = reactive({
  current: "",
  new: "",
  confirm: "",
});

const isLoading = ref(false);

// 1. AMBIL DATA SAAT LOAD
const fetchUserProfile = async () => {
  try {
    const response = await axios.get(`${API_URL}/auth/status`);
    if (response.data.isAuthenticated) {
      profile.username = response.data.username || "";
      profile.email = response.data.email || "";
      profile.phone = response.data.phone || "";
      profile.address = response.data.address || "";
      profile.image = response.data.avatar || null;
    }
  } catch (error) {
    console.error("Gagal load profile:", error);
  }
};

// 2. SIMPAN PROFIL (Konek ke Backend)
const saveProfileSettings = async () => {
  isLoading.value = true;
  try {
    // Panggil API PUT yang sudah kita buat
    await axios.put(`${API_URL}/user/profile`, {
      username: profile.username,
      phone: profile.phone,
      address: profile.address,
    });

    alert("Profil berhasil diperbarui!");
    
    // Refresh halaman agar Sidebar ikut terupdate
    setTimeout(() => {
      window.location.reload();
    }, 500);

  } catch (error) {
    console.error("Gagal update:", error);
    alert("Gagal menyimpan perubahan.");
  } finally {
    isLoading.value = false;
  }
};

// 3. GANTI PASSWORD (Logika Frontend)
const changePassword = async () => {
  if (passwords.new !== passwords.confirm) {
    alert("Konfirmasi password baru tidak cocok!");
    return;
  }
  
  // TODO: Anda perlu membuat endpoint backend '/api/user/change-password' dulu
  alert("Fitur ganti password akan berfungsi setelah backend disiapkan.");
  
  // Contoh jika backend sudah siap:
  /*
  try {
    await axios.post(`${API_URL}/user/change-password`, {
        currentPassword: passwords.current,
        newPassword: passwords.new
    });
    alert("Password berhasil diubah!");
    passwords.current = "";
    passwords.new = "";
    passwords.confirm = "";
  } catch (error) {
    alert(error.response.data.error);
  }
  */
};

// 4. GANTI FOTO (Preview Only - Belum upload ke server)
// Untuk upload file butuh setup Multer di backend (bisa dikerjakan nanti)
const changePhoto = (event) => {
  const file = event.target.files[0];
  if (file) {
    profile.image = URL.createObjectURL(file);
    alert("Fitur upload foto ke server perlu setup backend tambahan (Multer). Saat ini hanya preview.");
  }
};

onMounted(() => {
  fetchUserProfile();
});
</script>

<template>
  <div class="w-full p-6 md:p-10">
    <div class="mx-auto max-w-4xl">
      <h1 class="text-3xl font-bold text-gray-800 mb-8">My Profile</h1>

      <section class="flex flex-col items-center mb-12">
        <img
          :src="profile.image || 'https://via.placeholder.com/150'"
          alt="User Profile"
          class="h-32 w-32 rounded-full object-cover mb-4 border-4 border-white shadow-lg"
          referrerpolicy="no-referrer"
        />
        <label class="cursor-pointer rounded-full bg-blue-50 border border-blue-200 px-6 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100">
          Change Photo
          <input type="file" accept="image/*" class="hidden" @change="changePhoto" />
        </label>
      </section>

      <section class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-10">
        <form @submit.prevent="saveProfileSettings">
          <h2 class="mb-6 text-xl font-bold text-gray-800 border-b pb-4">
            Personal Information
          </h2>
          
          <div class="grid grid-cols-1 gap-6">
            <div>
              <label class="block mb-2 text-sm font-medium text-gray-700">Email</label>
              <input
                v-model="profile.email"
                type="email"
                disabled
                class="block w-full rounded-lg border-gray-200 bg-gray-50 text-gray-500 px-4 py-3 cursor-not-allowed"
              />
            </div>

            <div>
              <label class="block mb-2 text-sm font-medium text-gray-700">Full Name</label>
              <input
                v-model="profile.username"
                type="text"
                class="block w-full rounded-lg border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label class="block mb-2 text-sm font-medium text-gray-700">Phone Number</label>
              <input
                v-model="profile.phone"
                type="tel"
                placeholder="08..."
                class="block w-full rounded-lg border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label class="block mb-2 text-sm font-medium text-gray-700">Shipping Address</label>
              <textarea
                v-model="profile.address"
                rows="3"
                placeholder="Alamat lengkap..."
                class="block w-full rounded-lg border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
              ></textarea>
            </div>
          </div>

          <div class="mt-8 flex justify-end">
            <button
              type="submit"
              :disabled="isLoading"
              class="rounded-full bg-blue-700 px-8 py-3 text-sm font-bold text-white transition hover:bg-blue-800 disabled:opacity-50"
            >
              {{ isLoading ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </form>
      </section>

      <section class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <form @submit.prevent="changePassword">
          <h2 class="text-xl font-bold text-gray-800 border-b pb-4 mb-6">
            Change Password
          </h2>
          
          <div class="space-y-6">
            <div>
              <label class="block mb-2 text-sm font-medium text-gray-700">Current Password</label>
              <input v-model="passwords.current" type="password" class="block w-full rounded-lg border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block mb-2 text-sm font-medium text-gray-700">New Password</label>
                <input v-model="passwords.new" type="password" class="block w-full rounded-lg border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label class="block mb-2 text-sm font-medium text-gray-700">Confirm Password</label>
                <input v-model="passwords.confirm" type="password" class="block w-full rounded-lg border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>
          </div>

          <div class="mt-8 flex justify-end">
            <button
              type="submit"
              class="rounded-full bg-gray-800 px-8 py-3 text-sm font-bold text-white transition hover:bg-black"
            >
              Update Password
            </button>
          </div>
        </form>
      </section>
    </div>
  </div>
</template>