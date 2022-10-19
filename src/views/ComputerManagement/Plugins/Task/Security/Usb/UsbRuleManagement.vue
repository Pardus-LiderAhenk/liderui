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
        {{ $t("computer.plugins.usb.header") }}
      </template>
      <template #pluginTitleButton>
        <div>
          <Button
            icon="pi pi-caret-right"
            class="p-button-sm"
            :title="$t('computer.plugins.button.run')"
            @click.prevent="sendTaskUsbManagement"
          >
          </Button>
        </div>
      </template>
      <template #default>
        <p>usb rule manage</p>
        </template>
      <template #pluginFooter> </template>
    </base-plugin>
  </div>
</template>

<script>
/**
 * USB Device Plugin. Allows management of client's device I/O
 * commandId: MANAGE-USB
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

  created() {
    this.task = { ...this.pluginTask };
  },

  data() {
    return {
      task: null,
      showTaskDialog: false,
      pluginDescription: this.$t("computer.plugins.usb.description"),
      pluginUrl:"https://docs.liderahenk.org/lider3.0/computerManagement/computerManagement/usbManagement/",
      storageCb: false,
      storage: 1,
      printerCb: false,
      printer: 1,
      webcamCb: false,
      webcam: 1,
      mouseKeyboardCb: false,
      mouseKeyboard: 1,
    };
  },
  
  methods: {
    sendTaskUsbManagement() {
      this.task.commandId = "MANAGE-USB";
      let parameterMap = {};
      if (this.storageCb) {
        parameterMap.storage = this.storage.toString();
      }
      if (this.printerCb) {
        parameterMap.printer = this.printer.toString();
      }
      if (this.webcamCb) {
        parameterMap.webcam = this.webcam.toString();
      }
      if (this.mouseKeyboardCb) {
        parameterMap.mouseKeyboard = this.mouseKeyboard.toString();
      }
      if (Object.keys(parameterMap).length === 0) {
        this.$toast.add({
          severity:'warn', 
          detail: this.$t('computer.plugins.usb.usb_task_warn'), 
          summary:this.$t("computer.task.toast_summary"), 
          life: 3000
        });
        return;
      }
      this.task.parameterMap = parameterMap;
      this.showTaskDialog = true;
    },

    changeCbWebcam() {
      if (!this.webcamCb) {
        this.webcam = 1;
      }
    },

    changeCbStorage() {
      if (!this.storageCb) {
        this.storage = 1;
      }
    },

    changeCbPrinter() {
      if (!this.printerCb) {
        this.printer = 1;
      }
    },

    changeCbMouseKeyboard() {
      if (!this.mouseKeyboardCb) {
        this.mouseKeyboard = 1;
      }
    }
  },
};
</script>

<style lang="scss" scoped>
</style>
