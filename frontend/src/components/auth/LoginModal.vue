<template>
  <transition name="modal-fade">
    <div
      v-if="show"
      class="fixed inset-0 flex items-center justify-center z-[9999] pointer-events-auto modal-blur-overlay"
      @click.self="closeModal"
    >
      <div
        class="bg-white rounded-2xl shadow-2xl w-[380px] max-w-[90vw] transition-all duration-300 p-8"
        style="animation: scaleIn 0.3s"
      >
        <div class="flex flex-col items-center mb-8">
          <div class="flex items-center gap-2">
            <img :src="LogoFootWear" alt="Logo" class="h-8 w-8" />
            <h1 class="text-xl font-bold text-gray-900">
              NEPTUNE<span class="text-blue-700">THRIFT</span>
            </h1>
          </div>

          <div class="flex w-full justify-center mt-6 bg-gray-100 rounded-full overflow-hidden">
            <button
              class="w-1/2 py-2 font-semibold rounded-full transition-all"
              :class="isSignIn ? 'bg-blue-900 text-white' : 'text-gray-600 hover:bg-gray-200'"
              @click="isSignIn = true"
            >
              Sign in
            </button>
            <button
              class="w-1/2 py-2 font-semibold rounded-full transition-all"
              :class="!isSignIn ? 'bg-blue-900 text-white' : 'text-gray-600 hover:bg-gray-200'"
              @click="isSignIn = false"
            >
              Sign up
            </button>
          </div>
        </div>

        <div>
          <h2 class="text-lg font-semibold text-gray-800 text-center mb-6">
            {{ isSignIn ? "Welcome back." : "Create your account." }}
          </h2>

          <button
            type="button"
            class="flex items-center justify-center w-full gap-3 border border-gray-300 rounded-full py-2 px-4 mb-4 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-100"
            @click="emit('google-login')"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              class="w-5 h-5"
            />
            <span class="text-gray-700 font-medium">
              Continue with Google
            </span>
          </button>

          <div class="flex items-center my-5">
            <div class="flex-grow h-px bg-gray-300"></div>
            <span class="px-3 text-gray-400 text-sm font-medium">OR</span>
            <div class="flex-grow h-px bg-gray-300"></div>
          </div>

          <form @submit.prevent="isSignIn ? handleLogin() : handleSignUp()">
            <div class="mb-4">
              <label for="email" class="block text-gray-700 text-sm font-semibold mb-2">
                Email address
              </label>
              <input
                type="email"
                id="email"
                v-model="form.email"
                class="w-full border border-gray-300 rounded-xl py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
                required
                placeholder="Email"
              />
            </div>

            <div class="mb-3">
              <label for="password" class="block text-gray-700 text-sm font-semibold mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                v-model="form.password"
                class="w-full border border-gray-300 rounded-xl py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
                required
                placeholder="**********"
              />
            </div>

            <div v-if="isSignIn" class="flex justify-end mb-4">
              <button 
                type="button" 
                @click="handleForgotPassword" 
                class="text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors"
              >
                Lupa Password?
              </button>
            </div>

            <div v-if="!isSignIn" class="mb-6">
              <label for="confirmPassword" class="block text-gray-700 text-sm font-semibold mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                v-model="confirmPassword"
                class="w-full border border-gray-300 rounded-xl py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
                required
                placeholder="Re-enter password"
              />
            </div>

            <button
              type="submit"
              :disabled="isLoading"
              class="w-full bg-blue-900 hover:bg-blue-800 text-white font-semibold py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="isLoading">Loading...</span>
              <span v-else>{{ isSignIn ? "Sign in" : "Sign up" }}</span>
            </button>

            <p class="text-xs text-gray-400 text-center mt-6">
              By proceeding you accept our
              <a href="#" class="text-blue-700 underline">terms of use</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  </transition>
</template>
<script setup>
import { ref, reactive } from "vue"; // Pastikan import reactive
import LogoFootWear from "@/asset/images/Footwear.png";
import axios from 'axios';
import Swal from 'sweetalert2';

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close", "login-success", "signup-success", "google-login"]);

const isForgotPasswordMode = ref(false); 
const forgotEmail = ref("");

// --- PERBAIKAN 3: Gunakan reactive 'form' untuk menyimpan email, password, confirmPassword ---
const handleForgotPassword = async () => {
  // 1. Cek apakah kolom email Login sudah diisi?
  if (!form.email) {
     Swal.fire({
        icon: 'warning',
        title: 'Email Kosong',
        text: 'Silakan isi alamat email Anda di kolom login terlebih dahulu.',
        confirmButtonColor: '#000'
     });
     return;
  }
  
  // 2. Konfirmasi Dulu (Biar user gak kepencet)
  const result = await Swal.fire({
     title: 'Reset Password?',
     text: `Kami akan mengirimkan link reset password ke: ${form.email}`,
     icon: 'question',
     showCancelButton: true,
     confirmButtonColor: '#1d4ed8',
     cancelButtonColor: '#d33',
     confirmButtonText: 'Ya, Kirim Link',
     cancelButtonText: 'Batal'
  });

  // Jika user klik Batal, berhenti
  if (!result.isConfirmed) return;

  isLoading.value = true;
  
  try {
     const API_URL = "http://localhost:3000/api/auth";
     
     // Kirim form.email (email yang ada di input login)
     await axios.post(`${API_URL}/forgot-password`, { email: form.email });
     
     Swal.fire({
        icon: 'success',
        title: 'Email Terkirim',
        text: 'Cek kotak masuk (atau spam) email Anda untuk link reset password.',
     });
     
  } catch (error) {
     Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: error.response?.data?.message || 'Email tidak ditemukan.',
     });
  } finally {
     isLoading.value = false;
  }
};
// --- PERBAIKAN 1: Buat Object 'form' (bukan ref terpisah) ---
const form = reactive({
  email: "",
  password: "",
});

// Variable tambahan untuk Signup
const confirmPassword = ref("");

// --- PERBAIKAN 2: Definisi isLoading ---
const isLoading = ref(false);

const isSignIn = ref(true); 
const API_URL = "http://localhost:3000/api/auth";

axios.defaults.withCredentials = true;

const closeModal = () => emit("close");

const handleLogin = async () => {
  // 1. Validasi Input Kosong
  if (!form.email || !form.password) {
     Swal.fire({
        icon: 'warning',
        title: 'Input Kosong',
        text: 'Mohon isi Email dan Password.',
        confirmButtonColor: '#000'
     });
     return;
  }

  isLoading.value = true;

  try {
    // 2. Kirim Request Login
    const response = await axios.post(`${API_URL}/login`, {
      email: form.email,
      password: form.password
    }, { withCredentials: true });

    // 3. AMBIL USERNAME
    const username = response.data.user?.username || 'User';

    // 4. TAMPILKAN SWEETALERT SUKSES
    Swal.fire({
      icon: 'success',
      title: `Selamat Datang, ${username}!`,
      text: 'Login berhasil. Selamat berbelanja!',
      showConfirmButton: false,
      timer: 2000
    });

    // 5. Proses Data Login
    emit('login-success'); 
    emit('close'); 
    
    // Reset form
    form.email = '';
    form.password = '';

  } catch (error) {
    console.error("Login Error:", error);

    // 6. TANGKAP PESAN ERROR
    const pesanError = error.response?.data?.message || "Terjadi kesalahan pada server.";

    // 7. TAMPILKAN SWEETALERT ERROR
    Swal.fire({
      icon: 'error',
      title: 'Gagal Masuk',
      text: pesanError,
      confirmButtonColor: '#d33'
    });

  } finally {
    isLoading.value = false;
  }
};
const handleSignUp = async () => {
  // 1. Cek Kesamaan Password
  if (password.value !== confirmPassword.value) {
    Swal.fire({
        icon: 'warning',
        title: 'Password Tidak Sama',
        text: 'Pastikan konfirmasi password sesuai!',
    });
    return;
  }
  
  // 2. Validasi Email & Password kosong
  if (!email.value || !password.value) {
     Swal.fire({
        icon: 'warning',
        title: 'Data Belum Lengkap',
        text: 'Email dan Password wajib diisi.',
    });
    return;
  }

  try {
    const API_URL = "http://localhost:3000/api/auth";

    // 3. Kirim HANYA Email & Password (Username diurus backend)
    const response = await axios.post(`${API_URL}/signup`, {
      email: email.value,
      password: password.value,
      // confirmPassword tidak perlu dikirim ke backend, cuma validasi frontend
    });

    console.log("Sign up success:", response.data);
    
    // Emit sukses (jika ada logic parent)
    emit("signup-success", response.data);
    
    // 4. Notifikasi Sukses
    Swal.fire({
        icon: 'success',
        title: 'Registrasi Berhasil!',
        text: 'Username default Anda telah dibuat. Silakan login.',
        showConfirmButton: false,
        timer: 2000
    });

    // Reset Form
    resetForm();
    
    // Switch ke tampilan Login
    isSignIn.value = true;

  } catch (error) {
    // 5. Handling Error yang Lebih Aman
    console.error("Sign up failed object:", error);
    
    // Ambil pesan error dari backend (biasanya .message bukan .error)
    const errorMsg = error.response?.data?.message || error.response?.data?.error || "Pendaftaran gagal.";
    
    Swal.fire({
        icon: 'error',
        title: 'Gagal Daftar',
        text: errorMsg
    });
  }
};

const handleGoogleLogin = () => {
  // Arahkan browser user langsung ke endpoint backend untuk Google Auth
  window.location.href = `${API_URL}/google`;
};

const resetForm = () => {
  email.value = "";
  password.value = "";
  confirmPassword.value = "";
};
</script>

<style>
.swal2-container {
    z-index: 99999 !important;
}
</style>

<style scoped>
@keyframes scaleIn {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-blur-overlay {
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  background: rgba(255, 255, 255, 0.25);
}
</style>