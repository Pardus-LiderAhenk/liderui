<template>
    <div>
        <div class="p-field">
            <h4>Menü Erişim Ayarları</h4>
        </div>
        <DataTable :value="records" responsiveLayout="scroll"
            v-model:filters="filters"
            v-model:selection="selectedUser"
            selectionMode="single"
            class="p-datatable-sm"
        >
        <template #header>
            <div class="p-d-flex p-jc-between">
                <h5>{{$t('settings.console_user_settings.existing_console_users')}}</h5>
                <Button :label="$t('settings.console_user_settings.add_console_user')"  
                    class="p-button-sm" icon="pi pi-user-plus"
                    @click="addConsoleUserModalVisible = true"
                />
            </div>
        </template>
            <Column header="#">
                    <template #body="slotProps">
                    <p>{{slotProps.index + 1}}</p>
                </template>
            </Column>
            <Column field="uid" header="UID"></Column>
            <Column field="distinguishedName" :header="$t('settings.console_user_settings.registiration_dn')"></Column>
            <Column>
                <template #body="slotProps">
                    <div class="p-d-flex p-jc-end">
                        <Button class="p-button-sm p-button-rounded p-mr-2" 
                            icon="pi pi-unlock"
                            v-tooltip.bottom="$t('settings.console_user_settings.change_password')"
                            @click.prevent="selectedUser = slotProps.data; changePasswordDialog = true"/>

                        <Button class="p-button-danger p-button-sm p-button-rounded" 
                            icon="pi pi-trash"
                            v-tooltip.bottom="$t('settings.console_user_settings.delete')"
                            @click.prevent="selectedUser = slotProps.data; showDeleteConsoleUserDialog = true"/>
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>
</template>


<script>
import { consoleUserSettingsService } from "../../../services/Settings/ConsoleUserSettingsService.js";
export default {

    data() {
        return {
            selectedUser: null,
            records: [],
            addConsoleUserModalVisible: false,
            roles: [],
        }
    },

    methods: {
        async getConsoleUsers(){
            const { response, error } = await consoleUserSettingsService.getConsoleUsers();
            if (error){
                this.$toast.add({
                    severity:'error', 
                    detail: this.$t('settings.console_user_settings.an_unexpected_problem_was_encountered'),
                    summary: this.$t('settings.console_user_settings.error'),
                    life: 3000
                });
            }
            else{
                if(response.status == 200){
                    this.records = response.data;
                }
                else if(response.status == 417){
                    this.$toast.add({
                        severity:'error', 
                        detail: this.$t('settings.console_user_settings.error_417_get_console_user'),
                        summary: this.$t('settings.console_user_settings.error'),
                        life: 3000
                    });
                }
            }               
        },

        async getRoles(){
            const {response,error} = await consoleUserSettingsService.getRoles();
            if(error){
                this.$toast.add({
                    severity:'error', 
                    detail: this.$t('settings.console_user_settings.an_unexpected_problem_was_encountered'),
                    summary: this.$t('settings.console_user_settings.user_not_select'),
                    life: 3000
                });
            }
            else{
                if(response.status == 200){
                    this.roles = response.data;
                    this.$toast.add({
                        severity:'success', 
                        detail: this.$t('settings.console_user_settings.user_roles_get_successfully'),
                        summary: this.$t('settings.console_user_settings.successful'),
                        life: 3000
                    });
                }
                else if(response.status == 417){
                    this.$toast.add({
                        severity:'error', 
                        detail: this.$t('settings.console_user_settings.error_417_get_user_roles'),
                        summary: this.$t('settings.console_user_settings.user_not_select'),
                        life: 3000
                    });
                }
            }
        },
    },

    mounted() {
        this.getConsoleUsers();
    },
    
}
</script>