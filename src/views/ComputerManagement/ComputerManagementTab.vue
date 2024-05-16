<template>
    <div class="computer-management">
        <div class="p-grid">
            <div class="p-col-12 p-md-6 p-lg-12">
                <div class="p-d-flex p-jc-between">
                    <div>
                        <Button
                            icon="fa fa-desktop"
                            :class="selectedTab == 'computer-management' ? 'p-button-raised p-button-sm p-mr-2 p-mb-2':'p-button-text p-button-sm p-mr-2 p-mb-2'"
                            @click="setSelectedTab('computer-management')"
                            :label="$t('menu.computer_management')"
                        >
                        </Button>
                        <Button 
                            v-if="isExistPrivilege('ROLE_COMPUTER_GROUPS')"
                            icon="fa fa-cubes"
                            :class="selectedTab == 'computer-group-management' ? 'p-button-raised p-button-sm p-mr-2 p-mb-2':'p-button-text p-button-sm p-mr-2 p-mb-2'"
                            @click="setSelectedTab('computer-group-management')"
                            :label="$t('menu.computer_group_management')"
                        >
                        </Button>
                        <Button
                            icon="fa fa-clock"
                            :class="selectedTab == 'scheduledTask' ? 'p-button-raised p-button-sm p-mr-2 p-mb-2':'p-button-text p-button-sm p-mr-2 p-mb-2'"
                            @click="setSelectedTab('scheduledTask')"
                            :label="$t('menu.scheduled_tasks')"
                        >
                        </Button>
                    </div>
                </div>
            </div>
        </div>
        <component :is="selectedTab"> </component>
    </div>
</template>

<script>
import ComputerManagement from "@/views/ComputerManagement/ComputerManagement.vue";
import ComputerGroupManagement from "@/views/ComputerManagement/ComputerGroupManagement/ComputerGroupManagement.vue";
import ScheduledTask from "@/views/ComputerManagement/ScheduledTask.vue";
import { mapActions } from "vuex"
import {roleManagement} from "../../services/Roles/RoleManagement"

export default {
    components: {
        ComputerGroupManagement,
        ComputerManagement,
        ScheduledTask
    },

    data() {
        return {
            selectedTab: "computer-management",
        }
    },
    
    methods: {
        isExistPrivilege(role){
            return roleManagement.isExistRole(role)
        },

        ...mapActions(["setSelectedNodeType", "setSelectedComputerGroupNode", "setSelectedLiderNode"]),
        
        setSelectedTab(tab) {
            if (tab == "computer-management") {
                this.setSelectedNodeType("computer");
            } else if ( tab == "computer-group-management" ) {
                this.setSelectedNodeType("computerGroup");
            } else {
                this.setSelectedNodeType("scheduledTask")
            }
            this.selectedTab = tab;
        },
    },

    mounted() {
        this.setSelectedNodeType("computer");
    },

    unmounted(){
        this.setSelectedComputerGroupNode(null);
        this.setSelectedLiderNode(null);
    }

}
</script>

<style lang="scss" scoped>
.p-button:hover {
  box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
}

.computer-management {
    background-color: #e7f2f8;
}

.p-button {
    font-weight: bold;
}
</style>