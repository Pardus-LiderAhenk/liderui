<template>
    <div>
        <Dialog
            header="Liderahenk MYS Hakkında" 
            :modal="true"
            :style="{ width: '25vw'}"
            v-model:visible="showDialog"
            @hide="showDialog = false">
            <div class="confirmation-content">
                <div class="p-fluid">
                    <div class="p-field">
                        <span>
                            Kurumsal ağ üzerindeki sistemleri ve kullanıcıları merkezden yönetilebilmeyi, 
                            izlemeyi ve denetlemeyi sağlayan, açık kaynaklı bir yazılım sistemidir.
                        </span>
                    </div>
                    <div class="p-field">
                        <span>
                            Versiyon: Liderahenk 3.0.0
                        </span>
                    </div>
                    <div class="p-field">
                        <span>
                            <i class="pi pi-link"></i>&nbsp;
                            <a href="http://liderahenk.org/" type="primary" target="_blank">
                                Daha fazla bilgi için ...
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

    computed: {
        showDialog: {
            get () {
                return this.showAboutDialog;
            },

            set (value) {
                if (!value) {
                    this.$emit('closeAboutDialog')
                }
            }
        }
    },
}
</script>

<style lang="scss" scoped>
.confirmation-content {
    display: flex;
    align-items: center;
    // justify-content: center;
}
</style>