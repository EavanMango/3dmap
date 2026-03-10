import { createApp } from "vue"
import router from "./router"
import App from "./App.vue"
import Toast, { POSITION } from "vue-toastification";
import "vue-toastification/dist/index.css";
import "normalize.css"
import "./style.css"
let app = createApp(App)
app.use(router).use(Toast, {
    position: POSITION.TOP_CENTER,
    hideProgressBar: true,
  }).mount("#app")
