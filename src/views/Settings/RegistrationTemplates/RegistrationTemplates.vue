<template>
    <div class="p-fluid p-formgrid p-grid">
        <div class="p-field p-col-12 p-md-12">
            <Card style="margin-top: 10px">
                <template #title>
                    Kayıt Şablonları
                </template>
                <template #content>
                    Şablonda belirtilen metinle başlayan istemcilerin domaine sadece şablonda belirtilen gruba üye olan kullanıcılar tarafından alınmasını sağlayıp bu kullanıcıların şablonda verilen Organizsayon Birimi altında oluşturulmasını sağlar.
                    Örneğin şablon adı 'pardus-01-', yetkili grup DN'i 'cn=adminGroups,ou=User,ou=Groups,dc=liderahenk,dc=org' ve istemcilerin dahil edileceği Organizsayon Birimi ise 'ou=ANKARA,ou=Agents,dc=liderahenk,dc=org' olsun.
                    Bu kayıt şablonundan sonra istemci adı 'pardus-01-' ile başlayan tüm kullanıcılar sadece 'cn=adminGroups,ou=User,ou=Groups,dc=liderahenk,dc=org' grubunda yer alan yetkili kullanıcılar tarafından domaine alınabilir 
                    ve domaine alınan istemciler 'ou=ANKARA,ou=Agents,dc=liderahenk,dc=org' Organizsayon Birimi altında oluşturulur.
                </template>
            </Card>
        </div>
        <div class="p-field p-col-12 p-md-12">
            <Card>
                <template #title>
                    Kayıt Şablonları
                </template>
                <template #content>
                    <div class="p-fluid">
                        <div class="p-field p-fluid  p-grid">
                            <div class="p-field p-col-12 p-md-2">
                                <label>Birim Şablon Metni</label>
                                <InputText placeholder="pardus-01-" type="text" v-model="templateText"
                                    :class="validationErrors.templateText ? 'p-invalid':''"
                                />
                                <small v-if="validationErrors.templateText" class="p-error">
                                    Birim şablon metni boş bırakılamaz
                                </small>
                            </div>
                            <div class="p-field p-col-12 p-md-5">
                                <label>İstemcinin Dahil Edileceği Organizsayon Birimi</label>
                                <div class="p-inputgroup ">
                                    <InputText placeholder="ou=ANKARA,ou=Agents,dc=liderahenk,dc=org" 
                                        v-model="agentCreationDN" :class="validationErrors.agentCreationDN ? 'p-invalid':''"
                                    />
                                    <Button icon="pi pi-sitemap" class="p-button-warning" 
                                        @click="agentOuDialog = true"
                                    />
                                </div>
                                <small v-if="validationErrors.agentCreationDN" class="p-error">
                                    İstemcinin dahil edileceği Organizsayon Birimi boş bırakılamaz
                                </small>
                            </div>
                            <div class="p-field p-col-12 p-md-5">
                                <label>Yetkili Kullanıcı Grubu</label>
                                <div class="p-inputgroup">
                                    <InputText placeholder="cn=adminGroups,ou=User,ou=Groups,dc=liderahenk,dc=org" 
                                        v-model="authorizedUserGroupDN" :class="validationErrors.authorizedUserGroupDN ? 'p-invalid':''"
                                    />
                                    <Button icon="pi pi-sitemap" class="p-button-warning"
                                        @click="userGroupDialog = true"
                                    />
                                </div>
                                <small v-if="validationErrors.authorizedUserGroupDN" class="p-error">
                                    Yetkili kullanıcı grubu boş bırakılamaz
                                </small>
                            </div>
                        </div>
                        <div class="p-field p-d-flex p-jc-end">
                            <div>
                                <Button class="p-button-sm" label="Şablonu Kaydet" icon="pi pi-save"
                                    @click="saveRegistrationTemplate"    
                                />
                            </div>
                        </div>
                        <div class="p-field">
                            <DataTable :value="records" responsiveLayout="scroll"
                                v-model:filters="filters"
                                class="p-datatable-sm"
                                >
                                <template #header>
                                    <div class="p-d-flex p-jc-end">
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
                                <Column field="index" header="#" style="width:5%"></Column>
                                <Column field="unitId" header="Birim Şablon Metni" style="width:20%"></Column>
                                <Column field="parentDn" header="İstemcinin Dahil Edileceği Organizsayon Birimi" style="width:25%"></Column>
                                <Column field="authGroup" header="Yetkili Kullanıcı Grubu" style="width:25%"></Column>
                                <Column field="createDate" header="Oluşturulma Tarihi" style="width:20%"></Column>
                                <Column :exportable="false">
                                    <template #body="slotProps">
                                        <Button class="p-button-danger p-mr-2 p-button-sm p-button-rounded" 
                                            icon="pi pi-trash"  label="Delete" @click="showDeleteDialog = true; selectedRecord = slotProps.data">
                                        </Button>
                                    </template>
                                </Column>
                            </DataTable>
                        </div>
                    </div>
                </template>
            </Card>
        </div>
    </div>
    <Dialog header="Organizasyon Birimi Seç" 
        v-model:visible="agentOuDialog" 
        :style="{width: '40vw'}" :modal="true"
    >
        <tree-component 
            ref="agentTree"
            loadNodeUrl="/lider/computer/getComputers"
            loadNodeOuUrl="/lider/computer/getOuDetails"
            :treeNodeClick="node => selectedAgentOu = node"
            :searchFields="searchFields"
            :isMove="true"
        />
        <template #footer>
            <Button label="İptal" icon="pi pi-times" @click="agentOuDialog = false"
                class="p-button-text p-button-sm"
            />
            <Button label="Tamam" icon="pi pi-check" 
                @click="selectAgentOuDn" class="p-button-sm"
            />
        </template>
    </Dialog>
    <Dialog header="Yetkili Kullanıcı Grubu Seç" 
        v-model:visible="userGroupDialog" 
        :style="{width: '40vw'}" :modal="true"
    >
        <tree-component 
            ref="userGroupTree"
            loadNodeUrl="/lider/user_groups/getGroups"
            loadNodeOuUrl="/lider/user_groups/getOuDetails"
            :treeNodeClick="node => selectedUserGroup = node"
            :searchFields="searchGroupFields"
        />
        <template #footer>
            <Button label="İptal" icon="pi pi-times" @click="userGroupDialog = false"
                class="p-button-text p-button-sm"
            />
            <Button label="Tamam" icon="pi pi-check" 
                @click="selectUserGroupDn" class="p-button-sm"
            />
        </template>
    </Dialog>
    <!-- Delete Template Dialog -->
        <Dialog header="Şablon Sil" v-model:visible="showDeleteDialog" 
            :style="{width: '20vw'}" :modal="true">
            <div class="p-fluid">
                <i class="pi pi-info-circle p-mr-3" style="font-size: 1.5rem" />
                <span>
                    Şablon silinecektir, emin misiniz?
                </span>
            </div>
            <template #footer>
                <Button label="İptal" icon="pi pi-times" 
                    @click="showDeleteDialog = false" class="p-button-text p-button-sm"
                />
                <Button label="Evet" icon="pi pi-check"
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
import axios from "axios";

export default {
    
    data() {
        return {
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
            records: [],
            templateText: "",
            authorizedUserGroupDN: "",
            agentCreationDN: "",
            selectedAgentOu: null,
            selectedUserGroup: null,
            selectedRecord: null,
            filters: {
                'global': {value: null, matchMode: FilterMatchMode.STARTS_WITH},
            },
            agentOuDialog: false,
            userGroupDialog: false,
            showDeleteDialog: false
        }
    },

    mounted() {
        axios.post("/lider/registration_template/list", null).then((response) => {
            if (response.data) {
                this.records = response.data;
                this.updateRowIndex();
            }
        })
        .catch((error) => { 
            this.$toast.add({
                severity:'error', 
                detail: "Kayıt şablonları getirilirken hata oluştu"+ " \n"+error, 
                summary:this.$t("computer.task.toast_summary"), 
                life: 3000
            })
        });
    },

    methods: {
        selectAgentOuDn() {
            if (!this.selectedAgentOu) {
                this.$toast.add({
                    severity:'warn', 
                    detail: "Lütfen klasör seçiniz", 
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
                    detail: "Lütfen yetkili kullanıcı grubu seçiniz", 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
                return;
            }
            this.authorizedUserGroupDN = this.selectedUserGroup.distinguishedName;
            this.selectedUserGroup = null;
            this.userGroupDialog = false;
        },


        saveRegistrationTemplate() {
            if (!this.validateForm()) {
                return;
            }
            let params = new FormData();
            params.append("templateText", this.templateText);
            params.append("authorizedUserGroupDN", this.authorizedUserGroupDN);
            params.append("agentCreationDN", this.agentCreationDN);
            axios.post("/lider/registration_template/create", params).then((response) => {
                if (response.data) {
                    this.templateText = "";
                    this.authorizedUserGroupDN = "";
                    this.agentCreationDN = "";
                    this.records.push(response.data);
                    this.$toast.add({
                        severity:'success', 
                        detail: "Şablon başarıyla kaydedildi", 
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000
                    });
                    this.updateRowIndex();
                }
            })
            .catch((error) => { 
                this.$toast.add({
                    severity:'error', 
                    detail: "Şablon kaydedilirken hata oluştu"+ " \n"+error, 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                })
            });
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

        deleteRecord() {
            let params = new FormData();
            params.append("id", this.selectedRecord.id);
            axios.post("/lider/registration_template/delete", params).then((response) => {
                if (response.data) {
                    this.$toast.add({
                        severity:'success', 
                        detail: "Kayıt başarıyla silindi", 
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000
                    });
                    this.records = this.records.filter(template => template.id != this.selectedRecord.id);
                    this.updateRowIndex();
                    this.selectedRecord = null;
                    this.showDeleteDialog = false;
                }
            })
            .catch((error) => { 
                this.$toast.add({
                    severity:'error', 
                    detail: "Kayıt silinirken hata oluştu"+ " \n"+error, 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
            });
        },

        updateRowIndex() {
            for (let index = 0; index < this.records.length; index++) {
                const element = this.records[index];
                element.index = index + 1;
            }
        }
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
