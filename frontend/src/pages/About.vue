<script setup>
import { onMounted } from 'vue';        // <--- 1. Import onMounted
import { useRoute } from 'vue-router';  // <--- 2. Import useRoute

import GambarAbout from "@/asset/images/About1.jpg";
import Aboutben1 from "@/asset/images/icons/AffordableStyle.png";
import Aboutben2 from "@/asset/images/icons/CuratedThrift.png";
import Aboutben3 from "@/asset/images/icons/SustainableChoice.png";

const route = useRoute(); // <--- 3. Aktifkan Route

// --- LOGIKA SCROLL OTOMATIS ---
onMounted(() => {
  // Cek apakah URL membawa tanda pagar (#contact-cs)
  if (route.hash) {
    
    // Kita beri jeda 500ms (setengah detik) agar gambar & animasi AOS selesai loading dulu
    setTimeout(() => {
      const element = document.querySelector(route.hash);
      if (element) {
        // Scroll pelan-pelan ke elemen tersebut
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 500);
  }
});
</script>

<template>
  <main class="bg-white">
    <!-- ======================================= -->
    <!-- Hero Section -->
    <!-- ======================================= -->
    <section
      class="relative h-[500px] bg-gray-900 text-white flex items-center justify-center text-center"
      data-aos="fade-up"
    >
      <!-- Background Image -->
      <img
        :src="GambarAbout"
        alt="Sepatu thrift yang stylish"
        class="absolute inset-0 w-full h-full object-cover bg-black opacity-50"
      />
      <!-- Konten -->
      <div class="relative z-10 px-4" data-aos="zoom-in" data-aos-delay="100">
        <h1 class="text-4xl md:text-6xl font-bold mb-4" data-aos="fade-down" data-aos-delay="150">
          Step Into Style with <br />
          Thrifted Footwear.
        </h1>
        <p class="max-w-2xl mx-auto text-gray-200" data-aos="fade-up" data-aos-delay="250">
          Discover handpicked experiences, iconic landmarks, and hidden gems—each destination chosen
          to immerse you in the soul of Bali’s culture and beauty.
        </p>
      </div>
    </section>

    <!-- ======================================= -->
    <!-- About Section -->
    <!-- ======================================= -->
    <section class="py-16 sm:py-20 px-6 sm:px-16 lg:px-[140px] pb-24 md:pb-30" data-aos="fade-up">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-4" data-aos="fade-up" data-aos-delay="100">
          About <span class="text-blue-600">NeptuneThrift</span>
        </h2>
        <p
          class="max-w-3xl mx-auto text-gray-600 leading-relaxed"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          Bringing quality thrift shoes and limited-edition pre-orders, so everyone can stay stylish
          without overspending. What started as a hobby of hunting unique shoes turned into a
          vision: discovering great pairs worth wearing again. That’s how NeptuneThrift was built —
          a place where second-hand gems and limited editions meet fashion lovers seeking something
          different.
        </p>
      </div>
    </section>

    <!-- ======================================= -->
    <!-- Why Choose Us Section -->
    <!-- ======================================= -->
    <section
      class="py-16 sm:py-20 px-6 sm:px-16 lg:px-[140px] pb-24 md:pb-30 bg-gray-50"
      data-aos="fade-up"
    >
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-12" data-aos="fade-up" data-aos-delay="100">
          “Why Choose <span class="text-blue-600">NeptuneThrift?</span>”
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
          <!-- Feature 1: Curated Thrift Shoes -->
          <div class="flex flex-col items-center" data-aos="fade-right" data-aos-delay="150">
            <img :src="Aboutben1" alt="Curated Shoes" class="h-24 mb-4" />
            <h3 class="text-xl font-semibold mb-2">Curated Thrift Shoes</h3>
            <p class="text-gray-600">Handpicked quality pairs — unique style made easy.</p>
          </div>
          <!-- Feature 2: Affordable Style -->
          <div class="flex flex-col items-center" data-aos="fade-up" data-aos-delay="200">
            <img :src="Aboutben2" alt="Affordable Style" class="h-24 mb-4" />
            <h3 class="text-xl font-semibold mb-2">Affordable Style</h3>
            <p class="text-gray-600">Branded preloved shoes — stay stylish, spend less.</p>
          </div>
          <!-- Feature 3: Sustainable Choice -->
          <div class="flex flex-col items-center" data-aos="fade-left" data-aos-delay="250">
            <img :src="Aboutben3" alt="Sustainable Choice" class="h-24 mb-4" />
            <h3 class="text-xl font-semibold mb-2">Sustainable Choice</h3>
            <p class="text-gray-600">Reduce waste, support the planet.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- RATE WEBSITE -->
    <section class="py-18 px-8 sm:px-16 lg:px-[140px] pb-24 md:pb-30" data-aos="fade-up">
      <div class="flex flex-col md:flex-row gap-10 md:gap-8">
        <!-- Info -->
        <div class="flex flex-col flex-2" data-aos="fade-right" data-aos-delay="100">
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
          data-aos-delay="200"
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

    <!-- ======================================= -->
    <!-- Contact Us Section -->
    <!-- ======================================= -->
    <section
      id="contact-cs"
      class="py-16 sm:py-20 px-6 sm:px-16 lg:px-[140px] pb-24 md:pb-30 bg-gray-50"
      data-aos="fade-up"
    >
      <div class="container mx-auto px-4">
        <!-- Wrapper untuk konten agar rata kiri -->
        <div class="flex flex-col max-w-3xl" data-aos="fade-up" data-aos-delay="100">
          <!-- Judul, disesuaikan dengan gaya target -->
          <h2 class="text-4xl sm:text-[42px] font-semibold mb-4">
            Contact <span class="text-blue-600">Us</span>
          </h2>
          <!-- Paragraf, disesuaikan dengan gaya target -->
          <p class="text-gray-600 text-sm sm:text-base mb-6">
            Have a question, suggestion, or want to collaborate? Feel free to reach out to us
            through the contact below. Our team will respond promptly.
          </p>
          <!-- Daftar Kontak, disesuaikan dengan gaya target -->
          <ul class="flex flex-col gap-6">
            <li class="flex items-center gap-3 text-sm sm:text-base font-medium text-gray-700">
              <!-- Ikon Telepon (SVG) -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 text-black"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <span>+62 812-3456-7890</span>
            </li>

            <li class="flex items-center gap-3 text-sm sm:text-base font-medium text-gray-700">
              <!-- Ikon Email (SVG) -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 text-black"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span>neptunethrift@corp.id</span>
            </li>

            <li class="flex items-center gap-3 text-sm sm:text-base font-medium text-gray-700">
              <!-- Ikon Lokasi (SVG) -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 text-black"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span>Jln. Atlantis No.500, Denpasar, Bali 80232, Indonesia</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
/* Anda dapat menambahkan style scoped di sini jika diperlukan */
</style>
