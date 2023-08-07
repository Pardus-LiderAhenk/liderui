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
                    <InputText id="ip" type="text" v-model="serverForm.ip" placeholder="10.10.10.10"/>
                </div>
                <div class="p-field">
                    <label for="user">{{$t('Kullanıcı')}}</label>
                    <InputText id="user" type="text" v-model="serverForm.user" placeholder="Kullanıcı adı"/>
                </div>
                
                <div class="p-field">
                    <label for="passwd">{{$t('Parola')}}</label>
                    <div class="p-inputgroup flex-1">
                        <InputText id="passwd" type="password" v-model="serverForm.password" placeholder="******"/>
                        <Button icon="pi pi-link" 
                        severity="success" 
                        @click="checkConnection"/>
                    </div>
                </div>

                <div class="p-field">
                    <label for="description">{{$t('Açıklama')}}</label>
                    <InputText id="description" type="text" v-model="serverForm.description" placeholder="Açıklama"/>
                </div>
            </div>

        <template #footer>

            <!-- <Button 
            :label="$t('Sunucu bilgilerini getir')" 
            :disabled="loading"
            icon="pi pi-search"  
            @click="getServerdata">
            </Button> -->
            <Button :label="$t('Kapat')" icon="pi pi-times" @click="modalVisible = false" class="p-button-text"/>
            <Button :label="$t('Kaydet')" icon="pi pi-save"  @click="addNewServer"></Button>

            
        </template>
    </Dialog>

</template>
<script>

import { serverInformationService } from '../../../../services/Settings/ServerInformationService';


export default {

    props: ['modalVisibleValue'],
    data(){
        return {
           
            serverForm: {
                machineName:'',
                ip:'',
                user:'',
                password:'',
                description:'',
            },

        }
    },
    computed: {
        modalVisible: {
            get() {
                return this.modalVisibleValue;
            },
            set(value) {
                this.$emit('modalVisibleValue', false);
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

            const {response, error} = await serverInformationService.getServerServer(params);
            console.log(response);
            
        }
    }
}

</script>