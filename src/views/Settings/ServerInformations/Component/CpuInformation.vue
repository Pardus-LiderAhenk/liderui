<template>
    <div>
        <Card>
            <template #title>
                <div class="p-d-flex p-jc-between">
                    <span style="margin: 0 0 2px; font-size:1.2rem">{{ $t("settings.server_information.cpu_usage")}}</span> 

                        <!-- <Button 
                            class="p-button-sm" 
                            :label="$t('Cpu izle')"
                            icon="pi pi-caret-right" 
                            @click="addServerModalVisible =  true;">
                        </Button> -->
                </div>
            </template>
            <template #content>
                <div class="servers">
                    <div v-for="server in servers" v-bind:key="server">
                        <ul>
                            <li class="down">
                                <div class="stock-name" >
                                    <h6 >
                                        {{ server.machineName}}
                                    </h6>
                                </div>
                                <img :src="img" alt="freya-layout"  width="42" height="42">
                                <div class="stock-price" >
                                    <h6>
                                    {{
                                        (getPropertyValue(server.properties, "cpu_core")) +" Core"
                                 
                                    }}                                 
                                    </h6>
                                </div>
                                <div class="server-status">
                                    <span >
                                       <b> 
                                        {{ "% "+ ((1000*((getPropertyValue(server.properties, "cpu_user"))+(getPropertyValue(server.properties, "cpu_system")))/((getPropertyValue(server.properties, "cpu_idle"))+(getPropertyValue(server.properties, "cpu_user"))+(getPropertyValue(server.properties, "cpu_system")))).toFixed(4)) }}
                                       </b>
                                    </span>
                                </div>
                            </li>
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
        servers: {
            type: Object,
            description: "Server list",
        },
    },

    data() {
        return {
            img: require("@/assets/images/servers/cpu-icon.png"),
            cpuInfodata : null,
            chartData: null,
            chartOptions: {
                cutout: '60%',
                responsive: true,
            },
            chartStyle: { 
                width: '20%', 
                height: '3px' 
            },

        }
        
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

        getCpuInfo(server) {
            console.log(server)
            let cpuData = {};
            var cpuUsed = 50.0;
            var cpuFree = 50.0;
                cpuUsed = (((100*((this.getPropertyValue(server.properties,"cpu_user")+this.getPropertyValue(server.properties,"cpu_system"))/((this.getPropertyValue(server.properties,"cpu_user")+this.getPropertyValue(server.properties,"cpu_system")+this.getPropertyValue(server.properties,"cpu_idle"))))).toString()).substring(0,8));
                cpuFree = ((100-cpuUsed).toString()).substring(0,8);
                cpuData = {
                    //labels:["cpuUsed","cpuFree"],
                    datasets: [
                        {
                            data: [cpuUsed,cpuFree],
                            backgroundColor: ["#D32F2F","#66BB6A"],
                            hoverBackgroundColor: ["#D32F2F","#66BB6A"],
                        }
                    ]
                }
                return cpuData;
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
.chart-container {
    width: 50%;
    max-width: 75px; /* Adjust the size as needed */
    margin: 0 auto;
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
::v-deep(.p-progressbar-blue) {
    height: 10rem;
    background-color: #1769aa;

    .p-progressbar-value {
        background-color: #419544;
        
    }
    
  }
  ::v-deep(.p-progressbar-red) {
    height: 10rem;
    background-color: #419544;
  }
    .p-progressbar-value {
        background-color:#1769aa;
    }

    .servers ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }
    * {
        box-sizing: border-box;
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
    
    .servers ul > li {
        display: -ms-flexbox;
        display: flex;
        -ms-flex-align: center;
        align-items: center;
        -ms-flex-pack: justify;
        justify-content: space-between;
        background-color: #F7FAFF;
        padding: 0;
        margin: 0 0 12px;
        -moz-border-radius: 6px;
        -webkit-border-radius: 6px;
        border-radius: 6px;
        overflow: hidden;
    }
    * {
        box-sizing: border-box;
    }
    
    li {
        text-align: -webkit-match-parent;
    }
    
    .servers ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }
    
    .servers ul > li .server-status span {
        display: inline-block;
        font-weight: 800;
        font-size: 15px;
        line-height: 12px;
        color: rgba(10, 27, 56, 0.5);
    }
    .servers ul > li .server-status {
        margin-left: 4px;
        padding: 0 10px;
    }
    
    .servers ul > li .stock-price h6 {
        line-height: 17px;
        font-weight: 600;
        display: inline-block;
    }
    
    .servers ul > li .stock-price {
        padding: 5 10px;
        color: #2321b8;
        margin: 0 4px;
    }
    
    h6 {
        font-size: 1rem;
    }
    h1, h2, h3, h4, h5, h6 {
        margin: 1.5rem 0 1rem 0;
        font-family: inherit;
        font-weight: 600;
        line-height: 1.2;
        color: inherit;
    }

</style>