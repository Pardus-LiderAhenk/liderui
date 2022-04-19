<template>
  <div>
    <packages class="plugin-card" v-if="packagesState" :pluginTask="pluginTaskPackages"></packages>
    <check-package class="plugin-card" 
      v-if="checkPackageState" 
      :pluginTask="pluginTaskCheckPackage">
    </check-package>
  </div>
</template>

<script>
/**
 * Package Management Page. This page include all package plugins
 * @see {@link http://www.liderahenk.org/}
 * 
 */

import axios from 'axios';
import Packages from "@/views/ComputerManagement/Plugins/Task/Package/Packages.vue";
import CheckPackage from "@/views/ComputerManagement/Plugins/Task/Package/CheckPackage.vue";


export default {
  data() {
    return {
      pluginTaskPackages: null,
      pluginTaskCheckPackage: null,
      
      packagesState: false,
      checkPackageState: false
    };
  },
  components: {
    Packages,
    CheckPackage
  },

  created() {
    axios
      .post("/getPluginTaskList",{},).then((response) => {
        for (let index = 0; index < response.data.length; index++) {
          const element = response.data[index];
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
