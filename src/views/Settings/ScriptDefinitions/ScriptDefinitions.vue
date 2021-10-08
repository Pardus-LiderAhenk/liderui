<template>
    <div class="p-grid">
        <div class="p-col-12">
            <Card>
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
                        <p>{{$t('settings.script_definition.script_list')}}</p>
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
                      dataKey="id"
                    >
                        <template #header>
                            <div class="p-d-flex p-jc-end">
                                <span class="p-input-icon-left">
                                    <i class="pi pi-search" />
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
                        <Column field="label" :header="$t('settings.script_definition.script_name')" style="min-width:12rem"></Column>
                        <Column field="scriptType" :header="$t('settings.script_definition.type')"></Column>
                        <Column field="createDate" :header="$t('settings.script_definition.created_date')"></Column>
                        <Column field="modifyDate" :header="$t('settings.script_definition.modified_date')"></Column>
                        <Column :exportable="false">
                            <template #body="slotProps">
                                <div class="p-d-flex p-jc-end">
                                    <Button class="p-mr-2 p-button-sm p-button-rounded" 
                                    icon="pi pi-pencil"  
                                    :label="$t('settings.script_definition.edit')" 
                                    @click.prevent="editScript(slotProps.data)">
                                    </Button>
                                    <Button class="p-button-danger p-button-sm p-button-rounded" 
                                    icon="pi pi-trash" 
                                    :label="$t('settings.script_definition.delete')"
                                    @click.prevent="deleteScript(slotProps.data)">
                                    </Button>
                                </div>
                            </template>
                        </Column>
                    </DataTable>
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
                     :placeholder="$t('settings.script_definition.select')" @change="changeScriptType"
                    />
                </div>
                <div class="p-field p-col-12">
                    <label>{{$t('settings.script_definition.script_content')}}</label>
                    <Textarea 
                    :autoResize="false" style="width:100%; height: 500px;"  
                    v-model="contents" :class="validationErrors.contents? 'p-invalid':''"
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
                <Button 
                :label="selectedScript ? $t('settings.script_definition.update'): $t('settings.script_definition.save')" 
                :icon="selectedScript ?'el-icon-refresh': 'pi pi-save'"  
                class="p-button-sm"
                @click="scriptOperation(selectedScript ? 'update':'add')"
                />
            </template>
        </Dialog>
    </div>
</template>

<script>
/**
 * Script definition page. The script added, updated or deleted
 * @see {@link http://www.liderahenk.org/}
 * 
 */

import {FilterMatchMode} from 'primevue/api';
import axios from "axios";

export default {
    data() {
        return {
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
            validationScriptLabel: false
        }
    },

    created() {
        axios.post("/script/list", null)
            .then((response) => {
                if (response.data != null) {
                    this.scripts = response.data;
                }
            })
        .catch((error) => { 
        this.$toast.add({
            severity:'error', 
            detail: this.$t('settings.script_definition.get_scripts_error_message')+ " \n"+error, 
            summary:this.$t("computer.task.toast_summary"), 
            life: 3000
            })})
    },

    methods: {
        editScript(data){
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

        addNewScript(){
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

        deleteScript(data){
            const params = {
                id: data.id
            };
            axios.post("/script/delete", params).then((response) => {
                if (response.data != null) {
                    var index = this.scripts.findIndex(function(item, i){
                        return item.id === response.data.id;
                    });
                    if (index > -1) {
                        this.scripts.splice(index, 1);
                    }
                    this.$toast.add({
                        severity:'success', 
                        detail: this.$t('settings.script_definition.deleted_script_success_message'), 
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000});
                }
            })
            .catch((error) => { 
            this.$toast.add({
                severity:'error', 
                detail: this.$t('settings.script_definition.deleted_script_error_message')+ " \n"+error, 
                summary:this.$t("computer.task.toast_summary"), 
                life: 3000
                });
            })
        },

        scriptOperation(action) {
            if (action == "update") {
                if (!this.validateForm()) {
                    return;
                }
                if (this.isExistScriptName(this.label, this.selectedScript.id)) {
                    this.validationScriptLabel = true;
                    return;
                }
                const params = {
                    label: this.label,
                    contents: this.contents,
                    scriptType: this.scriptType,
                    id: this.selectedScript.id
                };
                axios.post("/script/update", params).then((response) => {
                    if (response.data != null) {
                        this.showTemplateDialog = false;
                        for (let index = 0; index < this.scripts.length; index++) {
                            const element = this.scripts[index];
                            if (response.data.id === element.id) {
                                element.label = response.data.label;
                                element.contents = response.data.contents;
                                element.scriptType = response.data.scriptType;
                                element.modifyDate = response.data.modifyDate;
                            }
                        }
                        this.$toast.add({
                            severity:'success', 
                            detail: this.$t('settings.script_definition.updated_script_success_message'), 
                            summary:this.$t("computer.task.toast_summary"), 
                            life: 3000
                            });
                    }
                })
                .catch((error) => { 
                this.$toast.add({
                    severity:'error', 
                    detail: this.$t('settings.script_definition.updated_script_error_message')+ " \n"+error, 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000})})
            } else{
                if (!this.validateForm()) {
                    return;
                }
                if (this.isExistScriptName(this.label, null)) {
                    this.validationScriptLabel = true;
                    return;
                }
                const params = {
                    label: this.label,
                    contents: this.contents,
                    scriptType: this.scriptType
                };
                axios.post("/script/add", params).then((response) => {
                    if (response.data != null) {
                        this.showTemplateDialog = false;
                        this.scripts.push(response.data);
                        this.$toast.add({
                            severity:'success', 
                            detail: this.$t('settings.script_definition.saved_script_success_message'), 
                            summary:this.$t("computer.task.toast_summary"), 
                            life: 3000})
                    }
                })
                .catch((error) => { 
                this.$toast.add({
                    severity:'error', 
                    detail: this.$t('settings.script_definition.saved_script_error_message')+ " \n"+error, 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000})})
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
        }
    },

    watch: {
        contents() {
            delete this.validationErrors['contents'];
        },
        label(){
            delete this.validationErrors['label'];
            this.validationScriptLabel = false; 
        }
    }
}
</script>
