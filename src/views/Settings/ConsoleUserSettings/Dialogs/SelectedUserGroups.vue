<template>
    <div>
        <Dialog :header="$t('settings.console_user_settings.users_groups')"
            v-model:visible="showDialog" :modal="true" 
            :breakpoints="{ '960px': '75vw', '640px': '100vw' }"
            :style="{ width: '50vw' }"
        >

            <DataTable :value="groups" class="p-datatable-sm" v-model:filters="filters">
                <template #header>
                    <div class="p-d-flex p-jc-end">
                        <span class="p-input-icon-left">
                            <i class="pi pi-search"/>
                            <InputText v-model="filters['global'].value" 
                            class="p-inputtext-sm" 
                            :placeholder="$t('user_management.search')" 
                            />
                        </span>
                    </div>
                </template>
                <template #empty>
                    <div class="p-d-flex p-jc-center">
                        <span>{{$t('user_management.table_empty_message')}}</span>
                    </div>
                </template>
                <Column header="#">
                    <template #body="slotProps">
                        <p>{{slotProps.index + 1}}</p>
                    </template>
                </Column>
                <Column field="distinguishedName" :header="$t('settings.console_user_settings.registiration_dn')"></Column>
            </DataTable>

            <template #footer>
                <Button :label="$t('settings.console_user_settings.close')" 
                    icon="pi pi-times" @click="showDialog = false" class="p-button-sm p-button-text"
                />
            </template>
        </Dialog>
    </div>
</template>

<script>
import {FilterMatchMode} from 'primevue/api';

export default {
    emits: ["closeUserGroupDialog"],
    props: {
        userGroupDialog: {
            type: Boolean
        },
        selectedUser: {
            type: Object
        }
    },

    data() {
        return {
            filters: {
                'global': {value: null, matchMode: FilterMatchMode.CONTAINS}
            },
            groups: []
        }
    },

    computed: {
        showDialog: {
            get() {
                return this.userGroupDialog;
            },
            set() {
                this.$emit('closeUserGroupDialog', false);
            }
        },
    },

    methods: {

        async getGroupsOfSelectedUser() {
            if (this.selectedUser.type == "USER" && this.selectedUser.attributesMultiValues.memberOf) {
                this.selectedUser.attributesMultiValues.memberOf.map(memberOf => {
                    this.groups.push({
                        'distinguishedName' : memberOf
                    })
                });
            }
        },
        
    },

    mounted() {
        this.getGroupsOfSelectedUser();
    },

}
</script>