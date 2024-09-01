<script setup lang="ts">
import InputText from "primevue/inputtext";
import { ref } from "vue";
import { apiService, toast } from "../service/api";
import type { ApiResponse } from "@/models/api-response";
import type { LoginRequest, LoginResponse } from "@/models/login";
import { useRouter } from "vue-router";
import type { RegisterRequest, RegisterResponse } from "@/models/register";

const email = ref("");
const password = ref("");
const router = useRouter();

const signin = async () => {
  const request: LoginRequest = {
    email: email.value,
    password: password.value,
  };
  const response = await apiService.post<ApiResponse<LoginResponse>>(
    "/users/login",
    request
  );

  const token = response?.success?.token;
  apiService.setToken(token);
  toast.value?.add({
    severity: "success",
    summary: "Login",
    detail: response?.success?.message,
    life: 3000,
  });
  router.push("/");
};

const register = async () => {
  const request: RegisterRequest = {
    email: email.value,
    password: password.value,
  };
  const response = await apiService.post<ApiResponse<RegisterResponse>>(
    "/users/register",
    request
  );

  toast.value?.add({
    severity: "success",
    summary: "Register",
    detail: response?.success?.message,
    life: 3000,
  });
};
</script>

<template>
  <div class="p-mx-auto lg:w-9 sm:w-full">
    <div class="text-center mb-5">
      <img
        src="/src/assets/codeway.png"
        alt="Image"
        height="100"
        class="mb-3"
      />
      <div class="text-900 text-3xl font-medium mb-3">Sign In</div>
    </div>

    <div>
      <label for="email" class="text-900 font-medium mb-2">Email</label>
      <InputText
        id="email"
        type="email"
        v-model="email"
        placeholder="Email address"
        class="w-full mb-3"
      />

      <label for="password" class="text-900 font-medium mb-2">Password</label>
      <InputText
        id="password"
        type="password"
        v-model="password"
        placeholder="Password"
        class="w-full mb-3"
      />
      <Button
        label="Sign In"
        icon="pi pi-user"
        class="w-full mb-3"
        @click="signin"
      ></Button>
      <Button
        label="Register"
        icon="pi pi-user"
        class="w-full"
        @click="register"
      ></Button>
    </div>
  </div>
</template>
