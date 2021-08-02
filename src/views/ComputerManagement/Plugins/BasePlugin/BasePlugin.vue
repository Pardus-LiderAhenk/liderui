<template>
  <Dialog :header="$t('computer.task.toast_summary')" v-model:visible="showDialog"  :modal="true" @hide="closeTaskDialog('cancel')">
    <div class="confirmation-content">
      <i :class="scheduledParam == null ? 'pi pi-info-circle p-mr-3': 'pi pi-clock p-mr-3'" style="font-size: 2rem" />
      <span v-if="scheduledParam == null">{{ $t('computer.plugins.base_plugin.task_confirm_question') }}</span>
      <span v-if="scheduledParam">{{ $t('computer.plugins.base_plugin.scheduled_task_confirm_question') }}</span>
    </div>
    <template #footer>
      <Button :label="$t('computer.plugins.base_plugin.no')" icon="pi pi-times" @click="closeTaskDialog('cancel')" class="p-button-danger p-button-sm"/>
      <Button :label="$t('computer.plugins.base_plugin.yes')" icon="pi pi-check" @click="confirmTaskDialog" class="p-button-sm"/>
    </template>
  </Dialog>
  <div>
    <Card
      v-loading="loading" :element-loading-text="$t('computer.plugins.base_plugin.loading_default_text')"
      element-loading-spinner="fa fa-sync fa-spin" 
      element-loading-background="rgba(0, 0, 0, 0.7)">
      <template #title>
        <div class="p-d-flex p-jc-between">
          <div v-if="$slots.pluginHeader" style="font-size:15px;">
            <slot name="pluginHeader"></slot>
          </div>
          <div v-if="$slots.pluginHeaderButton">
            <slot name="pluginHeaderButton"></slot>
          </div>
        </div>
        <hr style="margin-bottom:-5px">
      </template>
      <template #content>
      <div>
        <slot></slot>
      </div>
      </template>
      
      <template #footer v-if="$slots.pluginFooter">
        <slot name="pluginFooter">
          <hr style="margin-top:5px">
          <div class="p-grid">
            <div class="p-col p-as-start">
              <a class="primary" type="secondary" @click="toggle" v-tooltip.right="$t('computer.plugins.plugin_popover.title')"><i class="el el-icon-question" ></i></a>
              <OverlayPanel ref="op" appendTo="body" :showCloseIcon="false" id="overlay_panel" style="width: 450px" :breakpoints="{'960px': '75vw'}">
                <div><h5>{{ $t('computer.plugins.plugin_popover.title') }}</h5></div>
                <ul>
                  <li><small>{{ pluginDescription }}</small></li>
                  <li><small>{{$t('computer.plugins.plugin_popover.for_schedled_task')}} => &nbsp;<i class="fas fa-clock"></i></small></li>
                </ul>
                <a :href="pluginUrl" type="primary" target="_blank" icon="el-icon-link">{{ $t('computer.plugins.plugin_popover.for_more_info') }}...</a>
              </OverlayPanel>
            </div>
            <div>
               <Button v-if="scheduledParam != null" 
               :title="$t('computer.scheduled.cancel')" 
               @click="cancelScheduledTask" 
               :label="$t('computer.scheduled.scheduled_task_plan')" 
               icon="el el-icon-loading" class="p-button-text p-button-sm">
               </Button>
            </div>
            <div class="p-col p-as-end">
              <base-scheduled
              @cancel-scheduled="scheduledTaskOperation" 
              @save-scheduled="scheduledTaskOperation">
            </base-scheduled>
            </div>
          </div>
        </slot>
      </template>
    </Card>
  </div>
</template>

<script>
/**
 * base-plugin component for liderahenk plugins. This component is child for other plugins. Use to base-plugin for send task to agent. 
 * @author Tuncay Çolak <tuncay.colak@tubitak.gov.tr>
 * @see {@link http://www.liderahenk.org/}
 */

import { mapGetters } from "vuex"
import axios from "axios";
import XmppClientManager  from '@/services/strophe.js';

export default {
  name: "base-plugin",
  data() {
    return {
      showScheduled: false,
      scheduled: true,
      scheduledParam: null,
      showDialog: false,
      toastLife: 5000,
      loading: false
    }
  },

  props: {
    pluginDescription: {
      type: String,
      default: "Liderahenk MYS",
      description: "Popover content for plugin description"
    },
    pluginUrl: {
      type: String,
      default: "https://www.liderahenk.org/",
      description: "url for plugin docs"
    },
    popoverWidth: {
      type: Number,
      default: 500,
      description: "Popover width size"
    },
    showTaskDialog: {
      type: Boolean,    
      default: false,
      description: "Informs users while preserving the current page state for sending task",
      required: true
    },
    pluginTask: {
      type: Object,
      description: "Plugin task object for send task",
    },
    executeTask: {
      type: Boolean,    
      default: false,
      description: "Execute task as automatically",
    }
  },

  computed: {
    ...mapGetters(["selectedAgent", "selectedAgentMessages"]),
  },

  methods: {
    confirmTaskDialog(){
      if (this.selectedAgent == null || this.selectedAgent.type != "AHENK" && this.selectedAgent.type != "GROUP" && this.selectedAgent.type != "WIND0WS_AHENK") {
        this.$toast.add({severity:'warn', detail: this.$t("computer.task.selected_agent_warn"), summary:this.$t("computer.task.toast_summary"), life: this.toastLife});
        this.closeTaskDialog("cancel");
        return;
      }
      this.closeTaskDialog("success");
      this.showScheduled = false;
      this.executeTaskManager();
    },

    // global axios post for send task to agent
    executeTaskManager() {
      var dnList = [];
      var entryList = [];
      entryList.push(this.selectedAgent);
      dnList.push(this.selectedAgent.distinguishedName);
      let task = {...this.pluginTask};
      task.dnList = dnList;
      task.entryList = entryList;
      task.cronExpression = this.scheduledParam;
      task.dnType = this.selectedAgent.type;
      
      axios.post(process.env.VUE_APP_URL + "/lider/task/execute",task)
        .then((response) => {
          if (response.data.status == 'OK') {
            if (this.selectedAgent.type == "AHENK") {
              if (this.selectedAgent.online) {
                if (!task.cronExpression) {
                  this.loading = true;
                  this.$toast.add({severity:'success', detail: this.$t("computer.task.send_task_susccess_message"), summary:this.$t("computer.task.toast_summary"), life: this.toastLife});
                } else {
                  this.$toast.add({severity:'success', detail: this.$t("computer.task.send_scheduled_task_susccess_message"), summary:this.$t("computer.task.toast_summary"), life: this.toastLife});
                }
              } else {
                this.$toast.add({severity:'success', detail: this.$t("computer.task.send_task_offline_message"), summary:this.$t("computer.task.toast_summary"), life: this.toastLife});
              }
            }
            if (this.selectedAgent.type == "GROUP") {
              this.$toast.add({severity:'success', detail: this.$t("computer.task.send_task_group_message"), summary:this.$t("computer.task.toast_summary"), life: this.toastLife});
            }
          } else {
            this.$toast.add({severity:'error', detail: this.$t("computer.task.send_task_error_message"), summary:this.$t("computer.task.toast_summary"), life: this.toastLife});
          }
      });
      this.scheduledParam = null;
    },

    /**
     * closeTaskDialog event as 'cancel' and 'success' emit when click No or Close button on confirm dialog
     * @event closeTaskDialog
     */
    closeTaskDialog(event) {
      this.$emit("closeTaskDialog", event);
    },

    scheduledTaskOperation(param){
      if (param != null) {
        this.scheduledParam = param;
      }
    },

    cancelScheduledTask() {
      this.scheduledParam = null;
      this.$toast.add({severity:'warn', detail: this.$t("computer.task.cancel_scheduled_task"), summary:this.$t("computer.task.toast_summary"), life: this.toastLife});
    },

    toggle(event) {
      this.$refs.op.toggle(event);
    },
  },

  watch: {
    showTaskDialog() {
      this.showDialog = this.showTaskDialog;
    },

    executeTask(){
      if (this.executeTask) {
        this.executeTaskManager();
        this.closeTaskDialog('success');
      }
    }
  },

  /**
   * taskResponse event emit when response from client
   * @event taskResponse
   */
  mounted(){
    XmppClientManager.getInstance().addListener('basePluginListener', (msg) => {
      var to = msg.getAttribute("to");
      var from = msg.getAttribute("from");
      var type = msg.getAttribute("type");
      var elems = msg.getElementsByTagName("body");

      if (type == "chat" && elems.length > 0) {
        var body = elems[0];
        var data = Strophe.xmlunescape(Strophe.getText(body));
        var response = JSON.parse(data);
        var type = "INFO";
        var dnParser = response.commandExecution.dn.split(",");
        var agentCn = dnParser[0].replace("cn=", "");
        if (response.result.responseCode == "TASK_ERROR") {
          type = "ERROR";
        }
        let responseMessage = response.result.responseMessage;
        if (response.commandClsId == this.pluginTask.commandId) {
          if (response.commandExecution.dn == this.selectedAgent.distinguishedName) {
            this.loading = false;
            if (response.result.responseCode === "TASK_PROCESSED") {
              this.$toast.add({severity:'success', detail: responseMessage, summary:this.$t("computer.task.toast_summary"), life: this.toastLife});
            } else if (response.result.responseCode === "TASK_ERROR") {
              this.$toast.add({severity:'error', detail: responseMessage, summary:this.$t("computer.task.toast_summary"), life: this.toastLife});
            }
            this.$emit("taskResponse", response);
          }
        }
      }
    });
  }
};
</script>

<style scoped>

</style>
