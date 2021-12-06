<template>
  <div>
    <base-plugin
      :pluginUrl="pluginUrl"
      :pluginDescription="pluginDescription"
      :showTaskDialog="showTaskDialog"
      @close-task-dialog="showTaskDialog = false"
      :pluginTask="task"
    >
      <template #pluginHeader>
        {{ $t("computer.plugins.manage_root.header") }}
      </template>
      <template #pluginHeaderButton>
        <Button
          icon="pi pi-caret-right"
          class="p-button-raised p-button-sm"
          :title="$t('computer.plugins.button.run')"
          @click.prevent="showConfirmDialogForTask">
        </Button>
      </template>
      <template #default>
        <div>
          <div class="p-field p-grid">
            <label class="p-col-fixed" >{{ $t('computer.plugins.manage_root.lock_root_user') }}</label>
            <div class="p-col">
              <InputSwitch id="status" @change="lockUserChange" v-model="lockRootUser"/>
            </div>
          </div>
          <div class="p-fluid">
            <div class="p-field">
              <div class="p-inputgroup">
                <span class="p-inputgroup-addon">
                  <i :class="lockRootUser ? 'pi pi-lock': 'pi pi-unlock'"></i>
                </span>
                <Password 
                v-model="passwordForm.password" toggleMask 
                :class="validationErrors.password && !lockRootUser ? 'p-invalid p-inputtext-sm': 'p-inputtext-sm'" 
                onpaste="return false"
                strongRegex="^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})" 
                :weakLabel="$t('computer.plugins.password.weak')"
                :mediumLabel="$t('computer.plugins.password.medium')"
                :strongLabel="$t('computer.plugins.password.strong')"
                :promptLabel="$t('computer.plugins.password.password_prompt')"
                :placeholder="$t('computer.plugins.password.new_password')"
                :disabled="lockRootUser ? true : false">
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
                <Button 
                icon="pi pi-key" 
                :disabled="lockRootUser ? true : false" 
                class="p-button-sm" 
                :title='$t("computer.plugins.password.generate_password")'
                 @click.prevent="generatePassword"
                 />
              </div>
              <small v-show="validationErrors.password && !lockRootUser" 
              class="p-error">{{ passwordErrorMessage }}
              </small>
            </div>
            <div class="p-field">
              <div class="p-inputgroup">
                <span class="p-inputgroup-addon">
                  <i :class="lockRootUser ? 'pi pi-lock': 'pi pi-unlock'"></i>
                </span>
                <Password 
                v-model="passwordForm.confirmPassword" toggleMask 
                :class="validationErrors.confirmPassword && !lockRootUser ? 'p-invalid p-inputtext-sm': 'p-inputtext-sm'" 
                onpaste="return false"
                strongRegex="^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})" 
                :weakLabel="$t('computer.plugins.password.weak')"
                :mediumLabel="$t('computer.plugins.password.medium')"
                :strongLabel="$t('computer.plugins.password.strong')"
                :promptLabel="$t('computer.plugins.password.password_prompt')"
                :placeholder="$t('computer.plugins.password.confirm_password')"
                :disabled="lockRootUser ? true : false">
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
                <Button 
                icon="pi pi-key" 
                :disabled="lockRootUser ? true : false" 
                class="p-button-sm" :title='$t("computer.plugins.password.generate_password")' 
                @click.prevent="generatePassword"
                />
              </div>
              <small v-show="validationErrors.confirmPassword && !lockRootUser" 
              class="p-error">{{ confirmPasswordErrorMessage }}
              </small>
            </div>
          </div>
        </div>
      </template>
      <template #pluginFooter></template>
    </base-plugin>
  </div>
</template>

<script>
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
      lockRootUser: false,
      task: null,
      validationErrors: {},
      passwordErrorMessage: '',
      confirmPasswordErrorMessage: '',
      passwordForm: {
        password: '',
        confirmPassword: '',
      },
      pluginDescription: this.$t('computer.plugins.manage_root.description'),
      pluginUrl: "https://docs.liderahenk.org/lider-ahenk-docs/liderv2/computer_management/sistem/root_parola_yonetimi/",
    };
  },

  created() {
    this.task = {...this.pluginTask};
  },

  methods: {
    showConfirmDialogForTask() {
      let rootEntity = "lider_console";
      this.task.commandId = "SET_ROOT_PASSWORD";
      this.task.parameterMap = {
        RootPassword: this.passwordForm.password,
        lockRootUser: this.lockRootUser,
        rootEntity: rootEntity,
      };
      if (!this.lockRootUser) {
        if (this.validateForm()) {
          this.showTaskDialog = true;
        }
      } else{
        this.showTaskDialog = true;
      }
    },

    lockUserChange() {
      this.validationErrors = {};
      this.passwordForm.password = '';
      this.passwordForm.confirmPassword = '';
    },

    generatePassword() {
      if (!this.lockRootUser) {
        const generatedPassword = GeneratePassword.createPassword(6);
        this.passwordForm.password = generatedPassword;
        this.passwordForm.confirmPassword = generatedPassword;
      }
    },

    validateForm() {
      if (!this.passwordForm.password.trim()){
        if (!this.passwordForm.password.trim()){
          this.validationErrors['password'] = true;
        } else{
          delete this.validationErrors['password'];
        }
        if (!this.passwordForm.confirmPassword.trim()){
          this.validationErrors['confirmPassword'] = true;
        } else{
          delete this.validationErrors['confirmPassword'];
        }
        this.passwordErrorMessage = this.$t('computer.plugins.manage_root.password_input_message');
        this.confirmPasswordErrorMessage = this.$t('computer.plugins.manage_root.confirm_password_input_message');
        return;
      }
      if (!/[a-z]/.test(this.passwordForm.password)) {
        this.passwordErrorMessage = this.$t('computer.plugins.password.lowercase_message')+" (a-z)";
        return;
      } else if (!/[A-Z]/.test(this.passwordForm.password)) {
        this.passwordErrorMessage = this.$t('computer.plugins.password.uppercase_message')+" (A-Z)";
        return;
      } else if (!/[0-9]/.test(this.passwordForm.password)) {
        this.passwordErrorMessage = this.$t('computer.plugins.password.number_message')+" (0-9)";
        return;
      } else if (/[*]/.test(this.passwordForm.password)) {
        this.passwordErrorMessage = this.$t('computer.plugins.password.does_not_support_message');
        return;
      } else if (this.passwordForm.password.length < 6) {
        this.passwordErrorMessage = this.$t('computer.plugins.password.password_length_message');
        return;
      } else {
        this.passwordErrorMessage = '';
        delete this.validationErrors['password'];
      }
      if (this.passwordForm.password != this.passwordForm.confirmPassword) {
        this.validationErrors['confirmPassword'] = true;
        this.confirmPasswordErrorMessage = this.$t('computer.plugins.password.match_password_message');
        return;
      } else {
        this.confirmPasswordErrorMessage = '';
        delete this.validationErrors['confirmPassword'];
      }
      return !Object.keys(this.validationErrors).length;
    },
  },

  watch: {
    passwordForm: {
      handler(){
        this.validateForm();
     },
     deep: true,
    },
  },
};
</script>

<style scoped>
</style>
