<template>
    <div class="p-fluid p-formgrid">
        
        <h6>{{$t('policy_management.profile.chrome_privacy.history')}}</h6>
        <div class="p-field p-grid">
            <InputSwitch  class="p-col-fixed" id="AllowDeletingBrowserHistory" v-model="AllowDeletingBrowserHistory"/>
            <label for="AllowDeletingBrowserHistory" class="p-col">{{$t('policy_management.profile.chrome_privacy.browser_history_remove')}}</label>
        </div>
        <div class="p-field p-grid">
            <InputSwitch  class="p-col-fixed" id="SavingBrowserHistoryDisabled" v-model="SavingBrowserHistoryDisabled"/>
            <label for="SavingBrowserHistoryDisabled" class="p-col">{{$t('policy_management.profile.chrome_privacy.save_browsing_history')}}</label>
        </div>
        <div class="p-field p-grid">
            <InputSwitch  class="p-col-fixed" id="DefaultCookiesSetting" v-model="DefaultCookiesSetting"/>
            <label for="DefaultCookiesSetting" class="p-col">{{$t('policy_management.profile.chrome_privacy.accept_cookies')}}</label>
        </div>
        <div class="p-field p-grid">
            <InputSwitch  class="p-col-fixed" id="HttpsOnlyMode" v-model="HttpsOnlyMode"/>
            <label for="HttpsOnlyMode" class="p-col">{{$t('policy_management.profile.chrome_privacy.secure_https')}}</label>
        </div>
        <div class="p-field p-grid">
            <InputSwitch  class="p-col-fixed" id="DnsOverHttpsMode" v-model="DnsOverHttpsMode"/>
            <label for="DnsOverHttpsMode" class="p-col">{{$t('policy_management.profile.chrome_privacy.secure_dns')}}</label>
        </div>

        <h6>{{$t('policy_management.profile.chrome_privacy.clear_browsing_data_history')}}</h6>

        <div class="field-checkbox">
            <Checkbox inputId="browsing_history" name="browsing_history" :binary="true" v-model="browsingHistory" />
            <label for="browsing_history">{{$t('policy_management.profile.chrome_privacy.browsing_history')}}</label>
        </div>
        <br>
        <div class="field-checkbox">
            <Checkbox inputId="download_history" name="download_history" :binary="true" v-model="downloadHistory" />
            <label for="download_history">{{$t('policy_management.profile.chrome_privacy.download_history')}}</label>
        </div>
        <br>
        <div class="field-checkbox">
            <Checkbox inputId="cookies_and_other_site_data" name="cookies_and_other_site_data" :binary="true" value="cookies_and_other_site_data" v-model="cookiesAndOtherSiteData" />
            <label for="cookies_and_other_site_data">{{$t('policy_management.profile.chrome_privacy.cookies_and_otherSite_data')}}</label>
        </div>
        <br>
        <div class="field-checkbox">
            <Checkbox inputId="cached_images_and_files" name="cached_images_and_files" :binary="true" value="cached_images_and_files" v-model="cachedImagesAndFiles" />
            <label for="cached_images_and_files">{{$t('policy_management.profile.chrome_privacy.cache_image_and_file')}}</label>
        </div>
        <br>
        <div class="field-checkbox">
            <Checkbox inputId="password_signin" name="password_signin" :binary="true" value="password_signin" v-model="passwordSignin" />
            <label for="password_signin">{{$t('policy_management.profile.chrome_privacy.password_and_other_open_session')}}</label>
        </div>
        <br>
        <div class="field-checkbox">
            <Checkbox inputId="autofill" name="autofill" :binary="true" value="autofill" v-model="autofill" />
            <label for="autofill">{{$t('policy_management.profile.chrome_privacy.autofill_form')}}</label>
        </div>
        
    </div>

</template>

<script>
import  PreferencesChrome  from './PreferencesChrome.js';

export default {
    props: {
        selectedProfileData: {
            type: Object,
            description: "Selected profile data",
        },
    },

    data () {
        return {

            DnsOverHttpsMode:false,
            HttpsOnlyMode:false,
            AllowDeletingBrowserHistory:false,
            SavingBrowserHistoryDisabled:false,
            DefaultCookiesSetting:false,
            ClearBrowsingDataOnExitList: [],
            browsingHistory: false,
            downloadHistory: false,
            cookiesAndOtherSiteData: false,
            cachedImagesAndFiles: false,
            passwordSignin: false,
            autofill: false,
            proxyPreferences: []

        }
    },

    mounted(){
        if (this.selectedProfileData) {
            this.setPrivacyPreferences();
        } else {
            this.DnsOverHttpsMode = false,
            this.HttpsOnlyMode = false,
            this.AllowDeletingBrowserHistory = false,
            this.DefaultCookiesSetting = false,
            this.SavingBrowserHistoryDisabled = false,
            this.ClearBrowsingDataOnExitList = []
        }
    },

    methods: {
        getPrivacyPreferences() {
            this.DnsOverHttpsMode ? this.addToPreferences(PreferencesChrome.DnsOverHttpsMode, "automatic") : this.addToPreferences(PreferencesChrome.DnsOverHttpsMode, "off");
            this.HttpsOnlyMode ? this.addToPreferences(PreferencesChrome.HttpsOnlyMode, "allowed") : this.addToPreferences(PreferencesChrome.HttpsOnlyMode, "disallowed");
            this.AllowDeletingBrowserHistory ? this.addToPreferences(PreferencesChrome.AllowDeletingBrowserHistory, "true") : this.addToPreferences(PreferencesChrome.AllowDeletingBrowserHistory, "false");
            this.SavingBrowserHistoryDisabled ? this.addToPreferences(PreferencesChrome.SavingBrowserHistoryDisabled, "true") : this.addToPreferences(PreferencesChrome.SavingBrowserHistoryDisabled, "false");
            this.DefaultCookiesSetting ? this.addToPreferences(PreferencesChrome.DefaultCookiesSetting, parseInt(1)) : this.addToPreferences(PreferencesChrome.DefaultCookiesSetting, parseInt(2));
            this.addToPreferences(PreferencesChrome.ClearBrowsingDataOnExitList, this.ClearBrowsingDataOnExitList);
            if (this.browsingHistory) {
                this.ClearBrowsingDataOnExitList.push("browsing_history")
            }
            if (this.downloadHistory) {
                this.ClearBrowsingDataOnExitList.push("download_history")
            }
            if (this.cookiesAndOtherSiteData) {
                this.ClearBrowsingDataOnExitList.push("cookies_and_other_site_data")
            }
            if (this.cachedImagesAndFiles) {
                this.ClearBrowsingDataOnExitList.push("cached_images_and_files")
            }
            if (this.passwordSignin) {
                this.ClearBrowsingDataOnExitList.push("password_signin")
            }
            if (this.autofill) {
                this.ClearBrowsingDataOnExitList.push("autofill")
            }


            return this.proxyPreferences;
        },

        addToPreferences(name, value) {
            this.proxyPreferences.push({
                "preferenceName" : name,
                "value" : value
            });
        },

        setPrivacyPreferences() {
            let prefList = this.selectedProfileData.preferencesChrome;
            prefList.forEach(element => {
                if (element.preferenceName == PreferencesChrome.DnsOverHttpsMode  && element.value == "automatic") {
                    this.DnsOverHttpsMode = true;
                }
                if (element.preferenceName == PreferencesChrome.HttpsOnlyMode && element.value == "allowed") {
                    this.HttpsOnlyMode = true;
                }
                if (element.preferenceName == PreferencesChrome.AllowDeletingBrowserHistory && element.value == "true") {
                    this.AllowDeletingBrowserHistory = true;
                }
                if (element.preferenceName == PreferencesChrome.DefaultCookiesSetting && element.value == 1) {
                    this.DefaultCookiesSetting = true;
                }
                if (element.preferenceName == PreferencesChrome.SavingBrowserHistoryDisabled && element.value == "true") {
                    this.SavingBrowserHistoryDisabled = true;
                }
                if(element.preferenceName == PreferencesChrome.ClearBrowsingDataOnExitList){ 
                    element.value.forEach(el => {
                        if (el == "browsing_history") {
                            this.browsingHistory = true;
                        }
                        if (el == "autofill") {
                            this.autofill = true;
                        }
                        if (el == "download_history") {
                            this.downloadHistory = true;
                        }
                        if (el == "cookies_and_other_site_data") {
                            this.cookiesAndOtherSiteData = true;
                        }
                        if (el == "cached_images_and_files") {
                            this.cachedImagesAndFiles = true;
                        }
                        if (el == "password_signin") {
                            this.passwordSignin = true;
                        }
                    });
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
.field-checkbox{
    position: center;
    left: 50%;
    top: 50%;
}

</style>