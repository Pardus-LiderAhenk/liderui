<template>
    <div>
        <Panel header="Server Connection Information">
            <template #header>
                <h3 style="fontSize: 1.5rem">Server Connection Information</h3>
            </template>
            <template #icons>
                <i class="p-ml-2  pi pi-link" style="fontSize: 1.5rem;color:#3296F3;"></i>
            </template>
            <form class="p-fluid">
                <div class="p-fluid"

                    
                        v-loading="loading"
                        element-loading-text="Try to Connect Server please wait..."
                        element-loading-background="rgba(0, 0, 0, 0.7)"
                        :element-loading-spinner="svg"
                    
                    >

                    <!-- <ProgressSpinner
                        style="width: 20px; height: 20px"
                        strokeWidth="8"
                        fill="var(--surface-ground)"
                        animationDuration=".5s"
                        v-if="server.isReach"
                    /> -->
                    <div class="p-field">
                        <label>Server Address</label>
                        <InputText
                            placeholder="192.168.*.*"
                            v-model="server.address"
                            :class="{ 'p-invalid': validationErrors.address }" 
                        />
                        <small v-show="validationErrors.address" class="p-error">
                            Server Address is required
                        </small>
                    </div>
                    <div class="p-field">
                        <label>Username</label>
                        <InputText
                            placeholder="lider"
                            v-model="server.username" 
                            :class="{ 'p-invalid': validationErrors.username }" 
                        />
                        <small v-show="validationErrors.username" class="p-error">
                            Username is required
                        </small>
                    </div>
                    <div class="p-field">
                        <label>User Password</label>
                        <Password 
                            v-model="server.password" toggleMask 
                            placeholder="******"
                            :feedback="false"
                            :class="{ 'p-invalid': validationErrors.password }" 
                        ></Password>
                        <small v-show="validationErrors.password" class="p-error">
                            User password is required
                        </small>
                    </div>
                </div>
                <div class="p-field p-d-flex p-jc-between">
                    <div>
                        <Tag v-if="status" icon="pi pi-check" severity="success" value="Success"></Tag>
                        <Tag v-if="!status" icon="pi pi-times" severity="danger" value="Danger"></Tag>
                    </div>
                    <div>
                        <Button
                            :disabled="loading"
                            icon="pi pi-link"
                            label="Check Connection"
                            @click="checkServerConnection"
                        />
                    </div>
                </div>
            </form>
        </Panel>
    </div>
</template>

<script>
import {basicInstallationService} from '../../../services/Installation/BasicInstallation/BasicInstallationService.js'


export default {
    name:"ServerConnection",

    data() {
        return {
            server: {
                address: "192.168.56.136",
                username: "test",
                password: "1",
            },
            validationErrors: {},
            status: null,
            loading: false
        };
    },
    methods: {
        getServerConnectionInfo() {
            if (this.validateForm()) {
                return this.server;
            } else {
                return null;
            }
        },

        validateForm() {
            if (!this.server.address.trim()) this.validationErrors['address'] = true;
            else delete this.validationErrors['address'];
            if (!this.server.username.trim()) this.validationErrors['username'] = true;
            else delete this.validationErrors['username'];
            if (!this.server.password.trim()) this.validationErrors['password'] = true;
            else delete this.validationErrors['password'];
            return !Object.keys(this.validationErrors).length;
        },

        async checkServerConnection() {
            if (!this.validateForm()) {
                return;
            }
           
            this.status = true;
            this.loading = true;
            console.log(this.server.address)
            // let params = {
            //     host : this.server.address
            // }

            let params = new FormData();
            params.append('host', this.server.address);
            params.append('username', this.server.username);
            params.append('password', this.server.password);

            const {data, error} = await basicInstallationService.checkConnection(params)
            console.log(this.server.address)
            console.log(this.server.username)
            console.log(this.server.password)
            if (data) {
                this.$toast.add({
                    severity:'success', 
                    detail: "Sunucuya bağlantı başarılı bir şekilde gerçekleştirildi", 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
                console.log(data)
                this.denemeData = data
            } else {
                this.$toast.add({
                    severity:'error', 
                    detail: "Sunucuya bağlantı gerçekleştirilemedi", 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
                console.log("errorr")
            }
            this.loading = false;
        }
    },
    watch: {
        server: {
            handler(){
                this.validateForm();
            },
            deep: true,
        },
    }
};
</script>

<style scoped>
</style>

