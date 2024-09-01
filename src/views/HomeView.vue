<script setup lang="ts">
import { formatDate } from "@/helper/format";
import { isMobileScreen } from "@/helper/screen";
import type { ApiResponse, BaseResponse } from "@/models/api-response";
import type {
  Parameter,
  ParameterCreationFields,
  ParameterUpdateFields,
} from "@/models/parameter";
import { apiService, toast } from "@/service/api";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const parameters = ref<Parameter[]>([]);
const filteredParameters = ref<Parameter[]>([]);
const selectedCountry = ref("TR");
const countries = ref([
  { name: "Türkiye", code: "TR" },
  { name: "Austria", code: "AT" },
  { name: "Germany", code: "DE" },
  { name: "France", code: "FR" },
]);
const editing = ref(false);
const adding = ref(false);
const editingParameterId = ref<string | undefined>(undefined);
const parameter = ref<ParameterCreationFields>({
  group: selectedCountry.value,
  key: "",
  value: "",
  description: "",
});

const filterParameters = () => {
  filteredParameters.value = parameters.value.filter(
    (x) => x.group === selectedCountry.value
  );
};

const fetchParameters = async () => {
  const response =
    await apiService.get<ApiResponse<Parameter[]>>("/parameters/all");

  parameters.value = response.success;
  filterParameters();
};

onMounted(fetchParameters);

const handleLogout = () => {
  apiService.clearToken();
  router.push("/signin");
};

const handleAdd = async () => {
  const request: ParameterCreationFields = {
    group: selectedCountry.value,
    key: parameter.value.key,
    value: parameter.value.value,
    description: parameter.value.description,
  };

  const response = await apiService.post<ApiResponse<BaseResponse>>(
    "/parameters/create",
    request
  );

  toast.value?.add({
    severity: "success",
    summary: "Parameter Creation",
    detail: response?.success?.message,
    life: 3000,
  });

  adding.value = false;
  resetForm();
  fetchParameters();
};

const setAddingTrue = () => {
  adding.value = true;
};

const prepareUpdate = (param: Parameter) => {
  parameter.value = { ...param };
  editingParameterId.value = param.id;
  editing.value = true;
};

const handleUpdate = async () => {
  const request: ParameterUpdateFields = {
    group: selectedCountry.value,
    value: parameter.value.value,
    description: parameter.value.description,
  };

  const response = await apiService.put<ApiResponse<BaseResponse>>(
    `/parameters/update/${editingParameterId.value}`,
    request
  );
  toast.value?.add({
    severity: "success",
    summary: "Parameter Update",
    detail: response?.success?.message,
    life: 3000,
  });

  editing.value = false;
  resetForm();
  fetchParameters();
};

const handleDelete = async (id: string) => {
  const response = await apiService.delete<ApiResponse<BaseResponse>>(
    `/parameters/delete/${id}`
  );
  toast.value?.add({
    severity: "success",
    summary: "Parameter Deletion",
    detail: response?.success?.message,
    life: 3000,
  });

  fetchParameters();
};

const cancelEdit = () => {
  resetForm();
};

const resetForm = () => {
  parameter.value = {
    group: selectedCountry.value,
    key: "",
    value: "",
    description: "",
  };
  editing.value = false;
};
</script>

<template>
  <img src="/src/assets/codeway.png" alt="Image" height="40" class="logo" />
  <Button
    label="Logout"
    icon="pi pi-sign-out"
    class="logout p-button-danger"
    @click="handleLogout"
  />
  <div class="container mt-8">
    <div class="lg:w-3 sm:w-full mr-2 ml-2">
      <Select
        v-model="selectedCountry"
        :options="countries"
        optionLabel="name"
        optionValue="code"
        placeholder="Select a Country"
        v-on:change="filterParameters"
        class="w-full"
      />
    </div>
    <div class="col-12">
      <div class="col-12 desktop-only">
        <DataTable
          :value="filteredParameters"
          responsiveLayout="scroll"
          class="p-datatable-responsive"
          tableStyle="min-width: 50rem"
          editMode="row"
          dataKey="id"
        >
          <Column field="group" header="Group" style="width: 6rem"></Column>
          <Column field="key" header="Key" style="width: 12rem"></Column>
          <Column field="value" header="Value" style="width: 12rem"></Column>
          <Column
            field="description"
            header="Description"
            style="min-width: 12rem"
          ></Column>
          <Column field="createdAt" header="CreatedAt">
            <template #body="slotProps">
              {{ formatDate(slotProps.data.createdAt) }}
            </template>
          </Column>
          <Column header="" style="width: 16rem; text-align: right">
            <template #body="slotProps">
              <Button
                label="Edit"
                class="p-button-success mr-2"
                @click="prepareUpdate(slotProps.data)"
              />
              <Button
                label="Delete"
                class="p-button-danger"
                @click="handleDelete(slotProps.data.id)"
              />
            </template>
          </Column>
        </DataTable>
      </div>
      <div class="w-full mobile-only" v-if="!editing && isMobileScreen">
        <div class="parameters-container" v-if="!adding">
          <div class="cards-grid">
            <div
              v-for="parameter in filteredParameters"
              :key="parameter.id"
              class="parameter-card"
            >
              <div><strong>Parameter Group:</strong> {{ parameter.group }}</div>
              <div><strong>Parameter Key:</strong> {{ parameter.key }}</div>
              <div><strong>Value:</strong> {{ parameter.value }}</div>
              <div>
                <strong>Description:</strong> {{ parameter.description }}
              </div>
              <div>
                <strong>Create Date:</strong>
                {{ formatDate(parameter.createdAt.toString()) }}
              </div>
              <div class="parameter-actions">
                <Button
                  label="Edit"
                  class="p-button-rounded p-button-success mr-2"
                  @click="prepareUpdate(parameter)"
                />
                <Button
                  label="Del"
                  class="p-button-rounded p-button-danger"
                  @click="handleDelete(parameter.id)"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="w-full mt-2">
          <Button
            label="Add"
            class="p-button-success"
            @click="setAddingTrue"
            v-if="!adding"
          />
        </div>
      </div>
      <div
        class="col-12"
        v-if="!isMobileScreen || ((adding || editing) && isMobileScreen)"
      >
        <div class="grid nested-grid justify-content-between lg:mt-6 sm:mt-1">
          <div class="sm:col-12 lg:col-9">
            <div class="grid align-items-center mt-3">
              <InputText
                v-model="selectedCountry"
                placeholder="Group"
                disabled
                class="col mb-1"
              />
              <InputText
                v-model="parameter.key"
                placeholder="Key"
                :disabled="editing"
                class="col mb-1"
              />
              <InputText
                v-model="parameter.value"
                placeholder="Value"
                class="col mb-1"
              />
              <InputText
                v-model="parameter.description"
                placeholder="Description"
                class="col mb-1"
              />
            </div>
          </div>
          <div class="lg:col-3 sm:col-12">
            <div
              class="grid justify-content-end align-items-center mt-3 lg:mr-3"
            >
              <Button
                label="Add"
                class="p-button-success"
                @click="handleAdd"
                v-if="!editing"
              />
              <Button
                label="Update"
                class="p-button-success"
                @click="handleUpdate"
                v-if="editing"
              />
              <Button
                label="Cancel"
                class="p-button-secondary"
                @click="cancelEdit"
                v-if="editing"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  width: 50vw;
  height: 100vh;
}

.logout {
  position: absolute;
  top: 20px;
  right: 120px;
  padding: 10px 20px;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.logo {
  position: absolute;
  top: 20px;
  left: 120px;
}

.mobile-only {
  display: none;
}

.desktop-only {
  display: block;
}

@media (max-width: 768px) {
  /* Styles for mobile devices */
  .container {
    width: 100%;
  }

  .logout {
    right: 40px;
  }

  .logo {
    left: 40px;
  }

  .mobile-only {
    display: block;
  }

  .desktop-only {
    display: none;
  }

  .parameters-container {
    padding: 2%;
    overflow-y: auto; /* Ensure no vertical overflow */
  }

  .cards-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
    align-items: flex-start;
  }

  .parameter-card {
    background-color: #1e1e2d;
    color: white;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 16px;
    width: 300px;
    box-sizing: border-box; /* Include padding and border in width */
    flex-grow: 1; /* Allow cards to grow to fill space */
  }

  .parameter-actions {
    display: flex;
    justify-content: center;
    margin-top: 12px;
  }

  .parameter-actions .p-button {
    margin-right: 8px;
  }

  html,
  body {
    margin: 0;
    padding: 0;
    height: 100%;
    overflow-x: hidden; /* Prevent horizontal scroll */
  }

  body {
    display: flex;
    flex-direction: column;
  }

  .parameters-container {
    width: 100%;
    padding: 0;
    margin: 0;
    flex-grow: 1; /* Ensure it takes up remaining space */
  }
}
</style>
