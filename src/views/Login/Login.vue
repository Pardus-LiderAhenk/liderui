<template>
     <div class="p-grid login-form-container">
         <Toast />
        <div class="p-col-12 login-form-header">
            <img
            src="@/assets/images/liderahenk_icon.svg"
            style="width: 15%; padding-right: 30px"
            />
            <span>{{ $t("login.title") }}</span>
        </div>
        <div class="p-col-12">
             <form @submit.prevent="login()" class="p-fluid">
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
                        <Button type="submit" label="Login" class="p-mt-2" />
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
            password: ''
        }
    },
    methods: {
        login() {

         this.$store.dispatch("login", { username:this.username, password:this.password })
        .then((response) => {

            this.$router.push("/dashboard");
          
        }).catch(err => {
            this.$toast.add({ severity: 'error', summary: 'HATA', detail: '"Kullanıcı adı veya şifre hatalı"', life: 3000});
            console.log(err)
        });

            
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