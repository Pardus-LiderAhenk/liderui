<template>
    <div>
        <Dialog
            v-model:visible="showDialog"
            :breakpoints="{ '960px': '75vw', '640px': '100vw' }"
            :style="{ width: '50vw' }" :modal="true"
            :header="$t('reports.detailed_agent_report.agent_detail')"
        >
            <h4>{{$t('reports.detailed_agent_report.general_information')}}</h4>
            <div class="p-grid">
            <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
            <div class="p-col-4"><b>{{$t('reports.detailed_agent_report.computer_name')}}</b></div>
            <div class="p-col-8">{{ selectedAgent.hostname }}</div>
            <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
            <div class="p-col-4"><b>{{$t('reports.detailed_agent_report.mac_address')}}</b></div>
            <div class="p-col-8">
                {{ selectedAgent.macAddresses.replace(/'/g, "") }}
            </div>
            <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
            <div class="p-col-4"><b>JID</b></div>
            <div class="p-col-8">{{ selectedAgent.jid }}</div>
            <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
            <div class="p-col-4"><b>{{$t('reports.detailed_agent_report.ip_address')}}</b></div>
            <div class="p-col-8">
                {{ selectedAgent.ipAddresses.replace(/'/g, "") }}
            </div>
            <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
            <div class="p-col-4"><b>{{$t('reports.detailed_agent_report.operating_system_version')}}</b></div>
            <div class="p-col-8">
                {{
                getPropertyValue(selectedAgent.properties, "os.distributionVersion")
                }}
            </div>
            <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
            <div class="p-col-4"><b>{{$t('reports.detailed_agent_report.ahenk_version')}}</b></div>
            <div class="p-col-8">
                {{ getPropertyValue(selectedAgent.properties, "agentVersion") }}
            </div>
            <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
            <div class="p-col-4"><b>{{$t('reports.detailed_agent_report.create_date')}}</b></div>
            <div class="p-col-8">{{ selectedAgent.createDate }}</div>
            <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
            <div class="p-col-4"><b>{{$t('reports.detailed_agent_report.update_date')}}</b></div>
            <div class="p-col-8">{{ selectedAgent.updateDate }}</div>
            <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
            </div>

            <h4>{{$t('reports.detailed_agent_report.disk_and_memory_information')}}</h4>
            <div class="p-grid">
            <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
            <div class="p-col-4"><b>{{$t('reports.detailed_agent_report.total_disk_space')}}</b></div>
            <div class="p-col-8">
                {{
                (
                    getPropertyValue(selectedAgent.properties, "hardware.disk.total") /
                    1000
                )
                    .toFixed(2)
                    .toLocaleString("tr-TR")
                }}
            </div>
            <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
            <div class="p-col-4"><b>{{$t('reports.detailed_agent_report.used_disk_space')}}</b></div>
            <div class="p-col-8">
                {{
                (
                    getPropertyValue(selectedAgent.properties, "hardware.disk.used") /
                    1000
                )
                    .toFixed(2)
                    .toLocaleString("tr-TR")
                }}
            </div>
            <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
            <div class="p-col-4"><b>{{$t('reports.detailed_agent_report.free_disk_space')}}</b></div>
            <div class="p-col-8">
                {{
                (
                    (getPropertyValue(selectedAgent.properties, "hardware.disk.total") -
                    getPropertyValue(
                        selectedAgent.properties,
                        "hardware.disk.used"
                    )) /
                    1000
                )
                    .toFixed(2)
                    .toLocaleString("tr-TR")
                }}
            </div>
            <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
            <div class="p-col-4"><b>{{$t('reports.detailed_agent_report.disk_partitions')}}</b></div>
            <div class="p-col-8">
                {{
                getPropertyValue(selectedAgent.properties, "hardware.disk.partitions")
                }}
            </div>
            <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
            <div class="p-col-4"><b>RAM(GB)</b></div>
            <div class="p-col-8">
                {{
                (
                    getPropertyValue(
                    selectedAgent.properties,
                    "hardware.memory.total"
                    ) / 1000
                )
                    .toFixed(2)
                    .toLocaleString("tr-TR")
                }}
            </div>
            <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
            </div>

            <h4>{{$t('reports.detailed_agent_report.processor_information')}}</h4>
            <div class="p-grid">
            <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
            <div class="p-col-4"><b>{{$t('reports.detailed_agent_report.processor')}}</b></div>
            <div class="p-col-8">
                {{ getPropertyValue(selectedAgent.properties, "processor") }}
            </div>
            <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
            <div class="p-col-4"><b>{{$t('reports.detailed_agent_report.number_of_physical_cores')}}</b></div>
            <div class="p-col-8">
                {{
                getPropertyValue(
                    selectedAgent.properties,
                    "hardware.cpu.physicalCoreCount"
                )
                }}
            </div>
            <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
            </div>

            <template #footer>
            <Button
                :label="this.$t('reports.detailed_agent_report.close')"
                icon="pi pi-times"
                class="p-button-text p-button-sm"
                @click="showDialog = false"
            />
            </template>
        </Dialog>
    <!-- Add Group Dialog End-->
    </div>
</template>


<script>
/**
 * Agent Detail Dialog
 * @see {@link http://www.liderahenk.org/}
 */

export default {

    props: {
        selectedAgent: {
            type: Object,
            description: "Selected agent",
        },

        agentDetailDialog: {
            type: Boolean,
            default: false,
        },
    },

    computed: {
        showDialog: {
            get () {
                return this.agentDetailDialog;
            },

            set (value) {
                if (!value) {
                    this.$emit('closeAgentDetailDialog')
                }
            }
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

</style>