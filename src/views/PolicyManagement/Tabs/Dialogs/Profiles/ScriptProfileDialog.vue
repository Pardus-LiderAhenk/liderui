<template>
    <div>
        <Dialog :header="pluginProfile.name" 
            v-model:visible="showDialog"
            :style="{width: '50vw'}" :modal="true">
            <base-profile :pluginProfile="pluginProfile" ref="profile"
                @add-profile="addProfile"
                @save-profile="saveProfile"
                @edit-profile="editProfile"
                @update-profile="updateProfile">
                <template #default>
                    <div class="p-fluid p-formgrid p-grid">
                        <div class="p-field p-col-12 p-md-8">
                            <label>{{ $t('settings.script_definition.script_list') }}</label>
                            <Dropdown
                                v-model="selectedScript"
                                :options="scripts"
                                optionLabel="label"
                                @change="changeScript"
                                :showClear="true"
                                :filter="true"
                                placeholder="Select Script"
                                filterPlaceholder="Find Script"
                            >
                            </Dropdown>
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
                        <div class="p-field p-col-12">
                            <label for="scriptParams">{{$t('computer.plugins.execute_script.define_parameter')}}</label>
                            <InputText class="p-inputtext-sm" type="text" v-model="scriptParams"/>
                            <small>Varsa betik parametresi giriniz</small>
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
                </template>
            </base-profile>
            <template #footer>
                <Button :label="$t('policy_management.cancel')" icon="pi pi-times" 
                    @click="showDialog = false" class="p-button-text p-button-sm"
                />
            </template>
        </Dialog>
    </div>
</template>

<script>
/**
 * Script profile dialog
 * @see {@link http://www.liderahenk.org/}
* emits this event
* @event closePolicyDialog
*/

import { scriptService } from '../../../../../services/Settings/ScriptDefinitionService.js';
import BaseProfile from './Component/BaseProfile.vue';


export default {
    props: {
        scriptProfileDialog: {
            type: Boolean,
            default: false,
        },
        pluginProfile: {
            type: Object,
            description: "Plugin task object",
        },
    },

    components:{
        BaseProfile,
    },

    data(){
        return {
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
            scripts: [],
            scriptType: 0,
            contents: "#!/bin/bash\nset -e",
            scriptParams: "",
            validationErrors:{},
            profileData: null
        }
    },

    computed: {
        showDialog: {
            get () {
                return this.scriptProfileDialog;
            },

            set (value) {
                if (!value) {
                    this.$emit('closeProfileDialog');
                }
            }
        },
    },

    mounted() {
        this.scriptListAll();
    },

    methods: {
        changeScript() {
            this.validationErrors = {};
            if (this.selectedScript) {
                this.contents =  this.selectedScript.contents;
                if (this.selectedScript.scriptType === "BASH") {
                    this.scriptType = 0;
                } else if (this.selectedScript.scriptType === "PYTHON") {
                    this.scriptType = 1;
                } else if (this.selectedScript.scriptType === "PERL") {
                    this.scriptType = 2;
                } else if(this.selectedScript.scriptType === "RUBY"){
                    this.scriptType = 3;
                }
            } else {
                this.scriptType = 0;
                this.contents = null;
            }
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

        async scriptListAll(){
            const { response, error } = await scriptService.scriptListAll();
            if(error){
                this.$toast.add({
                    severity: "error",
                    detail: this.$t('settings.script_definition.get_scripts_error_message')+ " \n"+error, 
                    summary: this.$t("computer.task.toast_summary"),
                    life: 3000,
                });
            }
            else{
                if(response.status = 200){
                    if (response.data != null || response.data != "") {
                        for (let index = 0; index < response.data.length; index++) {
                            const element = response.data[index];
                            this.scripts.push({
                                label: element.label,
                                id: element.id,
                                contents: element.contents,
                                scriptType: element.scriptType
                            });
                        }
                    }
                }
                else if(response.status == 417){
                    this.$toast.add({
                        severity: "error",
                        detail: this.$t('settings.script_definition.error_417_get_scripts'), 
                        summary: this.$t("computer.task.toast_summary"),
                        life: 3000,
                    });
                }
            }
        },

        addProfile() {
            this.contents = "#!/bin/bash\nset -e";
            this.scriptType = 0;
            this.selectedScript = null;
            this.scriptParams = "";
        },

        saveProfile() {
            if (!this.contents) {
                this.validationErrors['contents'] = true;
                return;
            } else{
                this.$refs.profile.saveProfile(this.getProfileData());
            }
        },

        editProfile(data) {
            if(data) {
                this.selectedScript = null;
                this.contents = data.profileData.SCRIPT_CONTENTS;
                this.scriptType = data.profileData.SCRIPT_TYPE;
                this.scriptParams = data.profileData.SCRIPT_PARAMS;
            }
        },

        updateProfile() {
            if (!this.contents) {
                this.validationErrors['contents'] = true;
                return;
            } else{
                this.$refs.profile.updateProfile(this.getProfileData());
                this.contents = null;
            }
        },

        getProfileData() {
            this.profileData = {
                "SCRIPT_TYPE": this.scriptType,
                "SCRIPT_CONTENTS": this.contents,
                "SCRIPT_PARAMS": this.scriptParams
            }
            return this.profileData;
        }
    },
}
</script>

<style lang="scss" scoped>
</style>