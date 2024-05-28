<template>
    <div>
        <div class="p-fluid p-formgrid p-grid">
            <div class="p-col-8">
                <h3>{{$t('profile.account_security.password_status')}}</h3>
            </div>
            <div class="p-field p-col-8">
                <label for="updateDate">{{$t('profile.account_security.last_modified_date')}}</label>
                <InputText disabled id="pwdChangeTime" type="text" v-model="pwdChangeTime"/>
            </div>
            <div class="p-col-12">
                <h3>{{$t('profile.account_security.change_password')}}</h3>
            </div>
            <div class="p-field p-col-8">
                <label for="city">{{$t('profile.account_security.old_password')}}</label>
                <Password 
                    :placeholder="$t('profile.account_security.old_password')"
                    toggleMask v-model="oldPassword" :feedback="false"
                    :class="validationOldPassword ? 'p-invalid': ''"
                />
                <small v-if="validationOldPassword" class="p-error">
                    {{ oldPasswordMessage}}
                </small>
            </div>
            <div class="p-field p-col-8">
                <password-component ref="password"></password-component>
            </div>
        </div>
        <div class="p-d-flex p-jc-end p-col-8">
            <Button type="button" 
                :label="$t('profile.account_security.change_password')"
                icon="pi pi-unlock"
                class="p-button-sm"
                @click="updatePassword"
            />
        </div>
        <Dialog :header="$t('computer.task.toast_summary')" v-model:visible="showDialog" 
            :style="{width: '20vw'}" :modal="true">
            <div class="p-fluid">
                <i class="pi pi-info-circle p-mr-3" style="font-size: 1.5rem" />
                <span>
                    {{$t('profile.account_security.change_user_password_confirm_message')}}
                </span>
            </div>
            <template #footer>
                <Button :label="$t('profile.cancel')" icon="pi pi-times" 
                    @click="showDialog = false" class="p-button-text p-button-sm"
                />
                <Button :label="$t('profile.yes')" icon="pi pi-check"
                    @click="changePassword" class="p-button-sm"
                />
            </template>
        </Dialog>
    </div>
</template>


<script>
import axios from "axios";
import PasswordComponent from '@/components/Password/PasswordComponent.vue';

export default {
    props:['user'],
    
    data() {
        return {
            pwdChangeTime: null,
            oldPassword:null,
            newPassword:null,
            newPasswordAgain:null,
            validationOldPassword: false,
            oldPasswordMessage: this.$t('profile.account_security.please_write_your_old_password'),
            showDialog: false
        }
    },

    components: {
        PasswordComponent
    },

    methods: {
        getFormattedDate(date) {
            var year = date.slice(0,4);
            var month = date.slice(4,6);
            var day = date.slice(6,8);
            return day + "/" + month + "/" + year; 
        },

        updatePassword() {
           
            if (!this.oldPassword) {
                this.validationOldPassword = true;
                this.oldPasswordMessage = this.$t('profile.account_security.please_write_your_old_password');
                return;
            }
            this.newPassword = this.$refs.password.getPassword();
            if (!this.newPassword) {
                return;
            }
            this.showDialog = true;
        },

        changePassword() {
            let params = new FormData();
            params.append("uid", this.user.uid);
            params.append("userPassword", this.oldPassword);
            axios.post("/api/lider-console/matches-password", params).then((response) => {
                if (response.data) {
                    axios.post("/api/lider-console/update-password", {
                        distinguishedName: this.user.distinguishedName,
                        userPassword: this.newPassword
                    }).then((rsp) => {
                        this.oldPassword = null;
                        this.newPassword = null;
                        this.$refs.password.setPasswordForm('', '');
                        this.$toast.add({
                            severity:'success', 
                            detail: this.$t('profile.account_security.password_successfully_update'),
                            summary:this.$t("computer.task.toast_summary"), 
                            life: 3000
                        });
                        setTimeout(() => {
                            this.$store.dispatch("logout").then(() => this.$router.push("/login")).catch(err => console.log(err))
                        }, 3000);
                    });
                } else {
                    this.validationOldPassword = true;
                    this.oldPasswordMessage = this.$t('profile.account_security.your_old_password_is_wrong');
                }
            });
            this.showDialog = false;
        }
    },

    watch: {
        oldPassword() {
            if (this.oldPassword) {
                this.validationOldPassword = false;
            }
        },

        user() {
            if (this.user.attributes.pwdChangedTime) {
                this.pwdChangeTime = this.getFormattedDate(this.user.attributes.pwdChangedTime);
            }
        }
    }
}

</script>
