<template>
    <div class="p-fluid p-formgrid p-grid">
        <div class="p-col-12">
            <h3>{{$t('settings.server_settings.file_server_settings.file_server_information')}}</h3>
        </div>
        <div class="p-field p-col-12 p-md-2">
            <label for="fileServerProtocol">{{$t('settings.server_settings.file_server_settings.transfer_type')}}</label>
            <Dropdown id="fileServerProtocol" :options="transferTypes" optionLabel="label" optionValue="value" v-model="fileServerProtocol"></Dropdown>
        </div>
        <div class="p-field p-col-12 p-md-6">
            <label for="fileServerHost">{{$t('settings.server_settings.file_server_settings.file_server_address')}}</label>
            <InputText id="fileServerHost" type="text" v-model="fileServerHost"/>
        </div>
        <div class="p-field p-col-12 p-md-4">
            <label for="fileServerPort">{{$t('settings.server_settings.file_server_settings.port')}}</label>
            <InputText id="fileServerPort" type="number" v-model="fileServerPort"/>
        </div>
        <div class="p-field p-col-12 p-md-4">
            <label for="fileServerUsername">{{$t('settings.server_settings.file_server_settings.username')}}</label>
            <InputText id="fileServerUsername" type="text" v-model="fileServerUsername"/>
        </div>
         <div class="p-field p-col-12 p-md-4">
            <label for="fileServerPassword">{{$t('settings.server_settings.file_server_settings.password')}}</label>
            <div class="p-inputgroup" v-if="fileUsernameDefine">
                <InputText type="password"  
                    value="******************" 
                    readonly/>
                <Button 
                    icon="pi pi-unlock"
                    class="p-button-sm"
                    type="button"
                    @click="changePasswordDialog = true"
                    :label="$t('settings.server_settings.file_server_settings.change_password')" />
            </div>
            <div class="p-inputgroup" v-else>
                <InputText type="password"  
                    value="" 
                    readonly/>
                <Button 
                    icon="pi pi-save"
                    class="p-button-sm"
                    type="button" @click="changePasswordDialog = true" 
                    :label="$t('settings_password.create_password')" />
            </div>
        </div>
         <div class="p-field p-col-12 p-md-4">
            <label for="fileServerAgentFilePath">{{$t('settings.server_settings.file_server_settings.agent_file_directory')}}</label>
            <InputText id="fileServerAgentFilePath" type="text" v-model="fileServerAgentFilePath"/>
        </div>
       <div class="p-col-12 p-md-6">

       </div>
        <div class="p-field p-col-12 p-text-right">
            <div class="p-d-flex p-jc-end">
                <div>
                    <Button icon="pi pi-save" type="button" :label="$t('settings.server_settings.file_server_settings.save')" @click="showDialog = true"/>
                </div>
            </div>
        </div>
    </div>

    <SettingsPasswordComponet v-if="changePasswordDialog"
        :visible="changePasswordDialog"
        :type="'fileServerPassword'"
        :settingsOldPassword="fileUsernameDefine"
        @updatedPassword="updatedPassword"
        @update:visible="changePasswordDialog = false"/>

    <Dialog :header="$t('settings.server_settings.file_server_settings.update_settings')" v-model:visible="showDialog" 
        :style="{width: '20vw'}" :modal="true">
        <div class="p-fluid">
            <i class="pi pi-info-circle p-mr-3" style="font-size: 1.5rem" />
            <span>
                {{$t('settings.server_settings.file_server_settings.file_server_notify')}}
            </span>
        </div>
        <template #footer>
            <Button :label="$t('settings.server_settings.file_server_settings.cancel')" icon="pi pi-times" 
                @click="showDialog = false" class="p-button-text p-button-sm"
            />
            <Button :label="$t('settings.server_settings.file_server_settings.yes')" icon="pi pi-check"
                @click="submitForm" class="p-button-sm"
            />
        </template>
    </Dialog>
</template>


<script>
import { serverSettingService } from '../../../../services/Settings/ServerSettingsService.js';
import SettingsPasswordComponet from '../../../../components/Password/SettingsPasswordComponent.vue';

export default {
    props:['serverSettings'],
    data() {
        return {
            transferTypes: [
                {label:'SSH', value:'SSH'},
                {label:'HTTP', value:'HTTP'},
                {label:'TORRENT', value:'TORRENT'},
            ],
            fileServerProtocol: 'SSH',
            fileServerHost:'',
            fileServerPort:'',
            fileServerUsername:'',
            fileServerPassword:'',
            fileServerAgentFilePath:'',
            showDialog: false,
            changePasswordDialog: false,
            fileUsernameDefine: false
        }
    },
    components: {
        SettingsPasswordComponet
    },
    watch: { 
      	serverSettings: function(newVal) { 
          if(newVal) {
            this.fileServerProtocol = newVal.fileServerProtocol;
            this.fileServerHost = newVal.fileServerHost;
            this.fileServerPort = newVal.fileServerPort;
            this.fileServerUsername = newVal.fileServerUsername;
            this.fileServerAgentFilePath = newVal.fileServerAgentFilePath;
          }
          if(this.serverSettings && this.serverSettings.fileServerUsername){
                this.fileUsernameDefine = true
          }
        }
    },
    methods: {
        async submitForm() {
            var data = new FormData();
            data.append("fileServerProtocol",this.fileServerProtocol);
            data.append("fileServerHost",this.fileServerHost);
            data.append("fileServerPort",this.fileServerPort);
            data.append("fileServerUsername",this.fileServerUsername);
            data.append("fileServerAgentFilePath",this.fileServerAgentFilePath);
            const { response,error } = await serverSettingService.updateFileServer(data) ;
            if(error){
                
                this.$toast.add({
                    severity:'error', 
                    detail: this.$t('settings.server_settings.file_server_settings.error_417_update_file_server_settings'), 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
            }
            else{
                if(response.status == 200){
                    this.$toast.add({
                        severity:'success', 
                        detail: this.$t('settings.server_settings.file_server_settings.file_server_settings_successfully_update'), 
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000
                    });
                    setTimeout(() => {
                        this.$store.dispatch("logout").then(() => this.$router.push("/login")).catch(err => console.log(err))
                    }, 3000);

                }
            }
            this.showDialog = false;
        },
        updatedPassword() {
            this.changePasswordDialog = false;
        }
    },
}

</script>
