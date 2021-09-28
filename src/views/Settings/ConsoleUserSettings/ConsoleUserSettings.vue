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
                                <Button label="Konsol Kullanıcısı Ekle" class="p-mr-2"/>
                                <Button  label="Kullanıcının Konsol Yetkisini Sil" />
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
                                    <template #body="slotProps">
                                        <Button class="p-mr-2" label="Düzenle" @click="editProduct(slotProps.data)"></Button>
                                        <Button class="p-button-danger" label="Sil"></Button>
                                    </template>
                                
                                </DataTable>
                            </div>
                        </div>
                        <div class="p-col-6" v-if="selectedUser">
                            <div class="p-col-12 ">
                                <p style="font-weight:bold">Seçili Kullanıcı Rolleri (Kayıt DN: {{selectedUser ? selectedUser.distinguishedName: 'Lütfen Seçiniz'}})</p>
                            </div>
                            <div class="p-col-12 p-d-flex p-jc-end">
                                <Button label="Değişiklikleri Kaydet" />
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
                                    <InputSwitch  @change="deneme(slotProps.data)"/>
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
                                <Column field="uid" header="Üye DN"></Column>
                                <Column field="privilege" header="Yetki"></Column>
                                <Column :exportable="false" style="min-width:8rem">
                                    <template #body="slotProps">
                                    <InputSwitch  @change="deneme(slotProps.data)"/>
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
     />

     <agent-group-dialog 
     :modalVisibleValue="agentGroupModalVisible" 
        @modalVisibleValue="agentGroupModalVisible = $event;"
     />
     <user-dialog 
     :modalVisibleValue="userModalVisible" 
        @modalVisibleValue="userModalVisible = $event;"
     />
     <user-group-dialog 
     :modalVisibleValue="userGroupModalVisible" 
        @modalVisibleValue="userGroupModalVisible = $event;"
     />
     <role-dialog 
     :modalVisibleValue="roleGroupModalVisible" 
        @modalVisibleValue="roleGroupModalVisible = $event;"
     />
</template>

<script>
import TreeComponent from '@/components/Tree/TreeComponent.vue';
import AgentsDialog from './Dialogs/AgentsDialog.vue';
import AgentGroupDialog from './Dialogs/AgentGroupsDialog.vue';
import UserDialog from './Dialogs/UsersDialog.vue';
import UserGroupDialog from './Dialogs/UserGroupsDialog.vue';
import RoleDialog from './Dialogs/RoleGroupsDialog.vue';

export default {
    components: {
        TreeComponent,
        AgentsDialog,
        AgentGroupDialog,
        UserDialog,
        UserGroupDialog,
        RoleDialog
    },
    data(){
        return {
            selectedUser: null,
            records: [
                {id:1, uid: 'lider', distinguishedName: 'cn=lider,ou=Users,dc=liderahenk,dc=org'}
            ],
            roles: [
                {id: 921, name: "Konsol Yetkisi(Konsol Erişim Yetkisi)", value: "ROLE_USER", orderNumber: 0, value:'ROLE_USER'},
                {id: 922, name: "İstemci Yönetimi", value: "ROLE_COMPUTERS", orderNumber: 10, value:'ROLE_COMPUTERS'},
                {id: 923, name: "Kullanıcı İşlemleri", value: "ROLE_USERS", orderNumber: 20, value:'ROLE_AD_SYNC'}
            ],
            groupMembers: [
                {
                    id:1,
                    uid:'cn=admin,dc=liderahenk,dc=org'
                },
                {
                    id:2,
                    uid:'cn=lider,ou=Users,dc=liderahenk,dc=org'
                }
            ],
            groupPrivilages: [
                {uid:'ou=Agent,ou=Groups,dc=liderahenk,dc=org', privilege:'Yazma'},
                {uid:'ou=Users,dc=liderahenk,dc=org', privilege:'Okuma ve Yazma'}
            ],
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

        }
    },
    methods: {
        toggle(event) {
            this.$refs.menu.toggle(event);
        }
    }
}
</script>
