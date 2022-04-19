<template>
     <Menubar :model="items" style="background-color:#20639B; color:#fff">
            <template #start>
                 <router-link to="/">
                        <img alt="Logo" src="../../assets/images/liderahenk-logo.png" style="width:140px" />
                        
                    </router-link>
            </template>
            <template #end>
               
                 <Button type="button" class=" p-button-link" @click="toggleLanguage">
                    <img :src="getImgUrl($i18n.locale == 'tr' ? 'tr.png' : 'us.png')" style="width:20px;height:20px"/>
                    <span class="pi pi-angle-down"></span>
                </Button>
                <Menu id="overlay_menu_lang" ref="languageMenu" :model="languages" :popup="true" />
                <Button type="button" class=" p-button-link" @click="toggleSettings">
                    <i class="pi pi-cog" style="fontSize: 1.2rem"></i>
                    <span class="pi pi-angle-down"></span>
                </Button>
                <Menu id="overlay_menu" ref="settingsMenu" :model="settingItems" :popup="true" />
                <Button type="button" class=" p-button-link" @click="toggleProfile">
                    <i class="pi pi-user" style="fontSize: 1.2rem"></i>
                    <span class="layout-topbar-icon pi pi-angle-down"></span>
                </Button>
                <Menu id="overlay_menu_profile" ref="profileMenu" :model="profileItems" :popup="true" />
                
            </template>
        </Menubar>
</template>

<script>
import axios from 'axios';
import { mapActions } from 'vuex';

export default {
    
    data() {
        return {
            languages: [
                {label:'TR', icon:'../../assets/images/flags/tr.png', command: () => {
                    this.$i18n.locale = 'tr';
                    this.updateUserLanguage('tr');
                }},
                {label:'EN', icon:'../../assets/images/flags/us.png', command: () => {
                    this.$i18n.locale = 'en';
                    this.updateUserLanguage('en');
                }}
            ],
            items: [ {
                   label: this.$t('menu.computer_management'),
                   to: '/computer'
                },
                {
                    label: this.$t('menu.user_management'),
                    to:'/user'
                },
                {
                    label: this.$t('menu.policy_management'),
                    to: '/policy'
                },
                {
                    label: this.$t('menu.reports'),
                    items: [
                        {
                            label: this.$t('menu.detailed_agent_report'),
                            to: '/reports/agent'
                        },
                        {
                            label: this.$t('menu.executed_task_report'),
                            to: '/reports/task'
                        }, 
                        {
                            label: this.$t('menu.system_log_report'),
                            to: '/reports/logs'
                        },
                        {
                            label: this.$t('menu.scheduled_task_report'),
                            to: '/reports/scheduled'
                        }
                    ]
                }
            ],
            settingItems: [
                {
					label: this.$t('menu.console_user_settings'),
					to:'/settings/console_user_settings',
				},
				{
					label: this.$t('menu.server_settings'),
					to: '/settings/server_setings'
				},
                {
					label: this.$t('menu.system_monitoring_definitions'),
					to:'/settings/system_monitoring_definitions',
				},
                {
					label: this.$t('menu.script_definitions'),
					to: '/settings/script_definitions',
				},
                {
					label: this.$t('menu.registration_templates'),
					to:'/settings/registratin_templates',
				},
            ],
            profileItems: [
                {
                    label: 'Profili Görüntüle',
                    to: '/user_profile'
                },
                {
                    label: 'Çıkış',
                    command: () => {
                        this.$store.dispatch("logout").then(() => this.$router.push("/login")).catch(err => console.log(err));
                    }
                }
            ]
        }
    },
    methods: {
        ...mapActions([
            'updateUserLang',
        ]),
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
            data.append('langName', lang);
            axios.post('/changeLanguage', data);

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