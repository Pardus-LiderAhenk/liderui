<template>
    <div>
        <!-- Add Policy Dialog -->
        <Dialog :header="$t('policy_management.add_policy')" v-model:visible="showDialog" 
            :style="{width: '30vw'}" :modal="true">
            <div class="p-fluid">
                <div class="p-field">
                    <label for="label">{{$t('policy_management.policy_name')}}</label>
                    <InputText :class="validation.label ? 'p-invalid': ''" type="text" v-model="label"/>
                    <small v-if="validation.label" class="p-error">
                        {{ $t('policy_management.policy_name_warn')}}
                    </small>
                </div>
                <div class="p-field">
                    <label for="description">{{$t('policy_management.description')}}</label>
                    <InputText type="text" v-model="description"/>
                </div>
                <div class="p-field p-grid">
                    <InputSwitch v-model="active"/>
                    <div class="p-col">
                        <label class="p-col-fixed" >{{ $t('policy_management.enable') }}</label>
                    </div>
                </div>
            </div>
            <template #footer>
                <Button :label="$t('policy_management.cancel')" icon="pi pi-times" 
                    @click="showDialog = false" class="p-button-text p-button-sm"
                />
                <Button :label="$t('policy_management.add')" icon="pi pi-plus"
                    @click="addPolicy" class="p-button-sm"
                />
            </template>
        </Dialog>
        <!-- Add Policy Dialog End -->
    </div>
</template>

<script>
/**
 * Create user policy dialog
 * @see {@link http://www.liderahenk.org/}
* emits these events
* @event closePolicyDialog
* @event appendPolicy
*/

import axios from "axios";

export default {

    props: {
        addPolicyDialog: {
            type: Boolean,
            default: false,
            description: "New policy added",
        },
    },

    data(){
        return{
            label:'',
            description: '',
            active: false,
            validation: {
                label: false,
            },
        }
    },

    computed: {
        showDialog: {
            get () {
                return this.addPolicyDialog
            },

            set (value) {
                if (!value) {
                    this.$emit('closePolicyDialog');
                }
            }
        }
    },

    methods: {
        addPolicy() {
            if (!this.label.trim()) {
                this.validation.label = true;
                return;
            }
            let params = {
                "label": this.label,
                "description": this.description,
                "active": this.active
            }
            axios.post('/policy/add', params).then(response => {
                if (response.data) {
                    this.$emit('appendPolicy', response.data);
                    this.$emit('closePolicyDialog');
                    this.$toast.add({
                        severity:'success', 
                        detail: this.$t('policy_management.add_policy_success'), 
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000
                    });
                } else {
                    this.$toast.add({
                        severity:'error', 
                        detail: this.$t('policy_management.add_policy_error'), 
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000
                    });
                }
            }).catch((error) => {
                this.$toast.add({
                    severity:'error', 
                    detail: this.$t('policy_management.add_policy_error')+ " \n"+error, 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
            });
            this.label = '';
            this.description = '';
        }
    },

    watch:{
        showDialog() {
            if (this.showDialog) {
                this.label = "";
                this.description = "";
                this.validation.label = false;
            }
        }
    }
}
</script>

<style lang="scss" scoped>

</style>