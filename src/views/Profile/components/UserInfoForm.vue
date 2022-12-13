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
                @click="showDialog = true"
            />
        </div>
        <Dialog :header="$t('computer.task.toast_summary')" v-model:visible="showDialog" 
            :style="{width: '20vw'}" :modal="true">
            <div class="p-fluid">
                <i class="pi pi-info-circle p-mr-3" style="font-size: 1.5rem" />
                <span>
                    {{$t('profile.user_information.change_user_info_confirm_message')}}
                </span>
            </div>
            <template #footer>
                <Button :label="$t('profile.cancel')" icon="pi pi-times" 
                    @click="showDialog = false" class="p-button-text p-button-sm"
                />
                <Button :label="$t('profile.yes')" icon="pi pi-check"
                    @click="updateProfile" class="p-button-sm"
                />
            </template>
        </Dialog>
    </div>
</template>

<script>
import { profileService } from "../../../services/Profile/ProfileService.js";

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
            telephoneNumber:null,
            homePostalAddress:null,
            showDialog: false
        }
    },
    methods: {
        async updateProfile() {
            const{response,error} = await profileService.updateProfile({
                distinguishedName: this.distinguishedName,
                uid: this.uid,
                cn: this.cn,
                sn: this.sn,
                mail: this.mail,
                telephoneNumber: this.telephoneNumber,
                homePostalAddress: this.homePostalAddress
            });
            if(error){
                this.$toast.add({
                    severity:'error', 
                    detail: this.$t('profile.user_information.error_profile_update'), 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });

            }
            else{
                if(response.status == 200){
                    this.$toast.add({
                        severity:'success', 
                        detail: this.$t('profile.user_information.information_has_been_successfully_updated'), 
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000
                    });
                this.showDialog = false;
                }
                else if(response.status == 417){                    
                    this.$toast.add({
                        severity:'error', 
                        detail: this.$t('profile.user_information.error_417_profile_update'), 
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000
                    });
                }
            }
            //}).then((response) => {
                // this.uid = response.data.uid;
                // this.cn = response.data.cn;
                // this.sn = response.data.sn;
                // this.distinguishedName = response.data.distinguishedName;
                // this.mail = response.data.attributes.mail;
                // this.homeDirectory = response.data.attributes.homeDirectory;
                // this.createDateStr = response.data.createDateStr;
                // this.homePostalAddress = response.data.homePostalAddress;
                
            //});
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
            this.telephoneNumber = newVal.telephoneNumber;
            this.homePostalAddress = newVal.homePostalAddress;
        }
    },
}

</script>
