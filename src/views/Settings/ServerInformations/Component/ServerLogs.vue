<template>
    <div>
        <Card>
            <template #title>
                <span style="margin: 0 0 2px; font-size:1.2rem">{{ $t('settings.server_information.user_logs') }}</span>
            </template>
            <template #content>
                <Timeline :value="servers" class="customized-timeline">
                    <template #marker>
                        <span class="custom-marker shadow-2">
                            <i class="pi pi-star-fill"></i>
                        </span>
                    </template>
                    <template #content="slotProps">
                        <h5 style="margin: 0 0 2px; font-size:1.2rem">{{slotProps.item.machineName}}</h5> 
                        <small style="color: #08255880; ">
                            {{  $t('settings.server_information.uptime') + ":  " + 
                                getPropertyValue(slotProps.item.properties,"uptime_days")+ " " + $t('settings.server_information.day') + " " +
                                getPropertyValue(slotProps.item.properties,"uptime_hours") + $t('settings.server_information.hour') + " " +
                                getPropertyValue(slotProps.item.properties,"uptime_minutes") + " " + $t('settings.server_information.minute') }}
                        </small>
                        <p>{{ slotProps.item.description}}</p>                      
                    </template>
                </Timeline>
            </template>
        </Card> 
          
    </div>
        
</template>

<script>
export default{

    props: {
        servers: {
            type: Object,
            description: "Server disk",
        },
        serversData:{
            type: Object,
            description: "Server data db",
        },
    },

    data() {
        
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