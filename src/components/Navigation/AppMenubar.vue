<template>
     <Menubar :model="items" style="background-color:#20639B; color:#fff">
            <template #start>
                 <router-link to="/">
                        <img alt="Logo" src="../../assets/images/LiderAhenk-Logo-01.png" style="width:140px"/>
                        
                    </router-link>
            </template>
            <template #end>
               <!-- <Dropdown v-model="selectedCountry" :options="countries"  >
                    <template #value="slotProps">
                        <div class="country-item country-item-value" v-if="slotProps.value">
                            <img :src="getImgUrl(slotProps.value.img)" style="width:15px;height:15px"/>
                             
                        </div>
                        <span v-else>
                            {{slotProps.placeholder}}
                        </span>
                    </template>
                    <template #option="slotProps">
                        <div class="country-item">
                            <img :src="getImgUrl(slotProps.option.img)" style="width:30px;height:30px"/>
                            
                        </div>
                    </template>
                </Dropdown> -->
                 <Button type="button" class=" p-button-link">
                    <img :src="getImgUrl('tr.png')" style="width:20px;height:20px"/>
                    <span class="pi pi-angle-down"></span>
                </Button>
                 <Button type="button" class=" p-button-link" @click="toggleSettings">
                    <i class="pi pi-cog" style="fontSize: 1.2rem"></i>
                    <span class="pi pi-angle-down"></span>
                </Button>
                <Menu id="overlay_menu" ref="settingsMenu" :model="settingItems" :popup="true" />
                <Button type="button" class=" p-button-link">
                    <span >İsmail BAŞARAN</span>
                    <span class="layout-topbar-icon pi pi-angle-down"></span>
                </Button>
                
            </template>
        </Menubar>
</template>

<script>
export default {
    components: {
        
    },
    data() {
        return {
            selectedCountry: {name: 'Turkish', code: 'TR', img: 'tr.png'},
            countries: [
                {name: 'Turkish', code: 'TR', img: 'tr.png'},
                {name: 'English', code: 'EN', img: 'us.png'}
            ],
            items: [ {
                   label:'Computer Management',
                   to: '/computermanagement'
                },
                {
                    label: 'User Management',
                    items: [
                        {
                            label:'User Operations'
                            
                        },
                        {
                            label: 'AD Syncronization'
                        }
                    ]
                },
                {
                    label: 'Group Management',
                    items : [
                        {
                            label:'Computer Group Management',
                            to: '/computer_group_management'
                           
                        },
                        {
                            label: 'User Group Management',
                            to: '/user_group_management'
                        },
                        {
                            label: 'User Authorization ( Sudo )',
                            to: '/user_permissions_management'
                        },
                        {
                            label: 'Policy Management'
                        }
                    ]
                },
                {
                    label: 'Reports',
                    items: [
                        {
                            label: 'Detailed Agent Report',
                            to: '/reports/agent'
                        },
                        {
                            label: 'Executed Task Report'
                        }, 
                        {
                            label: 'Sysem Log Report'
                        }
                    ]
                }
            ],
            settingItems: [
                {
					label: 'Arayüz Erişim Ayarları',
					command: () => {
						this.$toast.add({severity:'success', summary:'Updated', detail:'Data Updated', life: 3000});
					}
				},
				{
					label: 'Sunucu Ayarları',
					to: '/settings/server_setings'
				},
                {
					label: 'Sistem Gözlemcisi Tanımları',
					to:'/settings/system_monitoring_definitions',
				},
                {
					label: 'Betik Tanımları',
					to: '/settings/script_definitions',
				},
                {
					label: 'Kayıt Şablonları',
					command: () => {
						this.$toast.add({ severity: 'warn', summary: 'Delete', detail: 'Data Deleted', life: 3000});
					}
				},
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