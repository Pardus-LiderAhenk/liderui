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
                    <div class="p-field p-col-12">
                        <label>{{ $t("computer.plugins.conky.templates") }}</label>
                        <Dropdown
                            v-model="selectedTemplate"
                            :options="templates"
                            optionLabel="label"
                            @change="changeTemplate"
                            :class="conkyValidation ? 'p-invalid' : ''"
                            :showClear="true"
                            :filter="true"
                            :placeholder="$t('computer.plugins.conky.select_template')"
                            filterPlaceholder="Find Template"
                        >
                        </Dropdown>
                        <small v-if="conkyValidation" class="p-error">{{
                            $t("computer.plugins.conky.warn_select_template")}}
                        </small>
                    </div>
                    <div class="p-col">
                        <Textarea
                            v-model="conkyMessage"
                            style="height: 320px; width: 100%"
                        />
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
 * Conky profile dialog
 * @see {@link http://www.liderahenk.org/}
* emits this event
* @event closePolicyDialog
*/

import { conkyService } from "./../../../../../services/Settings/ConkyService.js";
import BaseProfile from './Component/BaseProfile.vue';

export default {
    props: {
        conkyProfileDialog: {
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
            conkyMessage: null,
            selectedTemplate: null,
            templates: [],
            conkyValidation:false,
            profileData: null
        }
    },

    computed: {
        showDialog: {
            get () {
                return this.conkyProfileDialog;
            },

            set (value) {
                if (!value) {
                    this.$emit('closeProfileDialog');
                }
            }
        },
    },

    mounted() {

        this.conkyListAll();
    },

    methods: {
        changeTemplate() {
            this.conkyValidation = false;
            if (this.selectedTemplate) {
                this.conkyMessage =  this.selectedTemplate.settings + "\n" + this.selectedTemplate.contents;
            } else {
                this.conkyMessage = null;
            }
        },

        addProfile() {
            this.conkyMessage = null;
            this.selectedTemplate = null;
        },

        saveProfile() {
            if (!this.conkyMessage) {
                this.conkyValidation = true;
                return;
            } else{
                this.profileData = {
                    "message": this.conkyMessage
                }
                this.$refs.profile.saveProfile(this.profileData);
            }
        },

        editProfile(data) {
            if (data) {
                this.selectedTemplate = null;
                this.conkyMessage = data.profileData.message;
            }
        },

        updateProfile() {
            if (!this.conkyMessage) {
                this.conkyValidation = true;
                return;
            } else{
                this.profileData = {
                    "message": this.conkyMessage
                }
                this.$refs.profile.updateProfile(this.profileData);
                this.conkyMessage = null;
            }
        },

        async conkyListAll(){
            const{response,error} = await conkyService.conkyListAll();
            if(error){
              this.$toast.add({
                severity: "error",
                detail: this.$t("computer.plugins.conky.conky_error_message") +" \n" + error,
                summary: this.$t("computer.task.toast_summary"),
                life: 3000,
              });
            }
            else{
              if(response.status == 200){
                if (response.data != null || response.data != "") {
                  for (let index = 0; index < response.data.length; index++) {
                      const element = response.data[index];
                      this.templates.push({
                        label: element.label,
                        id: element.id,
                        contents: element.contents,
                        settings: element.settings,
                      });
                    }
                  }
                }
              else if(response.status == 417){
                this.$toast.add({
                    severity: "error",
                    detail: this.$t("computer.plugins.conky.error_417_fetching_conky"),
                    summary: this.$t("computer.task.toast_summary"),
                    life: 3000,
                    });
                }
            }
            
        }
    },
}
</script>

<style lang="scss" scoped>
.tabview-custom {
  i,
  span {
    vertical-align: middle;
  }
  span {
    margin: 0 0.5rem;
  }
}

</style>