<template>
    <div class="p-fluid p-formgrid p-grid">
        <div class="p-col-12">
            <h3>{{$t('settings.server_settings.directory_server_settings.ldap_server_informations')}}</h3>
        </div>
        <div class="p-field p-col-12 p-md-4">
            <label for="ldapServer">{{$t('settings.server_settings.directory_server_settings.ldap_server_address')}}</label>
            <InputText id="ldapServer" type="text" v-model="ldapServer"/>
        </div>
        <div class="p-field p-col-12 p-md-2">
            <label for="ldapPort">{{$t('settings.server_settings.directory_server_settings.port')}}</label>
            <InputText id="ldapPort" type="number" v-model="ldapPort"/>
        </div>
        <div class="p-field p-col-12 p-md-6">
            <label for="ldapRootDn">{{$t('settings.server_settings.directory_server_settings.domain_name')}}</label>
            <InputText id="ldapRootDn" type="text" v-model="ldapRootDn" disabled/>
        </div>
        <div class="p-field p-col-12 p-md-6">
            <label for="ldapUsername">{{$t('settings.server_settings.directory_server_settings.ldap_user_dn')}}</label>
            <InputText id="ldapUsername" type="text" v-model="ldapUsername"/>
        </div>
        <div class="p-field p-col-12 p-md-6">
            <label for="ldapPassword">{{$t('settings.server_settings.directory_server_settings.ldap_user_password')}}</label>
            <div class="p-inputgroup" v-if="ldapUsernameDefine">
                <InputText type="password"  
                    value="******************" 
                    readonly/>
                <Button
                    icon="pi pi-unlock"
                    class="p-button-sm"
                    type="button" @click="changePasswordDialog = true" 
                    :label="$t('settings.server_settings.directory_server_settings.change_password')" />
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
         <div class="p-field p-col-12 p-md-6">
            <label for="agentLdapBaseDn">{{$t('settings.server_settings.directory_server_settings.ahenk_folder')}}</label>
            <InputText id="agentLdapBaseDn" type="text" v-model="agentLdapBaseDn" disabled/>
        </div>
         <div class="p-field p-col-12 p-md-6">
            <label for="userLdapBaseDn">{{$t('settings.server_settings.directory_server_settings.user_folder')}}</label>
            <InputText id="userLdapBaseDn" type="text" v-model="userLdapBaseDn" disabled/>
        </div>
         <div class="p-field p-col-12 p-md-6">
            <label for="groupLdapBaseDn">{{$t('settings.server_settings.directory_server_settings.group_folder')}}</label>
            <InputText id="groupLdapBaseDn" type="text" v-model="groupLdapBaseDn" disabled/>
        </div>
         <div class="p-field p-col-12 p-md-6">
            <label for="ahenkGroupLdapBaseDn">{{$t('settings.server_settings.directory_server_settings.agent_group_folder')}}</label>
            <InputText id="ahenkGroupLdapBaseDn" type="text" v-model="ahenkGroupLdapBaseDn" disabled/>
        </div>
         <div class="p-field p-col-12 p-md-6">
            <label for="userGroupLdapBaseDn">{{$t('settings.server_settings.directory_server_settings.user_group_folder')}}</label>
            <InputText id="userGroupLdapBaseDn" type="text" v-model="userGroupLdapBaseDn" disabled/>
        </div>
         <div class="p-field p-col-12 p-md-6">
            <label for="userLdapRolesDn">{{$t('settings.server_settings.directory_server_settings.authority_group_folder')}}</label>
            <InputText id="userLdapRolesDn" type="text" v-model="userLdapRolesDn" disabled/>
        </div>
        <div class="p-field-checkbox p-col-12 p-md-6">
            <Checkbox id="cbShowADSettings" name="cbShowADSettings" v-model="cbShowADSettings" :binary="true"/>
            <label for="city1">{{$t('settings.server_settings.directory_server_settings.active_directory_settings')}}</label>
        </div>
        <template v-if="cbShowADSettings">
            <div class="p-field p-col-12 p-md-4">
                
            </div>
            <div class="p-field p-col-12 p-md-4">
                <label for="adIpAddress">{{$t('settings.server_settings.directory_server_settings.active_directory_address')}}</label>
                <InputText id="adIpAddress" type="text" v-model="adIpAddress"/>
            </div>
            <div class="p-field p-col-12 p-md-2">
                <label for="adPort">{{$t('settings.server_settings.directory_server_settings.active_directory_port')}}</label>
                <InputText id="adPort" type="text" v-model="adPort"/>
            </div>
            <div class="p-field p-col-12 p-md-6">
                <label for="adDomainName">{{$t('settings.server_settings.directory_server_settings.active_directory_domain_name')}}</label>
                <InputText id="adDomainName" type="text" v-model="adDomainName"/>
            </div>
            <div class="p-field p-col-12 p-md-6">
                <label for="adAdminUserName">{{$t('settings.server_settings.directory_server_settings.active_directory_admin_username')}}</label>
                <InputText id="adAdminUserName" type="text" v-model="adAdminUserName"/>
            </div>
            <div class="p-field p-col-12 p-md-6">
                <label for="adAdminUserFullDN">{{$t('settings.server_settings.directory_server_settings.active_directory_admin_dn')}}</label>
                <InputText id="adAdminUserFullDN" type="text" v-model="adAdminUserFullDN"/>
            </div>
            <div class="p-field p-col-12 p-md-6">
                <label for="adAdminPassword">{{$t('settings.server_settings.directory_server_settings.active_directory_admin_password')}}</label>
                <div class="p-inputgroup" v-if="adUsernameDefine">
                    <InputText type="password"  
                        value="******************" 
                        readonly/>
                    <Button 
                        icon="pi pi-unlock"
                        class="p-button-sm"
                        type="button" @click="changeAdPasswordDialog = true" 
                        :label="$t('settings.server_settings.directory_server_settings.change_password')" />
                </div>
                <div class="p-inputgroup" v-else>
                    <InputText type="password"  
                        value="" 
                        readonly/>
                    <Button 
                        icon="pi pi-save"
                        class="p-button-sm"
                        type="button" @click="changeAdPasswordDialog = true" 
                        :label="$t('settings_password.create_password')" />
                </div>
            </div>
            <div class="p-field p-col-12 p-md-6">
                <label for="adHostName">{{$t('settings.server_settings.directory_server_settings.active_directory_hostname')}}</label>
                <InputText id="adHostName" type="text" v-model="adHostName"/>
            </div>

            <div class="p-field p-col-12 p-md-6 p-grid">
                <div class="p-field p-md-4">
                    <label for="userLdapRolesDn">{{$t('settings.server_settings.directory_server_settings.ssl_certification')}}</label>
                    <Dropdown v-model="adUseSSL" :options="yesNoDropdown" optionLabel="label" optionValue="value"/>
                </div>
                <div class="p-field  p-md-4">
                    <label for="userLdapRolesDn">{{$t('settings.server_settings.directory_server_settings.tls_certification')}}</label>
                    <Dropdown v-model="adUseTLS" :options="yesNoDropdown" optionLabel="label" optionValue="value"/>
                </div>
                <div class="p-field  p-md-4">
                    <label for="userLdapRolesDn">{{$t('settings.server_settings.directory_server_settings.use_certification')}}</label>
                    <Dropdown v-model="adAllowSelfSignedCert" :options="yesNoDropdown" optionLabel="label" optionValue="value"/>
                </div>
            </div>
        </template>
        <div class="p-field p-col-12 p-text-right">
            <div class="p-d-flex p-jc-end">
                <div>
                    <Button icon="pi pi-save" type="button" :label="$t('settings.server_settings.directory_server_settings.save')" @click="showDialog = true"/>
                </div>
            </div>
        </div>
    </div>
    <SettingsPasswordComponet v-if="changePasswordDialog"
        :visible="changePasswordDialog"
        :type="'ldapPassword'"
        :settingsOldPassword="ldapUsernameDefine"
        @updatedPassword="updatedLdapPassword"
        @update:visible="changePasswordDialog = false"/>

    <SettingsPasswordComponet v-if="changeAdPasswordDialog"
        :visible="changeAdPasswordDialog"
        :type="'AdAdminPassword'"
        :settingsOldPassword="adUsernameDefine"
        @updatedPassword="updatedAdPassword"
        @update:visible="changeAdPasswordDialog = false"/>

    <Dialog :header="$t('settings.server_settings.directory_server_settings.update_settings')" v-model:visible="showDialog" 
        :style="{width: '20vw'}" :modal="true">
        <div class="p-fluid">
            <i class="pi pi-info-circle p-mr-3" style="font-size: 1.5rem" />
            <span>
                {{$t('settings.server_settings.directory_server_settings.directory_server_notify')}}
            </span>
        </div>
        <template #footer>
            <Button :label="$t('settings.server_settings.directory_server_settings.cancel')" icon="pi pi-times" 
                @click="showDialog = false" class="p-button-text p-button-sm"
            />
            <Button :label="$t('settings.server_settings.directory_server_settings.yes')" icon="pi pi-check"
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
            yesNoDropdown:[
                {label: this.$t('settings.server_settings.directory_server_settings.yes'), value:true},
                {label: this.$t('settings.server_settings.directory_server_settings.no'), value:false}
            ],
            ldapServer:'',
            ldapPort:'',
            ldapRootDn:'',
            ldapUsername:'',
            agentLdapBaseDn:'',
            userLdapBaseDn:'',
            groupLdapBaseDn:'',
            ahenkGroupLdapBaseDn:'',
            userGroupLdapBaseDn:'',
            userLdapRolesDn:'',
            cbShowADSettings:false,
            adUseSSL:true,
            adUseTLS:true,
            adAllowSelfSignedCert:true,
            adHostName:'',
            adAdminPassword:'',
            adIpAddress:'',
            adPort:'',
            adDomainName:'',
            adAdminUserName:'',
            adAdminUserFullDN:'',
            showDialog: false,
            changePasswordDialog: false,
            changeAdPasswordDialog: false,
            ldapUsernameDefine: false,
            adUsernameDefine: false
        }
    },
    components: {
        SettingsPasswordComponet
    },
    watch: { 
      	serverSettings: function(newVal) { 
          if(newVal) {
              this.ldapServer = newVal.ldapServer;
              this.ldapPort = newVal.ldapPort;
              this.ldapRootDn = newVal.ldapRootDn;
              this.ldapUsername = newVal.ldapUsername;
              this.agentLdapBaseDn = newVal.agentLdapBaseDn;
              this.userLdapBaseDn = newVal.userLdapBaseDn;
              this.groupLdapBaseDn = newVal.groupLdapBaseDn;
              this.ahenkGroupLdapBaseDn = newVal.ahenkGroupLdapBaseDn;
              this.userGroupLdapBaseDn = newVal.userGroupLdapBaseDn;
              this.userLdapRolesDn = newVal.userLdapRolesDn;
              this.adUseSSL = newVal.adUseSSL;
              this.adUseTLS = newVal.adUseTLS;
              this.adAllowSelfSignedCert = newVal.adAllowSelfSignedCert;
              this.adHostName = newVal.adHostName;
              this.adAdminPassword = newVal.adAdminPassword;
              this.adIpAddress = newVal.adIpAddress;
              this.adPort = newVal.adPort;
              this.adDomainName = newVal.adDomainName;
              this.adAdminUserName = newVal.adAdminUserName;
              this.adAdminUserFullDN = newVal.adAdminUserFullDN;
              this.cbShowADSettings = this.adHostName ? true : false;
          }
          if(this.serverSettings && this.serverSettings.ldapUsername){
                this.ldapUsernameDefine = true
          }
          if(this.serverSettings && this.serverSettings.adAdminUserName){
                this.adUsernameDefine = true
          }
        }
    },
    methods: {
        async submitForm() {
            var data = new FormData();
            data.append("ldapServer",this.ldapServer);
            data.append("ldapPort",this.ldapPort);
            data.append("ldapUsername",this.ldapUsername);
            data.append("adIpAddress",this.adIpAddress);
            data.append("adPort",this.adPort);
            data.append("adDomainName",this.adDomainName);
            data.append("adAdminUserName",this.adAdminUserName);
            data.append("adAdminUserFullDN",this.adAdminUserFullDN);
            data.append("adAdminPassword",this.adAdminPassword);
            data.append("adHostName",this.adHostName);
            data.append("adUseSSL",this.adUseSSL);
            data.append("adUseTLS",this.adUseTLS);
            data.append("adAllowSelfSignedCert",this.adAllowSelfSignedCert);

            const { response,error } = await serverSettingService.updateLdap(data);
            if(error){
                this.$toast.add({
                    severity:'error', 
                    detail: this.$t('settings.server_settings.directory_server_settings.error_417_update_directory_server_settings'), 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
            }
            else{
                if(response.status == 200){
                    this.$toast.add({
                        severity:'success', 
                        detail: this.$t('settings.server_settings.directory_server_settings.directory_server_settings_successfully_update'), 
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
        updatedLdapPassword() {
            this.changePasswordDialog = false;
        },
        updatedAdPassword() {
            this.changeAdPasswordDialog = false;
        }
    },
}

</script>
