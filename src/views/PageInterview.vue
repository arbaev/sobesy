<script setup lang="ts">
import { onMounted, ref } from "vue"
import { getFirestore, getDoc, doc, updateDoc, Timestamp } from "firebase/firestore"
import { useUserStore } from "@/stores/user"
import { type IInterview, type IStage } from "@/interfaces"
import { useRoute } from "vue-router"
import { useToast } from "primevue/usetoast"
// import { useConfirm } from "primevue/useconfirm"

const userStore = useUserStore()
const db = getFirestore()
const route = useRoute()
const toast = useToast()

const interview = ref<IInterview>()
const docRef = doc(db, `users/${userStore.userId}/interviews`, route.params.id as string)
const isLoading = ref<boolean>(true)

const getInterview = async (): Promise<void> => {
  try {
    isLoading.value = true
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const docData = docSnap.data() as IInterview

      if (docData.stages && docData.stages.length) {
        docData.stages = docData.stages.map((stage: IStage) => {
          if (stage.date && stage.date instanceof Timestamp) {
            return {
              ...stage,
              date: stage.date.toDate(),
            }
          }
          return stage
        })
      }
      interview.value = docData
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      toast.add({ severity: "error", summary: "Error", detail: error.message, life: 5000 })
    }
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => await getInterview())

const addStage = () => {
  if (interview.value) {
    if (!interview.value.stages) {
      interview.value.stages = []
    }
    const emptyStage = <IStage>{ name: "", date: new Date(), description: "" }
    interview.value.stages.push(emptyStage)
  }
}

const removeStage = (index: number) => {
  if (interview.value && interview.value.stages) {
    interview.value.stages.splice(index, 1)
  }
}

const saveInterview = async (): Promise<void> => {
  try {
    isLoading.value = true
    await updateDoc(docRef, { ...interview.value })
    await getInterview()
    toast.add({ severity: "success", summary: "Успешно", detail: "Собеседование успешно сохранено", life: 5000 })
  } catch (error: unknown) {
    if (error instanceof Error) {
      toast.add({ severity: "error", summary: "Error", detail: error.message, life: 5000 })
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <AppProgress v-if="isLoading" />
  <div class="content-interview" v-else-if="interview?.id && !isLoading">
    {{ interview }}
    <app-card>
      <template #title>Собеседование в компанию {{ interview.company }}</template>
      <template #content>
        <div class="flex flex-column gap-2">
          <label for="company">Компания</label>
          <app-input-text class="input mb-3" id="company" v-model="interview.company" />
        </div>
        <div class="flex flex-column gap-2">
          <label for="vacancyLink">Описание вакансии (ссылка)</label>
          <app-input-text class="input mb-3" id="vacancyLink" v-model="interview.vacancyLink" />
        </div>
        <div class="flex flex-column gap-2">
          <label for="hrName">Контакт (имя)</label>
          <app-input-text class="input mb-3" id="hrName" v-model="interview.hrName" />
        </div>
        <div class="flex flex-column gap-2">
          <label for="contactTelegram">Telegram username HR</label>
          <app-input-text class="input mb-3" id="contactTelegram" v-model="interview.contactTelegram" />
        </div>
        <div class="flex flex-column gap-2">
          <label for="contactWhatsApp">WhatsApp HR</label>
          <app-input-text class="input mb-3" id="contactWhatsApp" v-model="interview.contactWhatsApp" />
        </div>
        <div class="flex flex-column gap-2">
          <label for="contactPhone">Телефон HR</label>
          <app-input-text class="input mb-3" id="contactPhone" v-model="interview.contactPhone" />
        </div>
        <div class="flex flex-wrap gap-3 p-fluid mb-3">
          <div class="flex-auto">
            <app-input-number inputId="salaryFrom" placeholder="Зарплатная вилка от" v-model="interview.salaryFrom" />
          </div>
          <div class="flex-auto">
            <app-input-number inputId="salaryTo" placeholder="Зарплатная вилка до" v-model="interview.salaryTo" />
          </div>
        </div>

        <app-button label="Добавить этап" severity="info" icon="pi pi-plus" class="mb-3" @click="addStage" />
        <template v-if="interview.stages">
          <div v-for="(stage, index) in interview.stages" :key="index" class="interview-stage">
            <div class="flex flex-column gap-2">
              <label :for="`stage-name-${index}`">Название этапа</label>
              <app-input-text class="input mb-3" :id="`stage-name-${index}`" v-model="stage.name" />
            </div>
            <div class="flex flex-column gap-2">
              <label :for="`stage-date-${index}`">Дата прохождения этапа</label>
              <app-date-picker
                class="input mb-3"
                :id="`stage-date-${index}`"
                dateFormat="dd.mm.yy"
                v-model="stage.date"
              />
              <!-- @date-select="saveStage(index)" -->
            </div>
            <div class="flex flex-column gap-2">
              <label :for="`stage-description-${index}`">Комментарий</label>
              <app-textarea
                :id="`stage-description-${index}`"
                class="input mb-3"
                rows="5"
                v-model="stage.description"
              />
            </div>
            <app-button severity="danger" label="Удалить этап" @click="removeStage" />
          </div>
        </template>

        <div class="flex flex-wrap gap-3 mb-3">
          <div class="flex align-items-center">
            <app-radio-button inputId="interviewResult1" name="result" value="Refusal" v-model="interview.result" />
            <label for="interviewResult1" class="ml-2">Отказ</label>
          </div>
          <div class="flex align-items-center">
            <app-radio-button inputId="interviewResult2" name="result" value="Offer" v-model="interview.result" />
            <label for="interviewResult2" class="ml-2">Оффер</label>
          </div>
        </div>
        <app-button label="Сохранить" icon="pi pi-save" @click="saveInterview" />
      </template>
    </app-card>
  </div>
</template>

<style scoped>
.content-interview {
  max-width: 600px;
  margin: auto;
}
.input {
  width: 100%;
}
.interview-stage {
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 10px;
  margin-bottom: 10px;
}
</style>
