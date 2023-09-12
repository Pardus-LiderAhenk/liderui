<template>
    <div>
        <Dialog :header="$t('settings.console_user_settings.grant_directory_access')"
            v-model:visible="modalVisible" maximizable style="width:70vw;" :modal="true">
            <div class="p-grid" v-if="selectedUserNode != null">
                <div class="p-col-12 p-md-6 p-lg-3">
                    <tree-component 
                        ref="groupstree"
                        loadNodeUrl="/api/lider/user-groups/groups"
                        loadNodeOuUrl="/api/lider/user-groups/ou-details"
                        :treeNodeClick="setSelectedGroupNode"
                        :searchFields="searchFieldsFolder"
                        :scrollHeight="45"
                    />
                </div>
                <div class="p-col-12 p-md-6 p-lg-4">
                    <Panel :header="$t('settings.console_user_settings.group_members')">
                        <DataTable :value="groupMembers" class="p-datatable-sm"
                            :title="$t('settings.console_user_settings.group_members')"
                            v-model:filters="filters"
                            >
                            <template #header>
                                <div class="p-d-flex p-jc-end">
                                    <span class="p-input-icon-left">
                                        <i class="pi pi-search"/>
                                        <InputText v-model="filters['global'].value" 
                                        class="p-inputtext-sm" 
                                        :placeholder="$t('settings.console_user_settings.search')" 
                                        />
                                    </span>
                                </div>
                            </template>
                            <Column header="#">
                                <template #body="slotProps">
                                    <p>{{slotProps.index + 1}}</p>
                                </template>
                            </Column>
                            <Column field="uid" :header="$t('settings.console_user_settings.member_dn')"></Column>
                        </DataTable>
                    </Panel>
                </div>
                <div class="p-col-12 p-md-6 p-lg-5">
                    <Panel :header="$t('settings.console_user_settings.access_granted_dn')">
                    <DataTable :value="groupPrivilages" responsiveLayout="scroll"
                        class="p-datatable-sm" v-model:filters="filters2"
                        title="Erişim Yetkisi Verilen DN"
                    >
                        <template #header>
                            <div class="p-d-flex p-jc-end">
                                <span class="p-input-icon-left">
                                    <i class="pi pi-search"/>
                                    <InputText v-model="filters2['global'].value" 
                                    class="p-inputtext-sm" 
                                    :placeholder="$t('settings.console_user_settings.search')" 
                                    />
                                </span>
                            </div>
                        </template>
                        <Column header="#" style="width: 3rem">
                                <template #body="slotProps">
                                <p>{{slotProps.index + 1}}</p>
                            </template>
                        </Column>
                        <Column field="accessDN" header="DN"></Column>
                        <Column :header="$t('settings.console_user_settings.authority')">
                            <template #body="slotProps">
                                {{
                                    slotProps.data != null && slotProps.data.accessType == "write" ? "Okuma ve Yazma" : "Okuma"
                                }}
                            </template>
                        </Column>
                    </DataTable>
                </Panel>
                </div>
            </div>
            <div v-if="selectedUserNode == null">
                <p>{{$t('settings.console_user_settings.tab_warning')}}</p>
            </div>
            <template #footer>
                <Button :label="$t('settings.console_user_settings.close')" 
                    icon="pi pi-times" @click="modalVisible = false" class="p-button-text p-button-sm"
                />
                <Button :label="$t('settings.console_user_settings.add_to_group')" class="p-button-sm"
                    icon="pi pi-users" @click="addUserToGroupConfirmDialog = true" autofocus 
                    :disabled="userPrivilege"
                />
            </template>
        </Dialog>

        <LiderConfirmDialog 
            :showDialog="addUserToGroupConfirmDialog"
            @showDialog="addUserToGroupConfirmDialog = $event;"
            header="Dizin Erişim Yetkisi"
            message="Kullanıcı gruba eklenecektir, emin misiniz?"
            @accepted="addUserToGroup"
        />
    </div>
</template>


<script>
import TreeComponent from '@/components/Tree/TreeComponent.vue';
import {FilterMatchMode} from 'primevue/api';
import { consoleUserSettingsService } from "../../../../services/Settings/ConsoleUserSettingsService.js";


export default {
    components:{
        TreeComponent,
    },
    props: ['showUserDirectoryAccessSettingsDialog', 'selectedUserNode'],
    emits:['updateConsoleUsers'],
    data(){
        return {
            searchFieldsFolder: [
                {
                    key: this.$t('tree.name'),
                    value: "cn"
                },
                {
                    key: this.$t('tree.folder'),
                    value: "ou"
                },
            ],
            groupMembers: [],
            selectedGroupNode: null,
            groupPrivilages: [],
            addUserToGroupConfirmDialog: false,
            filters: {
                'global': {value: null, matchMode: FilterMatchMode.CONTAINS}
            },
            filters2: {
                'global': {value: null, matchMode: FilterMatchMode.CONTAINS}
            },
        }
    },
    computed: {
        modalVisible: {
            get() {
                return this.showUserDirectoryAccessSettingsDialog;
            },
            set() {
                this.$emit('closeUserDirectoryAccessSettingsDialog', false);
            }
        },
    },

    methods:{
        async setSelectedGroupNode(node) {
            this.groupMembers = [];
            this.selectedGroupNode = node;
            if (node.type === "GROUP"){
                node.attributesMultiValues.member.forEach((mem,index) => {
                    this.groupMembers.push({
                        id : index + 1,
                        uid : mem
                    })
                });
            }

            let data = new FormData();
            data.append('dn',node.distinguishedName);
            
            const {response,error} = await consoleUserSettingsService.olcAccessRules(node.distinguishedName);
            if(error){
                this.$toast.add({
                    severity:'error',
                    detail:this.$t('settings.console_user_settings.an_unexpected_problem_was_encountered'),
                    summary:this.$t('settings.console_user_settings.error'),
                    life:3600
                    });   
            }
            else{
                if(response.status == 200){
                    this.groupPrivilages = response.data;
                }
                else{
                    this.$toast.add({
                        severity:'error',
                        detail:this.$t('settings.console_user_settings.an_unexpected_problem_was_encountered'),
                        summary:this.$t('settings.console_user_settings.error'),
                        life:3600
                        });     
                    }
            }
        },

        async addUserToGroup() {
            if (this.selectedUserNode == null || this.selectedGroupNode == null) {
                this.$toast.add({
                    severity:'warn', 
                    detail:  this.$t('settings.console_user_settings.please_select_user_and_group'), 
                    summary: this.$t('settings.console_user_settings.error'), 
                    life: 3000
                });
                return;
            }
            if (this.selectedGroupNode.type != "GROUP") {
                this.$toast.add({
                    severity:'warn', 
                    detail:  this.$t('settings.console_user_settings.please_select_group'),
                    summary: this.$t('settings.console_user_settings.error'), 
                    life: 3000
                });
                return;
            }

            let data = new FormData();
            data.append('distinguishedName',this.selectedUserNode.distinguishedName);
            data.append('parentName',this.selectedGroupNode.distinguishedName);

            const {response,error} = await consoleUserSettingsService.addMemberToGroup(data);
            if(error){

                this.$toast.add({
                    severity:'error', 
                    detail: this.$t('settings.console_user_settings.error_user_add_to_group'), 
                    summary: this.$t('settings.console_user_settings.error'), 
                    life: 3000
                });                
            } else{
                if (response.status == 200) {
                    this.groupMembers = [];
                    this.groupPrivilages = [];
                    this.selectedGroupNode = null;
                    this.$emit('addedUserToGroup');
                    // this.selectedUserNode = null;
                } 
                else if(response.status == 417){
                    this.$toast.add({
                        severity:'error', 
                        detail: this.$t('settings.console_user_settings.error_417_user_add_to_group'), 
                        summary: this.$t('settings.console_user_settings.error'), 
                        life: 3000
                    });                    
                }
            }
            this.addUserToGroupConfirmDialog = false;
        }
    }
}
</script>
