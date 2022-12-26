<template>
    <Dialog :header="$t('user_management.add_to_group')" 
      v-model:visible="addUserToGroupDialog" 
      :style="{width: '40vw'}" :modal="true"
    >
      <div class="p-grid p-flex-column">
        <div class="p-col">
          <tree-component 
            ref="usergrouptree"
            loadNodeUrl="/api/lider/user-groups/groups"
            loadNodeOuUrl="/api/lider/user-groups/ou-details"
            :treeNodeClick="selectUserGroupNodeClick"
            :searchFields="searchFields"
          />
        </div>
        <div class="p-col p-text-center">
          <small>{{$t('user_management.select_group_warn')}}</small>
        </div>
      </div>
      <template #footer>
        <Button 
          :label="$t('user_management.cancel')" 
          icon="pi pi-times"
          @click="addUserToGroupDialog = false" 
          class="p-button-text p-button-sm">
        </Button>
        <Button class="p-button-sm"
          :label="$t('user_management.add')"
          icon="pi pi-plus" 
          @click="addUserToGroup">
        </Button>
      </template>
    </Dialog>
    <Dialog 
        :header="$t('computer.task.toast_summary')" 
        v-model:visible="deleteGroupConfirm"  
        :modal="true" 
        @hide="updateUserConfirm = false">
        <div class="confirmation-content">
            <i class="pi pi-info-circle p-mr-3" style="font-size: 2rem" />
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
        <div class="p-field p-d-flex p-jc-end" v-if="selectedNode && selectedNode.type == 'USER'">
            <Button 
                icon="pi pi-plus"
                class="p-button-sm"
                type="button" @click="addUserToGroupDialog = true" 
                :label="$t('user_management.add_to_group')">
            </Button>
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
                <Column field="distinguishedName" :header="$t('user_management.group_dn')"></Column>
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
import {FilterMatchMode} from 'primevue/api';
import { profileService } from "../../../../services/Profile/ProfileService.js";
import { userService } from "../../../../services/Settings/UserService.js";
import { userGroupsService } from "../../../../services/Settings/UserGroupsService.js";


export default {
    props: {
        selectedNode: {
            type: Object,
            description: "Selected tree node",
        },
        userLdapBaseDn: {
            type: Object
        }
    },

    data() {
        return {
            groups: null,
            addUserGroupNode: null,
            addUserToGroupDialog: false,
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

        async getGroupsOfSelectedUser() {
            if (this.selectedNode && this.selectedNode.type === "USER") {
                let params = new FormData();
                params.append("searchDn", this.userLdapBaseDn.userGroupLdapBaseDn);
                params.append("key", "member");
                params.append("value", this.selectedNode.distinguishedName);

                const{ response,error } = await profileService.searchEntry(params);
                if(error){
                    this.$toast.add({
                        severity:'error', 
                        detail: this.$t('user_management.user_not_found'), 
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000
                    });
                }
                else{
                    if(response.status == 200){
                        this.groups = response.data;
                        this.updateRowIndex();
                    }
                    else if(response.status == 417){
                        this.$toast.add({
                            severity:'error', 
                            detail: this.$t('user_management.error_417_user_not_found'), 
                            summary:this.$t("computer.task.toast_summary"), 
                            life: 3000
                    });
                    }
                }
            }
        },

        async deleteUserFromGroup() {
            let params = new FormData();
            params.append("dn", this.selectedGroup.distinguishedName);
            params.append("attribute", "member");
            params.append("value", this.selectedNode.distinguishedName);

            const{response,error} = await userService.deleteAttributeAndValue(this.selectedGroup.distinguishedName,"member",this.selectedNode.distinguishedName);
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
                    if (response.data) {
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
                        let userNode = {...this.selectedNode};
                        userNode.attributesMultiValues.memberOf = newGroupsDn;
                        this.$emit('updatedUser', userNode);
                        this.updateRowIndex();
                        this.$toast.add({
                            severity:'success', 
                            detail: this.$t('user_management.delete_member_group_success'), 
                            summary:this.$t("computer.task.toast_summary"), 
                            life: 3000
                        });
                    }   
                    else {
                        this.$toast.add({
                            severity:'error', 
                            detail: this.$t('user_management.delete_member_group_error'), 
                            summary:this.$t("computer.task.toast_summary"), 
                            life: 3000
                        });
                    }
                }
            }
        },

        updateRowIndex() {
            for (let index = 0; index < this.groups.length; index++) {
                const element = this.groups[index];
                element.rowIndex = index + 1;
            }
        },

        async addUserToGroup() {
            if (!this.addUserGroupNode) {
                this.$toast.add({
                    severity:'warn', 
                    detail: this.$t('user_management.select_group_warn'), 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
                return;
            }
            if (this.addUserGroupNode && this.addUserGroupNode.type != "GROUP") {
                this.$toast.add({
                    severity:'warn', 
                    detail: this.$t('user_management.select_group_warn'), 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
                return;
            }

            if (this.isExistMemberInGroup(this.addUserGroupNode.distinguishedName)) {
                this.$toast.add({
                    severity:'warn', 
                    detail: this.$t('user_management.user_already_exist_in_group'), 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
                return;
            }
            let params = new FormData();
            let member = [];
            member.push(this.selectedNode.distinguishedName);
            params.append("checkedList[]", member);
            params.append("groupDN", this.addUserGroupNode.distinguishedName);

            const{response,error} = await userGroupsService.addGroups(params);
            if(error){
                this.$toast.add({
                    severity:'error', 
                    detail: this.$t('user_management.add_user_to_group_error')+ " \n"+error, 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
            }else{
                if(response.status == 200){
                    this.groups.push(response.data);
                    let userNode = {...this.selectedNode};
                    userNode.attributesMultiValues.memberOf = this.groups;
                    this.$emit('updatedUser', userNode);
                    this.$toast.add({
                        severity:'success', 
                        detail: this.$t('user_management.add_user_to_group_success'), 
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000
                    });
                    this.addUserToGroupDialog = false;
                }
                else if(response.status == 417){
                    return "error";
                }
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
        selectedNode() {
            if (this.selectedNode && this.selectedNode.type === "USER") {
               this.getGroupsOfSelectedUser();
            } else {
                this.groups = null;
            }
        }
    }
}
</script>