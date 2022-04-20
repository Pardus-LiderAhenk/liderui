<template>
  <Panel :toggleable="true" class="p-m-3">
    <template #header>
      <h4 class="p-pt-2">{{$t('reports.task_report.task_report')}}</h4>
    </template>
    <div class="p-fluid p-formgrid p-grid">
      
      <div class="p-field p-col-12 p-lg-4 p-md-6 p-sm-12">
        <label for="inputRegistrationDate">{{$t('reports.task_report.posted_date')}}</label>
        <Calendar
          v-model="filter.taskSendDate"
          selectionMode="range"
          :showButtonBar="true"
          :numberOfMonths="2"
          dateFormat="dd/mm/yy"
          :showIcon="true"
          :hideOnDateTimeSelect="true"
          :manualInput="false"
        />
      </div>
      <div class="p-field p-col-12 p-lg-4 p-md-6 p-sm-12">
        <label for="inputStatus">{{$t('reports.task_report.task')}}</label>
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
              :label="$t('reports.task_report.clear')"
              icon="fas fa-backspace"
              @click="clearFilterFields"
            />
          </div>
          <div class="p-ml-2">
            <Button 
            :label="$t('reports.task_report.search')" 
            icon="fas fa-search" 
            @click="filterAgents" />
          </div>
        </div>
      </div>
    </div>
  </Panel>
  <Card class="p-m-3 p-mb-7">
    <template #title>
      <div class="p-d-flex p-jc-between">
        <div>{{$t('reports.task_report.results')}}</div>
        <div>
          <Button
            :label="$t('reports.task_report.export')"
            icon="fas fa-file-excel"
            @click="exportToExcel()"
          />
        </div>
      </div>
    </template>
    <template #content>
      <DataTable :value="tasks" responsiveLayout="scroll" dataKey="id" :loading="loading">
        <template #empty>
          <div class="p-d-flex p-jc-center">
            {{$t('reports.task_report.task_cant_find')}}...
          </div>
        </template>
        <template #loading>
          {{$t('reports.task_report.loading')}}...
        </template>
        <Column header="#">
          <template #body="{index}">
            <span>{{ index + 1 }}</span>
            </template>
        </Column>
        <Column field="task.plugin.description" :header="$t('reports.task_report.plugin')"></Column>
        <Column :header="$t('reports.task_report.task')">
          <template #body="{ data }">
            {{ getTaskName(data)}}
          </template>
        </Column>
        <Column field="createDate" :header="$t('reports.task_report.create_date')">
         
        </Column>
        <Column field="commandOwnerUid" :header="$t('reports.task_report.sender')">
          
        </Column>
        <Column :header="$t('reports.task_report.sender')">
          <template #body="{ data }">
            {{
             data.uidList.length
            }}
          </template>
        </Column>
        <Column :header="$t('reports.task_report.total')">
          <template #body="{ data }">
            {{ data.successfullTaskCount  }}
          </template>
        </Column>
        <Column :header="$t('reports.task_report.waiting')">
          <template #body="{ data }">
            {{ data.waitingTaskCount }}
          </template>
        </Column>
        <Column :header="$t('reports.task_report.error')">
            <template #body="{ data }">
                {{ data.failedTaskCount }}
            </template>
        </Column>
        <Column :header="$t('reports.task_report.scheduled_task')">
            <template #body="{data}">
                {{
                    data.task.cronExpression != null ? 'EVET': 'HAYIR'
                }}
            </template>
        </Column>
        <Column>
          <template #body="{ data }">
            <div class="p-d-flex p-jc-end">
              <div>
                <Button
                  class="p-button-sm p-button-raised p-button-rounded"
                  icon="pi pi-list"
                  v-tooltip.left="$t('reports.task_report.task_detail')"
                  @click="showTaskDetailDialog(data.id)"
                />
              </div>
            </div>
          </template>
        </Column>
      </DataTable>
      <Paginator
        :rows="10"
        :totalRecords="totalElements"
        :rowsPerPageOptions="[10, 25, 50, 100]"
        @page="onPage($event)"
      >
        <template #left=""> {{$t('reports.task_report.total_result')}}: {{ totalElements }} </template>
      </Paginator>
    </template>
  </Card>
  <Dialog
    v-model:visible="taskDetailDialog"
    :breakpoints="{ '960px': '75vw', '640px': '100vw' }"
    :style="{ width: '50vw' }"
  >
    <template #header>
      <h3>{{$t('reports.task_report.task_sent_ahenk_list')}}</h3>
    </template>
    
     <DataTable :value="selectedTask.commandExecutions" responsiveLayout="scroll">

        <Column field="uid" :header="$t('reports.task_report.computer_name')"></Column>
        <Column field="createDate" :header="$t('reports.task_report.posted_date')"></Column>
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
                {{
                    data.commandExecutionResults.length > 0 ? 
                    (data.commandExecutionResults[0].responseCode == "TASK_PROCESSED" ? $t('reports.task_report.successful') : $t('reports.task_report.error'))   : ''
                }}
            </template>
        </Column>
         <Column :header="$t('reports.task_report.answer')">
          <template #body="{ data }">
            <div class="p-d-flex p-jc-end">
              <div>
                <Button
                  class="p-button-sm p-button-raised p-button-rounded"
                  icon="pi pi-list"
                  v-tooltip.left="'Task Details'"
                  @click="showTaskExecutionsResultDialog(data.id)"
                />
              </div>
            </div>
          </template>
        </Column>
     </DataTable>
    
    <template #footer>
      <Button
        label="Close"
        icon="pi pi-times"
        class="p-button-text"
        @click="taskDetailDialog = false"
      />
    </template>
  </Dialog >

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
        {{ selectedTask.task.plugin.description }}
      </div>
      <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
      <div class="p-col-4"><b>{{$t('reports.task_report.execution_result')}}</b></div>
      <div class="p-col-8">
        {{ selectedTaskExecutionResult.responseCode == "TASK_PROCESSED" ? 'BAŞARILI' : 'HATA' }}
      </div>
      <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
      <div class="p-col-4"><b>{{$t('reports.task_report.create_date')}}</b></div>
      <div class="p-col-8">
        {{ selectedTask.createDate }}
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
      <template v-for="(parameterKey, index) in Object.keys(selectedTask.task.parameterMap)" :key="index + 'param' " >
        <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
        <div class="p-col-4"><b>{{ parameterKey }}</b></div>
        <div class="p-col-8">
          {{ selectedTask.task.parameterMap[parameterKey] }}
        </div>
      </template>
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
        label="Close"
        icon="pi pi-times"
        class="p-button-text"
        @click="taskExecutionsResultDialog = false"
      />
    </template>

  </Dialog>
</template>

<script>
import axios from "axios";
import moment from "moment";

export default {
  data() {
    return {
        tasks: [],
        totalElements: 0,
        showedTotalElementCount: 10,
        currentPage: 1,
        offset: 1,
        loading: true,
        getFilterData: true,
        taskDetailDialog: false,
        taskExecutionsResultDialog: false,
        selectedTask: null,
        selectedTaskExecutionResult: null,
        plugins:[],
        filter: {
            taskSendDate: '',
            taskSendStartDate:'',
            taskSendEndDate:'',
            task:null
        },
    };
  },
  mounted() {
    this.getTasks();
    this.getPlugins();
  },
  methods: {
    showTaskDetailDialog(taskId) {
      this.selectedTask = this.tasks.filter(
        (task) => task.id === taskId
      )[0];
      this.taskDetailDialog = true;
    },
    showTaskExecutionsResultDialog(id){
      this.selectedTaskExecutionResult = this.selectedTask.commandExecutions.filter(
        (executionResult) => executionResult.id === id
      )[0];
      this.taskExecutionsResultDialog = true;
    },
    getTasks(pageNumber = 1, rowNumber = 10) {
      this.currentPage = pageNumber;
      var data = new FormData();
      data.append("pageNumber", pageNumber);
      data.append("pageSize", rowNumber);
      data.append("startDate", this.filter.taskSendStartDate);
      data.append("endDate", this.filter.taskSendEndDate);
      if(this.filter.task != null) {
        data.append("taskCommand", this.filter.task);
      }
      if (pageNumber == 1) {
        data.append("getFilterData", true);
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
      axios.post("/lider/executedTaskReport/list/", data).then((response) => {
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

      });
    },
    currentPageChange(newCurrentPage) {
      this.loading = true;
      this.getTasks(newCurrentPage);
    },
    onPage(event) {
      this.loading = true;
      this.getTasks(event.page + 1, event.rows);
    },
    filterAgents() {
      if (this.filter.taskSendDate[0] != null) {
        this.filter.taskSendStartDate = moment(
          this.filter.taskSendDate[0]
        )
          .set("hour", 0)
          .set("minute", 0)
          .set("second", 0)
          .format("DD/MM/YYYY HH:mm:ss");
      }
      if (this.filter.taskSendDate[1] != null) {
        this.filter.taskSendEndDate = moment(
          this.filter.taskSendDate[1]
        )
          .set("hour", 23)
          .set("minute", 59)
          .set("second", 59)
          .format("DD/MM/YYYY HH:mm:ss");
      }
      this.getTasks(this.currentPage, this.showedTotalElementCount);
    },
    exportToExcel() {
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
      axios.post("/lider/executedTaskReport/export", data, {responseType: 'blob'})
      .then((response) => {
        let blob = new Blob([response.data]);
        let link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = "Tasks_Report.xlsx";
        this.loading = false;
        link.click();
      });
    },
    clearFilterFields() {
      this.filter = {
        taskSendDate: '',
        taskSendStartDate:'',
        taskSendEndDate:'',
        task:null
      };
    },
    getPlugins(){
        // /lider/executedTaskReport/plugins

        axios.post("/lider/executedTaskReport/plugins", {}).then((response) => {
            this.plugins = response.data;
        });
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
