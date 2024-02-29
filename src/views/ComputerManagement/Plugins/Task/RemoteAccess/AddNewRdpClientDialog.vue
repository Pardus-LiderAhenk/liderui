<template>
    <div>
        <Dialog 
            v-model:visible="modalVisible" 
            :breakpoints="{ '960px': '75vw', '640px': '100vw' }"
            :style="{ width: '50vw' }" 
            :dismissableMask="true" 
            :closeOnEscape="true"
        >
            <template #header>
                <h4>
                    {{
                        form?.id == null ? $t('computer.plugins.remote_access.add_new_client') :
                        $t('computer.plugins.remote_access.edit_client')
                    }}
                </h4>
            </template>

            <div class="p-col-12 p-pb-0" v-loading="loading" element-loading-text="loading"
                element-loading-background="rgba(0, 0, 0, 0.6)" :element-loading-spinner="svg">

                <div class="p-inputgroup">
                    <label for="host">{{ $t('computer.plugins.remote_access.ip_address') }}</label>
                </div>
                <div class="p-inputgroup p-mt-1">
                    <InputText id="host" v-model="form.host" />
                </div>
                <small v-show="validationErrors.host" class="p-error"> {{
                    $t('computer.plugins.remote_access.ip_address_cannot_be_null') }}
                </small>

                <div class="p-inputgroup p-mt-2">
                    <label for="username"> {{ $t('computer.plugins.remote_access.username') }} </label>
                </div>
                <div class="p-inputgroup  p-mt-1">
                    <InputText id="username" v-model="form.username" />
                </div>
                <small v-show="validationErrors.username" class="p-error"> {{
                    $t('computer.plugins.remote_access.username_cannot_be_null') }}
                </small>

                <div class="p-inputgroup p-mt-2">
                    <label for="hostname"> {{ $t('computer.plugins.remote_access.hostname') }} </label>
                </div>
                <div class="p-inputgroup  p-mt-1">
                    <InputText id="hostname" v-model="form.hostname" />
                </div>
                <small v-show="validationErrors.hostname" class="p-error"> {{
                    $t('computer.plugins.remote_access.hostname_cannot_be_null') }}
                </small>

                <div class="p-inputgroup p-mt-2">
                    <label for="description">{{ $t('computer.plugins.remote_access.description_field') }}</label>
                </div>
                <div class="p-inputgroup  p-mt-1">
                    <InputText id="description" v-model="form.description" />
                </div>
            </div>

            <template #footer>
                <Button :label="$t('computer.plugins.remote_access.cancel')" 
                    icon="pi pi-times" 
                    class="p-button-text p-button-sm" 
                    @click="modalVisible = false" 
                />
                <Button
                    :label="form?.id ? $t('computer.plugins.remote_access.update') : $t('computer.plugins.remote_access.save')"
                    :icon="form?.id ? 'pi pi-sync' : 'pi pi-save'" 
                    class="p-button-sm"
                    @click="saveRdpClient" 
                />
            </template>
        </Dialog>
    </div>
</template>

<script>


export default {

    props: ['showAddNewRdpClientDialog', 'selectedRdpClient'],
    emits: ['closeNewRdpClientDialog', 'saveRdpClient'],


    data() {
        return {
            form: {
                id: null,
                host: null,
                username: null,
                hostname: null,
                description: null,
            },
            validationErrors: {},
            loading: false,
            svg: null,
        }
    },


    computed: {
        modalVisible: {
            get() {
                return this.showAddNewRdpClientDialog;
            },
            set() {
                this.$emit('closeNewRdpClientDialog');
            }
        },
    },

    methods: {
        async saveRdpClient() {
            if (!this.validateForm()) {
                return;
            }

            if (this.form?.id) {
                let params = {
                    id: this.form.id,
                    host: this.form.host,
                    username: this.form.username,
                    hostname: this.form.hostname,
                    description: this.form.description,
                }
                this.$emit('saveRdpClient', 'updated', params);
                this.loading = false;
            }

            else {
                let params = {
                    host: this.form.host,
                    username: this.form.username,
                    hostname: this.form.hostname,
                    description: this.form.description,
                }

                this.$emit('saveRdpClient', 'added', params);
                this.loading = false;
            }

            this.$emit('closeNewRdpClientDialog');
        },

        validateForm() {
            if (this.form.host == "" || this.form.host == null) {
                this.validationErrors['host'] = true;
            } 
            else {
                delete this.validationErrors['host'];
            }

            if (this.form.username == "" || this.form.username == null) {
                this.validationErrors['username'] = true;
            } 
            else {
                delete this.validationErrors['username'];
            }
            if (this.form.hostname == "" || this.form.hostname == null) {
                this.validationErrors['hostname'] = true;
            } 
            else {
                delete this.validationErrors['hostname'];
            }

            return !Object.keys(this.validationErrors).length;
        },
    },

    mounted() {
        if (this.selectedRdpClient) {
            this.form = { ...this.selectedRdpClient };
        }
    },

    watch: {
        form: {
            handler() {
                this.validateForm();
            },
            deep: true,
        },
    },
}
</script>

<style lang="scss" scoped></style>