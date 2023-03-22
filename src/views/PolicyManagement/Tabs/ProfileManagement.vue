<template>
    <div class="p-grid profile-management">
        <div class="p-col-12 p-md-6 p-lg-12">
            <Card>
                <template #title>
                    {{$t('policy_management.profile_management')}}
                </template>
                <template #content>
                    <p>
                       {{$t('policy_management.profile.explanation')}}
                    </p>
                </template>
            </Card>
        </div>
        <div class="p-col-12 p-md-6 p-lg-12">
            <Card>
                <template #title>
                    {{$t('policy_management.profile_list')}}
                </template>
                <template #content>
                    <DataView :value="plugins" layout="grid" :rows="10" :filters="filters">
                        <!-- <template #header>
                            <div class="grid grid-nogutter">
                                <div class="col-6" style="text-align: right">
                                    <span class="p-input-icon-left">
                                        <i class="pi pi-search"/>
                                        <InputText v-model="filters['global'].value" 
                                            class="p-inputtext-sm" 
                                            :placeholder="$t('policy_management.search')"
                                        />
                                    </span>
                                </div>
                            </div>
                        </template> -->
                        <template #empty>
                                Not found profile
                            </template>
                        <template #grid="slotProps">
                            <div class="p-col-12 p-md-3">
                                <div class="product-grid-item card" @click="showProfile(slotProps.data)">
                                    <div class="product-grid-item-content">
                                        <img :src="slotProps.data.image" :alt="slotProps.data.name"
                                        style="width: 30%"/>
                                        <div class="plugin-name">{{slotProps.data.name}}</div>
                                        <div class="plugin-description">{{slotProps.data.description}}</div>
                                    </div>
                                    <div class="p-d-flex p-jc-end">
                                        <!-- <Button icon="pi pi-pencil" class="p-button-sm" :label="$t('policy_management.edit')"
                                            @click.prevent="showProfile(slotProps.data)">
                                        </Button> -->
                                    </div>
                                </div>
                            </div>
                        </template>
                    </DataView>
                </template>
            </Card>
        </div>
        <!-- Profile Dialogs START -->
        <conky-profile-dialog v-if="modals.conkyProfileDialog" 
            :conkyProfileDialog="modals.conkyProfileDialog"
            @close-profile-dialog="modals.conkyProfileDialog=false;"
            :pluginProfile="selectedProfile">
        </conky-profile-dialog>
        <script-profile-dialog v-if="modals.scriptProfileDialog" 
            :scriptProfileDialog="modals.scriptProfileDialog"
            @close-profile-dialog="modals.scriptProfileDialog=false;"
            :pluginProfile="selectedProfile">
        </script-profile-dialog>
        <login-manager-profile-dialog v-if="modals.loginManagerProfileDialog" 
            :loginManagerProfileDialog="modals.loginManagerProfileDialog"
            @close-profile-dialog="modals.loginManagerProfileDialog=false;"
            :pluginProfile="selectedProfile">
        </login-manager-profile-dialog>
        <usb-profile-dialog v-if="modals.usbProfileDialog" 
            :usbProfileDialog="modals.usbProfileDialog"
            @close-profile-dialog="modals.usbProfileDialog=false;"
            :pluginProfile="selectedProfile">
        </usb-profile-dialog>
        <browser-profile-dialog v-if="modals.browserProfileDialog" 
            :browserProfileDialog="modals.browserProfileDialog"
            @close-profile-dialog="modals.browserProfileDialog=false;"
            :pluginProfile="selectedProfile">
        </browser-profile-dialog>
        <rsyslog-profile-dialog v-if="modals.rsyslogProfileDialog" 
            :rsyslogProfileDialog="modals.rsyslogProfileDialog"
            @close-profile-dialog="modals.rsyslogProfileDialog=false;"
            :pluginProfile="selectedProfile">
        </rsyslog-profile-dialog>
        <browser-chrome-profile-dialog v-if="modals.browserChromeProfileDialog" 
        :browserChromeProfileDialog="modals.browserChromeProfileDialog"
        @close-profile-dialog="modals.browserChromeProfileDialog=false;"
        :pluginProfile="selectedProfile">
        </browser-chrome-profile-dialog>
        <!-- Profile Dialogs END -->
	</div>
</template>

<script>
import {FilterMatchMode} from 'primevue/api';
import ConkyProfileDialog from './Dialogs/Profiles/ConkyProfileDialog.vue';
import ScriptProfileDialog from './Dialogs/Profiles/ScriptProfileDialog.vue';
import LoginManagerProfileDialog from './Dialogs/Profiles/LoginManagerProfileDialog.vue';
import UsbProfileDialog from './Dialogs/Profiles/UsbProfileDialog.vue';
import BrowserProfileDialog from './Dialogs/Profiles/Browser/BrowserProfileDialog.vue';
import RsyslogProfileDialog from './Dialogs/Profiles/RsyslogProfileDialog.vue';
import { taskService } from "../../../services/Task/TaskService.js";
import BrowserChromeProfileDialog from './Dialogs/Profiles/BrowserChrome/BrowserChromeProfileDialog.vue';

export default {
    data() {
        return {
            plugins: null,
            modals:{
                conkyProfileDialog: false,
                scriptProfileDialog: false,
                browserProfileDialog: false,
                loginManagerProfileDialog: false,
                rsyslogProfileDialog: false,
                usbProfileDialog: false,
                browserChromeProfileDialog: false
            },
            selectedProfile: null,
            profileImage: require("@/assets/images/icons/pardus.png"),
            filters: {
                'global': {value: null, matchMode: FilterMatchMode.CONTAINS}
            },
        }
    },

    components: {
        ConkyProfileDialog,
        ScriptProfileDialog,
        LoginManagerProfileDialog,
        UsbProfileDialog,
        BrowserProfileDialog,
        RsyslogProfileDialog,
        BrowserChromeProfileDialog
        
    },

    mounted() {
        
        this.pluginProfileList();
            
    },

    methods: {
        showProfile(profile) {
            this.selectedProfile = profile;
            if (profile.page == "conky-profile") {
                this.modals.conkyProfileDialog = true;
            }
            if (profile.page == "execute-script-profile") {
                this.modals.scriptProfileDialog = true;
            }
            if (profile.page == "browser-profile") {
                this.modals.browserProfileDialog = true;
            }
            if (profile.page == "login-manager-profile") {
                this.modals.loginManagerProfileDialog = true;
            }
            if (profile.page == "rsyslog-profile") {
                this.modals.rsyslogProfileDialog = true;
            }
            if (profile.page == "usb-profile") {
                this.modals.usbProfileDialog = true;
            }
            if (profile.page == "browser-chrome-profile") {
                this.modals.browserChromeProfileDialog = true;
            }
        },

        addImagePath() {
            for (let index = 0; index < this.plugins.length; index++) {
                const element = this.plugins[index];
                if (element.page == "execute-script-profile") {
                    element.image = require("@/assets/images/icons/script_icon.png");
                } else if (element.page == "conky-profile") {
                    element.image = require("@/assets/images/icons/conky_icon.png");
                } else if (element.page == "browser-profile") {
                    element.image = require("@/assets/images/icons/firefox_icon.png");
                } else if (element.page == "login-manager-profile") {
                    element.image = require("@/assets/images/icons/session_management_icon.png");
                } else if (element.page == "rsyslog-profile") {
                    element.image = require("@/assets/images/icons/rsyslog_icon.png");
                } else if (element.page == "usb-profile") {
                    element.image = require("@/assets/images/icons/usb_icon.png");
                } else {
                    element.image = require("@/assets/images/icons/chrome_icon.png");
                }
            }
        },
        async pluginProfileList(){
            const{response,error} = await taskService.pluginProfileList();
            if(error){
                this.$toast.add({
                    severity:'error', 
                    detail: this.$t('policy_management.error_get_plugin_profile_list'), 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
            }
            else{
                if(response.status == 200){
                    if (response.data) {
                        this.plugins = response.data;
                        this.addImagePath();
                    } 
                }
                else if(response.status == 417){
                    this.$toast.add({
                        severity:'error', 
                        detail: this.$t('policy_management.error_417_get_plugin_profile_list'), 
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000
                    });
                }
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.card {
    background: #ffffff;
    padding: 2rem;
    // box-shadow: 0 2px 1px -1px rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 1px 3px 0 rgba(0,0,0,.12);
    border-radius: 4px;
    margin-bottom: 2rem;
}

.card:hover {
  box-shadow: 0 8px 20px 0 rgba(155, 150, 150, 0.5);
  cursor: pointer;
} 

.plugin-name {
	font-size: 1.5rem;
	font-weight: 700;
}

.plugin-description {
	margin: 0 0 1rem 0;
}

::v-deep(.product-grid-item) {
	margin: .5rem;
	border: 1px solid var(--surface-border);

	.product-grid-item-top,
	.product-grid-item-bottom {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	img {
		//box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
		margin: 2rem 0;
	}

	.product-grid-item-content {
		text-align: center;
	}

	.plugin-info {
		font-size: 1.5rem;
		font-weight: 600;
	}
}
.profile-management {
    background-color: #e7f2f8;
}
</style>