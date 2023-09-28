<template>
    <div>
        <Dialog :header="$t('settings.server_information.update_server')" 
        v-model:visible="showDialog" style="width:30vw;" >
            <div class="p-fluid">
                
                <div class="p-field">
                    <label for="machineName">{{$t('settings.server_information.machine_name')}}</label>
                    <InputText id="machineName" type="text" v-model="machineName"
                        :class="validationForm.machineName ? 'p-invalid': ''"  
                    />
                    <small v-if="validationForm.ip" class="p-error">
                        {{ $t('settings.server_information.required_machine_name')}}
                    </small>
                </div>
                <div class="p-field">
                    <label for="ip">{{$t('settings.server_information.ip_addr')}}</label>
                    <InputText id="ip" type="text" v-model="ip"
                        :class="validationForm.ip ? 'p-invalid': ''"  
                    />
                    <small v-if="validationForm.ip" class="p-error">
                        {{ $t('settings.server_information.required_ip')}}
                    </small>
                </div>
                <div class="p-field">
                    <label for="user">{{$t('settings.server_information.user')}}</label>
                    <InputText id="user" type="text" v-model="user"
                        :class="validationForm.user ? 'p-invalid': ''"  
                    />
                    <small v-if="validationForm.user" class="p-error">
                        {{ $t('settings.server_information.required_user')}}
                    </small>
                </div>
                
                <div class="p-field">
                    <label for="passwd">{{$t('settings.server_information.passwd')}}</label>
                    <div class="p-inputgroup flex-1">
                        <InputText id="passwd" type="password" v-model="password"
                            :class="validationForm.password ? 'p-invalid': ''"  
                        />
                        <Button icon="pi pi-link" 
                        severity="success" 
                        @click="checkConnection"/>
                    </div>
                    <small v-if="validationForm.password" class="p-error">
                        {{ $t('settings.server_information.required_passwd')}}
                    </small>
                </div>

                <div class="p-field">
                    <label for="description">{{$t('settings.server_information.description')}}</label>
                    <div class="p-inputgroup flex-1">
                        <InputText id="description" type="description" v-model="description"/>
                    </div>
                    
                </div>

                <div v-if="loadingSsh" class="p-text-center">
                    <i style="font-size: 1.5rem" class="el el-icon-loading"></i>&nbsp;
                    <a class="primary">
                      {{$t('settings.server_information.ssh_loading_message')}}
                    </a>
                </div>
            </div>
            <div v-if="loading" class="p-text-center">
                <i style="font-size: 1.5rem" class="el el-icon-loading"></i>&nbsp;
                <a class="primary">
                  {{$t('settings.server_information.waiting_update_server')}}
                </a>
            </div>

            <template #footer>
                <Button 
                    :label="$t('settings.server_information.close')" 
                    icon="pi pi-times"
                    @click="showDialog = false" 
                    class="p-button-text p-button-sm">
                </Button>
                <Button class="p-button-sm" 
                    :label="$t('settings.server_information.update')" 
                    icon="pi pi-refresh"
                    @click="updateServer"    
                />
            </template>
        </Dialog>
    </div>
</template>

<script>

import { serverInformationService } from '../../../../services/Settings/ServerInformationService';
export default {

    props: {
        updateServerDialog: {
            type: Boolean,
            default: false
        },

        selectedServer: {
            type: Object,
            description: "Selected Server",
        },
    }, 
    data(){
            return {
                machineName: null,
                ip: null,
                user: null,
                password: null,
                description: null,
                servers: [],
                validationForm: {},
                loading: false,
                loadingSsh: false,

            }
        },

    computed: {
        showDialog: {
            get() {
                this.setServerData();
                return this.updateServerDialog;
            },

            set() {
                this.$emit('closeEditServerDialog',false);
            }
        },
    },

    methods:{

        setServerData() {
            this.machineName = this.selectedServer.machineName;
            this.ip = this.selectedServer.ip;
            this.user = this.selectedServer.user;
            this.password = this.selectedServer.password;
            this.id = this.selectedServer.id;
            this.description = this.selectedServer.description;
        },

        async updateServer(){
            if(this.validateForm() == false){
                return;
            }

            this.loading = true;
            let params = new FormData();
            params.append("machineName", this.machineName)
            params.append("ip", this.ip)
            params.append("user", this.user)
            params.append("password", this.password)
            params.append("id", this.selectedServer.id)
            params.append("description", this.description)

            const {response,error} = await serverInformationService.update(params);
            if(response.status == 200){
                this.$emit("editServer");
                if(response.data != null){
                    this.showDialog = false;
                    this.$toast.add({
                        severity:'success',
                        detail: this.$t('settings.server_information.successful_update'), 
                        summary:this.$t("settings.server_information.toast_summary"), 
                        life: 3000
                    });
                }
            }
            else {
                this.$toast.add({
                    severity:'error', 
                    detail: this.$t('settings.server_information.error_update'),
                    summary:this.$t("settings.server_information.toast_summary"), 
                    life: 3000
                    });
            }
            this.loading = false;
        },

        async checkConnection(){
            if(this.validateForm() == false){
                return;
            }
            this.loadingSsh = true;

            let params = new FormData();
            params.append('hostname', this.ip);
            params.append('password', this.password);
            params.append('username', this.user);
           
            const {response, error} = await serverInformationService.connectionServer(params);
            if(error){
                this.$toast.add({
                    severity:'error', 
                    detail: this.$t('settings.server_information.error_disconnect'), 
                    summary:this.$t("settings.server_information.toast_summary"), 
                    life: 3000
                });
            }
            else{
                if(response.status == 200){

                    this.$toast.add({
                        severity:'success', 
                        detail: this.$t('settings.server_information.successfully_connection'), 
                        summary:this.$t("settings.server_information.toast_summary"), 
                        life: 3000
                    });
                    
                }
                else if(response.status == 417){
                    this.$toast.add({
                        severity:'error', 
                        detail: this.$t('settings.server_information.417_error_disconnect'), 
                        summary:this.$t("settings.server_information.toast_summary"), 
                        life: 3000
                    });
                }
            }
            this.loadingSsh = false;

        },

        validateForm() {
            if (!this.ip.trim()){
                this.validationForm['ip'] = true;
            } else{
                delete this.validationForm['ip'];
            }
            if (!this.user.trim()){
                this.validationForm['user'] = true;
            } else{
                delete this.validationForm['user'];
            }
            if (this.password == null){
                this.validationForm['password'] = true;
            } else{
                delete this.validationForm['password'];
            }
            return !Object.keys(this.validationForm).length;
        },
    },
    watch:  {
        servers: function(newVal, oldVal) {
            this.machineName = newVal.machineName;
            this.ip = newVal.ip;
            this.user = newVal.user;
            this.password = newVal.password;
            this.description = newVal.description;
        }
    },
    
}

</script>
