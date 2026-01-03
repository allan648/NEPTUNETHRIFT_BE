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
            @click="handleGoogleLogin"
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
                Reset Password?
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
import { ref, reactive } from "vue";
import LogoFootWear from "@/asset/images/Footwear.png";
import axios from 'axios';
import Swal from 'sweetalert2';

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close", "login-success", "signup-success"]);

// --- STATE ---
const form = reactive({
  email: "",
  password: "",
});
const confirmPassword = ref("");
const isLoading = ref(false);
const isSignIn = ref(true); 
const API_URL = "http://localhost:3000/api/auth";

axios.defaults.withCredentials = true;

const closeModal = () => emit("close");

// --- GOOGLE LOGIN ---
const handleGoogleLogin = () => {
  // Redirect Browser ke Backend Google Auth
  // Pastikan Backend Anda melayani route GET /api/auth/google
  window.location.href = `${API_URL}/google`;
};

// --- MANUAL LOGIN ---
const handleLogin = async () => {
  if (!form.email || !form.password) {
     Swal.fire({ icon: 'warning', title: 'Input Kosong', text: 'Mohon isi Email dan Password.' });
     return;
  }

  isLoading.value = true;

  try {
    const response = await axios.post(`${API_URL}/login`, {
      email: form.email,
      password: form.password
    });

    const username = response.data.user?.username || 'User';

    Swal.fire({
      icon: 'success',
      title: `Selamat Datang, ${username}!`,
      text: 'Login berhasil.',
      showConfirmButton: false,
      timer: 1500
    });

    emit('login-success'); 
    emit('close'); 
    resetForm();

  } catch (error) {
    console.error("Login Error:", error);
    const pesanError = error.response?.data?.message || "Email atau password salah.";
    Swal.fire({ icon: 'error', title: 'Gagal Masuk', text: pesanError });
  } finally {
    isLoading.value = false;
  }
};

// --- MANUAL SIGNUP ---
const handleSignUp = async () => {
  // PERBAIKAN: Gunakan form.password & confirmPassword.value
  if (form.password !== confirmPassword.value) {
    Swal.fire({ icon: 'warning', title: 'Password Tidak Sama', text: 'Konfirmasi password tidak cocok!' });
    return;
  }
  
  if (!form.email || !form.password) {
     Swal.fire({ icon: 'warning', title: 'Data Belum Lengkap', text: 'Email dan Password wajib diisi.' });
    return;
  }

  try {
    isLoading.value = true;
    // PERBAIKAN: Gunakan form.email & form.password
    const response = await axios.post(`${API_URL}/signup`, {
      email: form.email,
      password: form.password,
    });

    emit("signup-success", response.data);
    
    Swal.fire({
        icon: 'success',
        title: 'Registrasi Berhasil!',
        text: 'Silakan login dengan akun baru Anda.',
        showConfirmButton: false,
        timer: 2000
    });

    resetForm();
    isSignIn.value = true; // Pindah ke tab Login

  } catch (error) {
    console.error("Sign up failed:", error);
    const errorMsg = error.response?.data?.message || "Pendaftaran gagal.";
    Swal.fire({ icon: 'error', title: 'Gagal Daftar', text: errorMsg });
  } finally {
    isLoading.value = false;
  }
};

// --- FORGOT PASSWORD ---
const handleForgotPassword = async () => {
  if (!form.email) {
     Swal.fire({ icon: 'warning', title: 'Email Kosong', text: 'Isi email di kolom login dulu.' });
     return;
  }
  
  const result = await Swal.fire({
     title: 'Reset Password?',
     text: `Kirim link reset ke: ${form.email}?`,
     icon: 'question',
     showCancelButton: true,
     confirmButtonText: 'Ya, Kirim',
     cancelButtonText: 'Batal'
  });

  if (!result.isConfirmed) return;

  isLoading.value = true;
  try {
     await axios.post(`${API_URL}/forgot-password`, { email: form.email });
     Swal.fire({ icon: 'success', title: 'Email Terkirim', text: 'Cek inbox/spam email Anda.' });
  } catch (error) {
     Swal.fire({ icon: 'error', title: 'Gagal', text: error.response?.data?.message || 'Email tidak ditemukan.' });
  } finally {
     isLoading.value = false;
  }
};

const resetForm = () => {
  form.email = "";
  form.password = "";
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
  0% { transform: scale(0.8); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
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