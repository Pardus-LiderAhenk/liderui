<template>
    <div class="p-fluid p-formgrid p-grid">
        <div class="p-col-12">
            <h3>Email Ayarları</h3>
        </div>
        <div class="p-field p-col-12 p-md-4">
            <label for="emailHost">Email Host Adresi</label>
            <InputText id="emailHost" type="text" v-model="emailHost" placeholder="smtp.gmail.com"/>
        </div>
        <div class="p-field p-col-12 p-md-4">
            <label for="emailPort">Email Port</label>
            <InputText id="emailPort" type="text" v-model="emailPort" placeholder="587"/>
        </div>
        <div class="p-field p-col-12 p-md-4">
            <label for="emailUsername">Email Kullanıcı Adresi</label>
            <InputText id="emailUsername" type="text" v-model="emailUsername" placeholder="lider@liderahenk.org"/>
        </div>
        <div class="p-field p-col-12 p-md-4">
            <label for="emailPassword">Email Şifresi</label>
            <InputText id="emailPassword" type="password" v-model="emailPassword"/>
        </div>
         <div class="p-field p-col-12 p-md-4">
            <label for="zip">SMTP Doğrulama</label>
            <Dropdown :options="yesNoChoise" optionLabel="label" optionValue="value" v-model="smtpAuth"></Dropdown>
        </div>
         <div class="p-field p-col-12 p-md-4">
            <label for="zip">TLS Aktif</label>
            <Dropdown :options="yesNoChoise" optionLabel="label" optionValue="value" v-model="tlsEnabled"></Dropdown>
        </div>
        <div class="p-col-12 p-md-8">

       </div>
         <div class="p-field-checkbox p-col-12 p-md-4">
             <Button type="button" label="Değişiklikleri Kaydet" />
         </div>
        
    </div>
</template>


<script>
import axios from 'axios';
export default {
    props:['serverSettings'],
    data() {
        return {
            yesNoChoise: [
                {label:'Evet', value:true},
                {label:'Hayır', value:false},
            ],
            smtpAuth:true,
            tlsEnabled:true,
            emailHost:'',
            emailPort:'',
            emailUsername:'',
            emailPassword:'',
        }
        
    },
    watch: { 
      	serverSettings: function(newVal) { 
          if(newVal) {
            this.smtpAuth = newVal.smtpAuth;
            this.tlsEnabled = newVal.tlsEnabled;
            this.emailHost = newVal.emailHost;
            this.emailPort = newVal.emailPort;
            this.emailUsername = newVal.emailUsername;
            this.emailPassword = newVal.emailPassword;
          }
        }
    },
    methods: {
        submitForm() {
            var data = new FormData();
            data.append("smtpAuth",this.smtpAuth);
            data.append("tlsEnabled",this.tlsEnabled);
            data.append("emailHost",this.emailHost);
            data.append("emailPort",this.emailPort);
            data.append("emailUsername",this.emailUsername);
            data.append("emailPassword",this.emailPassword);

            axios.post('/lider/settings/update/emailSetting', data).then(response => {
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
