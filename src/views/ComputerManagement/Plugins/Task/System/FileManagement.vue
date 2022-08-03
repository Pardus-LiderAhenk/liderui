<template>
  <div>
    <base-plugin
      :pluginUrl="pluginUrl"
      :pluginDescription="pluginDescription"
      :showTaskDialog="showTaskDialog"
      @close-task-dialog="showTaskDialog = false;"
      @task-response="fileManagementResponse"
      :pluginTask="task"
    >
      <template #pluginTitle>
        {{$t("computer.plugins.file_management.header")}}
      </template>
      <template #pluginTitleButton>
        <div>
          <Button
          icon="fa fa-save"
          class="p-button-raised p-button-sm"
          :title="$t('computer.plugins.file_management.save')"
          @click.prevent="sendTaskFileManagement('WRITE_TO_FILE')"
          >
          </Button>
        </div>
      </template> 
      <template #default>
        <div class="p-grid  p-flex-column">
          <div class="p-fluid p-formgrid p-grid p-col">
            <div class="p-field p-col-12 p-md-4">
              <label>{{$t('computer.plugins.file_management.favorites')}}</label>
              <Dropdown
              v-model="selectedFilePath" 
              :options="favorites" optionLabel="label"
              :showClear="true" :filter="true" 
              :placeholder="$t('computer.plugins.file_management.favorites')" 
              filterPlaceholder="Find File"
              @change="changeFilePath">
              </Dropdown>
            </div>
            <div class="p-field p-col-12 p-md-8">
              <label>{{$t('computer.plugins.file_management.file_path')}}</label>
              <div class="p-inputgroup">
                <InputText type="text" 
                v-model="filePath" 
                :class="pathValidation ? 'p-invalid p-inputtext-sm': 'p-inputtext-sm'" 
                placeholder="/tmp/example.txt"
                />
                <Button type="button"
                 class="p-button-sm" 
                 :label="$t('computer.plugins.file_management.search')" 
                 icon="pi pi-search" 
                 @click.prevent="sendTaskFileManagement('GET_FILE_CONTENT')" 
                />
              </div>
              <small v-if="pathValidation" class="p-error">{{ $t('computer.plugins.file_management.file_path_warn') }}</small>
            </div>
          </div>
          <div class="p-col">
            <Textarea v-model="fileContent"  style="height: 320px; width:100%" />
          </div>
        </div>
      </template>
      <template #pluginFooter>
      </template>
    </base-plugin>
  </div>
</template>

<script>

/**
 * File Managament Plugin. Get file content of entered file path and create new file with file content
 * commandId: GET_FILE_CONTENT, WRITE_TO_FILE
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
      lockRootUser: true,
      pathValidation: false,
      pluginDescription: this.$t('computer.plugins.file_management.description'),
      pluginUrl: "https://docs.liderahenk.org/lider3.0/computerManagement/computerManagement/fileManagement/",
      selectedFilePath: '',
      filePath: '',
      fileContent: '',
      favorites: [
        {label: 'hosts', value: '/etc/hosts'},
        {label: 'resolv.conf', value: '/etc/resolv.conf'},
        {label: 'sources.list', value: '/etc/apt/sources.list'},
        {label: 'sssd.conf', value: '/etc/sssd/sssd.conf'},
        {label: 'sshd_config', value: '/etc/ssh/sshd_config'}
      ],
      selectedTextType: {label: 'text', value: 'textValue'},
    }
  },

  methods: {
    sendTaskFileManagement(commandId){
      this.pathValidation = false;
      if (this.filePath == "" || this.filePath == null) {
        this.pathValidation = true;
        return true;
      }
      this.task.commandId = commandId;
      if (commandId == "WRITE_TO_FILE") {
        this.task.parameterMap = {
          "file-path": this.filePath,
          "file-content": this.fileContent
        };
      } else {
        this.task.parameterMap = {"file-path": this.filePath};
      }
      this.showTaskDialog = true;
    },

    changeFilePath(event){
      if (event.value) {
        this.filePath = this.selectedFilePath.value;
      } else {
        this.filePath = "";
      }
    },

    fileManagementResponse(message) {
      if (message.commandClsId == "GET_FILE_CONTENT") {
        var arrg = JSON.parse(message.result.responseDataStr);
        if (arrg != null) {
          this.fileContent = arrg["file_content"];
        }
      }
    }
  },
  watch: {
    filePath(){
      if (this.filePath) {
        this.pathValidation = false;
      } 
    },
  },
};
</script>

<style scoped>

</style>
