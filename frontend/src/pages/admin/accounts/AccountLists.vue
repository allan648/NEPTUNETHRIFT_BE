<script setup>
import ArrowRight from '@/components/icons/ArrowRight.vue'
import Show from '@/components/icons/Show.vue'
import TrashCan from '@/components/icons/TrashCan.vue'
import Search from '@/components/icons/Search.vue'
import Edit from '@/components/icons/Edit.vue'
import Plus from '@/components/icons/Plus.vue'

const users = [
  { id: 1, username: 'john_doe', email: 'john@example.com', phone: '08123456789', role: 'admin' },
  { id: 2, username: 'jane_smith', email: 'jane@example.com', phone: '0822334455', role: 'user' },
  { id: 3, username: 'alex', email: 'alex@example.com', phone: null, role: 'admin' },
]
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between gap-3 flex-wrap">
      <h1 class="text-3xl font-semibold">Account</h1>
    </div>

    <!-- Content Card -->
    <div class="flex flex-col rounded-3xl border border-gray-300">
      <div class="flex flex-col p-4">
        <!-- Search + New User -->
        <div class="flex justify-between sm:items-center flex-col sm:flex-row gap-4">
          <div
            class="border border-gray-300 gap-2 px-2.5 order-2 sm:order-1 py-2 flex items-center w-full sm:w-1/2 rounded-full"
          >
            <Search class="size-6" />
            <input
              type="text"
              class="w-full text-xs md:text-sm focus:outline-none"
              placeholder="Search..."
            />
          </div>

          <!-- Tombol Create (Ke halaman CreateAdmin) -->
          <router-link
            :to="{ name: 'Createadmin' }"
            class="whitespace-nowrap flex px-4.5 order-1 sm:order-2 py-2.5 cursor-pointer w-fit hover:bg-blue-600 text-sm gap-2 items-center justify-center font-medium bg-blue-700 rounded-full text-white"
          >
            <Plus class="size-5" /> New User
          </router-link>

        </div>

        <!-- Table -->
        <div class="mt-4 overflow-hidden border border-gray-300 rounded-2xl">
          <div class="max-w-full overflow-x-auto">
            <table class="min-w-180 w-full">
              <thead class="bg-blue-700 text-xs text-white">
                <tr>
                  <th class="p-4 text-start font-semibold w-12">NO</th>
                  <th class="p-4 text-start font-semibold">USERNAME</th>
                  <th class="p-4 text-start font-semibold">EMAIL</th>
                  <th class="p-4 text-start font-semibold">PHONE</th>
                  <th class="p-4 text-start font-semibold">ROLE</th>
                  <th class="p-4 text-start font-semibold">ACTION</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(user, index) in users"
                  :key="user.id"
                  class="text-sm text-gray-700 border-b border-gray-300"
                >
                  <td class="p-4 text-gray-900">{{ index + 1 }}</td>
                  <td class="p-4 text-gray-900 font-semibold">{{ user.username }}</td>
                  <td class="p-4">{{ user.email }}</td>
                  <td class="p-4">{{ user.phone || '-' }}</td>
                  <td class="p-4">
                    {{ user.role ? (user.role.charAt(0).toUpperCase() + user.role.slice(1)) : '-' }}
                  </td>
                  <td class="p-4 flex gap-3">

                    <router-link
                      :to="{ name: 'Editadmin' }"
                      title="Edit"
                      class="flex items-center justify-center p-2 rounded-md bg-[#FACA15] hover:bg-yellow-500"
                    >
                      <Edit class="size-5 text-neu-900" />
                    </router-link>

                    <router-link
                    :to="{ name: 'Detailaccount' }"
                      title="Detail"
                      class="flex items-center justify-center p-2 rounded-md bg-[#295F98] hover:bg-blue-800"
                    >
                      <Show class="size-5 text-white" />
                    </router-link>
                    <button
                      title="Delete"
                      class="flex items-center justify-center p-2 rounded-md bg-[#E02424] hover:bg-red-700"
                    >
                      <TrashCan class="size-5 text-white" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Pagination (dummy design) -->
        <div class="flex justify-between items-center gap-3 flex-wrap mt-3">
          <div class="text-sm text-gray-600">
            Showing <span class="font-medium">1</span> to <span class="font-medium">3</span> of
            <span class="font-medium">3</span> Entries
          </div>
          <div class="flex items-center rounded-lg overflow-hidden">
            <button
              class="flex items-center gap-2 h-8 px-3 font-semibold bg-gray-300 hover:bg-gray-200 text-gray-900 disabled:cursor-not-allowed"
            >
              <ArrowRight class="size-4 scale-x-[-1]" />Prev
            </button>
            <button
              class="flex items-center gap-2 h-8 px-3 font-semibold bg-gray-300 hover:bg-gray-200 text-gray-900 disabled:cursor-not-allowed border-l border-gray-200"
            >
              Next<ArrowRight class="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}
</style>
