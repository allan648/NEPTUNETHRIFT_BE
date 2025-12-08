<script setup>
import { ref } from "vue";
// import Sidebar... <-- HAPUS INI
import DetailReview from "@/components/DetailReview.vue";
import DefaultAvatar from "@/asset/images/user_profile/default-avatar.png";

// HAPUS userProfile (Sudah diurus Layout)

// Data ulasan (Dummy Data)
const reviews = ref([
  {
    id: 1,
    rating: 5,
    text: "Websitenya ramah dan mudah untuk mencari sepatu thrift yang bagus disini, harganya juga ramah di kantong mahasiswa",
    user: {
      name: "Fiky_KNJT_066",
      avatar: DefaultAvatar,
    },
  },
  {
    id: 2,
    rating: 4,
    text: "Pilihan barangnya banyak dan proses checkout-nya cepat. Pengirimannya juga tidak terlalu lama, packing aman.",
    user: {
      name: "Fiky_KNJT_066",
      avatar: DefaultAvatar,
    },
  },
  {
    id: 3,
    rating: 5,
    text: "I'm blown away by the quality and style of the clothes I received from Shop.co. From casual wear to elegant dresses, every piece I've bought has exceeded my expectations.",
    user: {
      name: "Fiky_KNJT_066",
      avatar: DefaultAvatar,
    },
  },
  {
    id: 4,
    rating: 3,
    text: "Kualitasnya cukup baik untuk harga segitu, tapi sayang ukuran yang saya pesan sedikit kebesaran. Mungkin deskripsi ukuran bisa lebih detail lagi.",
    user: {
      name: "Fiky_KNJT_066",
      avatar: DefaultAvatar,
    },
  },
]);

// --- LOGIKA UNTUK MODAL ---
const isModalVisible = ref(false);
const selectedReview = ref(null);

const openReviewDetail = (review) => {
  selectedReview.value = review;
  isModalVisible.value = true;
};

const closeReviewDetail = () => {
  isModalVisible.value = false;
};
</script>

<template>
  <div class="w-full p-6 md:p-10">
    <div class="mx-auto max-w-7xl">
      <h1 class="text-3xl font-bold text-gray-800 mb-8">My Reviews</h1>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          v-for="review in reviews"
          :key="review.id"
          class="group border border-gray-200 rounded-2xl p-6 bg-white shadow-sm cursor-pointer transition-all duration-300 hover:shadow-md hover:border-blue-200 hover:-translate-y-1"
          @click="openReviewDetail(review)"
        >
          <div class="flex items-center mb-4">
            <svg
              v-for="star in 5"
              :key="star"
              class="h-5 w-5"
              :class="star <= review.rating ? 'text-yellow-400' : 'text-gray-200'"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.368-2.448a1 1 0 00-1.175 0l-3.368 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.25 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z"
              />
            </svg>
          </div>
          
          <p class="text-gray-600 leading-relaxed line-clamp-3">
            "{{ review.text }}"
          </p>

          <p class="mt-4 text-xs font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
            Click to see details &rarr;
          </p>
        </div>

        <div v-if="reviews.length === 0" class="col-span-full text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <p class="text-gray-500 text-lg">You have no reviews yet.</p>
        </div>
      </div>
    </div>

    <DetailReview 
      :show="isModalVisible" 
      :review="selectedReview" 
      @close="closeReviewDetail" 
    />
  </div>
</template>