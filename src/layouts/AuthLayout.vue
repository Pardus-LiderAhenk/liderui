<template>
    <div class="p-grid">
        <div class="p-col-5">
            <router-view />
        </div>
        <div class="p-col-7 ">
            <div class="auth-image-container">

            </div>

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
        width:100%;
        height:100%;
        position: absolute;
    }

    .content {
        position: absolute;
        top: 30%;
        left:34%;
    }
</style>