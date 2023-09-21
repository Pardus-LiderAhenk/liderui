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
                    </div>
                </div>
            </form>
        </div>
     </div>
</template>

<script>
export default {
    data() {
        return {
            username: '',
            password: '',
            validation: {
                username: false,
                password: false
            }
        }
    },

    methods: {
        login() {
            if (!this.username.trim()) {
                this.validation.username = true;
                return;
            }
            if (!this.password.trim()) {
                this.validation.password = true;
                return;
            }

            this.$store.dispatch("login", { username:this.username, password:this.password })
            .then((response) => {
                this.$router.push("/dashboard");
            }).catch(err => {
                this.$toast.add({
                    severity:'error', 
                    detail: this.$t('login.login_error') + "\n"+err, 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
            });

            
        },

        forgotPassword() {
            this.$router.push("forgot-password");
        }
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
        }
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