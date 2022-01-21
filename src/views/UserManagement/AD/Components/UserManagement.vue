<template>
    <div>
        <Card>
            <template #content>
                <div class="p-grid">
                    <div class="p-col-12 p-md-6 p-lg-4">
                        <PanelMenu :model="menuitems"/>
                    </div>
                    <div class="p-col-12 p-md-6 p-lg-8" v-if="selectedUser">
                        <keep-alive>
                            <component :is="selectedTabUserMenu"
                                :selectedUser="user"
                                :userLdapBaseDn="userLdapBaseDn"
                                @updated-user="treeNodeClick">
                            </component>
                        </keep-alive>
                    </div>
                </div>
            </template>
        </Card>
    </div>
</template>

<script>
import PasswordComponent from '@/components/Password/PasswordComponent.vue';
import GeneralInformations from './Tabs/GeneralInformations.vue';
import PasswordChange from './Tabs/PasswordChange.vue';
import SessionHistory from './Tabs/SessionHistory.vue';
import UserGroups from './Tabs/UserGroups.vue';

export default {

    props: {
        selectedUser: {
            type: Object,
            description: "Selected tree node",
        },
    },

    components: {
        PasswordComponent,
        GeneralInformations,
        PasswordChange,
        SessionHistory,
        UserGroups
    },

    data() {
        return {
            user: null,
            userLdapBaseDn: null,
            selectedTabUserMenu: "general-informations",
           
            menuitems: [
                {
                    label: this.$t('user_management.general_information'), 
                    icon: 'pi pi-id-card', 
                    command:() => this.selectedTabUserMenu = "general-informations"
                },
                {
                    label: this.$t('user_management.change_password'), 
                    icon: 'pi pi-unlock', 
                    command:() => this.selectedTabUserMenu = "password-change"
                },
                {
                    label: this.$t('user_management.group_list'), 
                    icon: 'el el-icon-coin', 
                    command:() => this.selectedTabUserMenu = "user-groups"
                },
                {
                    label: this.$t('user_management.session_history'), 
                    icon: 'pi pi-replay', 
                    command:() => this.selectedTabUserMenu = "session-history"
                },
            ],
            changePasswordDialog: false,
            userPassword: null
        }
    },

    

    mounted() {
        if (this.selectedUser) {
            this.user = this.selectedUser;
        } else {
            this.ser = null;
        }
    },

    methods: {
        
    },

    watch: {
        selectedUser() {
            this.user = this.selectedUser;
        },
    }
    
}
</script>

<style lang="scss" scoped>

</style>