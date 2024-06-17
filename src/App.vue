<script setup lang="ts">
import AppHeader from "@/components/AppHeader.vue"
</script>

<template>
  <div class="container">
    <AppHeader />
  </div>
  <div class="content">
    <RouterView />
  </div>
</template>

<style scoped>
.container {
  max-width: 1280px;
  margin: auto;
  padding: 20px;
}
</style>
