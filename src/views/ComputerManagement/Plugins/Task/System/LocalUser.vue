<template>
  <div>
    <Dialog 
    :header="$t('computer.plugins.local_user.home_directory_dialog_title')" 
    v-model:visible="deleteHomeDialog" 
    :modal="true" 
    :style="{width: '500px'}"
    >
      <i class="pi pi-home p-mr-3" style="font-size: 2rem" />
      <span> {{ $t('computer.plugins.local_user.home_directory_dialog_content') }}</span>
      <template #footer>
        <Button 
        :label="$t('computer.plugins.base_plugin.no')" 
        icon="pi pi-times" 
        @click="deleteUser(false)" 
        class="p-button-text p-button-sm"
        />
        <Button 
        :label="$t('computer.plugins.base_plugin.yes')" 
        icon="pi pi-check" 
        @click="deleteUser(true)" 
        class="p-button-sm" 
        />
      </template>
    </Dialog>
    <Dialog 
    :header="selectedUser ? userForm.username: $t('computer.plugins.local_user.add_user')" 
    v-model:visible="showUserDialog" 
    :modal="true" 
    :style="{width: '500px'}" 
    >
      <div>
        <div class="p-field p-grid">
          <label class="p-col-4" >
            <i class="pi pi-user"></i>&nbsp;{{ $t('computer.plugins.local_user.username') }}
          </label>
          <div class="p-col-8">
            <div>
              <InputText 
              v-model="userForm.username" 
              :class="validationErrors.username ? 'p-invalid p-inputtext-sm': 'p-inputtext-sm'" 
              placeholder="lider"/>
            </div>
            <div>
              <small v-show="validationErrors.username" 
              class="p-error">{{ $t('computer.plugins.local_user.username_validation') }}
              </small>
            </div>
          </div>
        </div>
        <div class="p-field p-grid">
          <label class="p-col-4" >
            <i class="pi pi-home"></i> &nbsp;{{ $t('computer.plugins.local_user.home_directory') }}
          </label>
          <div class="p-col-8">
            <div>
              <InputText 
              v-model="userForm.home" 
              :class="validationErrors.home ? 'p-invalid p-inputtext-sm': 'p-inputtext-sm'" 
              placeholder="/home/lider"
              />
            </div>
            <div>
              <small v-show="validationErrors.home" 
              class="p-error">{{ $t('computer.plugins.local_user.home_directory_validation') }}
              </small>
            </div>
          </div>
        </div>
        <div class="p-field p-grid">
          <label class="p-col-4">
            <i class="el el-icon-coin"></i>&nbsp; {{ $t('computer.plugins.local_user.groups') }}
          </label>
          <div class="p-col-8">
            <div>
              <MultiSelect 
              v-model="selectedGroup" 
              :options="groups" 
              optionLabel="label"
              :placeholder="$t('computer.plugins.local_user.select_groups')" 
              display="chip" 
              :filter="true" 
              :filterPlaceholder="$t('computer.plugins.local_user.search_group')"
              />
            </div>
          </div>
        </div>
        <div class="p-field p-grid">
          <label class="p-col-4">
            <i class="el el-icon-turn-off"></i> &nbsp;{{ $t('computer.plugins.local_user.status') }}
          </label>
          <div class="p-col-8">
            <Button 
              @click="status = !status" 
              :value="status"
              :label="status ? $t('computer.plugins.local_user.active'): $t('computer.plugins.local_user.passive')"
              :icon="status ? 'pi pi-check-circle': 'pi pi-ban'"
              :class="status ? 'p-button-sm p-button-raised p-button-text p-button-success': 'p-button-sm p-button-text p-button-raised p-button-danger'"
            />
            <Button 
              @click="showPasswordForm = !showPasswordForm" 
              :value="showPasswordForm" 
              style="float:right"
              :label="selectedUser ? $t('computer.plugins.local_user.change_password'): $t('computer.plugins.local_user.create_password')"
              class="p-button-sm p-button-text p-button-raised"
              icon="pi pi-lock"
            />
          </div>
        </div>
        <div class="p-field p-grid" v-if="showPasswordForm">
          <label class="p-col-4" >
            <i class="pi pi-lock"></i> &nbsp;{{ $t('password.new_password') }}
          </label>
          <div class="p-col-8">
            <div>
              <div class="p-inputgroup">
                <Password v-model="userForm.password"
                toggleMask 
                :class="validationErrors.new_password ? 'p-invalid p-inputtext-sm': 'p-inputtext-sm'"  
                onpaste="return false"
                strongRegex="^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})" 
                :weakLabel="$t('password.weak')"
                :mediumLabel="$t('password.medium')"
                :strongLabel="$t('password.strong')"
                :promptLabel="$t('password.password_prompt')"
                :placeholder="$t('password.new_password')">
                  <template #footer="sp">
                    {{sp.level}}
                    <Divider/>
                    <ul class="p-pl-2 p-ml-2 p-mt-0" style="line-height: 1.5">
                      <li>{{ $t('password.lowercase_message') }}</li>
                      <li>{{ $t('password.uppercase_message') }}</li>
                      <li>{{ $t('password.number_message') }}</li>
                      <li>{{ $t('password.password_length_message') + " "+ passwordLength}}</li>
                      <li>{{ $t('password.does_not_support_message') }}</li>
                    </ul>
                  </template>
                </Password>
                <Button 
                icon="pi pi-key" 
                class="p-button-sm" 
                :title='$t("password.generate_password")' 
                @click="generatePassword" :disabled="showPasswordForm ? false : true"
                />
              </div>
            </div>
            <div>
              <small v-show="validationErrors.password" 
              class="p-error">{{ passwordErrorMessage }}
              </small>
            </div>
          </div>
        </div>
        <div class="p-field p-grid" v-if="showPasswordForm">
          <label class="p-col-4" >
            <i class="pi pi-lock"></i> &nbsp;{{ $t('password.confirm_password') }}
          </label>
          <div class="p-col-8">
            <div >
              <div class="p-inputgroup">
                <Password v-model="userForm.confirmPassword" 
                toggleMask 
                :class="validationErrors.confirmPassword ? 'p-invalid p-inputtext-sm': 'p-inputtext-sm'" 
                onpaste="return false"
                strongRegex="^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})" 
                :weakLabel="$t('password.weak')"
                :mediumLabel="$t('password.medium')"
                :strongLabel="$t('password.strong')"
                :promptLabel="$t('password.password_prompt')"
                :placeholder="$t('password.confirm_password')">
                  <template #footer="sp">
                    {{sp.level}}
                    <Divider />
                    <ul class="p-pl-2 p-ml-2 p-mt-0" style="line-height: 1.5">
                      <li>{{ $t('password.lowercase_message') }}</li>
                      <li>{{ $t('password.uppercase_message') }}</li>
                      <li>{{ $t('password.number_message') }}</li>
                      <li>{{ $t('password.password_length_message') + " "+ passwordLength}}</li>
                      <li>{{ $t('password.does_not_support_message') }}</li>
                    </ul>
                  </template>
                </Password>
                <Button icon="pi pi-key" class="p-button-sm" :title='$t("password.generate_password")' 
                  @click="generatePassword"
                  :disabled="showPasswordForm ? false : true"
                />
              </div>
            </div>
            <div>
              <small v-show="validationErrors.confirmPassword" 
              class="p-error">
              {{ passwordErrorMessage }}
              </small>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <Button
         class="p-button-sm p-button-text" 
         :label="$t('computer.plugins.local_user.cancel')" 
         icon="pi pi-times" 
         @click.prevent="showUserDialog=false"
        />
        <Button class="p-button-sm" 
          :label="selectedUser ? $t('computer.plugins.local_user.update'): $t('computer.plugins.local_user.add')" 
          :icon="selectedUser ? 'pi pi-refresh': 'pi pi-user-plus'"
          @click.prevent="sendTaskForLocaUser(selectedUser ? 'EDIT_USER': 'ADD_USER')"
        />
      </template>
    </Dialog>
    <base-plugin
      :pluginUrl="pluginUrl"
      :pluginDescription="pluginDescription"
      :showTaskDialog="showTaskDialog"
      @close-task-dialog="eventTaskDialogManager"
      @task-response="localUserManagementResponse"
      :pluginTask="task"
      :executeTask="executeTask"
    >
      <template #pluginTitle>
        {{ $t("computer.plugins.local_user.header") }}
      </template>
      <template #pluginTitleButton>
        <Button
          v-if="users"
          icon="pi pi-user-plus"
          class="p-button-sm p-mr-2"
          :title="$t('computer.plugins.local_user.add_user')"
          @click.prevent="addUser"
        />
        <Button
          icon="pi pi-users"
          class="p-button-sm"
          :title="$t('computer.plugins.local_user.list_users')"
          @click.prevent="getUsersList"
        />
      </template>
      <template #default>
        <div>
          <DataTable 
          :value="users" 
          responsiveLayout="scroll" 
          class="p-datatable-sm" 
          :metaKeySelection="false">
            <template #empty>
              <div class="p-d-flex p-jc-center">
                <span>{{$t('computer.plugins.local_user.table_empty_message')}}</span>
              </div>
            </template>
            <Column field="username" :header="$t('computer.plugins.local_user.username')"></Column>
            <Column field="home" :header="$t('computer.plugins.local_user.home_directory')"></Column>
            <Column field="status" :header="$t('computer.plugins.local_user.status')">
              <template #body="slotProps">
                <Badge 
                :value="slotProps.data.status" 
                :severity="slotProps.data.status == $t('computer.plugins.local_user.active') ? 'success': 'danger'">
                </Badge>
              </template>
            </Column>
            <Column :exportable="false">
              <template #body="slotProps">
                <div class="p-d-flex p-jc-end">
                  <div>
                    <Button icon="pi pi-user-edit" class="p-button-rounded p-mr-2 p-button-sm p-button-warning" 
                      :title="$t('computer.plugins.local_user.edit')"  
                      @click="editUSer(slotProps.data)" 
                    />
                    <Button icon="pi pi-user-minus" class="p-button-rounded p-button-danger p-button-sm" 
                      :title="$t('computer.plugins.local_user.delete')"  
                      @click.prevent="selectedUser=slotProps.data; deleteHomeDialog=true" 
                    />
                  </div>
                </div>
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
 * local user management plugin. Get user list, edit and delete on the client. Add user to client
 * commandId: GET_USERS, ADD_USER, EDIT_USER, DELETE_USER
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

      passwordLength: {
            type: Number,
            default: 6,
            description: "Password length"
        },
    },
  
    data() {
      return {
        showTaskDialog: false,
        executeTask: false,
        task: null,
        users: null,
        deleteHomeDialog: false,
        selectedUser: null,
        showUserDialog: false,
        pluginDescription: this.$t('computer.plugins.local_user.description'),
        pluginUrl: "https://docs.liderahenk.org/lider3.0/computerManagement/computerManagement/localUserManagement/",
        userForm: {
          username: '',
          home: '',
          password: '',
          confirmPassword: '',
        },
        validationErrors: {},
        selectedGroup: '',
        passwordErrorMessage: '',
        status: false,
        showPasswordForm: false,
        groups: [],
      }
    },

    created() {
      this.task = {...this.pluginTask};
    },

    methods: {
      getUsersList(){
        this.task.commandId = "GET_USERS";
        this.task.parameterMap = {};
        this.showTaskDialog = true;
      },

      editUSer(user){
        this.selectedUser = user;
        this.userForm.username = user.username;
        this.userForm.home = user.home;
        let parserGroups = user.groups.split(", ");
        let jsonArray = [];
        parserGroups.forEach(element => {jsonArray.push({label:element})});
        this.selectedGroup = jsonArray;
        this.status = user.status == this.$t('computer.plugins.local_user.active') ? true: false;
        this.showUserDialog = true;
      },

      addUser() {
        this.validationErrors = {};
        this.showUserDialog = true
        this.selectedUser = null;
      },

      sendTaskForLocaUser(commandId) {
        this.task.commandId = commandId;
        if (this.validateForm()) {
          let userGroups = "";
          if (this.selectedGroup != "") {
            userGroups = this.selectedGroup.map(function(element){
            return element.label;
            }).join(",");
          }
          this.task.parameterMap = {
            "username": commandId == 'EDIT_USER'? this.selectedUser.username : this.userForm.username ,
            "password": this.userForm.password,
            "desktop_write_permission": "true",
            "active": this.status.toString(),
            "groups": userGroups,
            "kiosk_mode": "true",
            "home": this.userForm.home
          };
          if (commandId == "EDIT_USER") {
            this.task.parameterMap["new_username"] = this.userForm.username;
          }
          this.showTaskDialog = true;
          this.validationErrors = {};
        }
      },

      deleteUser(isDeleted) {
        this.task.commandId = "DELETE_USER";
        this.task.parameterMap = {
          "username": this.selectedUser.username,
					"delete_home": isDeleted,
					"home": this.selectedUser.home
          };
        this.showTaskDialog = true;
      },

      localUserManagementResponse(message) {
        if (message.commandClsId == "GET_USERS") {
          this.users = null;
          this.groups = [];
          var arrg = JSON.parse(message.result.responseDataStr);
          var usersList = [];
          for (let index = 0; index < arrg['users'].length; index++) {
            const element =  arrg['users'][index];
            if (element.user != "root") {
              usersList.push({
              "username": element.user,
              "status": element.is_active == "true"? this.$t('computer.plugins.local_user.active'): this.$t('computer.plugins.local_user.passive'),
              "home": element.home, 
              "groups": element.groups
              });
            }
          }
          this.users = usersList;
          for (let index = 0; index < arrg['all_groups'].length; index++) {
            const element = arrg['all_groups'][index];
            this.groups.push({label: element});
          }
        } else if (message.commandClsId == "ADD_USER" || message.commandClsId == "DELETE_USER" || message.commandClsId == "EDIT_USER") {
          if (message.result.responseCode == "TASK_PROCESSED") {
            this.task.commandId = "GET_USERS";
            this.task.parameterMap = {};
            this.executeTask = true;
          }
        }
      },

      validateForm() {
        if (!this.userForm.username.trim())
            this.validationErrors['username'] = true;
        else
            delete this.validationErrors['username'];
        if (!this.userForm.home.trim())
            this.validationErrors['home'] = true;
        else
            delete this.validationErrors['home'];
        if (this.userForm.password.trim()){
          this.validationErrors['password'] = true;
          if (!/[a-z]/.test(this.userForm.password)) {
            this.passwordErrorMessage = this.$t('password.lowercase_message')+" (a-z)";
            return;
          } else if (!/[A-Z]/.test(this.userForm.password)) {
            this.passwordErrorMessage = this.$t('password.uppercase_message')+" (A-Z)";
            return;
          } else if (!/[0-9]/.test(this.userForm.password)) {
            this.passwordErrorMessage = this.$t('password.number_message')+" (0-9)";
            return;
          } else if (/[*]/.test(this.userForm.password)) {
            this.passwordErrorMessage = this.$t('password.does_not_support_message');
            return;
          } else if (this.userForm.password.length < 6) {
            this.passwordErrorMessage = this.$t('password.password_length_message')+" "+ this.passwordLength;
            return;
          } else {
            this.passwordErrorMessage = '';
            delete this.validationErrors['password'];
          }
        }
        if (this.userForm.password != this.userForm.confirmPassword) {
          this.validationErrors['confirmPassword'] = true;
          this.passwordErrorMessage = this.$t('password.match_password_message');
          return;
        } else {
          this.passwordErrorMessage = '';
          delete this.validationErrors['confirmPassword'];
        }
        return !Object.keys(this.validationErrors).length;
      },

      generatePassword() {
        const generatedPassword = GeneratePassword.createPassword(6);
        this.userForm.password = generatedPassword;
        this.userForm.confirmPassword = generatedPassword;
      },

      eventTaskDialogManager(event) {
        this.showTaskDialog = false;
        this.executeTask = false;
        if (event == "success") {
          this.deleteHomeDialog = false;
          this.showUserDialog = false;
        }
      }
    },

    watch: {
      userForm: {
      handler(){
        this.validateForm();
      },
      deep: true,
    },
    
      showUserDialog() {
        this.showPasswordForm = false;
        if (!this.showUserDialog) {
          this.selectedUser = null;
          this.userForm.username = '';
          this.userForm.home = '';
          this.status = true;
          this.selectedGroup = '';
          this.userForm.password = '';
          this.userForm.confirmPassword = '';
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