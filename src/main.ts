import "primeflex/primeflex.css";
import "primeicons/primeicons.css";

import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import FloatLabel from "primevue/floatlabel";
import Card from "primevue/card";
import Toast from "primevue/toast";
import ToastService from "primevue/toastservice";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Select from "primevue/select";

import PrimeVue from "primevue/config";
import Aura from "@primevue/themes/aura";
import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(createPinia());
app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
});
app.use(router);
app.use(ToastService);

app.component("Button", Button);
app.component("InputText", InputText);
app.component("FloatLabel", FloatLabel);
app.component("Card", Card);
app.component("Toast", Toast);
app.component("DataTable", DataTable);
app.component("Column", Column);
app.component("Select", Select);

app.mount("#app");
