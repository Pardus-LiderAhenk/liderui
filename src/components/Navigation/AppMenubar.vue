<template>
    <about-dialog :showAboutDialog="showAboutDialog" @close-about-dialog="showAboutDialog = false"></about-dialog>
     <Menubar :model="menuItems" style="background-color:#20639B; color:#fff">
        <template #start>
            <router-link to="/">
                <img alt="Logo" src="../../assets/images/liderahenk-logo.png" style="width:140px"/>
            </router-link>
        </template>
        <template #end>
            <Button type="button" class="p-button-link" @click="toggleLanguage">
                <img :src="getImgUrl($i18n.locale == 'tr' ? 'tr.png' : 'us.png')" style="width:20px;height:20px"/>
                <span class="pi pi-angle-down"></span>
            </Button>
            <Menu id="overlay_menu_lang" ref="languageMenu" :model="languages" :popup="true"/>
            <Button type="button" class=" p-button-link" @click="toggleSettings" v-if="settingItemsMenu.length > 0">
                <i class="pi pi-cog" style="fontSize: 1.2rem"></i>
                <span class="pi pi-angle-down"></span>
            </Button>
            <Menu id="overlay_menu" ref="settingsMenu" :model="settingItemsMenu" :popup="true"/>

            <Button type="button" class="p-button-link" @click="toggleAbout">
                <i class="pi pi-question-circle" style="fontSize: 1.2rem"></i>
                <span class="layout-topbar-icon pi pi-angle-down"></span>
            </Button>
            <Menu ref="aboutMenu" :model="aboutItemsMenu" :popup="true"/>

            <Button type="button" class="p-button-link" @click="toggleProfile">
                <i class="pi pi-user" style="fontSize: 1.2rem"></i>
                <span class="layout-topbar-icon pi pi-angle-down"></span>
            </Button>
            <Menu id="overlay_menu_profile" ref="profileMenu" :model="profileItemsMenu" :popup="true"/>
        </template>
    </Menubar>
</template>

<script>
/**
 * App Menu bar. Shows menu bar by logon user role base
 * @see {@link http://www.liderahenk.org/}
 */
 
import { profileService } from '../../services/Profile/ProfileService';
import { serverSettingService } from '../../services/Settings/ServerSettingsService';
import AboutDialog from './Dialogs/About.vue'
import {roleManagement} from "../../services/Roles/RoleManagement"


export default {
    
    data() {
        return {
            showAboutDialog: false,
            languages: [
                {
                    label:'TR', icon:'../../assets/images/flags/tr.png', command: () => {
                        this.$i18n.locale = 'tr';
                        this.updateUserLanguage('tr');
                    }
                },
                {
                    label:'EN', icon:'../../assets/images/flags/us.png', command: () => {
                    this.$i18n.locale = 'en';
                    this.updateUserLanguage('en');
                    }
                }
            ],
            items: [],
            settingItems: [],
            priviliges: []
        }
    },

    created() {
        this.showMenuBar();
    },

    components:{
        AboutDialog
    },

    computed: {
        menuItems: {
            get () {
                return this.items;
            },
        },
       
        profileItemsMenu: {
            get () {
                let profileItems = [
                    {
                        label: this.$t('menu.view_profile'),
                        to: '/user-profile',
                        icon:'pi pi-user'
                    },
                    {
                        label: this.$t('menu.logout'),
                        icon:'pi pi-sign-out',
                        command: () => {
                            this.$store.dispatch("logout").then(() => this.$router.push("/login")).catch(err => console.log(err));
                        }
                    }
                ]
                return profileItems;
            }
        },

        aboutItemsMenu: {
            get () {
                let aboutItems = [
                    {
                        label: this.$t('about.document'),
                        icon:'pi pi-book',
                        command: () => {
                            window.open("https://docs.liderahenk.org", '_blank').focus();
                        }
                    },
                    {
                        label: this.$t('about.report_bug'),
                        icon:'pi pi-exclamation-triangle',
                        command: () => {
                            window.open("https://talep.pardus.org.tr/servicedesk/customer/portal/1/user/login?destination=portal%2F1", '_blank').focus();
                        }
                    },
                    {
                        label: this.$t('about.forum'),
                        icon:'pi pi-external-link',
                        command: () => {
                            window.open("https://forum.pardus.org.tr/c/projeler/liderahenk/30", '_blank').focus();
                        }
                    },

                    {
                        label: this.$t('about.about'),
                        icon:'pi pi-info-circle',
                        command: () => {
                            this.showAboutDialog = true;
                        }
                    },
                    
                ]
                return aboutItems;
            }
        },

        settingItemsMenu: {
            get () {
                return this.settingItems;
            }
        }
    },

    methods: {

        isExistPrivilege(role){
            return roleManagement.isExistRole(role)
        },

        showMenuBar() {
            this.setMenuBar();
        },

        setMenuBar() {
            if (this.isExistPrivilege("ROLE_COMPUTERS")) {
                this.items.push(
                    {
                        label: this.$t('menu.computer_management'),
                        to: '/computer',
                    }
                );
            }
            if (this.isExistPrivilege("ROLE_USERS")) {
                this.items.push(
                    {
                        label: this.$t('menu.user_management'),
                        to:'/user',
                    }
                );
            }
            if (this.isExistPrivilege("ROLE_POLICY")) {
                this.items.push(
                    {
                        label: this.$t('menu.policy_management'),
                        to: '/policy'
                    }
                );
            }
            if (this.isExistPrivilege("ROLE_AGENT_INFO") || this.isExistPrivilege("ROLE_SCHEDULE_TASK") 
            || this.isExistPrivilege("ROLE_EXECUTED_TASK") || this.isExistPrivilege("ROLE_OPERATION_LOG")
            || this.isExistPrivilege("ROLE_USER_SESSION_REPORT")) {
                this.items.push(
                    {
                        label: this.$t('menu.reports'),
                        items: this.getReportsMenuItem()
                    }
                );
            }

            if (this.isExistPrivilege("ROLE_CONSOLE_ACCESS_SETTINGS")) {
                this.settingItems.push(
                    {
                        label: this.$t('menu.console_user_settings'),
                        to:'/settings/console-user-settings',
                    }
                );
            }
            if (this.isExistPrivilege("ROLE_SERVER_SETTINGS")) {
                this.settingItems.push(
                    {
                        label: this.$t('menu.server_settings'),
                        to: '/settings/server-settings',
                    }
                );
            }
            if (this.isExistPrivilege("ROLE_SERVER_INFORMATION")) {
                this.settingItems.push(
                    {
                        label: this.$t('menu.server_informations'),
                        to: '/settings/server-informations',
                    }
                );
            }
            if (this.isExistPrivilege("ROLE_CONKY_DEFINITION")) {
                this.settingItems.push(
                    {
                        label: this.$t('menu.system_monitoring_definitions'),
                        to:'/settings/system-monitoring-definitions',
                    }
                );
            }
            if (this.isExistPrivilege("ROLE_SCRIPT_DEFINITION")) {
                this.settingItems.push(
                    {
                        label: this.$t('menu.script_definitions'),
                        to: '/settings/script-definitions',
                    }
                );
            }
            if (this.isExistPrivilege("ROLE_REGISTRATION_TEMPLATE")) {
                this.settingItems.push(
                    {
                        label: this.$t('menu.registration_templates'),
                        to:'/settings/registration-templates',
                    }
                );
            }
        },

        getReportsMenuItem() {
            let reportsItems = [];
            if (this.isExistPrivilege("ROLE_AGENT_INFO")) {
                reportsItems.push(
                    {
                        label: this.$t('menu.detailed_agent_report'),
                        to: '/reports/agent'
                    }
                );
            }
            if (this.isExistPrivilege("ROLE_EXECUTED_TASK")) {
                reportsItems.push(
                    {
                        label: this.$t('menu.executed_task_report'),
                        to: '/reports/task'
                    }
                );
            }
            if (this.isExistPrivilege("ROLE_OPERATION_LOG")) {
                reportsItems.push(
                    {
                        label: this.$t('menu.system_log_report'),
                        to: '/reports/logs'
                    }
                );
            }
            if (this.isExistPrivilege('ROLE_SCHEDULE_TASK')) {
                reportsItems.push(
                    {
                        label: this.$t('menu.scheduled_task_report'),
                        to: '/reports/scheduled'
                    }
                );
            }
            if (this.isExistPrivilege("ROLE_USER_SESSION_REPORT")) {
                reportsItems.push(
                    {
                        label: this.$t('menu.system_session_report'),
                        to: '/reports/session'
                    }
                );
            }
            return reportsItems;
        },
        
        getImgUrl: function(path) {
            return require("../../assets/images/flags/" + path);
        },
        
        toggleSettings(event) {
            this.$refs.settingsMenu.toggle(event);
        },
        
        toggleProfile(event) {
            this.$refs.profileMenu.toggle(event);
        },
        toggleAbout(event) {
            this.$refs.aboutMenu.toggle(event);
        },

        toggleLanguage(event) {
            this.$refs.languageMenu.toggle(event);
        },

        async updateUserLanguage(lang){
            let data = new FormData();
            data.append('langa1799b6ac27611eab3de0242ac130004', lang);
            // axios.post('/changeLanguage' , data).then(response => {
            //     this.$router.go();
            // });
            const{response,error} = await serverSettingService.changeLanguage(data);
            if(error){
                console.log("Error, change language")
            }
            else
            {
                if(response.status == 200){
                    this.$router.go();
                }
            }

            // UPDATE USER STATE
            this.$store.dispatch("updateUserLang", lang);
        }
    }
}
</script>

<style scoped lang="scss"> 
    ::v-deep .p-menubar .p-menubar-root-list > .p-menuitem > .p-menuitem-link .p-menuitem-text {
        color: #fff
    }
    ::v-deep .p-menubar .p-menubar-root-list > .p-menuitem > .p-menuitem-link .p-menuitem-icon {
        color:#fff
    }
    ::v-deep .p-menubar .p-menubar-root-list > .p-menuitem > .p-menuitem-link .p-submenu-icon {
        color: #fff;
    }
    .p-link {
        color:#fff;
        margin-left:10px;
    }
    ::v-deep .p-button-link {
        color: #fff
    }
    ::v-deep .p-button.p-button-link {
        color: #fff
    }
    ::v-deep .p-menubar .p-submenu-list {
        width: 300px;
    }
    .p-menu {
        min-width: 100px;
    }
    .p-button.p-button-icon-only.p-button-rounded {
        color: #fff
    }
    ::v-deep .p-menuitem-link {
        margin-right: 5px;
    }
</style>