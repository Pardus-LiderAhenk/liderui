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
                    <Button icon="pi pi-save" type="button" :label="$t('settings.server_settings.mail_server_settings.save')" @click="submitForm()"/>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
import axios from 'axios';
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
        }
        
    },
    watch: { 
      	serverSettings: function(newVal) { 
          if(newVal) {
            this.smtpAuth = newVal.smtpAuth;
            this.tlsEnabled = newVal.tlsEnabled;
            this.emailHost = newVal.emailHost;
            this.emailPort = newVal.emailPort;
            this.emailUsername = newVal.emailUsername;
            this.emailPassword = newVal.emailPassword;
          }
        }
    },
    methods: {
        submitForm() {
            var data = new FormData();
            data.append("smtpAuth",this.smtpAuth);
            data.append("tlsEnabled",this.tlsEnabled);
            data.append("emailHost",this.emailHost);
            data.append("emailPort",this.emailPort);
            data.append("emailUsername",this.emailUsername);
            data.append("emailPassword",this.emailPassword);

            axios.post('/lider/settings/update/emailSettings', data).then(response => {
                this.$toast.add({
                    severity:'success', 
                    detail: "Bilgiler başarı ile güncellenmiştir.", 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
            });

        }
    },
}

</script>
