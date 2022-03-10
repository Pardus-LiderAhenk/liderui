<template>
    <div class="p-fluid p-formgrid p-grid">
        <div class="p-col-12">
            <h3>LDAP Sunucusu Bilgileri</h3>
        </div>
        <div class="p-field p-col-12 p-md-4">
            <label for="ldapServer">LDAP Sunucu Adresi</label>
            <InputText id="ldapServer" type="text" v-model="ldapServer"/>
        </div>
        <div class="p-field p-col-12 p-md-2">
            <label for="ldapPort">Port</label>
            <InputText id="ldapPort" type="text" v-model="ldapPort"/>
        </div>
        <div class="p-field p-col-12 p-md-6">
            <label for="ldapRootDn">Domain Adı</label>
            <InputText id="ldapRootDn" type="text" v-model="ldapRootDn" disabled/>
        </div>
        <div class="p-field p-col-12 p-md-6">
            <label for="ldapUsername">LDAP Kullanıcı DN</label>
            <InputText id="ldapUsername" type="text" v-model="ldapUsername"/>
        </div>
         <div class="p-field p-col-12 p-md-6">
            <label for="ldapPassword">LDAP Kullanıcı Şifresi</label>
            <InputText id="ldapPassword" type="password" v-model="ldapPassword" disabled/>
        </div>
         <div class="p-field p-col-12 p-md-6">
            <label for="agentLdapBaseDn">Ahenk Klasörü</label>
            <InputText id="agentLdapBaseDn" type="text" v-model="agentLdapBaseDn" disabled/>
        </div>
         <div class="p-field p-col-12 p-md-6">
            <label for="userLdapBaseDn">Kullanıcı Klasörü</label>
            <InputText id="userLdapBaseDn" type="text" v-model="userLdapBaseDn" disabled/>
        </div>
         <div class="p-field p-col-12 p-md-6">
            <label for="groupLdapBaseDn">Grup Klasörü</label>
            <InputText id="groupLdapBaseDn" type="text" v-model="groupLdapBaseDn" disabled/>
        </div>
         <div class="p-field p-col-12 p-md-6">
            <label for="ahenkGroupLdapBaseDn">İstemci Grubu Klasörü</label>
            <InputText id="ahenkGroupLdapBaseDn" type="text" v-model="ahenkGroupLdapBaseDn" disabled/>
        </div>
         <div class="p-field p-col-12 p-md-6">
            <label for="userGroupLdapBaseDn">Kullanıcı Grubu Klasörü</label>
            <InputText id="userGroupLdapBaseDn" type="text" v-model="userGroupLdapBaseDn" disabled/>
        </div>
         <div class="p-field p-col-12 p-md-6">
            <label for="userLdapRolesDn">Yetki Grubu Klasörü(Sudo)</label>
            <InputText id="userLdapRolesDn" type="text" v-model="userLdapRolesDn" disabled/>
        </div>
        <div class="p-field-checkbox p-col-12 p-md-6">
            <Checkbox id="cbShowADSettings" name="cbShowADSettings" v-model="cbShowADSettings" :binary="true"/>
            <label for="city1">Aktif Dizin ayarları (Hibrit yapılı kurulumlar için bu ayarlar yapılmalıdır)</label>
        </div>
        <template v-if="cbShowADSettings">
            <div class="p-field p-col-12 p-md-4">
                
            </div>
            <div class="p-field p-col-12 p-md-4">
                <label for="adIpAddress">AD Sunucu Adresi</label>
                <InputText id="adIpAddress" type="text" v-model="adIpAddress"/>
            </div>
            <div class="p-field p-col-12 p-md-2">
                <label for="adPort">AD Port</label>
                <InputText id="adPort" type="text" v-model="adPort"/>
            </div>
            <div class="p-field p-col-12 p-md-6">
                <label for="adDomainName">AD Domain Adı</label>
                <InputText id="adDomainName" type="text" v-model="adDomainName"/>
            </div>
            <div class="p-field p-col-12 p-md-6">
                <label for="adAdminUserName">AD Yönetici Kullanıcı Adı</label>
                <InputText id="adAdminUserName" type="text" v-model="adAdminUserName"/>
            </div>
            <div class="p-field p-col-12 p-md-6">
                <label for="adAdminUserFullDN">AD Yönetici Kullanıcı Tam DN</label>
                <InputText id="adAdminUserFullDN" type="text" v-model="adAdminUserFullDN"/>
            </div>
            <div class="p-field p-col-12 p-md-6">
                <label for="adAdminPassword">AD Yönetici Şifresi</label>
                <InputText id="adAdminPassword" type="password" v-model="adAdminPassword"/>
            </div>
            <div class="p-field p-col-12 p-md-6">
                <label for="adHostName">AD Host Adresi</label>
                <InputText id="adHostName" type="text" v-model="adHostName"/>
            </div>

            <div class="p-field p-col-12 p-md-6 p-grid">
                <div class="p-field p-md-4">
                    <label for="userLdapRolesDn">SSL Kullan</label>
                    <Dropdown v-model="adUseSSL" :options="yesNoDropdown" optionLabel="label" optionValue="value"/>
                </div>
                <div class="p-field  p-md-4">
                    <label for="userLdapRolesDn">TLS Kullan</label>
                    <Dropdown v-model="adUseTLS" :options="yesNoDropdown" optionLabel="label" optionValue="value"/>
                </div>
                <div class="p-field  p-md-4">
                    <label for="userLdapRolesDn">Sertifika Kullan</label>
                    <Dropdown v-model="adAllowSelfSignedCert" :options="yesNoDropdown" optionLabel="label" optionValue="value"/>
                </div>
            </div>
           

        </template>
         <div class="p-field-checkbox p-col-12 p-md-6">
             <Button type="button" label="Değişiklikleri Kaydet" @click="submitForm"/>
         </div>
        
    </div>
</template>


<script>
import axios from 'axios';

export default {
    props:['serverSettings'],
    data() {
        return {
            yesNoDropdown:[
                {label: 'Evet', value:true},
                {label: 'Hayır', value:false}
            ],
            ldapServer:'',
            ldapPort:'',
            ldapRootDn:'',
            ldapUsername:'',
            ldapPassword:'',
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

        }
    },
    watch: { 
      	serverSettings: function(newVal) { 
          if(newVal) {
              this.ldapServer = newVal.ldapServer;
              this.ldapPort = newVal.ldapPort;
              this.ldapRootDn = newVal.ldapRootDn;
              this.ldapUsername = newVal.ldapUsername;
              this.ldapPassword = newVal.ldapPassword;
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
        }
    },
    methods: {
        submitForm() {
            var data = new FormData();
            data.append("ldapServer",this.ldapServer);
            data.append("ldapPort",this.ldapPort);
            data.append("ldapUsername",this.ldapUsername);
            data.append("ldapPassword",this.ldapPassword);
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

            axios.post('/lider/settings/update/ldap', data).then(response => {
                // FIXME Burada logout işlemi yapılacak. 

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
