<template>
    <div class="p-fluid p-formgrid p-grid">
       <div class="p-col-7">
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
            <div class="p-field-checkbox p-col-12 p-md-6">
             <Button type="button" :label="$t('settings.server_settings.other_settings.save')" @click="submitForm()"/>
            </div>
       </div>
    </div>
</template>


<script>
import axios from 'axios';
export default {
    props:['serverSettings'],
    data() {
        return {
            domainType: 'LDAP',
            disableLocalUser: false,
            ahenkRepoAddress:'',
            ahenkRepoKeyAddress:'',
        }
    },
    watch: { 
      	serverSettings: function(newVal) { 
          if(newVal) {
            this.domainType = newVal.domainType;
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
            var data = new FormData();
            data.append("domainType",this.domainType);
            data.append("disableLocalUser",this.disableLocalUser);
            data.append("ahenkRepoAddress",this.ahenkRepoAddress);
            data.append("ahenkRepoKeyAddress",this.ahenkRepoKeyAddress);

            axios.post('/lider/settings/update/otherSetting', data).then(response => {
                // FIXME Burada logout işlemi yapılacak. ?

                this.$toast.add({
                    severity:'success', 
                    detail: "Bilgiler başarı ile güncellenmiştir.", 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
            });

        }
    },
}

</script>
