// src/services/authService.js
import axios from 'axios'

// URL base API (ubah sesuai backend-mu)
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api'

export default {
  /**
   * Login user
   * @param {string} email
   * @param {string} password
   * @returns {Promise<Object>} user data + token
   */
  async login(email, password) {
    try {
      const response = await axios.post(`${API_BASE}/auth/login`, { email, password })
      // response.data: { user, token }
      return response.data
    } catch (err) {
      console.error('Login error:', err)
      throw err
    }
  },

  /**
   * Logout user
   * Bisa hapus token dari localStorage atau panggil endpoint logout backend
   */
  logout() {
    localStorage.removeItem('auth_token')
    // Opsional: panggil API logout
    // return axios.post(`${API_BASE}/auth/logout`)
  },

  /**
   * Simpan token di localStorage
   * @param {string} token
   */
  saveToken(token) {
    localStorage.setItem('auth_token', token)
  },

  /**
   * Ambil token dari localStorage
   * @returns {string|null}
   */
  getToken() {
    return localStorage.getItem('auth_token')
  },

  /**
   * Ambil profil user dari backend
   * @returns {Promise<Object>} user profile
   */
  async fetchProfile() {
    const token = this.getToken()
    if (!token) return null

    try {
      const response = await axios.get(`${API_BASE}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    } catch (err) {
      console.error('Fetch profile error:', err)
      return null
    }
  }
}
