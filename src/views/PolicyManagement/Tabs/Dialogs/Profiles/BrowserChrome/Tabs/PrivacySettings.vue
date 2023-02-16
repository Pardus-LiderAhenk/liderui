<template>
    <div class="p-fluid p-formgrid">
        <h6>{{$t('policy_management.profile.privacy.being_tracked')}}</h6>
        
        <h6>{{$t('policy_management.profile.privacy.history')}}</h6>
        <div class="p-field p-grid">
            <InputSwitch  class="p-col-fixed" id="AllowDeletingBrowserHistory" v-model="AllowDeletingBrowserHistory"/>
            <label for="AllowDeletingBrowserHistory" class="p-col">{{$t('Tarayıcı geçmişi silinmesine izin ver')}}</label>
        </div>
        <div class="p-field p-grid">
            <InputSwitch  class="p-col-fixed" id="SavingBrowserHistoryDisabled" v-model="SavingBrowserHistoryDisabled"/>
            <label for="SavingBrowserHistoryDisabled" class="p-col">{{$t('Tarayıcı geçmişini kaydetme')}}</label>
        </div>
        <div class="p-field p-grid">
            <InputSwitch  class="p-col-fixed" id="DefaultCookiesSetting" v-model="DefaultCookiesSetting"/>
            <label for="DefaultCookiesSetting" class="p-col">{{$t('Çerezleri kabul et')}}</label>
        </div>
        <div class="p-field p-grid">
            <InputSwitch  class="p-col-fixed" id="HttpsOnlyMode" v-model="HttpsOnlyMode"/>
            <label for="HttpsOnlyMode" class="p-col">{{$t('Her zaman güvenli bağlantıları kullan(Https)')}}</label>
        </div>
        <div class="p-field p-grid">
            <InputSwitch  class="p-col-fixed" id="DnsOverHttpsMode" v-model="DnsOverHttpsMode"/>
            <label for="DnsOverHttpsMode" class="p-col">{{$t('Güvenli DNS kullan')}}</label>
        </div>

        <h6>{{$t('Tarama geçmişi verileri temizle')}}</h6>
        <div class="field-checkbox">
            <Checkbox inputId="browsing_history" name="Tarama geçmişi" :binary="true" v-model="browsingHistory" />
            <label for="browsing_history">Tarama geçmişi</label>
        </div>
        <div class="field-checkbox">
            <Checkbox inputId="download_history" name="İndirme geçmişi" :binary="true" v-model="downloadHistory" />
            <label for="download_history">İndirme geçmişi</label>
        </div>
        <div class="field-checkbox">
            <Checkbox inputId="cookies_and_other_site_data" name="Çerezler ve diğer site verileri" value="cookies_and_other_site_data" v-model="cookiesAndOtherSiteData" />
            <label for="cookies_and_other_site_data">Çerezler ve diğer site verileri</label>
        </div>
        <div class="field-checkbox">
            <Checkbox inputId="cached_images_and_files" name="Önbelleğe alınan resimler ve dosyalar" value="cached_images_and_files" v-model="cachedImagesAndFiles" />
            <label for="cached_images_and_files">Önbelleğe alınan resimler ve dosyalar</label>
        </div>
        <div class="field-checkbox">
            <Checkbox inputId="password_signin" name="Şifreler ve diğer oturum açma verileri" value="password_signin" v-model="passwordSignin" />
            <label for="password_signin">Şifreler ve diğer oturum açma verileri</label>
        </div>
        <div class="field-checkbox">
            <Checkbox inputId="autofill" name="Formu otomatik doldurma verileri" value="autofill" v-model="autofill" />
            <label for="autofill">Formu otomatik doldurma verileri</label>
        </div>



    </div>
</template>

<script>
import Preferences, { PreferencesChrome } from './PreferencesChrome.js';
import Checkbox from 'primevue/checkbox';



export default {
    props: {
        selectedProfileData: {
            type: Object,
            description: "Selected profile data",
        },
    },

    data () {
        return {
            acceptThirdPartyCookies: "2",
            dontWantToBeTracked: false,
            rememberBrowsingDownloadHistory: false,
            rememberSearchFormHistory: false,
            DnsOverHttpsMode:"",
            HttpsOnlyMode:"",
            AllowDeletingBrowserHistory:false,
            DefaultCookiesSetting:"1",
            ClearBrowsingDataOnExitList: [],
            proxyPreferences: [],
            browsingHistory: false,
            downloadHistory: false,
            cookiesAndOtherSiteData: false,
            cachedImagesAndFiles: false,
            passwordSignin: false,
            autofill: false
        }
    },

    mounted(){
        if (this.selectedProfileData) {
            this.setPrivacyPreferences();
        } else {
            this.DnsOverHttpsMode = "",
            this.HttpsOnlyMode = "",
            this.AllowDeletingBrowserHistory = false,
            this.DefaultCookiesSetting = "1",
            this.ClearBrowsingDataOnExitList = []
        }
    },

    methods: {
        getPrivacyPreferences() {
            this.addToPreferences(PreferencesChrome.DnsOverHttpsMode, this.DnsOverHttpsMode.toString());
            this.addToPreferences(PreferencesChrome.HttpsOnlyMode, this.HttpsOnlyMode.toString());
            this.addToPreferences(PreferencesChrome.AllowDeletingBrowserHistory, this.AllowDeletingBrowserHistory);
            this.addToPreferences(PreferencesChrome.DefaultCookiesSetting, this.DefaultCookiesSetting.toString());
            this.addToPreferences(PreferencesChrome.ClearBrowsingDataOnExitList, this.ClearBrowsingDataOnExitList);
            if (this.browsingHistory) {
                this.ClearBrowsingDataOnExitList.push("browsing_history")
            }
            if (this.downloadHistory) {
                this.ClearBrowsingDataOnExitList.push("download_history")
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
            let prefList = this.selectedProfileData.preferences;
            prefList.forEach(element => {
                if (element.preferenceName == Preferences.dontWantToBeTracked && element.value == "true") {
                    this.dontWantToBeTracked = true;
                }
                if (element.preferenceName == Preferences.rememberBrowsingDownloadHistory && element.value == "true") {
                    this.rememberBrowsingDownloadHistory = true;
                }
                if (element.preferenceName == Preferences.rememberSearchFormHistory && element.value == "true") {
                    this.rememberSearchFormHistory = true;
                }
                if (element.preferenceName == Preferences.clearHistoryOnClose && element.value == "true") {
                    this.clearHistoryOnClose = true;
                }
                if (element.preferenceName == Preferences.suggestHistory && element.value == "true") {
                    this.suggestHistory = true;
                }
                if (element.preferenceName == Preferences.suggestBookmarks && element.value == "true") {
                    this.suggestBookmarks = true;
                }
                if (element.preferenceName == Preferences.suggestOpenTabs && element.value == "true") {
                    this.suggestOpenTabs = true;
                }
                if(element.preferenceName == PreferencesChrome.ClearBrowsingDataOnExitList){
                    this.ClearBrowsingDataOnExitList = element.value;
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