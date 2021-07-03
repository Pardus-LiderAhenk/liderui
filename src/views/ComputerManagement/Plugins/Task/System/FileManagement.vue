<template>
  <div>
    <base-plugin
      :pluginUrl="pluginUrl"
      :pluginDescription="pluginDescription"
      :showTaskDialog="showTaskDialog"
      @send-task="sendFileManagementTask"
      @cancel-task="showTaskDialog = false"
      :pluginTask="task"
    >
      <template #pluginHeader>
        {{$t("computer.plugins.file_management.header")}}
      </template>
      <template #pluginHeaderButton>
        <div>
          <Button
          icon="fa fa-save"
          class="p-button-raised p-button-sm"
          :title="$t('computer.plugins.file_management.save')"
          @click.prevent="showConfirmDialogForTask('WRITE_TO_FILE')"
          >
          </Button>
        </div>
      </template> 
      <template #default>
        <div class="p-grid  p-flex-column">
          <div class="p-fluid p-formgrid p-grid p-col">
            <div class="p-field p-col-12 p-md-2">
              <label>{{$t('computer.plugins.file_management.text_type')}}</label>
              <Dropdown
              v-model="selectedTextType" 
              :options="textType" optionLabel="label"
              />
            </div>
            <div class="p-field p-col-12 p-md-4">
              <label>{{$t('computer.plugins.file_management.favorites')}}</label>
              <Dropdown
              v-model="selectedFilePath" 
              :options="favorites" optionLabel="label"
              :showClear="true" :filter="true" :placeholder="$t('computer.plugins.file_management.favorites')" filterPlaceholder="Find File"
              @change="changeFilePath">
              </Dropdown>
            </div>
            <div class="p-field p-col-12 p-md-6">
              <label>{{$t('computer.plugins.file_management.file_path')}}</label>
              <div class="p-inputgroup">
                <InputText type="text" v-model="filePath" :class="pathValidation ? 'p-invalid p-inputtext-sm': 'p-inputtext-sm'" placeholder="/tmp/example.txt"/>
                <Button type="button" class="p-button-sm" :label="$t('computer.plugins.file_management.search')" icon="pi pi-search" @click.prevent="showConfirmDialogForTask('GET_FILE_CONTENT')" />
              </div>
              <small v-if="pathValidation" class="p-error">{{ $t('computer.plugins.file_management.file_path_warn') }}</small>
            </div>
          </div>
          <div class="p-col">
            <Editor v-if="selectedTextType.label == 'html'" v-model="fileContent" editorStyle="height: 320px" @text-change="textChange"></Editor>
            <Editor v-if="selectedTextType.label == 'text'" v-model="fileContent" editorStyle="height: 320px" @text-change="textChange">
              <template  #toolbar>
              <span>Text mode</span>
            </template>
            </Editor>
          </div>
        </div>
      </template>
      <template #pluginFooter>
      </template>
    </base-plugin>
  </div>
</template>

<script>

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
      pluginUrl: "https://docs.liderahenk.org/lider-ahenk-docs/liderv2/computer_management/sistem/dosya_yonetimi/",
      selectedFilePath: '',
      filePath: "",
      fileContent: '',
      favorites: [
        {label: 'hosts', value: '/etc/hosts'},
        {label: 'resolv.conf', value: '/etc/resolv.conf'},
        {label: 'sources.list', value: '/etc/apt/sources.list'},
        {label: 'sssd.conf', value: '/etc/sssd/sssd.conf'},
        {label: 'sshd_config', value: '/etc/ssh/sshd_config'}
      ],
      textType: [
        {label: 'text', value: 'textValue'},
        {label: 'html', value: 'htmlValue'}
      ],
      selectedTextType: {label: 'text', value: 'textValue'},
    }
  },

  methods: {
    showConfirmDialogForTask(commandId){
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

    sendFileManagementTask() {
      this.showTaskDialog = false;
    },

    textChange(value) {
      if (this.selectedTextType.label == "html") {
        this.fileContent = value.htmlValue;
      } else {
        this.fileContent = value.textValue;
      }
    },

    changeFilePath(event){
      if (event.value) {
        this.filePath = this.selectedFilePath.value;
      } else {
        this.filePath = "";
      }
    },
  },
  watch: {
    filePath(){
      if (this.filePath == "" || this.filePath == null) {
        this.pathValidation = true;
      } else {
        this.pathValidation = false;
      }
    }
  },
};
</script>

<style scoped>
#scrolling-container {
  height: 100%;
  min-height: 100%;
  overflow-y: auto;
}
</style>
