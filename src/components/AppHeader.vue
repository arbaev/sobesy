<script setup lang="ts">
import { computed } from "vue"
import { useUserStore } from "@/stores/user"
import { getAuth, signOut } from "firebase/auth"
import { useRouter } from "vue-router"

const router = useRouter()
const userStore = useUserStore()

const itemsRightMenu = computed<IMenuItem[]>(() => {
  return itemsMainMenu.value.filter((x) => x.align === "right")
})

enum MenuItemIDs {
  add,
  list,
  stats,
  login,
  logout,
}

interface IMenuItem {
  id: MenuItemIDs
  label: string
  icon: string
  path: string
  showAuth: boolean
  align?: "left" | "right"
}

const itemsMainMenu = computed<IMenuItem[]>(() => {
  return [
    {
      id: MenuItemIDs.add,
      label: "Добавить",
      icon: "pi pi-plus",
      path: "/",
      showAuth: userStore.isAuth,
    },
    {
      id: MenuItemIDs.list,
      label: "Список собеседований",
      icon: "pi pi-list",
      path: "/list",
      showAuth: userStore.isAuth,
    },
    {
      id: MenuItemIDs.stats,
      label: "Статистика",
      icon: "pi pi-chart-pie",
      path: "/stats",
      showAuth: userStore.isAuth,
    },
    {
      id: MenuItemIDs.login,
      label: "Авторизация",
      icon: "pi pi-user",
      path: "/auth",
      showAuth: !userStore.isAuth,
      align: "right",
    },
    {
      id: MenuItemIDs.logout,
      label: "Выход",
      icon: "pi pi-sign-out",
      path: "/",
      showAuth: userStore.isAuth,
      align: "right",
    },
  ]
})

const clickOnMenu = (item: IMenuItem): void => {
  switch (item.id) {
    case MenuItemIDs.login:
      signInMethod()
      break
    case MenuItemIDs.logout:
      signOutMethod()
      break
  }
}

const signOutMethod = async (): Promise<void> => {
  await signOut(getAuth())
  router.push("/auth")
}
const signInMethod = (): void => {
  router.push("/auth")
}
</script>

<template>
  <AppMenubar :model="itemsMainMenu" class="menu">
    <template #item="{ item, props }">
      <template v-if="item.showAuth && item.align !== 'right'">
        <router-link :to="item.path" class="flex align-items-center" v-bind="props.action">
          <span :class="item.icon" class="p-menuitem-icon"></span>
          <span class="ml-2">{{ item.label }}</span>
        </router-link>
      </template>
    </template>
    <template #end>
      <div class="align-end">
        <template v-for="item in itemsRightMenu" :key="item.id">
          <template v-if="item.showAuth">
            <router-link :to="item.path" class="flex align-items-center" @click="clickOnMenu(item)">
              <span :class="item.icon" class="p-menuitem-icon"></span>
              <span class="ml-2">{{ item.label }}</span>
            </router-link>
          </template>
        </template>
      </div>
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
.align-end {
  display: flex;
  flex-direction: row;
  gap: 1.5rem;
  padding: 0.5rem 0;
}
</style>
