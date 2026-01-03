<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

// Assets
import GambarAbout from "@/asset/images/About1.jpg";
import Aboutben1 from "@/asset/images/icons/AffordableStyle.png";
import Aboutben2 from "@/asset/images/icons/CuratedThrift.png";
import Aboutben3 from "@/asset/images/icons/SustainableChoice.png";

const route = useRoute();
const API_URL = "http://localhost:3000/api";

// --- STATE ---
const reviews = ref([]);
const isLoading = ref(true);
const selectedReview = ref(null); // State untuk Modal Detail

// --- FUNCTIONS ---

// 1. Ambil Data Review dari Backend
const fetchReviews = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get(`${API_URL}/reviews`);
    // Tampilkan 6 review terbaru
    reviews.value = response.data.slice(0, 6); 
  } catch (error) {
    console.error("Gagal mengambil review:", error);
  } finally {
    isLoading.value = false;
  }
};

// 2. Kontrol Modal
const openDetail = (review) => {
  selectedReview.value = review;
  document.body.style.overflow = 'hidden'; // Kunci scroll layar saat modal buka
};

const closeDetail = () => {
  selectedReview.value = null;
  document.body.style.overflow = 'auto'; // Aktifkan kembali scroll
};

// 3. Format Tanggal
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

onMounted(() => {
  fetchReviews();
  
  if (route.hash) {
    setTimeout(() => {
      const element = document.querySelector(route.hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 500);
  }
});
</script>

<template>
  <main class="bg-white">
    <section class="relative h-[500px] bg-gray-900 text-white flex items-center justify-center text-center" data-aos="fade-up">
      <img :src="GambarAbout" class="absolute inset-0 w-full h-full object-cover bg-black opacity-50" />
      <div class="relative z-10 px-4" data-aos="zoom-in" data-aos-delay="100">
        <h1 class="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-4">
          Step Into Style with <br /> Thrifted Footwear.
        </h1>
        <p class="max-w-2xl mx-auto text-gray-200 italic">Discover handpicked quality, and hidden gems chosen to immerse you in the soul of fashion culture.</p>
      </div>
    </section>

    <section class="py-20 px-6 sm:px-16 lg:px-[140px]" data-aos="fade-up">
      <div class="container mx-auto text-center">
        <h2 class="text-4xl font-black uppercase italic mb-6">About <span class="text-blue-600">NeptuneThrift</span></h2>
        <p class="max-w-3xl mx-auto text-gray-500 leading-relaxed text-lg">
          Bringing quality thrift shoes and limited-edition pre-orders, so everyone can stay stylish without overspending. 
          A place where second-hand gems and limited editions meet fashion lovers seeking something different.
        </p>
      </div>
    </section>

    <section class="py-20 px-6 sm:px-16 lg:px-[140px] bg-gray-50" data-aos="fade-up">
      <div class="container mx-auto text-center">
        <h2 class="text-4xl font-black uppercase italic mb-12 italic">“Why Choose <span class="text-blue-600">Us?</span>”</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div class="flex flex-col items-center" data-aos="fade-right">
            <img :src="Aboutben1" class="h-24 mb-6" />
            <h3 class="text-xl font-black uppercase italic mb-2">Curated Shoes</h3>
            <p class="text-gray-500 text-sm">Handpicked quality pairs — unique style made easy.</p>
          </div>
          <div class="flex flex-col items-center" data-aos="fade-up">
            <img :src="Aboutben2" class="h-24 mb-6" />
            <h3 class="text-xl font-black uppercase italic mb-2">Affordable Style</h3>
            <p class="text-gray-500 text-sm">Branded preloved shoes — stay stylish, spend less.</p>
          </div>
          <div class="flex flex-col items-center" data-aos="fade-left">
            <img :src="Aboutben3" class="h-24 mb-6" />
            <h3 class="text-xl font-black uppercase italic mb-2">Sustainable</h3>
            <p class="text-gray-500 text-sm">Reduce waste, support the planet.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="py-24 px-6 sm:px-16 lg:px-[140px]" data-aos="fade-up">
      <div class="container mx-auto">
        <div class="flex justify-between items-end mb-12">
          <div class="text-left">
            <h2 class="text-4xl font-black uppercase italic tracking-tighter">Community <span class="text-blue-600">Voice</span></h2>
            <p class="text-gray-400 mt-2 uppercase text-[10px] font-bold tracking-widest">Real feedback from our happy customers</p>
          </div>
        </div>

        <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="i in 3" :key="i" class="h-64 bg-gray-100 animate-pulse rounded-[40px]"></div>
        </div>

        <div v-else-if="reviews.length === 0" class="text-center py-20 border-2 border-dashed border-gray-100 rounded-[40px]">
          <p class="text-gray-400 font-bold uppercase tracking-widest">No reviews yet. Be the first to rate us on Home page!</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div 
            v-for="rev in reviews" 
            :key="rev.id" 
            class="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group"
          >
            <div class="flex items-center gap-3 mb-6">
              <div class="size-10 rounded-2xl bg-blue-100 flex items-center justify-center font-black text-blue-700 text-xs uppercase">
                {{ rev.username ? rev.username.substring(0,2) : 'U' }}
              </div>
              <div>
                <h4 class="font-black uppercase text-sm tracking-tighter text-gray-900">{{ rev.username || 'User' }}</h4>
                <div class="flex text-yellow-400 text-[10px]">
                  <span v-for="s in rev.rating" :key="s">⭐</span>
                </div>
              </div>
            </div>

            <p class="text-gray-600 italic text-sm leading-relaxed mb-6 line-clamp-3">
              "{{ rev.comment }}"
            </p>

            <button 
              @click="openDetail(rev)" 
              class="text-[10px] font-black uppercase tracking-widest text-blue-600 group-hover:text-black transition-colors"
            >
              View Full Detail →
            </button>
          </div>
        </div>
      </div>
    </section>

    <div v-if="selectedReview" class="fixed inset-0 z-[999] flex items-center justify-center p-6">
      <div @click="closeDetail" class="absolute inset-0 bg-black/60 backdrop-blur-md"></div>
      
      <div class="relative bg-white w-full max-w-xl rounded-[50px] p-10 md:p-14 shadow-2xl overflow-hidden" data-aos="zoom-in" data-aos-duration="300">
        <button @click="closeDetail" class="absolute top-8 right-8 text-gray-400 hover:text-black transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div class="flex flex-col gap-6">
          <div class="flex items-center gap-5">
            <div class="size-16 rounded-[24px] bg-blue-800 flex items-center justify-center font-black text-white text-xl uppercase">
              {{ selectedReview.username.substring(0,2) }}
            </div>
            <div>
              <h3 class="text-3xl font-black uppercase italic tracking-tighter leading-none">{{ selectedReview.username }}</h3>
              <div class="flex gap-1 mt-2">
                <span v-for="s in selectedReview.rating" :key="s" class="text-xl">⭐</span>
              </div>
            </div>
          </div>

          <div class="border-t border-gray-100 pt-6">
            <p class="text-gray-700 text-xl leading-relaxed italic">
              "{{ selectedReview.comment }}"
            </p>
          </div>

          <div class="mt-4 flex justify-between items-center">
            <span class="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">
              Verified Experience
            </span>
            <span class="text-[10px] font-black uppercase tracking-widest text-gray-400 bg-gray-50 px-4 py-2 rounded-full">
              {{ formatDate(selectedReview.createdAt) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <section id="contact-cs" class="py-20 px-6 sm:px-16 lg:px-[140px] bg-gray-50" data-aos="fade-up">
      <div class="container mx-auto px-4 max-w-3xl ml-0">
        <h2 class="text-4xl font-black uppercase italic mb-6">Contact <span class="text-blue-600">Us</span></h2>
        <p class="text-gray-500 mb-10 text-lg">Have a question? Feel free to reach out to our team.</p>
        <ul class="space-y-6">
          <li class="flex items-center gap-4 font-bold text-gray-800">
            <div class="p-3 bg-white rounded-2xl shadow-sm italic text-blue-600">📞</div>
            <span>+62 812-3456-7890</span>
          </li>
          <li class="flex items-center gap-4 font-bold text-gray-800">
            <div class="p-3 bg-white rounded-2xl shadow-sm italic text-blue-600">✉️</div>
            <span>neptunethrift@corp.id</span>
          </li>
          <li class="flex items-center gap-4 font-bold text-gray-800">
            <div class="p-3 bg-white rounded-2xl shadow-sm italic text-blue-600">📍</div>
            <span>Jln. Atlantis No.500, Denpasar, Bali</span>
          </li>
        </ul>
      </div>
    </section>
  </main>
</template>

<style scoped>
/* Tambahkan untuk memotong teks otomatis */
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;  
  overflow: hidden;
}
</style>