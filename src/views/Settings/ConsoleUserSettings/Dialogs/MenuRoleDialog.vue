<template>
    <div>
        <Dialog :header="$t('settings.console_user_settings.role_users')"
            v-model:visible="showDialog" :modal="true" 
            :breakpoints="{ '960px': '75vw', '640px': '100vw' }"
            :style="{ width: '50vw' }"
        >
            <div class="p-field" v-if="selectedUser">
                <div class="p-col-12 ">
                    <p style="font-weight:bold">{{$t('settings.console_user_settings.selected_users_roles')}} 
                        {{selectedUser ? selectedUser.distinguishedName: $t('settings.console_user_settings.please_select')}})
                    </p>
                </div>
                <DataTable :value="roles" responsiveLayout="scroll" class="p-datatable-sm"
                    rowGroupMode="subheader" groupRowsBy="roleType.code" 
                    expandableRowGroups="true" v-model:expandedRowGroups="expandedRowGroups"
                >
                    <Column header="#">
                        <template #body="slotProps">
                            <p>{{slotProps.index + 1}}</p>
                        </template>
                    </Column>
                    <Column field="name" :header="$t('settings.console_user_settings.role_name')"
                        style=""
                    >
                    </Column>
                    <Column :exportable="false">
                        <template #body="slotProps">
                            <div class="p-d-flex p-jc-end">
                                <InputSwitch 
                                    :modelValue="selectedUser ? (selectedUser.attributesMultiValues.liderPrivilege.includes(slotProps.data.value) ? true : false) : false"  
                                    @change="roleSwitchChanged(slotProps.data)"
                                />
                            </div>
                        </template>
                    </Column>
                    <template #groupheader="slotProps">
                        <i class="pi pi-check-circle"></i>&nbsp;
                        <span >{{slotProps.data.roleType.name}}</span>
                    </template>
                </DataTable>
            </div>
            <template #footer>
                <Button :label="$t('settings.console_user_settings.close')" 
                    icon="pi pi-times" @click="showDialog = false" class="p-button-sm p-button-text"
                />
                <Button :label="$t('settings.console_user_settings.save')" class="p-button-sm" icon="pi pi-save"
                    @click="showUpdateConsoleUserRolesDialog=true"
                />
            </template>
        </Dialog>

        <LiderConfirmDialog 
            :showDialog="showUpdateConsoleUserRolesDialog"
            @showDialog="showUpdateConsoleUserRolesDialog = $event;"
            :header="$t('settings.console_user_settings.authority_update')"
            :message="$t('settings.console_user_settings.authority_update_question')"
            @accepted="updateUserRoles"
        />
    </div>
</template>

<script>
import { consoleUserSettingsService } from "../../../../services/Settings/ConsoleUserSettingsService.js";

export default {
    props: {
        menuRoleDialog: {
            type: Boolean
        },
        roles: {
            type: Object
        },
        selectedUser: {
            type: Object
        }
    },


    data() {
        return {
            expandedRowGroups: null,
            user: null,
            showUpdateConsoleUserRolesDialog: false
        }
    },

    computed:{
        showDialog:{
            get() {
                return this.menuRoleDialog;
            },
            set(){
                this.$emit('closeMenuRoleDialog', false);
            }
        }
    },

    methods: {
        roleSwitchChanged(data) {
            if (this.selectedUser) {
                if (this.selectedUser.attributesMultiValues.liderPrivilege.includes(data.value)) {
                    this.user.attributesMultiValues.liderPrivilege = this.selectedUser.attributesMultiValues.liderPrivilege.filter(val => val != data.value);
                } else {
                    this.user.attributesMultiValues.liderPrivilege.push(data.value);
                }
            }
        },

        async updateUserRoles() {
            this.showUpdateConsoleUserRolesDialog = false;
            if(this.user) {
                var data = new FormData();
                data.append('dn', this.user.distinguishedName);
                data.append('roles[]', this.user.attributesMultiValues.liderPrivilege);
                

                const { response,error } = await consoleUserSettingsService.editUserRoles(data);
                if(error) {
                    this.$toast.add({
                        severity:'error', 
                        detail: this.$t('settings.console_user_settings.please_select_the_user_you_want_to_be_authorized'),
                        summary: this.$t('settings.console_user_settings.error'),
                        life: 3000
                    });
                }
                else {
                    if(response.status == 200){
                        this.$toast.add({
                            severity:'success', 
                            detail: this.$t('settings.console_user_settings.users_role_successfully_update'), 
                            summary: this.$t('settings.console_user_settings.successful'), 
                            life: 3000
                        });
                        this.$emit('updatedUserRole', true);
                    } else if(response.status == 417){
                        this.$toast.add({
                            severity:'error', 
                            detail: this.$t('settings.console_user_settings.error_417_edit_user_roles'),
                            summary: this.$t('settings.console_user_settings.error'),
                            life: 3000
                        });
                    }                      
                }
                

            }
        },
    },

    mounted() {
        this.user = {...this.selectedUser};
    },
}
</script>

<style lang="scss" scoped>
.p-rowgroup-footer td {
    font-weight: 700;
}

::v-deep(.p-rowgroup-header) {
    span {
        font-weight: 700;
    }

    .p-row-toggler {
        vertical-align: middle;
        margin-right: .25rem;
    }
}
::v-deep(.p-datatable .p-column-header-content) {
  pointer-events: none;
}

</style>