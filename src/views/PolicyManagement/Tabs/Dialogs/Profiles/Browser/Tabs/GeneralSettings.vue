<template>
    <div>
        <div class="p-fluid p-formgrid">
            <h6>{{$t('policy_management.profile.browser.start')}}</h6>
            <div class="p-field p-grid">
                <InputSwitch id="checkDefaultBrowser" class="p-col-fixed" v-model="checkDefaultBrowser"/>
                <label for="checkDefaultBrowser" class="p-col">{{$t('policy_management.profile.browser.browser_settings_notify')}}</label>
            </div>
            <div class="p-field">
                <div class="p-fluid p-formgrid p-grid">
                    <div class="p-field p-col-12 p-md-6">
                        <label>{{$t('policy_management.profile.browser.when_firefox_start')}}</label>
                        <Dropdown
                            v-model="pageMode"
                            :options="[{name:$t('policy_management.profile.browser.show_homepage'), value:'1'},
                                {name: $t('policy_management.profile.browser.show_blank_page'), value:'0'},
                                {name: $t('policy_management.profile.browser.show_windows_and_tabs_from_last_time'), value: '3'}]"
                            optionLabel="name"
                            optionValue="value"
                        >
                        </Dropdown>
                    </div>
                    <div class="p-field p-col-12 p-md-6">
                        <label>{{$t('policy_management.profile.browser.homepage')}}</label>
                        <InputText class="p-inputtext-sm" type="text" v-model="homePage" placeholder="https://liderahenk.org/"/>
                    </div>
                </div>
            </div>
            <h6>{{$t('policy_management.profile.browser.downloads')}}</h6>
            <div class="p-field p-grid">
                <RadioButton value="true" v-model="useDownloadDir" id="useDownloadDir1"/>
                <label for="useDownloadDir1" class="p-col">{{$t('policy_management.profile.browser.save_files_here')}}</label>
                <InputText class="p-inputtext-sm p-col" type="text" 
                    :disabled="useDownloadDir == 'false'"
                    v-model="downloadDir" 
                    :placeholder="$t('policy_management.profile.browser.save_directory')"/>
            </div>
            <div class="p-field p-grid">
                <RadioButton id="useDownloadDir2" value="false" v-model="useDownloadDir"/>
                <label for="useDownloadDir2" class="p-col">{{$t('policy_management.profile.browser.ask_each_time_where_to_save_files')}}</label>
            </div>
            <h6>Sekmeler</h6>
            <div class="p-field p-grid">
                <InputSwitch id="openNewWindow" class="p-col-fixed" v-model="openNewWindow"/>
                <label for="openNewWindow" class="p-col">{{$t('policy_management.profile.browser.open_links_in_new_tab')}}</label>
            </div>
            <div class="p-field p-grid">
                <InputSwitch id="warnOnClose" class="p-col-fixed" v-model="warnOnClose"/>
                <label for="warnOnClose" class="p-col">{{$t('policy_management.profile.browser.multiple_tabs_warnings')}}</label>
            </div>
            <div class="p-field p-grid">
                <InputSwitch id="warnOnOpen" class="p-col-fixed" v-model="warnOnOpen"/>
                <label for="warnOnOpen" class="p-col">{{$t('policy_management.profile.browser.firefox_slowing_warning')}}</label>
            </div>
            <div class="p-field p-grid">
                <InputSwitch id="restoreOnDemand" class="p-col-fixed" v-model="restoreOnDemand"/>
                <label for="restoreOnDemand" class="p-col">{{$t('policy_management.profile.browser.loading_tabs_until_selected')}}</label>
            </div>
            <div class="p-field p-grid">
                <InputSwitch id="loadInBackground" class="p-col-fixed" v-model="loadInBackground"/>
                <label for="loadInBackground" class="p-col">{{$t('policy_management.profile.browser.when_the_new_tabs_opens_switch_to_that')}}</label>
            </div>
            <h6>{{$t('policy_management.profile.browser.plugin_installation')}}</h6>
            <div class="p-field p-grid">
                <InputSwitch id="enableXpInstall" class="p-col-fixed" v-model="enableXpInstall"/>
                <label for="enableXpInstall" class="p-col">{{$t('policy_management.profile.browser.block_plugin_installation')}}</label>
            </div>
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
    //		General preferences
            checkDefaultBrowser: false,
            homePage: "",
            pageMode: "1",
            useDownloadDir: "false",
            downloadDir: "",
            openNewWindow: false,
            warnOnClose: false,
            warnOnOpen: false,
            restoreOnDemand: false,
            loadInBackground: false,
            enableXpInstall: false,
            generalPreferences: []
        }
    },

    mounted(){
        if (this.selectedProfileData) {
            this.setGeneralPreferences();
        } else {
            this.checkDefaultBrowser = false,
            this.homePage = "";
            this.pageMode = "1";
            this.useDownloadDir = "false";
            this.downloadDir = "";
            this.openNewWindow = false;
            this.warnOnClose = false;
            this.warnOnOpen = false;
            this.restoreOnDemand = false;
            this.loadInBackground = false;
            this.enableXpInstall = false;
        }
    },

    methods: {
        getGeneralPreferences() {
            this.addToPreferences(Preferences.checkDefaultBrowser, this.checkDefaultBrowser.toString());
            this.addToPreferences(Preferences.pageMode, this.pageMode);
            if (this.homePage) {
                this.addToPreferences(Preferences.homePage, this.homePage);
            }
            if (this.useDownloadDir == "true") {
                this.addToPreferences(Preferences.useDownloadDir, "true");
                this.addToPreferences(Preferences.useCustomDownloadDir, "2");
                this.addToPreferences(Preferences.downloadDir, this.downloadDir);
            } else {
                this.addToPreferences(Preferences.useDownloadDir, "false");
                this.addToPreferences(Preferences.useCustomDownloadDir, "1");
            }
            this.openNewWindow ? this.addToPreferences(Preferences.openNewWindow, "3"): this.addToPreferences(Preferences.openNewWindow, "2");
            this.warnOnClose ? this.addToPreferences(Preferences.warnOnClose, "true") : this.addToPreferences(Preferences.warnOnClose, "false");
            this.warnOnOpen ? this.addToPreferences(Preferences.warnOnOpen, "true") : this.addToPreferences(Preferences.warnOnOpen, "false");
            this.restoreOnDemand ? this.addToPreferences(Preferences.restoreOnDemand, "true") : this.addToPreferences(Preferences.restoreOnDemand, "false");
            this.loadInBackground ? this.addToPreferences(Preferences.loadInBackground, "false") : this.addToPreferences(Preferences.loadInBackground, "true");
            this.enableXpInstall ? this.addToPreferences(Preferences.enableXpInstall, "false") : this.addToPreferences(Preferences.enableXpInstall, "true");

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
                if (element.preferenceName == Preferences.checkDefaultBrowser) {
                    if (element.value == 'true') {
                        this.checkDefaultBrowser = true;
                    }
                }
                if (element.preferenceName == Preferences.pageMode) {
                    this.pageMode = element.value;
                }
                if (element.preferenceName == Preferences.homePage) {
                    this.homePage = element.value;
                }
                if (element.preferenceName == Preferences.useDownloadDir) {
                     this.useDownloadDir = element.value;
                }
                if (element.preferenceName == Preferences.downloadDir) {
                    this.downloadDir = element.value;
                }
                if (element.preferenceName == Preferences.openNewWindow && element.value == "3") {
                    this.openNewWindow = true;
                }
                if (element.preferenceName == Preferences.warnOnClose && element.value == "true") {
                    this.warnOnClose = true;
                }
                if (element.preferenceName == Preferences.warnOnOpen && element.value == "true") {
                    this.warnOnOpen = true;
                }
                if (element.preferenceName == Preferences.loadInBackground && element.value == "false") {
                    this.loadInBackground = true;
                }
                if (element.preferenceName == Preferences.restoreOnDemand && element.value == "true") {
                    this.restoreOnDemand = true;
                }
                if (element.preferenceName == Preferences.enableXpInstall && element.value == "false") {
                    this.enableXpInstall = true;
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