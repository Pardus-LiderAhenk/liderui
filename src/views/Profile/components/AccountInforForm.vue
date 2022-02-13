<template>
    <div class="p-fluid p-formgrid p-grid">
        <div class="p-col-8">
            <h3>Parola Durumunuz</h3>
        </div>
        <div class="p-field p-col-8">
            <label for="updateDate">Son Değişiklik Tarihi</label>
            <InputText id="pwdChangeTime" type="text" v-model="pwdChangeTime"/>
            <small id="pwdChangeTime-help" class="p-error"></small>
        </div>
        <div class="p-col-12">
            <h3>Parola Değiştir</h3>
        </div>
        <div class="p-field p-col-8">
            <label for="city">Eski Parola</label>
            <Password  toggleMask v-model="oldPassword"/>
        </div>
        <div class="p-field p-col-8">
            <label for="city">Yeni Parola</label>
            <Password  toggleMask v-model="newPassword"/>
        </div>
        <div class="p-field p-col-8">
            <label for="city">Yeni Parola Onayla</label>
            <Password  toggleMask v-model="newPasswordAgain"/>
        </div>
        <div class="p-col-12">
            <span>Şifre en az 6 karakter olmalıdır. En az bir büyük harf, küçük harf ve sayı içermelidir.</span>
        </div>
        <div class="p-col-12 p-md-4">

       </div>
         <div class="p-field-checkbox p-col-12 p-md-4">
             <Button type="button" label="Bilgileri Güncelle" @click="updatePassword"/>
         </div>
        
    </div>
</template>


<script>
import axios from "axios";

export default {
    props:['user'],
    watch:  {
        user: function(newVal, oldVal) {
            this.pwdChangeTime = this.getFormattedDate(newVal.attributes.pwdChangedTime)
        }
    },
    data() {
        return {
            pwdChangeTime: null,
            oldPassword:null,
            newPassword:null,
            newPasswordAgain:null,
        }
    },
    methods: {
        getFormattedDate(date) {
            var year = date.slice(0,4);
            var month = date.slice(4,6);
            var day = date.slice(6,8);
            return day + "/" + month + "/" + year; 
        },
        updatePassword() {


            if (this.oldPassword == "" || this.oldPassword == null) {
                this.$toast.add({
                    severity:'warn', 
                    detail: "Lütfen eski parolayı giriniz.", 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
                return;
            }
            if (this.oldPassword != this.user.userPassword) {
                this.$toast.add({
                    severity:'warn', 
                    detail: "Eski parola yanlış girilmiştir.", 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
                return;
            }

            let lowerCase = "abcdefghijklmnopqrstuvwxyz";
            let upperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            let digits = "0123456789";
            let splChars = "+=.@*!_";


            let ucaseFlag = this.contains(this.newPassword, upperCase);
            let lcaseFlag = this.contains(this.newPassword, lowerCase);
            let digitsFlag = this.contains(this.newPassword, digits);
            let splCharsFlag = this.contains(this.newPassword, "*");


            if (splCharsFlag) {
                this.$toast.add({
                    severity:'warn', 
                    detail: "Parola * içermemelidir.", 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
                return;
            }

            if(this.newPassword != this.newPasswordAgain){
                this.$toast.add({
                    severity:'warn', 
                    detail: "Parolalar uyuşmamaktadır.", 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
                return;
            }

            if (this.newPassword == this.oldPassword) {
                this.$toast.add({
                    severity:'warn', 
                    detail: "Yeni parola eski parola ile aynı olamaz.", 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
                return;
            }

            if(this.newPassword.length < 6 || !ucaseFlag || !lcaseFlag || !digitsFlag){
                this.$toast.add({
                    severity:'warn', 
                    detail: "Parola en az 6 karakter olmalıdır. En az bir büyük harf, küçük harf ve sayı içermelidir.", 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
                return;
            }



            axios.post("/liderConsole/updatePassword", {
                distinguishedName: this.user.distinguishedName,
                userPassword: this.newPassword
            }).then((response) => {
                this.oldPassword = null;
                this.newPassword = null;
                this.newPasswordAgain = null;
                // FIXME Burada logout edilecek. ?

                this.$toast.add({
                    severity:'success', 
                    detail: "Parola başarı ile güncellenmiştir.", 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
            });
        },
        contains(rootPassword, allowedChars) {
            for (let i = 0; i < rootPassword.length; i++) {
                var char = rootPassword.charAt(i);
                if (allowedChars.indexOf(char) >= 0){
                    return true;
                }
            }
            return false;
        }
    }
}

</script>
