<script setup lang="ts">
import { ref, onMounted } from "vue"
import { getFirestore, collection, query, orderBy, getDocs, deleteDoc, doc, where } from "firebase/firestore"
import { useUserStore } from "@/stores/user"
import { type IInterview } from "@/interfaces"
import { useToast } from "primevue/usetoast"

const toast = useToast()

const userStore = useUserStore()
const db = getFirestore()

const interviews = ref<IInterview[]>([])
const isLoading = ref<boolean>(true)

const getInterviews = async <T extends IInterview>(): Promise<T[] | []> => {
  try {
    const q = query(collection(db, `users/${userStore.userId}/interviews`), orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map((doc) => doc.data() as T)
  } catch (error: unknown) {
    if (error instanceof Error) {
      toast.add({ severity: "error", summary: "Error", detail: error.message, life: 5000 })
    }
    return []
  }
}

onMounted(async () => {
  const listInterviews: Array<IInterview> = await getInterviews()
  interviews.value = [...listInterviews]
  isLoading.value = false
})
</script>

<template>
  <div>{{ interviews }}</div>
</template>

<style scoped></style>
