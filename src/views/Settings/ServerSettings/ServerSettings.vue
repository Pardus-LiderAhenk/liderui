<template>
    <TabView ref="tabview1">
        <TabPanel header="Dizin Sunucusu Ayarları">
            <ldap-settings-form :serverSettings="serverSettings"></ldap-settings-form>
        </TabPanel>
        <TabPanel header="Mesajlaşma Sunucu (XMPP) Ayarları ">
            <xmpp-settings-form :serverSettings="serverSettings"></xmpp-settings-form>
        </TabPanel>
        <TabPanel header="Dosya Sunucusu Ayarları">
            <fileserver-settings-form :serverSettings="serverSettings"></fileserver-settings-form>
        </TabPanel>
            <TabPanel header="Email Sunucusu Ayarları">
            <email-server-settings-form :serverSettings="serverSettings"></email-server-settings-form>
        </TabPanel>
            <TabPanel header="Diğer Ayarları">
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
                console.log('Server Settings Changed');
            });
        }
    },
    mounted() {
        this.getServerSettings();
    }

}

</script>
