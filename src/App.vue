<script setup lang="ts">
import { onMounted, ref } from "vue"
import AppHeader from "@/components/AppHeader.vue"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { useUserStore } from "@/stores/user"

const userStore = useUserStore()

const isLoading = ref<boolean>(true)

onMounted(() => {
  onAuthStateChanged(getAuth(), (user) => {
    if (user) {
      userStore.userId = user.uid
    } else {
      userStore.userId = ""
    }
    isLoading.value = false
  })
})
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
