<template>
    <div class="user-management">
        <div class="p-grid">
            <div class="p-col-12 p-md-6 p-lg-12">
                <Button v-if="isExistPrivilege('ROLE_USERS')"
                    icon="pi pi-user"
                    :class="selectedTab == 'user-management' ? 'p-button-raised p-button-sm p-mr-2 p-mb-2':'p-button-text p-button-sm p-mr-2 p-mb-2'"
                    @click="setSelectedTab('user-management')"
                    :label="'LDAP '+ $t('menu.user_management')"
                >
                </Button>
                <Button v-if="isExistPrivilege('ROLE_USER_GROUPS')"
                    icon="pi pi-users"
                    :class="selectedTab == 'user-group-management' ? 'p-button-raised p-button-sm p-mr-2 p-mb-2':'p-button-text p-button-sm p-mr-2 p-mb-2'"
                    @click="setSelectedTab('user-group-management')"
                    :label="'LDAP '+ $t('menu.user_group_management')"
                >
                </Button>
                <Button v-if="domainType != 'ACTIVE_DIRECTORY' && isExistPrivilege('ROLE_SUDO_GROUPS')"
                    icon="pi pi-user-plus"
                    :class="selectedTab == 'user-permissions-management' ? 'p-button-raised p-button-sm p-mr-2 p-mb-2':'p-button-text p-button-sm p-mr-2 p-mb-2'"
                    @click="setSelectedTab('user-permissions-management')"
                    :label="'LDAP '+ $t('menu.user_authorization')"
                >
                </Button>
                <Button v-if="isExistPrivilege('ROLE_AD_SYNC')"
                    icon="pi pi-sitemap"
                    :class="selectedTab == 'ad-management' ? 'p-button-raised p-button-sm p-mr-2 p-mb-2':'p-button-text p-button-sm p-mr-2 p-mb-2'"
                    @click="setSelectedTab('ad-management')"
                    :label="$t('menu.ad_management')"
                >
                </Button>
            </div>
        </div>
        <component 
            :is="selectedTab">
        </component>
    </div>
</template>


<script>
import UserManagement from "@/views/UserManagement/Ldap/UserManagement.vue";
import UserGroupManagement from "@/views/UserManagement/UserGroupManagement/UserGroupManagement.vue";
import AdManagement from "@/views/UserManagement/AD/AdManagement.vue";
import UserPermissionsManagement from "@/views/UserManagement/UserPermissionsManagement/UserPermissionsManagement.vue";

import { mapActions } from "vuex"
import { adManagementService } from "../../services/UserManagement/AD/AdManagement";
import {roleManagement} from "../../services/Roles/RoleManagement"

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

    async created() {
        const{ response,error } =  await adManagementService.configuration();
        if(error){
            this.$toast.add({
                severity:'error', 
                detail: this.$t('user_management.ad.error_configuraton'),
                summary:this.$t("computer.task.toast_summary"), 
                life: 3000
            });
        }
        else{
            if(response.status == 200){
                if (response.data) {

                    this.domainType = response.data.domainType;
                    if (this.domainType == "ACTIVE_DIRECTORY") {
                        this.selectedTab = "ad-management";
                    }
                }
            }else if(response.status == 417){
                this.$toast.add({
                    severity:'error', 
                    detail: this.$t('user_management.ad.error_417_configuration'),
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
            }
        }

        this.setSelectedLiderNode(null);
    },

    
    methods: {
        isExistPrivilege(role){
            return roleManagement.isExistRole(role)
        },
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

.p-button {
  font-weight: bold;
}

</style>