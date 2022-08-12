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
        <div class="p-grid">
          <div class="p-col-5">
            <Checkbox id="storageCb" v-model="storageCb" :binary="true" @change="changeCbStorage"/>&nbsp;&nbsp;
            <i class="fab fa-usb"></i>&nbsp;&nbsp;
            <label for="storageCb">{{ $t("computer.plugins.usb.usb") }}</label>
          </div>
          <div class="p-col-3">
            <Dropdown 
              v-model="storage" 
              style="min-width: 100%;" 
              :disabled="!storageCb"
              :options="[{
                label: $t('computer.plugins.usb.allow'), 
                value: 1
                },
                {
                  label: $t('computer.plugins.usb.block'), 
                  value: 0
                }]"
              optionLabel="label" 
              optionValue="value" >
            </Dropdown>
          </div>
        </div>
        <div class="p-grid p-fluid">
          <div class="p-col-5">
            <Checkbox id="printerCb" v-model="printerCb" :binary="true" @change="changeCbPrinter"/>&nbsp;&nbsp;
            <i class="fas fa-print"></i>&nbsp;&nbsp;
            <label for="printerCb">{{ $t("computer.plugins.usb.printer") }}</label>
          </div>
          <div class="p-col-3">
            <Dropdown 
              v-model="printer" 
              style="min-width: 100%;" 
              :disabled="!printerCb"
              :options="[{
                label: $t('computer.plugins.usb.allow'), 
                value: 1
                },
                {
                  label: $t('computer.plugins.usb.block'), 
                  value: 0
                }]"
              optionLabel="label" 
              optionValue="value" >
            </Dropdown>
          </div>
        </div>
        <div class="p-grid p-fluid">
          <div class="p-col-5">
            <Checkbox id="webcamCb" v-model="webcamCb" :binary="true" @change="changeCbWebcam"/>&nbsp;&nbsp;
            <i class="fas fa-camera"></i>&nbsp;&nbsp;
            <label for="webcamCb">{{ $t("computer.plugins.usb.webcam") }}</label>
          </div>
          <div class="p-col-3">
            <Dropdown 
              v-model="webcam" 
              style="min-width: 100%;" 
              :disabled="!webcamCb"
              :options="[{
                label: $t('computer.plugins.usb.allow'), 
                value: 1
                },
                {
                  label: $t('computer.plugins.usb.block'), 
                  value: 0
                }]"
              optionLabel="label" 
              optionValue="value" >
            </Dropdown>
          </div>
        </div>
        <div class="p-grid p-fluid">
          <div class="p-col-5">
            <Checkbox id="storage" v-model="mouseKeyboardCb" :binary="true" @change="changeCbMouseKeyboard"/>&nbsp;&nbsp;
            <i class="fas fa-keyboard"></i>&nbsp;&nbsp;
            <label for="storage">{{ $t("computer.plugins.usb.mouse_keyboard") }}</label>
          </div>
          <div class="p-col-3">
            <Dropdown 
              v-model="mouseKeyboard" 
              style="min-width: 100%;" 
              :disabled="!mouseKeyboardCb"
              :options="[{
                label: $t('computer.plugins.usb.allow'), 
                value: 1
                },
                {
                  label: $t('computer.plugins.usb.block'), 
                  value: 0
                }]"
              optionLabel="label" 
              optionValue="value" >
            </Dropdown>
          </div>
        </div>
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
