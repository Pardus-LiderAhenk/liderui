<template>
    <div>
        <Card header="timeLine">
            <template #title>
                <p>Kullanıcı Logları</p>
            </template>

            <template #content>
                <Timeline :value="serverLogs" class="customized-timeline">
                    <template #marker>
                        <span class="custom-marker shadow-2">
                            <i class="pi pi-send"></i>
                        </span>
                    </template>
                    <template #content>
                        <h5 style="margin: 0 0 2px; font-size:1.2rem">"h5Lohhh"</h5>
                        <small style="color: #29324180; ">TestLoglarıı</small>
                        
                    </template>
                </Timeline>
            </template>
        </Card>
    </div>
        
</template>

<script>
export default{
    props: {
        serverActivityData: {
            type: String,
            default: null,
        },
    },

    computed: {
        serverLogs: {
            get () {
                let data = null;
                if (this.serverActivityData) {
                    data = this.serverActivityData.content;
                }
                return data;
            }
        },
    }


    
}
</script>

<style lang="scss" scoped>
    .custom-marker {
    display: flex;
    width: 2rem;
    height: 2rem;
    align-items: center;
    justify-content: center;
    color: #123a4d;
    border-radius: 50%;
    background-color:#69b7ff;
    z-index: 1;
}


</style>