<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import axios from 'axios'
import Chart from 'chart.js/auto'
import User from '@/components/icons/User.vue'
import Cart from '@/components/icons/Cart.vue'
import Product from '@/components/icons/Product.vue'
import Comment from '@/components/icons/Comment.vue'

const stats = ref({ users: 0, orders: 0, products: 0, comments: 0 })
const chartCanvas = ref<HTMLCanvasElement | null>(null)
let salesChart: any = null

const loadDashboard = async () => {
  try {
    // Ubah URL dari /dashboard-all menjadi /dashboard
    const res = await axios.get('http://localhost:3000/api/admin/dashboard')
    
    // Karena sekarang data digabung, pastikan cara mengambilnya benar
    const { stats: dataStats, salesGraph } = res.data

    stats.value = dataStats

    const labels = salesGraph.length > 0 ? salesGraph.map((i: any) => i.label) : ['No Data']
    const totals = salesGraph.length > 0 ? salesGraph.map((i: any) => i.total) : [0]

    await nextTick()
    renderChart(labels, totals)
  } catch (error) {
    console.error("Gagal load dashboard:", error)
  }
}

const renderChart = (labels: string[], totals: number[]) => {
  if (!chartCanvas.value) return
  if (salesChart) salesChart.destroy()

  salesChart = new Chart(chartCanvas.value, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Pendapatan Terkonfirmasi',
        data: totals,
        backgroundColor: '#295F98',
        borderRadius: 8,
        // --- UKURAN KONSISTEN ---
        maxBarThickness: 50, // Batang tidak akan pernah lebih lebar dari 50px
        barPercentage: 0.8,  // Mengatur kepadatan batang
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { 
          beginAtZero: true,
          ticks: { 
            callback: (v) => 'Rp ' + v.toLocaleString('id-ID') 
          }
        }
      },
      plugins: {
        legend: { display: false }
      }
    }
  })
}

onMounted(loadDashboard)
</script>

<template>
  <div class="space-y-6">
    <h1 class="text-3xl font-semibold">Dashboard Neptune Thrift</h1>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div v-for="(val, key) in stats" :key="key" class="p-6 border border-gray-300 rounded-3xl bg-white shadow-sm flex items-center gap-4">
        <div class="p-3 bg-blue-100 rounded-2xl text-blue-700">
            <User v-if="key === 'users'" class="size-8" />
            <Cart v-if="key === 'orders'" class="size-8" />
            <Product v-if="key === 'products'" class="size-8" />
            <Comment v-if="key === 'comments'" class="size-8" />
        </div>
        <div>
          <p class="text-xs text-gray-500 uppercase font-bold">{{ key }}</p>
          <h3 class="font-bold text-2xl">{{ val }}</h3>
        </div>
      </div>
    </div>

    <div class="p-6 border border-gray-300 rounded-3xl bg-white">
      <h2 class="font-bold text-xl mb-4">Grafik Penjualan (7 Hari Terakhir)</h2>
      <div class="h-[400px]">
        <canvas ref="chartCanvas"></canvas>
      </div>
    </div>
  </div>
</template>