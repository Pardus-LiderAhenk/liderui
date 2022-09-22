<template>
    <div class="stepsdemo-content p-fluid">
        <div class="p-grid p-field">
            <div class="p-col-6">
                <server-connection ref="serverConnection"></server-connection>
            </div>
            <div class="p-col-6">
                <Panel header="Database Information">
                    <template #header>
                        <h3 style="fontSize: 1.5rem">Database Information</h3>
                    </template>
                    <template #icons>
                        <i class="pi pi-database" style="fontSize: 1.5rem;color:#3296F3;"></i>
                    </template>
                    <form @submit.prevent="handleSubmit(!v$.$invalid)" class="p-fluid">
                        <div class="p-fluid">
                            <div class="p-field">
                                <label>Database Name</label>
                                <InputText id="name" 
                                    v-model="database.name"
                                    ::class="{
                                        'p-invalid': v$.database.name.$invalid && submitted,
                                    }"
                                />
                                <small v-if="v$.database.name.$invalid && submitted" class="p-error">
                                    Database name is required
                                </small>
                            </div>
                            <div class="p-field">
                                <label for="lastname">Username</label>
                                <InputText id="name" 
                                    v-model="database.username"
                                    ::class="{
                                        'p-invalid': v$.database.username.$invalid && submitted,
                                    }"
                                />
                                <small v-if="v$.database.username.$invalid && submitted" class="p-error">
                                    Database username is required
                                </small>
                            </div>
                            <div class="p-field">
                                <label for="lastname">Password</label>
                                <Password 
                                    v-model="database.password" toggleMask 
                                    :feedback="false"
                                    ::class="{
                                        'p-invalid': v$.database.password.$invalid && submitted,
                                    }"
                                />
                                <small v-if="v$.database.password.$invalid && submitted" class="p-error">
                                    Password is required
                                </small>
                            </div>
                            <div class="p-field">
                                <label for="lastname">Port</label>
                                <InputText id="name" 
                                    v-model="database.port"
                                    ::class="{
                                        'p-invalid': v$.database.port.$invalid && submitted,
                                    }"
                                />
                                <small v-if="v$.database.port.required.$invalid && submitted" class="p-error">
                                    {{ v$.database.port.required.$message.replace("Value", "Port number") }}
                                </small>
                                <small v-if="v$.database.port.numeric.$invalid && submitted" class="p-error">
                                    {{ v$.database.port.numeric.$message.replace("Value", "Port number") }}
                                </small>
                            </div>
                            <div class="p-field p-d-flex p-jc-end">
                                <div>
                                    <Button
                                        icon="pi pi-caret-right"
                                        label="Install"
                                        type="submit"
                                    />
                                </div>
                            </div>
                        </div>
                    </form>
                </Panel>
            </div>
        </div>
        <!-- <div class="p-d-flex p-field p-jc-end">
            <Button label="Next" @click="nextPage()" icon="pi pi-angle-right" iconPos="right" />
        </div> -->
    </div>
</template>

<script>
import { databaseInstallationService } from '../../../services/Installation/BasicInstallation/DatabaseInstallationService'
import { useVuelidate } from "@vuelidate/core";
import { required, numeric } from "@vuelidate/validators";

import ServerConnection from '../Components/ServerConnection.vue'

export default {
    setup: () => ({ v$: useVuelidate() }),

    emits: ['next-page'],

    components: {
        ServerConnection,
    },

    validations() {
        return {
            database: {
                name: {
                    required
                },
                username: {
                    required
                },
                password: {
                    required
                },
                port: {
                    required,
                    numeric
                }
            },
        };
    },
    
    data() {
        return {
            database: {
                name: "lidermysdb",
                username: "root",
                password: null,
                port: 3306
            },
            submitted: false,
        };
    },
    methods: {

        async installDb() {
            
            console.log(serverInfo)
        },

        async handleSubmit(isFormValid) {
            let serverInfo = await this.$refs.serverConnection.getServerConnectionInfo();

            this.submitted = true;
            if (!isFormValid) {
                return;
            }
            let params = {
                serverAddress: serverInfo.address,
                serverUsername: serverInfo.username,
                serverPassword: serverInfo.password,
                dbName: this.database.name,
                dbUsername: this.database.username,
                dbPassword: this.database.password,
                dbPort: this.database.port
            };

            const {data, error} = await databaseInstallationService.installDatabase(params)
            if (data) {
                console.log("success")
                this.$toast.add({
                    severity:'success', 
                    detail: "Database install", 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
                this.$emit('next-page', { formData: {}, pageIndex: 0 });
            } else {
                this.$toast.add({
                    severity:'error', 
                    detail: "An error occurred while installing database", 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
                console.log("errorr")
            }
        },
    }
};
</script>

