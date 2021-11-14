<template>
    <div class="p-fluid p-formgrid p-grid">
        <div class="p-col-12">
            <h3>Kullanıcı Bilgileri</h3>
        </div>
        <div class="p-field p-col-8">
            <label for="firstname6">Kullanıcı ID</label>
            <InputText id="firstname6" type="text" />
        </div>
        <div class="p-field p-col-8">
            <label for="lastname6">Kullanıcı Adı</label>
            <InputText id="lastname6" type="text" />
        </div>
        <div class="p-field p-col-8">
            <label for="city">Kullanıcı Soyadı</label>
            <InputText id="city" type="text" />
        </div>
        <div class="p-field p-col-8">
            <label for="zip">Kullanıcı DN</label>
            <InputText id="zip" type="text" />
        </div>
         <div class="p-field p-col-8">
            <label for="zip">E-posta</label>
            <InputText id="zip" type="text" />
        </div>
        <div class="p-field p-col-8">
            <label for="zip">Telefon Numarası</label>
            <InputText id="zip" type="text" />
        </div>
        <div class="p-field p-col-8">
            <label for="zip">Kullanıcı Ev Dizini</label>
            <InputText id="zip" type="text" />
        </div>
        <div class="p-field p-col-8">
            <label for="zip">Oluşturma Tarihi</label>
            <InputText id="zip" type="text" />
        </div>
        <div class="p-field p-col-8">
            <label for="zip">Adres</label>
            <Textarea v-model="value" :autoResize="true" rows="5" cols="30" />
        </div>
        <div class="p-col-12 p-md-4">

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
