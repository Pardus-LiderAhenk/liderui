<template>
  <div class="p-grid user-management">
      <div class="p-col-12 p-md-6 p-lg-12">
          <div class="p-grid p-flex-column">
            <div class="p-col" v-if="domainType != 'ACTIVE_DIRECTORY'">
                <Button
                    icon="pi pi-user"
                    :class="selectedTab == 'user-management' ? 'p-button-raised p-button-sm p-mr-2 p-mb-2':'p-button-text p-button-sm p-mr-2 p-mb-2'"
                    @click="setSelectedTab('user-management')"
                    :label="$t('menu.user_management')"
                >
                </Button>
                <Button
                    icon="pi pi-users"
                    :class="selectedTab == 'user-group-management' ? 'p-button-raised p-button-sm p-mr-2 p-mb-2':'p-button-text p-button-sm p-mr-2 p-mb-2'"
                    @click="setSelectedTab('user-group-management')"
                    :label="$t('menu.user_group_management')"
                >
                </Button>
                <Button
                    icon="pi pi-user-plus"
                    :class="selectedTab == 'user-permissions-management' ? 'p-button-raised p-button-sm p-mr-2 p-mb-2':'p-button-text p-button-sm p-mr-2 p-mb-2'"
                    @click="setSelectedTab('user-permissions-management')"
                    :label="$t('menu.user_authorization')"
                >
                </Button>
                <Button
                    icon="pi pi-sitemap"
                    :class="selectedTab == 'ad-management' ? 'p-button-raised p-button-sm p-mr-2 p-mb-2':'p-button-text p-button-sm p-mr-2 p-mb-2'"
                    @click="setSelectedTab('ad-management')"
                    :label="$t('menu.ad_management')"
                >
                </Button>
            </div>
            <div class="p-col">
                <!-- <keep-alive> -->
                    <component 
                        :is="selectedTab">
                    </component>
                <!-- </keep-alive> -->
            </div>
        </div>
    </div>
  </div>
</template>


<script>
import UserManagement from "@/views/UserManagement/Ldap/UserManagement.vue";
import UserGroupManagement from "@/views/UserManagement/UserGroupManagement/UserGroupManagement.vue";
import AdManagement from "@/views/UserManagement/AD/AdManagement.vue";
import UserPermissionsManagement from "@/views/UserManagement/UserPermissionsManagement/UserPermissionsManagement.vue";

import { mapActions } from "vuex"
import axios from "axios";

export default {
    components: {
        AdManagement,
        UserManagement,
        UserGroupManagement,
        UserPermissionsManagement
    },

    data() {
        return {
            selectedTab: "user-management",
            domainType: "LDAP", // LDAP, ACTIVE_DIRECTORY, NONE
        }
    },

    created() {
        let params = new FormData();
        params.append("innerPage", "directory-manager");
        axios.post("/lider/pages/getInnerHtmlPage", params).then((response) => {
            if (response.data) {
                this.domainType = response.data.domainType;
                if (this.domainType == "ACTIVE_DIRECTORY") {
                    this.selectedTab = "ad-management";
                }
            }
        });
        this.setSelectedLiderNode(null);
    },

    
    methods: {
        ...mapActions(["setSelectedNodeType", "setSelectedLiderNode"]),
        
        setSelectedTab(tab) {
            if (tab == "user-management") {
                this.setSelectedNodeType("user");
            } else if (tab == "ad-management") {
                this.setSelectedNodeType("ad");
            } else if (tab == "user-group-management") {
                this.setSelectedNodeType("userGroup");
            } else if (tab == "user-permissions-management") {
                this.setSelectedNodeType("sudoGroup");
            }
            this.selectedTab = tab;
        },
    },

    mounted() {
        this.setSelectedNodeType("user");
    },

    unmounted(){
        this.setSelectedLiderNode(null);
    }

}
</script>

<style lang="scss" scoped>
.p-button:hover {
  box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
}

.user-management {
    background-color: #e7f2f8;
}
</style>