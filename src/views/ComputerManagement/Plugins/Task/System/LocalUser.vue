<template>
  <div>
    <Dialog :header="$t('computer.plugins.local_user.home_directory_dialog_title')" v-model:visible="deleteHomeDialog" :modal="true" :style="{width: '500px'}">
      <i class="pi pi-home p-mr-3" style="font-size: 2rem" />
      <span> {{ $t('computer.plugins.local_user.home_directory_dialog_content') }}</span>
      <template #footer>
        <Button :label="$t('computer.plugins.base_plugin.no')" icon="pi pi-times" @click="deleteUser(false)" class="p-button-danger p-button-sm"/>
        <Button :label="$t('computer.plugins.base_plugin.yes')" icon="pi pi-check" @click="deleteUser(true)" class="p-button-sm" />
      </template>
    </Dialog>
    <Dialog :header="selectedUser ? username: $t('computer.plugins.local_user.add_user')" v-model:visible="showUserDialog" :modal="true" :style="{width: '500px'}" >
      <div>
        <div class="p-field p-grid">
          <label class="p-col" ><i class="pi pi-user"></i>&nbsp;{{ $t('computer.plugins.local_user.username') }}</label>
          <div class="p-col">
            <div>
              <InputText v-model="username" :class="validationErrors.username ? 'p-invalid p-inputtext-sm': 'p-inputtext-sm'" placeholder="lider"/>
            </div>
            <div>
              <small v-show="validationErrors.username" class="p-error">{{ $t('computer.plugins.local_user.username_validation') }}</small>
            </div>
          </div>
        </div>
        <div class="p-field p-grid">
          <label class="p-col" ><i class="pi pi-home"></i> &nbsp;{{ $t('computer.plugins.local_user.home_directory') }}</label>
          <div class="p-col">
            <div>
              <InputText v-model="home" :class="validationErrors.home ? 'p-invalid p-inputtext-sm': 'p-inputtext-sm'" placeholder="/home/lider"/>
            </div>
            <div>
              <small v-show="validationErrors.home" class="p-error">{{ $t('computer.plugins.local_user.home_directory_validation') }}</small>
            </div>
          </div>
        </div>
        <div class="p-field p-grid">
          <label class="p-col" ><i class="pi pi-lock"></i> &nbsp;{{ $t('computer.plugins.password.new_password') }}</label>
          <div class="p-col">
            <div>
              <div class="p-inputgroup">
                <Password v-model="newPassword" toggleMask :class="validationErrors.new_password ? 'p-invalid p-inputtext-sm': 'p-inputtext-sm'" style="width:267px" onpaste="return false"
                strongRegex="^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})" 
                :weakLabel="$t('computer.plugins.password.weak')"
                :mediumLabel="$t('computer.plugins.password.medium')"
                :strongLabel="$t('computer.plugins.password.strong')"
                :promptLabel="$t('computer.plugins.password.password_prompt')">
                  <template #footer="sp">
                    {{sp.level}}
                    <Divider />
                    <ul class="p-pl-2 p-ml-2 p-mt-0" style="line-height: 1.5">
                      <li>{{ $t('computer.plugins.password.lowercase_message') }}</li>
                      <li>{{ $t('computer.plugins.password.uppercase_message') }}</li>
                      <li>{{ $t('computer.plugins.password.number_message') }}</li>
                      <li>{{ $t('computer.plugins.password.password_length_message') }}</li>
                      <li>{{ $t('computer.plugins.password.does_not_support_message') }}</li>
                    </ul>
                  </template>
                </Password>
                <Button icon="pi pi-key" class="p-button-sm" :title='$t("computer.plugins.password.generate_password")' @click="generatePassword"/>
              </div>
            </div>
            <div>
              <small v-show="validationErrors.newPassword" class="p-error">{{ passwordErrorMessage }}</small>
            </div>
          </div>
        </div>
        <div class="p-field p-grid">
          <label class="p-col" ><i class="pi pi-lock"></i> &nbsp;{{ $t('computer.plugins.password.confirm_password') }}</label>
          <div class="p-col">
            <div >
              <div class="p-inputgroup">
              <Password v-model="confirmPassword" toggleMask :class="validationErrors.confirmPassword ? 'p-invalid p-inputtext-sm': 'p-inputtext-sm'" style="width:267px" onpaste="return false"
                strongRegex="^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})" 
                :weakLabel="$t('computer.plugins.password.weak')"
                :mediumLabel="$t('computer.plugins.password.medium')"
                :strongLabel="$t('computer.plugins.password.strong')"
                :promptLabel="$t('computer.plugins.password.password_prompt')">
                  <template #footer="sp">
                    {{sp.level}}
                    <Divider />
                    <ul class="p-pl-2 p-ml-2 p-mt-0" style="line-height: 1.5">
                      <li>{{ $t('computer.plugins.password.lowercase_message') }}</li>
                      <li>{{ $t('computer.plugins.password.uppercase_message') }}</li>
                      <li>{{ $t('computer.plugins.password.number_message') }}</li>
                      <li>{{ $t('computer.plugins.password.password_length_message') }}</li>
                      <li>{{ $t('computer.plugins.password.does_not_support_message') }}</li>
                    </ul>
                  </template>
                </Password>
                <Button icon="pi pi-key" class="p-button-sm" :title='$t("computer.plugins.password.generate_password")' @click="generatePassword"/>
              </div>
            </div>
            <div>
              <small v-show="validationErrors.confirmPassword" class="p-error">{{ passwordErrorMessage }}</small>
            </div>
          </div>
        </div>
        <div class="p-field p-grid">
          <label class="p-col"><i class="el el-icon-coin"></i>&nbsp; {{ $t('computer.plugins.local_user.groups') }}</label>
          <div class="p-col">
            <div>
              <MultiSelect v-model="selectedGrop" :options="groups" optionLabel="label"
              :placeholder="$t('computer.plugins.local_user.select_groups')" display="chip" :filter="true" 
              :filterPlaceholder="$t('computer.plugins.local_user.search_group')"/>
            </div>
          </div>
        </div>
        <div class="p-field p-grid">
          <label class="p-col-fixed" style="width:155px"><i class="el el-icon-turn-off"></i> &nbsp;{{ $t('computer.plugins.local_user.status') }}</label>
          <div class="p-col">
            <InputSwitch id="status" v-model="status" v-tooltip.bottom="status ? $t('computer.plugins.local_user.active'): $t('computer.plugins.local_user.passive')"/>
          </div>
        </div>
      </div>
      <template #footer>
        <Button :label="$t('computer.plugins.local_user.cancel')" icon="pi pi-times" @click.prevent="showUserDialog=false" class="p-button-sm p-button-danger"/>
        <Button :label="selectedUser ? $t('computer.plugins.local_user.update'): $t('computer.plugins.local_user.add')" :icon="selectedUser ? 'pi pi-user-edit': 'pi pi-user-plus'" @click.prevent="sendTaskForLocaUser" class="p-button-sm"/>
      </template>
    </Dialog>
    <base-plugin
      :pluginUrl="pluginUrl"
      :pluginDescription="pluginDescription"
      :showTaskDialog="showTaskDialog"
      @send-task="sendTask"
      @cancel-task="showTaskDialog = false"
      :pluginTask="task"
    >
      <template #pluginHeader>
        {{ $t("computer.plugins.local_user.header") }}
      </template>
      <template #pluginHeaderButton>
        <Button
          icon="pi pi-user-plus"
          class="p-button-sm p-mr-2"
          :title="$t('computer.plugins.local_user.add_user')"
          @click.prevent="addUser"
          >
        </Button>
        <Button
          icon="pi pi-users"
          class="p-button-sm"
          :title="$t('computer.plugins.local_user.list_users')"
          @click.prevent="showConfirmDialogForTask"
          >
        </Button>
      </template>
      <template #default>
        <div>
          <DataTable :value="users" responsiveLayout="scroll" class="p-datatable-sm" :metaKeySelection="false">
            <Column field="username" header="Username"></Column>
            <Column field="status" header="Status"></Column>
            <Column field="home" header="Home Directory"></Column>
            <Column :exportable="false">
              <template #body="slotProps">
                <Button icon="pi pi-user-edit" :title="$t('computer.plugins.local_user.update')" class="p-button-rounded p-mr-2 p-button-sm" @click="editUSer(slotProps.data)" />
                <Button icon="pi pi-user-minus" :title="$t('computer.plugins.local_user.delete')" class="p-button-rounded p-button-danger p-button-sm" @click.prevent="selectedUser=slotProps.data; deleteHomeDialog=true" />
              </template>
            </Column>
          </DataTable>
        </div>
      </template>
      <template #pluginFooter>
      </template>
    </base-plugin>
  </div>
</template>

<script>
/**
 * local user management plugin 
 * @see {@link http://www.liderahenk.org/}
 * 
 */

import GeneratePassword from "@/views/ComputerManagement/GeneratePassword/generatePassword.js";

export default {
    props: {
      pluginTask: {
        type: Object,
        description: "Plugin task object",
      },
    },
  
    data() {
      return {
        showTaskDialog: false,
        task: null,
        users: null,
        deleteHomeDialog: false,
        selectedUser: null,
        showUserDialog: false,
        pluginDescription: this.$t('computer.plugins.local_user.description'),
        pluginUrl: "https://docs.liderahenk.org/lider-ahenk-docs/liderv2/computer_management/sistem/yerel_kullanici_yonetimi/",
        username: '',
        home: '',
        newPassword: '',
        confirmPassword: '',
        validationErrors: {},
        selectedGrop: '',
        passwordErrorMessage: '',
        status: false,
        groups: [
          {label: 'sudo'},
          {label: 'cdrom'},
          {label: 'plugdev'},
          {label: 'root'},
          {label: 'gdm'},
          {label: 'avahi'},
          {label: 'pulse'},
          {label: 'kvm'},
          {label: 'users'},
          {label: 'games'},
          {label: 'syslog'},
          {label: 'video'},
       ],
      }
    },

    created() {
      this.task = {...this.pluginTask};
      this.getUsersList();
    },

    methods: {
      getUsersList(){
        this.task.commandId = "commandId";
        this.task.parameterMap = {};
        this.users = [{
          "username": "tcolak", "status": "active" ,"home": "/home/tcolak", "id": "1"},
          {"username": "hkara", "status": "passive" ,"home": "/home/hkara", "id": "2"}]
        // this.showTaskDialog = true;
      },
      
      showConfirmDialogForTask(){
        this.showTaskDialog = true;
      },

      editUSer(user){
        this.selectedUser = user;
        console.log(this.selectedUser)
        this.username = user.username;
        this.home = user.home;
        this.selectedGrop = [{label: "sudo"}, {label: "root"}, {label: "cdrom"}, {label: "gdm"}];
        if (user.status == "active") {
          this.status = true;
        } else{
          this.status = false;
        }
        this.showUserDialog = true;
      },

      addUser() {
        this.validationErrors = {};
        this.selectedUser = null;
        this.showUserDialog = true;
      },

      deleteUser(isDeleted) {
        this.showTaskDialog = true;
        // this.deleteHomeDialog = false;
        this.task.commandId = "DELETE_USER";
        this.task.parameterMap = {
          "username": this.selectedUser.username,
					"delete_home": isDeleted,
					"home": this.selectedUser.home
          };
        // this.users = this.users.filter(val => val.id !== this.users.id);
      },

      sendTaskForLocaUser(commandId) {
        this.task.commandId = commandId;
        if (commandId == "DELETE_USER") {
          this.task.parameterMap = {
            "username": user.username,
            "delete_home": true,
            "home": user.home
          };
        }
        if (this.validateForm() ) {
          this.showTaskDialog = true;
        }
      },

      validateForm() {
        if (!this.username.trim())
            this.validationErrors['username'] = true;
        else
            delete this.validationErrors['username'];
        if (!this.home.trim())
            this.validationErrors['home'] = true;
        else
            delete this.validationErrors['home'];
        if (this.newPassword.trim()){
          this.validationErrors['newPassword'] = true;
          if (!/[a-z]/.test(this.newPassword)) {
            this.passwordErrorMessage = this.$t('computer.plugins.password.lowercase_message')+" (a-z)";
            return;
          } else if (!/[A-Z]/.test(this.newPassword)) {
            this.passwordErrorMessage = this.$t('computer.plugins.password.uppercase_message')+" (A-Z)";
            return;
          } else if (!/[0-9]/.test(this.newPassword)) {
            this.passwordErrorMessage = this.$t('computer.plugins.password.number_message')+"(0-9)";
            return;
          } else if (/[*]/.test(this.newPassword)) {
            this.passwordErrorMessage = this.$t('computer.plugins.password.does_not_support_message');
            return;
          } else if (this.newPassword.length < 6) {
            this.passwordErrorMessage = this.$t('computer.plugins.password.password_length_message');
            return;
          } else {
            this.passwordErrorMessage = '';
            delete this.validationErrors['newPassword'];
          }
          this.validationErrors['confirmPassword'] = true;
          if (this.newPassword != this.confirmPassword) {
            this.passwordErrorMessage = this.$t('computer.plugins.password.match_password_message');
            return;
          } else {
            this.passwordErrorMessage = '';
            delete this.validationErrors['confirmPassword'];
          }
        }
        return !Object.keys(this.validationErrors).length;
      },

      generatePassword() {
        const generatedPassword = GeneratePassword.createPassword(6);
        this.newPassword = generatedPassword;
        this.confirmPassword = generatedPassword;
      },
    },

     watch: {
      username() {
        if (!this.username.trim()){
          this.validationErrors["username"] = true;
        } else {
          delete this.validationErrors["username"];
        }
      },

      home() {
        if (!this.home.trim()){
          this.validationErrors["home"] = true;
        } else {
          delete this.validationErrors["home"];
        }
      },
      newPassword(){
        if (!this.newPassword.trim()){
          this.validationErrors["newPassword"] = true;
        } else {
          delete this.validationErrors["newPassword"];
        }
      },
      confirmPassword(){
        if (!this.confirmPassword.trim()){
          this.validationErrors["confirmPassword"] = true;
        } else {
          delete this.validationErrors["confirmPassword"];
        }
      },
      selectedGrop() {
        console.log(this.selectedGrop)
      },
      showUserDialog() {
        if (!this.showUserDialog) {
          this.selectedUser = null;
          this.username = '';
          this.home = '';
          this.status = true;
          this.selectedGrop = '';
        }
      }
    },
}
</script>

<style lang="scss" scoped>
.p-multiselect {
    width: 300px;
}
@media screen and (max-width: 640px) {
.p-multiselect {
    width: 100%;
  }
}
input {
  width: 300px
}
</style>