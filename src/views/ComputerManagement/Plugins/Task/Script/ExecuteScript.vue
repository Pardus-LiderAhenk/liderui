<template>
<div>
  <Dialog 
    :header="$t('computer.plugins.execute_script.use_parameter')" 
    v-model:visible="scriptParameterDialog" 
    :modal="true" 
    :style="{width: '30vw'}"
    >
      <div class="p-fluid">
        <div class="p-field">
          <label for="scriptParams">{{$t('computer.plugins.execute_script.define_parameter')}}</label>
          <InputText 
          type="text"
          v-model="scriptParams" 
          :class="validationScriptParams ? 'p-invalid': ''" 
          />
          <small v-if="validationScriptParams" class="p-error">
            {{$t('computer.plugins.execute_script.valiadation_script_params')}}
          </small>
        </div>
      </div>
      <template #footer>
        <Button 
        :label="$t('computer.plugins.execute_script.no')" 
        icon="pi pi-times" 
        @click.prevent="sendTaskExecuteScript(false)" 
        class="p-button-text p-button-sm"
        />
        <Button 
        :label="$t('computer.plugins.execute_script.yes')" 
        icon="pi pi-check" 
        @click.prevent="sendTaskExecuteScript(true)" 
        class="p-button-sm" 
        />
      </template>
    </Dialog>
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
         :executeScriptButton="true"
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
      scriptParameterDialog: false,
      validationScriptParams: false,
      scriptParams: "",
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
      this.scriptParams = "";
      this.validationScriptParams = false;
      this.scriptParameterDialog = true;
    },
  
    sendTaskExecuteScript(useParameter) {
      if (useParameter) {
        if (!this.scriptParams.trim()){
          this.validationScriptParams = true;
          return;
        }
      }
      this.scriptParameterDialog = false;
      this.task.commandId = "EXECUTE_SCRIPT"
      this.task.parameterMap={
        "SCRIPT_FILE_ID": this.selectedScript.id,
        "SCRIPT_TYPE": this.selectedScript.scriptType,
        "SCRIPT_CONTENTS": this.selectedScript.contents,
        "SCRIPT_PARAMS": this.scriptParams
      };
      this.showTaskDialog = true;
    },
  },

  watch: {
    scriptParams(){
      if (this.scriptParams.trim()){
        this.validationScriptParams = false;
      }      
    }      
  }
}
</script>

<style>

</style>