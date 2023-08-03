<template>
  <div class="plugin-card">
    <Card v-if="isExistPrivilege('ROLE_TASK_HISTORY')">
        <template #title>
            <div class="p-d-flex p-jc-between">
                <div style="font-size:15px;">
                    {{ $t("computer.task_history.header") }}
                </div>
                <div>
                    <Button
                        icon="fa fa-history"
                        class="p-button-sm"
                        :title="$t('computer.task_history.list_task_history')"
                        @click.prevent="getTaskHistory"
                    >
                    </Button>
                </div>
            </div>
            <hr style="margin-bottom:-5px">
        </template>
      <template #content>
        <div class="p-grid p-flex-column">
          <DataTable :value="taskList" class="p-datatable-sm p-col"
            :paginator="true" :rows="10" ref="dt"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" 
            :rowsPerPageOptions="[10,25,50,100,500,1000]"  style="margin-top: 2em"
            v-model:filters="filters"
            responsiveLayout="scroll" :loading="loading"
          >
            <template #header>
                <div class="p-d-flex p-jc-between">
                    <div style="text-align: left">
                        <Button v-if="taskList.length > 0"
                            class="p-button-sm" icon="pi pi-download"
                            :label="$t('computer.task_history.export')"
                            @click="exportCSV($event)">
                        </Button>
                    </div>
                    <div class="p-d-flex p-jc-end">
                        <span class="p-input-icon-left">
                        <i class="pi pi-search" />
                        <InputText 
                            v-model="filters['global'].value" 
                            class="p-inputtext-sm" 
                            :placeholder="$t('computer.task_history.search')" 
                        />
                        </span>
                    </div>
                </div>
            </template>
              <template #empty>
              <div class="p-d-flex p-jc-center">
                <span>{{$t('computer.task_history.table_task_history_empty_message')}}</span>
              </div>
              </template>
              <Column field="index" header="#"></Column>
              <Column field="pluginName" :header="$t('computer.task_history.task_name')"></Column>
              <Column field="responseCode" :header="$t('computer.task_history.result')">
                <template #body="slotProps">
                    <Badge v-if="slotProps.data.responseCode == 'TASK_PROCESSED'" 
                        :value="$t('computer.task_history.successful')" 
                        severity="success">
                    </Badge>
                    <Badge v-if="slotProps.data.responseCode == 'TASK_ERROR'"
                        :value="$t('computer.task_history.failure')" 
                        severity="danger">
                    </Badge>
                    <Badge v-if="slotProps.data.responseCode == null" 
                        :value="$t('computer.task_history.sent')" 
                        severity="warning">
                    </Badge>
                </template>
              </Column>
              <Column field="commandOwnerUid" :header="$t('computer.task_history.sender')"></Column>
              <Column field="createdDate" :header="$t('computer.task_history.created_date')"></Column>
              <Column field="executionDate" :header="$t('computer.task_history.execution_date')"></Column>
              <Column :exportable="false">
                    <template #body="slotProps">
                        <div class="p-d-flex p-jc-end">
                            <Button
                                class="p-button-sm p-button-rounded"
                                icon="pi pi-list"
                                :title="$t('computer.task_history.task_detail')"
                                @click.prevent="executedTaskDetail(slotProps.data)">
                            </Button>
                        </div>
                    </template>
                </Column>
          </DataTable>
        </div>
      </template>
      </Card>
      <Dialog 
        :header="$t('computer.task_history.selected_task_detail')" 
        :modal="true"
        :style="{ width: '40vw'}"
        v-model:visible="selectedTaskDetailDialog" >
            <div class="p-grid">
                <div class="p-col-4"><b>{{$t('computer.task_history.command_id')}}</b></div>
                <div class="p-col-8">{{ selectedTask.commandClsId }}</div>
                <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
                <div class="p-col-4"><b>{{$t('computer.task_history.result')}}</b></div>
                <div class="p-col-8">
                    <Badge v-if="selectedTask.responseCode == 'TASK_PROCESSED'" 
                        :value="$t('computer.task_history.successful')" 
                        severity="success">
                    </Badge>
                    <Badge v-if="selectedTask.responseCode == 'TASK_ERROR'"
                        :value="$t('computer.task_history.failure')" 
                        severity="danger">
                    </Badge>
                    <Badge v-if="selectedTask.responseCode == null" 
                        :value="$t('computer.task_history.sent')" 
                        severity="warning">
                    </Badge>
                </div>
                <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
                <div class="p-col-4"><b>{{ $t('computer.task_history.created_date') }}</b></div>
                <div class="p-col-8">{{ selectedTask.createdDate }}</div>
                <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
                <div class="p-col-4"><b>{{$t('computer.task_history.execution_date')}}</b></div>
                <div class="p-col-8">{{ selectedTask.executionDate }}</div>
                <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
            </div>

            <h5>{{ $t('computer.task_history.task_parameters') }}</h5>
            <div class="p-grid" v-for="(value, key) in selectedParam" :key="key">
                <div class="p-col-4"><b>{{ key }}</b></div>
                <div v-if="key == 'password' || key == 'RootPassword' || key == 'admin-password' || key == 'admin_password'" 
                    class="p-col-8">******</div>
                <div v-else class="p-col-8">{{ value }}</div>
                <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
            </div>
            
            <h5 v-if="selectedTask.commandExeResultId">{{ $t('computer.task_history.data_saved') }}</h5>
            <div v-if="selectedTask.commandExeResultId">
                <div class="p-grid">
                    <div class="p-col-4"><b>{{ $t('computer.task_history.response_message_from_agent') }}</b></div>
                    <div class="p-col-8">{{ selectedTask.taskObject.commandExecutions[0].commandExecutionResults[0].responseMessage }}</div>
                    <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
                </div>
                <div class="p-grid" v-for="(value, key) in responseDataObj" :key="key">
                    <div class="p-col-4"><b>{{ key }}</b></div>
                    <div class="p-col-8">{{ value }}</div>
                    <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
                </div>
            </div>
            <template #footer>
                <Button 
                 :label="$t('computer.task_history.close')" 
                 icon="pi pi-times"
                 @click="selectedTaskDetailDialog = false; selectedTask = null;" 
                 class="p-button-text p-button-sm"
                />
            </template>
        </Dialog>
  </div>
</template>

<script>
import { taskService } from "../../../../../services/Task/TaskService.js";
import {FilterMatchMode} from 'primevue/api';
import { mapGetters } from "vuex"
import {roleManagement} from "../../../../../services/Roles/RoleManagement"

/**
 * Get task history of selected agent
 * @see {@link http://www.liderahenk.org/}
 * 
 */

export default {

  created() {
    this.initFilters();
  },

  data() {
    return {
        taskList: [],
        filters: {},
        loading: false,
        selectedTaskDetailDialog: false,
        selectedTask: null,
        selectedParam: null,
        responseDataObj: null,
    }
  },

  computed: {
    ...mapGetters(["selectedLiderNode"]),
  },

  methods: {
    isExistPrivilege(role){
      return roleManagement.isExistRole(role)
    },
    initFilters() {
      this.filters = {
          'global': {value: null, matchMode: FilterMatchMode.CONTAINS}
      }
    },

    async getTaskHistory() {
        this.taskList = [];
        const params = new FormData();
        if (this.selectedLiderNode == null) {
            this.$toast.add({
            severity:'warn', 
            detail: this.$t('computer.task_history.agent_selected_warn'), 
            summary:this.$t("computer.task.toast_summary"), 
            life: 3000
            });
            return;
        }
        this.loading = true;
        params.append("dn", this.selectedLiderNode.distinguishedName);

        const{response,error} = await taskService.commandfindAll(this.selectedLiderNode.distinguishedName);
        if(error){
            this.$toast.add({
                severity:'error', 
                //new  cache message
                detail: this.$t('settings.script_definition.get_scripts_error_message')+ " \n"+error, 
                summary:this.$t("computer.task.toast_summary"), 
                life: 3000
            });
        }
        else{
            if(response.status == 200){
                if (response.data != null) {
                    for (let index = 0; index < response.data.length; index++) {
                        const element = response.data[index];
                        let executionResult = null;
                        let executionDate = null;
                        let commandExeResultId = null;

                        if(element.commandExecutions[0].commandExecutionResults.length > 0) {
                            executionResult = element.commandExecutions[0].commandExecutionResults[0].responseCode;
			    			executionDate = element.commandExecutions[0].commandExecutionResults[0].createDate;
                            commandExeResultId = element.commandExecutions[0].commandExecutionResults[0].id;
                        }
                        this.taskList.push({
                            "taskObject": element,
                            "pluginName": element.task.plugin.name,
                            "commandClsId": element.task.commandClsId,
                            "createdDate": element.task.createDate,
                            "executionDate": executionDate,
                            "commandOwnerUid": element.commandOwnerUid,
                            "responseCode": executionResult,
                            "commandExeResultId": commandExeResultId,
                            "taskId": element.task.id,
                            "index": index + 1
                        });
                    }
                    this.loading = false;
                }
            }
            else if(response.status == 417){
                this.$toast.add({
                    severity:'error', 
                    detail: this.$t('settings.script_definition.error_417_get_scripts'), 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
            }
        }
    },

    executedTaskDetail(data) {
        this.responseDataObj = null;
        this.selectedTask = data;
        this.selectedParam = data.taskObject.task.parameterMap;
        if (data.commandExeResultId) {
            let responseDataStr = data.taskObject.commandExecutions[0].commandExecutionResults[0].responseDataStr;
            try {
                this.responseDataObj = JSON.parse(responseDataStr);
            } catch (error) {
                console.log("Could not found  task id");
            }
        }
        this.selectedTaskDetailDialog = true;
    },

    exportCSV() {
        this.$refs.dt.exportCSV();
    }
  },
};
</script>

<style lang="scss" scoped>
::v-deep(.p-paginator) {
    .p-paginator-current {
        margin-left: auto;
    }
}

::v-deep(.p-progressbar) {
    height: .5rem;
    background-color: #D8DADC;

    .p-progressbar-value {
        background-color: #607D8B;
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

.plugin-card:hover {
  box-shadow: 0 8px 20px 0 rgba(155, 150, 150, 0.2);
}

.plugin-card{
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  margin-bottom: 10px;
}

</style>
