import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/authStore";

// layouts
import AppLayout from "@/layouts/AppLayout.vue";
import AdminLayout from "@/layouts/AdminLayout.vue";
import UserLayout from "@/layouts/UserLayout.vue";

// Pages Public
import Home from "@/pages/Home.vue";
import ProductPage from "@/pages/Product.vue";
import PromoPage from "@/pages/Promo.vue";
import AboutPage from "@/pages/About.vue";
import DetailProductPage from "@/pages/DetailProduct.vue";
import MyOrderView from "@/pages/MyorderView.vue";
import CheckoutView from "@/pages/CheckoutView.vue";

// User Profile
import Profile from "@/pages/profile/Profile.vue";
import Cart from "@/pages/profile/Cart.vue";
import Wishlist from "@/pages/profile/Wishlist.vue";
import Review from "@/pages/profile/Review.vue";

// Admin Dashboard & Lists
import Dashboard from "@/pages/admin/Dashboard.vue";
import Accounts from "@/pages/admin/accounts/Accounts.vue";
import AccountsList from "@/pages/admin/accounts/AccountLists.vue";
import Products from "@/pages/admin/products/Products.vue";
import ProductLists from "@/pages/admin/products/ProductLists.vue";
import Transactions from "@/pages/admin/transactions/Transactions.vue";
import TransactionLists from "@/pages/admin/transactions/TransactionLists.vue";
import Status from "@/pages/admin/status/Status.vue";
import StatusLists from "@/pages/admin/status/StatusLists.vue";
import CategoryLists from "@/pages/admin/categories/CategoryLists.vue";
import CommentLists from "@/pages/admin/comments/CommentLists.vue";

// Admin - Create/Edit/Detail
import CreateAdmin from "@/pages/admin/accounts/CreateAdmin.vue";
import EditAdmin from "@/pages/admin/accounts/AccountEdit.vue";
import DetailAccount from "@/pages/admin/accounts/AccountDetails.vue";
import CreateProduct from "@/pages/admin/products/AddProducts.vue";
import EditProduct from "@/pages/admin/products/EditProducts.vue";
import DetailProduct from "@/pages/admin/products/ProductDetails.vue";

// Auth Pages
import VerifyEmail from '@/components/auth/VerifyEmail.vue'
import ResetPassword from '@/components/auth/ResetPassword.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: AppLayout,
      children: [
        {
          path: "",
          name: "Home",
          component: Home,
        },
        {
          path: "/product",
          name: "Product",
          component: ProductPage,
        },
        {
          path: "/promo",
          name: "Promo",
          component: PromoPage,
        },
        {
          path: "/about",
          name: "About",
          component: AboutPage,
        },
        {
          // ✅ SUDAH BENAR: Dynamic Route untuk Detail Produk
          path: "/detailproduct/:id", 
          name: "DetailProduct", 
          component: DetailProductPage,
        },
        {
          path: '/myorder',
          name: 'myorder',
          component: MyOrderView,
          meta: { requiresAuth: true } // (Opsional) Penanda butuh login
        },

        {
          path: '/checkout',
          name: 'checkout',
          component: CheckoutView
        },

        {
          path: 'user', 
          component: UserLayout,
          meta: { requiresAuth: true },
          children: [
            { path: 'profile', name: 'Profile', component: Profile },
            { path: 'cart', name: 'Cart', component: Cart },
            { path: 'wishlist', name: 'Wishlist', component: Wishlist },
            { path: 'review', name: 'Review', component: Review },
          ],
        },
        {
          path: '/verify-email',
          name: 'verify-email',
          component: VerifyEmail
        },
        // RUTE UNTUK RESET PASSWORD
        {
          path: '/reset-password',
          name: 'reset-password',
          component: ResetPassword
        }
      ],
    },
    {
      path: "/admin",
      component: AdminLayout,
      meta: { requiresAdmin: true }, // Menandai seluruh folder admin butuh akses admin
      children: [
        { path: "dashboard", name: "Dashboard", component: Dashboard },
        {
          path: "accounts",
          component: Accounts,
          children: [
            { path: "", name: "Accounts", component: AccountsList },
            { path: "create", name: "Createadmin", component: CreateAdmin },
            { path: "edit", name: "Editadmin", component: EditAdmin },
            { path: "detail", name: "Detailaccount", component: DetailAccount },
          ],
        },
        {
          path: "products",
          component: Products,
          children: [
            { path: "", name: "Products", component: ProductLists }, // Nama 'Products' dipakai di redirect CreateProduct.vue
            { path: "create", name: "Createproduct", component: CreateProduct },
            { path: "edit/:id", name: "Editproduct", component: EditProduct },
            { path: "detail/:id", name: "Detailproduct", component: DetailProduct },
          ],
        },
        { path: "categories", name: "Categories", component: CategoryLists },
        {
          path: "transactions",
          component: Transactions,
          children: [{ path: "", name: "Transactions", component: TransactionLists }],
        },
        {
          path: "status",
          component: Status,
          children: [{ path: "", name: "Status", component: StatusLists }],
        },
        { path: "comments", name: "Comments", component: CommentLists },
      ],
    },
  ],
});

// --- SATU NAVIGASI GUARD (GABUNGAN) ---
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // 1. Cek status login terkini
  await authStore.checkAuth();

  // 2. LOGIKA PROTEKSI ADMIN
  // Cek apakah rute tujuan diawali dengan "/admin"
  if (to.path.startsWith('/admin')) {
    
    // A. Belum Login -> Tendang ke Home + Buka Modal
    if (!authStore.isAuthenticated) {
      authStore.openLoginModal();
      return next('/'); 
    }

    // B. Sudah Login TAPI bukan Admin -> Tendang ke Home + Alert
    if (authStore.user?.role !== 'admin') {
      alert("⛔ Akses Ditolak! Halaman ini khusus Administrator.");
      return next('/'); 
    }
  }

  // 3. LOGIKA PROTEKSI USER BIASA (Profile, Cart, dll)
  // Cek jika rute butuh login (requiresAuth) tapi user belum login
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    authStore.openLoginModal();
    return next('/');
  }

  // 4. Lolos semua cek? Silakan masuk.
  next();
});

export default router;