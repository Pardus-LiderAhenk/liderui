<template>
    <div>
        <TabView>
            <TabPanel>
                <template #header>
                    <i class="pi pi-list"></i>
                    <span>
                        &nbsp;{{ $t('policy_management.policies')}}
                    </span>
                </template>
                <policy-management></policy-management>
                </TabPanel>
                <TabPanel>
                <template #header>
                    <i class="pi pi-cog"></i>
                    <span>
                        &nbsp;{{$t('policy_management.profiles')}}
                    </span>
                </template>
                <profile-management></profile-management>
            </TabPanel>
        </TabView>
    </div>
</template>

<script>
import PolicyManagement from "./Tabs/PolicyManagement.vue"
import ProfileManagement from "./Tabs/ProfileManagement.vue"

export default {

    components: {
        PolicyManagement,
        ProfileManagement
    }
    
}
</script>

<style lang="scss" scoped>

</style>