<template>
    <div>
        <Card>
            <template #title>
                <div class="p-d-flex p-jc-between">
                    <span style="margin: 0 0 2px; font-size:1.2rem">Disk usage</span> 

                        <!-- <Button 
                            class="p-button-sm" 
                            :label="$t('Disk izle')"
                            icon="pi pi-caret-right" 
                            @click="addServerModalVisible =  true;">
                        </Button> -->
                </div>
            </template>

            <template #content>
                                   
                <div class="widget-image-stats relative">
                    <img :src="img" alt="product" class="w-full my-4">
                    <div class="flex align-items-center justify-content-between mb-2">
                        <span class="font-bold">ebru0</span>
                        <span>%40</span>
                    </div>
                    <div role="progressbar" class="p-progressbar p-component p-progressbar-determinate orange-bar mb-4" aria-valuemin="0" aria-valuenow="40" aria-valuemax="100">
                        <div class="p-progressbar-value p-progressbar-value-animate" style="width: 40%; display: flex;"></div>
                    </div>
                    <div class="flex align-items-center justify-content-between mb-2">
                        <span class="font-bold">ebru1</span>
                        <span>%89</span>
                    </div>
                    <div role="progressbar" class="p-progressbar p-component p-progressbar-determinate green-bar mb-4" aria-valuemin="0" aria-valuenow="89" aria-valuemax="100">
                        <div class="p-progressbar-value p-progressbar-value-animate" style="width: 89%; display: flex;"></div>
                    </div>
                    <div class="flex align-items-center justify-content-between mb-2">
                        <span class="font-bold">ebru2</span>
                        <span>%82</span>
                    </div>
                    <div role="progressbar" class="p-progressbar p-component p-progressbar-determinate green-bar" aria-valuemin="0" aria-valuenow="82" aria-valuemax="100">
                        <div class="p-progressbar-value p-progressbar-value-animate" style="width: 82%; display: flex;"></div>
                    </div>
                </div>

            </template>
        </Card>
    </div>
</template>

<script>
export default {

data() {
    return {
        img: require("@/assets/images/servers/disk-11.png"),
    }
},
    
}
</script>

<style lang="scss" scoped>

.card {
    background: #ffffff;
    padding: 1.5rem 1rem;
    margin-bottom: 16px;
    box-shadow: 0px 3px 4px rgba(0, 0, 0, 0.1), 0px 24px 36px rgba(0, 0, 0, 0.04);
    border-radius: 14px;
}

.card .card-header {
    display: -ms-flexbox;
    display: flex;
    -ms-flex-align: center;
    align-items: center;
    -ms-flex-pack: justify;
    justify-content: space-between;
}

.mb-2 {
    margin-bottom: 0.5rem!important;
}

.widget-image-stats .p-progressbar {
    height: 0.5rem;
}

.p-progressbar {
    position: relative;
    overflow: hidden;
}
.p-progressbar {
    border: 0 none;
    height: 1.5rem;
    background: #dfe7ef;
    border-radius: 6px;
}
.align-items-center {
    -webkit-box-align: center!important;
    -ms-flex-align: center!important;
    align-items: center!important;
}
.justify-content-between {
    -webkit-box-pack: justify!important;
    -ms-flex-pack: justify!important;
    justify-content: space-between!important;
}
.flex {
    display: -webkit-box!important;
    display: -ms-flexbox!important;
    display: flex!important;
}

.mb-4 {
    margin-bottom: 1.5rem!important;
}

.w-full {
    width: auto;
    height: auto;
}
.my-4 {
    margin-top: 1rem!important;
    margin-bottom: 1rem!important;
}
* {
    box-sizing: border-box;
}
user agent stylesheet
img {
    overflow-clip-margin: content-box;
    overflow: clip;
}

.p-button-sm{

    padding-right: 0%;
    
}

</style>