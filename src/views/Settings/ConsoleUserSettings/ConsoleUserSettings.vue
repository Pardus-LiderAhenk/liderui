<template>
    <div class="p-grid">
        <div class="p-col-12">
            <h5>ARAYÜZ KULLANICILARI VE ERİŞİM AYARLARI</h5>
        </div>
        <div class="p-col-12">
            <TabView>
                <TabPanel header="Arayüz Kullanıcı Yönetimi">
                    <div class="p-grid">
                        <div class="p-col-6">
                            <div class="p-col-12">
                                <h5>Mevcut Konsol Kullanıcıları</h5>
                            </div>
                            <div class="p-col-12 p-d-flex p-jc-end ">
                                <Button label="Konsol Kullanıcısı Ekle" class="p-mr-2" @click="addConsoleUserModalVisible = true"/>
                                <Button  label="Kullanıcının Konsol Yetkisini Sil" @click="showDeleteConsoleUserDialog = true"/>
                            </div>
                            <div class="p-col-12">
                                <DataTable :value="records" responsiveLayout="scroll"
                                    v-model:filters="filters"
                                    v-model:selection="selectedUser"
                                    selectionMode="single"
                                    >
                                    
                                        
                                    <Column header="#">
                                         <template #body="slotProps">
                                            <p>{{slotProps.index + 1}}</p>
                                        </template>
                                    </Column>
                                    <Column field="uid" header="UID"></Column>
                                    <Column field="distinguishedName" header="Kayıt DN"></Column>
                                   
                                
                                </DataTable>
                            </div>
                        </div>
                        <div class="p-col-6" v-if="selectedUser">
                            <div class="p-col-12 ">
                                <p style="font-weight:bold">Seçili Kullanıcı Rolleri (Kayıt DN: {{selectedUser ? selectedUser.distinguishedName: 'Lütfen Seçiniz'}})</p>
                            </div>
                            <div class="p-col-12 p-d-flex p-jc-end">
                                <Button label="Değişiklikleri Kaydet" @click="showUpdateConsoleUserRolesDialog=true"/>
                            </div>
                            <DataTable :value="roles" responsiveLayout="scroll" 
                                >
                                <Column header="#">
                                        <template #body="slotProps">
                                        <p>{{slotProps.index + 1}}</p>
                                    </template>
                                </Column>
                                <Column field="name" header="Rol Adı"></Column>
                                 <Column :exportable="false" style="min-width:8rem">
                                    <template #body="slotProps">
                                    <InputSwitch 
                                        :modelValue="selectedUser ? (selectedUser.attributesMultiValues.liderPrivilege.includes(slotProps.data.value) ? true : false) : false"  
                                        @change="roleSwitchChanged(slotProps.data)"/>
                                    </template>
                                 </Column>
                            </DataTable>
                        </div>
                        <div class="p-col-6 p-d-flex" v-if="selectedUser === null">
                            <p style="width:100%;text-align:center;" class="p-as-center p-ai-center p-ac-center">Lütfen Yetkilerini düzenlemek istediğiniz kullanıcıyı seçiniz.</p>
                        </div>
                    </div>
                </TabPanel>
                <TabPanel header="Arayüz Kullanıcısı Dizin Erişim Ayarları">
                    <div class="p-grid">
                        <div class="p-col-3">
                            <tree-component 
                                ref="groupstree"
                                loadNodeUrl="/lider/user_groups/getGroups"
                                loadNodeOuUrl="/lider/user_groups/getOuDetails"
                                :treeNodeClick="setSelectedGroupNode"
                                :searchFields="searchFields"
                            />
                        </div>
                        <div class="p-col-3">
                            <div class="p-col-12">
                                <p>Grup Üyeleri</p>
                            </div>
                            <DataTable :value="groupMembers" responsiveLayout="scroll" 
                                >
                                <Column header="#">
                                        <template #body="slotProps">
                                        <p>{{slotProps.index + 1}}</p>
                                    </template>
                                </Column>
                                <Column field="uid" header="Üye DN"></Column>
                            </DataTable>
                        </div>
                        <div class="p-col-6">
                            <div class="p-col-12 p-d-flex p-jc-end">
                                <Button type="button" label="Yeni Yetki Grubu Ekle" icon="pi pi-angle-down" iconPos="right" @click="toggle" />
                                <Menu ref="menu" :model="privilegeActions" :popup="true" />
                            </div>
                            <DataTable :value="groupPrivilages" responsiveLayout="scroll" 
                                >
                                <Column header="#">
                                        <template #body="slotProps">
                                        <p>{{slotProps.index + 1}}</p>
                                    </template>
                                </Column>
                                <Column field="accessDN" header="Erişim Yetkisi Verilen DN"></Column>
                                <Column header="Yetki">
                                    <template #body="slotProps">
                                        {{
                                                slotProps.data != null && slotProps.data.accessType == "write" ? "Okuma ve Yazma" : "Okuma"
                                        }}
                                    </template>
                                </Column>
                                <Column :exportable="false" style="min-width:8rem">
                                    <template #body="slotProps">
                                    <Button icon="pi pi-times" class="p-button-rounded p-button-danger p-button-outlined"  @click="deleteOlcAccessRule(slotProps.data)"/>
                                    </template>
                                 </Column>
                            </DataTable>
                        </div>
                    </div>
                </TabPanel>
            </TabView>
        </div>
    </div>

    <agents-dialog 
        :modalVisibleValue="agentsModalVisible" 
        @modalVisibleValue="agentsModalVisible = $event;"
        @addOlcAccessRule="addOlcAccessRule"
     />

     <agent-group-dialog 
     :modalVisibleValue="agentGroupModalVisible" 
        @modalVisibleValue="agentGroupModalVisible = $event;"
        @addOlcAccessRule="addOlcAccessRule"
     />
     <user-dialog 
     :modalVisibleValue="userModalVisible" 
        @modalVisibleValue="userModalVisible = $event;"
        @addOlcAccessRule="addOlcAccessRule"
     />
     <user-group-dialog 
     :modalVisibleValue="userGroupModalVisible" 
        @modalVisibleValue="userGroupModalVisible = $event;"
        @addOlcAccessRule="addOlcAccessRule"
     />
     <role-dialog 
     :modalVisibleValue="roleGroupModalVisible" 
        @modalVisibleValue="roleGroupModalVisible = $event;"
        @addOlcAccessRule="addOlcAccessRule"
     />
     <add-console-user-dialog 
        @updateConsoleUsers="getConsoleUsers"
        :modalVisibleValue="addConsoleUserModalVisible" 
        @modalVisibleValue="addConsoleUserModalVisible = $event;"
     />

    
    <LiderConfirmDialog 
        :showDialog="showDeleteConsoleUserDialog"
        @showDialog="showDeleteConsoleUserDialog = $event;"
        header="Konsol Kullanıcısı Yetki Silme"
        message="Konsol kullanıcısı yetkileri silinecektir. Devam etmek istiyor musunuz ?"
        @accepted="deleteConsoleUser"
    />


    <LiderConfirmDialog 
        :showDialog="showUpdateConsoleUserRolesDialog"
        @showDialog="showUpdateConsoleUserRolesDialog = $event;"
        header="Yetki Güncelleme"
        message="Konsol kullanıcısı yetkileri güncellenecektir. Devam etmek istiyor musunuz ?"
        @accepted="updateUserRoles"
    />
  

  
</template>

<script>
import TreeComponent from '@/components/Tree/TreeComponent.vue';
import AgentsDialog from './Dialogs/AgentsDialog.vue';
import AgentGroupDialog from './Dialogs/AgentGroupsDialog.vue';
import UserDialog from './Dialogs/UsersDialog.vue';
import UserGroupDialog from './Dialogs/UserGroupsDialog.vue';
import RoleDialog from './Dialogs/RoleGroupsDialog.vue';
import AddConsoleUserDialog from './Dialogs/AddConsoleUserDialog.vue';
import axios from 'axios';

export default {
    components: {
        TreeComponent,
        AgentsDialog,
        AgentGroupDialog,
        UserDialog,
        UserGroupDialog,
        RoleDialog,
        AddConsoleUserDialog,
    },
    data(){
        return {
            selectedUser: null,
            records: [
                {}
            ],
            roles: [],
            groupMembers: [],
            groupPrivilages: [],
            privilegeActions: [
                {
					label: 'İstemciler',
					icon: 'pi pi-refresh',
					command: () => {
						this.agentsModalVisible = true;
					}
				},
                 {
					label: 'Kullanıcılar',
					icon: 'pi pi-refresh',
					command: () => {
						this.userModalVisible = true;
					}
				},
                {
					label: 'İstemci Grupları',
					icon: 'pi pi-refresh',
					command: () => {
						this.agentGroupModalVisible = true;
					}
				},
                {
					label: 'Kullanıcı Grupları',
					icon: 'pi pi-refresh',
					command: () => {
						this.userGroupModalVisible = true;
					}
				},
                {
					label: 'Rol Kullanıcıları',
					icon: 'pi pi-refresh',
					command: () => {
						this.roleGroupModalVisible = true;
					}
				},
            ],
            agentsModalVisible: false,
            agentGroupModalVisible: false,
            userModalVisible:false,
            userGroupModalVisible:false,
            roleGroupModalVisible:false,
            addConsoleUserModalVisible:false,
            showDeleteConsoleUserDialog:false,
            showUpdateConsoleUserRolesDialog: false,
            selectedGroupNode:null,
            searchFields: [
                {
                    key: this.$t('tree.name'),
                    value: "cn"
                },
                {
                    key: this.$t('tree.folder'),
                    value: "ou"
                },
            ],

        }
    },
    methods: {
        toggle(event) {
            this.$refs.menu.toggle(event);
        },
        getRoles(){
            axios.get('/lider/settings/getRoles').then(response => {
                this.roles = response.data;
            });
        },
        getConsoleUsers(){
            axios.get('/lider/settings/getConsoleUsers').then(response => {
                this.records = response.data;
            });
        },
        updateUserRoles() {
            this.showUpdateConsoleUserRolesDialog = false;
            if(this.selectedUser) {
                var data = new FormData();
                data.append('dn', this.selectedUser.distinguishedName);
                data.append('roles[]', this.selectedUser.attributesMultiValues.liderPrivilege);
                
                axios.post('/lider/settings/editUserRoles', data).then(response => {
                     if(response.status === 200) {
                         this.$toast.add({
                            severity:'success', 
                            detail: 'Kullanıcı rolleri başarı ile güncellendi', 
                            summary: 'Başarılı', 
                            life: 3000
                        });
                        // FIXME 
                        this.getConsoleUsers();
                     } else {
                          this.$toast.add({
                            severity:'error', 
                            detail: 'Yetki kaldırılırken beklenmedik bir hata oluştu.', 
                            summary: 'HATA', 
                            life: 3000
                        });
                     }
                });
            }
        },
        roleSwitchChanged(data) {
            if (this.selectedUser) {
                if (this.selectedUser.attributesMultiValues.liderPrivilege.includes(data.value)) {
                    this.selectedUser.attributesMultiValues.liderPrivilege = this.selectedUser.attributesMultiValues.liderPrivilege.filter(val => val != data.value);
                } else {
                    this.selectedUser.attributesMultiValues.liderPrivilege.push(data.value);
                }
            }
        },
        deleteConsoleUser() {
            if (this.selectedUser) {
                let data = new FormData();
                data.append('dn',this.selectedUser.distinguishedName);
                axios.post('/lider/settings/deleteConsoleUser', data).then(response => {
                    console.log('Kullanıcı silindi', response);
                    this.getConsoleUsers();
                    this.$toast.add({
                        severity:'success', 
                        detail: 'Kullanıcı rolleri başarı ile silindi.', 
                        summary: 'Başarılı', 
                        life: 3000
                    });
                });
            } else {
                this.$toast.add({
                    severity:'error', 
                    detail: 'Lütfen yetkisini silmek istediğiniz kullanıcıyı seçiniz.', 
                    summary: 'Kullanıcı Seçilmemiş', 
                    life: 3000
                });
            }


            this.showDeleteConsoleUserDialog = false;
        }, 
        setSelectedGroupNode(node) {
            this.groupMembers = [];
            this.selectedGroupNode = node;
            node.attributesMultiValues.member.forEach((mem,index) => {
                this.groupMembers.push({
                    id : index + 1,
                    uid : mem
                })
            });
            this.getOlcAccessRules();
        },
        deleteOlcAccessRule(rule) {
            let rules = this.groupPrivilages.filter(p => p.accessDN === rule.accessDN);

            if(rules && rules.length > 0) {
                axios.post('/lider/settings/deleteOLCAccessRule', rules[0]).then(response => {
                    if(response.status === 200) {
                        this.$toast.add({
                            severity:'success', 
                            detail: 'Rol başarı ile kaldırıldı.', 
                            summary: 'Başarılı', 
                            life: 3000
                        });

                        this.getOlcAccessRules();
                    }
                });
            }
        }, 
        addOlcAccessRule(olcAccessDn, accessType) {
            let data = new FormData();
            data.append('type', 'computers');
            data.append('groupDN', this.selectedGroupNode.distinguishedName);
            data.append('olcAccessDN', olcAccessDn, );
            data.append('accessType',accessType);

            axios.post('/lider/settings/addOLCAccessRule', data).then(response => {
                if (response.status === 200) {
                    if(response.data) {
                        this.$toast.add({
                            severity:'success', 
                            detail: 'Erişim Yetkisi Başarı İle Eklendi', 
                            summary: 'BAŞARILI', 
                            life: 3000
                        });
                        this.getOlcAccessRules();
                    } else {
                        this.$toast.add({
                            severity:'error', 
                            detail: 'Erişim Yetkisi Eklenirken Hata Oluştu.', 
                            summary: 'HATA', 
                            life: 3000
                        });
                    }
                }
            });

        },
        getOlcAccessRules() {
            if(this.selectedGroupNode) {
                let data = new FormData();
                data.append('dn',this.selectedGroupNode.distinguishedName);
                axios.post('/lider/settings/getOLCAccessRules', data ).then(response => {
                    this.groupPrivilages = response.data;
                });
            }
        }
    },
    mounted() {
        this.getRoles();
        this.getConsoleUsers();
    }
}
</script>
