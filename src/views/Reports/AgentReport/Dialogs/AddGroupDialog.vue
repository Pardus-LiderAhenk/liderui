<template>
    <div>
        <Dialog :header="$t('reports.detailed_agent_report.add_group')" v-model:visible="showDialog" 
            :style="{width: '30vw'}" :modal="true">
            <div class="p-fluid">
                <div class="p-field">
                    <label for="groupName">{{$t('reports.detailed_agent_report.group_name')}}</label>
                    <InputText :class="validation.groupName ? 'p-invalid': ''" type="text" v-model="groupName"/>
                    <small v-if="validation.groupName" class="p-error">
                        {{$t('reports.detailed_agent_report.group_name_cannot_be_null')}}
                    </small>
                </div>
                <div class="p-field">
                    <tree-component 
                        ref="grouptree"
                        :isMove="true"
                        loadNodeUrl="/api/lider/computer-groups/groups"
                        loadNodeOuUrl="/api/lider/computer-groups/ou-details"
                        :treeNodeClick="selectTreeNodeClick"
                        :searchFields="searchFolderFields"
                        :scrollHeight="40"
                    />
                </div>
                <div class="p-filed p-text-center">
                    <small>{{$t('reports.detailed_agent_report.please_select_folder')}}</small>
                </div>
            </div>
            <div v-if="loading" class="p-text-center">
              <i style="font-size: 1.5rem" class="el el-icon-loading"></i>&nbsp;
              <a class="primary">
                {{$t('reports.detailed_agent_report.group_is_creating_please_wait')}}
              </a>
            </div>
            <template #footer>
                <Button :label="$t('reports.detailed_agent_report.cancel')" icon="pi pi-times" 
                    @click="showDialog = false" class="p-button-text p-button-sm"
                />
                <Button :label="$t('reports.detailed_agent_report.add')" icon="pi pi-plus"
                    @click="addGroup" class="p-button-sm"
                />
            </template>
        </Dialog>
    </div>
</template>

<script>
/**
 * Create Group to LDAP
 * @see {@link http://www.liderahenk.org/}
 */

import { computerGroupsManagementService } from "../../../../services/ComputerManagement/ComputerGroupManagement.js";

export default {

    props: {
        filter: {
            type: Object,
            description: "Agent report filter",
        },

        addGroupDialog: {
            type: Boolean,
            default: false,
        },
    },

    data(){
        return{
            groupName:'',
            validation: {
                groupName: false,
            },
            selectedOu: null,
            searchFolderFields: [
                {
                    key: this.$t('tree.folder'),
                    value: "ou"
                },
            ],
            loading: false
        }
    },

    computed: {
        showDialog: {
            get () {
                return this.addGroupDialog;
            },

            set (value) {
                if (!value) {
                    this.$emit('closeGroupDialog')
                }
            }
        }
    },

    methods: {
        selectTreeNodeClick(node) {
            this.selectedOu = node;
        },

        async addGroup() {
            if (!this.groupName.trim()) {
                this.validation.groupName = true;
                return;
            }
            if (!this.selectedOu) {
                this.$toast.add({
                    severity:'warn', 
                    detail: this.$t('reports.detailed_agent_report.please_select_folder'), 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
                return;
            }
            this.loading = true;
            let data = new FormData();
            data.append("selectedOUDN", this.selectedOu.distinguishedName);
            data.append("groupName", this.groupName);
            data.append("status", this.filter.status);
            data.append("dn", this.filter.dn);
            data.append("hostname", this.filter.hostname);
            data.append("ipAddress", this.filter.ipAddress);
            data.append("macAddress", this.filter.macAddress);
            // data.append("registrationStartDate", this.filter.registrationStartDate);
            // data.append("registrationEndDate", this.filter.registrationEndDate);
            data.append("brand", this.filter.brand);
            data.append("model", this.filter.model);
            data.append("processor", this.filter.processor);
            data.append("osVersion", this.filter.osVersion);
            data.append("diskType",this.filter.diskType);
            data.append("agentVersion", this.filter.agentVersion);
            data.append("getFilterData", false);
            data.append("agentStatus",this.filter.agentStatus);
            if (this.filter.registrationDate[0] != null) {
                data.append(
                "registrationStartDate",
                moment(this.filter.registrationDate[0])
                    .set("hour", 0)
                    .set("minute", 0)
                    .set("second", 0)
                    .format("DD/MM/YYYY HH:mm:ss")
                );
            }
            if (this.filter.registrationDate[1] != null) {
                data.append(
                "registrationEndDate",
                moment(this.filter.registrationDate[1])
                    .set("hour", 0)
                    .set("minute", 0)
                    .set("second", 0)
                    .format("DD/MM/YYYY HH:mm:ss")
                );
            }

            const{response,error} = await computerGroupsManagementService.createAgentGroup(data);
            if(error){
                this.$toast.add({
                    severity:'error', 
                    detail: this.$t('reports.detailed_agent_report.an_error_occurred_while_creating_the_computer_group'), 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
            }

            else{
                if(response.status == 200){
                    if (response.data) {
                        this.$toast.add({
                            severity:'success', 
                            detail: this.$t('reports.detailed_agent_report.computers_successfully_added'), 
                            summary:this.$t("computer.task.toast_summary"), 
                            life: 3000
                        });                    
                    }
                }

                else if(response.status == 417){
                    this.$toast.add({
                        severity:'error', 
                        detail: this.$t('reports.detailed_agent_report.error_417_adding_computer_to_group'), 
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000
                    });
                }
            }

            this.showDialog = false;
            this.groupName = '';
            this.selectedOu = null;
            this.loading = false;
        },
    }
}
</script>

<style lang="scss" scoped>

</style>