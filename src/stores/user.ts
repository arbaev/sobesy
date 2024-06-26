import { defineStore } from "pinia"
import { ref, computed } from "vue"

export const useUserStore = defineStore("user", () => {
  const userId = ref<string>("")

  const isAuth = computed<boolean>(() => {
    return userId.value !== ""
  })

  return { userId, isAuth }
})
