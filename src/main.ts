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
import DataTable from "primevue/datatable"
import Column from "primevue/column"
import ConfirmDialog from "primevue/confirmdialog"
import ConfirmationService from "primevue/confirmationservice"
import InputNumber from "primevue/inputnumber"
import Textarea from "primevue/textarea"
import DatePicker from "primevue/datepicker"
import RadioButton from "primevue/radiobutton"
import Badge from "primevue/badge"
import Tooltip from "primevue/tooltip"
import Chart from "primevue/chart"

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
app.use(ConfirmationService)

app.directive("tooltip", Tooltip)

app.component("AppMenubar", Menubar)
app.component("AppButton", Button)
app.component("AppInputText", InputText)
app.component("AppToast", Toast)
app.component("AppProgress", ProgressSpinner)
app.component("AppCard", Card)
app.component("AppDataTable", DataTable)
app.component("AppColumn", Column)
app.component("AppDialog", ConfirmDialog)
app.component("AppInputNumber", InputNumber)
app.component("AppTextarea", Textarea)
app.component("AppDatePicker", DatePicker)
app.component("AppRadioButton", RadioButton)
app.component("AppBadge", Badge)
app.component("AppChart", Chart)

app.mount("#app")
