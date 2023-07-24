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

                    <div>
                    <div v-for="server in servers" v-bind:key="server">
                        <div class="flex align-items-center justify-content-between mb-2">
                            <span class="font-bold">

                                {{ server.ip }}

                            </span>
                            <span>

                                <!-- {{ "%" + (getPropertyValue(server.properties, "disk_total")%1024) total_disk_empty}} -->
                                {{ "%" + ((getPropertyValue(server.properties, "disk_total")-getPropertyValue(server.properties, "total_disk_empty"))/1024) }}

                            </span>
                        </div>
                        <div role="progressbar" class="p-progressbar p-component p-progressbar-determinate orange-bar mb-4" aria-valuemin="0" aria-valuenow="40" aria-valuemax="100">
                        <div class="p-progressbar-value p-progressbar-value-animate" style="width: 40%; display: flex;"></div>
                        
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
                //return "%55";
            },

    },

    mounted() {
        this.servers
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

</style>