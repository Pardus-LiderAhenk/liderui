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
                <Panel header="Ejabberd Information">
                    <template #header>
                        <h3 style="fontSize: 1.5rem">Ejabberd Information</h3>
                    </template>
                    <template #icons>
                        <i class="pi pi-send" style="fontSize: 1.5rem;color:#3296F3;"></i>
                    </template>
                    <form @submit.prevent="nextPage(!v$.$invalid)" class="p-fluid">
                        <div class="p-fluid">
                            <div class="p-field">
                                <label>XMPP Service Name</label>
                                <InputText
                                    disabled
                                    v-model="ejabberd.serviceName"
                                    placeholder="im.liderahenk.org"
                                    ::class="{
                                        'p-invalid': v$.ejabberd.serviceName.$invalid && submitted,
                                    }"
                                />
                                <small v-if="v$.ejabberd.serviceName.$invalid && submitted" class="p-error">
                                    XMPP service name is required
                                </small>
                            </div>
                            <div class="p-field">
                                <label>Lider Server Username</label>
                                <InputText
                                    v-model="ejabberd.liderServerUsername"
                                    placeholder="lider_sunucu"
                                    ::class="{
                                        'p-invalid': v$.ejabberd.liderServerUsername.$invalid && submitted,
                                    }"
                                />
                                <small v-if="v$.ejabberd.liderServerUsername.$invalid && submitted" class="p-error">
                                    Lider server username is required
                                </small>
                            </div>
                            <div class="p-field">
                                <label for="password">Lider Server User Password</label>
                                <Password 
                                    v-model="ejabberd.liderServerUserPassword" toggleMask 
                                    :feedback="false"
                                    placeholder="******"
                                    ::class="{
                                        'p-invalid': v$.ejabberd.liderServerUserPassword.$invalid && submitted,
                                    }"
                                />
                                <small v-if="v$.ejabberd.liderServerUserPassword.$invalid && submitted" class="p-error">
                                    Password is required
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
import { required } from "@vuelidate/validators";

import ServerConnection from '../Components/ServerConnection.vue'

export default {
    setup: () => ({ v$: useVuelidate() }),

    emits: ['next-page'],

    components: {
        ServerConnection,
    },

    validations() {
        return {
            ejabberd: {
                liderServerUsername: {
                    required
                },
                liderServerUserPassword: {
                    required
                },
                ldapServerAddress: {
                    required
                },
                ldapBaseDn: {
                    required,
                },
                ldapAdminDn: {
                    required,
                },
                ldapAdminPassword: {
                    required,
                },
                serviceName: {
                    required
                }
            },
        };
    },
    
    data() {
        return {
            ejabberd: {
                serviceName: "im.liderahenk.org",
                liderServerUsername: "",
                liderServerUserPassword: null,
                ldapServerAddress: "",
                ldapAdminDn: "",
                ldapAdminPassword: "",
                ldapBaseDn: "",
                ejabberdHost: "",
            },
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
                ejabberdServerAddress: serverInfo.address,
                ejabberdServerUsername: serverInfo.username,
                ejabberdServerPassword: serverInfo.password,
                ejabberdServiceName: this.ejabberd.serviceName,
                liderServerUsername: this.ejabberd.liderServerUsername,
                liderServerUserPassword: this.ejabberd.liderServerUserPassword,
                ejabberdHost: serverInfo.address
            };
            this.$emit('next-page', { formData: params, pageIndex: 2 });
        },

        prevPage() {
            this.$emit('prev-page', { pageIndex: 2 });
        },
    }
};
</script>

