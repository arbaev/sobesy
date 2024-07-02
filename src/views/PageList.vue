<script setup lang="ts">
import { ref, onMounted } from "vue"
import { getFirestore, collection, query, orderBy, getDocs, deleteDoc, doc } from "firebase/firestore"
import { useUserStore } from "@/stores/user"
import { type IInterview } from "@/interfaces"
import { useToast } from "primevue/usetoast"
import { useConfirm } from "primevue/useconfirm"

const confirm = useConfirm()
const toast = useToast()

const userStore = useUserStore()
const db = getFirestore()

const interviews = ref<IInterview[]>([])
const isLoading = ref<boolean>(true)

const confirmRemoveInterview = async (id: string): Promise<void> => {
  confirm.require({
    header: "Удаление собеседований",
    message: "Вы точно хотите удалить собеседование?",
    icon: "pi pi-info-circle",
    rejectLabel: "Отмена",
    acceptLabel: "Удалить",
    rejectClass: "p-button-secondary p-button-outlined",
    acceptClass: "p-button-danger",
    accept: async () => {
      isLoading.value = true
      await deleteDoc(doc(db, `users/${userStore.userId}/interviews`, id))

      interviews.value = await getAllInterviews()

      isLoading.value = false
    },
  })
}

const getAllInterviews = async <T extends IInterview>(): Promise<T[] | []> => {
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
  const listInterviews: Array<IInterview> = await getAllInterviews()
  interviews.value = listInterviews
  isLoading.value = false
})
</script>

<template>
  <app-dialog />
  <div>
    <h1>Список собеседований</h1>
    <app-data-table :value="interviews" :loading="isLoading">
      <template #empty>
        <div class="text-center"><em> Интервью пока нет </em></div>
      </template>
      <app-column field="company" header="Компания"></app-column>
      <app-column field="hrName" header="Имя HR"></app-column>
      <app-column field="vacancyLink" header="Вакансия">
        <template #body="{ data }">
          <a :href="data.vacancyLink" target="_blank">{{ data.vacancyLink }}</a>
        </template>
      </app-column>
      <app-column header="Контакты">
        <template #body="{ data }">
          <div class="contacts">
            <a
              v-if="data.contactTelegram"
              :href="`https://t.me/${data.contactTelegram}`"
              target="_blank"
              class="contacts__telegram"
            >
              <span class="contacts__icon pi pi-telegram"></span>
            </a>
            <a
              v-if="data.contactWhatsApp"
              :href="`https://wa.me/${data.contactWhatsApp}`"
              target="_blank"
              class="contacts__whatsapp"
            >
              <span class="contacts__icon pi pi-whatsapp"></span>
            </a>
            <a
              v-if="data.contactPhone"
              :href="`https://tel:${data.contactPhone}`"
              target="_blank"
              class="contacts__phone"
            >
              <span class="contacts__icon pi pi-phone"></span>
            </a>
            <span v-else>Контакты не заполнены</span>
          </div>
        </template>
      </app-column>
      <app-column>
        <template #body="{ data }">
          <div class="flex gap-2">
            <router-link :to="{ name: 'Interview', params: { id: data.id } }">
              <app-button icon="pi pi-pencil" severity="info" />
            </router-link>
            <app-button icon="pi pi-trash" severity="danger" @click="confirmRemoveInterview(data.id)" />
          </div>
        </template>
      </app-column>
    </app-data-table>
  </div>
</template>

<style scoped>
.contacts {
  display: flex;
  align-items: center;
  gap: 20px;
}
.contacts__telegram {
  color: #0088cc;
}
.contacts__whatsapp {
  color: #25d366;
}
.contacts__phone {
  color: #371777;
}
.contacts__icon {
  font-size: 20px;
}
.interview-stages {
  display: flex;
  gap: 5px;
}
</style>
