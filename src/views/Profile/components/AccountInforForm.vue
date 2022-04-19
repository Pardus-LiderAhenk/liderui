<template>
    <div>
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
                <password-component ref="password"></password-component>
            </div>
        </div>
        <div class="p-d-flex p-jc-end p-col-8">
            <Button type="button" label="Parola Değiştir"
                icon="pi pi-unlock"
                class="p-button-sm"
                @click="updatePassword"
            />
        </div>
    </div>
</template>


<script>
import axios from "axios";
import PasswordComponent from '@/components/Password/PasswordComponent.vue';

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

    components: {
        PasswordComponent
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
            this.newPassword = this.$refs.password.getPassword();
            if (!this.newPassword) {
                this.$toast.add({
                    severity:'warn', 
                    detail: "Lütfen yeni parola giriniz", 
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
