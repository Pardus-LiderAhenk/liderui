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
            <InputText id="fileServerPort" type="text" v-model="fileServerPort"/>
        </div>
        <div class="p-field p-col-12 p-md-6">
            <label for="fileServerUsername">{{$t('settings.server_settings.file_server_settings.username')}}</label>
            <InputText id="fileServerUsername" type="text" v-model="fileServerUsername"/>
        </div>
         <div class="p-field p-col-12 p-md-6">
            <label for="fileServerPassword">{{$t('settings.server_settings.file_server_settings.password')}}</label>
            <InputText id="fileServerPassword" type="text" v-model="fileServerPassword"/>
        </div>
         <div class="p-field p-col-12 p-md-6">
            <label for="fileServerAgentFilePath">{{$t('settings.server_settings.file_server_settings.agent_file_directory')}}</label>
            <InputText id="fileServerAgentFilePath" type="text" v-model="fileServerAgentFilePath"/>
        </div>
       <div class="p-col-12 p-md-6">

       </div>
        <div class="p-field p-col-12 p-text-right">
            <div class="p-d-flex p-jc-end">
                <div>
                    <Button icon="pi pi-save" type="button" :label="$t('settings.server_settings.file_server_settings.save')" @click="submitForm()"/>
                </div>
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
                    detail: this.$t('settings.server_settings.directory_server_settings.information_has_been_successfully_updated'), 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
            });

        }
    },
}

</script>
