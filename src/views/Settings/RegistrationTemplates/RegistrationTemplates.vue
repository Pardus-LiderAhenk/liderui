<template>
    <Card>
        <template #title>
            Kayıt Şablonları
        </template>
        <template #content>
            Şablonda belirtilen metinle başlayan istemcilerin domaine sadece şablonda belirtilen gruba üye olan kullanıcılar tarafından alınmasını sağlayıp bu kullanıcıların şablonda verilen grup altında oluşturulmasını sağlar.
            Örneğin şablon adı 'pardus-01-', yetkili grup DN'i ya da kullanıcı DN'i 'ou=Teknik,ou=Ankara,ou=People,dc=liderahenk,dc=org' ve istemcilerin dahil edileceği grup ise 'ou=Yöneticiler,ou=Çankaya,ou=Ankara,ou=People,dc=liderahenk,dc=org' olsun.
            Bu kayıt şablonundan sonra istemci adı 'pardus-01-' ile başlayan tüm kullanıcılar sadece 'ou=Teknik,ou=Ankara,ou=People,dc=liderahenk,dc=org' grubunda yer alan yetkili kullanıcılar tarafından domaine alınabilir(yetkili gruba sadece bir kullanıcı DN'i de eklenebilir) 
            ve domaine alınan istemciler 'ou=Yöneticiler,ou=Çankaya,ou=Ankara,ou=People,dc=liderahenk,dc=org' grubu altında oluşturulur.
        </template>
    </Card>
    <Card>
        <template #title>
            KAYIT ŞABLONLARI
        </template>
        <template #content>

            <Card>
                <template #content>
                     <div class="p-fluid p-formgrid p-grid">
                        <div class="p-field p-col-12 p-md-2">
                            <label for="firstname6">Birim Şablon Metni</label>
                            <InputText id="firstname6" type="text" />
                        </div>
                        <div class="p-field p-col-12 p-md-5">
                            <label for="firstname6">İstemcinin Dahil Edileceği Klasör</label>
                            <div class="p-inputgroup ">
                                <InputText placeholder="Keyword"/>
                                <Button icon="pi pi-sitemap" class="p-button-warning" @click="agentGroupDialog = true"/>
                            </div>
                        </div>
                        <div class="p-field p-col-12 p-md-5">
                            <label for="firstname6">Yetkili Kullanıcı Grubu</label>
                            <div class="p-inputgroup">
                                <InputText placeholder="Keyword"/>
                                <Button icon="pi pi-sitemap" class="p-button-warning" @click="selectUserGroupDialog=true"/>
                            </div>
                        </div>
                         <div class="p-col-12 p-grid p-jc-end" >
                             <div class="p-col-2">
                                <Button label="Şablonu Kaydet" />
                             </div>
                         </div>
                     </div>
                </template>
            </Card>

            <DataTable :value="records" responsiveLayout="scroll"
                    v-model:filters="filters"
                     :globalFilterFields="['unitId','parentDn','authGroup', 'createDate']"
                      dataKey="id"
                      filterDisplay="row" 
                      showGridlines
                    >
                    <template #header>
                        <div class="p-d-flex p-ac-end" style="justify-content:flex-end">
                            <span class="p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global'].value" placeholder="Ara" />
                            </span>
                        </div>
                    </template>
                         <Column field="unitId" header="Birim Şablon Metni"></Column>
                         <Column field="parentDn" header="İstemcinin Dahil Edileceği Klasör"></Column>
                          <Column field="authGroup" header="Yetkili Kullanıcı Grubu"></Column>
                          <Column field="createDate" header="Oluşturulma Tarihi"></Column>
                          <Column :exportable="false" style="min-width:8rem">
                                <template #body="slotProps">
                                    <Button class="p-button-danger" label="Delete" @click="deleteRecord(slotProps.data)"></Button>
                                </template>
                            </Column>
                    </DataTable>


        </template>
    </Card>
    <Dialog header="Ahenk'in oluşturulmasını istediğiniz grubu seçiniz." v-model:visible="agentGroupDialog" :style="{width: '50vw'}" :modal="true">
        <tree-component 
            ref="istemcitree"
            loadNodeUrl="/lider/registration_template/getComputers"
            loadNodeOuUrl="/lider/registration_template/getOuDetails"
        />
        <template #footer>
            <Button label="Kapat" icon="pi pi-times" @click="agentGroupDialog = false" class="p-button-text"/>
            <Button label="Oluştur" icon="pi pi-check" @click="createAgentGroup" autofocus />
        </template>
    </Dialog>
    <Dialog header="Kullanıcı Grubu Seç" v-model:visible="selectUserGroupDialog" :style="{width: '50vw'}" :modal="true">
        <tree-component 
            ref="istemcitree"
            loadNodeUrl="/lider/registration_template/getGroups"
            loadNodeOuUrl="/lider/registration_template/getOuDetails"
        />
        <template #footer>
            <Button label="Kapat" icon="pi pi-times" @click="selectUserGroupDialog = false" class="p-button-text"/>
            <Button label="Oluştur" icon="pi pi-check" @click="createAgentGroup" autofocus />
        </template>
    </Dialog>
</template>

<script>
import {FilterMatchMode} from 'primevue/api';
import TreeComponent from '@/components/Tree/TreeComponent.vue';

export default {
    components: {
        TreeComponent,
    },
    data() {
        return {
            records: [
                {
                    id: 1,
                    unitId: 'Deneme',
                    parentDn: 'ou=Agents,dc=liderahenk,dc=org',
                    authGroup: 'cn=adminGroups,ou=User,ou=Groups,dc=liderahenk,dc=org',
                    createDate: '01.01.2021 12:10:09',
                }
            ],
            filters: {
                'global': {value: null, matchMode: FilterMatchMode.STARTS_WITH},
            },
            agentGroupDialog: false,
            selectUserGroupDialog: false
        }
    },
    methods: {
        deleteRecord(data) {

        },
    }
}
</script>
