<template>
    <base-scheduled v-if="showScheduled"
      @close-scheduled="showScheduled = false" 
      @save-scheduled="updateScheduledTask"
      :showScheduled="showScheduled">
    </base-scheduled>
    <Panel :toggleable="true" class="p-m-3">
      <template #header>
        <h4 class="p-pt-2">{{$t('reports.scheduled_task_report.scheduled_active_task')}}</h4>
      </template>
      <div class="p-fluid p-formgrid p-grid">
        
        <div class="p-field p-col-12 p-lg-4 p-md-6 p-sm-12">
          <label for="inputRegistrationDate">{{$t('reports.scheduled_task_report.posted_date')}}</label>
          <Calendar
            v-model="filter.taskSendDate"
            selectionMode="range"
            :showButtonBar="true"
            :numberOfMonths="2"
            dateFormat="dd/mm/yy"
            :showIcon="true"
            :hideOnDateTimeSelect="true"
            :manualInput="false"
            @clear-click="clearCalendar"
          /> 
        </div>
        <div class="p-field p-col-12 p-lg-4 p-md-6 p-sm-12">
          <label for="inputStatus">{{$t('reports.scheduled_task_report.task')}}</label>
          <Dropdown
            v-model="filter.task"
            :options="plugins"
            optionLabel="name"
            optionValue="commandId"
            :filter="true" 
            showClear="true"
          />
        </div>
        <div class="p-field p-col-12 p-text-right">
          <div class="p-d-flex p-jc-end">
            <div>
              <Button
                :label="$t('reports.scheduled_task_report.clear')"
                icon="fas fa-backspace"
                @click="clearFilterFields"
              />        
          </div>
            <div class="p-ml-2">
              <Button
              :label="$t('reports.scheduled_task_report.search')" 
              icon="fas fa-search" 
              @click="filterAgents" />
            </div>
          </div>
        </div>
      </div>
    </Panel>
    <Card class="p-m-3 p-mb-7">
      <template #content>
        <DataTable :value="tasks" responsiveLayout="scroll" dataKey="id" :loading="loading" >
          <template #empty>
            <div class="p-d-flex p-jc-center">
              {{$t('reports.scheduled_task_report.scheduled_task_doesnt_exist')}}
            </div>
          </template>
          <template #loading>
            {{$t('reports.scheduled_task_report.loading')}}...
          </template>
          <Column header="#">
            <template #body="{index}">
              <span>{{ ((pageNumber - 1)*rowNumber) + index + 1 }}</span>
            </template>
          </Column>
          <Column field="task.plugin.description" :header="$t('reports.scheduled_task_report.plugin')"></Column>
          <Column :header="$t('reports.scheduled_task_report.task')">
            <template #body="{ data }">
              {{ getTaskName(data)}}
            </template>
          </Column>
          <Column field="createDate" :header="$t('reports.scheduled_task_report.create_date')">
          </Column>
          <Column field="commandOwnerUid" :header="$t('reports.scheduled_task_report.sender')">
          </Column>
          <Column :header="$t('reports.scheduled_task_report.total')">
            <template #body="{ data }">
              {{ data.uidList.length }}
            </template>
          </Column>
          <Column :header="$t('reports.scheduled_task_report.successful')">
            <template #body="{ data }">
              {{ data.successfullTaskCount }}
            </template>
          </Column>
          <Column :header="$t('reports.scheduled_task_report.waiting')">
            <template #body="{ data }">
              {{ data.waitingTaskCount }}
            </template>
          </Column>
          <Column :header="$t('reports.scheduled_task_report.error')">
              <template #body="{ data }">
                  {{ data.failedTaskCount }}
              </template>
          </Column>
          <Column :header="$t('reports.scheduled_task_report.status')">
              <template #body="{data}">
                <Badge 
                    :value="data.task.deleted ? $t('reports.scheduled_task_report.passive'): $t('reports.scheduled_task_report.active')" 
                    :severity="data.task.deleted ? 'danger': 'success'">
                </Badge>
              </template>
          </Column>
          <Column>
            <template #body="{ data }">
              <div class="p-d-flex p-jc-end">
                <div>
                   
                  <Button :disabled="data.task.deleted"
                    class="p-button-sm p-button-warning p-button-rounded p-mr-2 "
                    icon="pi pi-pencil"
                    v-tooltip.bottom="$t('reports.scheduled_task_report.edit')"
                    @click="showTaskDetailDialog(data.id); showScheduled = true;"
                  />
                  <Button :disabled="data.task.deleted"
                    class="p-button-sm p-button-danger p-button-rounded p-mr-2 "
                    icon="pi pi-times"
                    v-tooltip.bottom="$t('reports.scheduled_task_report.cancel')"
                    @click="showTaskDetailDialog(data.id); cancelScheduledTaskDialog = true;"
                  />
                  <Button
                    class="p-button-sm p-button-rounded"
                    icon="pi pi-list"
                    v-tooltip.bottom="$t('reports.scheduled_task_report.show_details')"
                    @click="showTaskDetailDialog(data.id); this.scheduledTaskDetailDialog = true;"
                  />                  
                </div>
              </div>
            </template>
          </Column>
        </DataTable>
        <Paginator
          ref="paging"
          :first="offset"
          :rows="10"
          :totalRecords="totalElements"
          :rowsPerPageOptions="[10, 25, 50, 100]"
          @page="onPage($event)"
        >
          <template> {{$t('reports.scheduled_task_report.total_result')}} : {{ totalElements }} </template>
        </Paginator>
      </template>
    </Card>


    <!-- Agent List Dialog -->
    <Dialog
    v-model:visible="agentListDialog"
    :breakpoints="{ '900px': '75vw', '600px': '100vw' }"
    :style="{ width: '50vw' }"
    >
      <template #header>
        <h3>{{$t('reports.task_report.task_sent_ahenk_list')}}</h3>
      </template>
      
      <DataTable :value="selectedCommand.commandExecutions" responsiveLayout="scroll" dataKey="id" :loading="loading" class="p-datatable-sm"
         :paginator="true" :rows="10" ref="dt"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" 
        :rowsPerPageOptions="[10,25,50,100,500,1000]"  style="margin-top: 2em"
        v-model:filters="filters">
        <template #header>
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
        </template>
          <Column field="uid" :header="$t('reports.task_report.computer_name')">
            <template #body="{ data }">
              {{ data.uid }}
            </template>
          </Column>
          <Column field="createDate" :header="$t('reports.task_report.posted_date')">
            <template #body="{ data }">
              {{ data.createDate }}
            </template>
          </Column>
          <Column :header="$t('reports.task_report.execution_date')">
            <template #body="{data}">
                  {{
                      data.commandExecutionResults.length > 0 ? 
                      data.commandExecutionResults[0].createDate : ''
                  }}
              </template>
          </Column>
          <Column :header="$t('reports.task_report.results')">
            <template #body="{data}">
              <Button
                v-if="data.commandExecutionResults.length > 0 && data.commandExecutionResults[0].responseCode == 'TASK_PROCESSED'"
                :label="$t('reports.task_report.successful')" class="p-button-success p-button-sm p-button-rounded"
              ></Button>
              <Button
                v-else-if="data.commandExecutionResults.length > 0 && data.commandExecutionResults[0].responseCode != 'TASK_PROCESSED'"
                :label="$t('reports.task_report.error')" class="p-button-danger p-button-sm p-button-rounded"
              ></Button>
              <Button
                v-else
                :label="$t('reports.task_report.waiting')" class="p-button-warning p-button-sm p-button-rounded"
              ></Button>
            </template>
          </Column>
          <Column :header="$t('reports.task_report.answer')">
            <template #body="{ data }">
              <div class="p-d-flex p-jc-end">
                <div>
                  <Button
                    class="p-button-sm p-button-raised p-button-rounded"
                    icon="pi pi-list"
                    v-tooltip.left="$t('reports.task_report.selected_task_detail')"
                    @click="showTaskExecutionsResultDialog(data.id)"
                  />
                </div>
              </div>
            </template>
          </Column>
      </DataTable>
      
      <template #footer>
        <Button
          :label="$t('reports.task_report.close')"
          icon="pi pi-times"
          class="p-button-text"
          @click="agentListDialog = false"
        />
      </template>
    </Dialog >

    <Dialog
      v-model:visible="scheduledTaskDetailDialog"
      :style="{ width: '40vw' }"
      :modal="true"
      :header="$t('reports.scheduled_task_report.selected_scheduled_task_details')"
    >
      <div class="p-grid">
        <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
        <div class="p-col-4"><b>{{$t('reports.scheduled_task_report.task')}}</b></div>
        <div class="p-col-8">
          {{ selectedCommand.task.plugin.description }}
        </div>


        <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
        <div class="p-col-4"><b>{{$t('reports.scheduled_task_report.status')}}</b></div>
        <div class="p-col-8">
          <Badge 
              :value="selectedCommand.task.deleted ? $t('reports.scheduled_task_report.passive'): $t('reports.scheduled_task_report.active')" 
              :severity="selectedCommand.task.deleted ? 'danger': 'success'">
          </Badge>
        </div>


        <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
        <div class="p-col-4"><b>{{$t('reports.scheduled_task_report.task_id')}}</b></div>
        <div class="p-col-8">
          {{ selectedCommand.task.id }}
        </div>


        <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
        <div class="p-col-4"><b>{{$t('reports.scheduled_task_report.create_date')}}</b></div>
        <div class="p-col-8">
          {{ selectedCommand.createDate }}
        </div>


        <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
        <div class="p-col-4"><b>{{$t('reports.scheduled_task_report.update_date')}}</b></div>
        <div class="p-col-8">
          {{ selectedCommand.task.modifyDate }}
        </div>


        <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
        <div class="p-col-4"><b>{{$t('reports.scheduled_task_report.sender')}}</b></div>
        <div class="p-col-8">
          {{ selectedCommand.commandOwnerUid }}
        </div>


        <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
        <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
        <div class="p-col-4"><b>{{$t('reports.scheduled_task_report.scheduled_task_parameters')}}</b></div>
        <div class="p-col-8">
          {{ selectedCommand.task.cronExpression }}
        </div>


        <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
      </div>
       <template #footer>
        <Button
          :label="$t('reports.scheduled_task_report.close')"
          icon="pi pi-times"
          class="p-button-sm p-button-text"
          @click="scheduledTaskDetailDialog = false"
        />
        <Button
          :label="$t('reports.scheduled_task_report.agents')"
          class="p-button-sm p-button-rounded p-mr-2"
          icon="pi pi-desktop"
          @click="this.agentListDialog = true;"
        /> 
      </template>
    </Dialog>

    <Dialog :header="$t('reports.scheduled_task_report.cancel_scheduled_task')" 
      v-model:visible="cancelScheduledTaskDialog" 
      :style="{width: '20vw'}" :modal="true">
      <div class="p-fluid">
          <i class="pi pi-info-circle p-mr-3" style="font-size: 1.5rem" />
          <span>
            {{$t('reports.scheduled_task_report.scheduled_task_will_be_canceled_are_you_sure')}}
          </span>
      </div>
      <template #footer>
          <Button :label="$t('reports.scheduled_task_report.cancel')" icon="pi pi-times" 
              @click="cancelScheduledTaskDialog = false" class="p-button-text p-button-sm"
          />
          <Button :label="$t('reports.scheduled_task_report.yes')" icon="pi pi-check"
              @click="cancelScheduledTask" class="p-button-sm" :disabled="cancelScheduledTaskLoading"
          />
          <div v-if="cancelScheduledTaskLoading">
            <div class="p-text-center">
              <ProgressSpinner
                style="width: 20px; height: 20px"
                strokeWidth="8"
                fill="var(--surface-ground)"
                animationDuration=".5s"
              />
              <a class="primary">
                &nbsp;{{$t('computer.plugins.base_plugin.scheduled_loading_default_text')}}
              </a>
            </div>
          </div>
      </template>
    </Dialog>

    <!-- Task Detail Dialog -->
    <Dialog
    v-model:visible="taskExecutionsResultDialog"
    :breakpoints="{ '960px': '75vw', '640px': '100vw' }"
    :style="{ width: '50vw' }"
    >
    <template #header>
      <h3>{{$t('reports.task_report.selected_task_detail')}}</h3>
    </template>

    <h4>{{$t('reports.task_report.detail')}}</h4>

    <div class="p-grid">
      <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
      <div class="p-col-4"><b>{{$t('reports.task_report.task_name')}}</b></div>
      <div class="p-col-8">
        {{ selectedCommand.task.plugin.description }}
      </div>
      <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
      <div class="p-col-4"><b>{{$t('reports.task_report.execution_result')}}</b></div>
      <div class="p-col-8" v-if="selectedTaskExecutionResult.commandExecutionResults.length == 0">
          {{$t('reports.task_report.waiting')}}
      </div>
      <div class="p-col-8" v-else> 
        {{ selectedTaskExecutionResult.commandExecutionResults.length > 0 && 
          selectedTaskExecutionResult.commandExecutionResults[0].responseCode == "TASK_PROCESSED" ? $t('reports.task_report.successful') : $t('reports.task_report.error') }}
      </div>
      <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
      <div class="p-col-4"><b>{{$t('reports.task_report.create_date')}}</b></div>
      <div class="p-col-8">
        {{ selectedCommand.createDate }}
      </div>
      <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
      <div class="p-col-4"><b>{{$t('reports.task_report.execution_date')}}</b></div>
      <div class="p-col-8">
        {{ selectedTaskExecutionResult.createDate }}
      </div>
      <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
    </div>
    <h4>{{$t('reports.task_report.sended_task_parameter')}}</h4>
    <div class="p-grid">
      <template v-for="(parameterKey, index) in Object.keys(selectedCommand.task.parameterMap)" :key="index + 'param' " >
        <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
        <div class="p-col-4"><b>{{ parameterKey }}</b></div>
        <div v-if="parameterKey == 'password' || parameterKey == 'RootPassword' || parameterKey == 'admin-password' || parameterKey == 'admin_password'" 
            class="p-col-8">******</div>
        <div v-else class="p-col-8">{{ value }}</div>
      </template>
    </div>

    <div class="p-grid" v-for="(value, key) in selectedParam" :key="key">
      <div class="p-col-4"><b>{{ key }}</b></div>
      <div v-if="key == 'password' || key == 'RootPassword' || key == 'admin-password' || key == 'admin_password'" 
          class="p-col-8">******</div>
      <div v-else class="p-col-8">{{ value }}</div>
      <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
    </div>

    <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
    <h4>{{$t('reports.task_report.data_saved_as_a_result_of_task_execution')}}</h4>

    <div class="p-grid" v-if="selectedTaskExecutionResult.commandExecutionResults && selectedTaskExecutionResult.commandExecutionResults.length > 0">
      <template v-if="selectedTaskExecutionResult.commandExecutionResults[0].responseDataStr != 'null' ">
         <template v-for="(parameterKey, index) in Object.keys(JSON.parse(selectedTaskExecutionResult.commandExecutionResults[0].responseDataStr))" :key="index + 'param' " >
            <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
            <div class="p-col-4"><b>{{ parameterKey }}</b></div>
            <div class="p-col-8" >
              {{ JSON.parse(selectedTaskExecutionResult.commandExecutionResults[0].responseDataStr)[parameterKey] }}
            </div>
        </template>
      </template>
       <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
        <div class="p-col-4"><b>{{$t('reports.task_report.message_from_ahenk')}}</b></div>
        <div class="p-col-8">
          {{ selectedTaskExecutionResult.commandExecutionResults[0].responseMessage }}
        </div>
        <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
     </div>
     <template #footer>
      <Button
        :label="$t('reports.task_report.close')"
        icon="pi pi-times"
        class="p-button-text"
        @click="taskExecutionsResultDialog = false"
      />
      </template>
    </Dialog>
  </template>
  
  <script>
  
  /**
   * Scheduled task report. Update and cancel scheduled task with this page
   * @see {@link http://www.liderahenk.org/}
   */
  
  import {FilterMatchMode} from 'primevue/api';
  import moment from "moment";
  import { scheduledTaskReportService } from "../../services/Reports/ScheduledTaskReportService.js";
  
  export default {

    data() {
      return {
        tasks: [],
        totalElements: 0,
        showedTotalElementCount: 10,
        currentPage: 1,
        offset: 1,
        loading: false,
        getFilterData: true,
        taskDetailDialog: false,
        agentListDialog: false,
        scheduledTaskDetailDialog: false,
        selectedCommand: null,
        plugins:[],
        showScheduled: false,
        taskExecutionsResultDialog: false,
        selectedTaskExecutionResult: null,
        cancelScheduledTaskDialog: false,
        cancelScheduledTaskLoading:false,
        filter: {
          taskSendDate: '',
          taskSendStartDate:'',
          taskSendEndDate:'',
          task:null
        },
        filters: {
          'global': {value: null, matchMode: FilterMatchMode.CONTAINS}
        },
        pageNumber: 1,
        rowNumber: 10,
      };
    },
  
    mounted() {
      this.getTasks();
      this.getPlugins();
    },
  
    methods: {

      showTaskDetailDialog(taskId) {
        this.selectedCommand = this.tasks.filter(
          (task) => task.id === taskId
        )[0];

      },

      showTaskExecutionsResultDialog(id){
        this.selectedTaskExecutionResult = this.selectedCommand.commandExecutions.filter(
          (executionResult) => executionResult.id === id
        )[0];
        this.taskExecutionsResultDialog = true;
      },
  
      async getTasks() {
        this.loading = true;
        this.currentPage = this.pageNumber;
        var data = new FormData();
        data.append("pageNumber", this.pageNumber);
        data.append("pageSize", this.rowNumber);
        data.append("status", false);
        // data.append("startDate", this.filter.taskSendStartDate);
        // data.append("endDate", this.filter.taskSendEndDate);
        if(this.filter.task != null) {
          data.append("taskCommand", this.filter.task);
        }
        if (this.pageNumber == 1) {
          data.append("getFilterData", true);
        }
        if (this.filter.taskSendDate && this.filter.taskSendDate[0] != null) {
          data.append(
            "startDate",
            moment(this.filter.taskSendDate[0])
              .set("hour", 0)
              .set("minute", 0)
              .set("second", 0)
              .format("DD/MM/YYYY HH:mm:ss")
          );
        }
        
        if (this.filter.taskSendDate && this.filter.taskSendDate[1] != null) {
          data.append(
            "endDate",
            moment(this.filter.taskSendDate[1])
              .set("hour", 0)
              .set("minute", 0)
              .set("second", 0)
              .format("DD/MM/YYYY HH:mm:ss")
          );
        }
  
        const {response, error} = await scheduledTaskReportService.scheduledTaskList(data)
        if (error) { 
              this.$toast.add({
                severity:'error',
                detail: this.$t('reports.scheduled_task_report.error_scheduled_task'),
                summary: this.$t("computer.task.toast_summary"),
                life:3600
              });
        } else {
          if(response.status == 200){
            this.tasks = response.data.content;
            this.totalElements = response.data.totalElements;
            this.loading = false;
            let successfullTaskCount = 0;
            let failedTaskCount = 0;
            this.tasks = this.tasks.map( task => {
              task.commandExecutions.map( commandExecution => {
                if(commandExecution.commandExecutionResults != null && commandExecution.commandExecutionResults.length != 0) {
                  if(commandExecution.commandExecutionResults[0].responseCode == "TASK_PROCESSED") {
                    successfullTaskCount++;
                  }
                  if(commandExecution.commandExecutionResults[0].responseCode == "TASK_ERROR") {
                    failedTaskCount++
                  }
                }
              },[successfullTaskCount, failedTaskCount]);
              task.successfullTaskCount = successfullTaskCount;
              task.failedTaskCount = failedTaskCount;
              task.waitingTaskCount = task.uidList.length - successfullTaskCount - failedTaskCount;
              successfullTaskCount = 0;
              failedTaskCount = 0;
              return task;
            }, [successfullTaskCount, failedTaskCount]);
          } else if (response.status == 417 ){
            this.$toast.add({
              severity:'error',
              detail: this.$t('reports.scheduled_task_report.error_code_417'),
              summary: this.$t("computer.task.toast_summary"),
              life:3600
            });
          }
        }  
      },
      currentPageChange(newCurrentPage) {
        this.loading = true;
        this.getTasks(newCurrentPage);
      },
      onPage(event) {
        this.loading = true;
        this.pageNumber = event.page + 1;
        this.rowNumber = event.rows;
        this.getTasks();
      },
      filterAgents() {
        if (this.filter.taskSendDate && this.filter.taskSendDate[0] != null) {
          this.filter.taskSendStartDate = moment(
            this.filter.taskSendDate[0]
          )
            .set("hour", 0)
            .set("minute", 0)
            .set("second", 0)
            .format("DD/MM/YYYY HH:mm:ss");
        }
        if (this.filter.taskSendDate && this.filter.taskSendDate[1] != null) {
          this.filter.taskSendEndDate = moment(
            this.filter.taskSendDate[1]
          )
            .set("hour", 23)
            .set("minute", 59)
            .set("second", 59)
            .format("DD/MM/YYYY HH:mm:ss");
        }
        this.offset = 0;
        this.$refs.paging.$emit('page', {
          page: 0,
          rows: 10,
          first: 0,
        });
        this.getTasks(this.currentPage, this.showedTotalElementCount);
      },
      async exportToExcel() {
        this.loading = true;
        var data = new FormData();
        if(this.filter.task != null) {
          data.append("taskCommand", this.filter.task);
        }
        if (this.filter.taskSendDate[0] != null) {
          data.append(
            "startDate",
            moment(this.filter.taskSendDate[0])
              .set("hour", 0)
              .set("minute", 0)
              .set("second", 0)
              .format("DD/MM/YYYY HH:mm:ss")
          );
        }
        if (this.filter.taskSendDate[1] != null) {
          data.append(
            "endDate",
            moment(this.filter.taskSendDate[1])
              .set("hour", 0)
              .set("minute", 0)
              .set("second", 0)
              .format("DD/MM/YYYY HH:mm:ss")
          );
        }
        let responseType = {
            responseType: 'blob'
          }
  
        const {response, error} = await scheduledTaskReportService.scheduledTaskExport(data,responseType)
        if(error){
              this.$toast.add({
              severity:'error',
              detail:this.$t("reports.scheduled_task_report.error_scheduled_task_export"),
              summary:this.$t("computer.task.toast_summary"),
              life:3600
            });
        }else{
            if(response.status == 200){
                let blob = new Blob([response.data]);
                let link = document.createElement("a");
                link.href = window.URL.createObjectURL(blob);
                link.download = "Scheduled_Tasks_Report.xlsx";
                this.loading = false;
                link.click();
            }
            else if(response.status == 400){
              this.$toast.add({
              severity:'error',
              detail: this.$t('reports.scheduled_task_report.error_code_400'),
              summary: this.$t("computer.task.toast_summary"),
              life:3600
            });
            }
        }        
      },
      clearCalendar() {
        this.filter.taskSendDate = "";
        this.filter.taskSendStartDate = "";
        this.filter.taskSendEndDate = "";
      },
  
      clearFilterFields() {
        this.filter = {
          taskSendDate: '',
          taskSendStartDate:'',
          taskSendEndDate:'',
          task:null
        };
      },
  
      async getPlugins(){
        const { response, error } = await scheduledTaskReportService.scheduledTaskPlugins();
        if (error){
          this.$toast.add({
            severity:'error',
            detail: this.$t('reports.scheduled_task_report.error_scheduled_task_plugins'),
            summary:this.$t("computer.task.toast_summary"),
            life:3600
          });        
        } else {
          if(response.status == 200){
            this.plugins = response.data;
          }
          else if(response.status == 417){
            this.$toast.add({
              severity:'error',
              detail:this.$t('reports.scheduled_task_report.error_code_plugins_417'),
              summary:this.$t("computer.task.toast_summary"),
              life:3600
          });        
          }
        }                            
      },
  
      getTaskName(data) {
        if (data != null && data.task != null && data.task != '') {
          let plugin =  this.plugins.find(plugin => plugin.commandId === data.task.commandClsId );
          if (plugin != null) {
            return plugin.name
          }
          return '';
        } else {
          return ''
        }
      },
  
      async updateScheduledTask(scheduledParam) {
        var params = new FormData();
        params.append("id", this.selectedCommand.id);
        params.append("cronExpression", scheduledParam);
        const { response, error} = await  scheduledTaskReportService.scheduledTaskUpdate(params);
        if (response.status == 200 ){
          if(response.data != null) {
            this.tasks = this.tasks.filter(command => command.id != response.data.body.id);
            this.tasks.push(response.data.body);
            this.$toast.add({
              severity:'success', 
              detail: this.$t('reports.scheduled_task_report.success_scheduled_update'),
              summary:this.$t("computer.task.toast_summary"), 
              life: 3000
            });
          }
      }
        else if(response.status == 400){
          this.$toast.add({
            severity:'error', 
            detail: this.$t('reports.scheduled_task_report.error_scheduled_update'),
            summary:this.$t("computer.task.toast_summary"), 
            life: 3000
      
        });
      }
      this.getTasks();
    },
  
    async cancelScheduledTask() {
      var params = new FormData();
      params.append("id", this.selectedCommand.id);
      this.cancelScheduledTaskLoading = true;
      const{ response, error } = await scheduledTaskReportService.scheduledTaskCancel(params);
      if(error){
          this.$toast.add({
          severity:'error', 
          detail: this.$t('reports.scheduled_task_report.error_scheduled_cancel'), 
          summary:this.$t("computer.task.toast_summary"), 
          life: 3000
        });
      }
      else{
        if (response.status == 200 && response.data != null) {
          this.tasks = this.tasks.filter(command => command.id != response.data.body.id);
          this.tasks.push(response.data.body);
          this.$toast.add({
            severity:'success', 
            detail: this.$t('reports.scheduled_task_report.success_scheduled_cancel'), 
            summary:this.$t("computer.task.toast_summary"), 
            life: 3000
          });
        }
        else if(response.status == 400){
          console.log("Scheduled task id not found!");
        }
      }
      this.cancelScheduledTaskLoading = false;
      this.cancelScheduledTaskDialog = false;
      this.getTasks();
      }
      
    },
  };
  </script>
  
  <style lang="scss" scoped>
  ::v-deep(.p-paginator) {
      .p-component {
          margin-left: auto;
      }
  }
  </style>
  