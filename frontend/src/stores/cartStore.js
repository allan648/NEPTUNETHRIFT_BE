import { defineStore } from 'pinia';
import axios from 'axios';
import { useAuthStore } from './authStore';

export const useCartStore = defineStore('cart', {
  state: () => ({
    count: 0, // Jumlah item
    items: [],
  }),
  actions: {
    async fetchCartCount() {
      const authStore = useAuthStore();
      
      // Jika tidak login, nol-kan
      if (!authStore.isAuthenticated) {
        this.count = 0;
        return;
      }

      try {
        const API_URL = "http://localhost:3000/api";
        // Kita panggil API Cart yang sudah dibuat sebelumnya
        const response = await axios.get(`${API_URL}/cart`, { withCredentials: true });
        
        // Update jumlah item (Array length)
        this.items = response.data.items;
        this.count = response.data.items.length;
        
      } catch (error) {
        console.error("Gagal hitung cart:", error);
        this.count = 0;
      }
    }
  }
});