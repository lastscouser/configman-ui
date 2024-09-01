import { ref } from "vue";
import { ApiService } from "./api-service";
import type { ToastServiceMethods } from "primevue/toastservice";

// Create a toast instance (can be shared across components)
const toast = ref<ToastServiceMethods | null>(null);
const router = ref<any>(null);

// Create an instance of ApiService
const apiService = new ApiService("http://localhost:1892/api", toast, router);

export { apiService, toast, router };
