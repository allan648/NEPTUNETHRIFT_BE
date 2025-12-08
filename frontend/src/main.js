import { createApp } from "vue";
import { createPinia } from "pinia";
import AOS from "aos";
import "aos/dist/aos.css";

import App from "./App.vue";
import router from "./router";
import "../src/asset/main.css";

const app = createApp(App);

app.use(createPinia());
app.use(router);

// Mount the app
app.mount("#app");

// Initialize AOS after mount
AOS.init({
  duration: 800,
  easing: "ease-in-out",
  once: true,
});

// Also refresh AOS on each route change to animate newly inserted elements
router.afterEach(() => {
  // small timeout to ensure DOM is updated
  setTimeout(() => AOS.refresh(), 50);
});
