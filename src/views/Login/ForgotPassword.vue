<template>
     <div class="p-grid login-form-container">
         <Toast />
        <div class="p-col-12 login-form-header">
            <img
                src="@/assets/images/liderahenk_login.png"
                style="width: 50%;"
            />
        </div>
        <div class="p-col-12">
            <div class="p-field">
                <InlineMessage :severity="severity" style="text-align:left;">
                     {{inlineMessage}}
                </InlineMessage>
            </div>
            <div class="card" style="background: #e7f2f8;">
                <div class="p-fluid">
                    <span class="p-field p-input-icon-left">
                        <i class="pi pi-user" />
                        <InputText type="text" style="background: #e3e6e9;"
                            v-model="username" 
                            :class="validation.username ? 'p-invalid ':''" 
                            :placeholder="$t('login.username')" 
                        />
                        <small v-if="validation.username" class="p-error">
                            {{$t('login.username_warn')}}
                        </small>
                    </span>
                    <div class="p-field">
                        <div class="p-d-flex p-jc-end">
                            <div>
                                <Button 
                                    icon="pi pi-times"
                                    :label="$t('login.cancel')"
                                    class="p-button-sm p-button-text"
                                    @click="cancelPasswordReset"
                                />
                            </div>
                            <div class="p-ml-2">
                                <Button 
                                    icon="pi pi-send"
                                    :label="$t('login.send')"
                                    class="p-button-sm"
                                    @click="sendPasswordResetLink"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
     </div>
</template>

<script>
import axios from "axios";

export default {
    data() {
        return {
            username: '',
            password: '',
            validation: {
                username: false,
                password: false
            },
            severity: "info",
            inlineMessage: this.$t('login.password_notify')

        }
    },

    methods: {
        
        sendPasswordResetLink() {
            if (!this.username.trim()) {
                this.validation.username = true;
                return;
            }
            let params = {
                username: this.username
            }
            axios.post(process.env.VUE_APP_URL + "/api/forgot-password/", params).then(response => {
                if (response.status == 200) {
                    this.severity = "success";
                    this.inlineMessage = response.data[0];
                }
            }).catch((error) => {
               this.inlineMessage = this.$t('login.forgot_password_inline_message_warn');
               this.severity = "error";
            });
        },

        cancelPasswordReset() {
            this.$router.push("/login");
        },
    },

    watch:{
        username() {
            if (this.username.trim()) {
                this.validation.username = false;
            }
        },
    }
}
</script>

<style scoped lang="scss">
    .login-form-container {
        background: #e7f2f8;
        padding: 50px;
        border-radius: 25px;
        max-width: 450px;
        max-height: 450px;

        .login-form-header {
            text-align: center;
            span {
                font-weight: bold;
                font-size: 18px;
            }
        }
    }
</style>