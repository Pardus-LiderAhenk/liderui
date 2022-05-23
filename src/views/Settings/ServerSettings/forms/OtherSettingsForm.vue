<template>
    <div class="p-fluid p-formgrid p-grid">
       <div class="p-col-6">
           <div class="p-col-12">
                <h3>{{$t('settings.server_settings.other_settings.other_settings')}}</h3>
            </div>
            <div class="p-field-checkbox p-col-12 p-md-12">
                <InputSwitch v-model="disableLocalUser" />
                <label>{{$t('settings.server_settings.other_settings.locale_user_activation')}}</label>
            </div>
            <div class="p-col-12">
                <h4>{{$t('settings.server_settings.other_settings.domain_type')}}</h4>
            </div>
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
            <div class="p-col-12">
                <h4>{{$t('settings.server_settings.other_settings.sudo_type')}}</h4>
            </div>
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
                    <label for="sudoRoleType3">{{$t('settings.server_settings.other_settings.none')}}</label>
                </div>
            </div>
            <div class="p-col-12">
                <h4>{{$t('settings.server_settings.other_settings.ahenk_repo_setting')}}</h4>
            </div>
            <div class="p-field p-col-12">
                <label for="ahenkRepoAddress">{{$t('settings.server_settings.other_settings.repo_address')}}</label>
                <InputText id="ahenkRepoAddress" type="text" v-model="ahenkRepoAddress"
                    placeholder="deb [arch=amd64] http://repo.liderahenk.org/liderahenk stable main"
                />
            </div>
            <div class="p-field p-col-12">
                <label for="ahenkRepoKeyAddress">{{$t('settings.server_settings.other_settings.repo_key_address')}}</label>
                <InputText id="ahenkRepoKeyAddress" type="text" v-model="ahenkRepoKeyAddress"
                    placeholder="http://repo.liderahenk.org/liderahenk-archive-keyring.asc"
                />
            </div>
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
import axios from 'axios';
export default {
    props:['serverSettings'],
    data() {
        return {
            domainType: 'LDAP',
            sudoRoleType:  'LDAP',
            disableLocalUser: false,
            ahenkRepoAddress:'',
            ahenkRepoKeyAddress:'',
            showDialog: false
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
          }
        }
    },
    methods: {
        submitForm() {
            let data = new FormData();
            data.append("domainType",this.domainType);
            data.append("sudoRoleType",this.sudoRoleType);
            data.append("disableLocalUser",this.disableLocalUser);
            data.append("ahenkRepoAddress",this.ahenkRepoAddress);
            data.append("ahenkRepoKeyAddress",this.ahenkRepoKeyAddress);

            axios.post('/lider/settings/update/otherSettings', data).then(response => {
                this.$toast.add({
                    severity:'success', 
                    detail: this.$t('settings.server_settings.other_settings.other_server_settings_successfully_update'), 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
            });
            setTimeout(() => {
                this.$store.dispatch("logout").then(() => this.$router.push("/login")).catch(err => console.log(err))
            }, 3000);
            this.showDialog = false;
        }
    },
}

</script>
