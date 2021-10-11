import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import {initQuasar} from "@/quasar";
import "./styles/main.scss";

const app = createApp(App);
initQuasar(app);
app.use(router);
app.mount("#app");
