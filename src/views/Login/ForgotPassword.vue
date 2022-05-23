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
                <InlineMessage severity="info">
                     {{$t('login.password_notify')}}
                </InlineMessage>
            </div>
            <div class="card">
                <div class="p-fluid">
                    <span class="p-field p-input-icon-left">
                        <i class="pi pi-user" />
                        <InputText type="text" 
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
                                    icon="pi pi-link"
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
        
        sendPasswordResetLink() {
            if (!this.username.trim()) {
                this.validation.username = true;
                return;
        }
            alert("password reset")
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
        background: #fff;
        padding: 50px;
        border-radius: 25px;
        max-width: 450px;

        .login-form-header {
            text-align: center;
            span {
                font-weight: bold;
                font-size: 18px;
            }
        }
    }
</style>