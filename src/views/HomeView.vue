<script setup lang="ts">
import { formatDate } from "@/helper/format";
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

  resetForm();
  fetchParameters();
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
  <Button
    label="Logout"
    icon="pi pi-sign-out"
    class="logout p-button-danger"
    @click="handleLogout"
  />
  <div class="grid nested-grid align-items-center" style="width: 50vw">
    <div class="col-3">
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
    <div class="card w-full">
      <div class="col-12">
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
      <div class="col-12">
        <div class="grid justify-content-between">
          <div>
            <InputText
              v-model="selectedCountry"
              placeholder="Group"
              disabled
              style="width: 6rem"
              class="mr-1 ml-2"
            />
            <InputText
              v-model="parameter.key"
              placeholder="Key"
              style="width: 12rem"
              class="mr-1"
              :disabled="editing"
            />
            <InputText
              v-model="parameter.value"
              placeholder="Value"
              style="width: 12rem"
              class="mr-1"
            />
            <InputText
              v-model="parameter.description"
              placeholder="Description"
              style="width: 16rem"
              class="mr-1"
            />
          </div>
          <div>
            <Button
              label="Add"
              class="p-button-success mr-4"
              @click="handleAdd"
              v-if="!editing"
            />
            <Button
              label="Update"
              class="p-button-success mr-4"
              @click="handleUpdate"
              v-if="editing"
            />
            <Button
              label="Cancel"
              class="p-button-secondary mr-4"
              @click="cancelEdit"
              v-if="editing"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
</style>
