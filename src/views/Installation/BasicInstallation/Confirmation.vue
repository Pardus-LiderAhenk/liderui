<template>
    <div class="stepsdemo-content">
        <div class="p-field p-d-flex p-jc-between">
            <div>
                <Button label="Back" @click="prevPage" icon="pi pi-angle-left" />
            </div>
            <div class="p-ml-2">
                <Button label="Start Installation"
                    @click="confirmDialog = true" icon="pi pi-check"
                    :disabled="startDisabled"
                    class="p-button-success"
                />
            </div>
        </div>
        <Panel header="Confirmation">
            <template #header>
                <h3 style="fontSize: 1.5rem">Confirmation</h3>
            </template>
            <template #icons>
                <i class="pi pi-th-large" style="fontSize: 1.5rem;color:#3296F3;"></i>
            </template>
            
            <div class="p-grid">
                <div class="p-field p-col-4">
        <!-- Database Information -->
                    <Fieldset legend="Database">
                        <div class="p-field p-grid">
                            <div class="p-col-4">
                                <label for="class">Server Address: </label>
                            </div>
                            <div class="p-col-8">
                                <p>{{ formData.dbServerAddress}}</p>
                            </div>
                        </div>
                        <div class="p-field p-grid">
                            <div class="p-col-4">
                                <label for="class">Username: </label>
                            </div>
                            <div class="p-col-8">
                                <p>{{ formData.dbServerUsername}}</p>
                            </div>
                        </div>
                        <div class="p-field p-grid">
                            <div class="p-col-4">
                                <label for="class">Password: </label>
                            </div>
                            <div class="p-col-8">
                                <p>{{ formData.dbServerPassword}}</p>
                            </div>
                        </div>
                        <div class="p-field p-grid">
                            <div class="p-col-4">
                                <label for="class">Database Name: </label>
                            </div>
                            <div class="p-col-8">
                                <p>{{ formData.dbName}}</p>
                            </div>
                        </div>
                        <div class="p-field p-grid">
                            <div class="p-col-4">
                                <label for="class">Database Username: </label>
                            </div>
                            <div class="p-col-8">
                                <p>{{ formData.dbUsername}}</p>
                            </div>
                        </div>
                        <div class="p-field p-grid">
                            <div class="p-col-4">
                                <label for="class">Database User Password: </label>
                            </div>
                            <div class="p-col-8">
                                <p>{{ formData.dbUserPassword}}</p>
                            </div>
                        </div>
                        <div class="p-field p-grid">
                            <div class="p-col-4">
                                <label for="class">Port: </label>
                            </div>
                            <div class="p-col-8">
                                <p>{{ formData.dbPort}}</p>
                            </div>
                        </div>
                    </Fieldset>
                </div>
        <!-- OpenLDAP Information -->
                <div class="p-field p-col-4">
                    <Fieldset legend="OpenLDAP">
                        <div class="p-field p-grid">
                            <div class="p-col-4">
                                <label for="class">Server Address: </label>
                            </div>
                            <div class="p-col-8">
                                <p>{{ formData.ldapServerAddress}}</p>
                            </div>
                        </div>
                        <div class="p-field p-grid">
                            <div class="p-col-4">
                                <label for="class">Username: </label>
                            </div>
                            <div class="p-col-8">
                                <p>{{ formData.ldapServerUsername}}</p>
                            </div>
                        </div>
                        <div class="p-field p-grid">
                            <div class="p-col-4">
                                <label for="class">Password: </label>
                            </div>
                            <div class="p-col-8">
                                <p>{{ formData.ldapServerPassword}}</p>
                            </div>
                        </div>
                        <div class="p-field p-grid">
                            <div class="p-col-4">
                                <label for="class">Base DN: </label>
                            </div>
                            <div class="p-col-8">
                                <p>{{ formData.ldapBaseDn}}</p>
                            </div>
                        </div>
                        <div class="p-field p-grid">
                            <div class="p-col-4">
                                <label for="class">Admin CN: </label>
                            </div>
                            <div class="p-col-8">
                                <p>{{ formData.ldapAdminCn}}</p>
                            </div>
                        </div>
                        <div class="p-field p-grid">
                            <div class="p-col-4">
                                <label for="class">Admin Password: </label>
                            </div>
                            <div class="p-col-8">
                                <p>{{ formData.ldapAdminPassword}}</p>
                            </div>
                        </div>
                        <div class="p-field p-grid">
                            <div class="p-col-4">
                                <label for="class">Config DN: </label>
                            </div>
                            <div class="p-col-8">
                                <p>{{ formData.ldapConfigDn}}</p>
                            </div>
                        </div>
                        <div class="p-field p-grid">
                            <div class="p-col-4">
                                <label for="class">Config Password: </label>
                            </div>
                            <div class="p-col-8">
                                <p>{{ formData.ldapConfigPassword}}</p>
                            </div>
                        </div>
                        <div class="p-field p-grid">
                            <div class="p-col-4">
                                <label for="class">Organization Name: </label>
                            </div>
                            <div class="p-col-8">
                                <p>{{ formData.ldapOrganization}}</p>
                            </div>
                        </div>
                        <div class="p-field p-grid">
                            <div class="p-col-4">
                                <label for="class">Lider Console Username: </label>
                            </div>
                            <div class="p-col-8">
                                <p>{{ formData.liderConsoleUsername}}</p>
                            </div>
                        </div>
                        <div class="p-field p-grid">
                            <div class="p-col-4">
                                <label for="class">Lider Console User Password: </label>
                            </div>
                            <div class="p-col-8">
                                <p>{{ formData.liderConsoleUserPassword}}</p>
                            </div>
                        </div>
                        <div class="p-field p-grid">
                            <div class="p-col-4">
                                <label for="class">Lider Console Email: </label>
                            </div>
                            <div class="p-col-8">
                                <p>{{ formData.liderConsoleUserEmail}}</p>
                            </div>
                        </div>
                    </Fieldset>
                </div>
        <!-- Ejabberd Information -->
                <div class="p-field p-col-4">
                    <Fieldset legend="Ejabberd">
                        <div class="p-field p-grid">
                            <div class="p-col-4">
                                <label for="class">Server Address: </label>
                            </div>
                            <div class="p-col-8">
                                <p>{{ formData.ejabberdServerAddress}}</p>
                            </div>
                        </div>
                        <div class="p-field p-grid">
                            <div class="p-col-4">
                                <label for="class">Username: </label>
                            </div>
                            <div class="p-col-8">
                                <p>{{ formData.ejabberdServerUsername}}</p>
                            </div>
                        </div>
                        <div class="p-field p-grid">
                            <div class="p-col-4">
                                <label for="class">Password: </label>
                            </div>
                            <div class="p-col-8">
                                <p>{{ formData.ejabberdServerPassword}}</p>
                            </div>
                        </div>

                        <div class="p-field p-grid">
                            <div class="p-col-4">
                                <label for="class">Service Name: </label>
                            </div>
                            <div class="p-col-8">
                                <p>{{ formData.ejabberdServiceName}}</p>
                            </div>
                        </div>
                            <div class="p-field p-grid">
                            <div class="p-col-4">
                                <label for="class">Lider Server Username: </label>
                            </div>
                            <div class="p-col-8">
                                <p>{{ formData.liderServerUsername}}</p>
                            </div>
                        </div>
                            <div class="p-field p-grid">
                            <div class="p-col-4">
                                <label for="class">Lider Server User Password: </label>
                            </div>
                            <div class="p-col-8">
                                <p>{{ formData.liderServerUserPassword}}</p>
                            </div>
                        </div>
                    </Fieldset>
                </div>
            </div>
            <div class="p-field" v-if="loading">
                <ProgressBar :value="value" />
            </div>
        </Panel>
        
        <Dialog header="Confirmation" v-model:visible="confirmDialog" 
            :modal="true"
            :style="{width: '30vw'}"
        >   
            <div class="confirmation-content"  v-if="scheduledParam == null">
                <i class="pi pi-info-circle mr-3" style="font-size: 1.5rem"></i>&nbsp;
                <span>
                    Installation will be started, are you sure?
                </span>
            </div>
            <template #footer>
                <Button label="Cancel" icon="pi pi-times" @click="confirmDialog = false"
                    class="p-button-sm p-button-text"
                />
                <Button label="Yes" class="p-button-sm" 
                    icon="pi pi-check" @click="startInstallation" 
                />
            </template>
        </Dialog>
    </div>
</template>

<script>
import {basicInstallationService} from '../../../services/Installation/BasicInstallation/BasicInstallationService.js'

export default {
    emits: ['prev-page', 'complete'],
    
    props: {
        formData: String
    },

    data() {
        return {
            confirmDialog: false,
            startDisabled: false,
            value: 0,
            loading: false,
            interval: null,
        }
    },

    methods: {
        prevPage() {
            this.$emit('prev-page', { pageIndex: 3 });
        },

        async startInstallation() {
            this.startProgress();
            this.confirmDialog = false;
            console.log(this.formData)
         // this.$emit('complete');
            const {data, error} = await basicInstallationService.startInstallation(this.formData)
            if (data) {
                this.$toast.add({
                    severity:'success', 
                    detail: "Liderahenk has been installed susccessfully", 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
            } else {
                this.$toast.add({
                    severity:'error', 
                    detail: "An error occurred while installing Liderahenk server", 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
                console.log("errorr")
            }
        },

        startProgress() {
            // this.startDisabled = true;
            this.loading = true;
            this.interval = setInterval(() => {
                let newValue = this.value + Math.floor(Math.random() * 10) + 1;
                if (newValue >= 100) {
                    newValue = 100;
                }
                this.value = newValue;
            }, 2000);
        },
        endProgress() {
            this.startDisabled = false;
            clearInterval(this.interval);
            this.interval = null;
        }
    },
};
</script>

<style scoped>
label {
    font-weight: bold;
}
</style>