<template>
  <div>
    <base-plugin
      :pluginUrl="pluginUrl"
      :pluginDescription="pluginDescription"
      :showTaskDialog="showTaskDialog"
      @close-task-dialog="showTaskDialog = false;"
      :pluginTask="task"
    >
      <template #pluginTitle>
        {{ $t("computer.plugins.packages.header") }}
      </template>
      <template #pluginTitleButton>
        <div>
          <Button v-if="packages"
          icon="pi pi-caret-right"
          class="p-button-raised p-button-sm"
          :title="$t('computer.plugins.button.run')"
          @click.prevent="sendTaskPackages"
          >
          </Button>
        </div>
      </template> 
      <template #default>
        <div class="p-grid p-flex-column">
          <div class="p-fluid p-formgrid p-col">
            <div class="p-inputgroup">
              <Button 
                @click.prevent="updateRepoAddress" :value="update"
                :icon="update ? 'pi pi-save': 'pi pi-pencil'"
                :title="update ? $t('computer.plugins.packages.save'): $t('computer.plugins.packages.edit')"
                :class="update ? 'p-button-sm p-button-success': 'p-button-sm p-button-warning'"
              />
              <Dropdown style="max-width: 150px;" 
                :class="repoValidation.url || repoValidation.component ? 'p-invalid': ''"
                :disabled="!update"
                v-model="type" 
                :options="typeList" optionLabel="label">
              </Dropdown>
              <InputText 
                :disabled="!update" 
                type="text" 
                v-model="repoForm.url" 
                :class="repoValidation.url ? 'p-invalid p-inputtext-sm': 'p-inputtext-sm'" 
                placeholder="http://depo.pardus.org.tr/pardus"
                
              />
              <InputText 
                :disabled="!update" 
                type="text" 
                v-model="repoForm.component" 
                :class="repoValidation.component ? 'p-invalid p-inputtext-sm': 'p-inputtext-sm'" 
                placeholder="yirmibir main contrib non-free"
                
              />
              <Button type="button" 
                class="p-button-sm" 
                :label="$t('computer.plugins.packages.list_packages')" 
                icon="pi pi-list" @click.prevent="getPackagesList" 
              />
            </div>
            <div class="p-d-flex p-jc-center">
              <small v-if="repoValidation.url || repoValidation.component" 
              class="p-error">{{ $t('computer.plugins.packages.repo_address_warn') }}
              </small>
            </div>
          </div>
          <div class="p-col">
            <DataTable :value="packages" class="p-datatable-sm p-datatable-customers"
              :paginator="true" :rows="10" 
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" 
              :rowsPerPageOptions="[10,25,50,100]"
              currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
              :loading="loading"
              v-model:filters="filters" @filter="onFilter($event)" filterDisplay="row" ref="dt"
            >
              <template #empty>
                <div class="p-d-flex p-jc-center">
                  <span>{{$t('computer.plugins.packages.table_empty_message')}}</span>
                </div>
              </template>
              <Column 
                field="packageName" 
                :header="$t('computer.plugins.packages.package_name')" 
                headerStyle="width: 17%" 
                filterMatchMode="startsWith" 
                ref="packageName">
                <template #filter="{filterModel,filterCallback}" v-if="packages">
                  <InputText  
                  type="text" 
                  v-model="filterModel.value" 
                  @keydown.enter="filterCallback()" 
                  class="p-column-filter" 
                  :placeholder="$t('computer.plugins.packages.search')"
                  />
                </template>        
              </Column>
              <Column field="version" :header="$t('computer.plugins.packages.version')" headerStyle="width: 15%">
              </Column>
              <Column field="size" :header="$t('computer.plugins.packages.size') +' (MB)'" headerStyle="width: 8%">
                <template #body="slotProps">
                  <span>{{(slotProps.data.size/1048576).toFixed(3)}}</span>
                </template>
              </Column>
              <Column field="description" :header="$t('computer.plugins.packages.package_description')" headerStyle="width: 40%">
              </Column>
              <Column field="status" :header="$t('computer.plugins.packages.status')" headerStyle="width: 10%">
                <template #body="slotProps">
                  <Badge v-if="slotProps.data.tag == 'Install'" severity="success" icon="pi pi-users"
                   :value="$t('computer.plugins.packages.install')">
                   </Badge>
                  <Badge 
                    v-else-if="slotProps.data.tag == 'Uninstall'" 
                    severity="danger" :value="$t('computer.plugins.packages.uninstall')">
                  </Badge>
                  <Badge v-else severity="info" value="NA"></Badge>
                </template>
              </Column>
              <Column :exportable="false" headerStyle="width: 10%">
                <template #body="slotProps">
                  <Dropdown v-model="slotProps.data.tag" style="min-width: 100%;" :showClear="true" 
                    :class="packageInfoList.length == 0 && taskValidation ? 'p-invalid': ''"
                    :options="[{label: $t('computer.plugins.packages.install'), value: 'Install'},
                    {label: $t('computer.plugins.packages.uninstall'), value: 'Uninstall'}]"
                    optionLabel="label" optionValue="value" :placeholder="$t('computer.plugins.packages.select')" 
                    @change="changeTagPackage(slotProps.data, slotProps.data.tag)"
                  />
                </template>
              </Column>
            </DataTable>
          </div>
          <div class="p-col" v-if="packages">
            <Button 
              type="button" 
              :label="$t('computer.plugins.packages.view_selected_packages')" 
              @click="toggle($event)" 
              icon="pi pi-info-circle" 
              class="p-button-sm" 
              :badge="packageInfoList.length > 0 ? packageInfoList.length: '0'" 
              badgeClass="p-badge-danger" 
            />
            <OverlayPanel 
              ref="packagesOp"
              appendTo="body" 
              :showCloseIcon="false" 
              id="overlay_panel" 
              style="width: 450px"
              :breakpoints="{'960px': '75vw'}"
            >
              <h5 class="text-center">{{$t('computer.plugins.packages.selected_packages')}}</h5>
              <DataTable 
                :value="packageInfoList" 
                responsiveLayout="scroll" 
                scrollable="true" 
                scrollHeight="400px" 
                class="p-datatable-sm" 
                :metaKeySelection="false"
              >
                <Column field="packageName" :header="$t('computer.plugins.packages.package_name')"></Column>
                <Column field="tag" :header="$t('computer.plugins.packages.status')">
                  <template #body="slotProps">
                    <Badge 
                      v-if="slotProps.data.tag == 'Install'" 
                      severity="success" 
                      icon="pi pi-users" 
                      :value="$t('computer.plugins.packages.install')">
                    </Badge>
                    <Badge 
                      v-else-if="slotProps.data.tag == 'Uninstall'" 
                      severity="danger" 
                      :value="$t('computer.plugins.packages.uninstall')">
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

/**
 * Allows to install or remove selected package or packages in package repository which entered address
 * commandId: PACKAGES
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
  },

  data() {
    return {
      task: null,
      showTaskDialog: false,
      type: {label: 'deb', value: 'deb'},
      typeList: [{label: 'deb', value: 'deb'},
        {label: 'deb-src', value: 'deb-src'}],
      repoForm: {
        url: '',
        component: ''
      },
      update: false,
      loading: false,
      packages: null,
      lazyParams: {},
      filters: {
        'packageName': {value: '', matchMode: 'contains'},
      },
      packageInfoList: [],
      pluginDescription: this.$t('computer.plugins.packages.description'),
      pluginUrl: "https://docs.liderahenk.org/lider3.0/computerManagement/computerManagement/packageInstallUninstall/",
      taskValidation: false,
      repoValidation: {}
    }
  },

  mounted() {

    this.repoAddress();
    this.lazyParams = {
      first: 0,
      rows: this.$refs.dt.rows,
      filters: this.filters
    };
  },

  methods: {
   
    async updateRepoAddress(){
      if (this.update && this.validateForm()) {
        const params = new FormData();
        params.append("pardusRepoAddress", this.repoForm.url);
        params.append("pardusRepoComponent", this.repoForm.component);

        const{response,error} = await taskService.packageUpdateRepo(params);
        if(error){
          this.$toast.add({
            severity:'error', 
            detail: this.$t('computer.plugins.packages.update_repo_error_message')+ " \n"+error, 
            summary:this.$t("computer.task.toast_summary"), 
            life: 3000
          })
        }
        else{
          if(response.status == 200){
            if (response.data.pardusRepoAddress != null && response.data.pardusRepoComponent != null) {
              this.$toast.add({
                severity:'success', 
                detail: this.$t('computer.plugins.packages.update_repo_success_message'), 
                summary:this.$t("computer.task.toast_summary"), 
                life: 3000
              });
            }
          }
          else if(response.status == 417){
            return "error";
          }
        }
      }
    this.update = !this.update;  
    },

    async repoAddress(){

      const{response,error} = await taskService.packageRepoAddress();
      if(error){
        this.$toast.add({
          severity:'error', 
          detail: this.$t('computer.plugins.packages.get_settings_error_message')+ " \n"+error, 
          summary:this.$t("computer.task.toast_summary"), 
          life: 3000
        })
      }
      else{
        if(response.status == 200){
          if (response.data.pardusRepoAddress == null || 
          response.data.pardusRepoAddress == "" && 
          response.data.pardusRepoComponent != null || 
          response.data.pardusRepoComponent == "") {
            this.repoForm.url = "http://depo.pardus.org.tr/pardus";
            this.repoForm.component = "yirmibir main contrib non-free";
      } else {
          this.repoForm.url = response.data.pardusRepoAddress;
          this.repoForm.component = response.data.pardusRepoComponent;
          }
        }
        else if(response.status == 417){
          return "error";
        }
      }
    },

    async getPackagesList(){
      if (this.validateForm()) {
        this.loading = true;
        const params = new FormData();
        params.append("type", this.type.value);
        params.append("url", this.repoForm.url);
        params.append("component", this.repoForm.component);
        
        const{response,error} = await taskService.packageList(params);
        if(error){
          this.loading = false;
          this.$toast.add({
            severity:'error', 
            detail: this.$t('computer.plugins.packages.update_repo_error_message')+ " \n"+error, 
            summary:this.$t("computer.task.toast_summary"), 
            life: 3000
          });
        }
        else{
          if(response.status == 200){
            if (response.data != null) {
              this.packages = response.data;
              this.loading = false;
              if(this.packageInfoList.length > 0){
                this.packageInfoList = [];
              }
            }
          }
          else if(response.status == 417){
            this.$toast.add({
              severity:'error', 
              detail: this.$t('computer.plugins.packages.error_417_update_repo') ,
              summary:this.$t("computer.task.toast_summary"), 
              life: 3000
            });  
          }
        }
      }
    },

    changeTagPackage(data, tag){
      if (tag == "Install" || tag == "Uninstall") {
        if (!this.isExistPackage(data)) {
          this.packageInfoList.push(data);
        }
      } else {
        this.removePackageList(data);
      }
    },
    
    isExistPackage(data){
      var isExist = false;
      if (this.packageInfoList.length > 0) {
        for (let index = 0; index < this.packageInfoList.length; index++) {
          if (this.packageInfoList[index].packageName == data.packageName && 
          this.packageInfoList[index].version == data.version) {
            if (this.packageInfoList[index].tag != data.tag) {
              this.packageInfoList[index].tag = data.tag;
            }
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

    sendTaskPackages(){
     if (this.packageInfoList.length > 0) {
      this.task.commandId = "PACKAGES";
      this.task.parameterMap = {"packageInfoList": this.packageInfoList};
      this.showTaskDialog = true;
     } else{
       this.$toast.add({
         severity:'warn', 
         detail: this.$t('computer.plugins.packages.send_task_warning'), 
         summary:this.$t("computer.task.toast_summary"), 
         life: 3000
        })
       this.taskValidation = true;
     }
    },

    validateForm() {
      if (!this.repoForm.url.trim()){
        this.repoValidation['url'] = true;
      } else{
        delete this.repoValidation['url'];
      }
      if (!this.repoForm.component.trim()){
        this.repoValidation['component'] = true;
      } else{
        delete this.repoValidation['component'];
      }
      return !Object.keys(this.repoValidation).length;
    },

    onFilter() {
      this.lazyParams.filters = this.filters;
    },

    toggle(event) {
      this.$refs.packagesOp.toggle(event);
    },
  },

  watch: {
    packageInfoList: {
      
      handler() {
        if (this.packageInfoList.length > 0) {
          this.taskValidation = false;
        }
      },
      deep: true
    },

    repoForm: {
      handler(){
        this.validateForm();
     },
     deep: true,
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

</style>
