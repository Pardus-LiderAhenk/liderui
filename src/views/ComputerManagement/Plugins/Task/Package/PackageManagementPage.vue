<template>
  <div>
    <br>
    <packages class="plugin-card" v-if="packagesState" :pluginTask="pluginTaskPackages"></packages>
    <check-package class="plugin-card" 
          v-if="checkPackageState" 
          :pluginTask="pluginTaskCheckPackage">
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

import axios from 'axios';
import InstalledPackagesAndManagement from "@/views/ComputerManagement/Plugins/Task/Package/InstalledPackagesAndManagement.vue";
import Packages from "@/views/ComputerManagement/Plugins/Task/Package/Packages.vue";
import Repositories from "@/views/ComputerManagement/Plugins/Task/Package/Repositories.vue";
import CheckPackage from "@/views/ComputerManagement/Plugins/Task/Package/CheckPackage.vue";


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
    axios.post("/getPluginTaskList",{},).then((response) => {
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
    });
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
