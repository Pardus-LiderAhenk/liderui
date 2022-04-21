<template>
     <div class="p-grid login-form-container">
         <Toast />
        <div class="p-col-12 login-form-header">
            <img
                src="@/assets/images/liderahenk_login.png"
                style="width: 50%;"
            />
            
        </div>
        <!-- <div class="p-col-12 p-text-center">
            <span>{{ $t("login.title") }}</span>
        </div> -->
        <div class="p-col-12">
             <form @submit.prevent="login()" class="p-fluid">
                <div class="card">
                    <div class="p-fluid">
                        <span class="p-field p-input-icon-left">
                            <i class="pi pi-user" />
                            <InputText type="text" 
                                v-model="username" 
                                :class="validation.username ? 'p-invalid ':''" 
                                placeholder="Username" 
                            />
                            <small v-if="validation.username" class="p-error">
                                Kullanıcı adı boş bırakılamaz
                            </small>
                        </span>
                        <span class="p-field p-input-icon-left">
                            <i class="pi pi-lock" />
                            <InputText type="password" 
                                :class="validation.password ? 'p-invalid ':''" 
                                v-model="password" 
                                placeholder="Password" 
                            />
                            <small v-if="validation.password" class="p-error">
                                Parola boş bırakılamaz
                            </small>
                        </span>
                        <div class="p-fluid">
                            <Button type="submit" label="Giriş Yap" class="p-mt-2 p-field" />
                            <Button label="Parolamı Unuttum" @click="forgotPassword" class="p-button-link p-field" />
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
                this.$toast.add({ severity: 'error', summary: 'HATA', detail: '"Kullanıcı adı veya şifre hatalı"', life: 3000});
                console.log(err)
            });
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
        }
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