<template>
    <div>
        <div class="p-fluid p-formgrid">
            <h6>{{$t('Chrome Başlangıçta')}}</h6>
            <!-- <div class="p-field p-grid">
                <InputSwitch id="" class="p-col-fixed" v-model=""/>
                <label for="" class="p-col">{{$t("Yeni sekme sayfasını aç")}}</label>
            </div>
            <div class="p-field p-grid">
                <InputSwitch id="" class="p-col-fixed" v-model=""/>
                <label for="" class="p-col">{{$t("Kaldığım yerde devam et")}}</label>
            </div> -->
            <div class="p-field p-grid" >
                <InputSwitch id="NewTabPageLocation" class="p-col-fixed"  v-model="NewTabPageLocation"/>
                <label for="NewTabPageLocation" class="p-col">{{$t("Belirli bi sayfayı aç")}}</label>

                <InputText class="p-inputtext-sm p-col" type="text" 
                    :disabled="NewTabPageLocation == 'false'"
                    v-model="NewTabPageLocation" 
                    :placeholder="$t('https://www.google.com')"/>
            </div>

            <h6>{{$t('Görünüm')}}</h6>
            <div class="p-field">
                <InputSwitch id="ShowHomeButton" class="p-col-fixed" v-model="ShowHomeButton"/>
                <label for="ShowHomeButton" class="p-col">{{$t("Anasayfa butonunu göster ")}}</label>
            </div>
            <div class="p-field p-grid" v-if="ShowHomeButton == true">
                <InputSwitch id="HomepageIsNewTabPage" class="p-col-fixed" v-model="HomepageIsNewTabPage"/>
                <label for="HomepageIsNewTabPage" class="p-col">{{$t("Yeni sekme sayfasını aç")}}</label>
            </div>
            <div class="p-field p-grid" v-if="ShowHomeButton == true" >
                <InputSwitch id="HomepageLocation" class="p-col-fixed" v-model="HomepageLocation"/>
                <label for="HomepageLocation" class="p-col">{{$t("Belirli bi sayfayı aç")}}</label>

                <InputText class="p-inputtext-sm p-col" type="text" 
                    :disabled="useDownloadDir == 'false'"
                    v-model="downloadDir" 
                    :placeholder="$t('liderahenk.com')"/>
            </div>

            <h6>{{$t('indirilenler')}}</h6>
            <div class="p-field p-grid">
                <RadioButton value="true" v-model="DefaultDownloadDirectory" id="DefaultDownloadDirectory"/>
                <label for="DefaultDownloadDirectory" class="p-col">{{$t('policy_management.profile.browser.save_files_here')}}</label>
                <InputText class="p-inputtext-sm p-col" type="text" 
                    :disabled="useDownloadDir == 'false'"
                    v-model="downloadDir" 
                    :placeholder="$t('/home/${user_name}/Downloads')"/>
            </div>
            <div class="p-field p-grid">
                <RadioButton id="PromptForDownloadLocation" value="false" v-model="PromptForDownloadLocation"/>
                <label for="PromptForDownloadLocation" class="p-col">{{$t('İndirmeden önce her dosyanın nereye kaydedileceğini sor')}}</label>
            </div>

            <h6>Sekmeler</h6>
            <div class="p-field p-grid">
                <InputSwitch id="BrowserSignin" class="p-col-fixed" v-model="BrowserSignin"/>
                <label for="BrowserSignin" class="p-col">{{$t('Chrome da oturum açmaya izin ver')}}</label>
            </div>
            <div class="p-field p-grid">
                <InputSwitch id="AutoFillEnabled" class="p-col-fixed" v-model="AutoFillEnabled"/>
                <label for="AutoFillEnabled" class="p-col">{{$t('Aramaları ve URL leri otomatik tamamla')}}</label>
            </div>
            <div class="p-field p-grid">
                <InputSwitch id="SafeBrowsingEnabled" class="p-col-fixed" v-model="SafeBrowsingEnabled"/>
                <label for="SafeBrowsingEnabled" class="p-col">{{$t('Aramaları ve göz atmayı daha iyi yap')}}</label>
            </div>
            <div class="p-field p-grid">
                <InputSwitch id="AllowSystemNotifications" class="p-col-fixed" v-model="AllowSystemNotifications"/>
                <label for="AllowSystemNotifications" class="p-col">{{$t('Goggle Chrome un sistem bildirimlerini kullanmasına izin ver')}}</label>
            </div>
            <div class="p-field p-grid">
                <InputSwitch id="IncognitoModeAvailability" class="p-col-fixed" v-model="IncognitoModeAvailability"/>
                <label for="IncognitoModeAvailability" class="p-col">{{$t('Gizli mod kullanmasına izin ver')}}</label>
            </div>
            
        </div>
    </div>
</template>

<script>

import PreferencesChrome from './PreferencesChrome'

export default {

    props: {
        selectedProfileData: {
            type: Object,
            description: "Selected profile data",
        },
    },

    data() {
        return {
    //		General preferences
            NewTabPageLocation : "",
            HomepageIsNewTabPage : false,
            ShowHomeButton : false,
            HomepageLocation : "",
            DefaultDownloadDirectory:"",
            PromptForDownloadLocation: false,
            SideSearchEnabled:"",
            BookmarkBarEnabled: false,
            IncognitoModeAvailability: "1",
            BrowserSignin:false,
            AutoFillEnabled:false,
            SafeBrowsingEnabled:false,
            AllowSystemNotifications:false,
            generalPreferences: []
        }
    },

    mounted(){
        if (this.selectedProfileData) {
            this.setGeneralPreferences();
        } else {
            this.NewTabPageLocation = "",
            this.HomepageIsNewTabPage = false,
            this.ShowHomeButton = false,
            this.HomepageLocation = "";
            this.DefaultDownloadDirectory = "";
            this.PromptForDownloadLocation = false;
            this.SideSearchEnabled = "";
            this.BookmarkBarEnabled = false;
            this.IncognitoModeAvailability = "1";
            this.BrowserSignin=false;
            this.AutoFillEnabled=false;
            this.SafeBrowsingEnabled=false;
            this.AllowSystemNotifications=false;
        }
    },

    methods: {
        getGeneralPreferences() {

            if (this.ShowHomeButton == "true") {
                this.addToPreferences(PreferencesChrome.HomepageIsNewTabPage, "true");
                this.addToPreferences(PreferencesChrome.HomepageLocation, "");
            } else {
                this.addToPreferences(PreferencesChrome.HomepageLocation, "false");
                this.addToPreferences(PreferencesChrome.HomepageIsNewTabPage, "");
            }
            this.SideSearchEnabled ? this.addToPreferences(PreferencesChrome.SideSearchEnabled, "true") : this.addToPreferences(PreferencesChrome.SideSearchEnabled, "false");
            this.BookmarkBarEnabled ? this.addToPreferences(PreferencesChrome.BookmarkBarEnabled, "true") : this.addToPreferences(PreferencesChrome.BookmarkBarEnabled, "false");
            this.IncognitoModeAvailability ? this.addToPreferences(PreferencesChrome.IncognitoModeAvailability, "true") : this.addToPreferences(PreferencesChrome.IncognitoModeAvailability, "false");
            this.BrowserSignin ? this.addToPreferences(PreferencesChrome.BrowserSignin, "true") : this.addToPreferences(PreferencesChrome.BrowserSignin, "false");
            this.AutoFillEnabled ? this.addToPreferences(PreferencesChrome.AutoFillEnabled, "true") : this.addToPreferences(PreferencesChrome.AutoFillEnabled, "false");
            this.SafeBrowsingEnabled ? this.addToPreferences(PreferencesChrome.SafeBrowsingEnabled, "false") : this.addToPreferences(PreferencesChrome.SafeBrowsingEnabled, "true");
            this.AllowSystemNotifications ? this.addToPreferences(PreferencesChrome.AllowSystemNotifications, "false") : this.addToPreferences(PreferencesChrome.AllowSystemNotifications, "true");

            return this.generalPreferences;
        },

        addToPreferences(name, value) {
            this.generalPreferences.push({
                "preferenceName" : name,
			    "value" : value
            });
        },

        setGeneralPreferences() {
            let prefList = this.selectedProfileData.preferences;
            prefList.forEach(element => {
    
                if (element.preferenceName == PreferencesChrome.IncognitoModeAvailability && element.value == "true") {
                    this.IncognitoModeAvailability = true;
                }
                if (element.preferenceName == PreferencesChrome.SideSearchEnabled && element.value == "true") {
                    this.SideSearchEnabled = true;
                }
                if (element.preferenceName == PreferencesChrome.IncognitoModeAvailability && element.value == "true") {
                    this.IncognitoModeAvailability = true;
                }
                if (element.preferenceName == PreferencesChrome.BrowserSignin && element.value == "true") {
                    this.BrowserSignin = true;
                }
                if (element.preferenceName == PreferencesChrome.AutoFillEnabled && element.value == "false") {
                    this.AutoFillEnabled = true;
                }
                if (element.preferenceName == PreferencesChrome.SafeBrowsingEnabled && element.value == "true") {
                    this.SafeBrowsingEnabled = true;
                }
                if (element.preferenceName == PreferencesChrome.AllowSystemNotifications && element.value == "false") {
                    this.AllowSystemNotifications = true;
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