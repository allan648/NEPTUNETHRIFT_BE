<script setup>
import { ref, reactive } from 'vue';
import Sidebar from '@/components/Sidebar.vue';
import DetailReview from '@/components/DetailReview.vue';
import DefaultAvatar from '@/asset/images/user_profile/default-avatar.png';

// Data reaktif untuk informasi pengguna yang akan dikirim ke Sidebar
const userProfile = reactive({
  username: 'FIKY KNJT',
  email: 'fkyknjt@gmail.com',
  image: DefaultAvatar,
});

// Data ulasan
const reviews = ref([
  {
    id: 1,
    rating: 5,
    text: "Websitenya ramah dan mudah untuk mencari sepatu thrift yanhg bagus disini, harganya juga ramah di kantong mahasiswa",
    user: {
      name: 'Fiky_KNJT_066',
      avatar: DefaultAvatar
    }
  },
  {
    id: 2,
    rating: 4,
    text: "Pilihan barangnya banyak dan proses checkout-nya cepat. Pengirimannya juga tidak terlalu lama, packing aman.",
    user: {
      name: 'Fiky_KNJT_066',
      avatar: DefaultAvatar
    }
  },
  {
    id: 3,
    rating: 5,
    text: "I'm blown away by the quality and style of the clothes I received from Shop.co. From casual wear to elegant dresses, every piece I've bought has exceeded my expectations.",
    user: {
      name: 'Fiky_KNJT_066',
      avatar: DefaultAvatar
    }
  },
  {
    id: 4,
    rating: 3,
    text: "Kualitasnya cukup baik untuk harga segitu, tapi sayang ukuran yang saya pesan sedikit kebesaran. Mungkin deskripsi ukuran bisa lebih detail lagi.",
    user: {
      name: 'Fiky_KNJT_066',
      avatar: DefaultAvatar
    }
  }
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
  <div class="flex">
    <Sidebar :user="userProfile" />

    <main class="w-full p-8 md:p-12">
      <div class="mx-auto max-w-7xl">
        <h1 class="text-3xl md:text-4xl font-bold text-gray-800 mb-8">My Review</h1>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div
            v-for="review in reviews"
            :key="review.id"
            class="border border-gray-200 rounded-xl p-6 shadow-sm cursor-pointer transition hover:shadow-lg hover:border-gray-300"
            @click="openReviewDetail(review)"
          >
            <div class="flex items-center">
              <svg
                v-for="star in 5"
                :key="star"
                class="h-5 w-5"
                :class="star <= review.rating ? 'text-yellow-400' : 'text-gray-300'"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.368-2.448a1 1 0 00-1.175 0l-3.368 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.25 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z"
                />
              </svg>
            </div>
            <p class="mt-4 text-gray-600 leading-relaxed">"{{ review.text }}"</p>
          </div>

          <div v-if="reviews.length === 0" class="col-span-full text-center py-10">
            <p class="text-gray-500">You have no reviews yet.</p>
          </div>
        </div>
      </div>
    </main>

    <!-- ======================= PERUBAHAN DI SINI ======================= -->
    <!-- Menghapus v-if dan menggantinya dengan prop :show -->
    <!-- Ini akan membuat animasi di dalam DetailReview bisa berjalan -->
    <DetailReview
      :show="isModalVisible"
      :review="selectedReview"
      @close="closeReviewDetail"
    />
    <!-- ================================================================ -->
  </div>
</template>
