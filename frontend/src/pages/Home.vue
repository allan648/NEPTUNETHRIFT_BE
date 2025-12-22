<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from 'vue-router';
import Swal from 'sweetalert2';
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

const route = useRoute();
const router = useRouter();

onMounted(() => {
  // Cek apakah ada pesan error di URL?
  if (route.query.error === 'inactive') {
    
    // TAMPILKAN ALERT
   Swal.fire({
      icon: 'error',                          // Ikon silang merah
      title: 'Akses Ditolak',                 // Judul Besar
      text: 'Akun Anda telah dinonaktifkan. Silakan hubungi Customer Service.', // Pesan
      confirmButtonText: 'Hubungi CS',        // Tombol Konfirmasi
      confirmButtonColor: '#d33',             // Warna tombol merah
      footer: '<a href="/help">Butuh bantuan?</a>' // Link kecil di bawah (opsional)
    }).then((result) => {
      // JIKA TOMBOL 'Hubungi CS' DIKLIK:
      if (result.isConfirmed) {
        // Arahkan ke halaman About, tepat di bagian ID #contact-cs
        router.push({ path: '/about', hash: '#contact-cs' });
      }
    });
    // Bersihkan URL agar bersih (hapus ?error=inactive)
    router.replace({ query: null });
  }
});

const newArrivals = ref([
  {
    id: 1,
    name: "Nike Air Force 1",
    price: 1200000,
    image: NikeAirForce1,
    rating: 4.5,
  },
  {
    id: 2,
    name: "Patta x Nike Air Max 1",
    price: 2400000,
    discount: 2600000,
    image: NikeAirMax1,
    rating: 5,
  },
  {
    id: 3,
    name: "Vans UA Sentry Old Skool",
    price: 1800000,
    image: Vans,
    rating: 4.5,
  },
  {
    id: 4,
    name: "Nike Airforce 1 Shadow",
    price: 1300000,
    discount: 1600000,
    image: NikeShadow,
    rating: 4.5,
  },
]);

const promoSelling = ref([
  { id: 1, name: "New Balance", price: 2120000, discount: 2320000, image: NewBalance, rating: 3.5 },
  { id: 2, name: "Vans Old Skool", price: 1450000, image: Vans, rating: 4 },
  { id: 3, name: "Nike Air Force 1", price: 800000, image: NikeAirForce1, rating: 4 },
  { id: 4, name: "Nike Air Max 1", price: 2100000, image: NikeAirMax1, rating: 4 },
]);

// --- LOGIKA CAROUSEL ---
const brands = ref(["NIKE", "VERSACE", "ZARA", "GUCCI", "PRADA", "Calvin Klein"]);

// Gandakan array brand untuk loop animasi yang mulus
const duplicatedBrands = computed(() => [
  ...brands.value,
  ...brands.value,
  ...brands.value, // Gandakan minimal 3x agar track cukup panjang
  ...brands.value,
]);
// --- AKHIR LOGIKA CAROUSEL ---

</script>

<template>
  <div class="w-full">
 <!-- HERO -->
  <section class="relative bg-black text-white" data-aos="fade-up">
    <img :src="GambarHome" alt="shoes" class="w-full h-[500px] object-cover opacity-70" />

    <!-- Konten utama (judul, paragraf, tombol) yang berada di tengah -->
    <div
      class="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-start px-10"
      data-aos="zoom-in"
      data-aos-delay="100"
    >
      <h1 class="text-6xl font-bold">FIND SHOES<br />THAT MATCHES<br />YOUR STYLE</h1>
      <p class="mt-4 max-w-md">
        Discover curated selections of thrift and limited edition shoes designed to bring out your
        unique style.
      </p>
      <a
        href="#"
        class="mt-6 bg-blue-800 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-600"
        data-aos="fade-right"
        data-aos-delay="200"
        >Shop Now</a
      >
    </div>

    <!-- PERBAIKAN: Div statistik dibuat absolute dan ditempatkan di bawah -->
    <div
      class="absolute bottom-8 left-0 right-0 flex justify-center items-center gap-8 text-md"
      data-aos="fade-up"
      data-aos-delay="300"
    >
      <span><strong>200+</strong> International Brands</span>
      <span><strong>2,000+</strong> High Quality Products</span>
      <span><strong>30,000+</strong> Happy Customers</span>
    </div>
  </section>

    <!-- BRAND STRIP (MODIFIED WITH PURE CSS ANIMATION LOOP) -->
    <section
      class="bg-blue-900 py-8 text-white font-semibold text-lg overflow-hidden brand-carousel-container"
      data-aos="fade-up"
    >
      <div class="flex scrolling-track">
        <!-- Render list brand yang sudah digandakan -->
        <div v-for="(brand, index) in duplicatedBrands" :key="index" class="px-16">
          <span>{{ brand }}</span>
        </div>
      </div>
    </section>

    <!-- NEW ARRIVALS -->
    <section class="py-18 px-8 sm:px-16 lg:px-[140px] pb-24 md:pb-30">
      <h2 class="text-center text-3xl font-extrabold mb-6" data-aos="fade-up" data-aos-delay="100">
        NEW <span class="text-blue-800">ARRIVALS</span>
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <div
          v-for="item in newArrivals"
          :key="item.id"
          class="bg-white shadow rounded-lg p-4"
          :data-aos="'fade-up'"
          data-aos-once="true"
        >
          <img :src="item.image" :alt="item.name" class="w-full h-48 object-cover rounded" />
          <h3 class="mt-4 font-semibold">{{ item.name }}</h3>
          <div class="flex items-center gap-2">
            <span class="text-lg font-bold">Rp.{{ item.price }}</span>
            <span v-if="item.discount" class="text-sm line-through text-gray-400"
              >Rp{{ item.discount }}</span
            >
          </div>
        </div>
      </div>
      <div class="flex justify-center mt-6">
  <RouterLink 
    to="/product" 
    class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-all duration-300"
  >
    View All
  </RouterLink>
</div>
    </section>

    <!-- PROMO SELLING -->
    <section class="py-18 px-8 sm:px-16 lg:px-[140px] pb-24 md:pb-30 bg-gray-50" data-aos="fade-up">
      <h2 class="text-center text-3xl font-extrabold mb-6">
        PROMO <span class="text-blue-800">SELLING</span>
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <div
          v-for="(item, idx) in promoSelling"
          :key="item.id"
          class="bg-white shadow rounded-lg p-4"
          :data-aos="'zoom-in'"
          :data-aos-delay="idx * 100"
        >
          <img :src="item.image" :alt="item.name" class="w-full h-48 object-cover rounded" />
          <h3 class="mt-4 font-semibold">{{ item.name }}</h3>
          <div class="flex items-center gap-2">
            <span class="text-lg font-bold">Rp.{{ item.price }}</span>
            <span v-if="item.discount" class="text-sm line-through text-gray-400"
              >Rp.{{ item.discount }}</span
            >
          </div>
        </div>
      </div>
      <div class="flex justify-center mt-6">
        <button class="px-6 py-2 border rounded-lg">View All</button>
      </div>
    </section>

    <!-- BROWSE STYLE -->
    <section class="py-12 px-6 sm:px-16 lg:px-[140px] pb-24 md:pb-30">
      <div class="max-w-6xl mx-auto bg-gray-100 shadow-lg rounded-2xl p-8">
        <h2 class="text-center text-3xl font-extrabold mb-10">
          BROWSE BY <span class="text-blue-800">SHOES STYLE</span>
        </h2>
        <!-- Grid untuk Style -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <!-- Card Casual -->
          <div
            class="relative h-64 w-[350px] rounded-xl overflow-hidden bg-cover bg-center"
            data-aos="fade-right"
          >
          <img :src="Casual" alt="">
            <div class="absolute inset-0"></div>
            <h3
              class="absolute top-5 left-5 text-2xl font-bold text-white"
              style="text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5)"
            >
              Casual
            </h3>
          </div>

          <!-- Card Formal -->
          <div
            class="relative -left-32 h-64 w-[610px] rounded-xl overflow-hidden bg-cover bg-center"
            data-aos="fade-left"
            data-aos-delay="100"
          >
          <img :src="Formal" alt="">
            <div class="absolute inset-0"></div>
            <h3
              class="absolute top-5 left-5 text-2xl font-bold text-white"
              style="text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5)"
            >
              Formal
            </h3>
          </div>

          <!-- Card Party -->
          <div
            class="relative h-64 w-[610px] rounded-xl overflow-hidden bg-cover bg-center"
            data-aos="zoom-in"
            data-aos-delay="200"
          >
          <img :src="Boots" alt="">
            <div class="absolute inset-0"></div>
            <h3
              class="absolute top-5 left-5 text-2xl font-bold text-white"
              style="text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5)"
            >
              Boots
            </h3>
          </div>

          <!-- Card Gym -->
          <div
            class="relative -right-32 h-64 w-[355px] rounded-xl overflow-hidden bg-cover bg-center"
            data-aos="fade-up"
            data-aos-delay="250"
          >
          <img :src="Sport" alt="">
            <div class="absolute inset-0"></div>
            <h3
              class="absolute top-5 left-5 text-2xl font-bold text-white"
              style="text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5)"
            >
              Sports
            </h3>
          </div>
        </div>
      </div>
    </section>

    <!-- HAPPY CUSTOMERS -->
    <section class="py-18 px-8 sm:px-16 lg:px-[140px] pb-24 md:pb-30 bg-gray-50" data-aos="fade-up">
      <div class="flex justify-between">
        <h2 class="text-3xl font-extrabold mb-6">
          OUR HAPPY <span class="text-blue-800">CUSTOMERS</span>
        </h2>
        <div>
          <a
            href="/detailreview"
            class="bg-blue-800 text-white px-4 py-3 rounded-lg shadow"
            data-aos="zoom-in"
            >More Review</a
          >
        </div>
      </div>
      <div class="grid md:grid-cols-3 gap-6">
        <div class="bg-white shadow rounded-lg p-8" data-aos="fade-right">
          <img :src="Rating" alt="rating" class="pb-2" />
          <p>"I'm blown away by the quality and style of the shoes I received!"</p>
          <span class="mt-2 block font-semibold">- Sarah M.</span>
        </div>
        <div class="bg-white shadow rounded-lg p-8" data-aos="fade-up" data-aos-delay="100">
          <img :src="Rating" alt="rating" class="pb-2" />
          <p>"The range of options is truly remarkable, catering to many styles."</p>
          <span class="mt-2 block font-semibold">- Alex K.</span>
        </div>
        <div class="bg-white shadow rounded-lg p-8" data-aos="fade-left" data-aos-delay="200">
          <img :src="Rating" alt="rating" class="pb-2" />
          <p>"The collection of shoes is not only diverse but always on point."</p>
          <span class="mt-2 block font-semibold">- James L.</span>
        </div>
      </div>
    </section>

    <!-- RATE WEBSITE -->
    <section class="py-18 px-8 sm:px-16 lg:px-[140px] pb-24 md:pb-30">
      <div class="flex flex-col md:flex-row gap-10 md:gap-8">
        <!-- Info -->
        <div class="flex flex-col flex-2">
          <h1 class="text-4xl sm:text-[42px] font-bold leading-tight sm:leading-[1.2]">
            Rate Our <span class="text-blue-800">Website</span>
          </h1>
          <p class="text-gray-600 text-sm sm:text-base mt-4">
            We’d love to hear your feedback! By giving us a rating, you help us improve and create a
            better experience for all visitors.
          </p>
        </div>

        <!-- Rating Form -->
        <div
          class="p-4 sm:p-6 rounded-3xl w-full flex-1 border border-gray-200"
          data-aos="fade-left"
        >
          <h4 class="font-semibold text-2xl sm:text-[32px]">Leave a Rating</h4>
          <p class="text-gray-600 text-sm sm:text-base mb-6">Feel free to send us your thoughts.</p>
          <form class="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Username"
              class="px-4 w-full py-3 text-sm border placeholder:text-gray-500 border-gray-200 rounded-full"
            />
            <input
              type="email"
              placeholder="Email"
              class="px-4 w-full py-3 text-sm border placeholder:text-gray-500 border-gray-200 rounded-full"
            />
            <textarea
              rows="5"
              placeholder="Message"
              class="px-4 py-3 text-sm placeholder:text-gray-500 border border-gray-200 rounded-3xl"
            ></textarea>
            <button type="submit" class="bg-blue-800 text-white px-6 py-3 font-medium rounded-full">
              Send
            </button>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Definisikan keyframes untuk animasi scroll */
@keyframes scroll {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-100%);
  }
}

.brand-carousel-container {
  overflow: hidden;
}

.scrolling-track {
  display: flex;
  white-space: nowrap;
  animation: scroll 20s linear infinite;
}

/* Terapkan animasi ke track */
.scrolling-track {
  /* Durasi animasi: Anda bisa ubah 20s menjadi lebih cepat (misal 15s) atau lebih lambat (misal 30s) */
  animation: scroll 20s linear infinite;
  /* 'linear' -> kecepatan konstan */
  /* 'infinite' -> mengulang selamanya tanpa henti dan tanpa 'reverse' */
}

/* Jeda animasi saat mouse hover di atas container */
.brand-carousel-container:hover .scrolling-track {
  animation-play-state: paused;
}
</style>
