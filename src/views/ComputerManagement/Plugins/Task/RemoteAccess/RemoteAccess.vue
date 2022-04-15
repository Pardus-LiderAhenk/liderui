<template>
  <div>
    <base-plugin 
      :pluginUrl="pluginUrl"
      :pluginDescription="pluginDescription"
      :showTaskDialog="showTaskDialog"
      @close-task-dialog="showTaskDialog = false"
      :pluginTask="task"
      @task-response="remoteAccessResponse"
    >
    <template #pluginTitle>
        {{ $t("computer.plugins.remote_access.header") }}
    </template>
    <template #pluginTitleButton>
        <Button
          icon="pi pi-desktop"
          class="p-button-raised p-button-sm"
          :title="$t('computer.plugins.remote_access.remote_destktop_access')"
          @click.prevent="sendTaskRemoteAccess"
        >
        </Button>
      </template>
      <template #default>
        <div class="p-fluid">
          <div class="p-field p-col-6">
              <label>{{ $t("computer.plugins.remote_access.remote_access_options") }}</label>
              <Dropdown
                v-model="permission"
                :options="options"
                optionLabel="label"
                optionValue="value"
              >
              </Dropdown>
          </div>
        </div>
        guac
      </template>

     <template #pluginFooter> </template>
    </base-plugin>
  </div>
</template>

<script>
/**
 * Remote access with guacd
 * commandId: SETUP-VNC-SERVER
 * @see {@link http://www.liderahenk.org/}
 * 
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
      task: null,
      showTaskDialog: false,
      pluginDescription: this.$t("computer.plugins.remote_access.description"),
      pluginUrl:"https://docs.liderahenk.org/lider-ahenk-docs/liderv2/computer_management/betik/betik_tanimi/",
      permission: "yes",
      options: [
        {label: 'Kullanıcı izni ve bildirim aktif et', value: 'yes'},
        {label: 'Kullanıcı izni ve bildirim yok', value: 'without_notify'}
      ]
    };
  },

  created() {
    this.task = { ...this.pluginTask };
  },
  methods: {
    sendTaskRemoteAccess() {
      this.task.commandId = "SETUP-VNC-SERVER";
      this.task.parameterMap = {
        "permission": this.permission
      }
      this.showTaskDialog = true;
    },

    remoteAccessResponse(message) {
      if (message.commandClsId == "SETUP-VNC-SERVER") {
        let arrg = JSON.parse(message.result.responseDataStr);
        this.startRemoteAccess(arrg);
      }
    },

    startRemoteAccess(arrg) {
      console.log(arrg);
      alert("start vnc connect");
    }
  }

};
</script>

<style scoped></style>
