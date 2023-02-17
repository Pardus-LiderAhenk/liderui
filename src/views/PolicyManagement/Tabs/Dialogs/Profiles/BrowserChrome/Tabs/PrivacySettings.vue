<template>
    <div class="p-fluid p-formgrid">
        
        
        <h6>{{$t('Geçmiş')}}</h6>
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
        <br>
        <div class="field-checkbox">
            <Checkbox inputId="download_history" name="İndirme geçmişi" :binary="true" v-model="downloadHistory" />
            <label for="download_history">İndirme geçmişi</label>
        </div>
        <br>
        <div class="field-checkbox">
            <Checkbox inputId="cookies_and_other_site_data" name="Çerezler ve diğer site verileri" value="cookies_and_other_site_data" v-model="cookiesAndOtherSiteData" />
            <label for="cookies_and_other_site_data">Çerezler ve diğer site verileri</label>
        </div>
        <br>
        <div class="field-checkbox">
            <Checkbox inputId="cached_images_and_files" name="Önbelleğe alınan resimler ve dosyalar" value="cached_images_and_files" v-model="cachedImagesAndFiles" />
            <label for="cached_images_and_files">Önbelleğe alınan resimler ve dosyalar</label>
        </div>
        <br>
        <div class="field-checkbox">
            <Checkbox inputId="password_signin" name="Şifreler ve diğer oturum açma verileri" value="password_signin" v-model="passwordSignin" />
            <label for="password_signin">Şifreler ve diğer oturum açma verileri</label>
        </div>
        <br>
        <div class="field-checkbox">
            <Checkbox inputId="autofill" name="Formu otomatik doldurma verileri" value="autofill" v-model="autofill" />
            <label for="autofill">Formu otomatik doldurma verileri</label>
        </div>
        
    </div>

</template>

<script>
import  PreferencesChrome  from './PreferencesChrome.js';
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

            DnsOverHttpsMode:"",
            HttpsOnlyMode:"",
            AllowDeletingBrowserHistory:false,
            DefaultCookiesSetting:"1",
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
            let prefList = this.selectedProfileData.preferences;
            prefList.forEach(element => {
                if (element.preferenceName == PreferencesChrome.DnsOverHttpsMode && element.value == "true") {
                    this.dontWantToBeTracked = element.value;
                }
                if (element.preferenceName == PreferencesChrome.HttpsOnlyMode && element.value == "true") {
                    this.dontWantToBeTracked = element.value;
                }
                if (element.preferenceName == PreferencesChrome.AllowDeletingBrowserHistory && element.value == "true") {
                    this.dontWantToBeTracked = element.value;
                }
                if (element.preferenceName == PreferencesChrome.DefaultCookiesSetting && element.value == "true") {
                    this.dontWantToBeTracked = element.value;
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
.field-checkbox{
    position: center;
    left: 50%;
    top: 50%;
}

</style>