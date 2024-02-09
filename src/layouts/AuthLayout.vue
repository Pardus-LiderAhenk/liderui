<template>
    <div>
    <div class="p-grid justify-content-center p-2 lg:p-0" style="width: 100vw; width: 100vw;">
        <div class="p-col-12 p-md-6 p-lg-8">
            <div class="auth-image-container">
                <img src="../assets/images/la_ay_yildiz.png" class="auth-image"/>
            </div>
        </div>
         <div class="p-col-12 p-md-6 p-lg-4 auth-form-container">
            <router-view />
        </div>
    </div>
</div>
</template>

<style scoped>
    .auth-container {
        background: url("../assets/images/liderahenk.jpeg") no-repeat center center fixed ;
        /* width:100%;
        height:100vh; */
        position: relative;
    }

    /* .auth-image-container { */
        /* background: url("../assets/images/la.jpeg") no-repeat ; */
        /* height:100%;
        background-size: cover;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
    } */

    /* .content {
        position: absolute;
        top: 30%;
        left:34%;
    } */

    .auth-form-container {
        /* background: rgba(76, 175, 80, 0.3); */
        /* opacity: 0.5; */
        display: flex;
        height: 100vh;
        /* background-color: #fff; */
        justify-content: center;
        align-items: center;
        text-align: center;
    }

    .auth-image {
        width: 99vw;
        height:99vh;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
    }
</style>