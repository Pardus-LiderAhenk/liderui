<template>
  <div>
    <Dialog 
      :header="$t('computer.plugins.repositories.add_repo_address')" 
      v-model:visible="addRepoAddrDialog" 
      :modal="true" 
      :style="{width: '30vw'}"
    >
      <div class="p-fluid">
        <div class="p-field">
          <label for="newRepoAddr">{{$t('computer.plugins.repositories.repo_address')}}</label>
          <InputText 
            type="text"
            v-model="newRepoAddr" 
            :class="validationRepoAddr ? 'p-invalid': ''" 
            placeholder="deb http://depo.pardus.org.tr/pardus yirmibir main contrib non-free"
          />
          <small v-if="validationRepoAddr" class="p-error">
            {{$t('computer.plugins.repositories.repo_address_warn')}}
          </small>
          <small v-if="validationAlreadyExist" class="p-error">
            {{$t('computer.plugins.repositories.repo_already_added')}}
          </small>
        </div>
      </div>
      <template #footer>
        <Button 
          :label="$t('computer.plugins.repositories.cancel')" 
          icon="pi pi-times" 
          @click.prevent="addRepoAddrDialog=false" 
          class="p-button-text p-button-sm"
        />
        <Button 
          :label="$t('computer.plugins.repositories.save')" 
          icon="pi pi-save" 
          @click.prevent="addRepoAddress" 
          class="p-button-sm" 
        />
      </template>
    </Dialog>
    <base-plugin
      :pluginUrl="pluginUrl"
      :pluginDescription="pluginDescription"
      :showTaskDialog="showTaskDialog"
      @close-task-dialog="showTaskDialog = false"
      @task-response="repositoryManagementResponse"
      :pluginTask="task"
      :executeTask="executeTask"
    >
      <template #pluginTitle>
        {{ $t("computer.plugins.repositories.header") }}
      </template>
      <template #pluginTitleButton>
        <div>
          <Button
            v-if="repositories.length > 0"
            icon="pi pi-refresh"
            class="p-button-sm p-mr-2"
            :title="$t('computer.plugins.repositories.update')"
            @click.prevent="sendTaskRepositoryManagement('PACKAGE_SOURCES')"
          >
          </Button>
          <Button
            icon="pi pi-list"
            class="p-button-sm"
            :title="$t('computer.plugins.repositories.list_repo')"
            @click.prevent="sendTaskRepositoryManagement('REPOSITORIES')"
          >
          </Button>
        </div>
      </template> 
      <template #default>
        <div class="p-flex-column">
          <div class="p-field p-d-flex p-jc-end" v-if="repositories.length > 0">
            <Button
              v-if="repositories.length > 0"
              icon="pi pi-plus"
              class="p-button-sm"
              :label="$t('computer.plugins.repositories.add_repo_address')"
              @click.prevent="addRepoAddrDialog = true"
            >
            </Button>
          </div>
          <div class="p-field">
            <DataTable 
                :value="repositories" 
                class="p-datatable-sm"
                v-model:selection="selectedRepositories" dataKey="id"
                :metaKeySelection="false"
                @rowSelect="onRowSelect" @rowUnselect="onRowUnselect"
                v-model:filters="filters"
            >
            <template #header>
              <div class="p-d-flex p-jc-end">
                <span class="p-input-icon-left">
                  <i class="pi pi-search"/>
                  <InputText 
                    v-model="filters['global'].value" 
                    class="p-inputtext-sm" 
                    :placeholder="$t('computer.plugins.repositories.search')" 
                  />
                </span>
              </div>
            </template>
              <template #empty>
              <div class="p-d-flex p-jc-center">
                  <span>{{$t('computer.plugins.repositories.table_empty_message')}}</span>
              </div>
              </template>
              <Column 
                selectionMode="multiple" 
                headerStyle="width: 3em">
              </Column>
              <Column field="id" header="#" style="width: 10%"></Column>
              <Column field="repoAddress" 
                :header="$t('computer.plugins.repositories.repo_address')" 
                style="min-width: 40%">
              </Column>
            </DataTable>
          </div>
          <div class="p-field" v-if="repositories.length > 0">
            <Button type="button" :label="$t('computer.plugins.repositories.view_selected_repositories')"
              @click="toggle($event)" icon="pi pi-info-circle" 
              class="p-button-sm" 
              :badge="selectedRepositories.length > 0 ? selectedRepositories.length: '0'"
              badgeClass="p-badge-danger" 
            />
            <OverlayPanel ref="repositoryOp"
              appendTo="body"
              :showCloseIcon="false" 
              id="overlay_panel" 
              :style="{width: '30vw'}" 
              :breakpoints="{'960px': '75vw'}"
             >
              <h5 class="text-center">{{$t('computer.plugins.repositories.selected_repositories')}}</h5>
              <DataTable 
                :value="selectedRepositories" 
                scrollable="true" 
                scrollHeight="400px" 
                class="p-datatable-sm"
              >
                <Column field="repoAddress" 
                  :header="$t('computer.plugins.repositories.repo_address')" 
                  style="min-width: 80%">
                </Column>
                <Column field="status" 
                  :header="$t('computer.plugins.repositories.status')" 
                  style="width: 10%">
                  <template #body="slotProps">
                    <Badge
                      :value="slotProps.data.status == 'add'? $t('computer.plugins.repositories.add'): $t('computer.plugins.repositories.delete')" 
                      :severity="slotProps.data.status == 'add' ? 'success': 'danger'">
                    </Badge>
                  </template>
                </Column>
                <Column :exportable="false" style="width: 10%" field="status">
                  <template #body="slotProps">
                    <div class="p-d-flex p-jc-end" v-if="slotProps.data.status == 'add'">
                      <div>
                        <Button icon="pi pi-times" class="p-button-rounded p-button-danger p-button-sm"
                          @click="deleteRepoAddr(slotProps.data)" 
                        />
                      </div>
                    </div>
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
import {FilterMatchMode} from 'primevue/api';
/**
 * Allows to list repositories and deleted repository on client
 * commandId: REPOSITORIES, PACKAGE_SOURCES
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
      validationRepoAddr: false,
      validationAlreadyExist: false,
      repositories: [],
      selectedRepositories: [],
      newRepoAddr: "",
      deletedItems: [],
      addedItems: [],
      filters: {},
      addRepoAddrDialog: false,
      pluginDescription: this.$t('computer.plugins.repositories.description'),
      pluginUrl: "https://docs.liderahenk.org/lider3.0/computerManagement/computerManagement/repositoryManagement/",
    }
  },

  methods: {
    initFilters() {
      this.filters = {
          'global': {value: null, matchMode: FilterMatchMode.CONTAINS}
      }
    },

    isExistRepoAddr(repoAddress){
      var isExist = false;
      if (this.selectedRepositories.length > 0) {
        for (let index = 0; index < this.selectedRepositories.length; index++) {
          if (this.selectedRepositories[index].repoAddress == repoAddress) {
            isExist = true;
          }
        }
      }
      return isExist;
    },

    removeAddressSelectedRepositories(data) {
      if (this.selectedRepositories.length > 0) {
        for (let index = 0; index < this.selectedRepositories.length; index++) {
          const element = this.selectedRepositories[index];
          if (data.repoAddress === element.repoAddress) {
            this.selectedRepositories.splice(index, 1);
          }
        }
      }
    },

    sendTaskRepositoryManagement(commandId){
        this.task.commandId = commandId;
        this.task.plugin.usesFileTransfer = false;
        if (commandId == "REPOSITORIES") {
            this.task.parameterMap = {};
            this.showTaskDialog = true;
        } else {
          if (this.addedItems.length > 0 || this.deletedItems.length > 0) {
            this.task.parameterMap = {
              "addedItems": this.addedItems,
              "deletedItems": this.deletedItems
            };
            this.showTaskDialog = true;
          } else {
            this.$toast.add({
              severity:'warn', 
              detail: this.$t('computer.plugins.repositories.send_task_warning'), 
              summary:this.$t("computer.task.toast_summary"), 
              life: 3000
            })
          }
        }
    },

    repositoryManagementResponse(message) {
      if (message.commandClsId == "REPOSITORIES" || message.commandClsId == "PACKAGE_SOURCES") {
        this.addedItems = [],
        this.deletedItems = [];
        this.repositories = [];
        this.selectedRepositories = [];
        let arrg = JSON.parse(message.result.responseDataStr);
        if (arrg != null) {
            arrg = arrg["packageSource"].trim().split("\n");
          for (let index = 0; index < arrg.length; index++) {
            const element = arrg[index];
            this.repositories.push({
              "id": index + 1,
              "status": "delete",
              "repoAddress": element
            })
          }
        }
      }
    },

    addRepoAddress(){
      if (!this.newRepoAddr.trim()) {
        this.validationRepoAddr = true;
        return;
      } else {
        if (! this.isExistRepoAddr(this.newRepoAddr)) {
          this.validationAlreadyExist = false;
          this.addRepoAddrDialog = false;
          if(!this.addedItems.indexOf(this.newRepoAddr) !== -1){
            this.addedItems.push(this.newRepoAddr);
          }
          this.selectedRepositories.push({
            "repoAddress": this.newRepoAddr,
            "status": "add"
          });
          this.newRepoAddr = "";
        }else{
          this.validationAlreadyExist = true;
        }
      }
    },

    deleteRepoAddr(data) {
      this.removeAddressSelectedRepositories(data);
      const index = this.addedItems.indexOf(data.repoAddress);
      if (index > -1) {
        this.addedItems.splice(index, 1);
      }
    },

    onRowSelect(event) {
      const index = this.deletedItems.indexOf(event.data.repoAddress);
      if (! index > -1) {
        this.deletedItems.push(event.data.repoAddress);
      }
    },

    onRowUnselect(event) {
      const index = this.deletedItems.indexOf(event.data.repoAddress);
      if (index > -1) {
        this.deletedItems.splice(index, 1);
      }
    },

    toggle(event) {
      this.$refs.repositoryOp.toggle(event);
    },
  },

  watch: {
    newRepoAddr(){
      if (this.newRepoAddr.trim()) {
        this.validationRepoAddr = false;
        this.validationAlreadyExist = false;
      }
    },   
  },
};
</script>

<style lang="scss" scoped>

::v-deep(.p-datatable .p-column-header-content) {
  .p-checkbox .p-checkbox-box{
    display: none !important
  }
}

::v-deep(.p-datatable .p-column-header-content) {
  pointer-events: none;
}

</style>
