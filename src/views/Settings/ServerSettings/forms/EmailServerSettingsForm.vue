<template>
    <div class="p-fluid p-formgrid p-grid">
        <div class="p-col-12">
            <h3>{{$t('settings.server_settings.mail_server_settings.mail_server_settings')}}</h3>
        </div>
        <div class="p-field p-col-12 p-md-4">
            <label for="mailHost">{{$t('settings.server_settings.mail_server_settings.mail_host_address')}}</label>
            <InputText id="mailHost" type="text" v-model="mailHost" placeholder="smtp.gmail.com"/>
        </div>
        <div class="p-field p-col-12 p-md-4">
            <label for="mailPort">{{$t('settings.server_settings.mail_server_settings.port')}}</label>
            <InputText id="mailPort" type="number" v-model="mailPort" placeholder="587"/>
        </div>
        <div class="p-field p-col-12 p-md-4">
            <label for="mailUsername">{{$t('settings.server_settings.mail_server_settings.mail_username')}}</label>
            <InputText id="mailUsername" type="text" v-model="mailUsername" placeholder="lider@liderahenk.org"/>
        </div>
        <div class="p-field p-col-12 p-md-4">
            <label for="mailPassword">{{$t('settings.server_settings.mail_server_settings.mail_password')}}</label>
            <div class="p-inputgroup" v-if="mailUsernameDefine">
                <InputText type="password"  
                    value="******************" 
                    readonly/>
                <Button
                    icon="pi pi-unlock"
                    class="p-button-sm"
                    type="button" @click="changePasswordDialog = true" 
                    :label="$t('settings.server_settings.mail_server_settings.change_password')" />
                
            </div>
            <div class="p-inputgroup" v-else>
                <InputText type="password"  
                    value="" 
                    readonly/>
                <Button 
                    icon="pi pi-save"
                    class="p-button-sm"
                    type="button" @click="changePasswordDialog = true" 
                    :label="$t('settings_password.create_password')" />
            </div>
        </div>
         <div class="p-field p-col-12 p-md-4">
            <label for="zip">{{$t('settings.server_settings.mail_server_settings.smtp_verification')}}</label>
            <Dropdown :options="yesNoChoise" optionLabel="label" optionValue="value" v-model="mailSmtpAuth"></Dropdown>
        </div>
         <div class="p-field p-col-12 p-md-4">
            <label for="zip">{{$t('settings.server_settings.mail_server_settings.tls_activation')}}</label>
            <Dropdown :options="yesNoChoise" optionLabel="label" optionValue="value" v-model="mailTlsEnabled"></Dropdown>
        </div>
        <div class="p-field p-col-12 p-text-right">
            <div class="p-d-flex p-jc-end">
                <div>
                    <Button icon="pi pi-save" type="button" :label="$t('settings.server_settings.mail_server_settings.save')" @click="showDialog = true"/>
                </div>
            </div>
        </div>
    </div>

    <SettingsPasswordComponet v-if="changePasswordDialog"
        :visible="changePasswordDialog"
        :type="'emailServerPassword'"
        :settingsOldPassword="mailUsernameDefine"
        @updatedPassword="updatedPassword"
        @update:visible="changePasswordDialog = false"/>

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
            <Button :label="$t('settings.server_settings.mail_server_settings.yes')" 
                @click="submitForm" class="p-button-sm"
            />
        </template>
    </Dialog>
</template>


<script>
import { serverSettingService } from '../../../../services/Settings/ServerSettingsService.js';
import SettingsPasswordComponet from '../../../../components/Password/SettingsPasswordComponent.vue';

export default {
    props:['serverSettings'],
    data() {
        return {
            yesNoChoise: [
                {label:this.$t('settings.server_settings.mail_server_settings.yes'), value:true},
                {label:this.$t('settings.server_settings.mail_server_settings.no'), value:false},
            ],
            mailSmtpAuth:true,
            mailTlsEnabled:true,
            mailHost:'',
            mailPort:'',
            mailUsername:'',
            validationOldPassword: false,
            showDialog: false,
            changePasswordDialog: false,
            mailUsernameDefine: false
        }
        
    },
    components: {
        SettingsPasswordComponet
    },
    watch: { 
      	serverSettings: function(newVal) { 
          if(newVal) {
            this.mailSmtpAuth = newVal.mailSmtpAuth;
            this.mailTlsEnabled = newVal.mailTlsEnabled;
            this.mailHost = newVal.mailHost;
            this.mailPort = newVal.mailPort;
            this.mailUsername = newVal.mailAddress;
          }
          if(this.serverSettings && this.serverSettings.mailHost){
                this.mailUsernameDefine = true
          }
        }
    },
    methods: {
        async submitForm() {
            var data = new FormData();
            data.append("mailSmtpAuth",this.mailSmtpAuth);
            data.append("mailTlsEnabled",this.mailTlsEnabled);
            data.append("mailHost",this.mailHost);
            data.append("mailPort",this.mailPort);
            data.append("mailAddress",this.mailUsername);
            const { response,error} = await  serverSettingService.updateEmail(data);
            if(error){
                this.$toast.add({
                    severity:'error', 
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
        },
        updatedPassword() {
            this.changePasswordDialog = false;
        }
        
    }
}

</script>