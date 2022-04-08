<template>
    <Dialog :header="header" v-model:visible="modalVisible"
            :style="{width: '20vw'}" :modal="true">
        <div class="p-fluid">
            <p></p>
            <small>
                {{message}}
            </small>
        </div>
        <template #footer>
            <Button :label="$t('policy_management.cancel')" icon="pi pi-times" 
                @click="modalVisible = false" class="p-button-text p-button-sm"
            />
            <Button :label="$t('policy_management.yes')" icon="pi pi-check"
                @click="accept" class="p-button-sm"
            />
        </template>
    </Dialog>
</template>

<script>

export default {
    props:['message', 'header', 'showDialog'],
    emits:['accepted'],
    computed: {
        modalVisible: {
            get() {
                return this.showDialog;
            },
            set() {
                this.$emit('showDialog', false);
            }
        },
    },
    methods: {
        accept() {
            this.$emit('accepted');  
        },
    }
}
</script>
