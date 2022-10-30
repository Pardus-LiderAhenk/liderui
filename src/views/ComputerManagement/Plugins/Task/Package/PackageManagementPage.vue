<template>
  <div>
    <packages class="plugin-card" v-if="packagesState" :pluginTask="pluginTaskPackages"></packages>
    <check-package class="plugin-card" 
      v-if="checkPackageState" 
      :pluginTask="pluginTaskCheckPackage"
    >
    </check-package>
    <div class="p-grid">
      <div class="p-col-12 p-md-6 p-lg-6">
        <installed-packages-and-management 
          v-if="installedPackagesAndManagementState" class="plugin-card" 
          :pluginTask="pluginTaskInstalledPackagesAndManagement">
        </installed-packages-and-management>
      </div>
      <div class="p-col-12 p-md-6 p-lg-6">
        <repositories v-if="repositoriesState" 
          class="plugin-card" 
          :pluginTask="pluginTaskRepositories">
        </repositories>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * Package Management Page. This page include all package plugins
 * @see {@link http://www.liderahenk.org/}
 * 
 */

import InstalledPackagesAndManagement from "@/views/ComputerManagement/Plugins/Task/Package/InstalledPackagesAndManagement.vue";
import Packages from "@/views/ComputerManagement/Plugins/Task/Package/Packages.vue";
import Repositories from "@/views/ComputerManagement/Plugins/Task/Package/Repositories.vue";
import CheckPackage from "@/views/ComputerManagement/Plugins/Task/Package/CheckPackage.vue";
import { taskService } from '../../../../../services/Task/TaskService.js';


export default {
  data() {
    return {
      pluginTaskInstalledPackagesAndManagement: null,
      pluginTaskPackages: null,
      pluginTaskRepositories: null,
      pluginTaskCheckPackage: null,
      
      installedPackagesAndManagementState: false,
      packagesState: false,
      repositoriesState: false,
      checkPackageState: false
    };
  },
  components: {
    InstalledPackagesAndManagement,
    Packages,
    Repositories,
    CheckPackage
  },

  created() {
     this.pluginTaskList();
  },

  methods: {
    async pluginTaskList(){ 
      //axios.post("/api/get-plugin-task-list",{},).then((response) => {
      const{response,error} =  await taskService.pluginTaskList();
      if(error){
        this.$toast.add({
          severity:'error', 
          detail: this.$t('computer.plugins.security.error_plugin_task_list'), 
          summary:this.$t("computer.task.toast_summary"), 
          life: 3000
        });
      }
      else{
        if(response.status == 200){
          for (let index = 0; index < response.data.length; index++) {
            const element = response.data[index];
            if (element.page == "package-management") {
              this.pluginTaskInstalledPackagesAndManagement = element;
              this.installedPackagesAndManagementState = element.state;
            }
            if (element.page == "repositories") {
              this.pluginTaskRepositories = element;
              this.repositoriesState = element.state;
            }
            if (element.page == "packages") {
              this.pluginTaskPackages = element;
              this.packagesState = element.state;
            }
            if (element.page == "check-package") {
              this.pluginTaskCheckPackage = element;
              this.checkPackageState = element.state;
            }
          }
        }
        else if(response.status == 417){
          this.$toast.add({
            severity:'error', 
            detail: this.$t('computer.plugins.security.error_417_plugin_task_list'), 
            summary:this.$t("computer.task.toast_summary"), 
            life: 3000
          });
          }
        }
      }
  },  
  
};
</script>

<style scoped>
.plugin-card{
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  margin-bottom: 10px;
}
.plugin-card:hover {
  box-shadow: 0 8px 20px 0 rgba(155, 150, 150, 0.2);
} 
</style>
