<template>
    <div class="p-fluid p-formgrid p-grid">
        <div class="p-col-12">
            <h3>Parola Sıfırla</h3>
        </div>
        <div class="p-field p-col-12">
            <label for="city">Yeni Parola</label>
            <Password  toggleMask/>
        </div>
        <div class="p-field p-col-12">
            <label for="city">Yeni Parola Onayla</label>
            <Password  toggleMask/>
        </div>
        <div class="p-col-12">
            <span>Şifre en az 6 karakter olmalıdır. En az bir büyük harf, küçük harf ve sayı içermelidir.</span>
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