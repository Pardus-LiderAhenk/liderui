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
                <div class="p-fluid">
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

export default {
    name:"ServerConnection",

    data() {
        return {
            server: {
                address: "192.168.56.111",
                username: "pardus",
                password: "123456"
            },
            validationErrors: {},
            status: null
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

        checkServerConnection() {
            if (!this.validateForm()) {
                return;
            }
            this.status = true;
            console.log(this.server)
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

