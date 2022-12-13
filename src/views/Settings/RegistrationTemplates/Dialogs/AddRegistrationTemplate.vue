<template>
    <Dialog 
        :header="$t('settings.registiration_template.add_template')"
        :modal="true"
        :style="{ width: '40vw' }"
        v-model:visible="showDialog">
        <div class="p-fluid">
            <div class="p-field p-fluid">
                <div class="p-field">
                    <label>{{$t('settings.registiration_template.template_type')}}</label>
                    <Dropdown 
                        v-model="templateType"
                        optionValue="value"
                        :options="templateTypes" 
                        optionLabel="label"
                    />
                </div>
                <div class="p-field">
                    <label>{{$t('settings.registiration_template.template_text')}}</label>
                    <InputText :placeholder="templateType == 'IP_ADDRESS' ? '192.168.*.*': 'pardus-01'"
                        type="text" v-model="templateText"
                        :class="validationErrors.templateText ? 'p-invalid':''"
                    />
                    <small v-if="validationErrors.templateText" class="p-error">
                        {{$t('settings.registiration_template.template_text_cant_be_null')}}
                    </small>
                </div>
                <div class="p-field">
                    <label>{{$t('settings.registiration_template.organization_unit_to_include_the_client')}}</label>
                    <div class="p-inputgroup ">
                        <InputText placeholder="ou=ANKARA,ou=Agents,dc=liderahenk,dc=org" 
                            v-model="agentCreationDN" :class="validationErrors.agentCreationDN ? 'p-invalid':''"
                        />
                        <Button icon="pi pi-sitemap" class="p-button-warning" 
                            @click="agentOuDialog = true"
                        />
                    </div>
                    <small v-if="validationErrors.agentCreationDN" class="p-error">
                        {{$t('settings.registiration_template.organization_unit_to_include_the_client_cant_be_null')}}
                    </small>
                </div>
                <div class="p-field">
                    <label>{{$t('settings.registiration_template.authorized_user_group')}}</label>
                    <div class="p-inputgroup">
                        <InputText placeholder="cn=adminGroups,ou=User,ou=Groups,dc=liderahenk,dc=org" 
                            v-model="authorizedUserGroupDN" :class="validationErrors.authorizedUserGroupDN ? 'p-invalid':''"
                        />
                        <Button icon="pi pi-sitemap" class="p-button-warning"
                            @click="userGroupDialog = true"
                        />
                    </div>
                    <small v-if="validationErrors.authorizedUserGroupDN" class="p-error">
                        {{$t('settings.registiration_template.authorized_user_group_cant_be_null')}}
                    </small>
                </div>
            </div>
        </div>
        <template #footer>
            <Button 
                :label="$t('settings.registiration_template.cancel')" 
                icon="pi pi-times"
                @click="showDialog = false" 
                class="p-button-text p-button-sm">
            </Button>
            <Button class="p-button-sm" 
                :label="$t('settings.registiration_template.save')" 
                icon="pi pi-save"
                @click="saveRegistrationTemplate"    
            />
        </template>
    </Dialog>
    <!-- Tree dialogs start -->
    <Dialog :header="$t('settings.registiration_template.select_organization_unit')" 
        v-model:visible="agentOuDialog" 
        :style="{width: '40vw'}" :modal="true"
    >
        <tree-component 
            ref="agentTree"
            loadNodeUrl="/api/lider/computer/computers"
            loadNodeOuUrl="/api/lider/computer/ou-details"
            :treeNodeClick="node => selectedAgentOu = node"
            :searchFields="searchFields"
            :isMove="true"
        />
        <template #footer>
            <Button :label="$t('settings.registiration_template.cancel')" icon="pi pi-times" @click="agentOuDialog = false"
                class="p-button-text p-button-sm"
            />
            <Button :label="$t('settings.registiration_template.add')" icon="pi pi-check" 
                @click="selectAgentOuDn" class="p-button-sm"
            />
        </template>
    </Dialog>
    <Dialog :header="$t('settings.registiration_template.select_authorized_user_group')" 
        v-model:visible="userGroupDialog" 
        :style="{width: '40vw'}" :modal="true"
    >
        <tree-component 
            ref="userGroupTree"
            loadNodeUrl="/api/lider/user-groups/groups"
            loadNodeOuUrl="api/lider/user-groups/ou-details"
            :treeNodeClick="node => selectedUserGroup = node"
            :searchFields="searchGroupFields"
            :scrollHeight="40"

        />
        <template #footer>
            <Button :label="$t('settings.registiration_template.cancel')" icon="pi pi-times" @click="userGroupDialog = false"
                class="p-button-text p-button-sm"
            />
            <Button :label="$t('settings.registiration_template.add')" icon="pi pi-check" 
                @click="selectUserGroupDn" class="p-button-sm"
            />
        </template>
    </Dialog>
</template>

<script>
import { registrationTemplateService } from '../../../../services/Settings/RegistrationTemplates.js'
export default {

    props: {
        addTemplateDialog: {
            type: Boolean,
            default: false
        },
    },
    
    data() {
        return {
            showDetailDialog: false,
            templateText: "",
            authorizedUserGroupDN: "",
            agentCreationDN: "",
            selectedAgentOu: null,
            selectedUserGroup: null,
            agentOuDialog: false,
            userGroupDialog: false,
            searchFields: [
                {
                    key: this.$t('tree.folder'),
                    value: "ou"
                },
            ],
            searchGroupFields: [
                {
                    key: this.$t('tree.name'),
                    value: "cn"
                },
                {
                    key: this.$t('tree.folder'),
                    value: "ou"
                },
            ],
            validationErrors: {},
            templateType:  "HOSTNAME",
            templateTypes: [
                {label: this.$t('settings.registiration_template.hostname'), value: 'HOSTNAME'},
                {label: this.$t('settings.registiration_template.ip_address'),  value: "IP_ADDRESS"}
            ],
        }
    },

    computed: {
        showDialog: {
            get () {
                return this.addTemplateDialog;
            },

            set (value) {
                if (!value) {
                    this.$emit('closeTemplateDialog');
                }
            }
        }
    },

    methods: {
        selectAgentOuDn() {
            if (!this.selectedAgentOu) {
                this.$toast.add({
                    severity:'warn', 
                    detail: this.$t('settings.registiration_template.please_select_folder'), 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
                return;
            }
            this.agentCreationDN = this.selectedAgentOu.distinguishedName;
            this.selectedAgentOu = null;
            this.agentOuDialog = false;
        },

        selectUserGroupDn() {
            if (!this.selectedUserGroup || this.selectedUserGroup.type != "GROUP") {
                this.$toast.add({
                    severity:'warn', 
                    detail: this.$t('settings.registiration_template.please_select_authorized_user_group'), 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
                return;
            }
            this.authorizedUserGroupDN = this.selectedUserGroup.distinguishedName;
            this.selectedUserGroup = null;
            this.userGroupDialog = false;
        },

        async saveRegistrationTemplate() {
            if (!this.validateForm()) {
                return;
            }
            let params = {
                "unitId": this.templateText,
                "authGroup": this.authorizedUserGroupDN,
                "parentDn": this.agentCreationDN,
                "templateType": this.templateType,
            }

            const {response, error} = await registrationTemplateService.type(params);
            if(error){
                this.$toast.add({
                    severity:'error', 
                    detail: this.$t('settings.registiration_template.an_error_occurred_while_saving_template')+ " \n"+error, 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
            }
            else{
                if(response.status == 200) {
                    if (response.data && response.status == 200) {
                        this.templateText = "";
                        this.authorizedUserGroupDN = "";
                        this.agentCreationDN = "";
                        this.$emit("savedRegistrationTemplate", response.data);
                        this.showDialog = false;
                        this.$toast.add({
                            severity:'success',
                            detail: this.$t('settings.registiration_template.template_successfully_saved'), 
                            summary:this.$t("computer.task.toast_summary"), 
                            life: 3000
                        });
                    } else {
                        this.$toast.add({
                            severity:'error', 
                            detail: this.$t('settings.registiration_template.an_error_occurred_while_saving_template'),
                            summary:this.$t("computer.task.toast_summary"), 
                            life: 3000
                        });
                    }
                }
                else if(response.status == 417){
                    this.$toast.add({
                        severity:'error', 
                        detail: this.$t('settings.registiration_template.error_417_saving_template'),
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000
                    });
                    

                }
            }
        },

        validateForm() {
            if (!this.templateText.trim()){
                this.validationErrors['templateText'] = true;
            }
            if (!this.authorizedUserGroupDN.trim()){
                this.validationErrors['authorizedUserGroupDN'] = true;
            }
            if (!this.agentCreationDN.trim()){
                this.validationErrors['agentCreationDN'] = true;
            }
            return !Object.keys(this.validationErrors).length;
        },
    },

    watch: {
        templateText() {
            if (this.templateText.trim()) {
                delete this.validationErrors['templateText'];
            }
        },

        agentCreationDN() {
            if (this.agentCreationDN.trim()) {
                delete this.validationErrors['agentCreationDN'];
            }
        },

        authorizedUserGroupDN() {
            if (this.authorizedUserGroupDN.trim()) {
                delete this.validationErrors['authorizedUserGroupDN'];
            }
        },
    }
}
</script>