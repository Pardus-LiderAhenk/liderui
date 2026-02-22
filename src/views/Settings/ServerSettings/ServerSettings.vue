<template>
    <TabView ref="tabview1">
        <TabPanel :header="$t('settings.server_settings.directory_server_setting')">
            <ldap-settings-form :serverSettings="serverSettings"></ldap-settings-form>
        </TabPanel>
        <TabPanel :header="$t('settings.server_settings.xmpp_server_setting')">
            <xmpp-settings-form :serverSettings="serverSettings"></xmpp-settings-form>
        </TabPanel>
        <TabPanel :header="$t('settings.server_settings.file_server_setting')">
            <fileserver-settings-form :serverSettings="serverSettings"></fileserver-settings-form>
        </TabPanel>
            <TabPanel :header="$t('settings.server_settings.mail_server_setting')">
            <email-server-settings-form :serverSettings="serverSettings"></email-server-settings-form>
        </TabPanel>
        <TabPanel :header="$t('settings.server_settings.notification_server_setting')">
            <notification-settings-form :serverSettings="serverSettings"></notification-settings-form>
        </TabPanel>
            <TabPanel :header="$t('settings.server_settings.other_setting')">
            <other-settings-form :serverSettings="serverSettings"></other-settings-form>
        </TabPanel>
    </TabView>
</template>


<script>
import LdapSettingsForm from './forms/LdapSettingsForm.vue';
import XmppSettingsForm from './forms/XmppSettingsForm.vue';
import FileserverSettingsForm from './forms/FileserverSettingsForm.vue';
import EmailServerSettingsForm from './forms/EmailServerSettingsForm.vue';
import OtherSettingsForm from './forms/OtherSettingsForm.vue';
import NotificationSettingsForm from './forms/NotificationSettingsForm.vue';
import { serverSettingService } from '../../../services/Settings/ServerSettingsService.js';

export default {
    components: {
        LdapSettingsForm,
        XmppSettingsForm,
        FileserverSettingsForm,
        EmailServerSettingsForm,
        OtherSettingsForm,
        NotificationSettingsForm
    },
    data() {
        return {
            serverSettings: null,
        }
    },
    methods: {
        async getServerSettings() {

            const { response,error } = await serverSettingService.getConfigurations();
            if(error){
                this.$toast.add({
                    severity:'error', 
                    detail: this.$t('settings.server_settings.error_server_settings'),
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
            }
            else{
                if(response.status == 200){
                    this.serverSettings = response.data;
                }
                else if(response.status == 417){
                    this.$toast.add({
                    severity:'error', 
                    detail: this.$t('settings.server_settings.error_417_server_settings'),
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
                }
            }
                
            
        }
    },
    mounted() {
        this.getServerSettings();
    }

}

</script>
