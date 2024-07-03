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

declare module "vue" {
  export interface GlobalComponents {
    AppMenubar: typeof Menubar
    AppButton: typeof Button
    AppInputText: typeof InputText
    AppToast: typeof Toast
    AppProgress: typeof ProgressSpinner
    AppCard: typeof Card
    AppDataTable: typeof DataTable
    AppColumn: typeof Column
    AppDialog: typeof ConfirmDialog
    AppInputNumber: typeof InputNumber
    AppTextarea: typeof Textarea
    AppDatePicker: typeof DatePicker
    AppRadioButton: typeof RadioButton
    AppBadge: typeof Badge
  }
}
