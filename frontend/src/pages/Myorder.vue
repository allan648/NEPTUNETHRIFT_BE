<script>
export default {
  name: 'MyOrder',
  data() {
    return {
      selectedStatus: ['Semua'],
      orders: [
        {
          date: '25 November 2025',
          status: 'Berlangsung',
          code: '3674',
          name: 'Skinny Fit Jeans',
          size: 'Large',
          color: 'Blue',
          price: 2400000,
          originalPrice: null,
          discount: null,
          image: '../src/asset/images/Vans.png'
        },
        {
          date: '18 November 2025',
          status: 'Berhasil',
          code: '3673',
          name: 'Skinny Fit Jeans',
          size: 'Large',
          color: 'Blue',
          price: 1300000,
          originalPrice: 1600000,
          discount: '-30%',
          image: '../src/asset/images/NikeAirMax1.png'
        }
      ]
    };
  },
  methods: {
    getStatusClass(status) {
      if (status === 'Berlangsung') {
        return 'bg-yellow-100 text-yellow-800';
      }
      if (status === 'Berhasil') {
        return 'bg-green-100 text-green-800';
      }
      return 'bg-gray-100 text-gray-800';
    }
  }
};
</script>

<template>
  <div class="bg-gray-50 min-h-screen font-sans">
    <main class="container mx-auto px-4 lg:px-20 py-10">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">

        <!-- Kolom Filter -->
        <aside class="col-span-1">
          <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-xl font-semibold text-gray-800">Filters</h2>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h18M3 8h18M3 12h18M3 16h18M3 20h18" />
              </svg>
            </div>

            <div>
              <h3 class="text-lg font-medium text-gray-700 mb-4">Status</h3>
              <div class="space-y-3">
                <div class="flex items-center">
                  <input id="semua" v-model="selectedStatus" value="Semua" type="checkbox" class="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500">
                  <label for="semua" class="ml-3 text-gray-600">Semua</label>
                </div>
                <div class="flex items-center">
                  <input id="berlangsung" v-model="selectedStatus" value="Berlangsung" type="checkbox" class="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500">
                  <label for="berlangsung" class="ml-3 text-gray-600">Berlangsung</label>
                </div>
                <div class="flex items-center">
                  <input id="berhasil" v-model="selectedStatus" value="Berhasil" type="checkbox" class="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500">
                  <label for="berhasil" class="ml-3 text-gray-600">Berhasil</label>
                </div>
                <div class="flex items-center">
                  <input id="tidak-berhasil" v-model="selectedStatus" value="Tidak Berhasil" type="checkbox" class="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500">
                  <label for="tidak-berhasil" class="ml-3 text-gray-600">Tidak Berhasil</label>
                </div>
              </div>
            </div>

            <div class="mt-8">
              <button class="w-full bg-blue-800 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition duration-300">Apply Filter</button>
            </div>
          </div>
        </aside>

        <!-- Kolom Daftar Pesanan -->
        <section class="col-span-1 lg:col-span-3">
          <div class="flex justify-between items-center mb-6">
            <h1 class="text-3xl font-bold text-gray-900">My Order</h1>
            <div class="relative w-full max-w-sm">
              <input type="text" placeholder="Find Your Transaction here" class="w-full pl-10 pr-24 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500">
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <button class="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-900 text-white px-4 py-1 rounded-full font-semibold text-sm hover:bg-blue-800">Search</button>
            </div>
          </div>

          <div class="space-y-6">
            <!-- Komponen Order Item -->
            <div v-for="order in orders" :key="order.code" class="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
              <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                <div class="flex items-center text-sm text-gray-500 space-x-4">
                   <p>Date: <span class="font-medium text-gray-800">{{ order.date }}</span></p>
                   <div>
                     Status:
                     <span :class="getStatusClass(order.status)" class="text-xs font-semibold px-2.5 py-1 rounded-full">
                       {{ order.status }}
                     </span>
                   </div>
                   <p>Code Item: <span class="font-medium text-gray-800">{{ order.code }}</span></p>
                </div>
              </div>

              <div class="border-t border-gray-100 pt-4">
                <div class="flex flex-col sm:flex-row items-center">
                  <div class="flex items-center flex-grow">
                    <img :src="order.image" alt="Product Image" class="w-25 h-25 object-cover rounded-md mr-4">
                    <div>
                      <h4 class="font-semibold text-lg text-gray-800">{{ order.name }}</h4>
                      <p class="text-sm text-gray-500">Size: {{ order.size }}</p>
                      <p class="text-sm text-gray-500">Color: {{ order.color }}</p>
                    </div>
                  </div>
                  <div class="flex flex-col items-end mt-4 sm:mt-0">
                     <div class="flex items-center space-x-2">
                        <p v-if="order.originalPrice" class="text-lg text-gray-400 line-through">Rp.{{ order.originalPrice }}</p>
                        <p class="text-2xl font-bold text-gray-900">Rp.{{ order.price }}</p>
                        <span v-if="order.discount" class="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-md">{{ order.discount }}</span>
                     </div>
                      <a href="#" class="mt-4 text-blue-600 font-semibold hover:underline">Transaction Details</a>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </main>
  </div>
</template>

<style scoped>
/* Anda bisa menambahkan styling kustom di sini jika diperlukan */
</style>
