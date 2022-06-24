<template>
    <div>
        <Dialog
            :header="$t('about.about')" 
            :modal="true"
            :style="{ width: '25vw'}"
            v-model:visible="showDialog"
            @hide="showDialog = false">
            <div class="confirmation-content">
                <div class="p-fluid">
                    <div class="p-field">
                        <span>
                            {{$t('about.about_us_message')}}    
                        </span>
                    </div>
                    <div class="p-field">
                        <span>
                            {{$t('about.version')}} {{version}}
                        </span>
                    </div>
                    <div class="p-field">
                        <span>
                            <i class="pi pi-link"></i>&nbsp;
                            <a href="http://liderahenk.org/" type="primary" target="_blank">
                                {{$t('about.more_information')}}
                            </a>
                        </span>
                    </div>
                </div>
            </div>
            <template #footer>
                <Button 
                    :label="$t('node_detail.close')" 
                    icon="pi pi-times"
                    @click="showDialog = false" 
                    class="p-button-text p-button-sm">
                </Button>
            </template>
        </Dialog>  
    </div>
</template>

<script>

export default {

    props: {
        showAboutDialog: {
            type: Boolean,
            default: false
        },
    },

    data() {
        return {
            version: "1.0.0"
        }
    },

    computed: {
        showDialog: {
            get () {
                this.getVersion()
                return this.showAboutDialog;
            },

            set (value) {
                if (!value) {
                    this.$emit('closeAboutDialog')
                }
            }
        }
    },

    methods: {
        getVersion() {
            this.version = process.env.VUE_APP_VERSION = require('../../../../package.json').version;
        }
    }
}
</script>

<style lang="scss" scoped>
.confirmation-content {
    display: flex;
    align-items: center;
    // justify-content: center;
}
</style>