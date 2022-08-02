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
        {{ $t("computer.plugins.manage_root.header") }}
      </template>
      <template #pluginTitleButton>
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
          <password-component :disabled="disabled" ref="password"></password-component>
        </div>
      </template>
      <template #pluginFooter></template>
    </base-plugin>
  </div>
</template>

<script>
import PasswordComponent from '@/components/Password/PasswordComponent.vue';

export default {
  props: {
    pluginTask: {
      type: Object,
      description: "Plugin task object",
    },
  },

  components: {
    PasswordComponent
  },

  data() {
    return {
      showTaskDialog: false,
      lockRootUser: false,
      task: null,
      passwordErrorMessage: '',
      confirmPasswordErrorMessage: '',
      disabled: false,
      passwordForm: {
        password: '',
        confirmPassword: '',
      },
      pluginDescription: this.$t('computer.plugins.manage_root.description'),
      pluginUrl: "https://docs.liderahenk.org/lider3.0/computerManagement/computerManagement/rootPasswordManagement/",
    };
  },

  created() {
    this.task = {...this.pluginTask};
  },

  methods: {
    showConfirmDialogForTask() {
      let rootEntity = "lider_console";
      this.task.commandId = "SET_ROOT_PASSWORD";
      let rootPassword = null;
      this.task.parameterMap = {
        RootPassword: rootPassword,
        lockRootUser: this.lockRootUser,
        rootEntity: rootEntity,
      };
      if (!this.lockRootUser) {
        rootPassword = this.$refs.password.getPassword();
        if (rootPassword) {
          this.task.parameterMap.RootPassword = rootPassword;
          this.showTaskDialog = true;
        }
      } else {
        this.showTaskDialog = true;
      }
    },

    lockUserChange() {
      if (this.lockRootUser) {
        this.disabled = true;
        this.passwordForm.password = '';
        this.passwordForm.confirmPassword = '';
        this.$refs.password.setPasswordForm('', '');
      } else {
        this.disabled = false;
      }
      
    },
  },
};
</script>

<style scoped>
</style>
