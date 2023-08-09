<template>
    <div>
        <Dialog :header="$t('Sucunu güncelle')" 
        v-model:visible="showDialog" 
        :modal="true" 
        style="width:30vw;" >
            <div class="p-fluid">
                
                <div class="p-field">
                    <label for="machineName">{{$t('Makine Adı')}}</label>
                    <InputText id="machineName" type="text" v-model="machineName"/>
                </div>
                <div class="p-field">
                    <label for="ip">{{$t('Ip')}}</label>
                    <InputText id="ip" type="text" v-model="ip"/>
                </div>
                <div class="p-field">
                    <label for="user">{{$t('Kullanıcı')}}</label>
                    <InputText id="user" type="text" v-model="user"/>
                </div>
                
                <div class="p-field">
                    <label for="passwd">{{$t('Parola')}}</label>
                    <div class="p-inputgroup flex-1">
                        <InputText id="passwd" type="password" v-model="password"/>
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

        // servers: {
        //     type: Object,
        //     description: "Server list",
        // },
    
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
                servers: [],

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
            this.machineName = this.selectedServer.machineName;
            this.ip = this.selectedServer.ip;
            this.user = this.selectedServer.user;
            this.password = this.selectedServer.password;
            this.id = this.selectedServer.id;
        },

        async updateServer(){
            let params = new FormData();
            params.append("machineName", this.machineName)
            params.append("ip", this.ip)
            params.append("user", this.user)
            params.append("password", this.password)
            params.append("id", this.selectedServer.id)

            const {response,error} = await serverInformationService.update(params);
            console.log(response,"burdaa")
            if(response.status == 200){
                if(response.data){
                    this.$emit("updatedServer",response.data);
                    this.showDialog = false;
                    this.$toast.add({
                        severity:'success',
                        detail: this.$t('başarılı'), 
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000
                    });
                }
            }
            else {
            this.$toast.add({
                severity:'error', 
                detail: this.$t('server güncelleme başarısız'),
                summary:this.$t("computer.task.toast_summary"), 
                life: 3000
                });
            }

        },

        async checkConnection(){

            let params = {

                "hostname": this.ip,
                "username": this.user,
                "password": this.password,
            }

            const {response, error} = await serverInformationService.connectionServer(params);
            console.log(response)
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
    },
    watch:  {
        servers: function(newVal, oldVal) {
            this.machineName = newVal.machineName;
            this.ip = newVal.ip;
            this.user = newVal.user;
            this.password = newVal.password;
        }
    },
}

</script>
