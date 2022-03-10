<template>
    <div class="p-fluid p-formgrid p-grid">
        <div class="p-col-12">
            <h3>Dosya Sunucusu Bilgileri</h3>
        </div>
        <div class="p-field p-col-12 p-md-2">
            <label for="fileServerProtocol">Transfer Tipi</label>
            <Dropdown id="fileServerProtocol" :options="transferTypes" optionLabel="label" optionValue="value" v-model="fileServerProtocol"></Dropdown>
        </div>
        <div class="p-field p-col-12 p-md-6">
            <label for="fileServerHost">Dosya Sunucusu Adresi</label>
            <InputText id="fileServerHost" type="text" v-model="fileServerHost"/>
        </div>
        <div class="p-field p-col-12 p-md-4">
            <label for="fileServerPort">Port</label>
            <InputText id="fileServerPort" type="text" v-model="fileServerPort"/>
        </div>
        <div class="p-field p-col-12 p-md-6">
            <label for="fileServerUsername">Kullanıcı Adı</label>
            <InputText id="fileServerUsername" type="text" v-model="fileServerUsername"/>
        </div>
         <div class="p-field p-col-12 p-md-6">
            <label for="fileServerPassword">Kullanıcı Şifresi</label>
            <InputText id="fileServerPassword" type="text" v-model="fileServerPassword"/>
        </div>
         <div class="p-field p-col-12 p-md-6">
            <label for="fileServerAgentFilePath">Ajan Dosya Dizini</label>
            <InputText id="fileServerAgentFilePath" type="text" v-model="fileServerAgentFilePath"/>
        </div>
       <div class="p-col-12 p-md-6">

       </div>
        <div class="p-col-12 p-md-6">

       </div>
         <div class="p-field-checkbox p-col-12 p-md-6">
             <Button type="button" label="Değişiklikleri Kaydet" @click="submitForm()"/>
         </div>
        
    </div>
</template>


<script>
import axios from 'axios';
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
        }
    },
    watch: { 
      	serverSettings: function(newVal) { 
          if(newVal) {
            this.fileServerProtocol = newVal.fileServerProtocol;
            this.fileServerHost = newVal.fileServerHost;
            this.fileServerPort = newVal.fileServerPort;
            this.fileServerUsername = newVal.fileServerUsername;
            this.fileServerPassword = newVal.fileServerPassword;
            this.fileServerAgentFilePath = newVal.fileServerAgentFilePath;
          }
        }
    },
    methods: {
        submitForm() {
            var data = new FormData();
            data.append("fileServerProtocol",this.fileServerProtocol);
            data.append("fileServerHost",this.fileServerHost);
            data.append("fileServerPort",this.fileServerPort);
            data.append("fileServerUsername",this.fileServerUsername);
            data.append("fileServerPassword",this.fileServerPassword);
            data.append("fileServerAgentFilePath",this.fileServerAgentFilePath);

            axios.post('/lider/settings/update/fileServer', data).then(response => {
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
