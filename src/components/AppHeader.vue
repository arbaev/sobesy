<script setup lang="ts">
import { ref, computed } from "vue"
import { useUserStore } from "@/store/user"

const userStore = useUserStore()

const isAuth = computed<boolean>(() => {
  return !!userStore.userId
})

interface IMenuItem {
  label: string
  icon: string
  path: string
  showAuth: boolean
}

const items = ref<IMenuItem[]>([
  {
    label: "Авторизация",
    icon: "pi pi-user",
    path: "/auth",
    showAuth: !isAuth.value,
  },
  {
    label: "Добавить",
    icon: "pi pi-plus",
    path: "/",
    showAuth: isAuth.value,
  },
  {
    label: "Список собеседований",
    icon: "pi pi-list",
    path: "/list",
    showAuth: isAuth.value,
  },
  {
    label: "Статистика",
    icon: "pi pi-chart-pie",
    path: "/stats",
    showAuth: isAuth.value,
  },
])
</script>

<template>
  <AppMenubar :model="items" class="menu">
    <template #item="{ item, props }">
      <template v-if="item.showAuth">
        <router-link :to="item.path" class="flex align-items-center" v-bind="props.action">
          <span :class="item.icon" class="p-menuitem-icon"></span>
          <span class="ml-2">{{ item.label }}</span>
        </router-link>
      </template>
    </template>
    <template #end v-if="isAuth">
      <span @click="userStore.userId = ''" class="flex align-items-center menu-exit">
        <span class="p-menuitem-icon pi pi-sign-out"></span>
        <span class="ml-2">Выход</span>
      </span>
    </template>
  </AppMenubar>
</template>

<style scoped>
.menu {
  margin: 0 30px;
}
.menu-exit {
  cursor: pointer;
}
</style>
