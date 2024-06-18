import { defineStore } from "pinia"
import { ref, computed } from "vue"

export const useUserStore = defineStore("user", () => {
  // const userId = ref<string>("")
  const userId = ref<string>("RRR")

  const isAuth = computed<boolean>(() => {
    return userId.value !== ""
  })

  return { userId, isAuth }
})
