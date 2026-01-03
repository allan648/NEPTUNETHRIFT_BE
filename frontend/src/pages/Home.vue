<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import axios from 'axios';

// 1. IMPORT AUTH STORE (Sesuai yang digunakan di navbar.vue)
import { useAuthStore } from '@/stores/authStore';

// --- ASSETS ---
import GambarHome from "@/asset/images/GambarHome.png";
import NikeAirForce1 from "@/asset/images/NikeAirForce1.png";
import NikeAirMax1 from "@/asset/images/NikeAirMax1.png";
import Vans from "@/asset/images/Vans.png";
import NikeShadow from "@/asset/images/NikeShadow.png";
import NewBalance from "@/asset/images/NewBalance.png";
import Rating from "@/asset/images/Rating.png";
import Sport from "@/asset/images/Sport.png";
import Casual from "@/asset/images/Casual.png";
import Formal from "@/asset/images/Formal.png";
import Boots from "@/asset/images/Boots.png";

// --- CONFIG ---
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore(); // 2. INISIALISASI STORE
const API_URL = "http://localhost:3000/api";
axios.defaults.withCredentials = true;

// --- STATE ---
const rating = ref(0); 
const hoverRating = ref(0); 
const feedbackMessage = ref("");

// Mock Data
const newArrivals = ref([
  { id: 1, name: "Nike Air Force 1", price: 1200000, image: NikeAirForce1 },
  { id: 2, name: "Patta x Nike Air Max 1", price: 2400000, discount: 2600000, image: NikeAirMax1 },
  { id: 3, name: "Vans UA Sentry Old Skool", price: 1800000, image: Vans },
  { id: 4, name: "Nike Airforce 1 Shadow", price: 1300000, discount: 1600000, image: NikeShadow },
]);

const promoSelling = ref([
  { id: 1, name: "New Balance", price: 2120000, discount: 2320000, image: NewBalance },
  { id: 2, name: "Vans Old Skool", price: 1450000, image: Vans },
  { id: 3, name: "Nike Air Force 1", price: 800000, image: NikeAirForce1 },
  { id: 4, name: "Nike Air Max 1", price: 2100000, image: NikeAirMax1 },
]);

const brands = ref(["NIKE", "VERSACE", "ZARA", "GUCCI", "PRADA", "Calvin Klein"]);

// --- COMPUTED ---
const duplicatedBrands = computed(() => [
  ...brands.value, ...brands.value, ...brands.value, ...brands.value,
]);

// --- FUNCTIONS ---
const submitFeedback = async () => {
  if (rating.value === 0) {
    Swal.fire('Pilih Bintang', 'Silakan tentukan rating bintang Anda.', 'warning');
    return;
  }
  if (!feedbackMessage.value.trim()) {
    Swal.fire('Pesan Kosong', 'Berikan sedikit ulasan Anda.', 'warning');
    return;
  }

  try {
    const response = await axios.post(`${API_URL}/reviews`, {
      rating: rating.value,
      comment: feedbackMessage.value
    });

    Swal.fire({
      icon: 'success',
      title: 'Terima Kasih!',
      text: response.data.message,
      showConfirmButton: false,
      timer: 2000
    });

    rating.value = 0;
    feedbackMessage.value = "";
  } catch (error) {
    if (error.response && error.response.status === 401) {
      Swal.fire('Belum Login', 'Anda harus login untuk mengirim feedback.', 'info');
    } else {
      Swal.fire('Error', 'Gagal mengirim review.', 'error');
    }
  }
};

// --- HOOKS ---
onMounted(() => {
  const errorType = route.query.error;

  if (errorType) {
    // 1. Jika Akun DINONAKTIFKAN
    if (errorType === 'login_failed') {
      Swal.fire({
        icon: 'error',
        title: 'Akses Ditolak',
        text: 'Akun Anda telah dinonaktifkan. Silakan hubungi Customer Service.',
        confirmButtonText: 'Hubungi CS',
        confirmButtonColor: '#d33',
        allowOutsideClick: false
      }).then((result) => {
        if (result.isConfirmed) {
          router.push({ path: '/about', hash: '#contact-cs' });
        }
      });
    } 
    
    // 2. Jika LOGIN GAGAL (Memicu Modal Login)
    // else if (errorType === 'login_failed') {
    //   Swal.fire({
    //     icon: 'warning',
    //     title: 'Gagal Login',
    //     text: 'Email atau password yang Anda masukkan salah. Silakan coba lagi.',
    //     confirmButtonText: 'Coba Lagi',
    //     confirmButtonColor: '#1e40af',
    //   }).then((result) => {
    //     if (result.isConfirmed) {
    //       // MODIFIKASI: Membuka modal login melalui authStore
    //       authStore.openLoginModal(); 
    //     }
    //   });
    // }

    // Bersihkan URL dari parameter error
    router.replace({ query: {} });
  }
});
</script>

<template>
  <div class="w-full">
    <section class="relative bg-black text-white overflow-hidden">
      <img :src="GambarHome" class="w-full h-[500px] object-cover opacity-60 scale-105" />
      <div class="absolute inset-0 flex flex-col justify-center px-10 md:px-32">
        <h1 class="text-6xl font-black italic tracking-tighter leading-none uppercase" data-aos="fade-right">
          Find Shoes<br />That Matches<br />Your Style
        </h1>
        <p class="mt-4 max-w-md text-gray-300 italic" data-aos="fade-right" data-aos-delay="100">
          Discover curated selections of thrift and limited edition shoes designed for your unique style.
        </p>
        <router-link to="/product" class="mt-8 w-fit bg-blue-800 text-white px-10 py-4 rounded-full font-black uppercase text-xs tracking-[0.2em] hover:bg-white hover:text-black transition-all shadow-xl">
          Shop Now
        </router-link>
      </div>
    </section>

    <section class="bg-blue-900 py-10 text-white font-black text-xl overflow-hidden border-y border-blue-800">
      <div class="flex scrolling-track">
        <div v-for="(brand, index) in duplicatedBrands" :key="index" class="px-16 uppercase italic tracking-widest">
          {{ brand }}
        </div>
      </div>
    </section>

    <section class="py-20 px-8 sm:px-16 lg:px-[140px]">
      <h2 class="text-center text-4xl font-black italic mb-12 uppercase tracking-tighter">New <span class="text-blue-800">Arrivals</span></h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        <div v-for="item in newArrivals" :key="item.id" class="group">
          <div class="bg-gray-100 rounded-[32px] overflow-hidden mb-4 aspect-square relative">
             <img :src="item.image" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
          </div>
          <h3 class="font-bold text-gray-900 uppercase truncate px-2">{{ item.name }}</h3>
          <p class="font-black text-blue-900 px-2 mt-1">Rp{{ item.price.toLocaleString() }}</p>
        </div>
      </div>
    </section>

    <section class="py-20 px-8 sm:px-16 lg:px-[140px] bg-gray-50 rounded-[60px]">
      <h2 class="text-center text-4xl font-black italic mb-12 uppercase tracking-tighter">Promo <span class="text-blue-800">Selling</span></h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        <div v-for="item in promoSelling" :key="item.id" class="group">
          <div class="bg-white rounded-[32px] overflow-hidden mb-4 aspect-square relative shadow-sm border border-gray-100">
             <img :src="item.image" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
          </div>
          <h3 class="font-bold text-gray-900 uppercase truncate px-2">{{ item.name }}</h3>
          <div class="flex items-center gap-3 px-2 mt-1">
            <span class="font-black text-red-600">Rp{{ item.price.toLocaleString() }}</span>
            <span v-if="item.discount" class="text-xs line-through text-gray-300 font-bold">Rp{{ item.discount.toLocaleString() }}</span>
          </div>
        </div>
      </div>
    </section>

    <section class="py-20 px-8 sm:px-16 lg:px-[140px]">
      <div class="bg-gray-900 rounded-[50px] p-12 overflow-hidden relative">
        <h2 class="text-center text-4xl font-black italic mb-12 uppercase tracking-tighter text-white">Browse By <span class="text-blue-500">Style</span></h2>
        <div class="grid grid-cols-1 md:grid-cols-12 gap-6 relative z-10">
          <div class="md:col-span-4 h-72 rounded-[32px] overflow-hidden relative group">
            <img :src="Casual" class="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-all duration-700" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <h3 class="absolute top-8 left-8 text-3xl font-black text-white uppercase italic">Casual</h3>
          </div>
          <div class="md:col-span-8 h-72 rounded-[32px] overflow-hidden relative group">
            <img :src="Formal" class="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-all duration-700" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <h3 class="absolute top-8 left-8 text-3xl font-black text-white uppercase italic">Formal</h3>
          </div>
          <div class="md:col-span-8 h-72 rounded-[32px] overflow-hidden relative group">
            <img :src="Boots" class="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-all duration-700" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <h3 class="absolute top-8 left-8 text-3xl font-black text-white uppercase italic">Boots</h3>
          </div>
          <div class="md:col-span-4 h-72 rounded-[32px] overflow-hidden relative group">
            <img :src="Sport" class="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-all duration-700" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <h3 class="absolute top-8 left-8 text-3xl font-black text-white uppercase italic">Sports</h3>
          </div>
        </div>
      </div>
    </section>

    <section class="py-24 px-8 sm:px-16 lg:px-[140px] pb-40">
      <div class="flex flex-col md:flex-row gap-16 items-center">
        <div class="flex-1">
          <h1 class="text-6xl font-black italic uppercase tracking-tighter leading-none mb-6">Rate Our <br> <span class="text-blue-800">Experience</span></h1>
          <p class="text-gray-500 text-lg italic max-w-sm">"Your feedback helps us to maintain the quality of curated thrift fashion."</p>
        </div>

        <div class="flex-1 w-full bg-white p-12 rounded-[50px] border border-gray-100 shadow-2xl shadow-blue-100/50">
          <h4 class="font-black uppercase text-xl mb-2 tracking-tighter">Leave a Rating</h4>
          <p class="text-gray-400 text-[10px] uppercase font-bold tracking-[0.2em] mb-8">Authentication via logged in account</p>
          
          <div class="flex flex-col gap-8">
            <div class="flex flex-col gap-2">
              <span class="text-[10px] font-black text-gray-300 uppercase tracking-widest">Select Stars</span>
              <div class="flex gap-3">
                <button v-for="star in 5" :key="star" @click="rating = star" @mouseover="hoverRating = star" @mouseleave="hoverRating = 0" class="transition-all transform hover:scale-125 active:scale-90">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-12 h-12 transition-colors duration-200" :class="(hoverRating || rating) >= star ? 'text-yellow-400' : 'text-gray-100'">
                    <path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>

            <textarea v-model="feedbackMessage" rows="4" placeholder="Describe your shopping experience..." class="w-full px-8 py-5 bg-gray-50 border-none rounded-[32px] focus:ring-2 focus:ring-blue-800 text-sm italic shadow-inner"></textarea>

            <button @click="submitFeedback" class="bg-blue-800 text-white py-5 rounded-full font-black uppercase text-xs tracking-[0.3em] shadow-lg shadow-blue-200 hover:bg-black transition-all active:scale-95">
              Submit Review
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
@keyframes scroll { from { transform: translateX(0); } to { transform: translateX(-100%); } }
.scrolling-track { display: flex; white-space: nowrap; animation: scroll 25s linear infinite; }
.scrolling-track:hover { animation-play-state: paused; }
</style>