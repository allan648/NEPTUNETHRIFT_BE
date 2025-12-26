<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'
import { marked } from 'marked'

// --- CONFIG ---
const API_URL = "http://localhost:3000/api"
axios.defaults.withCredentials = true;

// --- STATE ---
const orders = ref([])
const isLoading = ref(true)

// AI State
const aiResultRaw = ref('')
const isAnalyzing = ref(false)
const topProducts = ref([])

// RIWAYAT STATE (BARU)
const reportHistory = ref([]) 
const expandedReportId = ref(null) // Untuk kontrol accordion (buka/tutup)

// --- HELPER ---
const formatRp = (price) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price)

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', { 
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', 
        hour: '2-digit', minute: '2-digit' 
    }).format(date);
}

const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/80';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:3000${imagePath}`;
}

const aiResultHtml = computed(() => aiResultRaw.value ? marked.parse(aiResultRaw.value) : '')

// --- FETCH DATA (UPDATE) ---
const fetchData = async () => {
  isLoading.value = true
  try {
    // 1. Ambil Orders
    const resOrders = await axios.get(`${API_URL}/admin/orders`)
    orders.value = resOrders.data.orders

    // 2. Ambil Riwayat Laporan (BARU)
    fetchHistory()

  } catch (error) {
    console.error("Error", error)
  } finally {
    isLoading.value = false
  }
}

// Fungsi Fetch History Terpisah
const fetchHistory = async () => {
    try {
        const resHistory = await axios.get(`${API_URL}/admin/report/history`)
        reportHistory.value = resHistory.data
    } catch (e) { console.error("Gagal load history") }
}

// --- LOGIKA AI (UPDATE) ---
const analyzeSales = async () => {
    isAnalyzing.value = true
    aiResultRaw.value = ''
    topProducts.value = []
    try {
        const response = await axios.get(`${API_URL}/admin/report/analyze`)
        const fullText = response.data.analysis
        topProducts.value = response.data.topProductsData || []
        
        let i = 0
        const typeWriter = setInterval(() => {
            aiResultRaw.value += fullText.charAt(i)
            i++
            if (i > fullText.length) clearInterval(typeWriter)
        }, 5)

        // Refresh riwayat setelah generate baru
        fetchHistory() 

    } catch (error) {
        Swal.fire('Gagal', 'AI Error', 'error')
    } finally {
        isAnalyzing.value = false
    }
}

// Helper Render Markdown untuk History
const renderMarkdown = (text) => marked.parse(text)

// Toggle Accordion
const toggleHistory = (id) => {
    if (expandedReportId.value === id) {
        expandedReportId.value = null // Tutup jika diklik lagi
    } else {
        expandedReportId.value = id // Buka yang diklik
    }
}

const paidOrders = computed(() => {
    return orders.value.filter(o => o.status !== 'pending')
})

// Menghitung total pendapatan dari semua order yang sudah diproses (Bukan pending)
const totalRevenue = computed(() => {
    return paidOrders.value.reduce((sum, o) => sum + Number(o.total_price), 0)
})

onMounted(() => { fetchData() })
</script>

<template>
  <div class="space-y-8 pb-20"> <div class="flex justify-between gap-3 flex-wrap">
      <h1 class="text-3xl font-semibold text-gray-800">Laporan Penjualan</h1>
    </div>

    <div class="flex flex-col rounded-3xl border border-gray-300 bg-white shadow-sm overflow-hidden">
        
        <div class="p-6 bg-gradient-to-b from-indigo-50 to-white border-b border-gray-200">
            <div class="flex justify-between items-center mb-6">
                <div>
                    <h2 class="font-bold text-xl text-indigo-900 flex items-center gap-2">
                        <span class="text-2xl">🤖</span> AI Business Intelligence
                    </h2>
                    <p class="text-sm text-indigo-600 mt-1">Analisis performa & rekomendasi strategis real-time.</p>
                </div>
                <button 
                    @click="analyzeSales"
                    :disabled="isAnalyzing"
                    class="px-6 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-full hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-md flex items-center gap-2"
                >
                    <span v-if="isAnalyzing" class="animate-spin">⏳</span>
                    {{ isAnalyzing ? 'Menganalisa...' : '✨ Generate Baru' }}
                </button>
            </div>
            
            <div v-if="aiResultRaw || (topProducts && topProducts.length > 0)" class="flex flex-col lg:flex-row gap-8 animate-fade-in">
                <div class="flex-1 order-2 lg:order-1">
                    <div v-html="aiResultHtml" class="prose prose-indigo max-w-none text-gray-700 bg-white p-5 rounded-2xl border border-indigo-100 shadow-sm"></div>
                </div>
                 <div v-if="topProducts && topProducts.length > 0" class="lg:w-1/3 order-1 lg:order-2">
                    <h3 class="font-bold text-indigo-900 mb-3">🏆 Produk Terlaris</h3>
                    <div class="space-y-3">
                        <div v-for="(prod, idx) in topProducts" :key="idx" class="flex items-center gap-4 p-3 bg-white rounded-xl border border-gray-200 shadow-sm">
                            <div class="relative flex-shrink-0">
                                <img :src="getImageUrl(prod.image)" class="w-16 h-16 object-cover rounded-lg border border-gray-100">
                                <div class="absolute -top-2 -left-2 w-6 h-6 bg-yellow-400 text-white font-bold text-xs rounded-full flex items-center justify-center border-2 border-white">#{{ idx + 1 }}</div>
                            </div>
                            <div>
                                <h4 class="font-bold text-gray-800 text-sm line-clamp-1">{{ prod.name }}</h4>
                                <p class="text-indigo-600 text-xs font-medium mt-1">Sold: {{ prod.sold }} pcs</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else-if="!isAnalyzing" class="text-center py-10 text-gray-400 italic bg-indigo-50/50 rounded-2xl border border-dashed border-indigo-200">
                Klik "Generate Baru" untuk analisis saat ini.
            </div>
        </div>

        <div class="p-6">
            <h3 class="font-bold text-lg text-gray-800 mb-4">Rincian Pesanan Masuk (Paid)</h3>
            <div class="overflow-hidden border border-gray-300 rounded-2xl">
                <div class="max-w-full overflow-x-auto">
                    <table class="min-w-180 w-full">
                        <thead class="bg-indigo-900 text-xs text-white">
                            <tr>
                                <th class="p-4 text-start">NO</th>
                                <th class="p-4 text-start">ORDER INFO</th>
                                <th class="p-4 text-start">STATUS</th>
                                <th class="p-4 text-end">TOTAL</th>
                            </tr>
                        </thead>
                        <tbody v-if="!isLoading">
                            <tr v-for="(order, index) in paidOrders" :key="order.id" class="border-b border-gray-200 hover:bg-gray-50 text-sm">
                                <td class="p-4">{{ index + 1 }}</td>
                                <td class="p-4">
                                    <div class="font-bold">#{{ order.id }}</div>
                                    <div class="text-xs text-gray-500 uppercase">{{ order.recipient_name }}</div>
                                </td>
                                <td class="p-4"><span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold uppercase">{{ order.status }}</span></td>
                                <td class="p-4 text-end font-mono">{{ formatRp(order.total_price) }}</td>
                            </tr>
                        </tbody>
                        <tfoot v-if="paidOrders.length > 0" class="bg-gray-100 border-t-2 border-gray-300">
                             <tr>
                                <td colspan="3" class="p-4 text-right font-bold text-gray-600 uppercase text-sm">Total Pendapatan:</td>
                                <td class="p-4 text-end font-bold text-xl text-indigo-900">{{ formatRp(totalRevenue) }}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <div class="flex flex-col gap-4">
        <h2 class="text-2xl font-bold text-gray-800">📂 Arsip Riwayat Analisis</h2>
        
        <div v-if="reportHistory.length === 0" class="text-gray-500 italic">Belum ada riwayat tersimpan.</div>

        <div v-else class="grid gap-4">
            <div v-for="report in reportHistory" :key="report.id" class="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                
                <button 
                    @click="toggleHistory(report.id)"
                    class="w-full flex justify-between items-center p-5 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                >
                    <div class="flex items-center gap-3">
                        <div class="bg-indigo-100 text-indigo-700 p-2 rounded-lg">
                            📅
                        </div>
                        <div>
                            <h4 class="font-bold text-gray-800 text-sm md:text-base">Laporan Analisis Bisnis</h4>
                            <p class="text-xs text-gray-500">{{ formatDate(report.created_at) }}</p>
                        </div>
                    </div>
                    <div :class="expandedReportId === report.id ? 'rotate-180' : ''" class="transition-transform duration-300 text-gray-400">
                        ▼
                    </div>
                </button>

                <div v-if="expandedReportId === report.id" class="p-6 border-t border-gray-200 animate-fade-in">
                    <div v-html="renderMarkdown(report.analysis_text)" class="prose prose-sm max-w-none text-gray-600"></div>
                </div>

            </div>
        </div>
    </div>

  </div>
</template>

<style scoped>
.animate-fade-in { animation: fadeIn 0.3s ease-in; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
:deep(.prose h3) { color: #312e81; font-weight: 700; margin-top: 1em; }
:deep(.prose ul) { list-style-type: disc; padding-left: 1.5em; }
:deep(.prose strong) { color: #111827; }
</style>