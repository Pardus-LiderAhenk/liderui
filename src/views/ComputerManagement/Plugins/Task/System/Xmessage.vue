<template>
  <div>
    <base-plugin
      :pluginUrl="pluginUrl"
      :pluginDescription="pluginDescription"
      :showTaskDialog="showTaskDialog"
      @close-task-dialog="showTaskDialog = false;"
      :pluginTask="task"
    >
      <template #pluginHeader>
        {{$t("computer.plugins.xmessage.header")}}
      </template>
      <template #pluginHeaderButton>
        <div>
          <Button
          icon="pi pi-send"
          class="p-button-raised p-button-sm"
          :title="$t('computer.plugins.xmessage.send_message')"
          @click.prevent="sendTaskXmessage"
          >
          </Button>
        </div>
      </template> 
      <template #default>
        <Textarea v-model="message"  style="height: 320px; width:100%" />
        <small v-if="messageValidation" class="p-error">{{ $t('computer.plugins.xmessage.message_content_warn') }}</small>
      </template>
      <template #pluginFooter>
      </template>
    </base-plugin>
  </div>
</template>

<script>

/**
 * Xmessage Plugin. Send instant message to client
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
    this.task = {...this.pluginTask};
  },

  data() {
    return {
      task: null,
      showTaskDialog: false,
      pluginDescription: this.$t('computer.plugins.xmessage.description'),
      pluginUrl: "https://docs.liderahenk.org/lider-ahenk-docs/liderv2/computer_management/sistem/anlik_mesaj/",
      message: '',
      messageValidation: false
    }
  },

  methods: {
    sendTaskXmessage(){
      if (this.message == "" || this.message == null) {
        this.messageValidation = true;
        return true;
      }
      var messageContent= this.message;
      if (messageContent.includes("'")) {
        messageContent = messageContent.replaceAll("'", "'\\''");
      }
      if (messageContent.includes('"')) {
        messageContent = messageContent.replaceAll('"', '"\\""');
      }
      this.task.commandId = "EXECUTE_XMESSAGE";
      this.task.parameterMap = {"message": messageContent}
      this.showTaskDialog = true;
    },
  },
  watch: {
    message(){
      if (this.message == "" || this.message == null) {
        this.messageValidation = true;
      } else {
        this.messageValidation = false;
      }
    },
  },
};
</script>

<style scoped>

</style>
