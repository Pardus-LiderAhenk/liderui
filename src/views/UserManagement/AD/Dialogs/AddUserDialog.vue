<template>
    <div>
        <!-- Add User Dialog -->
        <Dialog :header="$t('user_management.add_user')" 
            v-model:visible="showDialog" :style="{width: '40vw'}" :modal="true">
            <div class="confirmation-content">
                <div class="p-fluid p-formgrid p-grid">
                    
                    <div class="p-field p-col-12">
                        <label for="firstname6">{{$t('user_management.username')}}</label>
                        <InputText :class="userValidation.name ? 'p-invalid p-inputtext-sm': 'p-inputtext-sm'" 
                            type="text" v-model="user.name"
                        />
                        <small v-if="userValidation.name" class="p-error">
                            {{$t('user_management.cn_warn')}}
                        </small>
                    </div>
                    <div class="p-field p-col-12">
                        <label for="firstname6">{{$t('user_management.surname')}}</label>
                        <InputText :class="userValidation.sn ? 'p-invalid p-inputtext-sm': 'p-inputtext-sm'" 
                            type="text" v-model="user.sn"
                        />
                        <small v-if="userValidation.sn" class="p-error">
                            {{$t('user_management.sn_warn')}}
                        </small>
                    </div>
                    <div class="p-field p-col-12">
                        <label for="firstname6">{{$t('user_management.full_name')}}</label>
                        <InputText :class="userValidation.cn ? 'p-invalid p-inputtext-sm': 'p-inputtext-sm'" 
                            v-model="user.cn" type="text"
                        />
                        <small v-if="userValidation.cn" class="p-error">
                            {{$t('user_management.cn_warn')}}
                        </small>
                    </div>
                    <div class="p-field p-col-12">
                        <label for="firstname6">{{$t('user_management.logon_name')}}</label>
                        <InputText :class="userValidation.uid ? 'p-invalid p-inputtext-sm': 'p-inputtext-sm'" 
                            v-model="user.uid" type="text"
                        />
                        <small v-if="userValidation.uid" class="p-error">
                            {{$t('user_management.logon_name_warn')}}
                        </small>
                    </div>
                    <div class="p-field p-col-12">
                        <label for="firstname6">{{$t('user_management.mail_address')}}</label>
                        <span class="p-input-icon-right">
                            <i class="pi pi-envelope" />
                            <InputText :class="userValidation.mail ? 'p-invalid p-inputtext-sm': 'p-inputtext-sm'" 
                                type="text" v-model="user.mail"
                            />
                            <small v-if="userValidation.mail" class="p-error">
                                {{$t('user_management.mail_warn')}}
                            </small>
                        </span>
                    </div>
                    <div class="p-field p-col-12">
                        <label for="firstname6">{{$t('user_management.telephone_number')}}</label>
                        <span class="p-input-icon-right">
                            <i class="pi pi-phone"></i>
                            <InputMask :class="userValidation.telephoneNumber ? 'p-invalid p-inputtext-sm': 'p-inputtext-sm'" 
                                mask="(999) 999-9999" v-model="user.telephoneNumber" placeholder="(999) 999-9999" 
                            />
                            <small v-if="userValidation.telephoneNumber" class="p-error">
                                {{$t('user_management.telephone_number_warn')}}
                            </small>
                        </span>
                    </div>
                    <div class="p-field p-col-12">
                        <label for="firstname6">{{$t('user_management.address')}}</label>
                        <Textarea :class="userValidation.homePostalAddress ? 'p-invalid': ''" 
                            :autoResize="true" rows="2" cols="30" v-model="user.homePostalAddress"
                        />
                        <small v-if="userValidation.homePostalAddress" class="p-error">
                            {{$t('user_management.address_warn')}}
                        </small>
                    </div>
                    <div class="p-filed p-col-12">
                        <password-component ref="password" 
                            :isSmallInput="true"
                            :passwordLength="8">
                        </password-component>
                    </div>
                </div>
            </div>
            <template #footer>
                <Button :label="$t('user_management.cancel')" icon="pi pi-times" 
                    @click="showDialog = false" class="p-button-text p-button-sm"
                />
                <Button :label="$t('user_management.add')" icon="pi pi-user-plus" 
                    @click="addUser" class="p-button-sm"
                />
            </template>
        </Dialog>
        <!-- Add User Dialog End -->
    </div>
</template>


<script>
/**
 * Create user to AD
 * @see {@link http://www.liderahenk.org/}
 */

import PasswordComponent from '@/components/Password/PasswordComponent.vue';
import { adManagementService } from "../../../../services/UserManagement/AD/AdManagement.js"

export default {

    props: {
        selectedNode: {
            type: Object,
            description: "Selected tree node",
        },

        addUserDialog: {
            type: Boolean,
            default: false,
            description: "Selected tree node",
        },
    },

    components: {
        PasswordComponent,
    },

    data(){
        return{
            user:{
                uid: "",
                cn: "",
                sn: "",
                mail: "",
                name: "",
                telephoneNumber: "",
                homePostalAddress: "",
                userPassword: ""
            },
            userValidation: {},
        }
    },

    computed: {
        showDialog: {
            get () {
                return this.addUserDialog
            },

            set (value) {
                if (!value) {
                    this.user.uid = "";
                    this.user.cn = "";
                    this.user.sn = "";
                    this.user.mail = "";
                    this.user.telephoneNumber = "";
                    this.user.homePostalAddress = "";
                    this.user.userPassword = "";
                    this.user.name = "";
                    this.userValidation = {};
                    this.$emit('closeAdDialog')
                }
            }
        }
    },

    methods: {
        async addUser() {
            if (this.userFormValidation()) {
                if (!this.$refs.password.getPassword()) {
                    return;
                }
                this.user.userPassword = this.$refs.password.getPassword();
                let params = new FormData();
                params.append("parentName", this.selectedNode.distinguishedName);
                params.append("name", this.user.name);
                params.append("sn", this.user.sn);
                params.append("cn", this.user.cn);
                params.append("mail", this.user.mail);
                params.append("userPassword", this.user.userPassword);
                params.append("telephoneNumber", this.user.telephoneNumber);
                params.append("homePostalAddress", this.user.homePostalAddress);
                params.append("uid", this.user.uid);

                const { response,error } = await adManagementService.addAddUserToAd(params);
                if(error){
                    this.$toast.add({
                        severity:'error', 
                        detail: this.$t('user_management.add_user_error'), 
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000
                    });
                }
                else{
                    if(response.status == 200){
                        if (response.data) {
                        this.$emit('appendNode', response.data, this.selectedNode);
                        this.$emit('closeAdDialog');
                        this.$toast.add({
                            severity:'success', 
                            detail: this.$t('user_management.add_user_success'), 
                            summary:this.$t("computer.task.toast_summary"), 
                            life: 3000
                        });
                        this.user.uid = "";
                        this.user.cn = "";
                        this.user.sn = "";
                        this.user.mail = "";
                        this.user.telephoneNumber = "";
                        this.user.homePostalAddress = "";
                        this.user.userPassword = "";
                        this.user.name = "";
                        } 
                    }
                    else if(response.status == 208){
                        this.$toast.add({
                            severity:'warn', 
                            detail: this.$t('user_management.user_already_exist'), 
                            summary:this.$t("computer.task.toast_summary"), 
                            life: 3000
                            });

                    }
                    else if(response.status == 417){
                        if(error){
                            this.$toast.add({
                                severity:'error', 
                                detail: this.$t('user_management.error_417_add_user'), 
                                summary:this.$t("computer.task.toast_summary"), 
                                life: 3000
                                });
                            }
                        }       
                }
            }
        },
    
        userFormValidation() {
            if (!this.user.uid.trim()) {
                this.userValidation["uid"] = true;
            } else {
                delete this.userValidation['uid'];
            }
            if (!this.user.name.trim()) {
                this.userValidation["name"] = true;
            } else {
                delete this.userValidation['name'];
            }
            if (!this.user.cn.trim()) {
                this.userValidation["cn"] = true;
            } else {
                delete this.userValidation['cn'];
            }
            if (!this.user.sn.trim()) {
                this.userValidation["sn"] = true;
            } else {
                delete this.userValidation['sn'];
            }
            if (!this.user.mail.trim()) {
                this.userValidation["mail"] = true;
            } else {
                delete this.userValidation['mail'];
            }
            if (!this.user.telephoneNumber.trim()) {
                this.userValidation["telephoneNumber"] = true;
            } else {
                delete this.userValidation['telephoneNumber'];
            }
            if (!this.user.homePostalAddress.trim()) {
                this.userValidation["homePostalAddress"] = true;
            } else {
                delete this.userValidation['homePostalAddress'];
            }
            return !Object.keys(this.userValidation).length;
        },
    }
    
}
</script>

<style lang="scss" scoped>

</style>

