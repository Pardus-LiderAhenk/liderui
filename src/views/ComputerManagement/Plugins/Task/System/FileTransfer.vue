<template>
  <div>
    <base-plugin
      :pluginUrl="pluginUrl"
      :pluginDescription="pluginDescription"
      :showTaskDialog="showTaskDialog"
      @send-task="sendManageRootTask"
      @cancel-task="showTaskDialog = false"
      :pluginTask="task"
    >
      <template #pluginTitle>
        {{ $t("computer.plugins.file_transfer.header") }}
      </template>
      <template #pluginTitleButton>
        <Button
          icon="pi pi-share-alt"
          class="p-button-raised p-button-sm"
          :title="$t('computer.plugins.file_transfer.share_button')"
          @click.prevent="sendTaskFileTransfer"
        >
        </Button>
      </template>
      <template #default>
        <div class="p-grid p-flex-column">
          <div class="p-col" >
            <FileUpload
              name="demo[]"
              mode="basic"
              :maxFileSize="20000000"
              fileLimit="1"
              :chooseLabel="$t('computer.plugins.file_transfer.add_file')"
              :showUploadButton="false"
              :showCancelButton="false"
              @select="onUpload"
              @uploader="asd"
              :customUpload="true"
              :invalid_file_size_message="'{0}: '+$t('computer.plugins.file_transfer.share_button')+' {1}'"
              >
            </FileUpload>
          </div>
          <div class="p-grid p-formgrid p-fluid p-col">
            <div class="p-field p-col">
              <label>{{$t('computer.plugins.file_transfer.destination_folder')}}</label>
                <InputText id="firstname4" type="text" class="p-inputtext-sm" placeholder="/tmp/example"/>
            </div>
          </div>
          <div class="p-col">
            <div class="p-grid p-ai-stretch vertical-container p-col">
              <Fieldset :legend="$t('computer.plugins.file_transfer.user_permissions')" class="p-col">
                <div class="p-field-checkbox">
                  <Checkbox id="binary" v-model="readUser" :binary="true"/>
                  <label for="binary">{{$t('computer.plugins.file_transfer.read')}}</label>
                </div>
                <div class="p-field-checkbox">
                  <Checkbox id="binary" v-model="writeUser" :binary="true"/>
                  <label for="binary">{{$t('computer.plugins.file_transfer.write')}}</label>
                </div>
                <div class="p-field-checkbox">
                  <Checkbox id="binary" v-model="executeUser" :binary="true"/>
                  <label for="binary">{{$t('computer.plugins.file_transfer.execute')}}</label>
                </div>
                <div class="p-inputgroup">
                  <span class="p-inputgroup-addon">
                    <i class="pi pi-user"></i>
                  </span>
                  <InputText placeholder="Username" v-model="ownerUser" class="p-inputtext-sm"/>
                </div>
              </Fieldset>
              <Fieldset :legend="$t('computer.plugins.file_transfer.group_permissions')" class="p-col">
                <div class="p-field-checkbox">
                  <Checkbox id="binary" v-model="readGroup" :binary="true"/>
                  <label for="binary">{{$t('computer.plugins.file_transfer.read')}}</label>
                </div>
                <div class="p-field-checkbox">
                  <Checkbox id="binary" v-model="writeGroup" :binary="true"/>
                  <label for="binary">{{$t('computer.plugins.file_transfer.write')}}</label>
                </div>
                <div class="p-field-checkbox">
                  <Checkbox id="binary" v-model="executeGroup" :binary="true"/>
                  <label for="binary">{{$t('computer.plugins.file_transfer.execute')}}</label>
                </div>
                <div class="p-inputgroup">
                  <span class="p-inputgroup-addon">
                    <i class="el el-icon-coin"></i>
                  </span>
                  <InputText placeholder="Group Name" v-model="ownerGroup" class="p-inputtext-sm"/>
                </div>
              </Fieldset>
              <Fieldset :legend="$t('computer.plugins.file_transfer.other_permissions')" class="p-col">
                <div class="p-field-checkbox">
                  <Checkbox id="binary" v-model="readOther" :binary="true"/>
                  <label for="binary">{{$t('computer.plugins.file_transfer.read')}}</label>
                </div>
                <div class="p-field-checkbox">
                  <Checkbox id="binary" v-model="writeOther" :binary="true"/>
                  <label for="binary">{{$t('computer.plugins.file_transfer.write')}}</label>
                </div>
                <div class="p-field-checkbox">
                  <Checkbox id="binary" v-model="executeOther" :binary="true"/>
                  <label for="binary">{{$t('computer.plugins.file_transfer.execute')}}</label>
                </div>
              </Fieldset>
            </div>
          </div>
        </div>
      </template>
      <template #pluginFooter></template>
    </base-plugin>
  </div>
</template>

<script>
/**
 * File Transfer Plugin. You can share file to client. File size should be smaller than 20 MB
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

  data() {
    return {
      demo: [],
      showTaskDialog: false,
      task: null,
      localPath: '',
      remotePath: '',
      fileName: '',
      encodedFile: '',
      validationErrors: {},
      readUser: false,
      writeUser: false,
      executeUser: false,
      ownerUser: '',
      readGroup: false,
      writeGroup: false,
      executeGroup: false,
      ownerGroup: '',
      readOther: false,
      writeOther: false,
      executeOther: false,
      pluginDescription: this.$t("computer.plugins.file_transfer.description"),
      pluginUrl: "https://docs.liderahenk.org/lider-ahenk-docs/liderv2/computer_management/sistem/dosya_paylasimi/",
      };
    },

  created() {
    this.task = { ...this.pluginTask };
  },

  methods:{
    onUpload(event){
      console.log(event)
      this.fileName = event.files[0].name;
      var reader = new FileReader();
      // var selectedFile = this.files[0];
      reader.onload = function () {
        var comma = this.result.indexOf(',');
        this.encodedFile = this.result.substr(comma + 1);
      }
      reader.readAsDataURL(this.fileName);
      console.log(this.encodedFile)
      console.log(this.demo)
    },

    asd(event){
      console.log(event)
    },

    sendTaskFileTransfer() {
      this.task.parameterMap = {};
      if (this.readUser || this.writeUser || this.executeUser || !this.ownerUser.trim()) {
        this.task.parameterMap.editUserPermissions = true;
        this.task.parameterMap.readUser = this.readUser;
        this.task.parameterMap.writeUser = this.writeUser;
        this.task.parameterMap.executeUser = this.executeUser;
        this.task.parameterMap.ownerUser = this.ownerUser;
      }
      if (this.readGroup || this.writeGroup || this.executeGroup || !this.ownerGroup.trim()) {
        this.task.parameterMap.editGroupPermissions = true;
        this.task.parameterMap.readGroup = this.readGroup;
        this.task.parameterMap.writeGroup = this.writeGroup;
        this.task.parameterMap.executeGroup = this.executeGroup;
        this.task.parameterMap.ownerGroup = this.ownerGroup;
      }
      if (this.readOther || this.writeOther || this.executeOther) {
        this.task.parameterMap.editOtherPermissions = true;
        this.task.parameterMap.readOther = this.readOther;
        this.task.parameterMap.writeOther = this.writeOther;
        this.task.parameterMap.executeOther = this.executeOther;
      }
      if (!this.remotePath.endsWith("/")) {
        this.remotePath = this.remotePath + "/";
      }
      this.task.parameterMap.fileName = this.fileName;
      this.task.parameterMap.localPath = this.remotePath;
      this.task.parameterMap.encodedFile = encodedFile;
    }
  }
};
</script>

<style scoped>
</style>

