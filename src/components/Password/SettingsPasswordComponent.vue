<template>
  <div>
    <div class="p-fluid p-formgrid p-grid" v-if="settingsOldPassword">
        <div class="p-field p-col-12">
          <Dialog :header="$t('settings_password.update_password')" v-model:visible="modalVisible" 
                  :style="{width: '20vw'}" :modal="true">
                
                <label for="oldPassword">{{$t('settings_password.old_password')}}</label>
                <div class="p-inputgroup">
                  <Password v-model="oldPassword" 
                    class="oldPassword">
                </Password>
                </div>

                <password-component ref="password"></password-component>
               
            <template #footer>
              <Button :label="$t('settings_password.cancel')" icon="pi pi-times" @click="modalVisible=false" class="p-button-text" />
              <Button :label="$t('settings_password.change_password')" icon="pi pi-check" @click="updatePassword" class="p-button-sm" />
            </template>
        </Dialog>
      </div>
    </div>

    <div class="p-fluid p-formgrid p-grid" v-else>
      <div class="p-field p-col-12">
        <Dialog :header="$t('settings_password.create_password')" v-model:visible="modalVisible" 
                :style="{width: '20vw'}" :modal="true">

              <password-component ref="password"></password-component>
             
            <template #footer>
              <Button :label="$t('settings_password.cancel')" icon="pi pi-times" @click="modalVisible=false" class="p-button-text" />
              <Button :label="$t('settings_password.create_password')" icon="pi pi-check" @click="savePassword" class="p-button-sm" />
            </template>
        </Dialog>
      </div>
    </div>
  </div>
</template>

<script>
import PasswordComponent from '@/components/Password/PasswordComponent.vue';
import { serverSettingService } from '../../services/Settings/ServerSettingsService.js';

export default {
  props: {
    visible: Boolean,
    type: String,
    settingsOldPassword:Boolean
  },  

  components: {
    PasswordComponent
  },

  data() {
    return {

      oldPassword: ''
      
    };
  },

  methods: {

    async updatePassword() {
      if(!this.oldPassword.trim()){
        this.$toast.add({
            severity:'warn', 
            detail: this.$t('settings_password.password_input_message'), 
            summary:this.$t("computer.task.toast_summary"), 
            life: 3000
        });
      }
      else{
        let password = this.$refs.password.getPassword();
        var params = new FormData();
        params.append("type",this.type);
        params.append("oldPassword",this.oldPassword);
        params.append("newPassword",password);
        const{response,error} = await serverSettingService.changePassword(params);
        if(error){
            if (error.response.status == 403 ){
                this.$toast.add({
                    severity:'warn', 
                    detail: this.$t('settings_password.error_403_changed_settings_password'), 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
            }
            else{
                this.$toast.add({
                    severity:'error', 
                    detail: this.$t('settings_password.error_changed_settings_password'),
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
            }
        }
        else{
            if(response.status == 200){
                this.oldPassword = null;
                this.newPassword = null;
                this.$toast.add({
                    severity:'success', 
                    detail: this.$t('settings_password.settings_password_successfully_update'),
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
                this.$emit('updatedPassword', false);
            }

        }
      }
    },
    async savePassword(){

        let password = this.$refs.password.getPassword();
        var params = new FormData();
        params.append("type",this.type);
        params.append("newPassword",password);
        const{response,error} = await serverSettingService.savePassword(params);
        if(response.status == 200){
                this.newPassword = null;
                this.$toast.add({
                    severity:'success', 
                    detail: this.$t('settings_password.settings_password_successfully_update'),
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
                this.$emit('updatedPassword', false);
        }
        else if(response.status == 500){
            this.$toast.add({
                severity:'warn', 
                detail: this.$t('settings_password.settings_password_error_save'),
                summary:this.$t("computer.task.toast_summary"), 
                life: 3000
            });
        }
    }
  },

  computed: {
    modalVisible: {
      get() {
        return this.visible;
      },
      set() {
        this.$emit('update:visible', false);
      }
    },
  }
};
</script>
