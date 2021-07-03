<template>
  <div>
    <card>
      <template #pluginHeader>
        <h5>File Transfer</h5>
      </template>
      <template #default>
        <div>
               <!-- Login form area -->
        <el-form :model="loginForm" :rules="loginFormRules">
            <!--  username  -->
            <el-form-item prop="username">
                <el-input v-model="loginForm.username"></el-input>
            </el-form-item>
            <!--  Password -->
            <el-form-item prop="password">
                <el-input v-model="loginForm.password" type="password"></el-input>
            </el-form-item>
            <!--  Button area -->
            <el-form-item >
                <el-button type="primary">Sign in</el-button>
                <el-button type="info">Reset</el-button>
            </el-form-item>
        </el-form>
        </div>
      </template>
    </card>
  </div>
</template>

<script>
export default {
    data() {
        return {
            // This is the data binding object of the login form
            loginForm: {
                username: '',
                password: ''
            },
            // This is the validation rule of the form
            loginFormRules: {
                username: [
                     // trigger:'blur' -> trigger when focus is lost
                    { required: true, message: 'Please enter login name', trigger: 'blur' },
                    { min: 3, max: 10, message: 'Length is 3 to 10 characters', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: 'Please enter login password', trigger: 'blur' },
                    { min: 6, max: 15, message: 'Length is 6 to 15 characters', trigger: 'blur' }
                ]
            }
        }
    }
}
</script>

<style scoped></style>
