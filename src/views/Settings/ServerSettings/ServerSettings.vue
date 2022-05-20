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
import axios from 'axios';

export default {
    components: {
        LdapSettingsForm,
        XmppSettingsForm,
        FileserverSettingsForm,
        EmailServerSettingsForm,
        OtherSettingsForm
    },
    data() {
        return {
            serverSettings: null,
        }
    },
    methods: {
        getServerSettings() {
            axios.get('/lider/settings/configurations').then(response => {
                this.serverSettings = response.data;
            });
        }
    },
    mounted() {
        this.getServerSettings();
    }

}

</script>
