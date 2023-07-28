<template>
    <div>
        <Card>
            <template #title>
                <div class="p-d-flex p-jc-between">
                    <span style="margin: 0 0 2px; font-size:1.2rem">Cpu usage</span> 

                        <!-- <Button 
                            class="p-button-sm" 
                            :label="$t('Cpu izle')"
                            icon="pi pi-caret-right" 
                            @click="addServerModalVisible =  true;">
                        </Button> -->
                </div>
            </template>
            <template #content>
                <div class="widget-list-type2">
                    <div v-for="server in servers" v-bind:key="server">

                    <ul class="list-none p-0">
                       
                        <div class="card flex justify-content-center">

                            <img :src="img" alt="verona-layout" width="42" height="42" class="border-round">
                                <div class="ml-2">
                                    <span class="font-bold block">
                                        {{ server.ip }}
                                    </span>
                                    <span class="subtext text-sm block">cpu bilgisi</span>
                                </div>

                                    <Chart class="doughnut" type="doughnut" 
                                    :data="cpuInfodata" 
                                    :options="chartOptions" 
                                    :style="chartStyle"/>

                        </div>
                    </ul>
                </div>
            </div>            
        </template>
        </Card>
    </div>
</template>

<script>
export default {
    props: {
        servers: [],
    },

    data() {
        return {
            img: require("@/assets/images/servers/cpu-icon.png"),
            cpuInfodata : null,
            chartData: null,
            chartOptions: {
                cutout: '50%',
                responsive: true
            },
            chartStyle: { width: '20%', height: '5px' },

        }
        
    },

    mounted() {

        this.getCpuList();
        console.log(this.getCpuList);
    },

    methods: {
        
        getPropertyValue(properties, propertyName) {
            var propertyValue = "";

            const filteredProperties = properties.filter(
                (property) => property.propertyName === propertyName
            );
            
            if (filteredProperties != null && filteredProperties.length > 0) {
                propertyValue = filteredProperties[0].propertyValue;

            }


            return propertyValue;
        },


        // setChartData() {
        //     const documentStyle = getComputedStyle(document.body);

        //     return {
        //         // labels: ['A', 'B'],
        //         datasets: [
        //             {
        //                 data: [540, 325],
        //                 backgroundColor: [documentStyle.getPropertyValue('--blue-500'), documentStyle.getPropertyValue('--yellow-500')],
        //                 hoverBackgroundColor: [documentStyle.getPropertyValue('--blue-400'), documentStyle.getPropertyValue('--yellow-400')]
        //             }
        //         ]
        //     };
        // },

        getCpuList() {
            console.log(this.servers.properties);
            var cpuUsed = 50.0;
            var cpuFree = 50.0;
            //    cpuUsed = (100*((this.getPropertyValue(this.properties,"cpu_user")+this.getPropertyValue(this.servers,"cpu_system"))/(this.getPropertyValue(this.servers,"cpu_user")+this.getPropertyValue(this.servers,"cpu_system")+this.getPropertyValue(this.servers,"cpu_idle")))).toFixed(2);
            //    cpuFree = (100 - cpuUsed).toFixed(2);
                
                this.cpuInfodata ={
                datasets: [
                    {
                        data: [50, 75],
                        backgroundColor: ["#66BB6A","#D32F2F"],
                        hoverBackgroundColor: ["#66BB6A","#D32F2F"],
                    }
                ]
            }
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


.widget-list-type2 .label {
    top: 1rem;
    left: 0.75rem;
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

.widget-list-type2  .doughnut{
    height: 3rem;
    width: 3rem;
    left: 0;
    top: 0;
}

</style>