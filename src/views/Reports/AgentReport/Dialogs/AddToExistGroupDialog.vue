<template>
    <div>
        <Dialog header="Gruba İstemci Ekle" v-model:visible="showDialog" 
            :style="{width: '30vw'}" :modal="true">
            <div class="p-fluid">
                <div class="p-field">
                    <tree-component 
                        ref="grouptree"
                        loadNodeUrl="/lider/computer_groups/getGroups"
                        loadNodeOuUrl="/lider/computer_groups/getOuDetails"
                        :treeNodeClick="selectTreeNodeClick"
                        :searchFields="searchFolderFields"
                    />
                </div>
                <div class="p-filed p-text-center">
                    <small>Lütfen grup seçiniz</small>
                </div>
            </div>
            <div v-if="loading" class="p-text-center">
              <i style="font-size: 1.5rem" class="el el-icon-loading"></i>&nbsp;
              <a class="primary">
                İstemciler ekleniyor, lütfen bekleyiniz...
              </a>
            </div>
            <template #footer>
                <Button label="İptal" icon="pi pi-times" 
                    @click="showDialog = false" class="p-button-text p-button-sm"
                />
                <Button label="Ekle" icon="pi pi-plus"
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

import axios from "axios";

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

        addGroup() {
            if (!this.selectedNode || this.selectedNode.type != "GROUP") {
                this.$toast.add({
                    severity:'warn', 
                    detail: "Lütfen grup seçiniz", 
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
            data.append("registrationStartDate", this.filter.registrationStartDate);
            data.append("registrationEndDate", this.filter.registrationEndDate);
            data.append("brand", this.filter.brand);
            data.append("model", this.filter.model);
            data.append("processor", this.filter.processor);
            data.append("osVersion", this.filter.osVersion);
            data.append("agentVersion", this.filter.agentVersion);
            data.append("getFilterData", false);
            
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

            axios.post('/lider/computer_groups/agentReport/existing/group', data).then(response => {
                if (response.data) {
                    this.$toast.add({
                        severity:'success', 
                        detail: "İstemciler gruba başarıyla eklendi", 
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000
                    });
                } else {
                    this.$toast.add({
                        severity:'error', 
                        detail: "İstemciler gruba eklenirken hata oluştu", 
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000
                    });
                }
                this.showDialog = false;
                this.selectedNode = null;
                this.loading = false;
            });
        },
    }
}
</script>

<style lang="scss" scoped>

</style>