<template>
    <Dialog 
        :header="$t('computer.task.toast_summary')" 
        v-model:visible="deleteGroupConfirm"  
        :modal="true" 
        @hide="updateUserConfirm = false">
        <div class="confirmation-content">
            <i class="pi pi-info-circle p-mr-3" style="font-size: 1.5rem" />
            <span>{{ $t('user_management.delete_member_confirm_message')}}</span>
        </div>
        <template #footer>
        <Button 
            :label="$t('user_management.cancel')" 
            icon="pi pi-times" 
            @click="deleteGroupConfirm = false" 
            class="p-button-text p-button-sm"
        />
        <Button 
            :label="$t('user_management.yes')"
            icon="pi pi-check" 
            @click="deleteUserFromGroup"
            class="p-button-sm"
        />
        </template>
    </Dialog>
    <div class="p-flex-column">
        <div class="p-field">
            <h3>{{$t('user_management.group_list')}}</h3>
        </div>
        <div class="p-field">
            <DataTable :value="groups" class="p-datatable-sm" v-model:filters="filters">
                <template #header>
                    <div class="p-d-flex p-jc-end">
                        <span class="p-input-icon-left">
                            <i class="pi pi-search"/>
                            <InputText v-model="filters['global'].value" 
                            class="p-inputtext-sm" 
                            :placeholder="$t('user_management.search')" 
                            />
                        </span>
                    </div>
                </template>
                <template #empty>
                    <div class="p-d-flex p-jc-center">
                        <span>{{$t('user_management.table_empty_message')}}</span>
                    </div>
                </template>
                <Column field="rowIndex" header="#" style="width:5%"></Column>
                <Column field="distinguishedName" :header="$t('user_management.group_dn')" style="width:85%"></Column>
                <Column :exportable="false">
                    <template #body="slotProps">
                        <div class="p-d-flex p-jc-end">
                            <Button class="p-button-danger p-button-sm p-button-rounded" 
                                icon="pi pi-trash" 
                                :label="$t('user_management.delete')"
                                @click.prevent="deleteGroupConfirm = true; selectedGroup = slotProps.data">
                            </Button>
                        </div>
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>
</template>

<script>

import { FilterMatchMode } from 'primevue/api';
import { adManagementService } from "../../../../../../services/UserManagement/AD/AdManagement.js";

export default {
    props: {
        selectedUser: {
            type: Object,
            description: "Selected tree node",
        },
        userLdapBaseDn: {
            type: Object
        }
    },

    data() {
        return {
            groups: [],
            addUserGroupNode: null,
            userGroupLdapBaseDn: null,
            deleteGroupConfirm: false,
            selectedGroup: null,
            searchFields: [
                {
                    key: this.$t('tree.name'),
                    value: "cn"
                },
                {
                    key: this.$t('tree.folder'),
                    value: "ou"
                },
            ],
            filters: {
                'global': {value: null, matchMode: FilterMatchMode.CONTAINS}
            },
        }
    },

    mounted() {
        this.getGroupsOfSelectedUser();
    },

    methods: {
        selectUserGroupNodeClick(node) {
            this.addUserGroupNode = node;
        },

        updateNode(node){
            this.$emit('updatedUser', node);
        },

        getGroupsOfSelectedUser() {
            this.groups = [];
            if (this.selectedUser && this.selectedUser.type === "USER") {
                for (const key in this.selectedUser.attributesMultiValues) {
                    if (Object.hasOwnProperty.call(this.selectedUser.attributesMultiValues, key)) {
                        const element = this.selectedUser.attributesMultiValues[key];
                        if (key == "memberOf" && element.length > 0) {
                            for (let index = 0; index < element.length; index++) {
                                const groupDn = element[index];
                                this.groups.push({
                                    rowIndex: index + 1,
                                    distinguishedName: groupDn
                                });
                            }
                        }
                    }
                }
            }
        },

        async deleteUserFromGroup() {
            let params = new FormData();
            let dnList = [];
            dnList.push(this.selectedUser.distinguishedName);
            params.append("dn", this.selectedGroup.distinguishedName);
            params.append("dnList[]", dnList);

            const {response,error} = await adManagementService.deleteMemberUser(params);
            if(error){
                this.$toast.add({
                    severity:'error', 
                    detail: this.$t('user_management.delete_member_group_error'), 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                    });
            }
            else{
                if(response.status == 200){
                    let index = this.groups.findIndex(function(item, i){
                        return item.distinguishedName === response.data.distinguishedName;
                    });
                    if (index > -1) {
                        this.groups.splice(index, 1);
                    }
                    let newGroupsDn = [];
                    if (this.groups){
                        this.groups.forEach(element => {
                            newGroupsDn.push(element.distinguishedName);
                        });
                    }
                    this.selectedGroup = null;
                    this.deleteGroupConfirm = false;
                    let userNode = {...this.selectedUser};
                    userNode.attributesMultiValues.memberOf = newGroupsDn;
                    this.$emit('updateUser', userNode);
                    // this.$emit('updateNode', userNode, null);
                    this.updateRowIndex();
                    this.$toast.add({
                        severity:'success', 
                        detail: this.$t('user_management.delete_member_group_success'), 
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000
                    });
                }     
                          
                else if(response.status == 417){

                    this.$toast.add({
                        severity:'error', 
                        detail: this.$t('user_management.error_417_delete_member_group'), 
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000
                    });
                }
            }            
        },

        updateRowIndex() {
            for (let index = 0; index < this.groups.length; index++) {
                const element = this.groups[index];
                element.rowIndex = index + 1;
            }
        },

        isExistMemberInGroup(dn) {
            let isExist = false;
            for (let index = 0; index < this.groups.length; index++) {
                const element = this.groups[index];
                if (dn === element.distinguishedName) {
                    isExist = true;
                }
            }
            return isExist;
        }
    },

    watch : {
        selectedUser() {
            if (this.selectedUser && this.selectedUser.type === "USER") {
               this.getGroupsOfSelectedUser();
            } else {
                this.groups = null;
            }
        }
    }
}
</script>