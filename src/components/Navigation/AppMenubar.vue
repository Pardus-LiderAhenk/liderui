<template>
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
            <Button type="button" class=" p-button-link" @click="toggleSettings" v-if="settingItems.length > 0">
                <i class="pi pi-cog" style="fontSize: 1.2rem"></i>
                <span class="pi pi-angle-down"></span>
            </Button>
            <Menu id="overlay_menu" ref="settingsMenu" :model="settingItemsMenu" :popup="true"/>
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
 
import axios from 'axios';

export default {
    
    data() {
        return {
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
                        to: '/user_profile',
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

        settingItemsMenu: {
            get () {
                return this.settingItems;
            }
        }
    },

    methods: {

        async showMenuBar() {
            const data = await this.getPriviliges();
            this.setMenuBar();
        },

        getPriviliges() {
            return new Promise((resolve, reject)=> {
                axios.post("/liderConsole/profile", {}).then((response) => {
                    console.log(response.data)
                    this.priviliges = response.data.priviliges;
                    resolve(response.data.priviliges);
                });
            });
        },

        isExistPrivilege(value){
            let isExist = false;
            for (let index = 0; index < this.priviliges.length; index++) {
                const element = this.priviliges[index];
                if (element === value) {
                    isExist = true;
                }
            }
            return isExist;
        },

        setMenuBar() {
            if (this.isExistPrivilege("ROLE_COMPUTERS") || this.isExistPrivilege("ROLE_ADMIN")) {
                this.items.push(
                    {
                        label: this.$t('menu.computer_management'),
                        to: '/computer',
                    }
                );
            }
            if (this.isExistPrivilege("ROLE_USERS") || this.isExistPrivilege("ROLE_ADMIN")) {
                this.items.push(
                    {
                        label: this.$t('menu.user_management'),
                        to:'/user',
                    }
                );
            }
            if (this.isExistPrivilege("ROLE_POLICY") || this.isExistPrivilege("ROLE_ADMIN")) {
                this.items.push(
                    {
                        label: this.$t('menu.policy_management'),
                        to: '/policy'
                    }
                );
            }
            if (this.isExistPrivilege("ROLE_ADMIN") || this.isExistPrivilege("ROLE_AGENT_INFO") ||
                this.isExistPrivilege("ROLE_COMPUTERS") || this.isExistPrivilege("ROLE_EXECUTED_TASK") || 
                this.isExistPrivilege("ROLE_OPERATION_LOG")) {
                this.items.push(
                    {
                        label: this.$t('menu.reports'),
                        items: this.getReportsMenuItem()
                    }
                );
            }

            if (this.isExistPrivilege("ROLE_CONSOLE_ACCESS_SETTINGS") || this.isExistPrivilege("ROLE_ADMIN")) {
                this.settingItems.push(
                    {
                        label: this.$t('menu.console_user_settings'),
                        to:'/settings/console_user_settings',
                    }
                );
            }
            if (this.isExistPrivilege("ROLE_SERVER_SETTINGS") || this.isExistPrivilege("ROLE_ADMIN")) {
                this.settingItems.push(
                    {
                        label: this.$t('menu.server_settings'),
                        to: '/settings/server_setings'
                    }
                );
            }
            if (this.isExistPrivilege("ROLE_CONKY_DEFINITION") || this.isExistPrivilege("ROLE_ADMIN")) {
                this.settingItems.push(
                    {
                        label: this.$t('menu.system_monitoring_definitions'),
                        to:'/settings/system_monitoring_definitions',
                    }
                );
            }
            if (this.isExistPrivilege("ROLE_SCRIPT_DEFINITION") || this.isExistPrivilege("ROLE_ADMIN")) {
                this.settingItems.push(
                    {
                        label: this.$t('menu.script_definitions'),
                        to: '/settings/script_definitions',
                    }
                );
            }
            if (this.isExistPrivilege("ROLE_REGISTRATION_TEMPLATE") || this.isExistPrivilege("ROLE_ADMIN")) {
                this.settingItems.push(
                    {
                        label: this.$t('menu.registration_templates'),
                        to:'/settings/registratin_templates',
                    }
                );
            }
        },

        getReportsMenuItem() {
            let reportsItems = [];
            if (this.isExistPrivilege("ROLE_AGENT_INFO") || this.isExistPrivilege("ROLE_ADMIN")) {
                reportsItems.push(
                    {
                        label: this.$t('menu.detailed_agent_report'),
                        to: '/reports/agent'
                    }
                );
            }
            if (this.isExistPrivilege("ROLE_EXECUTED_TASK") || this.isExistPrivilege("ROLE_ADMIN")) {
                reportsItems.push(
                    {
                        label: this.$t('menu.executed_task_report'),
                        to: '/reports/task'
                    }
                );
            }
            if (this.isExistPrivilege("ROLE_OPERATION_LOG") || this.isExistPrivilege("ROLE_ADMIN")) {
                reportsItems.push(
                    {
                        label: this.$t('menu.system_log_report'),
                        to: '/reports/logs'
                    }
                );
            }
            if (this.isExistPrivilege("ROLE_COMPUTERS") || this.isExistPrivilege("ROLE_ADMIN")) {
                reportsItems.push(
                    {
                        label: this.$t('menu.scheduled_task_report'),
                        to: '/reports/scheduled'
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

        toggleLanguage(event) {
            this.$refs.languageMenu.toggle(event);
        },

        updateUserLanguage(lang){
            let data = new FormData();
            data.append('preferredLanguage', lang);
            axios.post('/changeLanguage' , data).then(response => {
                this.$router.go();
            });
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
</style>