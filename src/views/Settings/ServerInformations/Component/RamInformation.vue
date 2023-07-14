<template>
    <div>
        <Card>
            <template #title>
                <div class="p-d-flex p-jc-between">
                    <span style="margin: 0 0 2px; font-size:1.2rem">Ram usage</span> 

                        <!-- <Button 
                            class="p-button-sm" 
                            :label="$t('Ram izle')"
                            icon="pi pi-caret-right" 
                            @click="addServerModalVisible =  true;">
                        </Button> -->
                </div>
            </template>
            <template #content>
                
                <div class="servers" data-v-4d2c924c="">
                <div v-for="server in servers" v-bind:key="server">

                    <ul data-v-4d2c924c="">
                        <li class="down" data-v-4d2c924c="">
                            <div class="stock-name" data-v-4d2c924c="">
                                <h6 data-v-4d2c924c="">
                                    {{ server.ip }}
                                </h6>
                            </div>
                            <img :src="img" alt="freya-layout" data-v-4d2c924c="" width="42" height="42">
                            <div class="stock-price" data-v-4d2c924c=""><i class="pi pi-arrow-down" data-v-4d2c924c=""></i>
                                <h6 data-v-4d2c924c="">54.20</h6>
                            </div>
                            <div class="server-status" data-v-4d2c924c="">
                                <span data-v-4d2c924c="">%183.16</span>
                                <span data-v-4d2c924c="">4.01</span>
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

    },

    mounted() {
        console.log(this.servers);
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
    display: block;
    font-weight: 600;
    font-size: 10px;
    line-height: 12px;
    color: rgba(41, 50, 65, 0.5);
}
.servers ul > li .server-status {
    margin-left: 4px;
    padding: 0 20px;
}

.servers ul > li .stock-price h6 {
    line-height: 17px;
    font-weight: 600;
    display: inline-block;
}

.servers ul > li .stock-price {
    padding: 0 10px;
    color: #34B56F;
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