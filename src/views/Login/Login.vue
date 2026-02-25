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
             <form @submit.prevent="login()" class="p-fluid" >
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
                        <span class="p-field p-input-icon-left">
                            <i class="pi pi-lock" />
                            <InputText type="password" style="background: #e3e6e9;"
                                :class="validation.password ? 'p-invalid ':''" 
                                v-model="password" 
                                :placeholder="$t('login.password')" 
                            />
                            <small v-if="validation.password" class="p-error">
                                {{$t('login.password_warn')}}
                            </small>
                        </span>
                        <div class="p-fluid">
                            <Button 
                            type="submit" 
                            :label="$t('login.sign_in')" 
                            class="p-mt-2 p-field"
                            />
                            <Button 
                            :label="$t('login.forgot_password')" 
                            @click="forgotPassword" 
                            class="p-button-link p-field" />
                        </div>
                        <div v-if="loading">
                            <ProgressSpinner
                                style="width: 20px; height: 20px"
                                strokeWidth="8"
                                fill="var(--surface-ground)"
                                animationDuration=".5s"
                            />
                            <a class="primary">
                                &nbsp;{{$t('login.login_in_progress')}}
                            </a>
                        </div>
                    </div>
                </div>
            </form>
        </div>
        <Dialog :header="$t('login.otp_check_header')" :modal="true" :style="{ width: '30vw' }"
            v-model:visible="otpCodeDialog" @hide="otpCodeDialog = false">
            <div class="p-fluid">
                <div class="p-field">
                    <label for="otpCode">{{$t('login.otp_prompt')}}</label>
                    <InputText :useGrouping="false" type="Number"
                    :class="validation.otp ? 'p-invalid ' : ''"
                    id="otpCode" v-model="otp"/>
                    <small v-if="validation.otp" class="p-error">
                        {{ $t('login.password_warn') }}
                    </small>
                    <small v-else id="otpCode">
                        {{$t('login.otp_info')}}
                    </small>
                </div>
                <div class="p-field">
                    <p><b>{{$t('login.otp_expiry')}}:</b> {{ formattedOtpExpiry }} </p>
                </div>
            </div>
            <template #footer>
                <Button :label="$t('login.confirm')" icon="pi pi-check" @click="verifyOTP" class="p-button-sm" />
            </template>
        </Dialog>
     </div>
</template>

<script>
import InputText from 'primevue/inputtext';

export default {
    data() {
        return {
            username: '',
            password: '',
            validation: {
                username: false,
                password: false,
                otp: false
            },
            otp: null,
            otpCodeDialog: false,
            otpExpiryDuration: null,
            timer: null,
            loading: false
        }
    },

    methods: {
        sanitizeInput(input) {
            return input.replace(/[^\w.-]/g, '')
        },

        login() {
            if (!this.username.trim()) {
                this.validation.username = true;
                return;
            }
            if (!this.password.trim()) {
                this.validation.password = true;
                return;
            }

            this.loading = true;

            const sanitizedUsername = this.sanitizeInput(this.username);
            this.$store.dispatch("login", { username: sanitizedUsername, password: this.password })
                .then((response) => {
                    if (response.data.isTwoFactorEnabled) {
                        this.otpExpiryDuration = response.data.otpExpiryDuration;
                        this.otpCodeDialog = true;
                    } else {
                        this.$router.push("/dashboard");
                    }
                }).catch(err => {
                    if (err.response.status === 422) {
                    this.$toast.add({
                        severity:'error', 
                        detail: this.$t('login.login_email_error') + "\n"+err, 
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000
                    });
                } else {
                    this.$toast.add({
                        severity:'error', 
                        detail: this.$t('login.login_error') + "\n"+err, 
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000
                    });
                }
                });
        },

        forgotPassword() {
            this.$router.push("forgot-password");
        },

        verifyOTP() {
            if (!this.otp) {
                this.validation.otp = true;
                return;
            }

            const loginParams = {
                username: this.sanitizeInput(this.username),
                password: this.password,
            };

            const otpCode = this.otp;

            this.$store.dispatch("verifyOTP", { loginParams, otpCode })
                .then((response) => {
                    console.log(response)
                    this.$router.push("/dashboard");

                }).catch(err => {
                    this.$toast.add({
                        severity: 'error',
                        detail: this.$t('login.login_error') + "\n" + err,
                        summary: this.$t("computer.task.toast_summary"),
                        life: 3000
                    });
                });
        },

        startCountdown() {
            if (this.timer) clearInterval(this.timer);
            this.timer = setInterval(() => {
                if (this.otpExpiryDuration > 0) {
                    this.otpExpiryDuration -= 1000;
                } else {
                    clearInterval(this.timer);
                    this.timer = null;
                    this.otpCodeDialog = false;
                    this.$toast.add({
                        severity: "warn",
                        summary: this.$t("computer.task.toast_summary"), 
                        detail: this.$t('login.otp_expired'),
                        life: 3000,
                    });
                }
            }, 1000);
        },
    },

    computed: {
        formattedOtpExpiry() {
            const totalSeconds = Math.floor(this.otpExpiryDuration / 1000);
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = totalSeconds % 60;
            return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
        },
    },

    watch:{
        username() {
            if (this.username.trim()) {
                this.validation.username = false;
            }
        },

        password() {
            if (this.password.trim()) {
                this.validation.password = false;
            }
        },

        otp() {
            if (this.otp != null) {
                this.validation.otp = false;
            }
        },
        
        otpCodeDialog(newValue) {
            if (newValue) {
                this.startCountdown();
            } else {
                if (this.timer) clearInterval(this.timer);
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