<template>
  <div>
    <base-plugin
      :pluginUrl="pluginUrl"
      :pluginDescription="pluginDescription"
      :showTaskDialog="showTaskDialog"
      @close-task-dialog="showTaskDialog = false;"
      @task-response="serviceManagementResponse"
      :pluginTask="task"
      :executeTask="executeTask"
    >
      <template #pluginTitle>
        {{ $t("computer.plugins.service_management.header") }}
      </template>
      <template #pluginTitleButton>
        <div>
          <Button
          v-if="services != null && services.length > 0"
          icon="pi pi-caret-right"
          class="p-button-sm p-mr-2"
          :title="$t('computer.plugins.button.run')"
          @click.prevent="sendTaskServiceManagement('SERVICE_LIST')"
          >
          </Button>
          <Button
          icon="pi pi-list"
          class="p-button-sm"
          :title="$t('computer.plugins.service_management.list_services')"
          @click.prevent="sendTaskServiceManagement('GET_SERVICES')"
          >
          </Button>
        </div>
      </template> 
      <template #default>
        <div class="p-grid p-flex-column">
          <DataTable :value="services" class="p-datatable-sm  editable-cells-table p-col"
            v-model:selection="selectedServices" dataKey="id"
            :paginator="true" :rows="10" 
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" 
            :rowsPerPageOptions="[10,25,50,100]"  style="margin-top: 2em"
            v-model:filters="filters"
            responsiveLayout="scroll"
            @rowSelect="onRowSelect" 
            @rowUnselect="onRowUnselect"
          >
            <template #header>
              <div class="p-d-flex p-jc-end">
                <span class="p-input-icon-left">
                  <i class="pi pi-search" />
                  <InputText 
                  v-model="filters['global'].value" 
                  class="p-inputtext-sm" 
                  :placeholder="$t('computer.plugins.service_management.search')" 
                  />
                </span>
              </div>
            </template>
              <template #empty>
              <div class="p-d-flex p-jc-center">
                <span>{{$t('computer.plugins.service_management.table_empty_message')}}</span>
              </div>
              </template>
              <Column selectionMode="multiple" headerStyle="width: 3em"></Column>
              <Column field="serviceName" sortable
                :header="$t('computer.plugins.service_management.service_name')">
              </Column>
              <Column field="serviceStatus" sortable
                :header="$t('computer.plugins.service_management.status')">
                <template #body="slotProps">
                  <Badge
                    :value="slotProps.data.serviceStatus == 'active' || slotProps.data.serviceStatus == 'start'? 
                    $t('computer.plugins.service_management.active'): 
                    $t('computer.plugins.service_management.inactive')" 
                    :severity="slotProps.data.serviceStatus == 'active' || slotProps.data.serviceStatus == 'start'? 'success': 'danger'">
                  </Badge>
                </template>
              </Column>
              <Column field="serviceStatus"
              :exportable="false" 
              :header="$t('computer.plugins.service_management.change')"
              >
                <template #body="slotProps">
                  <Dropdown 
                    v-model="slotProps.data.serviceStatus" 
                    style="min-width: 100%;" 
                    :disabled="slotProps.data.selectDisabled"
                    :options="[{
                      label: $t('computer.plugins.service_management.active'), 
                      value: 'active'
                      },
                      {
                        label: $t('computer.plugins.service_management.inactive'),
                        value: 'inactive'
                      }]"
                    optionLabel="label" 
                    optionValue="value" 
                    :placeholder="$t('computer.plugins.service_management.select')" 
                  />
                </template>
              </Column>
              <Column field="startAuto" sortable
                :header="$t('computer.plugins.service_management.auto_start')">
                <template #body="slotProps">
                  <Badge
                    :value="slotProps.data.startAuto == 'enabled' ? $t('computer.plugins.service_management.enabled'): 
                    $t('computer.plugins.service_management.disabled')" 
                    :severity="slotProps.data.startAuto == 'enabled' ? 'success': 'danger'">
                  </Badge>
                </template>
              </Column>
              <Column field="startAuto"
                :exportable="false" 
                :header="$t('computer.plugins.service_management.change')">
                <template #body="slotProps">
                  <Dropdown 
                    v-model="slotProps.data.startAuto" 
                    style="min-width: 100%;" 
                    :id="slotProps.data.id" 
                    :disabled="slotProps.data.selectDisabled"
                    :options="[{label: $t('computer.plugins.service_management.enabled'), value: 'enabled'},
                    {label: $t('computer.plugins.service_management.disabled'), value: 'disabled'}]"
                    optionLabel="label" 
                    optionValue="value" 
                    :placeholder="$t('computer.plugins.service_management.select')" 
                  />
                </template>
              </Column>
          </DataTable>
          <div class="p-col" v-if="services != null && services.length > 0">
            <Button type="button" 
              :label="$t('computer.plugins.service_management.view_selected_services')" 
              @click="toggle($event)" 
              icon="pi pi-info-circle" 
              class="p-button-sm" 
              :badge="serviceRequestParameters != null && serviceRequestParameters.length > 0 ? serviceRequestParameters.length: '0'" 
              badgeClass="p-badge-danger" />
            <OverlayPanel 
              ref="servicesOp" 
              appendTo="body" 
              :showCloseIcon="false" 
              id="overlay_panel" 
              :style="{width: '30vw'}" 
              :breakpoints="{'960px': '75vw'}"
            >
              <h5 class="text-center">{{$t('computer.plugins.service_management.selected_services')}}</h5>
              <DataTable 
                :value="serviceRequestParameters" 
                responsiveLayout="scroll" 
                scrollable="true" 
                scrollHeight="400px" 
                class="p-datatable-sm" 
                :metaKeySelection="false"
              >
                <Column field="serviceName" :header="$t('computer.plugins.service_management.service_name')"></Column>
                <Column field="serviceStatus" :header="$t('computer.plugins.service_management.status')">
                  <template #body="slotProps">
                    <Badge
                      :value="slotProps.data.serviceStatus == 'active' ? $t('computer.plugins.service_management.active'): 
                      $t('computer.plugins.service_management.inactive')" 
                      :severity="slotProps.data.serviceStatus == 'active' ? 'success': 'danger'">
                    </Badge>
                  </template>
                </Column>
                <Column field="startAuto" :header="$t('computer.plugins.service_management.auto_start')">
                  <template #body="slotProps">
                    <Badge
                      :value="slotProps.data.startAuto == 'enabled' ? $t('computer.plugins.service_management.enabled'): 
                      $t('computer.plugins.service_management.disabled')" 
                      :severity="slotProps.data.startAuto == 'enabled' ? 'success': 'danger'">
                    </Badge>
                  </template>
                </Column>
              </DataTable>
            </OverlayPanel>
          </div>
        </div>
      </template>
      <template #pluginFooter>
      </template>
    </base-plugin>
  </div>
</template>

<script>
import { taskService } from "../../../../../services/Task/TaskService.js";
import {FilterMatchMode} from 'primevue/api';
/**
 * Allows to list, active, inactive, enabled and disabled services on client
 * commandId: GET_SERVICES, SERVICE_LIST
 * @see {@link http://www.liderahenk.org/}
 * 
 */

export default {
  props: {
    pluginTask: {
      type: Object,
      description: "Plugin task object",
    },
  },

  created() {
    this.task = {...this.pluginTask};
    this.initFilters();
    this.originalRows = {};
  },

  data() {
    return {
      task: null,
      showTaskDialog: false,
      executeTask: false,
      services: [],
      selectedServices: null,
      filters: {},
      serviceRequestParameters: [],
      pluginDescription: this.$t('computer.plugins.service_management.description'),
      pluginUrl: "https://docs.liderahenk.org/lider3.0/computerManagement/computerManagement/serviceManagement/",
    }
  },

  methods: {
    initFilters() {
      this.filters = {
          'global': {value: null, matchMode: FilterMatchMode.CONTAINS}
      }
    },

    isExistService(data){
      var isExist = false;
      if (this.serviceRequestParameters.length > 0) {
        for (let index = 0; index < this.serviceRequestParameters.length; index++) {
          if (this.serviceRequestParameters[index].serviceName == data.serviceName) {
            isExist = true;
          }
        }
      }
      return isExist;
    },

    sendTaskServiceManagement(commandId){
        this.task.commandId = commandId;
        if (commandId == "GET_SERVICES") {
            this.task.parameterMap = {};
            this.showTaskDialog = true;
        } else {
          if (this.serviceRequestParameters.length != null && this.serviceRequestParameters.length > 0) {
            this.task.parameterMap = {
              "serviceRequestParameters": this.serviceRequestParameters
            };
            this.showTaskDialog = true;
          } else {
            this.$toast.add({
              severity:'warn', 
              detail: this.$t('computer.plugins.service_management.send_task_warning'), 
              summary:this.$t("computer.task.toast_summary"), 
              life: 3000
            })
          }
        }
    },

    async serviceManagementResponse(message) {
        if (message.commandClsId == "GET_SERVICES") {
            const params = new FormData();
            params.append("id", message.result.id);

            const{response,error} = await taskService.commandExecute(message.result.id);
            if(error){
              this.$toast.add({
                severity:'error', 
                detail: this.$t('computer.plugins.service_management.get_service_error_message')+ " \n"+error, 
                summary:this.$t("computer.task.toast_summary"), 
                life: 3000
              });
            }
            else{
                if(response.status == 200){
                  if (response.data != null) {
                    this.selectedServices = null;
                    let arrg = JSON.parse(response.data.responseDataStr);
                    this.services = arrg["service_list"]
                    for (let index = 0; index < this.services.length; index++) {
                      const element = this.services[index];
                      element.id = index + 1;
                      element.selectDisabled = true;
                    }
                    if (this.selectedServices != null) {
                      this.selectedServices = null;
                    }
                  }
                }
                else if(response.status == 417){
                  this.$toast.add({
                    severity:'error', 
                    detail: this.$t('computer.plugins.service_management.error_417_get_service'), 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                  });
              }
            }
      }
      if (message.commandClsId == "SERVICE_LIST") {
        if (message.result.responseCode == "TASK_PROCESSED") {
          let arrg = JSON.parse(message.result.responseDataStr);
          for (let index = 0; index < arrg['service_list'].length; index++) {
            const element = arrg['service_list'][index];
            this.updateStatusService(element);
          }
        }
      }
    },

    updateStatusService(data) {
      if (this.isExistService(data)) {
        for (let index = 0; index < this.serviceRequestParameters.length; index++) {
          const element = this.serviceRequestParameters[index];
          element.serviceStatus = data.serviceStatus;
          element.startAuto = data.startAuto;
        }
      }
    },

    onRowSelect(event) {
      if (event.data.serviceName.startsWith("ahenk")) {
        event.data.selectDisabled = true;
          for (let index = 0; index < this.selectedServices.length; index++) {
          const element = this.selectedServices[index];
          if (event.data.serviceName === element.serviceName && event.data.id === element.id) {
            this.selectedServices.splice(index, 1);
          }
        }
        this.$toast.add({
          severity:'warn', 
          detail: this.$t('computer.plugins.service_management.selected_service_warning'), 
          summary:this.$t("computer.task.toast_summary"), 
          life: 3000
        })
      } else {
        event.data.selectDisabled = false;
      }
    },

    onRowUnselect(event) {
      event.data.selectDisabled = true;
    },

    toggle(event) {
      this.$refs.servicesOp.toggle(event);
    },
  },

  watch: {
    selectedServices: {
      handler(){
        this.serviceRequestParameters = this.selectedServices;
     },
     deep: true,
    },
  }
};
</script>

<style lang="scss" scoped>
::v-deep(.p-paginator) {
    .p-paginator-current {
        margin-left: auto;
    }
}

::v-deep(.p-datatable.p-datatable-customers) {
    .p-paginator {
        padding: 1rem;
    }
}

::v-deep(.p-datatable .p-column-header-content) {
  .p-checkbox .p-checkbox-box{
    display: none !important
  }
}

::v-deep(.p-datatable .p-column-header-content) {
  pointer-events: none;
}

</style>
