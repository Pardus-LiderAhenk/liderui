<template>
    <div class="auth-container">
        <div class="content">
            <router-view />
        </div>
    </div>
</template>


<style scoped>
    .auth-container {
        background: url("../assets/images/liderahenk.jpeg") no-repeat center center fixed ;
        width:100%;
        height:100vh;
        position: relative;
    }

    .content {
        position: absolute;
        top: 30%;
        left:34%;
    }
</style>