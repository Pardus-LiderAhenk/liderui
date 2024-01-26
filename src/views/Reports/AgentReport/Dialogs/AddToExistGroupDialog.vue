<template>
    <div>
        <Dialog :header="$t('reports.detailed_agent_report.add_computer_group')" v-model:visible="showDialog" 
            :style="{width: '30vw'}" :modal="true">
            <div class="p-fluid">
                <div class="p-field">
                    <tree-component 
                        ref="grouptree"
                        loadNodeUrl="/api/lider/computer-groups/groups"
                        loadNodeOuUrl="/api/lider/computer-groups/ou-details"
                        :treeNodeClick="selectTreeNodeClick"
                        :searchFields="searchFolderFields"
                        :scrollHeight="40"
                    />
                </div>
                <div class="p-filed p-text-center">
                    <small>{{$t('reports.detailed_agent_report.please_select_group')}}</small>
                </div>
            </div>
            <div v-if="loading" class="p-text-center">
              <i style="font-size: 1.5rem" class="el el-icon-loading"></i>&nbsp;
              <a class="primary">
                {{$t('reports.detailed_agent_report.computers_adding_please_wait')}}
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
 * Add client to existing group in LDAP
 * @see {@link http://www.liderahenk.org/}
 */

import { computerGroupsManagementService } from "../../../../services/ComputerManagement/ComputerGroupManagement.js";

export default {

    props: {
        filter: {
            type: Object,
            description: "Agent report filter",
        },

        addExistGroupDialog: {
            type: Boolean,
            default: false,
        },
    },

    data(){
        return{
            selectedNode: null,
            searchFolderFields: [
                {
                    key: this.$t('tree.name'),
                    value: "cn"
                },
                {
                    key: this.$t('tree.folder'),
                    value: "ou"
                }
            ],
            loading: false
        }
    },

    computed: {
        showDialog: {
            get () {
                return this.addExistGroupDialog;
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
            this.selectedNode = node;
        },

        async addGroup() {
            if (!this.selectedNode || this.selectedNode.type != "GROUP") {
                this.$toast.add({
                    severity:'warn', 
                    detail: this.$t('reports.detailed_agent_report.please_select_group'), 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
                return;
            }
            this.loading = true;
            let data = new FormData();
            data.append("groupDN", this.selectedNode.distinguishedName);
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
            data.append("agentVersion", this.filter.agentVersion);
            data.append("diskType",this.filter.diskType);
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

            const{response,error} = await computerGroupsManagementService.addAgentToExistingGroupWithAgentReport(data);
            if(error){
                this.$toast.add({
                    severity:'error', 
                    detail:  this.$t('reports.detailed_agent_report.an_error_occurred_while_adding_computers_to_the_group'), 
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
                        detail:  this.$t('reports.detailed_agent_report.error_417_adding_computer_to_group'), 
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000
                    });
                }
            }

            this.showDialog = false;
            this.selectedNode = null;
            this.loading = false;

        },
    }
}
</script>

<style lang="scss" scoped>

</style>