<template>
    <add-registration-template v-if="addTemplateDialog"
        :addTemplateDialog="addTemplateDialog"
        @close-template-dialog="addTemplateDialog=false;"
        @saved-registration-template="savedTemplate"
    >
    </add-registration-template>
    <update-registration-template v-if="updateTemplateDialog"
        :updateTemplateDialog="updateTemplateDialog"
        :selectedTemplate="selectedRecord"
        @close-template-dialog="updateTemplateDialog=false;"
        @updated-registration-template="savedTemplate"
    >
    </update-registration-template>
    <div class="p-fluid">
        <div class="p-field">
            <Card style="margin-top: 10px">
                <template #title>
                    {{$t('settings.registiration_template.registiration_template')}}
                </template>
                <template #content>
                    {{$t('settings.registiration_template.content')}}
                </template>
            </Card>
        </div>
        <div class="p-field">
            <Card>
                <template #title>
                    <div class="p-d-flex p-jc-between">
                        <div>
                            {{$t('settings.registiration_template.saved_templates_list')}}
                        </div>
                        <div>
                            <Button 
                                class="p-button-sm" 
                                icon="pi pi-plus" 
                                :label="$t('settings.registiration_template.add')"
                                @click="addTemplateDialog = true;">
                            </Button>
                        </div>
                    </div>
                </template>
                <template #content>
                    <div class="p-fluid">
                        <div class="p-field">
                            <DataTable :value="records" responsiveLayout="scroll"
                                v-model:filters="filters"
                                class="p-datatable-sm"
                            >
                                <template #header>
                                    <div class="p-d-flex p-jc-between">
                                         <div>
                                            <Dropdown  v-model="templateType" :options="templateTypes" 
                                                optionLabel="label" optionValue="value" 
                                                @change="getRegistrationTemplate"
                                            />
                                        </div>
                                        <div>
                                            <span class="p-input-icon-left">
                                                <i class="pi pi-search"/>
                                                <InputText v-model="filters['global'].value" 
                                                class="p-inputtext-sm" 
                                                :placeholder="$t('settings.script_definition.search')" 
                                                />
                                            </span>
                                        </div>
                                    </div>
                                </template>
                                <template #empty>
                                    <div class="p-d-flex p-jc-center">
                                        <span>{{$t('settings.registiration_template.table_empty_message')}}</span>
                                    </div>
                                </template>
                                <Column header="#" style="width:5%">
                                    <template #body="{index}">
                                        <span>{{ ((pageNumber - 1)*rowNumber) + index + 1 }}</span>
                                    </template>
                                </Column>
                                <Column field="unitId" :header="$t('settings.registiration_template.template_text')"></Column>
                                <Column field="parentDn" :header="$t('settings.registiration_template.organization_unit_to_include_the_client')"></Column>
                                <Column field="authGroup" :header="$t('settings.registiration_template.authorized_user_group')"></Column>
                                <Column field="createDate" :header="$t('settings.registiration_template.create_date')"></Column>
                                <Column field="templateType" :header="$t('settings.registiration_template.template_type')"></Column>
                                <Column :exportable="false">
                                    <template #body="slotProps">
                                        <div class="p-d-flex p-jc-end">
                                            <Button class="p-mr-2 p-button-sm p-button-rounded p-button-warning" 
                                                icon="pi pi-pencil"  
                                                :title="$t('settings.registiration_template.edit')" 
                                                @click.prevent="editTemplate(slotProps.data)">
                                            </Button>
                                            <Button class="p-button-danger p-button-sm p-button-rounded" 
                                                icon="pi pi-trash"  
                                                :title="$t('settings.registiration_template.delete')" 
                                                @click="showDeleteDialog = true; 
                                                selectedRecord = slotProps.data">
                                            </Button>
                                        </div>
                                    </template>
                                </Column>
                            </DataTable>
                            <Paginator v-if="totalElements > rows"
                                :rows="rows"
                                v-model:first="first"
                                :totalRecords="totalElements"
                                :rowsPerPageOptions="[10, 25, 50, 100]"
                                @page="onPage($event)"
                            >
                                <!-- <template #start=""> {{$t('reports.system_log_report.total_result')}} : {{ totalElements }} </template> -->
                            </Paginator>
                        </div>
                    </div>
                </template>
            </Card>
        </div>
    </div>
    
    <!-- Delete Template Dialog -->
        <Dialog :header="$t('settings.registiration_template.delete_template')" v-model:visible="showDeleteDialog" 
            :style="{width: '20vw'}" :modal="true">
            <div class="p-fluid">
                <i class="pi pi-info-circle p-mr-3" style="font-size: 1.5rem" />
                <span>
                    {{$t('settings.registiration_template.template_delete_question')}}
                </span>
            </div>
            <template #footer>
                <Button :label="$t('settings.registiration_template.cancel')" icon="pi pi-times" 
                    @click="showDeleteDialog = false" class="p-button-text p-button-sm"
                />
                <Button :label="$t('settings.registiration_template.add')" icon="pi pi-check"
                    @click="deleteRecord" class="p-button-sm"
                />
            </template>
        </Dialog>
        <!-- Delete Template Dialog End -->
</template>

<script>
/**
 * Registration template
 * @see {@link http://www.liderahenk.org/}
 * 
*/

import {FilterMatchMode} from 'primevue/api';
import AddRegistrationTemplate from './Dialogs/AddRegistrationTemplate.vue'
import UpdateRegistrationTemplate from './Dialogs/UpdateRegistrationTemplate.vue'
import { registrationTemplateService } from '../../../services/Settings/RegistrationTemplates.js';

export default {
    
    data() {
        return {
            records: [],
            rows: 10,
            selectedRecord: null,
            filters: {
                'global': {value: null, matchMode: FilterMatchMode.STARTS_WITH},
            },
            showDeleteDialog: false,
            totalElements: 0,
            templateType: 'HOSTNAME',
            templateTypes: [
                {label: this.$t('settings.registiration_template.hostname'), value: 'HOSTNAME'},
                {label: this.$t('settings.registiration_template.ip_address'),  value: "IP_ADDRESS"}
            ],
            addTemplateDialog: false,
            updateTemplateDialog: false,
            first: 0,
            pageNumber: 1,
            rowNumber: 10
        }
    },

    components: {
        AddRegistrationTemplate,
        UpdateRegistrationTemplate
    },

    mounted() {
        this.getRegistrationTemplate();
    },

    methods: {
        async getRegistrationTemplate(){

            const {response, error} = await registrationTemplateService.list(this.templateType, this.pageNumber, this.rowNumber);
            if(error){
                this.$toast.add({
                    severity:'error',
                    detail: this.$t('settings.registiration_template.an_error_occurred_while_fetching_registration_templates')+ " \n"+error, 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                 });
            }
            else{
                if(response.status == 200){
                    if (response.data) {
                    this.records = response.data.content;
                    this.totalElements = response.data.totalElements;
                    }
                }
                else if(response.status == 417){
                    this.$toast.add({
                        severity:'error',
                        detail: this.$t('settings.registiration_template.error_417_getting_registration_template'), 
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000
                    });
                }
            }
        },

        savedTemplate(data) {
            this.resetPaginator();
            this.getRegistrationTemplate();
        },

        editTemplate(data) {
            this.selectedRecord = data;
            this.updateTemplateDialog = true;
        },

        resetPaginator() {
            this.pageNumber = 1;
            this.rowNumber = this.rows;
            this.first = 0;
            this.getRegistrationTemplate();
        },

        async deleteRecord() {

            const { response,error } = await registrationTemplateService.delete(this.selectedRecord.id);
            if(error){
                this.$toast.add({
                    severity:'error', 
                    detail: this.$t('settings.registiration_template.an_error_occurred_while_deleting_template')+ " \n"+error, 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
            }else{
                if(response.status == 200){
                    if (response.status == 200) {
                        this.$toast.add({
                            severity:'success', 
                            detail: this.$t('settings.registiration_template.template_successfully_deleted'), 
                            summary:this.$t("computer.task.toast_summary"), 
                            life: 3000
                        });
                        this.records = this.records.filter(template => template.id != this.selectedRecord.id);
                        this.resetPaginator();
                        this.selectedRecord = null;
                        this.showDeleteDialog = false;
                    }
                }
                else if(response.status == 417){
                    this.$toast.add({
                        severity:'error', 
                        detail: this.$t('settings.registiration_template.error_417_delete_template'), 
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000
                    });
                }
            }
        },

        onPage(event) {
            this.pageNumber = event.page + 1;
            this.rowNumber = event.rows;
            this.getRegistrationTemplate();
        },
    },
}
</script>

<style lang="scss" scoped>
::v-deep(.p-paginator) {
    .p-component {
        margin-left: auto;
    }
}
</style>
