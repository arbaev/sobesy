<script setup lang="ts">
import { ref, onMounted } from "vue"
import { getFirestore, collection, query, orderBy, getDocs, deleteDoc, doc, where } from "firebase/firestore"
import { useUserStore } from "@/stores/user"
import { type IInterview } from "@/interfaces"
import { useToast } from "primevue/usetoast"
import { useConfirm } from "primevue/useconfirm"

const confirm = useConfirm()
const toast = useToast()

const userStore = useUserStore()
const db = getFirestore()

const interviews = ref<IInterview[]>([])
const selectedFilterResult = ref<IInterview["result"] | "">("")
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

const getAllInterviews = async <T extends IInterview>(options?: { filterResults: boolean }): Promise<T[] | []> => {
  try {
    const interviewsCollection = collection(db, `users/${userStore.userId}/interviews`)
    let q
    if (options?.filterResults) {
      q = query(interviewsCollection, where("result", "==", selectedFilterResult.value), orderBy("createdAt", "desc"))
    } else {
      q = query(interviewsCollection, orderBy("createdAt", "desc"))
    }

    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map((doc) => doc.data() as T)
  } catch (error: unknown) {
    if (error instanceof Error) {
      toast.add({ severity: "error", summary: "Error", detail: error.message, life: 5000 })
    }
    return []
  }
}

const submitFilter = async (): Promise<void> => {
  isLoading.value = true
  const listInterviews: Array<IInterview> = await getAllInterviews({ filterResults: true })
  interviews.value = listInterviews
  isLoading.value = false
}

const clearFilter = async (): Promise<void> => {
  selectedFilterResult.value = ""
  isLoading.value = true
  const listIntervies: Array<IInterview> = await getAllInterviews()
  interviews.value = listIntervies
  isLoading.value = false
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
    <div class="flex align-items-center mb-5">
      <div class="flex align-items-center mr-2">
        <span class="mr-2">Фильтры:</span>
        <app-radio-button inputId="interviewResult1" name="result" value="Refusal" v-model="selectedFilterResult" />
        <label for="interviewResult1" class="ml-2">Отказ</label>
      </div>
      <div class="flex align-items-center mr-2">
        <app-radio-button inputId="interviewResult2" name="result" value="Offer" v-model="selectedFilterResult" />
        <label for="interviewResult2" class="ml-2">Оффер</label>
      </div>
      <app-button class="mr-2" @click="submitFilter" :disabled="!selectedFilterResult" outlined>Применить</app-button>
      <app-button severity="danger" :disabled="!selectedFilterResult" @click="clearFilter" outlined
        >Сбросить</app-button
      >
    </div>
    <app-data-table :value="interviews" :loading="isLoading">
      <template #empty>
        <div class="text-center"><em> Интервью пока нет </em></div>
      </template>
      <app-column field="company" header="Компания"></app-column>
      <app-column field="hrName" header="Имя HR"></app-column>
      <app-column field="vacancyLink" header="Вакансия">
        <template #body="{ data }">
          <a :href="data.vacancyLink" target="_blank">Ссылка на вакансию</a>
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
      <app-column header="Этапы">
        <template #body="{ data }">
          <span v-if="!data.stages">Не заполнено</span>
          <div v-else class="interview-stages">
            <app-badge v-for="(stage, i) in data.stages" :key="i" :value="i + 1" rounded v-tooltip.top="stage.name" />
          </div>
        </template>
      </app-column>

      <app-column header="Зарплатная вилка">
        <template #body="{ data }">
          <span v-if="!data.salaryFrom">Не заполнено</span>
          <span v-else>{{ data.salaryFrom }}&ndash;{{ data.salaryTo }}</span>
        </template>
      </app-column>

      <app-column header="Результат">
        <template #body="{ data }">
          <span v-if="!data.result">Не заполнено</span>
          <template v-else>
            <app-badge
              :severity="data.result === 'Offer' ? 'success' : 'danger'"
              :value="data.result === 'Offer' ? 'Оффер' : 'Отказ'"
            />
          </template>
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
