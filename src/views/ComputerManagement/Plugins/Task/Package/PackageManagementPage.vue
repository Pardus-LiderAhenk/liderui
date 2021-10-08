<template>
  <div>
    <br>
    <packages class="plugin-card" v-if="packagesState" :pluginTask="pluginTaskPackages"></packages>
    <div class="p-grid">
      <div class="p-col-6">
        <installed-packages-and-management 
        v-if="installedPackagesAndManagementState" class="plugin-card" 
        :pluginTask="pluginTaskInstalledPackagesAndManagement">
        </installed-packages-and-management>
        <!-- <application-restriction v-if="applicationRestrictionState" class="plugin-card" :pluginTask="pluginTaskApplicationRestriction"></application-restriction> -->
      </div>
      <div class="p-col-6">
        <repositories v-if="repositoriesState" class="plugin-card" :pluginTask="pluginTaskRepositories"></repositories>
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
// import ApplicationRestriction from "@/views/ComputerManagement/Plugins/Task/Package/ApplicationRestriction.vue";


export default {
  data() {
    return {
      pluginTaskInstalledPackagesAndManagement: null,
      pluginTaskPackages: null,
      pluginTaskRepositories: null,
      pluginTaskApplicationRestriction: null,
      
      installedPackagesAndManagementState: false,
      packagesState: false,
      repositoriesState: false,
      applicationRestrictionState: false,
    };
  },
  components: {
    InstalledPackagesAndManagement,
    Packages,
    Repositories,
    // ApplicationRestriction,
  },

  created() {
    axios
      .post(
        process.env.VUE_APP_URL + "/getPluginTaskList",
        {},
      )
      .then((response) => {
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
          if (element.page == "application-restriction") {
            this.pluginTaskApplicationRestriction = element;
            this.applicationRestrictionState = element.state;
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
