<template>
    <Dialog :header="$t('Sunucu ekle')" v-model:visible="modalVisible" style="width:85vw;" position="top">            
                <div class="p-grid">
                    <div class="p-col-6">
                        <div class="p-fluid p-formgrid p-grid">
                            <div class="p-field p-col-12">
                                <label for="id">{{$t('id')}}*</label>
                                <InputText id="uid" type="text" v-model="userForm.uid"/>
                            </div>
                            <div class="p-field p-col-12">
                                <label for="hostname">{{$t('Hostname')}}*</label>
                                <InputText id="sn" type="text" v-model="userForm.sn"/>
                            </div>
                            <div class="p-field p-col-12">
                                <label for="ip">{{$t('Ip')}}*</label>
                                <InputText id="mail" type="text" v-model="userForm.mail"/>
                            </div>
                            <div class="p-field p-col-12">
                                <label for="user">{{$t('Kullanıcı')}}*</label>
                                <InputText id="telephoneNumber" type="text" v-model="userForm.telephoneNumber"/>
                            </div>
                        </div>
                    </div>
                    <div class="p-col-6">
                        <password-component ref="password"></password-component>
                    </div>
                    <div class="p-col-12 p-d-flex p-jc-end">
                        <Button icon="pi pi-save" :label="$t('Kaydet')" @click="addNewConsoleUser"></Button>
                    </div>
                </div>
        <template #footer>

            <Button :label="$t('settings.console_user_settings.close')" icon="pi pi-times" @click="modalVisible = false" class="p-button-text"/>
            
        </template>
    </Dialog>

</template>
<script>

import PasswordComponent from '@/components/Password/PasswordComponent.vue';
import { consoleUserSettingsService } from "../../../../services/Settings/ConsoleUserSettingsService.js";
import { userService } from "../../../../services/Settings/UserService.js";


export default {
    components:{
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
                } 
                else {
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
            this.userForm.userPassword = this.$refs.password.getPassword();
            if (!this.userForm.userPassword) {
                return;
            }
            let data = new FormData();
            data.append('uid', this.userForm.uid);
            data.append('cn',this.userForm.cn);
            data.append('sn',this.userForm.sn);
            data.append('userPassword', this.userForm.userPassword);
            data.append('telephoneNumber', this.userForm.telephoneNumber);
            data.append('homePostalAddress', this.userForm.homePostalAddress);
            data.append('mail', this.userForm.mail);

            const { response, error } = await userService.addUser(data);
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
                } 
                else if (response.status ==  417) {
                    this.$toast.add({
                        severity:'error', 
                        detail: this.$t('settings.console_user_settings.error_417_user_create'), 
                        summary: this.$t('settings.console_user_settings.error'), 
                        life: 3000
                    });
                }
                else if (response.status ==  226) {
                    this.$toast.add({
                        severity:'error', 
                        detail: this.$t('settings.console_user_settings.error_226_user_id_found'), 
                        summary: this.$t('settings.console_user_settings.error'), 
                        life: 3000
                    });
                }
            }
        },

        async setSelectedGroupNode(node) {
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

            const {response,error} = await consoleUserSettingsService.addMemberToGroup(data);
            if(error){

                this.$toast.add({
                    severity:'error', 
                    detail: this.$t('settings.console_user_settings.error_user_add_to_group'), 
                    summary: this.$t('settings.console_user_settings.error'), 
                    life: 3000
                });                
            }
            else{
                
                if (response.status == 200) {
                    
                    this.groupMembers = [];
                    this.groupPrivilages = [];
                    this.selectedGroupNode = null;
                    this.selectedUserNode = null;
                    this.modalVisible = false;

                    this.$toast.add({
                    severity:'success', 
                    detail: this.$t('settings.console_user_settings.user_add_to_group'), 
                    summary: this.$t('settings.console_user_settings.successful'), 
                    life: 3000
                }); 
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
        }
    }
}

</script>