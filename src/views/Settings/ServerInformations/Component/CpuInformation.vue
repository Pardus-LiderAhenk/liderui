<template>
    <div>
        <Card>
            <template #title>
                <div class="p-d-flex p-jc-between">
                    <span style="margin: 0 0 2px; font-size:1.2rem">Cpu usage</span> 

                        <Button 
                            class="p-button-sm" 
                            :label="$t('Cpu izle')"
                            icon="pi pi-caret-right" 
                            @click="addServerModalVisible =  true;">
                        </Button>
                </div>
            </template>
            <template #content>
                <div class="widget-list-type2" data-v-017cc35f="">
                    <ul class="list-none p-0" data-v-017cc35f="">
                        <li class="flex align-items-center justify-content-between pt-2 pb-3" data-v-017cc35f="">
                            <div class="flex align-items-center justify-content-start" data-v-017cc35f="">
                                <img :src="img" alt="verona-layout" width="42" height="42" class="border-round" data-v-017cc35f="">
                                <div class="ml-2" data-v-017cc35f="">
                                    <span class="font-bold block" data-v-017cc35f="">ebru0</span>
                                    <span class="subtext text-sm block" data-v-017cc35f="">cpu bilgisi</span>
                                </div>
                            </div>
                            <div class="pie-wrapper progress-75" data-v-017cc35f="">
                                <span class="label font-bold text-sm absolute" data-v-017cc35f="">75%</span>
                                <div class="pie" data-v-017cc35f="">
                                    <div class="left-side half-circle" data-v-017cc35f=""></div>
                                    <div class="right-side half-circle" data-v-017cc35f=""></div>
                                </div>
                            </div>
                        </li>
                        <li class="flex align-items-center justify-content-between pt-2 pb-3" data-v-017cc35f="">
                            <div class="flex align-items-center justify-content-start" data-v-017cc35f="">
                                <img :src="img" alt="verona-layout" width="42" height="42" class="border-round" data-v-017cc35f="">
                                <div class="ml-2" data-v-017cc35f="">
                                    <span class="font-bold block" data-v-017cc35f="">ebru1</span>
                                    <span class="subtext text-sm block" data-v-017cc35f="">cpu bilgisi</span>
                                </div>
                            </div>
                            <div class="pie-wrapper progress-68" data-v-017cc35f="">
                                <span class="label font-bold text-sm absolute" data-v-017cc35f="">68%</span>
                                <div class="pie" data-v-017cc35f="">
                                    <div class="left-side half-circle" data-v-017cc35f=""></div>
                                    <div class="right-side half-circle" data-v-017cc35f=""></div>
                                </div>
                            </div>
                        </li>

                        <li class="flex align-items-center justify-content-between pt-2 pb-3" data-v-017cc35f="">
                            <div class="flex align-items-center justify-content-start" data-v-017cc35f="">
                                <img :src="img" alt="verona-layout" width="42" height="42" class="border-round" data-v-017cc35f="">
                                <div class="ml-2" data-v-017cc35f="">
                                    <span class="font-bold block" data-v-017cc35f="">ebru2</span>
                                    <span class="subtext text-sm block" data-v-017cc35f="">cpu bilgisi</span>
                                </div>
                            </div>
                            <div class="pie-wrapper progress-75" data-v-017cc35f="">
                                <span class="label font-bold text-sm absolute" data-v-017cc35f="">75%</span>
                                <div class="pie" data-v-017cc35f="">
                                    <div class="left-side half-circle" data-v-017cc35f=""></div>
                                    <div class="right-side half-circle" data-v-017cc35f=""></div>
                                </div>
                            </div>
                        </li>

                    </ul>
                </div>
        </template>
        </Card>
    </div>
</template>

<script>
export default {

data() {
    return {
        img: require("@/assets/images/servers/cpu.png"),
    }
},
    
}
</script>

<style lang="scss" scoped>
.list-none {
    list-style: none!important;
}
.p-0 {
    padding: 0!important;
}
* {
    box-sizing: border-box;
}
.block {
    display: block!important;
}
ul {
    display: block;
    list-style-type: disc;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    padding-inline-start: 40px;
}

.pb-3 {
    padding-bottom: 1rem!important;
}
.pt-2 {
    padding-top: 0.5rem!important;
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

li {
    text-align: -webkit-match-parent;
}

img {
    overflow-clip-margin: content-box;
    overflow: clip;
}

.ml-2 {
    margin-left: 0.5rem!important;
}

.widget-list-type2 .pie-wrapper {
    height: 3rem;
    width: 3rem;
    float: left;
    position: relative;
}

.widget-list-type2 .label {
    top: 1rem;
    left: 0.75rem;
}

.absolute {
    position: absolute!important;
}
.text-sm {
    font-size: .875rem!important;
}
.font-bold {
    font-weight: 700!important;
}

.widget-list-type2 .subtext {
    color: #7B8794;
}

.widget-list-type2 .pie-wrapper.progress-75 .pie {
    clip: rect(auto, auto, auto, auto);
}

.widget-list-type2 .pie-wrapper .pie {
    height: 3rem;
    width: 3rem;
    clip: rect(0, 3rem, 3rem, 1.5rem);
    left: 0;
    position: absolute;
    top: 0;
}

.widget-list-type2 .pie-wrapper.progress-75 .pie .left-side {
    transform: rotate(18deg);
}

.widget-list-type2 .pie-wrapper.progress-75 .pie .half-circle {
    border-color: #27AB83;
}
.widget-list-type2 .pie-wrapper .pie .half-circle {
    height: 100%;
    width: 100%;
    border: 0.5em solid #3498db;
    border-radius: 50%;
    clip: rect(0, 1.5rem, 3rem, 0);
    left: 0;
    position: absolute;
    top: 0;
}

.widget-list-type2 .pie-wrapper.progress-75 .pie .half-circle {
    border-color: #27AB83;
}

.widget-list-type2 .pie-wrapper.progress-75 .pie .right-side {
    transform: rotate(-90deg);
}

.widget-list-type2 .pie-wrapper.progress-68 .pie {
    clip: rect(auto, auto, auto, auto);
}

.widget-list-type2 .pie-wrapper.progress-68 .pie .right-side {
    transform: rotate(-54deg);
}
.widget-list-type2 .pie-wrapper.progress-68 .pie .half-circle {
    border-color: #DE911D;
}

.widget-list-type2 .pie-wrapper.progress-68 .pie .half-circle {
    border-color: #DE911D;
}

.widget-list-type2 .pie-wrapper.progress-68 .pie .left-side {
    transform: rotate(18deg);
}

</style>