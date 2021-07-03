<template>
     <div class="p-grid login-form-container">
        <div class="p-col-12 login-form-header">
            <img
            src="@/assets/images/liderahenk_icon.svg"
            style="width: 15%; padding-right: 30px"
            />
            <span>{{ $t("login.title") }}</span>
        </div>
        <div class="p-col-12">
             <div class="card">
                <div class="p-fluid">
                    <span class="p-field p-input-icon-left">
                        <i class="pi pi-user" />
                        <InputText type="text" v-model="username" placeholder="Username" />
                    </span>
                    <span class="p-field p-input-icon-left">
                        <i class="pi pi-lock" />
                        <InputText type="password" v-model="password" placeholder="Password" />
                    </span>
                     <Button label="Login" class="p-button-primary" @click="login()"/>
                </div>
            </div>
        </div>
     </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            username: '',
            password: ''
        }
    },
    methods: {
        login() {
             axios
                .post(process.env.VUE_APP_URL + "/api/auth/signin", {
                        username: this.username,
                        password: this.password,
                })
                .then(
                (response) => {
                    console.log(response.data.token);
                    localStorage.setItem("auth_token", response.data.token);
                    this.$router.push("/dashboard");
                },
                (error) => {
                    this.toast.error("Kullanıcı adı veya şifre hatalı");
                }
                );
        }
    },
}
</script>



<style scoped lang="scss" >
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