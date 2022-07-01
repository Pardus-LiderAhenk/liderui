<template>
    <div class="p-fluid p-formgrid">
        <h6>{{$t('policy_management.profile.proxy.configuring_proxy_server_to_access_the_internet')}}</h6>
        <div class="p-field p-col-12 p-md-12">
            <Dropdown
                v-model="proxyType"
                :options="proxyOptions"
                optionLabel="name"
                optionValue="value"
            >
            </Dropdown>
        </div>
        <h6>{{$t('policy_management.profile.proxy.manuel_configuration')}}</h6>
        <div class="p-fluid p-formgrid p-grid">
            <div class="p-field p-col-12 p-md-8">
                <label>{{$t('policy_management.profile.proxy.http_proxy_server')}}</label>
                <InputText :disabled="proxyType != '1'" class="p-inputtext-sm" type="text" v-model="httpProxy"/>
            </div>
            <div class="p-field p-col-12 p-md-4">
                <label>{{$t('policy_management.profile.proxy.http_port')}}</label>
                <InputText :disabled="proxyType != '1'" class="p-inputtext-sm" type="text" v-model="httpPort"/>
            </div>
        </div>
        <div class="p-field p-grid">
            <InputSwitch :disabled="proxyType != '1'"  class="p-col-fixed" id="useThisServerForAllProtocols" v-model="useThisServerForAllProtocols"/>
            <label for="useThisServerForAllProtocols" class="p-col" >{{$t('policy_management.profile.proxy.browser_settings_notify')}}</label>
        </div>
        <div class="p-fluid p-formgrid p-grid">
            <div class="p-field p-col-12 p-md-8">
                <label>{{$t('policy_management.profile.proxy.ssl_proxy_server')}}</label>
                <InputText :disabled="proxyType != '1'" class="p-inputtext-sm" type="text" v-model="sslProxy"/>
            </div>
            <div class="p-field p-col-12 p-md-4">
                <label>{{$t('policy_management.profile.proxy.ssl_port')}}</label>
                <InputText :disabled="proxyType != '1'" class="p-inputtext-sm" type="text" v-model="sslPort"/>
            </div>
        </div>
        <div class="p-fluid p-formgrid p-grid">
            <div class="p-field p-col-12 p-md-8">
                <label>{{$t('policy_management.profile.proxy.ftp_proxy_server')}}</label>
                <InputText :disabled="proxyType != '1'" class="p-inputtext-sm" type="text" v-model="ftpProxy"/>
            </div>
            <div class="p-field p-col-12 p-md-4">
                <label>{{$t('policy_management.profile.proxy.ftp_port')}}</label>
                <InputText :disabled="proxyType != '1'" class="p-inputtext-sm" type="text" v-model="ftpPort"/>
            </div>
        </div>
        <div class="p-fluid p-formgrid p-grid">
            <div class="p-field p-col-12 p-md-8">
                <label>{{$t('policy_management.profile.proxy.socks_proxy_server')}}</label>
                <InputText :disabled="proxyType != '1'" class="p-inputtext-sm" type="text" v-model="socksProxy"/>
            </div>
            <div class="p-field p-col-12 p-md-2">
                <label>{{$t('policy_management.profile.proxy.socks_port')}}</label>
                <InputText :disabled="proxyType != '1'" class="p-inputtext-sm" type="text" v-model="socksPort"/>
            </div>
            <div class="p-field p-col-12 p-md-2">
                <label>{{$t('policy_management.profile.proxy.socks_version')}}</label>
                <Dropdown :disabled="proxyType != '1'"
                    v-model="socksVersion"
                    :options="[{name: '4', value: '4'},
                            {name: '5', value: '5'}]"
                    optionLabel="name" optionValue="value"
                >
                </Dropdown>
            </div>
        </div>
        <div class="p-field p-grid">
            <InputSwitch :disabled="proxyType != '1'" class="p-col-fixed" id="remoteDns" v-model="remoteDns"/>
            <label for="remoteDns" class="p-col">{{$t('policy_management.profile.proxy.remote_dns')}}</label>
        </div>
        <div class="p-field">
            <label class="p-col">{{$t('policy_management.profile.proxy.using_proxy_server')}}</label>
            <Textarea :disabled="proxyType != '1'" v-model="noProxyOn"></Textarea>
        </div>
        <div class="p-field">
            <label class="p-col">{{$t('policy_management.profile.proxy.automatic_proxy_configuration_url')}}</label>
            <InputText :disabled="proxyType != '2'" class="p-inputtext-sm" type="text" v-model="autoProxyConfigUrl"/>
        </div>
        <div class="p-field p-grid">
            <InputSwitch :disabled="proxyType != '1'" class="p-col-fixed" id="dontPromptForAuth" v-model="dontPromptForAuth"/>
            <label for="dontPromptForAuth" class="p-col">{{$t('policy_management.profile.proxy.donot_ask_for_authorization_if_password_is_saved')}}</label>
        </div>
    </div>
</template>

<script>
import Preferences from './Preferences.js'

export default {
    props: {
        selectedProfileData: {
            type: Object,
            description: "Selected profile data",
        },
    },

    data() {
        return {
            proxyType: "0",
            httpProxy: "",
            httpPort: "",
            useThisServerForAllProtocols: false,
            sslProxy: "",
            sslPort: "",
            ftpProxy: "",
            ftpPort: "",
            socksProxy: "",
            socksPort: "",
            socksVersion: "5",
            remoteDns: false,
            autoProxyConfigUrl: "",
            dontPromptForAuth: false,
            noProxyOn: "localhost, 127.0.0.1",
            proxyOptions: [
                {name: this.$t('policy_management.profile.proxy.using_proxy_server'), value: "0"},
                {name: this.$t('policy_management.profile.proxy.manuel_configuration'), value:"1"},
                {name: this.$t('policy_management.profile.proxy.automatic_proxy_configuration_url'), value: "2"},
                {name: this.$t('policy_management.profile.proxy.use_system_proxy_settings'), value: "3"},
                {name: this.$t('policy_management.profile.proxy.automatically_discover_proxy_settings_for_this_network'), value: "4"}
            ],
            proxyPreferences: []
        }
    },

    mounted(){
        if (this.selectedProfileData) {
            this.setProxyPreferences();
        } else {
            this.proxyType = "0";
            this.httpProxy = "";
            this.httpPort = "";
            this.useThisServerForAllProtocols = false;
            this.sslProxy = "";
            this.sslPort = "";
            this.ftpProxy = "";
            this.ftpPort = "";
            this.socksProxy = "";
            this.socksPort = "";
            this.socksVersion = "5";
            this.remoteDns = false;
            this.autoProxyConfigUrl = "";
            this.dontPromptForAuth = false;
            this.noProxyOn = "localhost; 127.0.0.1";
        }
    },

    methods: {
        getProxyPreferences() {
            this.addToPreferences(Preferences.proxyType, this.proxyType);
            this.addToPreferences(Preferences.useThisServerForAllProtocols, this.useThisServerForAllProtocols.toString());
            this.addToPreferences(Preferences.dontPromptForAuth, this.dontPromptForAuth.toString());
            this.addToPreferences(Preferences.remoteDns, this.remoteDns.toString());
            if (this.proxyType == "1") {
                if (this.httpProxy != "" && this.httpProxy != null) {
                    this.addToPreferences(Preferences.httpProxy, this.httpProxy);
                }
                if (this.httpPort != "" && this.httpPort != null) {
                    this.addToPreferences(Preferences.httpPort, this.httpPort);
                }
                if (this.sslProxy != "" && this.sslProxy != null) {
                    this.addToPreferences(Preferences.sslProxy, this.sslProxy);
                }
                if (this.sslPort != "" && this.sslPort != null) {
                    this.addToPreferences(Preferences.sslPort, this.sslPort);
                }
                if (this.ftpProxy != "" && this.ftpProxy != null) {
                    this.addToPreferences(Preferences.ftpProxy, this.ftpProxy);
                }
                if (this.ftpPort != "" && this.ftpPort != null) {
                    this.addToPreferences(Preferences.ftpPort, this.ftpPort);
                }
                if (this.socksProxy != "" && this.socksProxy != null) {
                    this.addToPreferences(Preferences, this.socksProxy);
                }
                if (this.socksPort != "" && this.socksPort != null) {
                    this.addToPreferences(Preferences.socksPort, this.socksPort);
                }
                this.addToPreferences(Preferences.socksVersion, this.socksVersion);
                if (this.noProxyOn != "" && this.noProxyOn != null) {
                    this.addToPreferences(Preferences.noProxyOn, this.noProxyOn);
                }
            }
            if (this.proxyType == "2") {
                if (this.autoProxyConfigUrl != "" && this.autoProxyConfigUrl != null) {
                    this.addToPreferences(Preferences.autoProxyConfigUrl, this.autoProxyConfigUrl);
                }
            }
            return this.proxyPreferences;
        },

        addToPreferences(name, value) {
            this.proxyPreferences.push({
                "preferenceName" : name,
                "value" : value
            });
        },

        setProxyPreferences() {
            let prefList = this.selectedProfileData.preferences;
            prefList.forEach(element => {
                if (element.preferenceName == Preferences.proxyType) {
                    this.proxyType = element.value;
                }
                if (element.preferenceName == Preferences.useThisServerForAllProtocols && element.value == 'true') {
                    this.useThisServerForAllProtocols = true;
                }
                if (element.preferenceName == Preferences.dontPromptForAuth && element.value == 'true') {
                    this.dontPromptForAuth = true;
                }
                if (element.preferenceName == Preferences.remoteDns && element.value == 'true') {
                    this.remoteDns = true;
                }
                if (element.preferenceName == Preferences.httpProxy) {
                    this.httpProxy = element.value;
                }
                if (element.preferenceName == Preferences.httpPort) {
                    this.httpPort = element.value;
                }
                if (element.preferenceName == Preferences.sslProxy) {
                    this.sslProxy = element.value;
                }
                if (element.preferenceName == Preferences.sslPort) {
                    this.sslPort = element.value;
                }
                if (element.preferenceName == Preferences.ftpProxy) {
                    this.ftpProxy = element.value;
                }
                if (element.preferenceName == Preferences.ftpPort) {
                    this.ftpPort = element.value;
                }
                if (element.preferenceName == Preferences.socksProxy) {
                    this.socksProxy = element.value;
                }
                if (element.preferenceName == Preferences.socksPort) {
                    this.socksPort = element.value;
                }
                if (element.preferenceName == Preferences.socksVersion) {
                    this.socksVersion = element.value;
                }
                if (element.preferenceName == Preferences.noProxyOn) {
                    this.noProxyOn = element.value;
                }
                if (element.preferenceName == Preferences.autoProxyConfigUrl) {
                    this.autoProxyConfigUrl = element.value;
                }
            });
        }
    }
    
}
</script>

<style lang="scss" scoped>
h6 {
    font-weight: bold;
}

</style>