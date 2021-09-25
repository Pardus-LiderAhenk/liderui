<template>
    <div class="p-fluid p-formgrid p-grid">
        <div class="p-col-12">
            <h3>XMPP Sunucusu Bilgileri</h3>
        </div>
        <div class="p-field p-col-12 p-md-6">
            <label for="firstname6">XMPP Sunucu Adresi</label>
            <InputText id="firstname6" type="text" />
        </div>
        <div class="p-field p-col-12 p-md-6">
            <label for="lastname6">Port</label>
            <InputText id="lastname6" type="text" />
        </div>
        <div class="p-field p-col-12 p-md-6">
            <label for="city">XMPP Kullanıcı Adı</label>
            <InputText id="city" type="text" />
        </div>
        <div class="p-field p-col-12 p-md-6">
            <label for="zip">XMPP Kullanıcı Şifresi</label>
            <InputText id="zip" type="text" />
        </div>
         <div class="p-field p-col-12 p-md-6">
            <label for="zip">XMPP Kaynak Adı</label>
            <InputText id="zip" type="text" />
        </div>
         <div class="p-field p-col-12 p-md-6">
            <label for="zip">XMPP Servis Adı</label>
            <InputText id="zip" type="text" />
        </div>
         <div class="p-field p-col-12 p-md-4">
            <label for="zip">XMPP Retry Connection Count</label>
            <InputText id="zip" type="text" />
        </div>
         <div class="p-field p-col-12 p-md-4">
            <label for="zip">XMPP Packet Replay Timeout</label>
            <InputText id="zip" type="text" />
        </div>
         <div class="p-field p-col-12 p-md-4">
            <label for="zip">XMPP Ping Timeout</label>
            <InputText id="zip" type="text" />
        </div>
       <div class="p-col-12 p-md-6">

       </div>
         <div class="p-field-checkbox p-col-12 p-md-6">
             <Button type="button" label="Değişiklikleri Kaydet" />
         </div>
        
    </div>
</template>


<script>

export default {
    data() {
        return {

        }
    }
}

</script>
