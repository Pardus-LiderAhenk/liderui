<template>
  <!-- <ConfirmDialog :closable="false"></ConfirmDialog> -->
  <Dialog :header="$t('computer.task.toast_summary')" v-model:visible="showDialog"  :modal="true" @hide="closeTaskDialog">
    <div class="confirmation-content">
      <i :class="scheduledParam == null ? 'pi pi-info-circle p-mr-3': 'pi pi-clock p-mr-3'" style="font-size: 2rem" />
      <span v-if="scheduledParam == null">{{ $t('computer.plugins.base_plugin.task_confirm_question') }}</span>
      <span v-if="scheduledParam">{{ $t('computer.plugins.base_plugin.scheduled_task_confirm_question') }}</span>
    </div>
    <template #footer>
      <Button :label="$t('computer.plugins.base_plugin.no')" icon="pi pi-times" @click="closeTaskDialog" class="p-button-danger p-button-sm"/>
      <Button :label="$t('computer.plugins.base_plugin.yes')" icon="pi pi-check" @click="confirmTaskDialog" class="p-button-sm" />
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
            <slot name="pluginHeader" ></slot>
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
              <el-popover placement="bottom" :width="popoverWidth" trigger="hover" :title="$t('computer.plugins.plugin_popover.title')" popper-class="plugin-popover"> 
                <template #reference>
                  <a class="primary" size="sm" type="secondary"><i class="el el-icon-question"></i></a>
                </template>
                <ul>
                  <li><small>{{ pluginDescription }}</small></li>
                  <li><small>{{$t('computer.plugins.plugin_popover.for_schedled_task')}} => &nbsp;<i class="fas fa-clock"></i></small></li>
                </ul>
                <el-link :href="pluginUrl" type="primary" target="_blank" icon="el-icon-link">  {{$t('computer.plugins.plugin_popover.for_more_info')}}...</el-link>
              </el-popover>
            </div>
            <div>
              <el-tag
                :key="tag"
                v-for="tag in dynamicTags"
                :title="$t('computer.scheduled.cancel')"
                closable
                :disable-transitions="true"
                @close="cancelScheduledTask(tag)" 
                size="small"
                type="default"
                effect="plain">
                <i class="el el-icon-loading"></i> {{tag}}
              </el-tag>
            </div>
            <div class="p-col p-as-end">
              <base-scheduled
              @cancel-scheduled="scheduledTaskOperation" 
              @save-scheduled="scheduledTaskOperation">
            </base-scheduled>
              <!-- <a class="primary" @click.prevent="showScheduled = true" style="float:right;" :title="$t('computer.scheduled.scheduled_task_plan')"><i class="fa fa-play"></i></a> -->
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

export default {
  name: "base-plugin",
  data() {
    return {
      dynamicTags: [],
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
    // loading: {
    //   type: Boolean,    
    //   default: false,
    //   description: "Show animation while sending task"
    // },
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
  },

  computed: {
    ...mapGetters(["selectedAgent"]),
  },

  methods: {
    /**
     * sendTask event emit when click Yes button on confirm dialog for execute task in agent
     * @event sendTask
     */
    confirmTaskDialog(event){
      if (this.selectedAgent == null || this.selectedAgent.type != "AHENK" && this.selectedAgent.type != "GROUP" && this.selectedAgent.type != "WIND0WS_AHENK") {
        this.$toast.add({severity:'warn', detail: this.$t("computer.task.selected_agent_warn"), summary:this.$t("computer.task.toast_summary"), life: this.toastLife});
        this.closeTaskDialog(event);
        return;
      }
      this.$emit("sendTask", this.selectedAgent, this.scheduledParam);
      this.showScheduled = false;
      if (this.dynamicTags.length > 0) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(''), 1);
      }
    // global axios post for send task to agent
      var dnList = [];
      var entryList = [];
      entryList.push(this.selectedAgent);
      dnList.push(this.selectedAgent.distinguishedName);
      let task = {...this.pluginTask};
      task.dnList = dnList;
      task.entryList = entryList;
      task.cronExpression = this.scheduledParam;
      task.dnType = this.selectedAgent.type;
      
      // console.log(task)
      axios.post(process.env.VUE_APP_URL + "/lider/task/execute",task)
        .then((response) => {
          if (response.data.status == 'OK') {
            if (this.selectedAgent.type == "AHENK") {
              if (this.selectedAgent.online) {
                this.loading = true;
                setTimeout(() => this.loading = false, 2000);
                this.$toast.add({severity:'success', detail: this.$t("computer.task.send_task_susccess_message"), summary:this.$t("computer.task.toast_summary"), life: this.toastLife});
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
     * cancelTask event emit when click No or Close button on confirm dialog
     * @event cancelTask
     */
    closeTaskDialog(event) {
      this.$emit("cancelTask", event);
    },

    scheduledTaskOperation(param){
      if (param != null) {
        this.scheduledParam = param;
        this.dynamicTags = [];
        this.dynamicTags.push(this.$t('computer.scheduled.scheduled_task_plan'));
        // this.dynamicTags.push('');
      }
    },

    cancelScheduledTask(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
      this.scheduledParam = null;
      this.$toast.add({severity:'warn', detail: this.$t("computer.task.cancel_scheduled_task"), summary:this.$t("computer.task.toast_summary"), life: this.toastLife});
    },
  },

  watch: {
    showTaskDialog() {
      this.showDialog = this.showTaskDialog;
    },
  },
};
</script>

<style scoped>

</style>
