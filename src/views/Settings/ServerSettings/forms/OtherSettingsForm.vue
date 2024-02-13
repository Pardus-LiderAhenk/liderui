<template>
    <div class="p-fluid p-formgrid p-grid">
       <div class="p-col-6">
           <Fieldset class="p-field" :legend="$t('settings.server_settings.other_settings.other_settings')" >
                <div class="p-field-checkbox p-col-12 p-md-12">
                    <InputSwitch v-model="disableLocalUser" />
                    <label>{{$t('settings.server_settings.other_settings.locale_user_activation')}}</label>
                </div>
           </Fieldset>
            <Fieldset class="p-field" :legend="$t('settings.server_settings.other_settings.domain_type')" >
                <div class="p-col-12">
                    <div class="p-field-radiobutton">
                        <RadioButton id="ldap" name="domainType" value="LDAP" v-model="domainType"/>
                        <label for="ldap">{{$t('settings.server_settings.other_settings.ldap')}}</label>
                    </div>
                    <div class="p-field-radiobutton">
                        <RadioButton id="city2" name="domainType" value="ACTIVE_DIRECTORY"  v-model="domainType"/>
                        <label for="city2">{{$t('settings.server_settings.other_settings.active_directory_or_samba')}}</label>
                    </div>
                    <div class="p-field-radiobutton">
                        <RadioButton id="city3" name="domainType" value="NONE"  v-model="domainType"/>
                        <label for="city3">{{$t('settings.server_settings.other_settings.none')}}</label>
                    </div>
                </div>
            </Fieldset>
            <Fieldset class="p-field" :legend="$t('settings.server_settings.other_settings.sudo_type')" >
                <div class="p-col-12">
                    <div class="p-field-radiobutton">
                        <RadioButton id="sudoRoleType1" name="sudoRoleType" value="LDAP" v-model="sudoRoleType"/>
                        <label for="sudoRoleType1">{{$t('settings.server_settings.other_settings.ldap')}}</label>
                    </div>
                    <div class="p-field-radiobutton">
                        <RadioButton id="sudoRoleType2" name="sudoRoleType" value="ACTIVE_DIRECTORY"  v-model="sudoRoleType"/>
                        <label for="sudoRoleType2">{{$t('settings.server_settings.other_settings.active_directory_or_samba')}}</label>
                    </div>
                    <div class="p-field-radiobutton">
                        <RadioButton id="sudoRoleType3" name="sudoRoleType" value="NONE"  v-model="sudoRoleType"/>
                        <label for="sudoRoleType3">{{$t('settings.server_settings.other_settings.none_sudo')}}</label>
                    </div>
                </div>
            </Fieldset>
            <Fieldset class="p-field" :legend="$t('settings.server_settings.other_settings.registration_template_type')" >
                <div class="p-col-12">
                    <div class="p-field-radiobutton">
                        <RadioButton id="registrationType1" name="DEFAULT" value="DEFAULT" v-model="selectedRegistrationType"/>
                        <label for="registrationType1">{{$t('settings.server_settings.other_settings.default')}}</label>
                    </div>
                    <div class="p-field-radiobutton">
                        <RadioButton id="registrationType3" name="HOSTNAME" value="HOSTNAME"  v-model="selectedRegistrationType"/>
                        <label for="registrationType3">{{$t('settings.server_settings.other_settings.hostname')}}</label>
                    </div>
                    <div class="p-field-radiobutton">
                        <RadioButton id="registrationType2" name="IP_ADDRESS" value="IP_ADDRESS"  v-model="selectedRegistrationType"/>
                        <label for="registrationType2">{{$t('settings.server_settings.other_settings.ip_address')}}</label>
                    </div>
                </div>
             </Fieldset>
            <Fieldset class="p-field" :legend="$t('settings.server_settings.other_settings.ahenk_repo_setting')" >
                <div class="p-field p-col-12">
                    <label for="ahenkRepoAddress">{{$t('settings.server_settings.other_settings.repo_address')}}</label>
                    <InputText id="ahenkRepoAddress" type="text" v-model="ahenkRepoAddress"
                        placeholder="deb [arch=amd64] https://repo.liderahenk.org/liderahenk stable main"
                        class="p-inputtext-sm"
                    />
                </div>
                <div class="p-field p-col-12">
                    <label for="ahenkRepoKeyAddress">{{$t('settings.server_settings.other_settings.repo_key_address')}}</label>
                    <InputText id="ahenkRepoKeyAddress" type="text" v-model="ahenkRepoKeyAddress"
                        placeholder="https://repo.liderahenk.org/liderahenk-archive-keyring.asc"
                        class="p-inputtext-sm"
                    />
                </div>
            </Fieldset>
            <Fieldset class="p-field" :legend="$t('settings.server_settings.other_settings.show_machine_status')" >
                <div class="p-field-checkbox p-col-12 p-md-12">
                    <InputSwitch v-model="machineEventStatus" />
                    <label>{{$t('settings.server_settings.other_settings.enabled_machine_status')}}</label>
                </div>
                <div class="p-field p-col-12" v-if="machineEventStatus == true">
                    <label for="machineEventDay">{{$t('settings.server_settings.other_settings.machine_status_days')}}</label>
                    <InputText
                        id="machineEventDay"
                        type="text"
                        v-model="machineEventDay"
                    />
                </div>
            </Fieldset>
            <Fieldset class="p-field" :legend="$t('settings.server_settings.other_settings.send_task_parts')" >
                <div class="p-field p-col-12">
                    <label for="clientSize">{{$t('settings.server_settings.other_settings.task_part_client_size')}}</label>
                    <InputNumber :min="1"
                        id="clientSize"
                        v-model="clientSize"
                    />
                </div>
            </Fieldset>
            <div class="p-field p-col-12 p-text-right">
                <div class="p-d-flex p-jc-end">
                    <div>
                        <Button icon="pi pi-save" type="button" :label="$t('settings.server_settings.other_settings.save')" @click="showDialog = true;"/>
                    </div>
                </div>
            </div>
       </div>
    </div>
    <Dialog :header="$t('settings.server_settings.other_settings.update_settings')" v-model:visible="showDialog" 
        :style="{width: '20vw'}" :modal="true">
        <div class="p-fluid">
            <i class="pi pi-info-circle p-mr-3" style="font-size: 1.5rem" />
            <span>
                {{$t('settings.server_settings.other_settings.other_server_notify')}}
            </span>
        </div>
        <template #footer>
            <Button :label="$t('settings.server_settings.other_settings.cancel')" icon="pi pi-times" 
                @click="showDialog = false" class="p-button-text p-button-sm"
            />
            <Button :label="$t('settings.server_settings.other_settings.yes')" icon="pi pi-check"
                @click="submitForm" class="p-button-sm"
            />
        </template>
    </Dialog>
</template>


<script>
import { serverSettingService } from '../../../../services/Settings/ServerSettingsService.js';

export default {
    props:['serverSettings'],
    data() {
        return {
            domainType: 'LDAP',
            sudoRoleType:  'LDAP',
            disableLocalUser: false,
            ahenkRepoAddress:'',
            ahenkRepoKeyAddress:'',
            showDialog: false,
            selectedRegistrationType: 'DEFAULT',
            machineEventStatus: false,
            machineEventDay:'',
            clientSize:''
        }
    },
    watch: { 
      	serverSettings: function(newVal) { 
          if(newVal) {
            this.domainType = newVal.domainType;
            this.sudoRoleType = newVal.sudoRoleType;
            this.disableLocalUser = newVal.disableLocalUser;
            this.ahenkRepoAddress = newVal.ahenkRepoAddress;
            this.ahenkRepoKeyAddress = newVal.ahenkRepoKeyAddress;
            this.emailUsername = newVal.emailUsername;
            this.emailPassword = newVal.emailPassword;
            this.selectedRegistrationType = newVal.selectedRegistrationType;
            this.machineEventStatus = newVal.machineEventStatus;
            this.machineEventDay = newVal.machineEventDay;
            this.clientSize = newVal.clientSize;
          }
        }
    },

    methods: {
        async submitForm() {
            let data = new FormData();
            data.append("domainType",this.domainType);
            data.append("sudoRoleType",this.sudoRoleType);
            data.append("disableLocalUser",this.disableLocalUser);
            data.append("ahenkRepoAddress",this.ahenkRepoAddress);
            data.append("ahenkRepoKeyAddress",this.ahenkRepoKeyAddress);
            data.append("selectedRegistrationType", this.selectedRegistrationType);
            data.append("machineEventStatus", this.machineEventStatus);
            data.append("machineEventDay", this.machineEventDay);
            data.append("clientSize", this.clientSize);

            const { response,error } = await serverSettingService.updateOtherSettings(data);
            if(error){
                this.$toast.add({
                    severity:'error', 
                    detail: this.$t('settings.server_settings.other_settings.error_update_other_settings'), 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
            }
            else{
                if(response.status == 200){
                    this.$toast.add({
                        severity:'success', 
                        detail: this.$t('settings.server_settings.other_settings.other_server_settings_successfully_update'), 
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000
                    });
                    setTimeout(() => {
                        this.$store.dispatch("logout").then(() => this.$router.push("/login")).catch(err => console.log(err))
                    }, 3000);
                }
                
            }
            
        this.showDialog = false;
        }
    },
}

</script>
