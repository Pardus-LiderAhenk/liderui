<template>
    <div>
        <Dialog :header="$t('settings.console_user_settings.add_console_user')" v-model:visible="modalVisible" 
            style="width:40vw;" :modal="true">
            <tree-component 
                ref="agentsTree"
                loadNodeUrl="/api/lider/user/users"
                loadNodeOuUrl="/api/lider/user/ou-details"
                :treeNodeClick="setSelectedUserNode"
                :searchFields="searchFields"
                :scrollHeight="25"
            />
            <template #footer>
                <Button :label="$t('settings.console_user_settings.close')" 
                    icon="pi pi-times" @click="modalVisible = false" class="p-button-text"
                />
                <Button :label="$t('settings.console_user_settings.grant_user_lider_user_authorization')" 
                    icon="pi pi-check" @click="addConsoleUserConfirmDialog = true" autofocus 
                    :disabled="userPrivilege"
                />
            </template>
        </Dialog>

        <LiderConfirmDialog 
            :showDialog="addConsoleUserConfirmDialog"
            @showDialog="addConsoleUserConfirmDialog = $event;"
            :header="$t('settings.console_user_settings.grant_user_lider_user_authorization')"
            :message="$t('settings.console_user_settings.grant_access_interface_question')"
            @accepted="addAsConsoleUser"
        />
    </div>
</template>


<script>
import TreeComponent from '@/components/Tree/TreeComponent.vue';
import { consoleUserSettingsService } from "../../../../services/Settings/ConsoleUserSettingsService.js";


export default {
    components:{
        TreeComponent,
    },
    props: ['modalVisibleValue'],
    emits:['updateConsoleUsers'],
    data(){
        return {
            selectedUserNode:null,
            searchFields: [
                {
                    key: this.$t('tree.cn'),
                    value: "cn"
                },
                {
                    key: this.$t('tree.uid'),
                    value: "uid"
                },
                {
                    key: this.$t('tree.folder'),
                    value: "ou"
                },
                {
                    key: this.$t('tree.last_session'),
                    value: "o"
                }
            ],
            groupPrivilages: [],
            addConsoleUserConfirmDialog: false
            
        }
    },
    computed: {
        modalVisible: {
            get() {
                return this.modalVisibleValue;
            },
            set() {
                this.$emit('modalVisibleValue', false);
            }
        },

        userPrivilege: {
            get() {
                let isUserPrivilege = false;
                if (this.selectedUserNode && this.selectedUserNode.type == "USER") {
                    if (this.selectedUserNode.attributesMultiValues !=null && 
                        this.selectedUserNode.attributesMultiValues.liderPrivilege != null && 
                        this.selectedUserNode.attributesMultiValues.liderPrivilege.includes('ROLE_USER')) {
                            isUserPrivilege = true;
                    }
                } else {
                    isUserPrivilege = true;
                }
                return isUserPrivilege;
            }
        }
    },
    methods:{
        async addAsConsoleUser(){
            if (this.selectedUserNode) {
                let data = new FormData();
                data.append('dn', this.selectedUserNode.distinguishedName);
                data.append('roles[]', ['ROLE_USER']);
                const {response, error} = await consoleUserSettingsService.editUserRoles(data);

                if(response.status == 200){
                    this.$toast.add({
                        severity:'success', 
                        detail: this.$t('settings.console_user_settings.the_user_has_been_successfully_authorized'), 
                        summary: this.$t('settings.console_user_settings.successful'), 
                        life: 3000
                    });
                    this.$emit('addedConsoleUsers');
                }
                else if (response.status == 417){
                    this.$toast.add({
                        severity:'error', 
                        detail: this.$t('settings.console_user_settings.error_417_edit_user_roles'),
                        summary: this.$t('settings.console_user_settings.user_not_select'),
                        life: 3000
                    });
                }
            } else {
                this.$toast.add({
                    severity:'error', 
                    detail: this.$t('settings.console_user_settings.please_select_the_user_you_want_to_be_authorized'),
                    summary: this.$t('settings.console_user_settings.user_not_select'),
                    life: 3000
                });
            }
            this.addConsoleUserConfirmDialog = false;
        },
        
        setSelectedUserNode(node) {
            this.selectedUserNode = node;
        },
    }
}
</script>
