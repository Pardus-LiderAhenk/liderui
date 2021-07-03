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
      <template #pluginHeader>
        {{ $t("computer.plugins.manage_root.header") }}
      </template>
      <template #pluginHeaderButton>
        <Button
          icon="fa fa-play"
          class="p-button-raised p-button-sm"
          :title="$t('computer.plugins.button.run')"
          @click.prevent="showConfirmDialogForTask"
          >
        </Button>
      </template>
      <template #default>
        <div>
          <div>
            <el-switch
              v-model="lockRootUser"
              :active-text="$t('computer.plugins.manage_root.unlock_root_user')"
              :inactive-text="$t('computer.plugins.manage_root.lock_root_user')"
              @change="lockUserChange('passwordForm')"
            >
            </el-switch>
          </div>
          <el-form
            :model="passwordForm"
            :rules="passwordFormRules"
            ref="passwordForm"
            status-icon
          >
            <div style="margin-top: 10px">
              <el-form-item prop="password">
                <el-input
                  :placeholder="$t('computer.plugins.password.new_password')"
                  v-model="passwordForm.password"
                  size="small"
                  class="root-password"
                  show-password
                  :disabled="lockRootUser ? false : true"
                  onpaste="return false"
                >
                  <template #prepend>
                    <el-button :icon="lockRootUser ? 'fa fa-key' : 'fas fa-user-lock'" :title='$t("computer.plugins.password.generate_password")' @click.prevent="generatePassword('passwordForm')"></el-button>
                  </template>
                </el-input>
              </el-form-item>
            </div>
            <div >
              <el-form-item prop="confirmPassword">
                <el-input
                  :placeholder="$t('computer.plugins.password.confirm_password')"
                  v-model="passwordForm.confirmPassword"
                  size="small"
                  show-password
                  class="root-password"
                  :disabled="lockRootUser ? false : true"
                  onpaste="return false"
                >
                  <template #prepend>
                    <el-button :icon="lockRootUser ? 'fa fa-key' : 'fas fa-user-lock'" :title='$t("computer.plugins.password.generate_password")' @click.prevent="generatePassword('passwordForm')"></el-button>
                  </template>
                </el-input>
              </el-form-item>
            </div>
          </el-form>
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
    var validatePass = (rule, value, callback) => {
      if (!/[a-z]/.test(value)) {
        callback( new Error(this.$t('computer.plugins.password.lowercase_message')+" (a-z)") );
      } else if (!/[A-Z]/.test(value)) {
        callback( new Error(this.$t('computer.plugins.password.uppercase_message')+" (A-Z)"));
      } else if (!/[0-9]/.test(value)) {
        callback(new Error(this.$t('computer.plugins.password.number_message')+"(0-9)"));
      } else if (/[*]/.test(value)) {
        callback(new Error(this.$t('computer.plugins.password.does_not_support_message')));
      } else {
        callback();
      }
    };
    var validateMatch = (rule, value, callback) => {
        if (value != this.passwordForm.password) {
          callback(new Error(this.$t('computer.plugins.password.match_password_message')));
        } else {
        callback();
      }
    };

    return {
      showTaskDialog: false,
      lockRootUser: true,
      task: null,
      passwordForm: {
        password: null,
        confirmPassword: null,
      },
      passwordFormRules: {
        password: [
          { required: true, message: this.$t('computer.plugins.manage_root.password_input_message'), trigger: "blur" },
          { min: 6, message: this.$t('computer.plugins.password.password_length_message'), trigger: "blur" },
          { validator: validatePass, trigger: "blur" },
        ],
        confirmPassword: [
          { required: true, message: this.$t('computer.plugins.manage_root.confirm_password_input_message'), trigger: "blur" },
          { min: 6, message: this.$t('computer.plugins.password.password_length_message'), trigger: "blur" },
          { validator: validatePass, trigger: "blur" },
          { validator: validateMatch, trigger: "blur" },
        ],
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
      this.$refs["passwordForm"].validate((valid) => {
        if (!this.lockRootUser) {
          valid = true;
          this.$refs["passwordForm"].resetFields();
        }
        if (valid) {
          let rootEntity = "lider_console";
          this.task.commandId = "SET_ROOT_PASSWORD";
          this.task.parameterMap = {
            RootPassword: this.passwordForm.password,
            lockRootUser: !this.lockRootUser,
            rootEntity: rootEntity,
          };
          this.showTaskDialog = true;
        } else {
          return false;
        }
      });
    },

    sendManageRootTask() {
      this.showTaskDialog = false;
    },
    
    lockUserChange(formName) {
      this.$refs[formName].resetFields();
      this.passwordForm.password = null;
      this.passwordForm.confirmPassword = null;
    },

    generatePassword(formName) {
      this.$refs[formName].resetFields();
      if (this.lockRootUser) {
        const generatedPassword = GeneratePassword.createPassword(6);
        this.passwordForm.password = generatedPassword;
        this.passwordForm.confirmPassword = generatedPassword;
      }
    },

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert("submit!");
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style scoped>
/* .root-password {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.2);
} */
</style>
