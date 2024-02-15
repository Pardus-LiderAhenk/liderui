<template>
    <div class="p-grid">
         <div class="p-col-12" v-if="scriptDefinitionTitle">
            <Card style="margin-top: 10px">
                <template #title>
                    {{$t('settings.script_definition.title')}}
                </template>
                <template #content>
                    {{$t('settings.script_definition.definition')}}
                </template>
            </Card>
         </div>
        <div class="p-col-12">
            <Card>
                <template #title>
                    <div class="p-d-flex p-jc-between">
                        <div v-if="scriptDefinitionTitle">{{$t('settings.script_definition.script_list')}}</div>
                        <div v-if="!scriptDefinitionTitle"></div>
                        <Button 
                            class="p-button-sm" 
                            icon="pi pi-plus" 
                            :label="$t('settings.script_definition.add')"
                            @click="addNewScript">
                        </Button>
                    </div>
                </template>
                <template #content>
                    <DataTable 
                    :value="scripts"
                     responsiveLayout="scroll" 
                     class="p-datatable-sm"
                     v-model:filters="filters"
                    >
                        <template #header>
                            <div class="p-d-flex p-jc-end">
                                <span class="p-input-icon-left">
                                    <i class="pi pi-search"/>
                                    <InputText v-model="filters['global'].value" 
                                    class="p-inputtext-sm" 
                                    :placeholder="$t('settings.script_definition.search')" 
                                    />
                                </span>
                            </div>
                        </template>
                        <template #empty>
                            <div class="p-d-flex p-jc-center">
                                <span>{{$t('settings.script_definition.table_empty_message')}}</span>
                            </div>
                        </template>
                        <Column header="#" style="width:5%">
                            <template #body="{index}">
                                <span>{{ ((pageNumber - 1)*rowNumber) + index + 1 }}</span>
                            </template>
                        </Column>
                        <Column field="label" :header="$t('settings.script_definition.script_name')" style="width:25%"></Column>
                        <Column field="scriptType" :header="$t('settings.script_definition.type')" ></Column>
                        <Column field="createDate" :header="$t('settings.script_definition.created_date')" ></Column>
                        <Column field="modifyDate" :header="$t('settings.script_definition.modified_date')" ></Column>
                        <Column :exportable="false">
                            <template #body="slotProps">
                                <div class="p-d-flex p-jc-end">
                                    <Button class="p-mr-2 p-button-sm p-button-rounded p-button-warning" 
                                        icon="pi pi-pencil"  
                                        :label="$t('settings.script_definition.edit')" 
                                        @click.prevent="editScript(slotProps.data), false">
                                    </Button>
                                    <Button class="p-button-danger p-mr-2 p-button-sm p-button-rounded" 
                                        icon="pi pi-trash" 
                                        :label="$t('settings.script_definition.delete')"
                                        @click.prevent="deleteScriptConfirmDialog = true; selectedScript = slotProps.data;">
                                    </Button>
                                    <Button v-if="isExecuteScript"
                                        class="p-button-sm p-button-rounded" 
                                        icon="pi pi-caret-right"
                                        :label="$t('computer.plugins.button.run')"
                                        @click.prevent="editScript(slotProps.data, true)"
                                    >
                                    </Button>
                                </div>
                            </template>
                        </Column>
                    </DataTable>
                    <Paginator
                        v-model:first="first"
                        :rows="10"
                        :totalRecords="totalElements"
                        :rowsPerPageOptions="[10, 25, 50, 100]"
                        @page="onPage($event)"
                    >
                    </Paginator>
                </template>
            </Card>
        </div>
        <Dialog 
        :header="selectedScript ? $t('settings.script_definition.update_script'):$t('settings.script_definition.create_script')" 
        :modal="false"
        :style="{ width: '60vw' }"
        :maximizable="true" 
        v-model:visible="showTemplateDialog" >
            <div class="p-fluid p-formgrid p-grid">
                <div class="p-field p-col-12 p-md-8">
                    <label>{{$t('settings.script_definition.script_name')}}</label>
                    <InputText 
                    type="text" 
                    v-model="label" 
                    :class="validationErrors.label || validationScriptLabel? 'p-invalid':''"
                    />
                    <small v-if="validationErrors.label" 
                      class="p-error">{{ $t('settings.script_definition.script_name_warn') }}
                    </small>
                    <small v-if="validationScriptLabel" 
                      class="p-error">{{ $t('settings.script_definition.script_name_unique_warn') }}
                    </small>
                </div>
                <div class="p-field p-col-12 p-md-4">
                    <label>{{$t('settings.script_definition.type')}}</label>
                    <Dropdown 
                      v-model="scriptType"
                      optionValue="value"
                      :options="scriptTypes" 
                      optionLabel="label"
                     :placeholder="$t('settings.script_definition.select')" 
                     @change="changeScriptType"
                    />
                </div>
                <div class="p-field p-col-12" v-if="isExecuteScriptDialog">
                    <label for="scriptParams">{{$t('computer.plugins.execute_script.define_parameter')}}</label>
                    <InputText type="text" v-model="scriptParams"/>
                </div>
                <div class="p-field p-col-12">
                    <label>{{$t('settings.script_definition.script_content')}}</label>
                    <Textarea 
                        :autoResize="false" 
                        style="width:100%; height: 500px;"  
                        v-model="contents" 
                        :class="validationErrors.contents? 'p-invalid':''"
                    />
                    <small v-if="validationErrors.contents"
                      class="p-error">{{ $t('settings.script_definition.script_content_warn') }}
                    </small>
                </div>
            </div>
            <template #footer>
                <Button 
                    :label="$t('settings.script_definition.cancel')" 
                    icon="pi pi-times"
                    @click="showTemplateDialog = false; selectedScript = null;" 
                    class="p-button-text p-button-sm"
                />
                <Button v-if="isExecuteScriptDialog"
                    icon="pi pi-caret-right"
                    :label="$t('computer.plugins.button.run')"
                    @click="executeScript" 
                    class="p-button-sm"
                />
                <Button v-else
                    :label="selectedScript ? $t('settings.script_definition.update'): $t('settings.script_definition.save')" 
                    :icon="selectedScript ?'pi pi-refresh': 'pi pi-save'"  
                    class="p-button-sm"
                    @click="scriptOperation(selectedScript ? 'update':'add')"
                />
            </template>
        </Dialog>
        <Dialog 
            :style="{ width: '20vw' }"
            :header="$t('computer.task.toast_summary')" 
            v-model:visible="deleteScriptConfirmDialog"  
            :modal="true" 
            @hide="deleteScriptConfirmDialog = false"
        >
            <div class="confirmation-content">
                <i class="pi pi-info-circle p-mr-3" style="font-size: 2rem" />
                <span>{{ $t('settings.script_definition.delete_script_confirm_message')}}</span>
            </div>
            <template #footer>
            <Button 
                :label="$t('settings.script_definition.cancel')" 
                icon="pi pi-times" 
                @click="deleteScriptConfirmDialog = false" 
                class="p-button-text p-button-sm"
            />
            <Button 
                :label="$t('settings.script_definition.yes')"
                icon="pi pi-check" 
                @click="deleteScript"
                class="p-button-sm"
            />
            </template>
        </Dialog>
    </div>
</template>

<script>
/**
 * Script definition page. The script added, updated or deleted
 * emit executeScript event for send task to agent
 * @event executeScript
 * @see {@link http://www.liderahenk.org/}
 * 
 */

import {FilterMatchMode} from 'primevue/api';
import { scriptService }  from '../../../services/Settings/ScriptDefinitionService.js';

export default {
    props: {
        scriptDefinitionTitle: {
            type: Boolean,
            default: true,
        },
        isExecuteScript: {
            type: Boolean,
            default: false,
            description: "Display Execute script button"
        }
    }, 
    data() {
        return {
            deleteScriptConfirmDialog: false,
            scripts: [],
            selectedScript: null,
            filters: {
                'global': {value: null, matchMode: FilterMatchMode.CONTAINS}
            },
            showTemplateDialog: false,
            scriptTypes: [
                {
                    label: 'Bash',
                    value: 0
                },
                {
                    label: 'Python',
                    value: 1
                },
                {
                    label: 'Perl',
                    value: 2
                },
                {
                    label: 'Ruby',
                    value: 3
                }
            ],
            scriptType: 0,
            label: "",
            contents: "#!/bin/bash\nset -e",
            validationErrors:{},
            validationScriptLabel: false,
            pageNumber: 1,
            rowNumber: 10,
            totalElements:0,
            first : 0,
            scriptParams: "",
            isExecuteScriptDialog: false,
        }
    },

    mounted() {
        this.getScripts();
    },

    methods: {

        executeScript() {
            let params = {
                scriptParams: this.scriptParams,
                scriptType: this.scriptType,
                contents: this.contents,
                id: this.selectedScript.id
            }
            this.$emit('executeScript', params)
        },

        async getScripts(){
            var data = new FormData();
            data.append("pageNumber", this.pageNumber);
            data.append("pageSize", this.rowNumber);            

            const { response,error } = await scriptService.scriptList(this.rowNumber,this.pageNumber);
            if(error){
                this.$toast.add({
                    severity:'error', 
                    detail: this.$t('settings.script_definition.get_scripts_error_message')+ " \n"+error, 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
            }
            else{
                if(response.status == 200){
                    if (response.data != null) {
                        this.scripts = response.data.content;
                        this.totalElements = response.data.totalElements;
                    }
                }
                else if(response.status == 417){
                    this.$toast.add({
                    severity:'error', 
                    detail: this.$t('settings.script_definition.error_417_get_scripts'), 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                    });
                }
            }
        },

        onPage(event) {
            this.pageNumber = event.page + 1;
            this.rowNumber = event.rows;
            this.getScripts();
        },

        setScript(data) {
            this.scriptParams = "";
            var type = null;
            if (data.scriptType === "BASH") {
            type = 0;
            }else if (data.scriptType === "PYTHON") {
                type = 1;
            } else if (data.scriptType === "PERL") {
                type = 2;
            } else if(data.scriptType === "RUBY"){
                type = 3;
            }
            this.selectedScript = data;
            this.showTemplateDialog = true;
            this.label = data.label;
            this.scriptType = type;
            this.contents = data.contents;
        },

        editScript(data, isExecute){
            this.isExecuteScriptDialog = isExecute;
            this.setScript(data);
        },

        addNewScript(){
            this.isExecuteScriptDialog = false;
            this.scriptType = 0,
            this.label = "",
            this.contents = "#!/bin/bash\nset -e"
            this.selectedScript = null; 
            this.validationErrors = {};
            this.showTemplateDialog = true;
        },

        changeScriptType(){
            if (!this.selectedScript) {
                if(this.scriptType === 0){
                    this.contents = "#!/bin/bash\nset -e";
                } else if(this.scriptType === 1){
                    this.contents = "#!/usr/bin/python3\n# -*- coding: utf-8 -*-";
                }
                else if(this.scriptType === 2){
                    this.contents = "#!/usr/bin/perl\nuse strict;\nuse warnings;";
                }
                else if(this.scriptType === 3){
                    this.contents = "#!/usr/bin/env ruby";
                }
            }
        },

        async deleteScript(){
            this.deleteScriptConfirmDialog = false;
            const params = {
                id: this.selectedScript.id
            };

            const {response,error} = await scriptService.scriptDelete(this.selectedScript.id);
            if(error){
                this.$toast.add({
                    severity:'error', 
                    detail: this.$t('settings.script_definition.deleted_script_error_message')+ " \n"+error, 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
            }
            else{
                if(response.status == 200){
                    if (response.data != null) {
                        // var index = this.scripts.findIndex(function(item, i){
                        //     return item.id === response.data.id;
                        // });
                        // if (index > -1) {
                        //     this.scripts.splice(index, 1);
                        // }
                        this.reset();
                        this.selectedScript = null; 
                        this.$toast.add({
                            severity:'success', 
                            detail: this.$t('settings.script_definition.deleted_script_success_message'), 
                            summary:this.$t("computer.task.toast_summary"), 
                            life: 3000
                        });
                    }
                }
                else if(response.status == 417){
                    this.$toast.add({
                        severity:'error', 
                        detail: this.$t('settings.script_definition.error_417_delete_script'), 
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000
                    });
                }
            }
        },

        async scriptOperation(action) {
            if (action == "update") {
                if (!this.validateForm()) {
                    return;
                }
                const params = {
                    label: this.label,
                    contents: this.contents,
                    scriptType: this.scriptType,
                    id: this.selectedScript.id
                };

                const { response,error } = await scriptService.scriptUpdate(params);
                if(error){
                    this.$toast.add({
                        severity:'error', 
                        detail: this.$t('settings.script_definition.updated_script_error_message')+ " \n"+error, 
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000
                        });
                }
                else{
                    if(response.status == 200){
                        if (response.data != null) {
                            this.showTemplateDialog = false;
                            // for (let index = 0; index < this.scripts.length; index++) {
                            //     const element = this.scripts[index];
                            //     if (response.data.id === element.id) {
                            //         element.label = response.data.label;
                            //         element.contents = response.data.contents;
                            //         element.scriptType = response.data.scriptType;
                            //         element.modifyDate = response.data.modifyDate;
                            //     }
                            // }
                            this.reset();
                            this.$toast.add({
                                severity:'success', 
                                detail: this.$t('settings.script_definition.updated_script_success_message'), 
                                summary:this.$t("computer.task.toast_summary"), 
                                life: 3000
                            });
                        }
                    }
                    else if(response.status == 417){
                        this.$toast.add({
                            severity:'error', 
                            detail: this.$t('settings.script_definition.error_417_update_script'), 
                            summary:this.$t("computer.task.toast_summary"), 
                            life: 3000
                        });
                    }

                }
            } 
            else{
                if (!this.validateForm()) {
                    return;
                }
                const params = {
                    label: this.label,
                    contents: this.contents,
                    scriptType: this.scriptType
                };

                const { response,error } = await scriptService.scriptAdd(params);
                if(error){
                    this.$toast.add({
                        severity:'error', 
                        detail: this.$t('settings.script_definition.saved_script_error_message')+ " \n"+error, 
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000
                    });
                }
                else{
                    if(response.status == 200){
                        if (response.data != null) {
                            this.showTemplateDialog = false;
                            // this.scripts.push(response.data);
                            this.reset();
                            this.$toast.add({
                                severity:'success', 
                                detail: this.$t('settings.script_definition.saved_script_success_message'), 
                                summary:this.$t("computer.task.toast_summary"), 
                                life: 3000
                            });
                        }
                    }
                    else if(response.status == 417){
                        this.$toast.add({
                            severity:'error', 
                            detail: this.$t('settings.script_definition.error_417_saved_script'), 
                            summary:this.$t("computer.task.toast_summary"), 
                            life: 3000
                        });
                    }
                }
            }
        },

        validateForm() {
            if (!this.label.trim()){
                this.validationErrors['label'] = true;
            }
            if (!this.contents.trim()){
                this.validationErrors['contents'] = true;
            }
            return !Object.keys(this.validationErrors).length;
        },

        isExistScriptName(label, id) {
            let isExist = false;
            for (let index = 0; index < this.scripts.length; index++) {
                const element = this.scripts[index];
                if (element.label === label) {
                    isExist = true;
                    if (id && element.id === id) {
                        isExist = false;
                    }
                }
            }
            return isExist;
        },
        
        reset(){
            this.pageNumber = 1;
            this.rowNumber = 10;
            this.getScripts();
            this.first = 0;
        }
 
    },

    watch: {
        contents() {
            delete this.validationErrors['contents'];
        },
        label(){
            delete this.validationErrors['label'];
            this.validationScriptLabel = false; 
        },
    }
}
</script>
<style lang="scss" scoped>
::v-deep(.p-paginator) {
    .p-component {
        margin-left: auto;
    }
}
</style>