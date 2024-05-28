<template>
  <div>
    <base-plugin
      :pluginUrl="pluginUrl"
      :pluginDescription="pluginDescription"
      :showTaskDialog="showTaskDialog"
      @close-task-dialog="showTaskDialog = false;"
      @task-response="checkPackageResponse"
      :pluginTask="task"
    >
      <template #pluginTitle>
        {{ $t("computer.plugins.check_package.header") }}
      </template>
      <template #pluginTitleButton>
        <div>
          <Button
            icon="pi pi-search"
            class="p-button-sm"
            :title="$t('computer.plugins.check_package.search')"
            @click.prevent="sendTaskCheckPackage('CHECK_PACKAGE')"
          >
          </Button>
        </div>
      </template>
      <template #default>
        <div class="p-flex-column">
            <div class="p-fluid p-field p-grid">
                <div class="p-field p-col-12 p-md-6">
                    <label for="packageName">{{$t('computer.plugins.check_package.package_name')}}</label>
                    <InputText v-model="packageName" type="text"
                        :class="validationPackageName ? 'p-invalid p-inputtext-sm': 'p-inputtext-sm'"
                        placeholder="ahenk"
                    />
                     <small v-if="validationPackageName" class="p-error">
                        {{$t('computer.plugins.check_package.package_name_warn')}}
                    </small>
                </div>
                <div class="p-field p-col-12 p-md-6">
                    <label for="version">{{$t('computer.plugins.check_package.version')}}</label>
                    <InputText v-model="version" class="p-inputtext-sm" type="text" placeholder="1.1.0-25"/>
                </div>
            </div>
            <div class="p-field">
                <DataTable :value="packages" class="p-datatable-sm"
                    dataKey="id"
                    :paginator="true" :rows="10" ref="dt"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[10,25,50]"
                    v-model:filters="filters"
                >
                    <template #header>
                        <div class="p-d-flex p-jc-between">
                            <div style="text-align: left">
                                <Button v-if="packages.length > 0"
                                    class="p-button-sm" icon="pi pi-external-link"
                                    :label="$t('computer.plugins.check_package.export')"
                                    @click="exportCSV($event)">
                                </Button>
                            </div>
                            <div class="p-d-flex p-jc-end">
                                <span class="p-input-icon-left">
                                    <i class="pi pi-search" />
                                    <InputText v-model="filters['global'].value"
                                        class="p-inputtext-sm"
                                        :placeholder="$t('computer.plugins.check_package.search')"
                                    />
                                </span>
                            </div>
                        </div>
                    </template>
                    <template #empty>
                        <div class="p-d-flex p-jc-center">
                            <span>{{$t('computer.plugins.check_package.table_empty_message')}}</span>
                        </div>
                    </template>
                    <!-- <Column selectionMode="multiple" headerStyle="width: 3em"></Column> -->
                    <Column field="packageName" :header="$t('computer.plugins.check_package.package_name')"></Column>
                    <Column field="version" :header="$t('computer.plugins.check_package.version')"></Column>
                    <Column field="dn" header="DN"></Column>
                    <Column field="result" :header="$t('computer.plugins.check_package.result')"></Column>
                </DataTable>
            </div>
        </div>
      </template>
      <template #pluginFooter>
      </template>
    </base-plugin>
  </div>
</template>

<script>
/**
 * Checks whether the package whose name and version information entered is installed in the selected Agent or Agents
 * commandId: CHECK_PACKAGE
 * @see {@link http://www.liderahenk.org/}
 *
 */

import {FilterMatchMode} from 'primevue/api';
import { mapGetters } from "vuex"

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
      taskValidation: false,
      packages: [],
      packageName: "",
      result: "",
      version: "",
      filters: {},
      validationPackageName: false,
      pluginDescription: this.$t('computer.plugins.check_package.description'),
      pluginUrl: "https://docs.liderahenk.org/lider3.0/computerManagement/computerManagement/packageControl/",
    }
  },

  computed: {
    ...mapGetters(["selectedLiderNode","selectedNodeType"]),
  },

  methods: {
    initFilters() {
      this.filters = {
          'global': {value: null, matchMode: FilterMatchMode.CONTAINS}
      }
    },

    isExistPackage(key, value){
      var isExist = false;
      if (this.packages.length > 0) {
        for (let index = 0; index < this.packages.length; index++) {
          if (this.packages[index][key] == value) {
            isExist = true;
          }
        }
      }
      return isExist;
    },

    sendTaskCheckPackage(commandId){
        if (!this.packageName.trim()) {
            this.validationPackageName = true;
            return;
        }
        this.task.commandId = commandId;
        this.task.parameterMap = {
            "packageName": this.packageName,
            "packageVersion": this.version,
            "packageResult": this.result
        };
        this.packages = [];
        this.showTaskDialog = true;
    },

    checkPackageResponse(message) {
      if (message.commandClsId == "CHECK_PACKAGE") {
        if (this.selectedNodeType === "computer" && this.selectedLiderNode.type === "AHENK") {
          this.packages = [];
        }

        let responseData = message.result.responseDataStr.split("\n");
        let arrg = JSON.parse(responseData);
        if (arrg) {
          if (this.isExistPackage("dn", arrg.dn)){
            this.packages = this.packages.filter(clientPackage => clientPackage.dn != arrg.dn);
          }
          this.pushPackageList(arrg);
        }
      }
    },

    pushPackageList(arrg) {
      let result = arrg.res;
      if (result == 0) {
          result = this.$t('computer.plugins.check_package.uninstalled')
      }
        if (result == 1) {
          result = this.$t('computer.plugins.check_package.installed')
      }
        if (result == 2) {
          result = this.$t('computer.plugins.check_package.different_version')
      }
      this.packages.push({
          "packageName": this.packageName,
          "dn": arrg.dn,
          "result": result,
          "version": arrg.version ? arrg.version.trim("\n"): null
      });
    },

    exportCSV() {
        this.$refs.dt.exportCSV();
    }
  },

    watch: {
        packageName(){
            if (this.packageName.trim()) {
                this.validationPackageName = false;
            }
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

::v-deep(.p-datatable .p-column-header-content) {
  .p-checkbox .p-checkbox-box{
    display: none !important
  }
}

::v-deep(.p-datatable .p-column-header-content) {
  pointer-events: none;
}
</style>
