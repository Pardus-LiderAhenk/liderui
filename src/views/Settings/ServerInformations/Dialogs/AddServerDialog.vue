<template>
    <Dialog :header="$t('settings.server_information.add_server')" 
    v-model:visible="modalVisible" style="width:30vw;">            
            
            <div class="p-fluid">
                
                <div class="p-field">
                    <label for="machineName">{{$t('settings.server_information.machine_name')}}</label>
                    <InputText :class="validationForm.machineName ? 'p-invalid': ''"  
                        id="machineName" type="text" v-model="serverForm.machineName" placeholder="Makine ismi"
                    />
                    <small v-if="validationForm.machineName" class="p-error">
                        {{ $t('settings.server_information.required_machine_name')}}
                    </small>
                </div>
                <div class="p-field">
                    <label for="ip">{{$t('settings.server_information.ip_addr')}}</label>
                    <InputText :class="validationForm.ip ? 'p-invalid': ''" 
                    id="ip" type="text" v-model="serverForm.ip" placeholder="10.10.10.10"/>
                    <small v-if="validationForm.ip" class="p-error">
                        {{ $t('settings.server_information.required_ip')}}
                    </small>
                </div>
                <div class="p-field">
                    <label for="user">{{$t('settings.server_information.user')}}</label>
                    <InputText  :class="validationForm.user ? 'p-invalid': ''" 
                    id="user" type="text" v-model="serverForm.user" placeholder="Kullanıcı adı"/>
                    <small v-if="validationForm.user" class="p-error">
                        {{ $t('settings.server_information.required_user')}}
                    </small>
                </div>
                
                <div class="p-field">
                    <label for="passwd">{{$t('settings.server_information.passwd')}}</label>
                    <div class="p-inputgroup flex-1">
                        <InputText :class="validationForm.password ? 'p-invalid': ''" 
                            id="passwd" type="password" v-model="serverForm.password" placeholder="******"/>
                        <Button icon="pi pi-link" 
                            severity="success" 
                            @click="checkConnection"/>

                    </div>
                    <small v-if="validationForm.password" class="p-error">
                        {{ $t('settings.server_information.required_passwd')}}
                    </small>
                    <div v-if="loadingSsh" class="p-text-center">
                        <i style="font-size: 1.5rem" class="el el-icon-loading"></i>&nbsp;
                        <a class="primary">
                          {{$t('settings.server_information.ssh_loading_message')}}
                        </a>
                    </div>
                </div>

                <div class="p-field">
                    <label for="description">{{$t('settings.server_information.description')}}</label>
                    <InputText id="description" type="text" v-model="serverForm.description" placeholder="Açıklama"/>
                </div>
            </div>
            <div v-if="loading" class="p-text-center">
                <i style="font-size: 1.5rem" class="el el-icon-loading"></i>&nbsp;
                <a class="primary">
                  {{$t('settings.server_information.waiting_add_machine')}}
                </a>
            </div>

        <template #footer>

            
            <Button :label="$t('settings.server_information.close')" icon="pi pi-times" @click="modalVisible = false" class="p-button-text p-button-sm"/>
            <Button :label="$t('settings.server_information.save')" icon="pi pi-save"  @click="addNewServer" class="p-button-sm"></Button>

            
        </template>
    </Dialog>

</template>
<script>

import { serverInformationService } from '../../../../services/Settings/ServerInformationService';


export default {

    props: ['addServerDialog'],
    data(){
        return {

            serverForm: {
                machineName:'',
                ip:'',
                user:'',
                password:'',
                description:'',
            },
            validationForm: {},
            loading: false,
            loadingSsh: false,

        }
    },
    computed: {
        modalVisible: {
            get() {
                return this.addServerDialog;
            },
            set(value) {
                this.$emit('closeAddServerDialog', false);
                if(!value){
                    this.serverForm.machineName = "";
                    this.serverForm.ip = "";
                    this.serverForm.user = "";
                    this.serverForm.password = "";
                    this.serverForm.description = "";
                }

            }
        },
    },

    methods: {

        async addNewServer(){
            if(this.validateForm() == false){
                return;
            }

            this.loading = true;
            const params = new FormData();
            params.append("machineName", this.serverForm.machineName);
            params.append("ip", this.serverForm.ip);
            params.append("user", this.serverForm.user);
            params.append("password", this.serverForm.password);
            params.append("description", this.serverForm.description);

            const { response,error } = await serverInformationService.addServer(params);

            if (error) {
                console.log(error)
                if (error.response.status === 404) {
                    this.$emit("savedServer");
                    this.$toast.add({
                        severity:'warn', 
                        detail: this.$t('settings.server_information.error_disconnect'), 
                        summary:this.$t("settings.server_information.toast_summary"), 
                        life: 3000
                    });
                }
            }
            
            if(response.status == 200  && response.data.properties.length != 0){
                this.$emit("savedServer");
                if (response.data != null) {
                    this.$toast.add({
                        severity:'success', 
                        detail: this.$t('settings.server_information.success_add_server'), 
                        summary:this.$t("settings.server_information.toast_summary"), 
                        life: 3000
                    });
                }
            }

            else if(response.status == 200  && response.data.properties.length == 0){
                this.$emit("savedServer");
                if (response.data != null) {
                    this.$toast.add({
                        severity:'success', 
                        detail: this.$t('settings.server_information.osquery_info'), 
                        summary:this.$t("settings.server_information.toast_summary"), 
                        life: 3000
                    });
                }
            }

            else if(response.status == 417){
                this.$toast.add({
                    severity:'success', 
                    detail: this.$t('settings.server_information.417_error_add_server'), 
                    summary:this.$t("settings.server_information.toast_summary"), 
                    life: 3000
                });
            }
                 
             
            else {
                this.$toast.add({
                    severity:'error', 
                    detail: this.$t('settings.server_information.error_add_server'), 
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
            params.append('hostname', this.serverForm.ip);
            params.append('password', this.serverForm.password);
            params.append('username', this.serverForm.user);
            
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
                if(response.status == 200 && response.data == true){


                    this.$toast.add({
                        severity:'success', 
                        detail: this.$t('settings.server_information.successfully_connection'), 
                        summary:this.$t("settings.server_information.toast_summary"), 
                        life: 3000
                    });
                    
                }
                else if(response.status == 400){
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
            if (!this.serverForm.machineName.trim()){
                this.validationForm['machineName'] = true;
            } else{
                delete this.validationForm['machineName'];
            }
            if (!this.serverForm.ip.trim()){
                this.validationForm['ip'] = true;
            } else{
                delete this.validationForm['ip'];
            }
            if (!this.serverForm.user.trim()){
                this.validationForm['user'] = true;
            } else{
                delete this.validationForm['user'];
            }
            if (!this.serverForm.password.trim()){
                this.validationForm['password'] = true;
            } else{
                delete this.validationForm['password'];
            }
            return !Object.keys(this.validationForm).length;
        },

    },

    watch:{

        serverForm: {
            handler(){
                this.validateForm();
            },
            deep: true,
        },
    }

}

</script>