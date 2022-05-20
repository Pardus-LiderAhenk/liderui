<template>
    <div class="p-fluid p-formgrid">
        <h6>{{$t('policy_management.profile.privacy.being_tracked')}}</h6>
        <div class="p-field p-grid">
            <InputSwitch  class="p-col-fixed" id="dontWantToBeTracked" v-model="dontWantToBeTracked"/>
            <label for="dontWantToBeTracked" class="p-col">{{$t('policy_management.profile.privacy.tell_the_sites_that_ı_dont_want_to_be_tracked')}}</label>
        </div>
        <h6>{{$t('policy_management.profile.privacy.history')}}</h6>
        <div class="p-field p-grid">
            <InputSwitch  class="p-col-fixed" id="rememberBrowsingDownloadHistory" v-model="rememberBrowsingDownloadHistory"/>
            <label for="rememberBrowsingDownloadHistory" class="p-col">{{$t('policy_management.profile.privacy.remember_browsing_and_download_history')}}</label>
        </div>
        <div class="p-field p-grid">
            <InputSwitch  class="p-col-fixed" id="rememberSearchFormHistory" v-model="rememberSearchFormHistory"/>
            <label for="rememberSearchFormHistory" class="p-col">{{$t('policy_management.profile.privacy.remember_search_and_form_history')}}</label>
        </div>
        <div class="p-field p-grid">
            <InputSwitch  class="p-col-fixed" id="acceptCookiesFromSites" v-model="acceptCookiesFromSites"/>
            <label for="acceptCookiesFromSites" class="p-col">{{$t('policy_management.profile.privacy.accept_cookies')}}</label>
        </div>
        <div class="p-fluid p-formgrid p-grid">
            <div class="p-field p-col-12 p-md-4">
                <label>{{$t('policy_management.profile.privacy.accept_third_party_cookies')}}</label>
                <Dropdown :disabled="!acceptCookiesFromSites"
                    v-model="acceptThirdPartyCookies"
                    :options="[{name: $t('policy_management.profile.privacy.always'), value:'0'},
                            {name: $t('policy_management.profile.privacy.from_those_visited'), value: '1'},
                            {name: $t('policy_management.profile.privacy.never'), value: '2'}]"
                    optionLabel="name" optionValue="value"
                >
                </Dropdown>
            </div>
            <div class="p-field p-col-12 p-md-4">
                <label>{{$t('policy_management.profile.privacy.keep_it_until_that_time')}}</label>
                <Dropdown :disabled="!acceptCookiesFromSites"
                    v-model="keepCookiesUntil"
                    :options="[{name: $t('policy_management.profile.privacy.keep_it_until_it_expires'), value:'0'},
                            {name: $t('policy_management.profile.privacy.when_firefox_closed'), value: '2'}]"
                    optionLabel="name" optionValue="value"
                >
                </Dropdown>
            </div>
        </div>
        <div class="p-field p-grid">
            <InputSwitch  class="p-col-fixed" id="clearHistoryOnClose" v-model="clearHistoryOnClose"/>
            <label for="clearHistoryOnClose" class="p-col">{{$t('policy_management.profile.privacy.clear_history_when_firefox_is_closed')}}</label>
        </div>
        <h6>{{$t('policy_management.profile.privacy.address_bar')}}</h6>
        <div class="p-fluid p-formgrid p-grid">
            <div class="p-field p-grid p-col-12 p-md-3">
                <InputSwitch class="p-col-fixed" id="suggestHistory" v-model="suggestHistory"/>
                <label for="suggestHistory" class="p-col">{{$t('policy_management.profile.privacy.history')}}</label>
            </div>
            <div class="p-field p-grid p-col-12 p-md-3">
                <InputSwitch  class="p-col-fixed" id="suggestBookmarks" v-model="suggestBookmarks"/>
                <label for="suggestBookmarks" class="p-col">{{$t('policy_management.profile.privacy.bookmarks')}}</label>
            </div>
            <div class="p-field p-grid p-col-12 p-md-4">
                <InputSwitch  class="p-col-fixed" id="suggestOpenTabs" v-model="suggestOpenTabs"/>
                <label for="suggestOpenTabs" class="p-col">{{$t('policy_management.profile.privacy.open_tabs')}}</label>
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

    data () {
        return {
            acceptThirdPartyCookies: "2",
            dontWantToBeTracked: false,
            rememberBrowsingDownloadHistory: false,
            rememberSearchFormHistory: false,
            acceptCookiesFromSites: false,
            clearHistoryOnClose: false,
            suggestHistory: false,
            suggestBookmarks: false,
            suggestOpenTabs: false,
            keepCookiesUntil: "0",
            proxyPreferences: []
        }
    },

    mounted(){
        if (this.selectedProfileData) {
            this.setPrivacyPreferences();
        } else {
            this.acceptThirdPartyCookies = "2";
            this.dontWantToBeTracked = false;
            this.rememberBrowsingDownloadHistory = false;
            this.rememberSearchFormHistory = false;
            this.acceptCookiesFromSites = false;
            this.clearHistoryOnClose = false;
            this.suggestHistory = false;
            this.suggestBookmarks = false;
            this.suggestOpenTabs = false;
            this.keepCookiesUntil = "0";
        }
    },

    methods: {
        getPrivacyPreferences() {
            this.addToPreferences(Preferences.dontWantToBeTracked, this.dontWantToBeTracked.toString());
            this.addToPreferences(Preferences.rememberBrowsingDownloadHistory, this.rememberBrowsingDownloadHistory.toString());
            this.addToPreferences(Preferences.rememberSearchFormHistory, this.rememberSearchFormHistory.toString());
            this.addToPreferences(Preferences.acceptCookiesFromSites, this.acceptThirdPartyCookies);
            this.addToPreferences(Preferences.keepCookiesUntil, this.keepCookiesUntil);
            this.addToPreferences(Preferences.clearHistoryOnClose, this.clearHistoryOnClose.toString());
            this.addToPreferences(Preferences.suggestHistory, this.suggestHistory.toString());
            this.addToPreferences(Preferences.suggestBookmarks, this.suggestBookmarks.toString());
            this.addToPreferences(Preferences.suggestOpenTabs, this.suggestOpenTabs.toString());

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
                if (element.preferenceName == Preferences.keepCookiesUntil) {
                    this.keepCookiesUntil = element.value;
                    if (element.value != "0") {
                        this.acceptCookiesFromSites = true;
                    }
                    this.keepCookiesUntil = element.value;
                }
                if (element.preferenceName == Preferences.acceptCookiesFromSites) {
                    this.keepCookiesUntil = element.value;
                    if (element.value != "2") {
                        this.acceptCookiesFromSites = true;
                    }
                    this.acceptThirdPartyCookies = element.value;
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