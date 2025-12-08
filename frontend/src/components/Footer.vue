<script setup>
// Pastikan path ke logo sudah benar
import logofootwear from "@/asset/images/Footwear.png";

</script>

<template>
  <footer class="bg-slate-100 text-gray-800 py-16 md:py-20 px-6 sm:px-16 lg:px-[100px]">
    <div class="mx-auto w-full max-w-screen-xl">
      <!-- Bagian Atas: Logo, Tagline, dan Menu -->
      <div class="flex justify-between flex-wrap items-start gap-10">

        <!-- Sisi Kiri: Informasi Brand -->
        <div class="max-w-full lg:max-w-md mb-10">
          <a href="#" class="flex items-center gap-3">
            <img :src="logofootwear" class="h-10 w-auto" alt="NeptuneThrift Logo" />
            <span class="text-2xl font-extrabold tracking-tight">
              <span class="text-blue-700">NEPTUNE</span>THRIFT
            </span>
          </a>
          <p class="text-gray-700 text-base mt-4">
            Your sneaker story starts here — discover, style, and save with NeptuneThrift.
          </p>
          <!-- Area Ikon Media Sosial -->
          <div class="mt-6 flex gap-5 text-gray-600">
            <a href="#" aria-label="Instagram" class="hover:text-blue-700 transition-colors">
              <!-- Ganti dengan komponen ikon Anda -->
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"> (path ikon Instagram) </svg>
            </a>
            <a href="#" aria-label="X/Twitter" class="hover:text-blue-700 transition-colors">
              <!-- Ganti dengan komponen ikon Anda -->
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"> (path ikon X) </svg>
            </a>
            <a href="#" aria-label="Facebook" class="hover:text-blue-700 transition-colors">
              <!-- Ganti dengan komponen ikon Anda -->
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"> (path ikon Facebook) </svg>
            </a>
          </div>
        </div>

        <!-- Sisi Kanan: Menu Navigasi -->
        <div class="flex flex-wrap text-base gap-10 md:gap-20">
          <!-- Kolom Menu Utama -->
          <div class="wrapper">
            <h3 class="font-semibold text-lg text-gray-900">Menu</h3>
            <ul class="flex flex-col gap-3 mt-4 text-gray-700">
              <li><a href="#" class="hover:text-blue-700 hover:underline transition-colors">Product</a></li>
              <li><a href="#" class="hover:text-blue-700 hover:underline transition-colors">Promo</a></li>
              <li><a href="#" class="hover:text-blue-700 hover:underline transition-colors">New Arrivals</a></li>
            </ul>
          </div>

          <!-- Kolom Perusahaan -->
          <div class="wrapper">
            <h3 class="font-semibold text-lg text-gray-900">Company</h3>
            <ul class="flex flex-col gap-3 mt-4 text-gray-700">
              <li><a href="#" class="hover:text-blue-700 hover:underline transition-colors">About</a></li>
              <li><a href="#" class="hover:text-blue-700 hover:underline transition-colors">Contact</a></li>
              <li><a href="#" class="hover:text-blue-700 hover:underline transition-colors">FAQs</a></li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Garis Pemisah -->
      <hr class="my-8 border-gray-300" />

      <!-- Bagian Bawah: Copyright dan Link Legal -->
      <div class="flex flex-wrap items-center justify-between gap-4">
        <span class="text-sm text-gray-600">© 2025 NEPTUNETHRIFT. All rights reserved.</span>
        <ul class="flex gap-6 md:gap-8 text-sm text-gray-600">
          <li><a href="#" class="hover:text-blue-700 underline">Privacy Policy</a></li>
          <li><a href="#" class="hover:text-blue-700 underline">Terms of Service</a></li>
        </ul>
      </div>
    </div>
  </footer>
</template>
