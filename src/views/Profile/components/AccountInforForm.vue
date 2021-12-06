<template>
    <div class="p-fluid p-formgrid p-grid">
        <div class="p-col-8">
            <h3>Parola Durumunuz</h3>
        </div>
        <div class="p-field p-col-8">
            <label for="firstname6">Son Değişiklik Tarihi</label>
            <InputText id="firstname6" type="text" />
        </div>
        <div class="p-col-12">
            <h3>Parola Değiştir</h3>
        </div>
        <div class="p-field p-col-8">
            <label for="city">Eski Parola</label>
            <Password  toggleMask/>
        </div>
        <div class="p-field p-col-8">
            <label for="city">Yeni Parola</label>
            <Password  toggleMask/>
        </div>
        <div class="p-field p-col-8">
            <label for="city">Yeni Parola Onayla</label>
            <Password  toggleMask/>
        </div>
        <div class="p-col-12">
            <span>Şifre en az 6 karakter olmalıdır. En az bir büyük harf, küçük harf ve sayı içermelidir.</span>
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
