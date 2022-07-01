<template>
<div>
    <Card>
        <template #title>
            <span style="margin: 0 0 2px; font-size:1.2rem">{{$t('dashboard_screen.last_activity')}}</span>
        </template>
        <template #subtitle>
            <span style="margin: 0 0 2px; font-size:1rem">{{$t('dashboard_screen.lider_interface_usage_history')}}</span>
        </template>
        <template #content>
            <Timeline :value="activityData" class="customized-timeline">
                <template #marker>
                    <span class="custom-marker shadow-2">
                        <i class="pi pi-send"></i>
                    </span>
                </template>
                <template #content="slotProps">
                    <h5 style="margin: 0 0 2px; font-size:1.2rem">{{getOpetarionType(slotProps.item.crudType)}}</h5>
                    <small style="color: #29324180; ">{{slotProps.item.createDate}}</small>
                    <p>{{slotProps.item.logMessage}}</p>
                </template>
            </Timeline>
        </template>
    </Card>
</div>
    
</template>

<script>
export default {
    props: {
        lastActivityData: {
            type: Object,
            default: null,
        },
    },

    computed: {
        activityData: {
            get () {
                let data = null;
                if (this.lastActivityData) {
                    data = this.lastActivityData.content;
                }
                return data;
            },
        },
    },

    methods: {
        getOpetarionType(type) {
            var typeText = type;
            if (type == "CREATE") {
                typeText = this.$t('reports.system_log_report.create');
            } else if (type == "READ") {
                typeText = this.$t('reports.system_log_report.read');
            } else if (type == "UPDATE") {
                typeText = this.$t('reports.system_log_report.update');
            } else if (type == "DELETE") {
                typeText = this.$t('reports.system_log_report.delete');
            } else if (type == "LOGIN") {
                typeText = this.$t('reports.system_log_report.login');
            } else if (type == "LOGOUT") {
                typeText = this.$t('reports.system_log_report.logout');
            } else if (type == "EXECUTE_TASK") {
                typeText = this.$t('reports.system_log_report.execute_task');
            } else if (type == "EXECUTE_POLICY") {
                typeText = this.$t('reports.system_log_report.execute_policy');
            } else if (type == "CHANGE_PASSWORD") {
                typeText = this.$t('reports.system_log_report.change_password');
            } else if (type == "MOVE") {
                typeText =this.$t('reports.system_log_report.move');
            } else if (type == "UNASSIGMENT_POLICY") {
                typeText = this.$t('reports.system_log_report.cancel_policy');
            }else if (type == "CANCEL_SCHEDULED_TASK") {
                typeText = this.$t('reports.system_log_report.scheduled_task_cancel');
            }else if (type == "UPDATE_SCHEDULED_TASK") {
                typeText = this.$t('reports.system_log_report.scheduled_task_update');
            }
            return typeText;
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

::v-deep(.p-timeline-left) {
    .p-timeline-event-opposite {
        display: none;
    }
}

</style>

