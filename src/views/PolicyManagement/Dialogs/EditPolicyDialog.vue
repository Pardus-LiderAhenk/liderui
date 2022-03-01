<template>
    <div>
        <!-- Add Policy Dialog -->
        <Dialog :header="$t('policy_management.edit')" v-model:visible="showDialog" 
            :style="{width: '50vw'}" :modal="true">
            <div class="p-fluid">
                <div class="p-fluid p-grid p-field p-formgrid">
                    <div class="p-field p-col-12 p-md-3">
                        <label for="label">{{$t('policy_management.policy_name')}}</label>
                        <InputText :class="validation.label ? 'p-invalid': ''" type="text" v-model="label"/>
                        <small v-if="validation.label" class="p-error">
                            {{ $t('policy_management.policy_name_warn')}}
                        </small>
                    </div>
                    <div class="p-field p-col-12 p-md-7">
                        <label for="description">{{$t('policy_management.description')}}</label>
                        <InputText type="text" v-model="description"/>
                    </div>
                    <div class="p-field p-col-12 p-md-2">
                        <label for="active">{{ $t('policy_management.status') }}</label>
                        <Dropdown v-model="active" optionValue="value" optionLabel="label"
                            :options="[
                                {label: $t('policy_management.active'), value: true},
                                {label: $t('policy_management.passive'), value: false}
                            ]">
                        </Dropdown>
                    </div>
                </div>
            </div>
            <template #footer>
                <Button :label="$t('policy_management.cancel')" icon="pi pi-times" 
                    @click="showDialog = false" class="p-button-text p-button-sm"
                />
                <Button :label="$t('policy_management.update')" icon="pi pi-refresh"
                    @click="addFolder" class="p-button-sm"
                />
            </template>
        </Dialog>
        <!-- Add Policy Dialog End -->
    </div>
</template>

<script>
/**
 * Create user policy 
 * @see {@link http://www.liderahenk.org/}
 * emits these events
 * @event closePolicyDialog
 * @event updatedPolicy
 */

import axios from "axios";

export default {

    props: {
        editPolicyDialog: {
            type: Boolean,
            default: false,
            description: "New policy added",
        },
        selectedPolicy: {
            type: Object,
            description: "selected policy",
            default: null
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
                return this.editPolicyDialog;
            },

            set (value) {
                if (!value) {
                    this.$emit('closePolicyDialog');
                } else {
                    
                }
            }
        }
    },

    methods: {
        addFolder() {
            if (!this.label.trim()) {
                this.validation.label = true;
                return;
            }
            let params = new FormData();
            params.append("parentName", this.selectedNode.distinguishedName);
            params.append("ou", this.folderName);
            axios.post('/policy/update', params).then(response => {
                if (response.data) {
                    this.$emit('appendNode', response.data, this.selectedNode);
                    this.$emit('closeAdDialog');
                    this.$toast.add({
                        severity:'success', 
                        detail: this.$t('user_management.add_folder_success'), 
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000
                    });
                } else {
                    this.$toast.add({
                        severity:'error', 
                        detail: this.$t('user_management.add_folder_error'), 
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000
                    });
                }
            });
            this.label = '';
            this.description = '';
        },
    },

    watch: {
        selectedPolicy() {
            if (this.selectedPolicy) {
                this.label = this.selectedPolicy.label;
                this.description = this.selectedPolicy.description;
                this.active = this.selectedPolicy.active;
            }
        }
    }
    
}
</script>

<style lang="scss" scoped>

</style>