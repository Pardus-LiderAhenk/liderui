<template>
    <div>
        <div class="p-fluid p-formgrid">
            <h6>{{$t('policy_management.profile.chrome_browser.start')}}</h6>
            <div class="p-field p-grid" >
                <label for="NewTabPageLocation" class="p-col">{{$t("policy_management.profile.chrome_browser.new_tab_page_location")}}</label>

                <InputText class="p-inputtext-sm p-col" type="text" 
                    v-model="NewTabPageLocation" 
                    :placeholder="$t('https://www.google.com')"/>
            </div>
            <h6>{{$t('policy_management.profile.chrome_browser.appearance')}}</h6>
            <div class="p-field p-grid">
                <InputSwitch id="ShowHomeButton" class="p-col-fixed" v-model="ShowHomeButton"/>
                <label for="ShowHomeButton" class="p-col">{{$t("policy_management.profile.chrome_browser.show_homepage")}}</label>
            </div>
            <div class="p-field p-grid" v-if="ShowHomeButton == true">
                <RadioButton value="true" v-model="HomepageIsNewTabPage"/>
                <label class="p-col">{{$t("policy_management.profile.chrome_browser.new_tab_page_open")}}</label>
            </div>
            <div class="p-field p-grid" v-if="ShowHomeButton == true">
                <RadioButton value="false" v-model="HomepageIsNewTabPage"/>
                <label class="p-col">{{$t("policy_management.profile.chrome_browser.open_specific_page")}}</label>

                <InputText class="p-inputtext-sm p-col" type="text" 
                    :disabled="HomepageIsNewTabPage == 'true'"
                    v-model="HomepageLocationString" 
                    :placeholder="$t('https://liderahenk.org/')"/>
            </div>



            <!-- <div class="p-field p-grid" v-if="ShowHomeButton == true">
                <InputSwitch id="HomepageIsNewTabPage" class="p-col-fixed" v-model="HomepageIsNewTabPage"/>
                <label for="HomepageIsNewTabPage" class="p-col">{{$t("policy_management.profile.chrome_browser.new_tab_page_open")}}</label>
            </div>
            <div class="p-field p-grid" v-if="ShowHomeButton == true" >
                <InputSwitch id="HomepageLocation" class="p-col-fixed" v-model="HomepageLocation"/>
                <label for="HomepageLocation" class="p-col">{{$t("policy_management.profile.chrome_browser.open_specific_page")}}</label>

                <InputText class="p-inputtext-sm p-col" type="text" 
                    :disabled="useDownloadDir == 'false'"
                    v-model="downloadDir" 
                    :placeholder="$t('https://liderahenk.org/')"/>
            </div> -->
            <h6>{{$t('policy_management.profile.chrome_browser.downloads')}}</h6>
            <div class="p-field p-grid">
                <RadioButton value="true" v-model="DefaultDownloadDirectory" id="DefaultDownloadDirectory"/>
                <label for="DefaultDownloadDirectory" class="p-col">{{$t('policy_management.profile.chrome_browser.save_files_here')}}</label>
                <InputText class="p-inputtext-sm p-col" type="text" 
                    :disabled="DefaultDownloadDirectory == 'false'"
                    v-model="downloadDir" 
                    :placeholder="$t('policy_management.profile.chrome_browser.save_directory')"/>
            </div>
            <div class="p-field p-grid">
                <RadioButton id="PromptForDownloadLocation" value="false" v-model="DefaultDownloadDirectory"/>
                <label for="PromptForDownloadLocation" class="p-col">{{$t('policy_management.profile.chrome_browser.ask_each_time_where_to_save_files')}}</label>
            </div>
            <h6>{{$t('policy_management.profile.chrome_browser.tabs')}}</h6>
            <div class="p-field p-grid">
                <InputSwitch id="BrowserSignin" class="p-col-fixed" v-model="BrowserSignin"/>
                <label for="BrowserSignin" class="p-col">{{$t('policy_management.profile.chrome_browser.allow_sign_chrome')}}</label>
            </div>
            <div class="p-field p-grid">
                <InputSwitch id="AutoFillEnabled" class="p-col-fixed" v-model="AutoFillEnabled"/>
                <label for="AutoFillEnabled" class="p-col">{{$t('policy_management.profile.chrome_browser.auto_fill_search')}}</label>
            </div>
            <div class="p-field p-grid">
                <InputSwitch id="SafeBrowsingEnabled" class="p-col-fixed" v-model="SafeBrowsingEnabled"/>
                <label for="SafeBrowsingEnabled" class="p-col">{{$t('policy_management.profile.chrome_browser.make_seach_browsing_better')}}</label>
            </div>
            <div class="p-field p-grid">
                <InputSwitch id="AllowSystemNotifications" class="p-col-fixed" v-model="AllowSystemNotifications"/>
                <label for="AllowSystemNotifications" class="p-col">{{$t('policy_management.profile.chrome_browser.allow_chrome_use_system_notification')}}</label>
            </div>
            <div class="p-field p-grid">
                <InputSwitch id="IncognitoModeAvailability" class="p-col-fixed" v-model="IncognitoModeAvailability"/>
                <label for="IncognitoModeAvailability" class="p-col">{{$t('policy_management.profile.chrome_browser.accept_incognita_mode')}}</label>
            </div>
            
            <h6>{{$t('policy_management.profile.chrome_browser.extension_install')}}</h6>
            <div class="p-field p-grid">
                <InputSwitch id="BlockExternalExtensions" class="p-col-fixed" v-model="BlockExternalExtensions"/>
                <label for="BlockExternalExtensions" class="p-col">{{$t("policy_management.profile.chrome_browser.extension_block")}}</label>
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
            NewTabPageLocation : "",
            HomepageIsNewTabPage : "true",
            ShowHomeButton : false,
            HomepageLocation : false,
            DefaultDownloadDirectory:"true",
            PromptForDownloadLocation: false,
            SideSearchEnabled: false,
            BookmarkBarEnabled: false,
            IncognitoModeAvailability: false, 
            BrowserSignin: false, 
            AutoFillEnabled:false,
            SafeBrowsingEnabled:false,
            AllowSystemNotifications:false,
            BlockExternalExtensions: false,
            generalPreferences: [],
            downloadDir: "",
            HomepageLocationString: ""
        }
    },

    mounted(){
        if (this.selectedProfileData) {
            this.setGeneralPreferences();
        } else {
            this.NewTabPageLocation = "",
            this.HomepageIsNewTabPage = false,
            this.ShowHomeButton = false,
            this.HomepageLocation = false;
            this.DefaultDownloadDirectory = "true";
            this.PromptForDownloadLocation = false;
            this.SideSearchEnabled = false;
            this.BookmarkBarEnabled = false;
            this.IncognitoModeAvailability = false;
            this.BrowserSignin= false;
            this.AutoFillEnabled=false;
            this.SafeBrowsingEnabled=false;
            this.AllowSystemNotifications=false;
            this.BlockExternalExtensions=false;

        }
    },

    methods: {
        getGeneralPreferences() {
            if(this.NewTabPageLocation){
                this.addToPreferences(PreferencesChrome.NewTabPageLocation,this.NewTabPageLocation);
            }
            if (this.ShowHomeButton) {
                this.addToPreferences(PreferencesChrome.ShowHomeButton, "true");
                if (this.HomepageIsNewTabPage == "true") {
                    this.addToPreferences(PreferencesChrome.HomepageIsNewTabPage, "true");
                } else {
                    this.addToPreferences(PreferencesChrome.HomepageLocation, this.HomepageLocationString);
                } 
            } else {
                this.addToPreferences(PreferencesChrome.ShowHomeButton, "false");
            }
            
            if (this.DefaultDownloadDirectory == "true") {
                this.addToPreferences(PreferencesChrome.DefaultDownloadDirectory, this.downloadDir);
            } else {
                this.addToPreferences(PreferencesChrome.PromptForDownloadLocation, "true");
            }

            this.SideSearchEnabled ? this.addToPreferences(PreferencesChrome.SideSearchEnabled, "true") : this.addToPreferences(PreferencesChrome.SideSearchEnabled, "false");
            this.BookmarkBarEnabled ? this.addToPreferences(PreferencesChrome.BookmarkBarEnabled, "true") : this.addToPreferences(PreferencesChrome.BookmarkBarEnabled, "false");
            this.IncognitoModeAvailability ? this.addToPreferences(PreferencesChrome.IncognitoModeAvailability, parseInt(1)) : this.addToPreferences(PreferencesChrome.IncognitoModeAvailability, parseInt(0));
            this.BrowserSignin ? this.addToPreferences(PreferencesChrome.BrowserSignin, parseInt(1)) : this.addToPreferences(PreferencesChrome.BrowserSignin, parseInt(0));
            this.AutoFillEnabled ? this.addToPreferences(PreferencesChrome.AutoFillEnabled, "true") : this.addToPreferences(PreferencesChrome.AutoFillEnabled, "false");
            this.SafeBrowsingEnabled ? this.addToPreferences(PreferencesChrome.SafeBrowsingEnabled, "true") : this.addToPreferences(PreferencesChrome.SafeBrowsingEnabled, "false");
            this.AllowSystemNotifications ? this.addToPreferences(PreferencesChrome.AllowSystemNotifications, "true") : this.addToPreferences(PreferencesChrome.AllowSystemNotifications, "false");
            this.BlockExternalExtensions ? this.addToPreferences(PreferencesChrome.BlockExternalExtensions, "true") : this.addToPreferences(PreferencesChrome.BlockExternalExtensions, "false");

            return this.generalPreferences;
        },

        addToPreferences(name, value) {
            this.generalPreferences.push({
                "preferenceName" : name,
			    "value" : value
            });
        },

        setGeneralPreferences() {
            let prefList = this.selectedProfileData.preferencesChrome;
            prefList.forEach(element => {

                if (element.preferenceName == PreferencesChrome.NewTabPageLocation) {
                    this.NewTabPageLocation = element.value;
                }

                if (element.preferenceName == PreferencesChrome.HomepageIsNewTabPage) {
                    this.HomepageIsNewTabPage = element.value;
                }
                
                if (element.preferenceName == PreferencesChrome.ShowHomeButton && element.value == "true") {
                    this.ShowHomeButton = true;
                }

                if (element.preferenceName == PreferencesChrome.HomepageLocation) {
                    this.HomepageIsNewTabPage = "false";
                    this.HomepageLocationString = element.value;
                }

                if (element.preferenceName == PreferencesChrome.DefaultDownloadDirectory) {
                    this.DefaultDownloadDirectory = element.value;
                }
    
                if (element.preferenceName == PreferencesChrome.PromptForDownloadLocation ) {
                    this.PromptForDownloadLocation = element.value;
                }
                if (element.preferenceName == PreferencesChrome.SideSearchEnabled && element.value == "true") {
                    this.SideSearchEnabled = true;
                }

                if (element.preferenceName == PreferencesChrome.BookmarkBarEnabled && element.value == "true") {
                    this.BookmarkBarEnabled = true;
                }

                if (element.preferenceName == PreferencesChrome.IncognitoModeAvailability && element.value == 1) {
                    this.IncognitoModeAvailability = true;
                }
                if (element.preferenceName == PreferencesChrome.BrowserSignin && element.value == 1) {
                    this.BrowserSignin = true;
                }
                if (element.preferenceName == PreferencesChrome.AutoFillEnabled && element.value == "true") {
                    this.AutoFillEnabled = true;
                }
                if (element.preferenceName == PreferencesChrome.SafeBrowsingEnabled && element.value == "true") {
                    this.SafeBrowsingEnabled = true;
                }
                if (element.preferenceName == PreferencesChrome.AllowSystemNotifications && element.value == "true") {
                    this.AllowSystemNotifications = true;
                }
                if (element.preferenceName == PreferencesChrome.BlockExternalExtensions && element.value == "true") {
                    this.BlockExternalExtensions = true;
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