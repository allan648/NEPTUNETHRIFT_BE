<script setup lang="ts">
import User from '@/components/icons/User.vue'
import Cart from '@/components/icons/Cart.vue'
import Product from '@/components/icons/Product.vue'
import Comment from '@/components/icons/Comment.vue'
import ArrowRight from '@/components/icons/ArrowRight.vue'
import ArrowLeft from '@/components/icons/ArrowLeft.vue'
import Show from '@/components/icons/Show.vue'
import TrashCan from '@/components/icons/TrashCan.vue'
import Search from '@/components/icons/Search.vue'
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-between gap-3 flex-wrap">
      <h1 class="text-3xl font-se font-semibold">Dashboard</h1>
    </div>
    <div class="flex gap-3">
      <div class="flex p-8 w-full border border-gray-300 rounded-3xl">
        <div>
          <User class="right-32 size-8" />
        <div class="flex flex-row gap-2">
          <p class="max-w-35">Registered Travelers</p>
          <h3 class="font-semibold text-3xl">30</h3>
        </div>
        </div>
      </div>
      <div class="flex p-8 w-full border border-gray-300 rounded-3xl">
        <div>
          <Cart class="right-32 size-8" />
        <div class="flex flex-row gap-2">
          <p class="max-w-35">Transaction History’s</p>
          <h3 class="font-semibold text-3xl">30</h3>
        </div>
        </div>
      </div>
      <div class="flex p-8 w-full border border-gray-300 rounded-3xl">
        <div>
          <Product class="right-32 size-8" />
        <div class="flex flex-row gap-2">
          <p class="max-w-35">Quantity of Products</p>
          <h3 class="font-semibold text-3xl">30</h3>
        </div>
        </div>
      </div>
      <div class="flex p-8 w-full border border-gray-300 rounded-3xl">
        <div>
          <Comment class="right-32 size-8" />
        <div class="flex flex-row gap-2">
          <p class="max-w-35">The Comment Count</p>
          <h3 class="font-semibold text-3xl">30</h3>
        </div>
        </div>
      </div>
    </div>
    <div class="flex flex-col rounded-3xl border border-gray-300">
      <div class="flex p-4">
        <h2 class="font-semibold">Informations</h2>
      </div>
      <div class="w-full h-[1px] bg-gray-300"></div>
      <div class="flex flex-col p-4">
        <div class="border border-gray-300 gap-2 px-2.5 py-2 flex items-center w-1/2 rounded-full">
          <Search class="size-6" />
          <input
            type="text"
            class="w-full text-xs md:text-sm leading-5 placeholder:text-neu-500 focus:outline-none"
            placeholder="Search something..."
          />
        </div>

        <div class="mt-4 overflow-hidden border border-gray-300 rounded-2xl">
          <div class="max-w-full overflow-x-auto">
            <table class="min-w-180 w-full">
              <thead class="bg-blue-700 text-xs text-white">
                <tr>
                  <th class="p-4 text-start font-semibold w-12">NO</th>
                  <th class="p-4 text-start font-semibold">PRODUCT</th>
                  <th class="p-4 text-start font-semibold">CATEGORY</th>
                  <th colspan="2" class="p-4 text-start font-semibold">DESCRIPTION</th>
                  <th class="p-4 text-start font-semibold">ACTION</th>
                </tr>
              </thead>
              <tbody>
                <tr class="text-sm text-neu-700 border-b border-gray-300" v-for="i in 5" :key="i">
                  <td class="p-4 text-neu-900">1</td>
                  <td class="p-4 text-neu-900 font-semibold">Nike Air</td>
                  <td class="p-4">Sneakers</td>
                  <td colspan="2" class="p-4">Kondisi masih oke, baru di pakai 9 bulan </td>
                  <td class="p-4 flex gap-3">
                    <button
                      type="button"
                      class="flex items-center justify-center p-2 rounded-[6px] cursor-pointer hover:bg-[#214B78] bg-[#295F98]"
                    >
                      <Show class="size-5 text-neu-50" />
                    </button>
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

        <div class="flex justify-between gap-3 flex-wrap items-center mt-3">
          <div class="text-sm text-gray-600">
            Showing <span class="font-medium text-gray-900">1</span> to
            <span class="font-medium text-gray-900">1</span> of
            <span class="font-medium text-gray-900">10</span> Entries
          </div>
          <div class="flex items-center rounded-[8px] overflow-hidden">
            <div class="flex bg-gray-300 hover:bg-gray-200 text-gray-900 gap-2 h-8 px-3 items-center font-semibold">
              <ArrowLeft class="size-4" />Prev
            </div>
            <div class="flex bg-gray-300 hover:bg-gray-200 text-gray-900 gap-2 h-8 px-3 cursor-pointer items-center border-l border-gray-200 font-semibold">
              Next<ArrowRight class="size-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
