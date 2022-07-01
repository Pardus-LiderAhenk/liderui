<template>
    <div class="p-fluid p-formgrid p-grid">
        <div class="p-col-12">
            <h3>{{$t('user_management.general_information')}}</h3>
        </div>
        <div class="p-field p-col-12">
            <label for="firstname6">{{$t('user_management.uid')}}</label>
            <InputText class="p-inputtext-sm" v-model="user.sAMAccountName" disabled type="text"/>
        </div>
        <div class="p-field p-col-12">
            <label for="firstname6">{{$t('user_management.username')}}</label>
            <InputText class="p-inputtext-sm" type="text" disabled v-model="user.name"/>
        </div>
        <div class="p-field p-col-12">
            <label for="firstname6">{{$t('user_management.surname')}}</label>
            <InputText class="p-inputtext-sm" type="text" disabled v-model="user.sn"/>
        </div>
        <div class="p-field p-col-12">
            <label for="firstname6">{{$t('user_management.ad.user_principal_name')}}</label>
            <InputText class="p-inputtext-sm" type="text" disabled v-model="user.userPrincipalName"/>
        </div>
        <div class="p-field p-col-12">
            <label for="firstname6">{{$t('user_management.dn')}}</label>
            <InputText class="p-inputtext-sm" type="text" disabled v-model="user.distinguishedName"/>
        </div>
        <div class="p-field p-col-12">
            <label for="firstname6">{{$t('user_management.mail_address')}}</label>
            <span class="p-input-icon-right">
                <i class="pi pi-envelope" />
                <InputText class="p-inputtext-sm" type="text" disabled v-model="user.mail"/>
            </span>
        </div>
        <div class="p-field p-col-12">
            <label for="firstname6">{{$t('user_management.telephone_number')}}</label>
            <span class="p-input-icon-right">
                <i class="pi pi-phone"></i>
                <InputMask class="p-inputtext-sm" mask="(999) 999-9999" 
                    v-model="user.telephoneNumber" disabled placeholder="(999) 999-9999"/>
            </span>
        </div>
        <div class="p-field p-col-12">
            <label for="firstname6">{{$t('user_management.address')}}</label>
            <Textarea :autoResize="true" rows="5" cols="30" disabled v-model="user.streetAddress"/>
        </div>
    </div>

</template>

<script>
/**
 * AD User information component
 * @see {@link http://www.liderahenk.org/}
 */

export default {
    props: {
        selectedUser: {
            type: Object,
            description: "Selected tree node",
        },
    },

    data() {
        return {
            user: {
                name: "",
                sn: "",
                mail: "",
                distinguishedName: "",
                userPrincipalName: "",
                telephoneNumber: "",
                streetAddress: "",
                sAMAccountName: ""
            },
        }
    },

   mounted() {
        if (this.selectedUser) {
           this.setUserInformation();
        }
    },

    methods: {
        setUserInformation(){
            this.user.sAMAccountName = this.selectedUser.attributes.sAMAccountName;
            this.user.name = this.selectedUser.name;
            this.user.sn = this.selectedUser.sn;
            this.user.mail = this.selectedUser.attributes.mail;
            this.user.userPrincipalName = this.selectedUser.attributes.userPrincipalName;
            this.user.telephoneNumber = this.selectedUser.telephoneNumber;
            this.user.streetAddress = this.selectedUser.attributes.streetAddress;
            this.user.distinguishedName = this.selectedUser.distinguishedName;
        }
    },
    
    watch : {
        selectedUser() {
            this.setUserInformation();
        },
    }
}
</script>

<style lang="scss" scoped>

</style>