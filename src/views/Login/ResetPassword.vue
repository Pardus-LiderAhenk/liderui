<template>
     <div class="p-grid password-reset-form-container">
        <div class="p-col-12 password-reset-form-header">
            <img
                src="@/assets/images/liderahenk_login.png"
                style="width: 50%;"
            />
        </div>
        <div class="p-col-12 p-fluid">
            <div class="p-field">
                <InlineMessage v-if="severity == 'success'" :severity="success" style="text-align:left;">
                   {{$t('login.reset_password_inline_message_success')}} <a href='/login'> {{$t('login.login_message')}}</a>
                </InlineMessage>
                <InlineMessage v-else :severity="severity" style="text-align:left;">
                    {{inlineMessage}}
                </InlineMessage>
            </div>
             <form class="p-field" v-if="!isPasswordReset">
                <div class="card">
                    <div class="p-fluid">
                        <password-component class="password" 
                            :showTitle="false" 
                            :generate="true" 
                            ref="resetConsolePassword">
                        </password-component>
                        <div>
                            <Button 
                                :label="$t('login.reset')" 
                                class="p-mt-2"
                                @click="resetPassword"
                            />
                        </div>
                    </div>
                </div>
            </form>
        </div>
     </div>
</template>

<script>
import axios from "axios";
import PasswordComponent from '@/components/Password/PasswordComponent.vue';

export default {
     data() {
        return {
            isPasswordReset: false,
            inlineMessage: this.$t('login.reset_password_inline_message_warn'),
            severity: "info"
        }
    },

    components: {
        PasswordComponent
    },

    methods: {
        resetPassword() {
            let password = this.$refs.resetConsolePassword.getPassword();
            if (!password) {
                return;
            }
            let params = {
                "password": password,
                "repeatPassword": password
            }

            axios.post('/forgot_password/reset/'+ this.$route.params.uuid , params)
            .then(response => {
                if (response.status === 200) {
                    this.isPasswordReset = true;
                    this.severity = "success";
                } else {
                    this.inlineMessage = response.data[0];
                    this.severity = "error";
                }
            }).catch((error) => {
                this.severity = "error";
                this.inlineMessage = this.$t('login.reset_password_inline_message_error');
            });
        },
    },

    watch:{
        confirmPassword() {
            if (this.confirmPassword.trim()) {
                this.validation.confirmPassword = false;
            }
        },

        password() {
            if (this.password.trim()) {
                this.validation.password = false;
            }
        }
    }
}
</script>

<style scoped lang="scss">
    .password-reset-form-container {
        background: #fff;
        padding: 50px;
        border-radius: 25px;
        max-width: 450px;
        max-height: 450px;

        .password-reset-form-header {
            text-align: center;
            span {
                font-weight: bold;
                font-size: 18px;
            }
        }
        .password {
            text-align: left;
        }
    }
</style>