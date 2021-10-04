<template>
    <div class="p-fluid p-formgrid p-grid">
       <div class="p-col-7">
           <div class="p-col-12">
                <h3>Diğer Ayarlar</h3>
            </div>
            <div class="p-field-checkbox p-col-12 p-md-12">
                <InputSwitch  />
                <label>Bilgisayarlar domaine alındığında yerel kullanıcıları pasif hale getir</label>
            </div>
            <div class="p-col-12">
                <h4>İstemcilerin hangi etki alanına alınacağını seçiniz</h4>
            </div>
            <div class="p-col-12">
                <div class="p-field-radiobutton">
                    <RadioButton id="city1" name="city" value="Chicago" />
                    <label for="city1">LDAP</label>
                </div>
                <div class="p-field-radiobutton">
                    <RadioButton id="city2" name="city" value="Los Angeles"  />
                    <label for="city2">Aktif Dizin veya Samba</label>
                </div>
                <div class="p-field-radiobutton">
                    <RadioButton id="city3" name="city" value="New York"  />
                    <label for="city3">Hiçbiri (Bu seçenek seçildiğinde istemci etki alanına dahil edilmeyecektir. İstemciye yerel kullanıcı ile giriş yapılabilir)</label>
                </div>
            </div>
            <div class="p-col-12">
                <h4>Ahenk Depo Ayarları</h4>
            </div>
            <div class="p-field p-col-12">
                <label for="lastname6">Depo Adresi</label>
                <InputText id="lastname6" type="text" />
            </div>
            <div class="p-field p-col-12">
                <label for="lastname6">Depo Anahtar Adresi</label>
                <InputText id="lastname6" type="text" />
            </div>
            <div class="p-field-checkbox p-col-12 p-md-6">
             <Button type="button" label="Değişiklikleri Kaydet" />
            </div>
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
