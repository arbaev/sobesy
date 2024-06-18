import { createApp } from "vue"
import { createPinia } from "pinia"
import "./style.css"
import App from "./App.vue"
import router from "./router"
import PrimeVue from "primevue/config"
import Aura from "@primevue/themes/aura"
import "primeicons/primeicons.css"
import "primeflex/primeflex.scss"

import Menubar from "primevue/menubar"

const app = createApp(App)
const pinia = createPinia()

app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
})
app.use(router)
app.use(pinia)

app.component("AppMenubar", Menubar)

app.mount("#app")
