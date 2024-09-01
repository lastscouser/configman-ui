<script setup lang="ts">
import { onMounted } from "vue";
import { toast, router } from "./service/api";
import { useToast } from "primevue/usetoast";
import { useRouter } from "vue-router";

onMounted(() => {
  toast.value = useToast();
  router.value = useRouter();
});
</script>

<template>
  <Toast ref="toast" position="top-center" />
  <router-view />
</template>

<style scoped>
.app-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  text-align: center; /* Optional: Center text inside the router-view content */
}
</style>
