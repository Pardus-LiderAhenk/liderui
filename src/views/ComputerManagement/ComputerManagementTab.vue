<template>
  <div class="p-grid computer-management">
      <div class="p-col-12 p-md-6 p-lg-12">
          <div class="p-grid p-flex-column">
            <div class="p-col">
                <Button
                    icon="fa fa-desktop"
                    :class="selectedTab == 'computer-management' ? 'p-button-raised p-button-sm p-mr-2 p-mb-2':'p-button-text p-button-sm p-mr-2 p-mb-2'"
                    @click="setSelectedTab('computer-management')"
                    :label="$t('menu.computer_management')"
                >
                </Button>
                <Button
                    icon="fa fa-cubes"
                    :class="selectedTab == 'computer-group-management' ? 'p-button-raised p-button-sm p-mr-2 p-mb-2':'p-button-text p-button-sm p-mr-2 p-mb-2'"
                    @click="setSelectedTab('computer-group-management')"
                    :label="$t('menu.computer_group_management')"
                >
                </Button>
            </div>
            <div class="p-col">
                <keep-alive>
                    <component 
                        :is="selectedTab">
                    </component>
                </keep-alive>
            </div>
        </div>
    </div>
  </div>
</template>


<script>
import ComputerManagement from "@/views/ComputerManagement/ComputerManagement.vue";
import ComputerGroupManagement from "@/views/ComputerManagement/ComputerGroupManagement/ComputerGroupManagement.vue";
import { mapActions } from "vuex"

export default {
    components: {
        ComputerGroupManagement,
        ComputerManagement
    },

    data() {
        return {
            selectedTab: "computer-management",
        }
    },
    
    methods: {
        ...mapActions(["setSelectedNodeType", "setSelectedComputerGroupNode", "setSelectedLiderNode"]),
        
        setSelectedTab(tab) {
            if (tab == "computer-management") {
                this.setSelectedNodeType("computer");
            } else {
                this.setSelectedNodeType("computerGroup");
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
</style>