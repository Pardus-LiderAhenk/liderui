<template>
    <div class="p-fluid p-formgrid">
        <h6>{{$t('policy_management.profile.chrome_proxy.configuring_proxy_server_to_access_the_internet')}}</h6>
        <div class="p-field p-col-12 p-md-12">
            <Dropdown
                v-model="proxyType"
                :options="proxyOptions"
                optionLabel="name"
                optionValue="value"
            >
            </Dropdown>
        </div>
        <div v-if="proxyType == '0'">
        </div>

        <div v-if="proxyType == '1'">
        <h6>{{$t('policy_management.profile.chrome_proxy.manuel_configuration')}}</h6>
        <div class="p-fluid p-formgrid p-grid">
            <div class="p-field p-col-12 p-md-8">
                <label>{{$t('policy_management.profile.chrome_proxy.http_proxy_server')}}</label>
                <InputText  class="p-inputtext-sm" type="text" v-model="httpProxy"/>
            </div>
            <div class="p-field p-col-12 p-md-4">
                <label>{{$t('policy_management.profile.chrome_proxy.http_port')}}</label>
                <InputText class="p-inputtext-sm" type="text" v-model="httpPort"/>
            </div>
        </div>
        <div class="p-fluid p-formgrid p-grid">
            <div class="p-field p-col-12 p-md-8">
                <label>{{$t('policy_management.profile.chrome_proxy.https_proxy_server')}}</label>
                <InputText class="p-inputtext-sm" type="text" v-model="httpsProxy"/>
            </div>
            <div class="p-field p-col-12 p-md-4">
                <label>{{$t('policy_management.profile.chrome_proxy.https_port')}}</label>
                <InputText class="p-inputtext-sm" type="text" v-model="httpsPort"/>
            </div>
        </div>
        
        <div class="p-fluid p-formgrid p-grid">
            <div class="p-field p-col-12 p-md-8">
                <label>{{$t('policy_management.profile.chrome_proxy.ftp_proxy_server')}}</label>
                <InputText  class="p-inputtext-sm" type="text" v-model="ftpProxy"/>
            </div>
            <div class="p-field p-col-12 p-md-4">
                <label>{{$t('policy_management.profile.chrome_proxy.ftp_port')}}</label>
                <InputText class="p-inputtext-sm" type="text" v-model="ftpPort"/>
            </div>
        </div>
        <div class="p-fluid p-formgrid p-grid">
            <div class="p-field p-col-12 p-md-8">
                <label>{{$t('policy_management.profile.chrome_proxy.socks_proxy_server')}}</label>
                <InputText class="p-inputtext-sm" type="text" v-model="socksProxy"/>
            </div>
            <div class="p-field p-col-12 p-md-4">
                <label>{{$t('policy_management.profile.chrome_proxy.socks_port')}}</label>
                <InputText class="p-inputtext-sm" type="text" v-model="socksPort"/>
            </div>
        </div>
        <div class="p-fluid p-formgrid p-grid">
            <div class="p-field p-col-12 p-md-8">
                <label>{{$t('policy_management.profile.chrome_proxy.main_computer_ignore')}}</label>
                <InputText class="p-inputtext-sm" type="text" v-model="ignoreHosts"/>
            </div>

        </div>
        </div>
        
        <div v-if="proxyType == '2'">
            <div class="p-fluid p-formgrid p-grid">
                <div class="p-field p-col-12 p-md-8">
                    <label>{{$t("policy_management.profile.chrome_proxy.configuration_url")}}</label>
                    <InputText class="p-inputtext-sm" type="text" v-model="autoConfiguration"/>
                </div>
    
            </div>
        </div>
        

    </div>
</template>

<script>
import PreferencesChrome from './PreferencesChrome.js';

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
            httpsProxy: "",
            httpsPort: "",
            ftpProxy: "",
            ftpPort: "",
            socksProxy: "",
            socksPort: "",
            ignoreHosts:"",
            autoConfiguration:"",
            proxyOptions: [
                {name: this.$t('policy_management.profile.chrome_proxy.disabled'), value: "0"},
                {name: this.$t('policy_management.profile.chrome_proxy.manuel'), value:"1"},
                {name: this.$t('policy_management.profile.chrome_proxy.automatic'), value: "2"},
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
            this.httpsProxy = "";
            this.httpPort = "";
            this.ftpProxy = "";
            this.ftpPort = "";
            this.socksProxy = "";
            this.socksPort = "";
            this.ignoreHosts="",
            this.autoConfiguration = "";
            this.noProxyOn = "localhost; 127.0.0.1";
        }
    },

    methods: {
        getProxyPreferences() {
            this.addToPreferences(PreferencesChrome.proxyType, this.proxyType);

            // if(this.proxyType == "0"){
            //     this.addToPreferences("disable",PreferencesChrome.proxy_disabled_mode)
            // }
            if (this.proxyType == "1") {
                if (this.httpProxy != "" && this.httpProxy != null) {
                    this.addToPreferences(PreferencesChrome.http_proxy_host,this.httpProxy)
                }
                if (this.httpPort != "" && this.httpPort != null) {
                    this.addToPreferences(PreferencesChrome.http_proxy_port,this.httpPort)
                }
                if (this.httpsProxy != "" && this.httpsProxy != null) {
                    this.addToPreferences(PreferencesChrome.https_proxy_host,this.httpsProxy)
                }
                if (this.httpsPort != "" && this.httpsPort != null) {
                    this.addToPreferences(PreferencesChrome.https_proxy_port,this.httpsPort)
                }
                if (this.ftpProxy != "" && this.ftpProxy != null) {
                    this.addToPreferences(PreferencesChrome.ftp_proxy_host,this.ftpProxy)
                }
                if (this.ftpPort != "" && this.ftpPort != null) {
                    this.addToPreferences(PreferencesChrome.ftp_proxy_port,this.ftpPort)
                }
                if (this.socksProxy != "" && this.socksProxy != null) {
                    this.addToPreferences(PreferencesChrome.socks_proxy_host,this.socksProxy)
                }
                if (this.socksPort != "" && this.socksPort != null) {
                    this.addToPreferences(PreferencesChrome.socks_proxy_port,this.socksPort)
                }
                if (this.ignoreHosts != "" && this.ignoreHosts != null) {
                    this.addToPreferences(PreferencesChrome.ignore_proxy,this.ignoreHosts);
                }
            }
            if (this.proxyType == "2") {
                if (this.autoConfiguration != "" && this.autoConfiguration != null) {
                    this.addToPreferences(PreferencesChrome.autoconfiguration_proxy,this.autoConfiguration);
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
            let prefList = this.selectedProfileData.proxyListChrome;
            prefList.forEach(element => {
                if (element.preferenceName == PreferencesChrome.proxyType) {
                    this.proxyType = element.value;
                }
                if (element.preferenceName == PreferencesChrome.http_proxy_host) {
                    this.httpProxy = element.value;
                }
                if (element.preferenceName == PreferencesChrome.http_proxy_port) {
                    this.httpPort = element.value;
                }
                if (element.preferenceName == PreferencesChrome.https_proxy_host) {
                    this.httpsProxy = element.value;
                }
                if (element.preferenceName == PreferencesChrome.https_proxy_port) {
                    this.httpsPort = element.value;
                }
                if (element.preferenceName == PreferencesChrome.ftp_proxy_host) {
                    this.ftpProxy = element.value;
                }
                if (element.preferenceName == PreferencesChrome.ftp_proxy_port) {
                    this.ftpPort = element.value;
                }
                if (element.preferenceName == PreferencesChrome.socks_proxy_host) {
                    this.socksProxy = element.value;
                }
                if (element.preferenceName == PreferencesChrome.socks_proxy_port) {
                    this.socksPort = element.value;
                }
                if (element.preferenceName == PreferencesChrome.ignore_proxy) {
                    this.ignoreHosts = element.value;
                }
                if (element.preferenceName == PreferencesChrome.autoconfiguration_proxy) {
                    this.autoConfiguration = element.value;
                }
            });
        }
    },
    
}
</script>

<style lang="scss" scoped>
h6 {
    font-weight: bold;
}

</style>