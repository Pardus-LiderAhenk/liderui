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

                    <img :src="img" alt="product" class="responsive" style="width: 700px; display: flex;">

                    <div v-for="server in servers" v-bind:key="server">
                        <br/>
                        <div>
                            <div>

                                {{ server.ip }}
                             
                            </div>
                            <!-- <div>
                                
                                {{ "%" + (10*((((getPropertyValue(server.properties, 'total_disk_empty')*4096)/1073741824)/((getPropertyValue(server.properties, 'disk_total')*4096)/1073741824))).toFixed(2)) }}
                            
                            </div> -->
                            <div>

                            <ProgressBar class="p-progressbar-blue"

                                :value="((100*((((getPropertyValue(server.properties, 'total_disk_empty')*4096)/1073741824)/((getPropertyValue(server.properties, 'disk_total')*4096)/1073741824)))).toFixed(2))"
                                v-if="Number(100*(getPropertyValue(server.properties, 'total_disk_empty')/(getPropertyValue(server.properties, 'disk_total'))).toFixed(2)) < 90.00"
                                style="display: contents; width: 40rem; height: 1rem;">
                            
                            </ProgressBar>
                            
                            <ProgressBar class="p-progressbar-red"

                                :value="((100*((((getPropertyValue(server.properties, 'total_disk_empty')*4096)/1073741824)/((getPropertyValue(server.properties, 'disk_total')*4096)/1073741824)))).toFixed(2))"
                                v-if="Number(100*(getPropertyValue(server.properties, 'total_disk_empty')/(getPropertyValue(server.properties, 'disk_total'))).toFixed(2)) > 90.00"
                                style="display: flex; width: 40rem; height: 1rem;">
                            
                            </ProgressBar> 
                        </div>

                        </div>

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
            description: "Server disk",
        },
    },

    data() {
        return {
            img: require("@/assets/images/servers/disk-icon-1.png"),
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

    },

    mounted() {
        console.log(this.servers)
    }
    
}
</script>

<style lang="scss" scoped>

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



.responsive {
    max-width: 100%;
    height: auto;
  }

::v-deep(.p-progressbar-blue) {
    height: 10rem;
    background-color: #419544;

    .p-progressbar-value {
        background-color: #1769aa;
    }
    
  }
  ::v-deep(.p-progressbar-red) {
    height: 10rem;
    background-color: #419544;
  
    .p-progressbar-value {
        background-color:#1769aa;
    }
    
  }

</style>