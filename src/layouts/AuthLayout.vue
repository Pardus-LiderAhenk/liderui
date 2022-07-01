<template>
    <div class="p-grid">
       
        <div class="p-col-7 ">
            <div class="auth-image-container">
                <img src="../assets/images/LAbanner-02.png" class="auth-image"/>
            </div>

        </div>
         <div class="p-col-5 auth-form-container">
            <router-view />
        </div>
    </div>
    <!-- <div class="auth-container">
        <div class="content">
            <router-view />
        </div>
    </div> -->
</template>


<style scoped>
    .auth-container {
        background: url("../assets/images/liderahenk.jpeg") no-repeat center center fixed ;
        width:100%;
        height:100vh;
        position: relative;
    }

    .auth-image-container {
        background: url("../assets/images/wp.svg") no-repeat ;
        height:100%;
        background-size: cover;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
    }

    .content {
        position: absolute;
        top: 30%;
        left:34%;
    }

    .auth-form-container {
        display: flex;
        height: 99vh;
        background-color: #fff;
         justify-content: center;
        align-items: center;
        text-align: center;
    }

    .auth-image {
        width: 60%;
    }
</style>