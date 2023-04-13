<template>
    <div class="stepsdemo-content p-fluid">
        <div class="p-field p-d-flex p-jc-end">
            <div>
                <Button
                    icon="pi pi-angle-right"
                    label="Next"
                    type="submit"
                    @click="nextPage"
                />
            </div>
        </div>
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
                    <form @submit.prevent="nextPage(!v$.$invalid)" class="p-fluid">
                        <div class="p-fluid">
                            <div class="p-field">
                                <label for="">Choose Action</label>
                                <Dropdown v-model="database.action" 
                                    :options="actions" optionLabel="name" 
                                    optionValue="value" 
                                    placeholder="Select action" 
                                />
                            </div>
                            <div class="p-field">
                                <label>Database Name</label>
                                <InputText id="name" 
                                    v-model="database.name"
                                    placeholder="lidermysdb"
                                    ::class="{
                                        'p-invalid': v$.database.name.$invalid && submitted,
                                    }"
                                />
                                <small v-if="v$.database.name.$invalid && submitted" class="p-error">
                                    Database name is required
                                </small>
                            </div>
                            <div class="p-field">
                                <label for="username">Username</label>
                                <InputText id="username" 
                                    v-model="database.username"
                                    placeholder="root"
                                    ::class="{
                                        'p-invalid': v$.database.username.$invalid && submitted,
                                    }"
                                />
                                <small v-if="v$.database.username.$invalid && submitted" class="p-error">
                                    Database username is required
                                </small>
                            </div>
                            <div class="p-field">
                                <label for="password">Password</label>
                                <Password 
                                    v-model="database.password" toggleMask 
                                    :feedback="false"
                                    placeholder="******"
                                    ::class="{
                                        'p-invalid': v$.database.password.$invalid && submitted,
                                    }"
                                />
                                <small v-if="v$.database.password.$invalid && submitted" class="p-error">
                                    Password is required
                                </small>
                            </div>
                            <div class="p-field">
                                <label for="port">Port</label>
                                <InputText id="port" 
                                    v-model="database.port"
                                    placeholder="3306"
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
                name: "",
                username: "",
                password: null,
                port: null,
                action: "new"
            },
            actions: [
                {
                    name: "Install New Database",
                    value: "new"
                },
                {
                    name: "Use Existing Database",
                    value: "exist"
                }
            ],
            submitted: false,
        };
    },
    methods: {
        async nextPage(isFormValid) {
            let serverInfo = await this.$refs.serverConnection.getServerConnectionInfo();
            this.submitted = true;
            if (!isFormValid) {
                return;
            }
            let params = {
                dbServerAddress: serverInfo.address,
                dbServerUsername: serverInfo.username,
                dbServerPassword: serverInfo.password,
                dbName: this.database.name,
                dbUsername: this.database.username,
                dbUserPassword: this.database.password,
                dbPort: this.database.port,
                dbAction: this.database.action
            };
            this.$emit('next-page', { formData: params, pageIndex: 0 });
        },
    }
};
</script>

