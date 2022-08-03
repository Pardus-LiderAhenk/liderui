<template>
  <div>
    <base-plugin
      :pluginUrl="pluginUrl"
      :pluginDescription="pluginDescription"
      :showTaskDialog="showTaskDialog"
      @close-task-dialog="showTaskDialog = false"
      :pluginTask="task"
    >
      <template #pluginTitle>
        {{ $t("computer.plugins.session_and_power_management.header") }}
      </template>
      <template #default>
        <div class="p-grid">
          <div class="p-col session">
            <div class="p-grid p-jc-center" style="margin-top:10px">
              <Button icon="fas fa-sign-out-alt" class="session-button p-button-success" 
              @click.prevent="showConfirmDialogForTask('MANAGE')">
              </Button>
            </div>
            <div class="p-grid p-jc-center" style="margin-top:5px">
              <span>{{$t("computer.plugins.session_and_power_management.logout")}}</span>
            </div>
          </div>
          <div class="p-col session">
            <div class="p-grid p-jc-center" style="margin-top:10px">
              <Button icon="fa fa-sync-alt" class="session-button"
              @click.prevent="showConfirmDialogForTask('MACHINE_RESTART')">
              </Button>
            </div>
            <div class="p-grid p-jc-center" style="margin-top:5px">
              <span>{{$t("computer.plugins.session_and_power_management.restart")}}</span>
            </div>
          </div>
          <div class="p-col session">
            <div class="p-grid p-jc-center" style="margin-top:10px">
            <Button icon="fa fa-power-off" class="session-button p-button-danger" 
             @click.prevent="showConfirmDialogForTask('MACHINE_SHUTDOWN')">
            </Button>
            </div>
            <div class="p-grid p-jc-center" style="margin-top:5px">
              <span>{{$t("computer.plugins.session_and_power_management.poweroff")}}</span>
            </div>
          </div>
        </div>
      </template>
      <template #pluginFooter>
      </template>
    </base-plugin>
  </div>
</template>

<script>

/**
 * Sessoin and power management plugin 
 * @see {@link http://www.liderahenk.org/}
 */

export default {
  props: {
    pluginTask: {
      type: Object,
      description: "Plugin task object",
    },
  },
  
  data() {
    return {
      showTaskDialog: false,
      task: null,
      pluginDescription: this.$t('computer.plugins.session_and_power_management.description'),
      pluginUrl: "https://docs.liderahenk.org/lider3.0/computerManagement/computerManagement/sessionPowerManagement/",
    }
  },

  created() {
    this.task = {...this.pluginTask};
  },

  methods: {
    showConfirmDialogForTask(commandId){
      this.task.commandId = commandId;
      this.task.parameterMap = {};
      this.showTaskDialog = true;
    },

    sendTask() {
      this.showTaskDialog = false;
    }
  },
};
</script>

<style scoped>
.session{
  padding: 10px 15px;
  box-shadow: 0 4px 8px 0 rgba(79, 83, 83, 0.2);
  margin-left:20px;
  margin-right:20px;
}
.session:hover {
  box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
}
.session-button {
  height: 33px; width: 33px
}
</style>