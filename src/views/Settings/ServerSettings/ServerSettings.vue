<template>
    <TabView ref="tabview1">
        <TabPanel header="Dizin Sunucusu Ayarları">
            <ldap-settings-form></ldap-settings-form>
        </TabPanel>
        <TabPanel header="Mesajlaşma Sunucu (XMPP) Ayarları ">
            <xmpp-settings-form></xmpp-settings-form>
        </TabPanel>
        <TabPanel header="Dosya Sunucusu Ayarları">
            <fileserver-settings-form></fileserver-settings-form>
        </TabPanel>
            <TabPanel header="Email Sunucusu Ayarları">
            <email-server-settings-form></email-server-settings-form>
        </TabPanel>
            <TabPanel header="Diğer Ayarları">
            <other-settings-form></other-settings-form>
        </TabPanel>
    </TabView>
</template>


<script>
import LdapSettingsForm from './forms/LdapSettingsForm.vue';
import XmppSettingsForm from './forms/XmppSettingsForm.vue';
import FileserverSettingsForm from './forms/FileserverSettingsForm.vue';
import EmailServerSettingsForm from './forms/EmailServerSettingsForm.vue';
import OtherSettingsForm from './forms/OtherSettingsForm.vue';

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

        }
    }

}

</script>
