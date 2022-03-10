<template>
    <div class="p-fluid p-formgrid p-grid">
        <div class="p-col-12">
            <h3>XMPP Sunucusu Bilgileri</h3>
        </div>
        <div class="p-field p-col-12 p-md-6">
            <label for="xmppHost">XMPP Sunucu Adresi</label>
            <InputText id="xmppHost" type="text" v-model="xmppHost"/>
        </div>
        <div class="p-field p-col-12 p-md-6">
            <label for="xmppPort">Port</label>
            <InputText id="xmppPort" type="text" v-model="xmppPort"/>
        </div>
        <div class="p-field p-col-12 p-md-6">
            <label for="xmppUsername">XMPP Kullanıcı Adı</label>
            <InputText id="xmppUsername" type="text" v-model="xmppUsername"/>
        </div>
        <div class="p-field p-col-12 p-md-6">
            <label for="xmppPassword">XMPP Kullanıcı Şifresi</label>
            <InputText id="xmppPassword" type="password" v-model="xmppPassword"/>
        </div>
         <div class="p-field p-col-12 p-md-6">
            <label for="xmppResource">XMPP Kaynak Adı</label>
            <InputText id="xmppResource" type="text" v-model="xmppResource" disabled/>
        </div>
         <div class="p-field p-col-12 p-md-6">
            <label for="xmppServiceName">XMPP Servis Adı</label>
            <InputText id="xmppServiceName" type="text" v-model="xmppServiceName" disabled/>
        </div>
         <div class="p-field p-col-12 p-md-4">
            <label for="xmppMaxRetryConnectionCount">XMPP Retry Connection Count</label>
            <InputText id="xmppMaxRetryConnectionCount" type="text" v-model="xmppMaxRetryConnectionCount"/>
        </div>
         <div class="p-field p-col-12 p-md-4">
            <label for="xmppPacketReplayTimeout">XMPP Packet Replay Timeout</label>
            <InputText id="xmppPacketReplayTimeout" type="text" v-model="xmppPacketReplayTimeout"/>
        </div>
         <div class="p-field p-col-12 p-md-4">
            <label for="xmppPingTimeout">XMPP Ping Timeout</label>
            <InputText id="xmppPingTimeout" type="text" v-model="xmppPingTimeout"/>
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
                    detail: "Bilgiler başarı ile güncellenmiştir.", 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
            });

        }
    },
}

</script>
