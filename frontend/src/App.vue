<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <div>
    <RouterView />
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
}

.title {
  font-family: "Montserrat", sans-serif;
  font-weight: 700; /* Bold */
}

.paragraph {
  font-family: "Montserrat", sans-serif;
  font-weight: 400; /* Regular */
}
.decorative-title {
  font-family: "Bitcount Single Ink", cursive;
  font-weight: 400; /* Atur ketebalan sesuai selera */
  font-size: 2.5rem;
  text-align: center;
}
</style>
