<template>
    <div class="p-fluid p-formgrid p-grid">
        <div class="p-col-12">
            <h3>{{$t('settings.server_settings.mail_server_settings.mail_server_settings')}}</h3>
        </div>
        <div class="p-field p-col-12 p-md-4">
            <label for="emailHost">{{$t('settings.server_settings.mail_server_settings.mail_host_address')}}</label>
            <InputText id="emailHost" type="text" v-model="emailHost" placeholder="smtp.gmail.com"/>
        </div>
        <div class="p-field p-col-12 p-md-4">
            <label for="emailPort">{{$t('settings.server_settings.mail_server_settings.port')}}</label>
            <InputText id="emailPort" type="text" v-model="emailPort" placeholder="587"/>
        </div>
        <div class="p-field p-col-12 p-md-4">
            <label for="emailUsername">{{$t('settings.server_settings.mail_server_settings.mail_username')}}</label>
            <InputText id="emailUsername" type="text" v-model="emailUsername" placeholder="lider@liderahenk.org"/>
        </div>
        <div class="p-field p-col-12 p-md-4">
            <label for="emailPassword">{{$t('settings.server_settings.mail_server_settings.mail_password')}}</label>
            <InputText id="emailPassword" type="password" v-model="emailPassword"/>
        </div>
         <div class="p-field p-col-12 p-md-4">
            <label for="zip">{{$t('settings.server_settings.mail_server_settings.smtp_verification')}}</label>
            <Dropdown :options="yesNoChoise" optionLabel="label" optionValue="value" v-model="smtpAuth"></Dropdown>
        </div>
         <div class="p-field p-col-12 p-md-4">
            <label for="zip">{{$t('settings.server_settings.mail_server_settings.tls_activation')}}</label>
            <Dropdown :options="yesNoChoise" optionLabel="label" optionValue="value" v-model="tlsEnabled"></Dropdown>
        </div>
        <div class="p-field p-col-12 p-text-right">
            <div class="p-d-flex p-jc-end">
                <div>
                    <Button icon="pi pi-save" type="button" :label="$t('settings.server_settings.mail_server_settings.save')" @click="showDialog = true"/>
                </div>
            </div>
        </div>
    </div>
    <Dialog :header="$t('settings.server_settings.mail_server_settings.update_settings')" v-model:visible="showDialog" 
        :style="{width: '20vw'}" :modal="true">
        <div class="p-fluid">
            <i class="pi pi-info-circle p-mr-3" style="font-size: 1.5rem" />
            <span>
                {{$t('settings.server_settings.mail_server_settings.mail_notify')}}
            </span>
        </div>
        <template #footer>
            <Button :label="$t('settings.server_settings.mail_server_settings.cancel')" icon="pi pi-times" 
                @click="showDialog = false" class="p-button-text p-button-sm"
            />
            <Button :label="$t('settings.server_settings.mail_server_settings.yes')" icon="pi pi-check"
                @click="submitForm" class="p-button-sm"
            />
        </template>
    </Dialog>
</template>


<script>
import { serverSettingService } from '../../../../services/Settings/ServerSettingsService.js';
export default {
    props:['serverSettings'],
    data() {
        return {
            yesNoChoise: [
                {label:this.$t('settings.server_settings.mail_server_settings.yes'), value:true},
                {label:this.$t('settings.server_settings.mail_server_settings.no'), value:false},
            ],
            smtpAuth:true,
            tlsEnabled:true,
            emailHost:'',
            emailPort:'',
            emailUsername:'',
            emailPassword:'',
            showDialog: false
        }
        
    },
    watch: { 
      	serverSettings: function(newVal) { 
          if(newVal) {
            this.smtpAuth = newVal.mailSmtpAuth;
            this.tlsEnabled = newVal.mailSmtpStartTlsEnable;
            this.emailHost = newVal.mailHost;
            this.emailPort = newVal.mailSmtpPort;
            this.emailUsername = newVal.mailAddress;
            this.emailPassword = newVal.mailPassword;
          }
        }
    },
    methods: {
        async submitForm() {
            var data = new FormData();
            data.append("smtpAuth",this.smtpAuth);
            data.append("tlsEnabled",this.tlsEnabled);
            data.append("emailHost",this.emailHost);
            data.append("emailPort",this.emailPort);
            data.append("emailUsername",this.emailUsername);
            data.append("emailPassword",this.emailPassword);

            //axios.post('/lider/settings/update/emailSettings', data).then(response => {
            const { response,error} = await  serverSettingService.updateEmail(data);
            if(error){
                this.$toast.add({
                    severity:'success', 
                    detail: this.$t('settings.server_settings.mail_server_settings.error_updating_mail_settings'), 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
            }
            else{
                if(response.status == 200){
                    this.$toast.add({
                        severity:'success', 
                        detail: this.$t('settings.server_settings.mail_server_settings.mail_settings_successfully_update'), 
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000
                    });
                    setTimeout(() => {
                        this.$store.dispatch("logout").then(() => this.$router.push("/login")).catch(err => console.log(err))
                    }, 3000)
                }
            }
            this.showDialog = false;
        }
    },
}

</script>
