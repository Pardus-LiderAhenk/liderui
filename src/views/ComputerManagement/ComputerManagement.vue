<template>
  <div class="p-grid computer-management">
      <div class="p-col-3" style="min-height:90vh">
           <el-tabs type="border-card" style="height:100%;width:100%">
                <el-tab-pane label="İstemciler">
                <tree-component loadNodeUrl="/lider/computer/getComputers"
                                loadNodeOuUrl="/lider/computer/getOuDetails"
                                :treeNodeClick="setSelectedLiderNode"
                                >
                </tree-component>
                </el-tab-pane>
                <el-tab-pane label="Online">Onlineee</el-tab-pane>
            </el-tabs>
      </div>
      <div class="p-col-9">
      <br>
        <div>
            <Button
            icon="fa fa-sliders-h"
            :class="selectedPluginTab == 'system-management' ? 'p-button-raised p-button-sm p-mr-2 p-mb-2':'p-button-text p-button-sm p-mr-2 p-mb-2'"
            @click="setSelectedPluginTab('system-management')"
            :label="$t('computer.plugins.button.system')"
            >
            </Button>
            <Button
            icon="fa fa-cubes"
            :class="selectedPluginTab == 'package-management' ? 'p-button-raised p-button-sm p-mr-2 p-mb-2':'p-button-text p-button-sm p-mr-2 p-mb-2'"
            @click="setSelectedPluginTab('package-management')"
            :label="$t('computer.plugins.button.package')"
            >
            </Button>
            <Button
            icon="fa fa-laptop-code"
            :class="selectedPluginTab == 'service-management' ? 'p-button-raised p-button-sm p-mr-2 p-mb-2':'p-button-text p-button-sm p-mr-2 p-mb-2'"
            @click="setSelectedPluginTab('service-management')"
            :label="$t('computer.plugins.button.service')"
            >
            </Button>
            <Button
            icon="fa fa-hashtag"
            :class="selectedPluginTab == 'script-management' ? 'p-button-raised p-button-sm p-mr-2 p-mb-2':'p-button-text p-button-sm p-mr-2 p-mb-2'"
            @click="setSelectedPluginTab('script-management')"
            :label="$t('computer.plugins.button.script')"
            >
            </Button>
            <Button
            icon="fa fa-terminal"
            :class="selectedPluginTab == 'ssh-connect' ? 'p-button-raised p-button-sm p-mr-2 p-mb-2':'p-button-text p-button-sm p-mr-2 p-mb-2'"
            @click="setSelectedPluginTab('ssh-connect')"
            :label="$t('computer.plugins.button.ssh')"
            >
            </Button>
            <Button
            icon="fas fa-shield-alt"
            :class="selectedPluginTab == 'security-management' ? 'p-button-raised p-button-sm p-mr-2 p-mb-2':'p-button-text p-button-sm p-mr-2 p-mb-2'"
            @click="setSelectedPluginTab('security-management')"
            :label="$t('computer.plugins.button.security')"
            >
            </Button>
            <Button
            icon="fa fa-history"
            :class="selectedPluginTab == 'task-history' ? 'p-button-raised p-button-sm p-mr-2 p-mb-2':'p-button-text p-button-sm p-mr-2 p-mb-2'"
            @click="setSelectedPluginTab('task-history')"
            :label="$t('computer.plugins.button.history')"
            >
            </Button>
       </div>
       <keep-alive>
        <component :is="selectedPluginTab"></component>
      </keep-alive>
    </div>
  </div>
</template>


<script>
import TreeComponent from '@/components/Tree/TreeComponent.vue';
import SystemManagement from "@/views/ComputerManagement/Plugins/Task/System/SystemManagement.vue";
import PackageManagement from "@/views/ComputerManagement/Plugins/Task/Package/PackageManagement.vue";
import ScriptManagement from "@/views/ComputerManagement/Plugins/Task/Script/ScriptManagement.vue";
import ServiceManagement from '@/views/ComputerManagement/Plugins/Task/Service/ServiceManagement.vue';
import SshConnect from '@/views/ComputerManagement/Plugins/Task/Ssh/SshConnect.vue';
import SecurityManagement from '@/views/ComputerManagement/Plugins/Task/Security/SecurityManagement.vue';
import TaskHistory from '@/views/ComputerManagement/Plugins/Task/TaskHistory/TaskHistory.vue'
import { mapActions } from "vuex";

export default {
    components: {
        TreeComponent,
        SystemManagement,
        PackageManagement,
        ScriptManagement,
        ServiceManagement,
        SshConnect,
        SecurityManagement,
        TaskHistory
    },
    data() {
        return {
            selectedPluginTab: "system-management",
            treeData: null,
            contextmenuTrigger: false,
            isModal: false,
            search: {
                type: null,
                text: ''
            },
            defaultTreeProps: {
                children: 'childEntries',
                label: 'name',
                isLeaf: function(data, node) {
                    if (data.hasSubordinates === "TRUE") {
                        return false;
                    } else {
                        return true;
                    }
                },
            },
        };
    },
     created() {
        this.setSelectedLiderNode(null);
    },
    methods: {
        ...mapActions(["setSelectedLiderNode"]),
        setSelectedPluginTab(tab) {
            this.selectedPluginTab = tab;
        },
    },

}
</script>

<style scoped>
.p-button:hover {
  box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
}

.computer-management {
    background-color: #e7f2f8;
}
</style>