<template>
    <div>
        <Dialog :header="$t('user_management.ad.select_ldap_ou')" 
        v-model:visible="ldapUserOuDialog" :style="{width: '40vw'}" :modal="true"
        >
            <tree-component 
                ref="movetree"
                :isMove="true"
                loadNodeUrl="/api/lider/user/users"
                loadNodeOuUrl="/api/lider/user/ou-details"
                :treeNodeClick="node => selectedLdapOuDn = node.distinguishedName"
                :searchFields="searchFolderFields"
            />
            <div class="p-col p-text-center">
            <small>{{$t('user_management.select_folder_warn')}}</small>
            </div>
            <template #footer>
                <Button :label="$t('user_management.cancel')" icon="pi pi-times" 
                    @click="ldapUserOuDialog = false" class="p-button-text p-button-sm"
                />
                <Button :label="$t('user_management.ad.sync_selected_user')" icon="pi pi-replay" 
                    @click="syncUserToLDAP" class="p-button-sm"
                />
            </template>
        </Dialog>
        <Dialog :header="$t('user_management.ad.sync_title')" v-model:visible="showDialog" 
            :style="{width: '50vw'}" :modal="true">
            
            <DataTable :value="users" class="p-datatable-sm p-col"
                :paginator="true" :rows="10" ref="dt"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" 
                :rowsPerPageOptions="[10,25,50,100]"  style="margin-top: 2em"
                v-model:filters="filters" v-model:selection="selectedUsers"
                responsiveLayout="scroll" :loading="loading" 
            >
                <template #header>
                    <div class="p-d-flex p-jc-between">
                        <div style="text-align: left" v-if="selectedNode">
                            <Button
                                class="p-button-sm" icon="pi pi-folder"
                                :label="$t('user_management.ad.select_ou')"
                                @click="showLdapOuDialog">
                            </Button>
                        </div>
                        <div class="p-d-flex p-jc-end">
                        <span class="p-input-icon-left">
                            <i class="pi pi-search"/>
                            <InputText v-model="filters['global'].value" 
                            class="p-inputtext-sm" 
                            :placeholder="$t('user_management.search')" 
                            />
                        </span>
                        </div>
                    </div>
                </template>
                <template #empty>
                    <div class="p-d-flex p-jc-center">
                        <span>{{$t('user_management.ad.user_table_empty_message')}}</span>
                    </div>
                </template>
                <Column selectionMode="multiple" headerStyle="width: 3em"></Column>
                <Column field="name" :header="$t('user_management.username')" style="width:25%"></Column>
                <Column field="distinguishedName" :header="$t('user_management.node_dn')" style="width:75%"></Column>
            </DataTable>
            <template #footer>
                <div class="p-d-flex p-jc-between">
                    <div class="p-d-flex p-jc-start">
                        <strong style="font: bold">{{$t('user_management.selected_dn')}}:</strong> <span>&nbsp; {{selectedNode.distinguishedName}}</span>
                    </div>
                    <Button :label="$t('user_management.cancel')" icon="pi pi-times" 
                        @click="showDialog = false" class="p-button-text p-button-sm">
                    </Button>
                </div>
            </template>
        </Dialog>
    </div>
</template>

<script>
import {FilterMatchMode} from 'primevue/api';
import { adManagementService } from '../../../../services/UserManagement/AD/AdManagement.js';

export default {
    props: {
        selectedNode: {
            type: Object,
            description: "Selected tree node",
        },

        userSyncDialog: {
            type: Boolean,
            default: false,
            description: "Selected tree node",
        },
    },

    data() {
        return {
            filters: {
                'global': {value: null, matchMode: FilterMatchMode.CONTAINS}
            },
            users: [],
            selectedUsers: null,
            loading: false,
            selectedLdapOuDn: null,
            ldapUserOuDialog: false,
            searchFolderFields: [
                {
                    key: this.$t('tree.folder'),
                    value: "ou"
                },
            ],
        }
    },

    computed: {
        showDialog: {
            get () {
                return this.userSyncDialog;
            },

            set (value) {
                if (!value) {
                    this.$emit('closeAdDialog');
                }
            }
        }
    },

    mounted() {
        if (this.selectedNode) {
            this.getChildUser();
        } else {
            this.users = [];
        }
    },

    methods: {
        async getChildUser() {
            if (this.selectedNode.type == "ORGANIZATIONAL_UNIT" || this.selectedNode.type == "CONTAINER" || this.selectedNode.isRoot) {
                this.loading = true;
                let params = new FormData();
                params.append("searchDn", this.selectedNode.distinguishedName);
                params.append("key", "objectclass");
                params.append("value", "user");

                const { response,error} = await  adManagementService.childUser(params);
                if(error){
                    this.$toast.add({
                        severity:'error', 
                        detail: this.$t('user_management.ad.error_ad_child_entries'),
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000
                    });
                }
                else{
                    if(response.status == 200){
                        if (response.data) {
                            this.users = response.data;
                            this.loading = false;
                        }
                    }
                    else if(response.status == 417){
                        this.$toast.add({
                            severity:'error', 
                            detail: this.$t('user_management.ad.error_ad_child_entries'),
                            summary:this.$t("computer.task.toast_summary"), 
                            life: 3000
                        });
                    }
                }
  
            } 
            if (this.selectedNode.type == 'USER') {
                this.users.push(this.selectedNode);
            }
        },

        showLdapOuDialog() {
            if (!this.selectedUsers) {
                this.$toast.add({
                    severity:'warn', 
                    detail: this.$t('user_management.select_user_warn'),
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
                return;
            }
            this.ldapUserOuDialog = true;
        },

        async syncUserToLDAP() {
            if (!this.selectedLdapOuDn) {
                this.$toast.add({
                    severity:'warn', 
                    detail: this.$t('user_management.select_folder_warn'),
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
                return;
            }
            this.ldapUserOuDialog = false;
            let params = {
                "distinguishedName": this.selectedLdapOuDn,
                "childEntries": this.selectedUsers
            };

            const{ response,error } = await adManagementService.syncUserFromAdToLdap(params);
            if(error){
                this.$toast.add({
                    severity:'error', 
                    detail: this.$t('user_management.ad.sync_user_error'),
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });

            }
            else{
                if(response.status == 200){
                    if (response.data.length == 0) {
                    this.$toast.add({
                        severity:'success', 
                        detail: this.$t('user_management.ad.sync_user_success'),
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000
                    });
                } else {
                    this.$toast.add({
                        severity:'warn', 
                        detail: this.$t('user_management.ad.already_exist_user_in_ldap'),
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000
                    });
                }

                } 
                else if(response.status == 417){            
                    this.$toast.add({
                        severity:'error', 
                        detail: this.$t('user_management.ad.error_417_sync_user'),
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000
                        });
                    }
                }

            this.selectedLdapOuDn = null;
        }
    },

    watch: {
        selectedNode() {
            if (this.selectedNode) {
                this.getChildUser();
            }
        },
    }
}
</script>

<style lang="scss" scoped>
::v-deep(.p-paginator) {
    .p-paginator-current {
        margin-left: auto;
    }
}

::v-deep(.p-datatable.p-datatable-customers) {
    .p-paginator {
        padding: 1rem;
    }
}

</style>

