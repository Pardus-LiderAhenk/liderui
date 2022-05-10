<template>
    <div class="p-fluid p-formgrid p-grid">
        <div class="p-col-12">
            <h3>{{$t('settings.server_settings.messaging_server_settings.xmpp_server_information')}}</h3>
        </div>
        <div class="p-field p-col-12 p-md-6">
            <label for="xmppHost">{{$t('settings.server_settings.messaging_server_settings.xmpp_server_address')}}</label>
            <InputText id="xmppHost" type="text" v-model="xmppHost"/>
        </div>
        <div class="p-field p-col-12 p-md-6">
            <label for="xmppPort">{{$t('settings.server_settings.messaging_server_settings.port')}}</label>
            <InputText id="xmppPort" type="text" v-model="xmppPort"/>
        </div>
        <div class="p-field p-col-12 p-md-6">
            <label for="xmppUsername">{{$t('settings.server_settings.messaging_server_settings.xmpp_username')}}</label>
            <InputText id="xmppUsername" type="text" v-model="xmppUsername"/>
        </div>
        <div class="p-field p-col-12 p-md-6">
            <label for="xmppPassword">{{$t('settings.server_settings.messaging_server_settings.xmpp_password')}}</label>
            <InputText id="xmppPassword" type="password" v-model="xmppPassword"/>
        </div>
         <div class="p-field p-col-12 p-md-6">
            <label for="xmppResource">{{$t('settings.server_settings.messaging_server_settings.xmpp_source_name')}}</label>
            <InputText id="xmppResource" type="text" v-model="xmppResource" disabled/>
        </div>
         <div class="p-field p-col-12 p-md-6">
            <label for="xmppServiceName">{{$t('settings.server_settings.messaging_server_settings.xmpp_service_name')}}</label>
            <InputText id="xmppServiceName" type="text" v-model="xmppServiceName" disabled/>
        </div>
         <div class="p-field p-col-12 p-md-4">
            <label for="xmppMaxRetryConnectionCount">{{$t('settings.server_settings.messaging_server_settings.xmpp_retry_connection_count')}}</label>
            <InputText id="xmppMaxRetryConnectionCount" type="text" v-model="xmppMaxRetryConnectionCount"/>
        </div>
         <div class="p-field p-col-12 p-md-4">
            <label for="xmppPacketReplayTimeout">{{$t('settings.server_settings.messaging_server_settings.xmpp_package_replay_timeout')}}</label>
            <InputText id="xmppPacketReplayTimeout" type="text" v-model="xmppPacketReplayTimeout"/>
        </div>
         <div class="p-field p-col-12 p-md-4">
            <label for="xmppPingTimeout">{{$t('settings.server_settings.messaging_server_settings.xmpp_ping_timeout')}}</label>
            <InputText id="xmppPingTimeout" type="text" v-model="xmppPingTimeout"/>
        </div>
       <div class="p-col-12 p-md-6">

       </div>
         <div class="p-field-checkbox p-col-12 p-md-6">
             <Button type="button" :label="$t('settings.server_settings.messaging_server_settings.save')" @click="submitForm()"/>
         </div>
        
    </div>
</template>


<script>
import axios from 'axios';

export default {
    props:['serverSettings'],
    data() {
        return {
            xmppHost:'',
            xmppPort:'',
            xmppUsername:'',
            xmppPassword:'',
            xmppResource:'',
            xmppServiceName:'',
            xmppMaxRetryConnectionCount:'',
            xmppPacketReplayTimeout:'',
            xmppPingTimeout:''
        }
    },
    watch: { 
      	serverSettings: function(newVal) { 
          if(newVal) {
            this.xmppHost = newVal.xmppHost;
            this.xmppPort = newVal.xmppPort;
            this.xmppUsername = newVal.xmppUsername;
            this.xmppPassword = newVal.xmppPassword;
            this.xmppResource = newVal.xmppResource;
            this.xmppServiceName = newVal.xmppServiceName;
            this.xmppMaxRetryConnectionCount = newVal.xmppMaxRetryConnectionCount;
            this.xmppPacketReplayTimeout = newVal.xmppPacketReplayTimeout;
            this.xmppPingTimeout = newVal.xmppPingTimeout;
          }
        }
    },
    methods: {
        submitForm() {
            var data = new FormData();
            data.append("xmppHost",this.xmppHost);
            data.append("xmppPort",this.xmppPort);
            data.append("xmppUsername",this.xmppUsername);
            data.append("xmppPassword",this.xmppPassword);
            data.append("xmppMaxRetryConnectionCount",this.xmppMaxRetryConnectionCount);
            data.append("xmppPacketReplayTimeout",this.xmppPacketReplayTimeout);
            data.append("xmppPingTimeout",this.xmppPingTimeout);

            axios.post('/lider/settings/update/xmpp', data).then(response => {
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
