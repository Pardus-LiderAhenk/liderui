<template>
    <div>
        <Card>
            <template #title>
                <span style="margin: 0 0 2px; font-size:1.2rem">{{$t('Kullanıcı Logları')}}</span>
            </template>
            <template #subtitle>
                <span style="margin: 0 0 2px; font-size:1rem">{{$t('sub title')}}</span>
            </template>
            <template #content>
                <Timeline :value="dataLogList">
                    <template #marker>
                        <span class="custom-marker shadow-2">
                            <i class="pi pi-star-fill"></i>
                        </span>
                    </template>
                    <template #content>
                        <h5 style="margin: 0 0 2px; font-size:1.2rem">{{"Kullanıcı logları"}}</h5> 
                        <small style="color: #08255880; ">{{"test"}}</small>
                        <p>{{"11111111111"}}</p>                      
                    </template>
                </Timeline>
                <Timeline :value="dataLogList">
                    <template #marker>
                        <span class="custom-marker shadow-2">
                            <i class="pi pi-star-fill"></i>
                        </span>
                    </template>
                    <template #content>
                        <h5 style="margin: 0 0 2px; font-size:1.2rem">{{"Kullanıcı logları"}}</h5> 
                        <small style="color: #08255880; ">{{"test"}}</small>
                        <p>{{"11111111111"}}</p>                      
                    </template>
                </Timeline>
                <Timeline :value="dataLogList">
                    <template #marker>
                        <span class="custom-marker shadow-2">
                            <i class="pi pi-send"></i>
                        </span>
                    </template>
                    <template #content>
                        <h5 style="margin: 0 0 2px; font-size:1.2rem">{{"Kullanıcı logları"}}</h5> 
                        <small style="color: #08255880; ">{{"test"}}</small>
                        <p>{{"11111111111"}}</p>                      
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

    data() {

    return {

        dataLogList:[
            "test logları1"
            
        ]

        }
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
    border-radius: 90%;
    background-color:#69b7ff;
    z-index: 100;
}
::v-deep(.p-timeline-left) {
    .p-timeline-event-opposite {
        display: none;
    }
}

</style>