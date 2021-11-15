<template>
    <div class="p-fluid p-formgrid p-grid">
        <div class="p-col-12">
            <h3>Genel Bilgiler</h3>
        </div>
        <div class="p-field p-col-12">
            <label for="firstname6">Kullanıcı ID</label>
            <InputText id="firstname6" type="text" />
        </div>
        <div class="p-field p-col-12">
            <label for="firstname6">Kullanıcı Adı</label>
            <InputText id="firstname6" type="text" />
        </div>
        <div class="p-field p-col-12">
            <label for="firstname6">Kullanıcı Soyadı</label>
            <InputText id="firstname6" type="text" />
        </div>
        <div class="p-field p-col-12">
            <label for="firstname6">Mail Adresi</label>
            <InputText id="firstname6" type="text" />
        </div>
        <div class="p-field p-col-12">
            <label for="firstname6">Telefon</label>
            <InputText id="firstname6" type="text" />
        </div>
        <div class="p-field p-col-12">
            <label for="firstname6">Adres</label>
            <Textarea  :autoResize="true" rows="5" cols="30" />
        </div>
        <div class="p-col-12 p-md-8">

       </div>
         <div class="p-field-checkbox p-col-12 p-md-4">
             <Button type="button" label="Bilgileri Güncelle" />
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