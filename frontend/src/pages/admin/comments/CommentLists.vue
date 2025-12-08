<script setup>
import { ref } from 'vue'
import ArrowRight from '@/components/icons/ArrowRight.vue'
import Show from '@/components/icons/Show.vue'
import TrashCan from '@/components/icons/TrashCan.vue'
import Search from '@/components/icons/Search.vue'
// Pastikan path ini sesuai dengan lokasi file modal Anda
import CommentDetailModal from '@/pages/admin/comments/CommentDetail.vue'

// State untuk Modal
const showModal = ref(false)
const selectedComment = ref({})

// Dummy Data untuk Tabel
const testimonials = ref([
  {
    id: 1,
    destination: 'Gitgit Waterfall',
    traveler: 'Udin Surudin',
    rating: 5,
    // Data tambahan untuk modal (karena tidak ditampilkan di tabel)
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    comment: 'Pemandangannya sangat indah dan udaranya sejuk. Sangat recommended untuk healing!'
  },
  {
    id: 2,
    destination: 'Kuta Beach',
    traveler: 'Jane Doe',
    rating: 4,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    comment: 'Pantainya bersih, sunsetnya juara. Cuma agak ramai pas weekend.'
  },
  {
    id: 3,
    destination: 'Mount Batur',
    traveler: 'Agus Kotak',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    comment: 'Trackingnya lumayan capek tapi terbayar lunas pas sampai puncak. Guide-nya ramah.'
  }
])

// Fungsi Membuka Modal
const openDetail = (item) => {
  // Format data agar sesuai dengan props di CommentDetailModal
  selectedComment.value = {
    username: item.traveler,
    avatar: item.avatar,
    rating: item.rating,
    text: item.comment
  }
  showModal.value = true
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between gap-3 flex-wrap">
      <h1 class="text-3xl font-semibold">Testimonials</h1>
    </div>

    <!-- Card Container -->
    <div class="flex flex-col rounded-3xl border border-gray-300">
      <div class="flex flex-col p-4">
        <!-- Search -->
        <div class="flex justify-between sm:items-center flex-col sm:flex-row gap-4">
          <div
            class="border border-gray-300 gap-2 px-2.5 order-2 sm:order-1 py-2 flex items-center w-full sm:w-1/2 rounded-full"
          >
            <Search class="size-6" />
            <input
              type="text"
              class="w-full text-xs md:text-sm leading-5 placeholder:text-neu-500 focus:outline-none"
              placeholder="Search something..."
            />
          </div>
        </div>

        <!-- Table -->
        <div class="mt-4 overflow-hidden border border-gray-300 rounded-2xl">
          <div class="max-w-full overflow-x-auto">
            <table class="min-w-180 w-full">
              <thead class="bg-blue-700 text-xs text-white">
                <tr>
                  <th class="p-4 text-start font-semibold w-12">NO</th>
                  <th class="p-4 text-start font-semibold">DESTINATION NAME</th>
                  <th class="p-4 text-start font-semibold">TRAVELER NAME</th>
                  <th class="p-4 text-start font-semibold">RATING</th>
                  <th class="p-4 text-start font-semibold">ACTION</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item, index) in testimonials"
                  :key="item.id"
                  class="text-sm text-gray-900 border-b border-gray-300"
                >
                  <td class="p-4 text-gray-900">{{ index + 1 }}</td>
                  <td class="p-4 text-gray-900 font-semibold">{{ item.destination }}</td>
                  <td class="p-4">{{ item.traveler }}</td>
                  <td class="p-4">
                    <div class="flex gap-1 items-center">
                      <!-- Render Bintang Sesuai Rating -->
                      <svg
                        v-for="star in 5"
                        :key="star"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        class="size-5"
                        :class="star <= item.rating ? 'text-yellow-400' : 'text-gray-300'"
                      >
                        <path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clip-rule="evenodd" />
                      </svg>
                    </div>
                  </td>
                  <td class="p-4 flex gap-3">
                    <!-- Tombol Show -->
                    <button
                      @click="openDetail(item)"
                      type="button"
                      class="flex items-center justify-center p-2 rounded-[6px] cursor-pointer hover:bg-[#214B78] bg-[#295F98]"
                    >
                      <Show class="size-5 text-neu-50" />
                    </button>

                    <!-- Tombol Delete -->
                    <button
                      type="button"
                      class="flex items-center justify-center p-2 rounded-[6px] cursor-pointer hover:bg-[#B71A1A] bg-[#E02424]"
                    >
                      <TrashCan class="size-5 text-neu-50" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Pagination -->
        <div class="flex justify-between items-center gap-3 flex-wrap mt-3">
          <div class="text-sm text-gray-600">
            Showing <span class="font-medium text-neu-900">1</span> to
            <span class="font-medium text-neu-900">{{ testimonials.length }}</span> of
            <span class="font-medium text-neu-900">10</span> Entries
          </div>
          <div class="flex items-center rounded-[8px] overflow-hidden">
            <button class="flex bg-gray-300 hover:bg-gray-200 text-gray-900 gap-2 h-8 px-3 items-center font-semibold">
              <ArrowRight class="size-4 scale-x-[-1]" />Prev
            </button>
            <button class="flex bg-gray-300 hover:bg-gray-200 text-gray-900 gap-2 h-8 px-3 cursor-pointer items-center border-l border-gray-200 font-semibold">
              Next<ArrowRight class="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Component Modal -->
    <CommentDetailModal
      :show="showModal"
      :comment-data="selectedComment"
      @close="showModal = false"
    />

  </div>
</template>
