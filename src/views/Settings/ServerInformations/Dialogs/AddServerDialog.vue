<template>
    <Dialog :header="$t('Sunucu ekle')" 
    v-model:visible="modalVisible" style="width:30vw;">            
            
            <div class="p-fluid">
                
                <div class="p-field">
                    <label for="machineName">{{$t('Makine ismi')}}</label>
                    <InputText id="machineName" type="text" v-model="serverForm.machineName" placeholder="Makine ismi"/>
                </div>
                <div class="p-field">
                    <label for="ip">{{$t('Ip Adres')}}</label>
                    <InputText :class="validationForm.ip ? 'p-invalid': ''" 
                    id="ip" type="text" v-model="serverForm.ip" placeholder="10.10.10.10"/>
                    <small v-if="validationForm.ip" class="p-error">
                        {{ $t('ip yazılması gerekiyor')}}
                    </small>
                </div>
                <div class="p-field">
                    <label for="user">{{$t('Kullanıcı')}}</label>
                    <InputText  
                    id="user" type="text" v-model="serverForm.user" placeholder="Kullanıcı adı"/>
                    <small v-if="validationForm.user" class="p-error">
                        {{ $t('User yazılması gerekiyor')}}
                    </small>
                </div>
                
                <div class="p-field">
                    <label for="passwd">{{$t('Parola')}}</label>
                    <div class="p-inputgroup flex-1">
                        <InputText 
                            id="passwd" type="password" v-model="serverForm.password" placeholder="******"/>
                        <Button icon="pi pi-link" 
                            severity="success" 
                            @click="checkConnection"/>
                    </div>
                    <small v-if="validationForm.password" class="p-error">
                        {{ $t('Password yazılması gerekiyor')}}
                    </small>
                </div>

                <div class="p-field">
                    <label for="description">{{$t('Açıklama')}}</label>
                    <InputText id="description" type="text" v-model="serverForm.description" placeholder="Açıklama"/>
                </div>
            </div>
            <div v-if="loading" class="p-text-center">
                <i style="font-size: 1.5rem" class="el el-icon-loading"></i>&nbsp;
                <a class="primary">
                  {{$t('Makine ekleniyor bekleyiniz')}}
                </a>
            </div>

        <template #footer>

            
            <Button :label="$t('Kapat')" icon="pi pi-times" @click="modalVisible = false" class="p-button-text"/>
            <Button :label="$t('Kaydet')" icon="pi pi-save"  @click="addNewServer"></Button>

            
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
            console.log(response);
            if(error){
                    this.$toast.add({
                        severity:'error', 
                        detail: this.$t('404 hata')+ " \n"+error, 
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000
                    });
                }
                else{
                    if(response.status == 200){
                        this.$emit("savedServer");
                        if (response.data != null) {
                            this.$toast.add({
                                severity:'success', 
                                detail: this.$t('Başarılı'), 
                                summary:this.$t("computer.task.toast_summary"), 
                                life: 3000
                            });
                        }
                    }
                    else if(response.status == 417){
                        this.$toast.add({
                            severity:'error', 
                            detail: this.$t('417 hata'), 
                            summary:this.$t("computer.task.toast_summary"), 
                            life: 3000
                        });
                    }
                } 
                this.loading = false;       
        },

        async checkConnection(){

        
            const params = new FormData();
            params.append('hostname', this.serverForm.ip);
            params.append('username', this.serverForm.user);
            params.append('password', this.serverForm.password);

            const {response, error} = await serverInformationService.connectionServer(params);

            if(error){
                this.$toast.add({
                    severity:'error', 
                    detail: this.$t('404 hata')+ " \n"+error, 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
            }
            else{
                if(response.status == 200){

                    if (response.data != null) {
                        this.$toast.add({
                            severity:'success', 
                            detail: this.$t('Başarılı'), 
                            summary:this.$t("computer.task.toast_summary"), 
                            life: 3000
                        });
                    }
                }
                else if(response.status == 417){
                    this.$toast.add({
                        severity:'error', 
                        detail: this.$t('417 hata'), 
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000
                    });
                }
            }
        
        this.loading = false;
    
        },

        async getServerdata(){

            const params = new FormData();
            params.append('hostname', this.serverForm.ip);
            params.append('username', this.serverForm.user);
            params.append('password', this.serverForm.password);

            const {response, error} = await serverInformationService.getServer(params);
            console.log(response);
            
        },

        validateForm() {
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