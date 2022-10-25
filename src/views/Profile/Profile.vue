<template>
    <Card>
        <template #content>
            <div class="p-grid">
                <div class="p-col-3 ">
                    <PanelMenu class="sideMenu" :model="profileItems" />
                </div>
                <div class="p-col-9">
                    <user-info-form v-show="displayFormName === 1"  :user="user"></user-info-form>
                    <account-info-form v-show="displayFormName === 2" :user="user"></account-info-form>
                    <ui-usage-history ref="uiusagecomp" v-show="displayFormName === 3"></ui-usage-history>
                    <group-info :user="user" v-show="displayFormName === 4" ref="groupinfocomp"></group-info>
                </div>
            </div>
        </template>
    </Card>
</template>

<script>

import UserInfoForm from './components/UserInfoForm.vue';
import AccountInfoForm from './components/AccountInforForm.vue';
import UiUsageHistory from './components/UiUsageHistory.vue';
import GroupInfo from './components/GroupInfo.vue';
import { profileService } from '../../services/Profile/ProfileService.js';

export default {
    components:{
        UserInfoForm,
        AccountInfoForm,
        UiUsageHistory,
        GroupInfo
    },
    data() {
        return {
            displayFormName: 1,
            user:null,
            profileItems: [
                {
                    label: this.$t('profile.user_information.user_information'),
                    command: () => {
                        this.displayFormName = 1
                    }
                },
                {
                    label: this.$t('profile.account_security.account_security'),
                    command: () => {
                        this.displayFormName = 2
                    }
                },
                {
                    label: this.$t('profile.login_logout_history.login_logout_history'),
                    command: () => {
                        this.displayFormName = 3
                    }
                },
                {
                    label: this.$t('profile.group_information.group_information'),
                    command: () => {
                        this.displayFormName = 4
                    }
                }
            ],
        }
    },
    mounted() {

        this.getProfile();
        
    },

    methods : {

        async getProfile(){
            const{response,error} = await profileService.getProfile({});
            if(error){
                this.$toast.add({
                    severity:'error', 
                    detail: this.$t('profile.user_information.error_get_profile'), 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });

            }
            else{
                if(response.status == 200){
                    this.user = response.data;
                    this.$refs.uiusagecomp.init();
                    this.$refs.groupinfocomp.init(response.data);
                }
                else if(response.status == 417){
                    this.$toast.add({
                        severity:'error', 
                        detail: this.$t('profile.user_information.error_417_get_profile'), 
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000
                    });
                }
            }

        }
    },

}
</script>

<style scoped>
    .sideMenu {
        margin: 5px;
        padding: 10px;
    }
</style>
