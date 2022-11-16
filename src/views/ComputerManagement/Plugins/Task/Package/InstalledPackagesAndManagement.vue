<template>
  <div>
    <base-plugin
      :pluginUrl="pluginUrl"
      :pluginDescription="pluginDescription"
      :showTaskDialog="showTaskDialog"
      @close-task-dialog="showTaskDialog = false;"
      @task-response="installedPackageManagementResponse"
      :pluginTask="task"
      :executeTask="executeTask"
    >
      <template #pluginTitle>
        {{ $t("computer.plugins.installed_packages.header") }}
      </template>
      <template #pluginTitleButton>
        <div>
          <Button
          v-if="packages"
          icon="pi pi-trash"
          class="p-button-danger p-button-sm p-mr-2"
          :title="$t('computer.plugins.installed_packages.uninstall')"
          @click.prevent="sendTaskPackageManagement('PACKAGE_MANAGEMENT')"
          >
          </Button>
          <Button
          icon="pi pi-list"
          class="p-button-sm"
          :title="$t('computer.plugins.installed_packages.list_packages')"
          @click.prevent="sendTaskPackageManagement('INSTALLED_PACKAGES')"
          >
          </Button>
        </div>
      </template> 
      <template #default>
        <div class="p-flex-column">
          <DataTable :value="packages" class="p-datatable-sm"
            v-model:selection="selectedPackages" dataKey="id"
            :paginator="true" :rows="10" 
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" 
            :rowsPerPageOptions="[10,25,50]" 
            :metaKeySelection="false" 
            @rowSelect="onRowSelect" 
            @rowUnselect="onRowUnselect"
            v-model:filters="filters"
          >
            <template #header>
              <div class="p-d-flex p-jc-end">
                <span class="p-input-icon-left">
                  <i class="pi pi-search" />
                  <InputText v-model="filters['global'].value" 
                  class="p-inputtext-sm" 
                  :placeholder="$t('computer.plugins.installed_packages.search')" 
                  />
                </span>
              </div>
            </template>
              <template #empty>
              <div class="p-d-flex p-jc-center">
                  <span>{{$t('computer.plugins.installed_packages.table_empty_message')}}</span>
              </div>
              </template>
              <Column selectionMode="multiple" headerStyle="width: 3em"></Column>
              <Column field="id" header="#" style="width: 10%"></Column>
              <Column field="packageName" :header="$t('computer.plugins.installed_packages.package_name')" style="min-width: 40%"></Column>
              <Column field="version" :header="$t('computer.plugins.installed_packages.version')" style="min-width: 50%"></Column>
          </DataTable>
          <div class="p-col" v-if="packages">
            <Button type="button" 
            :label="$t('computer.plugins.installed_packages.view_selected_packages')"
             @click="toggle($event)" 
             icon="pi pi-info-circle" class="p-button-sm"
             :badge="packageInfoList.length > 0 ? packageInfoList.length: '0'" 
             badgeClass="p-badge-danger" 
             />
            <OverlayPanel ref="packagesOp" 
            appendTo="body" 
            :showCloseIcon="false" 
            id="overlay_panel" 
            style="width: 400px" 
            :breakpoints="{'960px': '75vw'}"
            >
              <h5 class="text-center">{{$t('computer.plugins.installed_packages.selected_packages')}}</h5>
              <DataTable 
              :value="packageInfoList" 
              responsiveLayout="scroll" 
              scrollable="true" 
              scrollHeight="400px" 
              class="p-datatable-sm" 
              :metaKeySelection="false"
              >
                <Column field="packageName" :header="$t('computer.plugins.installed_packages.package_name')"></Column>
                <Column field="version" :header="$t('computer.plugins.installed_packages.version')"></Column>
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
import {taskService} from "../../../../../services/Task/TaskService.js";
import {FilterMatchMode} from 'primevue/api';
/**
 * Allows to list and uninstall installed packages on client
 * commandId: INSTALLED_PACKAGES, PACKAGE_MANAGEMENT
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
  },

  data() {
    return {
      task: null,
      showTaskDialog: false,
      executeTask: false,
      taskValidation: false,
      packages: null,
      selectedPackages: null,
      packageInfoList: [],
      filters: {},
      pluginDescription: this.$t('computer.plugins.installed_packages.description'),
      pluginUrl: "https://docs.liderahenk.org/lider3.0/computerManagement/computerManagement/installedPackageManagement/",
    }
  },

  methods: {
    initFilters() {
      this.filters = {
          'global': {value: null, matchMode: FilterMatchMode.CONTAINS}
      }
    },

    isExistPackage(data){
      var isExist = false;
      if (this.packageInfoList.length > 0) {
        for (let index = 0; index < this.packageInfoList.length; index++) {
          if (this.packageInfoList[index].packageName == data.packageName && 
          this.packageInfoList[index].version == data.version) {
            isExist = true;
          }
        }
      }
      return isExist;
    },

    removePackageList(data) {
      if (this.packageInfoList.length > 0) {
        for (let index = 0; index < this.packageInfoList.length; index++) {
          const element = this.packageInfoList[index];
          if (data.packageName === element.packageName && data.version === element.version) {
            this.packageInfoList.splice(index, 1);
          }
        }
      }
    },

    sendTaskPackageManagement(commandId){
        this.task.commandId = commandId;
        if (commandId == "INSTALLED_PACKAGES") {
            this.task.parameterMap = {};
            this.showTaskDialog = true;
        } else {
          if (this.packageInfoList.length > 0) {
            this.task.parameterMap = {
              "packageInfoList": this.packageInfoList
            };
            this.showTaskDialog = true;
          } else {
            this.$toast.add({
              severity:'warn', 
              detail: this.$t('computer.plugins.installed_packages.send_task_warning'), 
              summary:this.$t("computer.task.toast_summary"), 
              life: 3000
            })
          }
        }
    },

    async installedPackageManagementResponse(message) {
        if (message.commandClsId == "INSTALLED_PACKAGES") {
            const params = new FormData();
            params.append("id", message.result.id);
            const{response,error} = await taskService.commandExecute(message.result.id);
            if(error){
              this.$toast.add({
                severity:'error', 
                detail: this.$t('computer.plugins.installed_packages.get_packages_error_message')+ " \n"+error, 
                summary:this.$t("computer.task.toast_summary"), 
                life: 3000
              });
            }
            else{
                if(response.status == 200){
                  if (response.data != null) {
                      var packagesList = [];
                      var responseData = response.data.responseDataStr.split("\n");
                      for (let index = 0; index < responseData.length; index++) {
                        const element = responseData[index];
                        packagesList.push({
                            "tag": "u",
                            "id": index + 1,
                            "packageName": element.split(",")[1],
                            "version": element.split(",")[2]
                        });
                      }
                      if (this.selectedPackages != null) {
                        this.selectedPackages = null;
                      }
                      if (this.packageInfoList.length > 0) {
                        this.packageInfoList = [];
                      }
                      this.packages = packagesList;
                    }
                }
              else if(response.status == 417){
                this.$toast.add({
                  severity:'error', 
                  detail: this.$t('computer.plugins.installed_packages.error_417_get_packages'), 
                  summary:this.$t("computer.task.toast_summary"), 
                  life: 3000
                });
                
              }

            }
      }
      if (message.commandClsId == "PACKAGE_MANAGEMENT") {
        if (message.result.responseCode == "TASK_PROCESSED") {
          this.task.commandId = "INSTALLED_PACKAGES";
          this.task.parameterMap = {};
          this.executeTask = true;
        }
      }
    },

    onRowSelect(event) {
      if (!this.isExistPackage(event.data)) {
        if (! event.data.packageName.startsWith("ahenk")) {
          this.packageInfoList.push(event.data);
        } else {
          for (let index = 0; index < this.selectedPackages.length; index++) {
            const element = this.selectedPackages[index];
            if (event.data.packageName === element.packageName && event.data.version === element.version) {
              this.selectedPackages.splice(index, 1);
            }
          }
          this.$toast.add({
            severity:'warn', 
            detail: this.$t('computer.plugins.installed_packages.selected_package_warning'), 
            summary:this.$t("computer.task.toast_summary"), 
            life: 3000
          })
        }
      }
    },

    onRowUnselect(event) {
      if (this.isExistPackage(event.data)) {
        this.removePackageList(event.data);
      }
    },

    toggle(event) {
      this.$refs.packagesOp.toggle(event);
    },
  },
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
