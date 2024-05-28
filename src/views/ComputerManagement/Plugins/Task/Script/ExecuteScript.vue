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
        {{ $t("computer.plugins.execute_script.header") }}
    </template>
     <template #default>
        <script-definitions
         :scriptDefinitionTitle="false"
         :isExecuteScript="true"
         @execute-script="executeScript"
        >
        </script-definitions>
     </template>
     <template #pluginFooter> </template>
    </base-plugin>
</div>
</template>

<script>

/**
 * Script Plugin. Allows to execute custom script file as python, bash, perl and ruby 
 * commandId: EXECUTE_SCRIPT
 * @see {@link http://www.liderahenk.org/}
 * use to ScriptDefinition component
 *
 */

import ScriptDefinitions from "@/views/Settings/ScriptDefinitions/ScriptDefinitions.vue"

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
      selectedScript: "",
      pluginDescription: this.$t("computer.plugins.execute_script.description"),
      pluginUrl:"https://docs.liderahenk.org/lider3.0/computerManagement/computerManagement/script/",
    };
  },

  components: {
      ScriptDefinitions
  },

  methods: {
    executeScript(data){
      this.selectedScript = data;
      this.sendTaskExecuteScript();
    },
  
    sendTaskExecuteScript() {
      this.task.commandId = "EXECUTE_SCRIPT"
      this.task.parameterMap={
        "SCRIPT_FILE_ID": this.selectedScript.id,
        "SCRIPT_TYPE": this.selectedScript.scriptType,
        "SCRIPT_CONTENTS": this.selectedScript.contents,
        "SCRIPT_PARAMS": this.selectedScript.scriptParams
      };
      this.showTaskDialog = true;
    },
  },
}
</script>

<style>

</style>