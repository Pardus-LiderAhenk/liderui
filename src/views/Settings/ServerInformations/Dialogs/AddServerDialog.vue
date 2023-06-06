<template>
    <Dialog :header="$t('Sunucu ekle')" v-model:visible="modalVisible" style="width:85vw;" position="top">            
                <div class="p-grid">
                    <div class="p-col-6">
                        <div class="p-fluid p-formgrid p-grid">
                            <div class="p-field p-col-12">
                                <label for="id">{{$t('id')}}*</label>
                                <InputText id="uid" type="text" v-model="userForm.uid"/>
                            </div>
                            <div class="p-field p-col-12">
                                <label for="hostname">{{$t('Hostname')}}*</label>
                                <InputText id="sn" type="text" v-model="userForm.sn"/>
                            </div>
                            <div class="p-field p-col-12">
                                <label for="ip">{{$t('Ip')}}*</label>
                                <InputText id="mail" type="text" v-model="userForm.mail"/>
                            </div>
                            <div class="p-field p-col-12">
                                <label for="user">{{$t('Kullanıcı')}}*</label>
                                <InputText id="telephoneNumber" type="text" v-model="userForm.telephoneNumber"/>
                            </div>
                        </div>
                    </div>
                    <div class="p-col-6">
                        <password-component ref="password"></password-component>
                    </div>
                    <div class="p-col-12 p-d-flex p-jc-end">
                        <Button icon="pi pi-save" :label="$t('Kaydet')" @click="addNewConsoleUser"></Button>
                    </div>
                </div>
        <template #footer>

            <Button :label="$t('settings.console_user_settings.close')" icon="pi pi-times" @click="modalVisible = false" class="p-button-text"/>
            
        </template>
    </Dialog>

</template>
<script>

import PasswordComponent from '@/components/Password/PasswordComponent.vue';


export default {
    components:{
        PasswordComponent
    },
    props: ['modalVisibleValue'],
    emits:['updateConsoleUsers'],
    data(){
        return {
            selectedUserNode:null,
            searchFields: [
                {
                    key: this.$t('tree.cn'),
                    value: "cn"
                },
                {
                    key: this.$t('tree.uid'),
                    value: "uid"
                },
                {
                    key: this.$t('tree.folder'),
                    value: "ou"
                },
                {
                    key: this.$t('tree.last_session'),
                    value: "o"
                }
            ],
            userForm: {
                uid:'',
                cn:'',
                sn:'',
                telephoneNumber:'',
                homePostalAddress:'',
                mail:'',
                userPassword: '',
                userPasswordConfirm:null,
            },
            searchFieldsFolder: [
                {
                    key: this.$t('tree.name'),
                    value: "cn"
                },
                {
                    key: this.$t('tree.folder'),
                    value: "ou"
                },
            ],
            groupMembers: [],
            selectedGroupNode: null,
            groupPrivilages: [],
        }
    },
    computed: {
        modalVisible: {
            get() {
                return this.modalVisibleValue;
            },
            set() {
                this.$emit('modalVisibleValue', false);
            }
        },
    }
}

</script>