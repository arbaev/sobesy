import { createApp } from "vue"
import { createPinia } from "pinia"
import "./style.css"
import App from "./App.vue"
import router from "./router"
import PrimeVue from "primevue/config"
import Aura from "@primevue/themes/aura"
import "primeicons/primeicons.css"
import "primeflex/primeflex.scss"
import { initializeApp } from "firebase/app"
import Menubar from "primevue/menubar"
import Button from "primevue/button"
import InputText from "primevue/inputtext"
import Toast from "primevue/toast"
import ToastService from "primevue/toastservice"
import ProgressSpinner from "primevue/progressspinner"
import Card from "primevue/card"

const app = createApp(App)
const pinia = createPinia()

// Initialize Firebase
initializeApp(JSON.parse(import.meta.env.VITE_FIREBASE))

app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
})
app.use(router)
app.use(pinia)
app.use(ToastService)

app.component("AppMenubar", Menubar)
app.component("AppButton", Button)
app.component("AppInputText", InputText)
app.component("AppToast", Toast)
app.component("AppProgress", ProgressSpinner)
app.component("AppCard", Card)

app.mount("#app")
