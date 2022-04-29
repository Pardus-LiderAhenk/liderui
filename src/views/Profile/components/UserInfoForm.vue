<template>
    <div>
        <div class="p-fluid p-formgrid p-grid">
            <div class="p-col-12">
                <h3>{{$t('profile.user_information.user_information')}}</h3>
            </div>
            <div class="p-field p-col-8">
                <label for="userId">{{$t('profile.user_information.user_id')}}</label>
                <InputText id="uid" type="text" v-model="uid" disabled/>
                <small id="uid-help" class="p-error"></small>
            </div>
            <div class="p-field p-col-8">
                <label for="username">{{$t('profile.user_information.user_name')}}</label>
                <InputText id="cn" type="text" v-model="cn"/>
                <small id="cn-help" class="p-error"></small>
            </div>
            <div class="p-field p-col-8">
                <label for="sn">{{$t('profile.user_information.user_surname')}}</label>
                <InputText id="sn" type="text" v-model="sn"/>
                <small id="sn-help" class="p-error"></small>
            </div>
            <div class="p-field p-col-8">
                <label for="distinguishedName">{{$t('profile.user_information.user_DN')}}</label>
                <InputText id="distinguishedName" type="text" v-model="distinguishedName" disabled/>
                <small id="distinguishedName-help" class="p-error"></small>
            </div>
            <div class="p-field p-col-8">
                <label for="mail">{{$t('profile.user_information.e_mail')}}</label>
                <InputText id="mail" type="text" v-model="mail"/>
                <small id="mail-help" class="p-error"></small>
            </div>
            <div class="p-field p-col-8">
                <label for="telephoneNumber">{{$t('profile.user_information.phone_number')}}</label>
                <InputMask mask="(999) 999-9999" v-model="telephoneNumber" 
                    placeholder="(999) 999-9999" />
                <small id="telephoneNumber-help" class="p-error"></small>
            </div>
            <div class="p-field p-col-8">
                <label for="homeDirectory">{{$t('profile.user_information.user_home_directory')}}</label>
                <InputText id="homeDirectory" type="text" v-model="homeDirectory" disabled/>
                <small id="homeDirectory-help" class="p-error"></small>
            </div>
            <div class="p-field p-col-8">
                <label for="createDateStr">{{$t('profile.user_information.create_date')}}</label>
                <InputText id="createDateStr" type="text" v-model="createDateStr" disabled/>
                <small id="createDateStr-help" class="p-error"></small>
            </div>
            <div class="p-field p-col-8">
                <label for="homePostalAddress">{{$t('profile.user_information.address')}}</label>
                <Textarea v-model="homePostalAddress" :autoResize="true" rows="5" cols="30" />
                <small id="homePostalAddress-help" class="p-error"></small>
            </div>
        </div>
        <div class="p-d-flex p-jc-end p-col-8">
            <Button type="button" 
                :label="$t('profile.user_information.update_informations')"
                icon="pi pi-refresh"
                class="p-button-sm"
                @click="updateProfile()"
            />
        </div>
    </div>
</template>


<script>
import axios from "axios";

export default {
    props:['user'],
    data() {
        return {
            uid:null,
            cn:null,
            sn:null,
            distinguishedName:null,
            mail:null,
            homeDirectory:null,
            createDateStr:null,
            homePostalAddress:null,
        }
    },
    methods: {
        updateProfile() {
            console.log('UPDATE PROFILE DATA', this.cn);
            axios.post("/liderConsole/updateProfile", {
                distinguishedName: this.distinguishedName,
                uid: this.uid,
                cn: this.cn,
                sn: this.sn,
                mail: this.mail,
                telephoneNumber: this.telephoneNumber,
                homePostalAddress: this.homePostalAddress
            }).then((response) => {
                // this.uid = response.data.uid;
                // this.cn = response.data.cn;
                // this.sn = response.data.sn;
                // this.distinguishedName = response.data.distinguishedName;
                // this.mail = response.data.attributes.mail;
                // this.homeDirectory = response.data.attributes.homeDirectory;
                // this.createDateStr = response.data.createDateStr;
                // this.homePostalAddress = response.data.homePostalAddress;
                this.$toast.add({
                    severity:'success', 
                    detail: this.$t('profile.user_information.information_has_been_successfully_updated'), 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
            });
        },
    },
    watch:  {
        user: function(newVal, oldVal) {
            this.uid = newVal.uid;
            this.cn = newVal.cn;
            this.sn = newVal.sn;
            this.distinguishedName = newVal.distinguishedName;
            this.mail = newVal.attributes.mail;
            this.homeDirectory = newVal.attributes.homeDirectory;
            this.createDateStr = newVal.createDateStr;
            this.homePostalAddress = newVal.homePostalAddress;
        }
    },
}

</script>
