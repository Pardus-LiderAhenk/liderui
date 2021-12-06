<template>
    <div class="p-fluid p-formgrid p-grid">
        <div class="p-col-12">
            <h3>LDAP Sunucusu Bilgileri</h3>
        </div>
        <div class="p-field p-col-12 p-md-4">
            <label for="firstname6">LDAP Sunucu Adresi</label>
            <InputText id="firstname6" type="text" />
        </div>
        <div class="p-field p-col-12 p-md-2">
            <label for="lastname6">Port</label>
            <InputText id="lastname6" type="text" />
        </div>
        <div class="p-field p-col-12 p-md-6">
            <label for="city">Domain Adı</label>
            <InputText id="city" type="text" />
        </div>
        <div class="p-field p-col-12 p-md-6">
            <label for="zip">LDAP Kullanıcı DN</label>
            <InputText id="zip" type="text" />
        </div>
         <div class="p-field p-col-12 p-md-6">
            <label for="zip">LDAP Kullanıcı Şifresi</label>
            <InputText id="zip" type="text" />
        </div>
         <div class="p-field p-col-12 p-md-6">
            <label for="zip">Ahenk Klasörü</label>
            <InputText id="zip" type="text" />
        </div>
         <div class="p-field p-col-12 p-md-6">
            <label for="zip">Kullanıcı Klasörü</label>
            <InputText id="zip" type="text" />
        </div>
         <div class="p-field p-col-12 p-md-6">
            <label for="zip">Grup Klasörü</label>
            <InputText id="zip" type="text" />
        </div>
         <div class="p-field p-col-12 p-md-6">
            <label for="zip">İstemci Grubu Klasörü</label>
            <InputText id="zip" type="text" />
        </div>
         <div class="p-field p-col-12 p-md-6">
            <label for="zip">Kullanıcı Grubu Klasörü</label>
            <InputText id="zip" type="text" />
        </div>
         <div class="p-field p-col-12 p-md-6">
            <label for="zip">Yetki Grubu Klasörü(Sudo)</label>
            <InputText id="zip" type="text" />
        </div>
        <div class="p-field-checkbox p-col-12 p-md-6">
            <Checkbox id="city1" name="city" value="Chicago" />
            <label for="city1">Aktif Dizin ayarları (Hibrit yapılı kurulumlar için bu ayarlar yapılmalıdır)</label>
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
