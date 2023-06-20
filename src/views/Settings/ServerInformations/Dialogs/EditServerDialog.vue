<template>
    <div>
        <Dialog :header="$t('Sucunu güncelle')" v-model:visible="showDialog" :modal="true" style="width:30vw;" >
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
                <Button 
                    :label="$t('Kapat')" 
                    icon="pi pi-times"
                    @click="showDialog = false" 
                    class="p-button-text p-button-sm">
                </Button>
                <Button class="p-button-sm" 
                    :label="$t('Güncelle')" 
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

                serverForm: {
                    hostname:'',
                    ip:'',
                    user:'',
                    password:'',
                },

            }
        },

    computed: {
        showDialog: {
            get () {
                this.setServerData();
                return this.updateServerDialog;
            },

            set (value) {
                if (!value) {
                    this.$emit('closeServerDialog');
                }
            }
        },
    },

    methods:{

        setServerData() {
            this.hostname = this.serverForm.hostname;
            this.ip = this.serverForm.ip;
            this.user = this.serverForm.user;
            this.password = this.serverForm.password;
        },

        async updateServer(){

            const params = new FormData();
            params.append("hostname", this.serverForm.hostname);
            params.append("ip", this.serverForm.ip);
            params.append("user", this.serverForm.user);
            params.append("password", this.serverForm.password);

            const {response,error} = await serverInformationService.update(params);
            console.log(response,"burdaa")

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
    }
}

</script>
