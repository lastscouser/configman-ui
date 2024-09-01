import { ref } from "vue";
import { ApiService } from "./api-service";
import type { ToastServiceMethods } from "primevue/toastservice";

// Create a toast instance (can be shared across components)
const toast = ref<ToastServiceMethods | null>(null);
const router = ref<any>(null);

// Create an instance of ApiService
const apiUrl = import.meta.env.VITE_API_BASE_URL;
const apiService = new ApiService(apiUrl, toast, router);

export { apiService, toast, router };
