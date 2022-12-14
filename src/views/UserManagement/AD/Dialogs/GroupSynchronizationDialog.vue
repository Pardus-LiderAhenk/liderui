<template>
    <div>
        <Dialog :header="$t('user_management.ad.select_ldap_ou')" 
        v-model:visible="ldapGroupOuDialog" :style="{width: '40vw'}" :modal="true"
        >
            <tree-component 
                ref="movetree"
                :isMove="true"
                loadNodeUrl="/api/lider/user-groups/groups"
                loadNodeOuUrl="/api/lider/user-groups/ou-details"
                :treeNodeClick="node => selectedLdapOuDn = node.distinguishedName"
                :searchFields="searchFolderFields"
            />
            <div class="p-col p-text-center">
            <small>{{$t('user_management.select_folder_warn')}}</small>
            </div>
            <template #footer>
                <Button :label="$t('user_management.cancel')" icon="pi pi-times" 
                    @click="ldapGroupOuDialog = false" class="p-button-text p-button-sm"
                />
                <Button :label="$t('user_management.ad.sync_selected_group')" icon="pi pi-replay" 
                    @click="syncGroupToLDAP" class="p-button-sm"
                />
            </template>
        </Dialog>
        <Dialog :header="$t('user_management.ad.sync_title')" v-model:visible="showDialog" 
            :style="{width: '50vw'}" :modal="true">
            <DataTable :value="groups" class="p-datatable-sm p-col"
                :paginator="true" :rows="10" ref="dt"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" 
                :rowsPerPageOptions="[10,25,50,100]"  style="margin-top: 2em"
                v-model:filters="filters" v-model:selection="selectedGroups"
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
                        <span>{{$t('user_management.ad.group_table_empty_message')}}</span>
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

        groupSyncDialog: {
            type: Boolean,
            default: false,
        },
    },

    data() {
        return {
            filters: {
                'global': {value: null, matchMode: FilterMatchMode.CONTAINS}
            },
            groups: [],
            selectedGroups: null,
            loading: false,
            selectedLdapOuDn: null,
            ldapGroupOuDialog: false,
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
                return this.groupSyncDialog;
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
            this.getChildGroup();
        } else {
            this.groups = [];
        }
    },

    methods: {
        async getChildGroup() {
            if (this.selectedNode.type == "ORGANIZATIONAL_UNIT" || this.selectedNode.type == "CONTAINER" || this.selectedNode.isRoot) {
                this.loading = true;
                let params = new FormData();
                params.append("searchDn", this.selectedNode.distinguishedName);
                params.append("key", "objectclass");
                params.append("value", "group");
                const {response,error} = await adManagementService.childGroupList(params);

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
                            this.groups = response.data;
                            this.loading = false;
                        }
                    }
                    else if(response.status == 417){
                        this.$toast.add({
                            severity:'error', 
                            detail: this.$t('user_management.ad.error_417_ad_child_entries'),
                            summary:this.$t("computer.task.toast_summary"), 
                            life: 3000
                        });
                    }
                }  
            } 
            if (this.selectedNode.type == 'GROUP') {
                this.groups.push(this.selectedNode);
            }
        },

        showLdapOuDialog() {
            if (!this.selectedGroups) {
                this.$toast.add({
                    severity:'warn', 
                    detail: this.$t('user_management.select_group_warn'),
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
                return;
            }
            this.ldapGroupOuDialog = true;
        },

        async syncGroupToLDAP() {
            if (!this.selectedLdapOuDn) {
                this.$toast.add({
                    severity:'warn', 
                    detail: this.$t('user_management.select_folder_warn'),
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
                return;
            }

            var isExisting = false;

            for (var key in this.selectedNode.attributesMultiValues) {
			    if (this.selectedNode.attributesMultiValues.hasOwnProperty(key) && key != "member") {
                    isExisting = true
                }
            }
            if(isExisting == true){
                this.$toast.add({
                    severity:'error', 
                    detail: this.$t('user_management.error_select_group_empty_member'),
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                    });
            }
                

            this.ldapGroupOuDialog = false;
            let params = {
                "distinguishedName": this.selectedLdapOuDn,
                "childEntries": this.selectedGroups
            };

            const{response,error} = await adManagementService.syncGroupFromAdToLdap(params);
            if(error){
                this.$toast.add({
                    severity:'error', 
                    detail: this.$t('user_management.ad.sync_group_error'),
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
            }
            else{
                if(isExisting == false){
                    if(response.status == 200){
                        if (response.data.length == 0) {
                            this.$toast.add({
                                severity:'success', 
                                detail: this.$t('user_management.ad.sync_group_success'),
                                summary:this.$t("computer.task.toast_summary"), 
                                life: 3000
                            });
                        }
                    }
                    else if(response.status == 417){
                        this.$toast.add({
                            severity:'error', 
                            detail: this.$t('user_management.ad.error_417_sync_group'),
                            summary:this.$t("computer.task.toast_summary"), 
                            life: 3000
                        });
                    }
                
                    else {
                        this.$toast.add({
                            severity:'warn', 
                            detail: this.$t('user_management.ad.already_exist_group_in_ldap'),
                            summary:this.$t("computer.task.toast_summary"), 
                            life: 3000
                        });
                    }
                }
            }

        this.selectedLdapOuDn = null;
        }
    },

    watch: {
        selectedNode() {
            if (this.selectedNode) {
                this.getChildGroup();
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

