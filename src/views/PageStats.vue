<script setup lang="ts">
import { ref, onMounted } from "vue"
import { getFirestore, collection, query, orderBy, getDocs } from "firebase/firestore"
import { useUserStore } from "@/stores/user"
import { type IInterview } from "@/interfaces"
import { useToast } from "primevue/usetoast"

const toast = useToast()

const userStore = useUserStore()
const db = getFirestore()

const interviews = ref<IInterview[]>([])
const isLoading = ref<boolean>(true)

const chartData = ref<unknown>()
const chartOptions = ref<unknown>(null)

const getAllInterviews = async <T extends IInterview>(): Promise<T[] | []> => {
  try {
    const interviewsCollection = collection(db, `users/${userStore.userId}/interviews`)
    const q = query(interviewsCollection, orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map((doc) => doc.data() as T)
  } catch (error: unknown) {
    if (error instanceof Error) {
      toast.add({ severity: "error", summary: "Error", detail: error.message, life: 5000 })
    }
    return []
  }
}

const setChartData = () => {
  const documentStyle = getComputedStyle(document.body)

  const data: number[] = [0, 0, 0]
  interviews.value.forEach((interview: IInterview) => {
    if (interview.result === "Offer") {
      data[0]++
    } else if (interview.result === "Refusal") {
      data[1]++
    } else {
      data[2]++
    }
  })

  return {
    labels: ["Оффер", "Отказ", "В процессе"],
    datasets: [
      {
        data,
        backgroundColor: [
          documentStyle.getPropertyValue("--p-cyan-500"),
          documentStyle.getPropertyValue("--p-orange-500"),
          documentStyle.getPropertyValue("--p-gray-500"),
        ],
        hoverBackgroundColor: [
          documentStyle.getPropertyValue("--p-cyan-400"),
          documentStyle.getPropertyValue("--p-orange-400"),
          documentStyle.getPropertyValue("--p-gray-400"),
        ],
      },
    ],
  }
}

const setChartOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement)
  const textColor = documentStyle.getPropertyValue("--p-text-color")

  return {
    plugins: {
      legend: {
        labels: {
          cutout: "60%",
          color: textColor,
        },
      },
    },
  }
}

onMounted(async () => {
  const listInterviews: Array<IInterview> = await getAllInterviews()
  interviews.value = listInterviews
  isLoading.value = false

  chartData.value = setChartData()
  chartOptions.value = setChartOptions()
})
</script>

<template>
  <AppChart type="doughnut" :data="chartData" :options="chartOptions" class="w-full md:w-[30rem]" />
</template>

<style scoped></style>
