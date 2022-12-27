<template>
    <div>
        <!-- Give console access Dialog -->
        <Dialog :header="$t('user_management.ad.give_console_access')" v-model:visible="showDialog" 
            :style="{width: '30vw'}" :modal="true">
            <div class="p-fluid">
                <div class="p-field p-grid">
                    <label class="p-col-3" >
                        <i class="pi pi-user"></i>&nbsp;{{ $t('user_management.username') }}&nbsp;:
                    </label>
                    <div class="p-col-9">
                        {{ selectedNode.name }}
                    </div>
                </div>
                <div class="p-field">
                    <password-component ref="password" 
                        :isSmallInput="true">
                    </password-component>
                </div>
                <div>
                    <InlineMessage severity="info">
                        Dizin yapısında bulunan kullanıcıların Lider Arayüzü(Konsol erişimi) kullanması için Lider'e aktarılması gerekmektedir.
                        Etki alanı parola erişimi kısıtından dolayı aktarılacak kullanıcının Lider Arayüz(Konsol erişimi) giriş parolası etki alanı parolasından bağımsız tanımlanmalıdır.
                        Aktarılacak kullanıcının sayfa erişimlerini Ayarlar Menüsünden tanımlayabilirsiniz.
                    </InlineMessage>
                </div>
            </div>
            <template #footer>
                <Button :label="$t('user_management.cancel')" icon="pi pi-times" 
                    @click="showDialog = false" class="p-button-text p-button-sm"
                />
                <Button :label="$t('user_management.ad.give_console_access')" icon="pi pi-check"
                    @click="giveConsoleAccessToUser" class="p-button-sm"
                />
            </template>
        </Dialog>
     <!-- Give console access End-->
    </div>
</template>

<script>
/**
 * Give console access to selected user
 * @see {@link http://www.liderahenk.org/}
 */
import PasswordComponent from '@/components/Password/PasswordComponent.vue';
import { adManagementService } from "../../../../services/UserManagement/AD/AdManagement";

export default {

    props: {
        selectedNode: {
            type: Object,
            description: "Selected tree node",
        },

        giveConsoleAccessDialog: {
            type: Boolean,
            default: false,
            description: "Selected tree node",
        },
    },

    components: {
        PasswordComponent,
    },

    computed: {
        showDialog: {
            get () {
                return this.giveConsoleAccessDialog;
            },

            set (value) {
                if (!value) {
                    this.$emit('closeAdDialog');
                }
            }
        }
    },

    methods: {
        async giveConsoleAccessToUser() {
            if (!this.$refs.password.getPassword()) {
                return;
            }
            let userPassword = this.$refs.password.getPassword();
            let childEntries = [];
            childEntries.push({
                "distinguishedName" : this.selectedNode.distinguishedName
            });

            const { response,error } = await adManagementService.moveAdUserToLdap({
                distinguishedName: this.selectedNode.distinguishedName,
                userPassword: userPassword,
                childEntries: childEntries
               
            });
            this.$emit('closeAdDialog');

            if (error){
                this.$toast.add({
                    severity:'error', 
                    detail: this.$t('user_management.ad.give_console_access_error')+ " \n"+error, 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });

            }
            else{
                if(response.status == 200){                    
                        this.$emit('closeAdDialog');
                    if (response.data.length > 0) {
                        this.$toast.add({
                            severity:'success', 
                            detail: this.$t('user_management.ad.user_already_exist_in_lider'), 
                            summary:this.$t("computer.task.toast_summary"), 
                            life: 3000
                        });
                    } else {
                        this.$toast.add({
                            severity:'success', 
                            detail: this.$t('user_management.ad.give_console_access_success'), 
                            summary:this.$t("computer.task.toast_summary"), 
                            life: 3000
                        });
                    }
                }
                else if(response.status == 417){
                    this.$toast.add({
                        severity:'error', 
                        detail: this.$t('user_management.ad.error_417_give_console_access'), 
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000
                    });
                }           
            }
        }
   
    },
}
</script>

<style lang="scss" scoped>

</style>