<template>
    <Dialog 
        :header="$t('computer.task.toast_summary')" 
        v-model:visible="updateUserConfirm"  
        :modal="true" 
        @hide="updateUserConfirm = false">
        <div class="confirmation-content">
            <i class="pi pi-info-circle p-mr-3" style="font-size: 2rem" />
            <span>{{ $t('user_management.update_user_confirm_message')}}</span>
        </div>
        <template #footer>
        <Button 
            :label="$t('user_management.cancel')" 
            icon="pi pi-times" 
            @click="updateUserConfirm = false" 
            class="p-button-text p-button-sm"
        />
        <Button 
            :label="$t('user_management.yes')"
            icon="pi pi-check" 
            @click="updateUserInfo"
            class="p-button-sm"
        />
        </template>
    </Dialog>
    <div class="p-fluid p-formgrid p-grid">
        <div class="p-col-12">
            <div class="p-d-flex p-jc-between">
                <div>
                    <h3>{{$t('user_management.general_information')}}</h3>
                </div>
                <div>
                    <!-- <Button 
                        :label="user.userStatus ? 'Pasif': 'Aktif'" v-tooltip.left="'status'"
                        :class="user.userStatus ? 'p-button-sm p-button-danger': 'p-button-sm p-button-success'">
                    </Button> -->
                    <!-- <Badge 
                        :value="user.userStatus ? 'Pasif': 'Aktif'" 
                        :severity="user.userStatus ? 'danger': 'success'">
                    </Badge> -->
                </div>
            </div>
        </div>
        <div class="p-field p-col-12">
            <label for="firstname6">{{$t('user_management.uid')}}</label>
            <InputText :class="userValidation.uid ? 'p-invalid p-inputtext-sm': 'p-inputtext-sm'" 
                v-model="user.uid" type="text" disabled
            />
            <small v-if="userValidation.uid" class="p-error">
                {{$t('user_management.uid_warn')}}
            </small>
        </div>
        <div class="p-field p-col-12">
            <label for="firstname6">{{$t('user_management.username')}}</label>
            <InputText :class="userValidation.cn ? 'p-invalid p-inputtext-sm': 'p-inputtext-sm'" 
                type="text" v-model="user.cn"
            />
            <small v-if="userValidation.cn" class="p-error">
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
            <label for="firstname6">{{$t('user_management.mail_address')}}</label>
            <span class="p-input-icon-right">
                <i class="pi pi-envelope" />
                <InputText :class="userValidation.uimaild ? 'p-invalid p-inputtext-sm': 'p-inputtext-sm'" 
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
                :autoResize="true" rows="5" cols="30" v-model="user.homePostalAddress"
            />
            <small v-if="userValidation.homePostalAddress" class="p-error">
                {{$t('user_management.address_warn')}}
            </small>
        </div>
    </div>
    <div class="p-d-flex p-jc-end">
        <Button 
            icon="pi pi-refresh"
            class="p-button-sm"
            type="button" 
            @click="showUpdateUserDialog" 
            :label="$t('user_management.update')" 
        />    
    </div>
</template>

<script>

import { userService } from "../../../../services/Settings/UserService";

export default {
    props: {
        selectedNode: {
            type: Object,
            description: "Selected tree node",
        },
    },

    data() {
        return {
            updateUserConfirm: false,
            user:{
                uid: "",
                cn: "",
                sn: "",
                mail: "",
                telephoneNumber: "",
                homePostalAddress: "",
                userStatus: "",
            },
            userValidation: {},
        }
    },

    methods: {
        showUpdateUserDialog() {
            if (this.selectedNode && this.selectedNode.type === "USER") {
                if (this.userFormValidation()) {
                    this.updateUserConfirm = true;
                }
            } else {
                this.$toast.add({
                    severity:'warn', 
                    detail: this.$t('user_management.select_user_warn'), 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
            }
        },

        async updateUserInfo() {
            let params = new FormData();
            params.append("distinguishedName", this.selectedNode.distinguishedName);
            params.append("cn", this.user.cn);
            params.append("sn", this.user.sn);
            params.append("telephoneNumber", this.user.telephoneNumber);
            params.append("mail", this.user.mail);
            params.append("homePostalAddress", this.user.homePostalAddress);
            params.append("userStatus", this.user.userStatus);


            const{response,error} = await userService.editUser(params);
            if(error){
                this.$toast.add({
                    severity:'error', 
                    detail: this.$t('user_management.update_user_error')+ " \n"+error, 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
            }
            else{
                if(response.status == 200){
                    this.$emit('updatedUser', response.data);
                    this.updateUserConfirm = false;
                    this.$toast.add({
                        severity:'success', 
                        detail: this.$t('user_management.update_user_success'), 
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000
                    });
                }
                else if(response.status == 417){
                    return "error";
                }
            }
        },

        userFormValidation() {
            if (!this.user.uid.trim()) {
                this.userValidation["uid"] = true;
            } else {
                delete this.userValidation['uid'];
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
    },

    watch : {
        selectedNode() {
            if (this.selectedNode && this.selectedNode.type === "USER") {
                this.user.uid = this.selectedNode.uid;
                this.user.cn = this.selectedNode.attributes.cn;
                this.user.sn = this.selectedNode.attributes.sn;
                this.user.mail = this.selectedNode.attributes.mail;
                this.user.telephoneNumber = this.selectedNode.attributes.telephoneNumber;
                this.user.homePostalAddress = this.selectedNode.attributes.homePostalAddress;
                this.user.userStatus = this.selectedNode.attributes.pwdAccountLockedTime;
                this.userValidation = {};
            } else {
                this.user = {};
            }
        },
        
        // user: {
        //     handler(){
        //         this.userFormValidation();
        //     },
        //     deep: true,
        // }
    }
}
</script>
<style>
.btn-float-left{
	float: left;	
}
</style>