<template>
    <div class="stepsdemo-content p-fluid">
        <div class="p-field p-d-flex p-jc-between">
            <div>
                <Button label="Back" @click="prevPage" icon="pi pi-angle-left" />
            </div>
            <div class="p-ml-2">
                <Button label="Next" @click="nextPage" icon="pi pi-angle-right" iconPos="right" />
            </div>
        </div>
        <div class="p-grid p-field">
            <div class="p-col-6">
                <server-connection ref="serverConnection"></server-connection>
            </div>
            <div class="p-col-6">
                <Panel header="OpenLDAP Information">
                    <template #header>
                        <h3 style="fontSize: 1.5rem">OpenLDAP Information</h3>
                    </template>
                    <template #icons>
                        <i class="pi pi-sitemap" style="fontSize: 1.5rem;color:#3296F3;"></i>
                    </template>
                    <form @submit.prevent="nextPage(!v$.$invalid)" class="p-fluid">
                        <div class="p-fluid">
                            <div class="p-field">
                                <label for="">Choose Action</label>
                                <Dropdown v-model="ldap.action" 
                                    :options="actions" optionLabel="name" 
                                    optionValue="value" 
                                    placeholder="Select action" 
                                />
                            </div>
                            <div class="p-field">
                                <label>LDAP Base DN</label>
                                <InputText id="name" 
                                    v-model="ldap.baseDn"
                                    placeholder="liderahenk.org"
                                    ::class="{
                                        'p-invalid': v$.ldap.baseDn.$invalid && submitted,
                                    }"
                                />
                                <small v-if="v$.ldap.baseDn.$invalid && submitted" class="p-error">
                                    Base DN is required
                                </small>
                            </div>
                            <div class="p-field">
                                <label>LDAP Admin Password</label>
                                <Password 
                                    v-model="ldap.adminPassword" toggleMask 
                                    :feedback="false"
                                    placeholder="******"
                                    ::class="{
                                        'p-invalid': v$.ldap.adminPassword.$invalid && submitted,
                                    }"
                                />
                                <small v-if="v$.ldap.adminPassword.$invalid && submitted" class="p-error">
                                    LDAP admin password is required
                                </small>
                            </div>
                            <div class="p-field">
                                <label>Lider Console Username</label>
                                <InputText 
                                    v-model="ldap.liderConsoleUsername"
                                    placeholder="lider_console"
                                    ::class="{
                                        'p-invalid': v$.ldap.liderConsoleUsername.$invalid && submitted,
                                    }"
                                />
                                <small v-if="v$.ldap.liderConsoleUsername.$invalid && submitted" class="p-error">
                                    Lider console username is required
                                </small>
                            </div>
                            <div class="p-field">
                                <label>Lider Console User Password</label>
                                <Password 
                                    v-model="ldap.liderConsoleUserPassword" toggleMask 
                                    :feedback="false"
                                    placeholder="******"
                                    ::class="{
                                        'p-invalid': v$.ldap.liderConsoleUserPassword.$invalid && submitted,
                                    }"
                                />
                                <small v-if="v$.ldap.liderConsoleUserPassword.$invalid && submitted" class="p-error">
                                    Lider console user password is required
                                </small>
                            </div>

                            <div class="p-field">
                                <label>Lider Console Email Address</label>
                                <InputText 
                                    v-model="ldap.liderConsoleUserEmail"
                                    placeholder="lider_console@liderahenk.org"
                                    ::class="{
                                        'p-invalid': v$.ldap.liderConsoleUserEmail.$invalid && submitted,
                                    }"
                                />
                                <small v-if="v$.ldap.liderConsoleUserEmail.required.$invalid && submitted" class="p-error">
                                    {{ v$.ldap.liderConsoleUserEmail.required.$message.replace("Value", "Lider console user email") }}
                                </small>
                                <small v-if="v$.ldap.liderConsoleUserEmail.email.$invalid && submitted" class="p-error">
                                    {{ v$.ldap.liderConsoleUserEmail.email.$message.replace("Value", "Lider console user") }}
                                </small>
                            </div>
                        </div>
                    </form>
                </Panel>
            </div>
        </div>
    </div>
</template>

<script>
import { useVuelidate } from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";

import ServerConnection from '../Components/ServerConnection.vue'

export default {
    setup: () => ({ v$: useVuelidate() }),

    emits: ['next-page'],

    components: {
        ServerConnection,
    },

    validations() {
        return {
            ldap: {
                baseDn: {
                    required
                },
                adminPassword: {
                    required
                },
                liderConsoleUsername: {
                    required
                },
                liderConsoleUserPassword: {
                    required
                },
                liderConsoleUserEmail: {
                    required,
                    email
                    
                },
            },
            
        };
    },
    
    data() {
        return {
            ldap: {
                baseDn: "",
                liderConsoleUsername: "",
                liderConsoleUserPassword: "",
                liderConsoleUserEmail: "",
                adminPassword: "",
                ldapAdminCn: "admin",
                ldapConfigDn: "cn=admin,cn=config",
                ldapServerAddress: "",
                ldapConfigPassword: "",
                ldapOrganization: "",
                action: "new"
            },
            actions: [
                {
                    name: "Install New LDAP",
                    value: "new"
                },
                {
                    name: "Use Existing LDAP",
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

            let parserDn = this.ldap.baseDn.split(".");
            this.ldap.ldapOrganization = parserDn[0];
            let ldapBaseDn = "dc="+ parserDn.join(',dc=')

            let params = {
                ldapServerAddress: serverInfo.address,
                ldapServerUsername: serverInfo.username,
                ldapServerPassword: serverInfo.password,
                ldapBaseDn: ldapBaseDn,
                ldapAdminPassword: this.ldap.adminPassword,
                liderConsoleUsername: this.ldap.liderConsoleUsername,
                liderConsoleUserPassword: this.ldap.liderConsoleUserPassword,
                liderConsoleUserEmail: this.ldap.liderConsoleUserEmail,
                ldapAdminCn: this.ldap.ldapAdminCn,
                ldapConfigDn: this.ldap.ldapConfigDn,
                ldapConfigPassword: this.ldap.adminPassword,
                ldapOrganization: this.ldap.ldapOrganization,
                ldapAction: this.ldap.action
            };
            console.log(params)
            this.$emit('next-page', { formData: params, pageIndex: 1 });
        },

        prevPage() {
            this.$emit('prev-page', { pageIndex: 1 });
        },
    }
};
</script>

