<template>
    <div class="p-grid">
        <div class="p-col-3 ">
            <PanelMenu class="sideMenu" :model="profileItems" />
        </div>
        <div class="p-col-9">
            <user-info-form v-show="displayFormName === 1"></user-info-form>
            <account-info-form v-show="displayFormName === 2"></account-info-form>
            <ui-usage-history v-show="displayFormName === 3"></ui-usage-history>
            <group-info v-show="displayFormName === 4"></group-info>
        </div>
    </div>
</template>

<script>

import UserInfoForm from './components/UserInfoForm.vue';
import AccountInfoForm from './components/AccountInforForm.vue';
import UiUsageHistory from './components/UiUsageHistory.vue';
import GroupInfo from './components/GroupInfo.vue';

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
            profileItems: [
                {
                    label: 'Kullanıcı Bilgileri',
                    command: () => {
                        this.displayFormName = 1
                    }
                },
                {
                    label: 'Hesap Güvenliği',
                    command: () => {
                        this.displayFormName = 2
                    }
                },
                {
                    label: 'Kullanım Geçmişi',
                    command: () => {
                        this.displayFormName = 3
                    }
                },
                {
                    label: 'Grup Bilgileri',
                    command: () => {
                        this.displayFormName = 4
                    }
                }
            ]
        }
    }
}
</script>

<style scoped>
    .sideMenu {
        margin: 5px;
        padding: 10px;
    }
</style>
