<template>
    <about-dialog :showAboutDialog="showAboutDialog" @close-about-dialog="showAboutDialog = false"></about-dialog>
     <Menubar :model="items" style="background-color:#20639B; color:#fff">
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
            <Menu id="overlay_menu" ref="settingsMenu" :model="settingItemsMenu" :popup="true"/>

            <Button type="button" class="p-button-link" @click="toggleAbout">
                <i class="pi pi-question-circle" style="fontSize: 1.2rem"></i>
                <span class="layout-topbar-icon pi pi-angle-down"></span>
            </Button>
            <Menu ref="aboutMenu" :model="aboutItemsMenu" :popup="true"/>
        </template>
    </Menubar>
</template>

<script>
/**
 * Liderahenk Installation Layout
 * @see {@link http://www.liderahenk.org/}
 */
 
import axios from 'axios';
import AboutDialog from './Dialogs/About.vue'

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
            // items: [
            //     {
            //         label: "Basic Installation",
            //         to: '/basic/installation',
            //     },
            //     {
            //         label: "Advanced Installation",
            //         to:'/advanced/installation',
            //     }

            // ],
        }
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
    },

    methods: {
        
        getImgUrl: function(path) {
            return require("../../assets/images/flags/" + path);
        },
        
        toggleAbout(event) {
            this.$refs.aboutMenu.toggle(event);
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
    ::v-deep .p-menuitem-link {
        margin-right: 5px;
    }
</style>