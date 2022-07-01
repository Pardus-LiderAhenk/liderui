<template>
    <div>
        <Dialog :header="pluginProfile.name" 
            v-model:visible="showDialog"
            :style="{width: '50vw'}" :modal="true">
            <base-profile :pluginProfile="pluginProfile" ref="profile"
                @add-profile="addProfile"
                @save-profile="saveProfile"
                @edit-profile="editProfile"
                @update-profile="updateProfile">
                <template #default>
                    <TabView>
                        <TabPanel>
                            <template #header>
                                <i class="pi pi-home"></i>
                                <span>&nbsp;{{$t('policy_management.profile.browser.general_settings')}}</span>
                            </template>
                            <general-settings :selectedProfileData="selectedProfileData" ref="generalSettings"></general-settings>
                        </TabPanel>
                        <TabPanel>
                            <template #header>
                                <i class="pi pi-globe"></i>
                                <span>&nbsp;{{$t('policy_management.profile.browser.proxy_settings')}}</span>
                            </template>
                            <proxy-settings :selectedProfileData="selectedProfileData" ref="proxySettings"></proxy-settings>
                        </TabPanel>
                        <TabPanel>
                            <template #header>
                                <i class="pi pi-lock"></i>
                                <span>&nbsp;{{$t('policy_management.profile.browser.privacy_settings')}}</span>
                            </template>
                            <privacy-settings :selectedProfileData="selectedProfileData" ref="privacySettings"></privacy-settings>
                        </TabPanel>
                        <TabPanel>
                            <template #header>
                                <i class="pi pi-cog"></i>
                                <span>&nbsp;{{$t('policy_management.profile.browser.other_settings')}}</span>
                            </template>
                            <other-settings :selectedProfileData="selectedProfileData" ref="otherSettings"></other-settings>
                        </TabPanel>
                    </TabView>
                </template>
            </base-profile>
            <template #footer>
                <Button :label="$t('policy_management.cancel')" icon="pi pi-times" 
                    @click="showDialog = false" class="p-button-text p-button-sm"
                />
            </template>
        </Dialog>
    </div>
</template>

<script>
/**
 * Firefox browser profile dialog
 * @see {@link http://www.liderahenk.org/}
* emits this event
* @event closePolicyDialog
*/

import BaseProfile from '../Component/BaseProfile.vue';
import GeneralSettings from './Tabs/GeneralSettings.vue';
import OtherSettings from './Tabs/OtherSettings.vue';
import PrivacySettings from './Tabs/PrivacySettings.vue';
import ProxySettings from './Tabs/ProxySettings.vue';

export default {
    props: {
        browserProfileDialog: {
            type: Boolean,
            default: false,
        },
        pluginProfile: {
            type: Object,
            description: "Plugin task object",
        },
    },

    components:{
        BaseProfile,
        GeneralSettings,
        OtherSettings,
        PrivacySettings,
        ProxySettings
    },

    data(){
        return {
            profileData: null,
            selectedProfileData: null
        }
    },

    computed: {
        showDialog: {
            get () {
                return this.browserProfileDialog;
            },

            set (value) {
                if (!value) {
                    this.selectedProfileData = null;
                    this.$emit('closeProfileDialog');
                }
            }
        },
    },

    methods: {

        addProfile() {
            this.selectedProfileData = null;
        },

        saveProfile() {
            this.getProfileData();
            this.$refs.profile.saveProfile(this.profileData);
        },

        editProfile(data) {
            if (data) {
                this.selectedProfileData = data.profileData;
            }
        },

        updateProfile() {
            this.getProfileData();
            this.$refs.profile.updateProfile(this.profileData);
            this.selectedProfileData = null;

        },

        getProfileData() {
            let preferencesList = [];
            let generalPreferences = this.$refs.generalSettings.getGeneralPreferences();
            generalPreferences.forEach(element => {
                preferencesList.push(element);
            });

            let proxyPreferences = this.$refs.proxySettings.getProxyPreferences();
            proxyPreferences.forEach(element => {
                preferencesList.push(element);
            });

            let privacyPreferences = this.$refs.privacySettings.getPrivacyPreferences();
            privacyPreferences.forEach(element => {
                preferencesList.push(element);
            });

            let otherPreferences = this.$refs.otherSettings.getOtherPreferences();
            otherPreferences.forEach(element => {
                preferencesList.push(element);
            });

            this.profileData = {
                "preferences": preferencesList
            }
        },
    },
}

</script>

<style lang="scss" scoped>
</style>