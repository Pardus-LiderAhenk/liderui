<template>
    <Dialog :header="$t('Sunucu ekle')" 
    v-model:visible="modalVisible" style="width:30vw;">            
            
            <div class="p-fluid">
                
                <div class="p-field">
                    <label for="hostname">{{$t('Hostname')}}</label>
                    <InputText id="hostname" type="text" v-model="serverForm.hostname"/>
                </div>
                <div class="p-field">
                    <label for="ip">{{$t('Ip')}}</label>
                    <InputText id="ip" type="text" v-model="serverForm.ip"/>
                </div>
                <div class="p-field">
                    <label for="user">{{$t('Kullanıcı')}}</label>
                    <InputText id="user" type="text" v-model="serverForm.user"/>
                </div>
                
                <div class="p-field">
                    <label for="passwd">{{$t('Parola')}}</label>
                    <div class="p-inputgroup flex-1">
                        <InputText id="passwd" type="text" v-model="serverForm.password"/>
                        <Button icon="pi pi-link" 
                        severity="success" 
                        @click="checkConnection"/>
                    </div>
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
    emits:['updateConsoleUsers'],
    data(){
        return {
            selectedUserNode:null,
            searchFields: [
                {
                    key: this.$t('tree.cn'),
                    value: "cn"
                },
                {
                    key: this.$t('tree.uid'),
                    value: "uid"
                },
                {
                    key: this.$t('tree.folder'),
                    value: "ou"
                },
                {
                    key: this.$t('tree.last_session'),
                    value: "o"
                }
            ],
            serverForm: {
                hostname:'',
                ip:'',
                user:'',
                password:'',
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
                    this.serverForm.hostname = "";
                    this.serverForm.ip = "";
                    this.serverForm.user = "";
                    this.serverForm.password = "";
                }

            }
        },
    },

    methods: {

        async addNewServer(){

            const params = new FormData();
            params.append("hostname", this.serverForm.hostname);
            params.append("ip", this.serverForm.ip);
            params.append("user", this.serverForm.user);
            params.append("password", this.serverForm.password);



            const { response,error } = await serverInformationService.addServer(params);
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
                            this.reset();
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
            params.append('hostname', this.serverForm.hostname);
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
                    console.log(testt)
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
            params.append('hostname', this.serverForm.hostname);
            params.append('username', this.serverForm.user);
            params.append('password', this.serverForm.password);

            const {response, error} = await serverInformationService.getServerServer(params);
            console.log(response);
            
        }
    }
}

</script>