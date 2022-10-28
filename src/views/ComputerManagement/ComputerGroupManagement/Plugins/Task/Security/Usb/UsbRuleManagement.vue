<template>
  <div>
    <base-plugin
      :pluginUrl="pluginUrl"
      :pluginDescription="pluginDescription"
      :showTaskDialog="showTaskDialog"
      @close-task-dialog="showTaskDialog = false"
      :pluginTask="task"
      @task-response="usbRuleManagementResponse"
    >
      <template #pluginTitle>
        {{ $t("computer.plugins.usb.usb_rule_header") }}
      </template>
      <template #pluginTitleButton>
        <div>
          <Button
            icon="pi pi-list"
            class="p-button-sm p-mr-2"
            :title="$t('computer.plugins.usb.list_usb_rule')"
            @click.prevent="sendTaskUsbRuleManagement('GET-USB-RULES')"
          />
          <Button
            icon="pi pi-trash"
            class="p-button-sm p-mr-2 p-button-danger"
            :title="$t('computer.plugins.usb.delete_usb_rule')"
            @click.prevent="sendTaskUsbRuleManagement('DELETE-USB-RULES')"
          />
          <Button
            icon="pi pi-caret-right"
            class="p-button-sm "
            :title="$t('computer.plugins.button.run')"
            @click.prevent="sendTaskUsbRuleManagement('MANAGE-USB-RULES')"
          />
        </div>
      </template>
      <template #default>
        <div class="p-fluid">
          <div class="p-field">
            <Toolbar class="mb-4">
              <template #start>
                <div class="field-radiobutton p-mr-2">
                  <RadioButton id="typeWhite" name="typeWhite" value="whitelist" v-model="type" @change="changeUsbListType"/>
                  <label for="typeWhite">&nbsp; &nbsp;{{$t('policy_management.profile.usb.white_list')}}</label>
                </div>
                <div class="field-radiobutton p-mr-2">
                  <RadioButton id="typeBlack" name="typeBlack" value="blacklist" v-model="type" @change="changeUsbListType"/>
                  <label for="typeBlack">&nbsp; &nbsp;{{$t('policy_management.profile.usb.black_list')}}</label>
                </div>
              </template>
              <template #end>
                <Button class="p-button-sm" 
                  icon="pi pi-plus"  
                  :label="type == 'whitelist'? $t('policy_management.profile.usb.white_list_add'):$t('policy_management.profile.usb.black_list_add')" 
                  @click.prevent="showUsbItemDialog">
                </Button>
              </template>
            </Toolbar>
          </div>              
          <div class="p-field">
            <DataTable :value="usbRules" responsiveLayout="scroll" 
              class="p-datatable-sm" :scrollable="false" scrollHeight="400px">
              <template #header>
                <div class="p-d-flex p-jc-between">
                  <div style="text-align: left">
                    <h5>{{$t('computer.plugins.usb.white_black_list')}}</h5>
                  </div>
                </div>
              </template>
              <template #empty>
                <div class="p-d-flex p-jc-center" >
                  <span style="text-align: center">{{$t('computer.plugins.usb.usb_list_cant_find')}}</span>
                </div>
              </template>
              <!-- <Column field="index" header="#"></Column> -->
              <Column field="vendor" :header="$t('computer.plugins.usb.manufacturer')" style="width:25%"></Column>
              <Column field="model" :header="$t('computer.plugins.usb.model')" style="width:25%"></Column>
              <Column field="serialNumber" :header="$t('computer.plugins.usb.serial_number')" style="width:25%"></Column>
              <Column field="status" :header="$t('computer.plugins.usb.type')" headerStyle="width: 15%">
                <template #body>
                  <Badge v-if="type == 'whitelist'" 
                    severity="success" icon="pi pi-users" 
                    :value="$t('computer.plugins.usb.allowed')">
                  </Badge>
                  <Badge 
                    v-else
                    severity="danger" :value="$t('computer.plugins.usb.deny')">
                  </Badge>
                </template>
              </Column>
              <Column :exportable="false" style="flex: 0 0 4rem">
                <template #body="slotProps">
                  <div class="p-d-flex p-jc-end">
                    <Button class="p-mr-2 p-button-sm p-button-rounded p-button-warning" 
                      icon="pi pi-pencil"  
                      :title="$t('computer.plugins.usb.edit')" 
                      @click.prevent="editUsbItem(slotProps.data)">
                    </Button>
                    <Button class="p-button-sm p-button-rounded p-button-danger" 
                      icon="pi pi-trash"  
                      :title="$t('computer.plugins.usb.delete')" 
                      @click.prevent="deleteUsbItem(slotProps.data)">
                    </Button>
                  </div>
                </template>
              </Column>
            </DataTable>
          </div>
        </div>
        </template>
      <template #pluginFooter> </template>
    </base-plugin>
     <!-- Add Usb Item as Black or White List -->
      <Dialog :header="!selectedUsbItem ? $t('policy_management.profile.usb.usb_add'): $t('policy_management.profile.usb.usb_update')" v-model:visible="usbItemDialog" 
        :style="{width: '30vw'}" :modal="true">
        <div class="p-fluid">
          <div class="p-field">
            <label for="icon"> {{$t('policy_management.profile.usb.manufacturer')}}</label>
            <InputText class="p-inputtext-sm" type="text" v-model="form.vendor"/>
          </div>
          <div class="p-field">
            <label for="icon">{{$t('policy_management.profile.usb.model')}}</label>
            <InputText class="p-inputtext-sm" type="text" v-model="form.model"/>
          </div>
          <div class="p-field">
            <label for="icon">{{$t('policy_management.profile.usb.serial_number')}}</label>
            <InputText class="p-inputtext-sm" type="text" v-model="form.serialNumber"/>
          </div>
        </div>
        <template #footer>
          <Button :label="$t('policy_management.cancel')" icon="pi pi-times" 
            @click="usbItemDialog = false" class="p-button-text p-button-sm"/>
          <Button v-if="!selectedUsbItem" :label="$t('policy_management.add')" icon="pi pi-plus"
            @click="saveUsbItem('add')" class="p-button-sm"/>
          <Button v-if="selectedUsbItem" :label="$t('policy_management.update')" icon="pi pi-refresh"
            @click="saveUsbItem('update')" class="p-button-sm"/>
        </template>
      </Dialog>
      <!-- Add Usb Item as Black or White List End -->
  </div>
</template>
<script>
/**
 * USB Rule Management as white or black list
 * commandId: MANAGE-USB-RULE
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
      usbRules: [],
      task: null,
      showTaskDialog: false,
      pluginDescription: this.$t("computer.plugins.usb.description_usb_rule"),
      pluginUrl:"https://docs.liderahenk.org/lider3.0/computerManagement/computerManagement/usbManagement/",
      storageCb: false,
      storage: 1,
      printerCb: false,
      printer: 1,
      webcamCb: false,
      webcam: 1,
      mouseKeyboardCb: false,
      mouseKeyboard: 1,
      form: {
        vendor: "",
        model: "",
        serialNumber: ""
      },
      type: "whitelist",
      selectedUsbItem: null,
      usbItemDialog: false
    };
  },
  
  methods: {
    sendTaskUsbRuleManagement(commandId) {
      this.task.commandId = commandId;
      let parameterMap = {};
      if (commandId == "MANAGE-USB-RULES") {
        if(this.usbRules.length > 0) {
          parameterMap.items = this.usbRules;
          parameterMap.type = this.type;
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
      }
      this.task.parameterMap = parameterMap;
      this.showTaskDialog = true;
    },

    changeUsbListType() {
      for (let index = 0; index < this.usbRules.length; index++) {
        const element = this.usbRules[index];
        element.type = this.type;
      }
    },

    showUsbItemDialog() {
      this.selectedUsbItem = null;
      this.form.vendor = "";
      this.form.model = "";
      this.form.serialNumber = "";
      this.usbItemDialog = true;
    },

    editUsbItem(data){
      this.selectedUsbItem = data;
      this.form.vendor = data.vendor;
      this.form.model = data.model;
      this.form.serialNumber = data.serialNumber;
      this.usbItemDialog = true;
    },

    saveUsbItem(status) {
      if (!this.form.vendor.trim() && !this.form.model.trim() && !this.form.serialNumber.trim()) {
        this.$toast.add({
          severity:'warn', 
          detail: "En az 1 tane kural tanımlamalısınız",
          summary: this.$t("computer.task.toast_summary"), 
          life: 3000
        });
        return;
      }
      let gId = this.createGuid();
      if (status == 'update') {
        this.usbRules = this.usbRules.filter(usb => usb.id != this.selectedUsbItem.id);
        gId = this.selectedUsbItem.id;
      }
      this.usbRules.push({
        "id": gId,
        "vendor": this.form.vendor,
        "model": this.form.model,
        "serialNumber": this.form.serialNumber,
      });
      this.usbItemDialog = false;
      this.selectedUsbItem = null;
    },

    createGuid() {
      return Math.random().toString(16).slice(2);
    },

    deleteUsbItem(usbItem) {
      this.usbRules = this.usbRules.filter(usb => usb.id != usbItem.id);
    },

    usbRuleManagementResponse(message) {
      if (message.commandClsId == "GET-USB-RULES") {
        let arrg = JSON.parse(message.result.responseDataStr);
        if (arrg.usb_list.length > 0) {
          this.type = arrg.type;
          for (let index = 0; index < arrg.usb_list.length; index++) {
            const element = arrg.usb_list[index];
            this.usbRules.push({
              "id": this.createGuid(),
              "vendor": element.vendor,
              "model": element.model,
              "serialNumber": element.serialNumber,
            });
          }
        }
      } else if (message.commandClsId == "DELETE-USB-RULES") {
        if (message.result.responseCode === "TASK_PROCESSED") {
          this.usbRules = [];
          this.type = "whitelist";
        }
      }
    }
  },
};
</script>

<style lang="scss" scoped>
</style>
