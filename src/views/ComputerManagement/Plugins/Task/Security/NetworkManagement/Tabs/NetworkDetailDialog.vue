<template>
    <div>
        <Dialog
            :header='$t("computer.plugins.network_management.current_configuration")'
            :modal="true"
            :style="{ width: '40vw' }"
            :maximizable="false"
            v-model:visible="showDetailDialog"
            @hide="closeDialog"
        >
            <div class="p-grid p-flex-column">
                <div class="p-fluid p-formgrid p-grid p-col">
                    <div class="p-field p-col-12">
                        <Textarea
                            :autoResize="false"
                            style="width: 100%; height: 350px"
                            v-model="detailContent"
                            disabled>
                        </Textarea>
                    </div>
                </div>
            </div>
            <template #footer>
                <Button
                    :label="$t('settings.system_monitoring_definitions.cancel')"
                    icon="pi pi-times"
                    @click.prevent="closeDialog"
                    class="p-button-text p-button-sm">
                </Button>
            </template>
        </Dialog>
    </div>
</template>

<script>
export default {

    data() {
        return {
            showDetailDialog: false,
            detailContent: ""
        }
    },

    props: {
        showNetworkDetailDialog: {
            type: Boolean,
        },
        content: {
            type: String,
            description: "Content of network manager"
        }
    },

    methods: {
        closeDialog() {
            this.showDetailDialog = false;
            this.$emit("closeNetworkDetailDialog");
        }
    },

    watch: {
        showNetworkDetailDialog() {
            this.showDetailDialog = this.showNetworkDetailDialog;
        },

        content() {
            this.detailContent = this.content;
        }
    }
}
</script>