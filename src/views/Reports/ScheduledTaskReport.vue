<template>
  <base-scheduled v-if="showScheduled"
    @close-scheduled="showScheduled = false" 
    @save-scheduled="updateScheduledTask"
    :showScheduled="showScheduled">
  </base-scheduled>
  <Panel :toggleable="true" class="p-m-3">
    <template #header>
      <h4 class="p-pt-2">{{$t('reports.scheduled_task_report.scheduled_task_report')}}</h4>
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
    <template #title>
      <div class="p-d-flex p-jc-between">
        <div>{{$t('reports.scheduled_task_report.results')}}</div>
        <div>
          <Button
            :label="$t('reports.scheduled_task_report.export')"
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
            {{
             data.uidList.length
            }}
          </template>
        </Column>
        <Column :header="$t('reports.scheduled_task_report.successful')">
          <template #body="{ data }">
            {{ data.successfullTaskCount  }}
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
        :rows="10"
        :totalRecords="totalElements"
        :rowsPerPageOptions="[10, 25, 50, 100]"
        @page="onPage($event)"
      >
        <template #left=""> {{$t('reports.scheduled_task_report.total_result')}} : {{ totalElements }} </template>
      </Paginator>
    </template>
  </Card>
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
            :value="selectedCommand.task.deleted ? 'Pasif': 'Aktif'" 
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
    </template>
  </Dialog>
  <Dialog :header="$t('reports.scheduled_task_report.cancel_scheduled_task')" v-model:visible="cancelScheduledTaskDialog" 
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
            @click="cancelScheduledTask" class="p-button-sm"
        />
    </template>
  </Dialog>
</template>

<script>

/**
 * Scheduled task report. Update and cancel scheduled task with this page
 * @see {@link http://www.liderahenk.org/}
 */

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
      scheduledTaskDetailDialog: false,
      selectedCommand: null,
      plugins:[],
      showScheduled: false,
      cancelScheduledTaskDialog: false,
      filter: {
        taskSendDate: '',
        taskSendStartDate:'',
        taskSendEndDate:'',
        task:null
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

    getTasks() {
      this.currentPage = this.pageNumber;
      var data = new FormData();
      data.append("pageNumber", this.pageNumber);
      data.append("pageSize", this.rowNumber);
      data.append("startDate", this.filter.taskSendStartDate);
      data.append("endDate", this.filter.taskSendEndDate);
      if(this.filter.task != null) {
        data.append("taskCommand", this.filter.task);
      }
      if (this.pageNumber == 1) {
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
      axios.post("/lider/scheduledTaskReport/list/", data).then((response) => {
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
      this.pageNumber = event.page + 1;
      this.rowNumber = event.rows;
      this.getTasks();
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
      axios.post("/lider/scheduledTaskReport/export", data, {responseType: 'blob'})
      .then((response) => {
        let blob = new Blob([response.data]);
        let link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = "Scheduled_Tasks_Report.xlsx";
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

    updateScheduledTask(scheduledParam) {
      var params = new FormData();
      params.append("id", this.selectedCommand.id);
      params.append("cronExpression", scheduledParam);
      axios.post("/lider/scheduledTask/update", params).then((response) => {
        if (response.status == 200 && response.data != null) {
          this.tasks = this.tasks.filter(command => command.id != response.data.id);
          this.tasks.push(response.data);
          this.$toast.add({
            severity:'success', 
            detail: "Zamanlanmış görev başarıyla güncellendi", 
            summary:this.$t("computer.task.toast_summary"), 
            life: 3000
          });
        }
      })
      .catch((error) => {
        this.$toast.add({
          severity:'error', 
          detail: "Zamanlanmış görev güncellenirken hata oluştu \n"+error,
          summary:this.$t("computer.task.toast_summary"), 
          life: 3000
        });
      });
    },

    cancelScheduledTask() {
      var params = new FormData();
      params.append("id", this.selectedCommand.id);
      axios.post("/lider/scheduledTask/cancel", params).then((response) => {
        if (response.status == 200 && response.data != null) {
          this.tasks = this.tasks.filter(command => command.id != response.data.id);
          this.tasks.push(response.data);
          this.$toast.add({
            severity:'success', 
            detail: "Zamanlanmış görev başarıyla iptal edildi", 
            summary:this.$t("computer.task.toast_summary"), 
            life: 3000
          });
        }
      })
      .catch((error) => {
        this.$toast.add({
          severity:'error', 
          detail: "Zamanlanmış görev iptal edilirken hata oluştu \n"+error, 
          summary:this.$t("computer.task.toast_summary"), 
          life: 3000
        });
      });
      this.cancelScheduledTaskDialog = false;
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
