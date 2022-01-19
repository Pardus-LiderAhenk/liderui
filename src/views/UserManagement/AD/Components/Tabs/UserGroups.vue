<template>
    <Dialog :header="$t('user_management.add_to_group')" 
      v-model:visible="addUserToGroupDialog" 
      :style="{width: '40vw'}" :modal="true"
    >
      <div class="p-grid p-flex-column">
        <div class="p-col">
          <tree-component 
            ref="usergrouptree"
            loadNodeUrl="/lider/user_groups/getGroups"
            loadNodeOuUrl="/lider/user_groups/getOuDetails"
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
        <div class="p-field p-d-flex p-jc-end" v-if="selectedUser && selectedUser.type == 'USER'">
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
import axios from "axios";
import {FilterMatchMode} from 'primevue/api';

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

        deleteUserFromGroup() {
            let params = new FormData();
            params.append("dn", this.selectedGroup.distinguishedName);
            params.append("attribute", "member");
            params.append("value", this.selectedUser.distinguishedName);
            axios.post("/lider/user/removeAttributeWithValue", params).then((response) => {
                if (response.data) {
                    let index = this.groups.findIndex(function(item, i){
                        return item.distinguishedName === response.data.distinguishedName;
                    });
                    if (index > -1) {
                        this.groups.splice(index, 1);
                    }
                    this.selectedGroup = null;
                    this.deleteGroupConfirm = false;
                    let userNode = {...this.selectedUser};
                    userNode.attributesMultiValues.memberOf = this.groups;
                    this.$emit('updatedUser', userNode);
                    this.updateRowIndex();
                    this.$toast.add({
                        severity:'success', 
                        detail: this.$t('user_management.delete_member_group_success'), 
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000
                    });
                } else {
                    this.$toast.add({
                        severity:'error', 
                        detail: this.$t('user_management.delete_member_group_error'), 
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000
                    });
                }
            }).catch((error) => {
                this.$toast.add({
                    severity:'error', 
                    detail: this.$t('user_management.delete_member_group_error'), 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
            });
        },

        updateRowIndex() {
            for (let index = 0; index < this.groups.length; index++) {
                const element = this.groups[index];
                element.rowIndex = index + 1;
            }
        },

        addUserToGroup() {
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
            member.push(this.selectedUser.distinguishedName);
            params.append("checkedList[]", member);
            params.append("groupDN", this.addUserGroupNode.distinguishedName);
            axios.post("/lider/user_groups/group/existing", params).then((response) => {
                this.groups.push(response.data);
                let userNode = {...this.selectedUser};
                userNode.attributesMultiValues.memberOf = this.groups;
                this.$emit('updatedUser', userNode);
                this.$toast.add({
                    severity:'success', 
                    detail: this.$t('user_management.add_user_to_group_success'), 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
                this.addUserToGroupDialog = false;
            }).catch((error) => {
                this.$toast.add({
                    severity:'error', 
                    detail: this.$t('user_management.add_user_to_group_error')+ " \n"+error, 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
            });
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