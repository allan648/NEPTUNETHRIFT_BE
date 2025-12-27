<script setup>
import DashboardIcon from "@/components/icons/DashboardIcon.vue";
import logofootwear from "@/asset/images/Footwear.png";
import Users from "@/components/icons/User.vue";
import Product from "@/components/icons/Product.vue";
import Comment from "@/components/icons/Comment.vue";
import Cart from "@/components/icons/Cart.vue";
import CategoriesIcon from "@/components/icons/CategoriesIcon.vue";
import StatusItems from "@/components/icons/StatusItems.vue";
// Tambahkan ikon untuk Brand di sini (contoh menggunakan ikon Tag atau sejenisnya)
import BrandIcon from "@/components/icons/CategoriesIcon.vue"; 
</script>
<template>
  <aside
    class="fixed top-0 left-0 z-999 min-w-64 mt-16 lg:mt-0 -translate-x-full lg:translate-x-0 flex flex-col gap-6 sm:gap-8 p-4 min-h-screen bg-gray-100 border-r border-gray-300 shadow-2xs transition-all duration-300 ease-in-out"
    :class="[isSidebarOpen ? 'translate-x-0' : '']"
  >
    <RouterLink
      :to="{ name: 'Home' }"
      class="space-x-2 flex text-2xl sm:text-3xl font-se font-semibold pl-3 pt-2 pb-4 sm:pt-4"
    >
    <img :src="logofootwear" alt="Logo" class="h-8 w-8" />
    <span class="font-extrabold text-xl pt-1">
      <span class="text-blue-700">NEPTUNE</span>THRIFT
    </span>
    </RouterLink>
    <div class="space-y-6 text-sm">
      <div class="space-y-4">
        <h3 class="text-sm font-semibold uppercase text-neu-500 pl-3">Dashboard</h3>
        <RouterLink
          :to="{ name: 'Dashboard' }"
          class="flex gap-3 items-center py-2 px-4 font-medium hover:bg-blue-300 transition-all duration-50 rounded-xl"
          :class="$route.name === 'Dashboard' ? 'bg-blue-300 text-gray-950' : ''"
        >
          <DashboardIcon
            class="size-5"
            :class="$route.name === 'Dashboard' ? ' text-gray-950' : 'text-neu-500'"
          />Dashboard
        </RouterLink>
      </div>
      <div class="space-y-3">
        <h3 class="text-sm font-semibold uppercase text-neu-500 pl-3">Accounts</h3>
        <RouterLink
          :to="{ name: 'Accounts' }"
          class="flex gap-3 items-center py-2 px-4 font-medium hover:bg-blue-300 transition-all duration-50 rounded-xl"
          :class="$route.path.startsWith('/admin/accounts') ? 'bg-blue-300 text-gray-950' : ''"
        >
          <Users
            class="size-5"
            :class="$route.path.startsWith('/admin/accounts') ? ' text-gray-950' : 'text-neu-500'"
          />Accounts
        </RouterLink>
      </div>
      <div class="space-y-3">
        <h3 class="text-sm font-semibold uppercase text-neu-500 pl-3">Product and Transaction</h3>
        
        <RouterLink
          :to="{ name: 'Products' }"
          class="flex gap-3 items-center py-2 px-4 font-medium hover:bg-blue-300 transition-all duration-50 rounded-xl"
          :class="$route.path.startsWith('/admin/products') ? 'bg-blue-300 text-gray-950' : ''"
        >
          <Product
            class="size-5"
            :class="$route.path.startsWith('/admin/products') ? ' text-gray-950' : 'text-neu-500'"
          />Products
        </RouterLink>

        <RouterLink
          :to="{ name: 'Categories' }"
          class="flex gap-3 items-center py-2 px-4 font-medium hover:bg-blue-300 transition-all duration-50 rounded-xl"
          :class="$route.path.startsWith('/admin/categories') ? 'bg-blue-300 text-gray-950' : ''"
        >
          <CategoriesIcon
            class="size-5"
            :class="$route.path.startsWith('/admin/categories') ? ' text-gray-950' : 'text-neu-500'"
          />Categories
        </RouterLink>

        <RouterLink
          :to="{ name: 'Brands' }"
          class="flex gap-3 items-center py-2 px-4 font-medium hover:bg-blue-300 transition-all duration-50 rounded-xl"
          :class="$route.path.startsWith('/admin/brands') ? 'bg-blue-300 text-gray-950' : ''"
        >
          <BrandIcon
            class="size-5"
            :class="$route.path.startsWith('/admin/brands') ? ' text-gray-950' : 'text-neu-500'"
          />Brands
        </RouterLink>

        <RouterLink
          :to="{ name: 'Transactions' }"
          class="flex gap-3 items-center py-2 px-4 font-medium hover:bg-blue-300 transition-all duration-50 rounded-xl"
          :class="$route.path.startsWith('/admin/transactions') ? 'bg-blue-300 text-gray-950' : ''"
        >
          <Cart
            class="size-5"
            :class="$route.path.startsWith('/admin/transactions') ? ' text-gray-950' : 'text-neu-500'"
          />Transaction History's
        </RouterLink>

        <RouterLink
          :to="{ name: 'Status' }"
          class="flex gap-3 items-center py-2 px-4 font-medium hover:bg-blue-300 transition-all duration-50 rounded-xl"
          :class="$route.path.startsWith('/admin/status') ? 'bg-blue-300 text-gray-950' : ''"
        >
          <StatusItems
            class="size-5"
            :class="$route.path.startsWith('/admin/status') ? ' text-gray-950' : 'text-neu-500'"
          />Orders
        </RouterLink>
      </div>
      <div class="space-y-3">
        <h3 class="text-sm font-semibold uppercase text-neu-500 pl-3">Testimonials</h3>
        <RouterLink
          :to="{ name: 'Comments' }"
          class="flex justify-between items-center py-2 px-4 font-medium hover:bg-blue-300 transition-all duration-50 rounded-xl"
          :class="$route.path.startsWith('/admin/comments') ? 'bg-blue-300 text-gray-950' : ''"
        >
          <span class="flex items-center gap-3"
            ><Comment
              class="size-5"
              :class="
                $route.path.startsWith('/admin/comments') ? ' text-gray-950' : 'text-neu-500'
              "
            />Comments</span
          ><span
            class="flex items-center text-neu-50 text-sm rounded-[6px] justify-center px-2 bg-blue-400"
            >2</span
          >
        </RouterLink>
      </div>
    </div>
  </aside>
</template>
