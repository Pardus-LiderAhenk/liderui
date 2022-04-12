<template>
     <Menubar :model="items" style="background-color:#20639B; color:#fff">
            <template #start>
                 <router-link to="/">
                        <img alt="Logo" src="../../assets/images/LiderAhenk-Logo-01.png" style="width:140px" />
                        
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
export default {
    
    data() {
        return {
            selectedCountry: {name: 'Turkish', code: 'TR', img: 'tr.png'},
            languages: [
                {label:'TR', icon:'../../assets/images/flags/tr.png', command: () => this.$i18n.locale = 'tr'},
                {label:'EN', icon:'../../assets/images/flags/us.png', command: () => this.$i18n.locale = 'en'}
            ],
            items: [ {
                   label: this.$t('menu.computer_management'),
                   to: '/computermanagement'
                },
                {
                    label: this.$t('menu.user_management'),
                    items: [
                        {
                            label: this.$t('menu.user_operations'),
                            to:'/usermanagement'
                            
                        },
                        {
                            label: this.$t('menu.ad_management'),
                            to: '/ad_management'
                        },
                    ]
                },
                {
                    label: this.$t('menu.group_management'),
                    items : [
                        {
                            label:this.$t('menu.computer_group_management'),
                            to: '/computer_group_management'
                        },
                        {
                            label: this.$t('menu.user_group_management'),
                            to: '/user_group_management'
                        },
                        {
                            label: this.$t('menu.user_authorization'),
                            to: '/user_permissions_management'
                        },
                        {
                            label: this.$t('menu.policy_management'),
                            to: '/policy_management'
                        }
                    ]
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
                    to: '/user-profile'
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