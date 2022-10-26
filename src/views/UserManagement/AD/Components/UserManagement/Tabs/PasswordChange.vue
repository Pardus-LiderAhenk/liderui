<template>
    <Dialog 
        :header="$t('computer.task.toast_summary')" 
        v-model:visible="changePasswordDialog"  
        :modal="true" 
        @hide="changePasswordDialog = false">
        <div class="confirmation-content">
            <i class="pi pi-info-circle p-mr-3" style="font-size: 1.5rem"/>
            <span>{{ $t('user_management.change_user_password_confirm_message')}}</span>
        </div>
        <template #footer>
        <Button 
            :label="$t('user_management.cancel')" 
            icon="pi pi-times" 
            @click="changePasswordDialog = false" 
            class="p-button-text p-button-sm"
        />
        <Button 
            :label="$t('user_management.yes')"
            icon="pi pi-check" 
            @click="updatePassword"
            class="p-button-sm"
        />
        </template>
    </Dialog>
    <div class="p-fluid p-formgrid p-grid">
        <div class="p-col-12">
            <h3>{{ $t('user_management.change_password') }}</h3>
        </div>
        <div class="p-field p-col-12">
            <password-component ref="password"></password-component>
        </div>
    </div>
    <div class="p-d-flex p-jc-end">
        <Button 
            icon="pi pi-unlock"
            class="p-button-sm"
            type="button" @click="showUpdatePasswordDialog" 
            :label="$t('user_management.change_password')" 
        />
    </div>
</template>


<script>
/**
 * Update password component. Uses general password component
 * @see {@link http://www.liderahenk.org/}
 */
import PasswordComponent from '@/components/Password/PasswordComponent.vue';
import { adManagementService } from '../../../../../../services/UserManagement/AD/AdManagement.js';

export default {
    props: {
        selectedUser: {
            type: Object,
            description: "Selected tree node",
        },
    },

    data() {
        return {
            changePasswordDialog: false,
            userPassword: null
        }
    },

    components: {
        PasswordComponent
    },

    methods:{
        async updatePassword(){
            this.userPassword = this.$refs.password.getPassword();
            let params = new FormData();
            params.append("distinguishedName", this.selectedUser.distinguishedName);
            params.append("userPassword", this.userPassword);
            const { response,error } = await adManagementService.updateUserPassword(params);
            if(error){
                this.$toast.add({
                    severity:'error', 
                    detail: this.$t('user_management.change_user_password_error')+ " \n"+error, 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
            }
            else{
                if( response.status == 200 ){
                    this.$emit('updatedUser', response.data);
                    this.changePasswordDialog = false;
                    this.userPassword = null;
                    this.$toast.add({
                        severity:'success', 
                        detail: this.$t('user_management.change_user_password_success'), 
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000
                });
                }
                else if(response.status == 417)
                this.$toast.add({
                        severity:'error', 
                        detail: this.$t('user_management.error_417_change_user_password'), 
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000
                });
            }
        },

        showUpdatePasswordDialog() {
            if (this.selectedUser && this.selectedUser.type === "USER") {
                this.userPassword = this.$refs.password.getPassword();
                if (this.userPassword) {
                    this.changePasswordDialog = true;
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
    },
}
</script>