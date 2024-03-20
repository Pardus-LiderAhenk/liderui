<template>
    <div class="p-fluid p-formgrid p-grid">
        <div class="p-col-12">
            <h3>{{$t('settings.server_settings.messaging_server_settings.xmpp_server_information')}}</h3>
        </div>
        <div class="p-field p-col-12 p-md-6">
            <label for="xmppHost">{{$t('settings.server_settings.messaging_server_settings.xmpp_server_address')}}</label>
            <InputText id="xmppHost" type="text" v-model="xmppHost"/>
        </div>
        <div class="p-field p-col-12 p-md-6">
            <label for="xmppPort">{{$t('settings.server_settings.messaging_server_settings.port')}}</label>
            <InputText id="xmppPort" type="number" v-model="xmppPort"/>
        </div>
        <div class="p-field p-col-12 p-md-6">
            <label for="xmppUsername">{{$t('settings.server_settings.messaging_server_settings.xmpp_username')}}</label>
            <InputText id="xmppUsername" type="text" v-model="xmppUsername"/>
        </div>
        <div class="p-field p-col-12 p-md-6">
            <label for="xmppPassword">{{$t('settings.server_settings.messaging_server_settings.xmpp_password')}}</label>
            <div class="p-inputgroup" v-if="xmppUsernameDefine">
                <InputText type="password"  
                    value="******************" 
                    readonly/>
                <Button 
                    icon="pi pi-unlock"
                    class="p-button-sm"
                    type="button" @click="changePasswordDialog = true" 
                    :label="$t('settings.server_settings.messaging_server_settings.change_password')" />
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
         <div class="p-field p-col-12 p-md-6">
            <label for="xmppResource">{{$t('settings.server_settings.messaging_server_settings.xmpp_source_name')}}</label>
            <InputText id="xmppResource" type="text" v-model="xmppResource" disabled/>
        </div>
         <div class="p-field p-col-12 p-md-6">
            <label for="xmppServiceName">{{$t('settings.server_settings.messaging_server_settings.xmpp_service_name')}}</label>
            <InputText id="xmppServiceName" type="text" v-model="xmppServiceName" disabled/>
        </div>
         <div class="p-field p-col-12 p-md-4">
            <label for="xmppMaxRetryConnectionCount">{{$t('settings.server_settings.messaging_server_settings.xmpp_retry_connection_count')}}</label>
            <InputText id="xmppMaxRetryConnectionCount" type="text" v-model="xmppMaxRetryConnectionCount"/>
        </div>
         <div class="p-field p-col-12 p-md-4">
            <label for="xmppPacketReplayTimeout">{{$t('settings.server_settings.messaging_server_settings.xmpp_package_replay_timeout')}}</label>
            <InputText id="xmppPacketReplayTimeout" type="text" v-model="xmppPacketReplayTimeout"/>
        </div>
         <div class="p-field p-col-12 p-md-4">
            <label for="xmppPingTimeout">{{$t('settings.server_settings.messaging_server_settings.xmpp_ping_timeout')}}</label>
            <InputText id="xmppPingTimeout" type="text" v-model="xmppPingTimeout"/>
        </div>
       <div class="p-field p-col-12 p-text-right">
            <div class="p-d-flex p-jc-end">
                <div>
                    <Button icon="pi pi-save" type="button" :label="$t('settings.server_settings.messaging_server_settings.save')" @click="showDialog = true;"/>
                </div>
            </div>
        </div>
    </div>

    <SettingsPasswordComponet v-if="changePasswordDialog"
        :visible="changePasswordDialog"
        :type="'xmppPassword'"
        :settingsOldPassword="xmppUsernameDefine"
        @updatedPassword="updatedPassword"
        @update:visible="changePasswordDialog = false"/>

    <Dialog :header="$t('settings.server_settings.messaging_server_settings.update_settings')" v-model:visible="showDialog" 
        :style="{width: '20vw'}" :modal="true">
        <div class="p-fluid">
            <i class="pi pi-info-circle p-mr-3" style="font-size: 1.5rem" />
            <span>
                {{$t('settings.server_settings.messaging_server_settings.messaging_server_notify')}}
            </span>
        </div>
        <template #footer>
            <Button :label="$t('settings.server_settings.messaging_server_settings.cancel')" icon="pi pi-times" 
                @click="showDialog = false" class="p-button-text p-button-sm"
            />
            <Button :label="$t('settings.server_settings.messaging_server_settings.yes')" icon="pi pi-check"
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
            xmppHost:'',
            xmppPort:'',
            xmppUsername:'',
            xmppResource:'',
            xmppServiceName:'',
            xmppMaxRetryConnectionCount:'',
            xmppPacketReplayTimeout:'',
            xmppPingTimeout:'',
            showDialog: false,
            changePasswordDialog: false,
            xmppUsernameDefine:false
        }
    },
    watch: { 
      	serverSettings: function(newVal) { 
          if(newVal) {
            this.xmppHost = newVal.xmppHost;
            this.xmppPort = newVal.xmppPort;
            this.xmppUsername = newVal.xmppUsername;
            this.xmppResource = newVal.xmppResource;
            this.xmppServiceName = newVal.xmppServiceName;
            this.xmppMaxRetryConnectionCount = newVal.xmppMaxRetryConnectionCount;
            this.xmppPacketReplayTimeout = newVal.xmppPacketReplayTimeout;
            this.xmppPingTimeout = newVal.xmppPingTimeout;
          }
          if(this.serverSettings && this.serverSettings.xmppUsername){
            this.xmppUsernameDefine = true
          }
        }
    },
    components: {
        SettingsPasswordComponet
    },
    methods: {
        async submitForm() {
            var data = new FormData();
            data.append("xmppHost",this.xmppHost);
            data.append("xmppPort",this.xmppPort);
            data.append("xmppUsername",this.xmppUsername);
            data.append("xmppMaxRetryConnectionCount",this.xmppMaxRetryConnectionCount);
            data.append("xmppPacketReplayTimeout",this.xmppPacketReplayTimeout);
            data.append("xmppPingTimeout",this.xmppPingTimeout);

            const { response,error } = await serverSettingService.updateXmpp(data);
            if(error){
                this.$toast.add({
                    severity:'error', 
                    detail: this.$t('settings.server_settings.messaging_server_settings.error_update_messaging_server_settings'),
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
            }
            else{
                if(response.status == 200){
                    this.$toast.add({
                        severity:'success', 
                        detail: this.$t('settings.server_settings.messaging_server_settings.messaging_server_settings_successfully_update'),
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000
                    });
                    setTimeout(() => {
                        this.$store.dispatch("logout").then(() => this.$router.push("/login")).catch(err => console.log(err))
                    }, 3000);
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
