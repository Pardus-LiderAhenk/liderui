<template>
    <Dialog :header="$t('settings.console_user_settings.add_console_user')" v-model:visible="modalVisible" style="width:85vw;" position="top">
        <TabView>
            <TabPanel :header="$t('settings.console_user_settings.create_new_lider_user')">
                <div class="p-grid">
                    <div class="p-col-6">
                        <div class="p-fluid p-formgrid p-grid">
                            <div class="p-field p-col-12">
                                <label for="uid">{{$t('settings.console_user_settings.identity')}}*</label>
                                <InputText id="uid" type="text" v-model="userForm.uid"/>
                            </div>
                            <div class="p-field p-col-12">
                                <label for="cn">{{$t('settings.console_user_settings.username')}}*</label>
                                <InputText id="cn" type="text" v-model="userForm.cn"/>
                            </div>
                            <div class="p-field p-col-12">
                                <label for="sn">{{$t('settings.console_user_settings.user_surname')}}*</label>
                                <InputText id="sn" type="text" v-model="userForm.sn"/>
                            </div>
                            <div class="p-field p-col-12">
                                <label for="mail">{{$t('settings.console_user_settings.mail_address')}}*</label>
                                <InputText id="mail" type="text" v-model="userForm.mail"/>
                            </div>
                            <div class="p-field p-col-12">
                                <label for="telephoneNumber">{{$t('settings.console_user_settings.phone')}}*</label>
                                <InputText id="telephoneNumber" type="text" v-model="userForm.telephoneNumber"/>
                            </div>
                            <div class="p-field p-col-12">
                                <label for="homePostalAddress">{{$t('settings.console_user_settings.address')}}</label>
                                <InputText id="homePostalAddress" type="text" v-model="userForm.homePostalAddress"/>
                            </div>
                        </div>
                    </div>
                    <div class="p-col-6">
                        <password-component ref="userForm.userPassword"></password-component>
                    </div>
                    <div class="p-col-12 p-d-flex p-jc-end">
                        <Button icon="pi pi-user-plus" :label="$t('settings.console_user_settings.create')" @click="addNewConsoleUser"></Button>
                    </div>
                </div>
            </TabPanel>
            <TabPanel :header="$t('settings.console_user_settings.grant_access_to_existing_users')">
                <Toolbar>
                    <template #end>
                        <Button :label="$t('settings.console_user_settings.grant_user_lider_user_authorization')" icon="pi pi-check" @click="addAsConsoleUser" autofocus :disabled="(selectedUserNode != null && selectedUserNode.attributesMultiValues !=null && selectedUserNode.attributesMultiValues.liderPrivilege != null && selectedUserNode.attributesMultiValues.liderPrivilege.includes('ROLE_USER')) ? true : false"/>
                    </template>
                </Toolbar>
                <tree-component 
                    ref="agentsTree"
                    loadNodeUrl="/api/lider/user/users"
                    loadNodeOuUrl="/api/lider/user/ou-details"
                    :treeNodeClick="setSelectedUserNode"
                    :searchFields="searchFields"
                />
                
            </TabPanel>
            <TabPanel :header="$t('settings.console_user_settings.grant_directory_access')">
                 <div class="p-grid" v-if="selectedUserNode != null">
                    <div class="p-col-3">
                        <tree-component 
                            ref="groupstree"
                            loadNodeUrl="/api/lider/user-groups/groups"
                            loadNodeOuUrl="/api/lider/user-groups/ou-details"
                            :treeNodeClick="setSelectedGroupNode"
                            :searchFields="searchFieldsFolder"
                        />
                    </div>
                    <div class="p-col-3">
                        <div class="p-col-12">
                            <p>{{$t('settings.console_user_settings.group_members')}}</p>
                        </div>
                        <DataTable :value="groupMembers" responsiveLayout="scroll" 
                            >
                            <Column header="#">
                                    <template #body="slotProps">
                                    <p>{{slotProps.index + 1}}</p>
                                </template>
                            </Column>
                            <Column field="uid" :header="$t('settings.console_user_settings.member_dn')"></Column>
                        </DataTable>
                    </div>
                    <div class="p-col-6">
                        <div class="p-col-12 p-d-flex p-jc-end">
                            <Button type="button" :label="$t('settings.console_user_settings.add_to_group')"  iconPos="right" @click="addUserToGroup" />
                            
                        </div>
                        <DataTable :value="groupPrivilages" responsiveLayout="scroll" 
                            >
                            <Column header="#">
                                    <template #body="slotProps">
                                    <p>{{slotProps.index + 1}}</p>
                                </template>
                            </Column>
                            <Column field="accessDN" header="Erişim Yetkisi Verilen DN"></Column>
                            <Column header="Yetki">
                                <template #body="slotProps">
                                    {{
                                            slotProps.data != null && slotProps.data.accessType == "write" ? "Okuma ve Yazma" : "Okuma"
                                    }}
                                </template>
                            </Column>
                        </DataTable>
                    </div>
                </div>
                <div v-if="selectedUserNode == null">
                    <p>{{$t('settings.console_user_settings.tab_warning')}}</p>
                </div>
            </TabPanel>
        </TabView>
        <template #footer>
            <Button :label="$t('settings.console_user_settings.close')" icon="pi pi-times" @click="modalVisible = false" class="p-button-text"/>
            
        </template>
    </Dialog>

</template>


<script>
import TreeComponent from '@/components/Tree/TreeComponent.vue';

import PasswordComponent from '@/components/Password/PasswordComponent.vue';
import { consoleUserSettingsService } from "../../../../services/Settings/ConsoleUserSettingsService.js";

export default {
    components:{
        TreeComponent,
        PasswordComponent
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
            userForm: {
                uid:'',
                cn:'',
                sn:'',
                telephoneNumber:'',
                homePostalAddress:'',
                mail:'',
                userPassword: '',
                userPasswordConfirm:null,
            },
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
    },
    methods:{
        addAsConsoleUser(){
            if (this.selectedUserNode) {
                let data = new FormData();
                console.log('Selected user node', this.selectedUserNode);
                data.append('dn', this.selectedUserNode.distinguishedName);
                data.append('roles[]', ['ROLE_USER']);
                const {response, error} = consoleUserSettingsService.editUserRoles(data);

                //axios.post('/lider/settings/editUserRoles',data).then(response => {
                if(response.status == 200){
                    this.$toast.add({
                        severity:'success', 
                        detail: this.$t('settings.console_user_settings.the_user_has_been_successfully_authorized'), 
                        summary: this.$t('settings.console_user_settings.successful'), 
                        life: 3000
                    });
                    this.$emit('updateConsoleUsers');
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
        },
        setSelectedUserNode(node) {
            this.selectedUserNode = node;
        },
        async addNewConsoleUser(){
            let data = new FormData();
            data.append('uid', this.userForm.uid);
            data.append('cn',this.userForm.cn);
            data.append('sn',this.userForm.sn);
            data.append('userPassword', this.userForm.userPassword);
            data.append('telephoneNumber', this.userForm.telephoneNumber);
            data.append('homePostalAddress', this.userForm.homePostalAddress);
            data.append('mail', this.mail);

            const { response, error } = await consoleUserSettingsService.addUser(data);
            if(error){
                this.$toast.add({
                    severity:'error', 
                    detail: this.$t('settings.console_user_settings.an_unexpected_problem_was_encountered'), 
                    summary: this.$t('settings.console_user_settings.error'), 
                    life: 3000
                });
            } else {
                if(response.status == 200) {
                    this.$toast.add({
                        severity:'success', 
                        detail: this.$t('settings.console_user_settings.user_successfully_create'), 
                        summary: this.$t('settings.console_user_settings.successful'), 
                        life: 3000
                    });
                    this.userForm = {
                        cn : null,
                        uid: null,
                        sn : null,
                        userPassword : null,
                        telephoneNumber : null,
                        homePostalAddress : null,
                        mail : null,
                    }
                } else if (response.status ==  417) {
                    this.$toast.add({
                        severity:'error', 
                        detail: this.$t('settings.console_user_settings.error_417_user_create'), 
                        summary: this.$t('settings.console_user_settings.error'), 
                        life: 3000
                    });
                }
            }
        },
        setSelectedGroupNode(node) {
            this.groupMembers = [];
            this.selectedGroupNode = node;
            node.attributesMultiValues.member.forEach((mem,index) => {
                this.groupMembers.push({
                    id : index + 1,
                    uid : mem
                })
            });

            let data = new FormData();
            data.append('dn',node.distinguishedName);
            
            const {response,error} = consoleUserSettingsService.olcAccessRules(data);
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

        addUserToGroup() {

            if (this.selectedUserNode == null || this.selectedGroupNode == null) {
                this.$toast.add({
                    severity:'error', 
                    detail:  this.$t('settings.console_user_settings.please_select_user_and_group'), 
                    summary: this.$t('settings.console_user_settings.error'), 
                    life: 3000
                });
                return;
            }


            let data = new FormData();
            data.append('distinguishedName',this.selectedUserNode.distinguishedName);
            data.append('parentName',this.selectedGroupNode.distinguishedName);
            //axios.post('/lider/settings/addMemberToGroup', data).then(response => {
            const {response,error} = consoleUserSettingsService.addMemberToGroup(data);
            if (response.status === 200) {
                this.$toast.add({
                    severity:'success', 
                    detail: this.$t('settings.console_user_settings.user_successfully_add_to_group'), 
                    summary: this.$t('settings.console_user_settings.successful'), 
                    life: 3000
                });
                this.groupMembers = [];
                this.groupPrivilages = [];
                this.selectedGroupNode = null;
                this.selectedUserNode = null;
                this.modalVisible = false;
            }
            

            
        }
    
}
</script>
