<script>
// Pastikan path ke gambar ini sudah benar sesuai struktur proyek Anda
import Star1 from "@/asset/images/Rating1.png";
import Star2 from "@/asset/images/Rating2.png";
import Star3 from "@/asset/images/Rating3.png";
import Star4 from "@/asset/images/Rating4.png";
import Star5 from "@/asset/images/Rating.png";

export default {
  name: "ReviewPage",
  data() {
    return {
      dateFilters: [
        { name: "Recently" },
        { name: "1 Week Ago" },
        { name: "1 Month Ago" },
        { name: "1 Year Ago" },
        { name: "All Times" },
      ],
      ratingsByOrder: [
        { id: "lowest", label: "Lowest Ratings to Highest Ratings" },
        { id: "highest", label: "Highest Ratings to Lowest Ratings" },
      ],
      starsValue: [
        // Menambahkan id unik untuk setiap rating bintang
        { id: "rating-1", image: Star1, alt: "1 Star Rating" },
        { id: "rating-2", image: Star2, alt: "2 Star Rating" },
        { id: "rating-3", image: Star3, alt: "3 Star Rating" },
        { id: "rating-4", image: Star4, alt: "4 Star Rating" },
        { id: "rating-5", image: Star5, alt: "5 Star Rating" },
      ],
      reviews: [
        {
          name: "Sarah M.",
          text: "I'm blown away by the quality and style of the clothes I received from Shop.co. From casual wear to elegant dresses, every piece I've bought has exceeded my expectations.",
        },
        {
          name: "Alex K.",
          text: "Finding clothes that align with my personal style used to be a challenge until I discovered Shop.co. The range of options they offer is truly remarkable, catering to a variety of tastes and occasions.",
        },
        {
          name: "James L.",
          text: "As someone who's always on the lookout for unique fashion pieces, I'm thrilled to have stumbled upon Shop.co. The selection of clothes is not only diverse but also on-point with the latest trends.",
        },
        {
          name: "James L.",
          text: "As someone who's always on the lookout for unique fashion pieces, I'm thrilled to have stumbled upon Shop.co. The selection of clothes is not only diverse but also on-point with the latest trends.",
        },
        {
          name: "James L.",
          text: "As someone who's always on the lookout for unique fashion pieces, I'm thrilled to have stumbled upon Shop.co. The selection of clothes is not only diverse but also on-point with the latest trends.",
        },
        {
          id: 6,
          name: "James L.",
          text: "As someone who's always on the lookout for unique fashion pieces, I'm thrilled to have stumbled upon Shop.co. The selection of clothes is not only diverse but also on-point with the latest trends.",
        },
      ],
    };
  },
};
</script>

<template>
  <div class="bg-white">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans">
      <!-- Breadcrumb Navigation -->
      <nav class="text-sm text-gray-500 mb-8" aria-label="Breadcrumb">
        <ol class="list-none p-0 inline-flex">
          <li class="flex items-center">
            <a href="#" class="hover:underline">Home</a>
          </li>
          <li class="flex items-center mx-2">
            <svg class="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clip-rule="evenodd"
              />
            </svg>
          </li>
          <li class="flex items-center">
            <span class="text-gray-700">Review</span>
          </li>
        </ol>
      </nav>

      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Filters Section (Left) -->
        <aside class="w-full lg:w-1/4">
          <div class="border border-gray-200 rounded-2xl p-6">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-xl font-bold">Filters</h2>
              <button>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 4h18M3 8h18M3 12h18M3 16h18M3 20h18"
                  />
                </svg>
              </button>
            </div>
            <hr class="mb-6" />

            <!-- Ratings based on time Filter -->
            <div class="mb-6">
              <h3 class="font-bold mb-4 text-gray-800">Ratings based on time</h3>
              <ul class="space-y-3">
                <!-- PERBAIKAN: Struktur list item diubah untuk menampilkan checkbox asli -->
                <li
                  v-for="dateFilter in dateFilters"
                  :key="dateFilter.name"
                  class="flex items-center"
                >
                  <!-- Checkbox asli kini terlihat dan ditata ulang -->
                  <input
                    :id="dateFilter.name"
                    type="checkbox"
                    class="h-5 w-5 cursor-pointer mr-3 rounded border-gray-300 text-black focus:ring-black"
                  />

                  <!-- Label sekarang hanya berisi teks dan terhubung ke checkbox -->
                  <label :for="dateFilter.name" class="cursor-pointer text-gray-700 select-none">
                    {{ dateFilter.name }}
                  </label>
                </li>
              </ul>
            </div>
            <hr class="mb-6" />

            <!-- Ratings By Order Filter -->
            <div class="mb-6">
              <h3 class="font-bold mb-4 text-gray-800">Ratings by Order</h3>
              <ul class="space-y-3">
                <!-- PERBAIKAN: Struktur list item diubah untuk menampilkan radio button asli -->
                <li
                  v-for="ratingOption in ratingsByOrder"
                  :key="ratingOption.id"
                  class="flex items-center"
                >
                  <!-- Radio button asli kini terlihat dan ditata ulang -->
                  <input
                    :id="ratingOption.id"
                    type="radio"
                    name="ratingOrder"
                    class="h-5 w-5 cursor-pointer mr-3 text-black"
                  />

                  <!-- Label sekarang hanya berisi teks dan terhubung ke radio button -->
                  <label :for="ratingOption.id" class="cursor-pointer text-gray-700 select-none">
                    {{ ratingOption.label }}
                  </label>
                </li>
              </ul>
            </div>
            <hr class="mb-6" />

            <!-- Ratings By Stars Filter -->
            <div class="mb-6">
              <h3 class="font-bold mb-4 text-gray-800">Ratings by Stars</h3>
              <ul class="space-y-3">
                <!-- PERBAIKAN: Struktur list item diubah untuk menampilkan checkbox asli -->
                <li v-for="star in starsValue" :key="star.id" class="flex items-center">
                  <!-- Checkbox asli kini terlihat dan ditata ulang -->
                  <input
                    :id="star.id"
                    type="checkbox"
                    class="h-5 w-5 cursor-pointer mr-3 rounded border-gray-300 text-black focus:ring-black"
                  />

                  <!-- Label sekarang hanya berisi gambar bintang dan terhubung ke checkbox -->
                  <label :for="star.id" class="cursor-pointer">
                    <img :src="star.image" :alt="star.alt" class="h-5" />
                  </label>
                </li>
              </ul>
            </div>

            <button
              class="w-full bg-blue-700 text-white py-3 rounded-full font-semibold hover:bg-blue-500 transition-colors"
            >
              Apply Filter
            </button>
          </div>
        </aside>

        <!-- Reviews Section (Right) -->
        <main class="w-full lg:w-3/4">
          <h1 class="text-3xl font-bold mb-6">All Review</h1>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              v-for="(review, index) in reviews"
              :key="index"
              class="border border-gray-200 rounded-2xl p-6"
            >
              <div class="flex items-center">
                <svg
                  v-for="i in 5"
                  :key="i"
                  class="w-5 h-5 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  />
                </svg>
              </div>
              <div class="flex items-center gap-2 mt-4">
                <h4 class="font-bold text-lg">{{ review.name }}</h4>
                <span class="bg-green-100 rounded-full flex items-center justify-center p-0.5">
                  <svg class="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </span>
              </div>
              <p class="text-gray-600 mt-2">"{{ review.text }}"</p>
            </div>
          </div>

          <!-- Pagination -->
          <div class="flex justify-center items-center mt-8 space-x-2">
            <button
              class="p-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button class="w-10 h-10 bg-blue-700 text-white font-bold rounded-lg">1</button>
            <button
              class="p-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </main>
      </div>

      <!-- Rate Our Website & Comment Section -->
      <section class="mt-20 text-center">
        <h2 class="text-4xl font-bold"><span class="text-blue-700">Rate</span> Our Website</h2>
        <p class="mt-3 text-gray-500 max-w-2xl mx-auto">
          We'd love to hear your feedback! By giving us a rating, you help us improve and create a
          better experience for all visitors.
        </p>

        <div class="mt-10 max-w-3xl mx-auto">
          <div class="border border-gray-200 rounded-2xl p-8 text-left">
            <h3 class="text-2xl font-bold mb-6 text-center">Comment</h3>
            <form @submit.prevent>
              <div class="space-y-5">
                <input
                  type="text"
                  placeholder="Username"
                  class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
                <input
                  type="email"
                  placeholder="Email"
                  class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
                <textarea
                  placeholder="Message"
                  rows="5"
                  class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                ></textarea>
              </div>
              <button
                type="submit"
                class="w-full bg-blue-900 text-white py-3 mt-6 rounded-full font-semibold hover:bg-blue-800 transition-colors"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
/* Menambahkan gaya khusus jika diperlukan, tetapi sebagian besar menggunakan kelas Tailwind */
.font-sans {
  font-family: "Satoshi", sans-serif; /* Ganti dengan font yang sesuai jika Anda menggunakannya */
}
</style>
