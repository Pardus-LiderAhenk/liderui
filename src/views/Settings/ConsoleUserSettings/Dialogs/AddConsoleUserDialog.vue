<template>
    <Dialog header="Konsol Kullanıcısı Ekle" v-model:visible="modalVisible" style="width:85vw;" position="top">
        <TabView>
            <TabPanel header="Yeni Arayüz Kullanıcısı Oluştur">
                <div class="p-grid">
                    <div class="p-col-6">
                        <div class="p-fluid p-formgrid p-grid">
                            <div class="p-field p-col-12">
                                <label for="uid">Kimlik (ID) *</label>
                                <InputText id="uid" type="text" v-model="userForm.uid"/>
                            </div>
                            <div class="p-field p-col-12">
                                <label for="cn">Kullanıcı Adı *</label>
                                <InputText id="cn" type="text" v-model="userForm.cn"/>
                            </div>
                            <div class="p-field p-col-12">
                                <label for="sn">Kullanıcı Soyadı *</label>
                                <InputText id="sn" type="text" v-model="userForm.sn"/>
                            </div>
                            <div class="p-field p-col-12">
                                <label for="mail">Mail Adresi *</label>
                                <InputText id="mail" type="text" v-model="userForm.mail"/>
                            </div>
                            <div class="p-field p-col-12">
                                <label for="telephoneNumber">Telefon *</label>
                                <InputText id="telephoneNumber" type="text" v-model="userForm.telephoneNumber"/>
                            </div>
                            <div class="p-field p-col-12">
                                <label for="homePostalAddress">Adres</label>
                                <InputText id="homePostalAddress" type="text" v-model="userForm.homePostalAddress"/>
                            </div>
                        </div>
                    </div>
                    <div class="p-col-6">
                        <password-component ref="userForm.userPassword"></password-component>
                    </div>
                    <div class="p-col-12 p-d-flex p-jc-end">
                        <Button label="Oluştur" @click="addNewConsoleUser"></Button>
                    </div>
                </div>
            </TabPanel>
            <TabPanel header="Mevcut Kullanıcılara Erişim Yetkisi Ver">
                <Toolbar>
                    <template #end>
                        <Button label="Kullanıcıya Arayüz Kullanıcısı Yetkisi Ver" icon="pi pi-check" @click="addAsConsoleUser" autofocus :disabled="(selectedUserNode != null && selectedUserNode.attributesMultiValues !=null && selectedUserNode.attributesMultiValues.liderPrivilege != null && selectedUserNode.attributesMultiValues.liderPrivilege.includes('ROLE_USER')) ? true : false"/>
                    </template>
                </Toolbar>
                <tree-component 
                    ref="agentsTree"
                    loadNodeUrl="/lider/user/getUsers"
                    loadNodeOuUrl="/lider/user/getOuDetails"
                    :treeNodeClick="setSelectedUserNode"
                    :searchFields="searchFields"
                />
                
            </TabPanel>
            <TabPanel header="Dizin Erişim Yetkisi Ver">
                 <div class="p-grid" v-if="selectedUserNode != null">
                    <div class="p-col-3">
                        <tree-component 
                            ref="groupstree"
                            loadNodeUrl="/lider/user_groups/getGroups"
                            loadNodeOuUrl="/lider/user_groups/getOuDetails"
                            :treeNodeClick="setSelectedGroupNode"
                            :searchFields="searchFieldsFolder"
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
                            <Button type="button" label="Gruba Ekle"  iconPos="right" @click="addUserToGroup" />
                            
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
                        </DataTable>
                    </div>
                </div>
                <div v-if="selectedUserNode == null">
                    <p>Lütfen, bir önceki tab'dan erişim yetkisi vermek istediğiniz kullanıcıyı seçiniz.</p>
                </div>
            </TabPanel>
        </TabView>
        <template #footer>
            <Button label="Kapat" icon="pi pi-times" @click="modalVisible = false" class="p-button-text"/>
            
        </template>
    </Dialog>

</template>


<script>
import TreeComponent from '@/components/Tree/TreeComponent.vue';
import axios from 'axios';
import PasswordComponent from '@/components/Password/PasswordComponent.vue';

export default {
    components:{
        TreeComponent,
        PasswordComponent
    },
    props: ['modalVisibleValue'],
    emits:['updateConsoleUsers'],
    data(){
        return {
            selectedUserNode:null,
            searchFields: [
                {
                    key: this.$t('tree.cn'),
                    value: "cn"
                },
                {
                    key: this.$t('tree.uid'),
                    value: "uid"
                },
                {
                    key: this.$t('tree.folder'),
                    value: "ou"
                },
                {
                    key: this.$t('tree.last_session'),
                    value: "o"
                }
            ],
            userForm: {
                uid:'',
                cn:'',
                sn:'',
                telephoneNumber:'',
                homePostalAddress:'',
                mail:'',
                userPassword: '',
                userPasswordConfirm:null,
            },
            searchFieldsFolder: [
                {
                    key: this.$t('tree.name'),
                    value: "cn"
                },
                {
                    key: this.$t('tree.folder'),
                    value: "ou"
                },
            ],
            groupMembers: [],
            selectedGroupNode: null,
            groupPrivilages: [],
        }
    },
    computed: {
        modalVisible: {
            get() {
                return this.modalVisibleValue;
            },
            set() {
                this.$emit('modalVisibleValue', false);
            }
        },
    },
    methods:{
        addAsConsoleUser(){
            if (this.selectedUserNode) {
                let data = new FormData();
                console.log('Selected user node', this.selectedUserNode);
                data.append('dn', this.selectedUserNode.distinguishedName);
                data.append('roles[]', ['ROLE_USER']);
                axios.post('/lider/settings/editUserRoles',data).then(response => {
                    this.$toast.add({
                        severity:'success', 
                        detail: 'Kullanıcıya yetki başarı ile verildi.', 
                        summary: 'Başarılı', 
                        life: 3000
                    });
                    this.$emit('updateConsoleUsers');
                });
            } else {
                this.$toast.add({
                    severity:'error', 
                    detail: 'Lütfen yetki verilmesini istediğini kullanıcıyı seçiniz.', 
                    summary: 'Kullanıcı Seçilmedi', 
                    life: 3000
                });
        }
        },
        setSelectedUserNode(node) {
            this.selectedUserNode = node;
        },
        addNewConsoleUser(){
            let data = new FormData();
            data.append('uid', this.userForm.uid);
            data.append('cn',this.userForm.cn);
            data.append('sn',this.userForm.sn);
            data.append('userPassword', this.userForm.userPassword);
            data.append('telephoneNumber', this.userForm.telephoneNumber);
            data.append('homePostalAddress', this.userForm.homePostalAddress);
            data.append('mail', this.mail);

            axios.post('/lider/user/addUser', data).then(response => {
                if(response.status == 200) {
                    this.$toast.add({
                        severity:'success', 
                        detail: 'Kullanıcı başarı ile oluşturuldu.', 
                        summary: 'Başarılı', 
                        life: 3000
                    });

                    this.userForm = {
                        cn : null,
                        uid: null,
                        sn : null,
                        userPassword : null,
                        telephoneNumber : null,
                        homePostalAddress : null,
                        mail : null,
                    }
                } else {
                    this.$toast.add({
                        severity:'error', 
                        detail: 'Beklenmedik bir problem ile karşılaşıldı. ', 
                        summary: 'HATA', 
                        life: 3000
                    });

                }
            }); 
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

            let data = new FormData();
            data.append('dn',node.distinguishedName);
            axios.post('/lider/settings/getOLCAccessRules', data ).then(response => {
                this.groupPrivilages = response.data;
            });
            
        },
        addUserToGroup() {

            if (this.selectedUserNode == null || this.selectedGroupNode == null) {
                this.$toast.add({
                    severity:'error', 
                    detail: 'Lütfen kullanıcı ve grup seçiniz.', 
                    summary: 'HATA',
                    life: 3000
                });
                return;
            }


            let data = new FormData();
            data.append('distinguishedName',this.selectedUserNode.distinguishedName);
            data.append('parentName',this.selectedGroupNode.distinguishedName);
            axios.post('/lider/settings/addMemberToGroup', data).then(response => {
                if (response.status === 200) {
                    this.$toast.add({
                        severity:'success', 
                        detail: 'Kullanıcı gruba başarı ile eklendi.', 
                        summary: 'BAŞARILI',
                        life: 3000
                    });

                    this.groupMembers = [];
                    this.groupPrivilages = [];
                    this.selectedGroupNode = null;
                    this.selectedUserNode = null;
                    this.modalVisible = false;
                }
            });

            
        }
    }
}
</script>
