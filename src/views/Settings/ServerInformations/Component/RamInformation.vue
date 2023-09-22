<template>
    <div>
        <Card>
            <template #title>
                <div class="p-d-flex p-jc-between">
                    <span style="margin: 0 0 2px; font-size:1.2rem">{{ $t("settings.server_information.ram_usage")}}</span> 

                        <!-- <Button 
                            class="p-button-sm" 
                            :label="$t('Ram izle')"
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
                            <div class="machine-name p-d-flex p-jc-start p-col" >
                                <h6 >
                                    {{ server.machineName}}
                                </h6>
                            </div>
                            <div class="p-d-flex p-jc-end p-col">
                                <img :src="img" class="p-mr-2" alt="ram-image"  width="42" height="42" flex-direction: column>
                            </div>
                            <div class="server-properties p-col" >
                                <h6>
                                {{
                                     ((getPropertyValue(server.properties, "physical_memory"))/1024000000).toFixed(2) +" GB"
                                }}
                            </h6>
                            </div>
                            <div class="server-status p-col">
                                <span >
                                   <b> {{ "% "+ (((getPropertyValue(server.properties, "memory_free"))/1024000000)/((getPropertyValue(server.properties, "physical_memory"))/1000000000)).toFixed(2) }}
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
            description: "Server disk",
        },
    },

    data() {
        return {
            img: require("@/assets/images/servers/ram-icon.png"),
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

    }
    
}
</script>

<style lang="scss" scoped>
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

.servers ul > li .server-properties h6 {
    line-height: 17px;
    font-weight: 600;
    display: inline-block;
}

.servers ul > li .server-properties {
    padding: 5 10px;
    color: #2321b8;
    margin: 0 4px;
    display: flex;
    flex-direction: column;
    align-items: center; 
}

h6 {
    font-size: 1rem;
    margin: 1.5rem 0 1rem 0;
    font-family: inherit;
    font-weight: 600;
    line-height: 1.2;
    color: inherit;
}

.ram-image{
    position: relative;
    right: 10px;
    
}

</style>