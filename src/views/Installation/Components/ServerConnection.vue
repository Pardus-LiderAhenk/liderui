<template>
    <div>
        <Panel header="Server Connection Information">
            <template #header>
                <h3 style="fontSize: 1.5rem">Server Connection Information</h3>
            </template>
            <template #icons>
                <i class="pi pi-link" style="fontSize: 1.5rem;color:#3296F3;"></i>
            </template>
            <form class="p-fluid">
                <div class="p-fluid">
                    <div class="p-field">
                        <label for="firstname">Server Address</label>
                        <InputText id="firstname" 
                            v-model="server.address"
                            :class="{ 'p-invalid': validationErrors.address }" 
                        />
                        <small v-show="validationErrors.address" class="p-error">
                            Server Address is required
                        </small>
                    </div>
                    <div class="p-field">
                        <label for="lastname">Username</label>
                        <InputText id="lastname"
                            v-model="server.username" 
                            :class="{ 'p-invalid': validationErrors.username }" 
                        />
                        <small v-show="validationErrors.username" class="p-error">
                            Username is required
                        </small>
                    </div>
                    <div class="p-field">
                        <label for="lastname">User Password</label>
                        <Password 
                            v-model="server.password" toggleMask 
                            :feedback="false"
                            :class="{ 'p-invalid': validationErrors.password }" 
                        ></Password>
                        <small v-show="validationErrors.password" class="p-error">
                            User password is required
                        </small>
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
                address: "",
                username: "",
                password: ""
            },

            validationErrors: {}
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

