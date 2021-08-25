<template>
    <div>
        <base-plugin
        :pluginUrl="pluginUrl"
        :pluginDescription="pluginDescription"
        :showTaskDialog="showTaskDialog"
        @close-task-dialog="closeShowTaskDialog"
        @task-response="ldapLoginResponse"
        :pluginTask="task"
        >
        <template #pluginHeader>
            <!-- {{ $t("computer.plugins.ldap_login.header") }} -->
            Application Restriction
        </template>
        <template #pluginHeaderButton>
            <Button
            icon="pi pi-caret-right"
            class="p-button-raised p-button-sm"
            :title="$t('computer.plugins.button.run')"
            @click.prevent="sendTaskLoginSettings">
            </Button>
        </template>
        <template #default>
        </template>
        </base-plugin>
    </div>    
</template>

<script>
export default {

      props: {
        pluginTask: {
        type: Object,
        description: "Plugin task object",
        },
    },

    created() {
        this.task = {...this.pluginTask};
        console.log(this.task)
    },
    
}
</script>

<style lang="scss">

</style>