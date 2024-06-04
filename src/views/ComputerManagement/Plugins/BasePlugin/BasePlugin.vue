<template>
  <base-scheduled v-if="showScheduled"
    @close-scheduled="showScheduled = false" 
    @save-scheduled="scheduledTaskOperation"
    :showScheduled="showScheduled">
  </base-scheduled>
  <Dialog :style="{width: '20vw'}"
    :header="$t('computer.task.toast_summary')" 
    v-model:visible="showDialog"  
    :modal="true" 
    @hide="closeTaskDialog('cancel')"
  >
    <div class="p-field">
      <div class="confirmation-content"  v-if="scheduledParam == null">
        <i class="pi pi-info-circle mr-3" style="font-size: 1.5rem"></i>&nbsp;
        <span>
          {{ $t('computer.plugins.base_plugin.task_confirm_question') }}
        </span>
      </div>
      <div class="confirmation-content"  v-if="scheduledParam">
        <i class="pi pi-clock mr-3" style="font-size: 1.5rem"></i>&nbsp;
        <span>
          {{ $t('computer.plugins.base_plugin.scheduled_task_confirm_question') }}
        </span>
      </div>
    </div>
    <div class=" confirmation-content" v-if="selectedNodeType == 'computerGroup'">
      <Checkbox  id="taskParts" v-model="taskParts" :binary="true" />&nbsp;&nbsp;
        <label  for="taskParts">{{$t("computer.plugins.base_plugin.send_part_task")}}</label>
    </div>
        
    <template #footer>
      <Button 
        :label="$t('computer.plugins.base_plugin.no')" 
        icon="pi pi-times" 
        @click="closeTaskDialog('cancel')" 
        class="p-button-text p-button-sm"
      />
      <Button 
       :label="$t('computer.plugins.base_plugin.yes')"
       icon="pi pi-check" 
       @click="confirmTaskDialog"
       class="p-button-sm"
       />
    </template>
  </Dialog>
  <div>
    <!-- <Card
      v-loading="loading" :element-loading-text="$t('computer.plugins.base_plugin.loading_default_text')"
      element-loading-spinner="fa fa-sync fa-spin" 
      element-loading-background="rgba(0, 0, 0, 0.7)"
    > -->
    <Card>
      <template #header v-if="$slots.pluginHeader">
        <slot name="pluginHeader">
        </slot>
      </template>
      <template #title>
        <div class="p-d-flex p-jc-between">
          <div v-if="$slots.pluginTitle" style="font-size:15px;">
            <slot name="pluginTitle"></slot>
          </div>
          <div v-if="$slots.pluginTitleButton">
            <slot name="pluginTitleButton"></slot>
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
              <a class="primary" type="secondary" @click="toggle" 
                v-tooltip.right="$t('computer.plugins.plugin_popover.title')">
                <i class="el el-icon-question"></i>
              </a>
              <OverlayPanel ref="op" 
                appendTo="body" 
                :showCloseIcon="false" 
                id="overlay_panel" 
                style="width: 450px" 
                :breakpoints="{'960px': '75vw'}"
              >
                <div><h5>{{ $t('computer.plugins.plugin_popover.title') }}</h5></div>
                <ul>
                  <li>
                    <small>{{ pluginDescription }}</small>
                  </li>
                  <li>
                    <small>
                      {{$t('computer.plugins.plugin_popover.for_schedled_task')}} => &nbsp;<i class="fas fa-clock"></i>
                    </small>
                  </li>
                </ul>
                <i class="pi pi-link"></i>&nbsp;<a :href="pluginUrl" type="primary" target="_blank">
                  {{ $t('computer.plugins.plugin_popover.for_more_info') }}...
                </a>
              </OverlayPanel>
            </div>
            <div>
               <Button v-if="scheduledParam != null" 
                @click="cancelScheduledTask" 
                :label="$t('computer.scheduled.cancel')" 
                icon="pi pi-times" class="p-button-text p-button-sm"
                v-tooltip.left="$t('computer.scheduled.title')+': \n' + scheduledParam">
               </Button>
            </div>
            <!-- <div v-if="loading">
              <i style="font-size: 1.5rem" class="el el-icon-loading"></i>&nbsp;
              <a class="primary">
                {{$t('computer.plugins.base_plugin.loading_default_text')}}
              </a>
            </div> -->
            <div v-if="loading">
              <ProgressSpinner
                style="width: 20px; height: 20px"
                strokeWidth="8"
                fill="var(--surface-ground)"
                animationDuration=".5s"
              />
              <a class="primary">
                &nbsp;{{$t('computer.plugins.base_plugin.loading_default_text')}}
              </a>
            </div>
            <div class="p-col p-as-end">
              <a class="primary" 
                @click.prevent="showScheduled = true" 
                style="float:right;" 
                v-tooltip.left="$t('computer.scheduled.scheduled_task_plan')">
                <i class="fas fa-clock"></i>
              </a>
              
            </div>
          </div>
        </slot>
        <!-- <ProgressBar v-if="loading" mode="indeterminate" style="height: .5em" /> -->
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
import { getLiderWs } from "@/libs/liderws";


export default {
  name: "base-plugin",
  data() {
    return {
      showScheduled: false,
      scheduled: true,
      scheduledParam: null,
      showDialog: false,
      toastLife: 5000,
      loading: false,
      selectedNode: null,
      taskParts: false,
      wsSubscription: null,
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
    },
    executeTaskUrl: {
      type: String,
      default: "/api/lider/task/execute",
      description: "url for execute task"
    },
    listenerName: {
      type: String,
      default: "basePluginListener",
      description: "listener for plugin"
    },

    selectedAgentNode: {
      type: Object,
      default: null,
      description: "Selected agent node for send task"
    }
  },

  computed: {
    ...mapGetters(["selectedLiderNode", "selectedNodeType", "selectedComputerGroupNode", "getUser"]),
  },

  methods: {
    fillNode(){
      if (this.selectedNodeType == "computer") {
        this.selectedNode = this.selectedLiderNode;
      } else if (this.selectedNodeType == "computerGroup") {
        this.selectedNode = this.selectedComputerGroupNode;
      }

      if (this.selectedAgentNode) {
        this.selectedNode = this.selectedAgentNode;
      }
    },
    confirmTaskDialog(){
      if (this.selectedNodeType == "computer") {
        this.selectedNode = this.selectedLiderNode;
        if (this.selectedAgentNode) {
          this.selectedNode = this.selectedAgentNode;
        }
        if (this.selectedLiderNode == null || 
          this.selectedLiderNode.type != "AHENK" && 
          this.selectedLiderNode.type != "WIND0WS_AHENK") {
          this.$toast.add({
            severity:'warn', 
            detail: this.$t("computer.task.selected_agent_warn"), 
            summary:this.$t("computer.task.toast_summary"), 
            life: this.toastLife
          });
          this.closeTaskDialog("cancel");
          return;
        }
      } else if (this.selectedNodeType == "computerGroup") {
        this.selectedNode = this.selectedComputerGroupNode;
        if (this.selectedAgentNode) {
          this.selectedNode = this.selectedAgentNode;
        }
         if (this.selectedComputerGroupNode == null || 
          this.selectedComputerGroupNode.type != "GROUP") {
          this.$toast.add({
            severity:'warn', 
            detail: this.$t("computer.task.selected_agent_group_warn"), 
            summary:this.$t("computer.task.toast_summary"), 
            life: this.toastLife
          });
          this.closeTaskDialog("cancel");
          return;
        }
      }

      this.closeTaskDialog("success");
      this.showScheduled = false;
      this.executeTaskManager();
    },

    // global axios post for send task to agent
    executeTaskManager() {
      var dnList = [];
      var entryList = [];
      entryList.push(this.selectedNode);
      dnList.push(this.selectedNode.distinguishedName);
      let task = {...this.pluginTask};
      task.dnList = dnList;
      task.entryList = entryList;
      task.cronExpression = this.scheduledParam;
      task.dnType = this.selectedNode.type;
      task.taskParts = this.taskParts;
      
      axios.post(this.executeTaskUrl,task).then((response) => {
        if (response.data.status == 'OK') {
          if (this.selectedNode.type == "AHENK") {
            if (this.selectedNode.online) {
              if (!task.cronExpression) {
                this.loading = true;
                this.$toast.add({
                  severity:'success', 
                  detail: this.$t("computer.task.send_task_susccess_message"), 
                  summary:this.$t("computer.task.toast_summary"), 
                  life: this.toastLife
                });
              } else {
                this.$toast.add({
                  severity:'success', 
                  detail: this.$t("computer.task.send_scheduled_task_susccess_message"), 
                  summary:this.$t("computer.task.toast_summary"), 
                  life: this.toastLife
                });
              }
            } else {
              this.$toast.add({
                severity:'success', 
                detail: this.$t("computer.task.send_task_offline_message"), 
                summary:this.$t("computer.task.toast_summary"), 
                life: this.toastLife
              });
            }
          }
          if (this.selectedNode.type == "GROUP") {
            this.$toast.add({
              severity:'success', 
              detail: this.$t("computer.task.send_task_group_message"), 
              summary:this.$t("computer.task.toast_summary"), 
              life: this.toastLife
            });
          }
        } else {
          this.$toast.add({
            severity:'error', 
            detail: this.$t("computer.task.send_task_error_message"), 
            summary:this.$t("computer.task.toast_summary"), 
            life: this.toastLife
          });
        }
      })
      .catch((error) => {
        this.$toast.add({
          severity:'error', 
          detail: this.$t("computer.task.send_task_error_message")+"\n"+error, 
          summary:this.$t("computer.task.toast_summary"), 
          life: this.toastLife
        });
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
      this.showScheduled = false;
      if (param != null) {
        this.scheduledParam = param;
      }
    },

    cancelScheduledTask() {
      this.scheduledParam = null;
      this.$toast.add({
        severity:'warn', 
        detail: this.$t("computer.task.cancel_scheduled_task"), 
        summary:this.$t("computer.task.toast_summary"), 
        life: this.toastLife
      });
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
        this.fillNode();
        this.executeTaskManager();
        this.closeTaskDialog('success');
      }
    }
  },

  /**
   * taskResponse event emit when response from client
   * @event taskResponse
   */
  mounted() {
    let toastSummary = this.$t('computer.task.toast_summary');
    let toastLife = this.toastLife;
    this.wsSubscription = getLiderWs().subscribe((response) => {
      let selectedDn = null;
      let nodeType = null;
      if (this.selectedNodeType == "computer") {
        if (this.selectedLiderNode) {
          selectedDn = this.selectedLiderNode.distinguishedName; 
          nodeType = this.selectedLiderNode.type;
        }
      } else if (this.selectedNodeType == "computerGroup") {
        if (this.selectedComputerGroupNode) {
          selectedDn = this.selectedComputerGroupNode.distinguishedName;
          nodeType = this.selectedComputerGroupNode.type;
        }
      }

      let responseMessage = response.result.responseMessage;
      if (response.commandClsId === this.pluginTask.commandId && this.getUser.uid === response.recipient) {
        if (response.result.responseCode === "TASK_PROCESSED") {
          this.$toast.add({
            severity:'success', 
            detail: responseMessage, 
            summary: toastSummary, 
            life: toastLife
          });
        } else if (response.result.responseCode === "TASK_ERROR") {
          this.$toast.add({
            severity:'error', 
            detail: responseMessage, 
            summary: toastSummary, 
            life: toastLife
          });
        }
        this.loading = false;
        if (response.commandExecution.dn === selectedDn) {
          this.$emit("taskResponse", response);
        }
        if (nodeType === "GROUP" && response.commandClsId === "CHECK_PACKAGE") {
          this.$emit("taskResponse", response);
        }
      }
    });
  },

  unmounted () {
    if (this.wsSubscription) {
      getLiderWs().unsubscribe(this.wsSubscription);
      this.wsSubscription = null;
    }
  }
};
</script>

<style lang="scss" scoped>
.confirmation-content {
    display: flex;
    align-items: center;
    // justify-content: center;
}
</style>
