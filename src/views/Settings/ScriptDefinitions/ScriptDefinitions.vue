<template>
    <div class="p-grid">
        <div class="p-col-12">
            <Card>
                <template #title>
                    Betik Tanımlama
                </template>
                <template #content>
                    Tanımlamak istenilen betikler Betik Adı, Betik Türü ve Betik İçeriği girilerek kaydedilir. Pardus için betik türü olarak Bash, Python, Perl ve Ruby seçenekleri ile Windows istemciler için PowerShell seçeneği mevcuttur. Kayıtlı betikler listelenir ve Ekle, Sil, Düzenle işlemleri yapılır.
                </template>
            </Card>
        </div>
        <div class="p-col-12">
            <Card>
                <template #title>
                    <div class="p-d-flex p-jc-between">
                        <p>Betik Listesi</p>
                        <Button label="Yeni Ekle" @click="showTemplateDialog = true"></Button>
                    </div>
                    
                </template>
                <template #content>
                    <DataTable :value="records" responsiveLayout="scroll"
                    v-model:filters="filters"
                     :globalFilterFields="['name',]"
                      dataKey="id"
                      filterDisplay="row" 
                      showGridlines
                    >
                        <!-- <Column field="name" header="Adı" style="min-width:12rem">
                            <template #body="{data}">
                                {{data.name}}
                            </template>
                            <template #filter="{filterModel,filterCallback}">
                                <InputText type="text" v-model="filterModel.name" @keydown.enter="filterCallback()" class="p-column-filter" :placeholder="`Search by name - `" v-tooltip.top.focus="'Hit enter key to filter'"/>
                            </template>
                        </Column> -->
                         <Column field="name" header="Adı" style="min-width:12rem">
                            <template #body="{data}">
                                {{data.name}}
                            </template>
                            <template #filter="{filterModel}">
                                <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Adına göre ara"/>
                            </template>
                        </Column>
                        <Column field="type" header="Türü"></Column>
                         <Column field="createDate" header="Oluşturulma Tarihi"></Column>
                          <Column field="modifiyDate" header="Düzenleme Tarihi"></Column>
                          <Column :exportable="false" style="min-width:8rem">
                                <template #body="slotProps">
                                    <Button class="p-mr-2" label="Düzenle" @click="editProduct(slotProps.data)"></Button>
                                    <Button class="p-button-danger" label="Sil"></Button>
                                </template>
                            </Column>
                    </DataTable>
                </template>
            </Card>
        </div>



        <Dialog header="Yeni Betik Oluştur" v-model:visible="showTemplateDialog" >
            <div class="p-fluid p-formgrid p-grid">
                <div class="p-field p-col-12 p-md-8">
                    <label for="lastname6">Betik Adı</label>
                    <InputText id="lastname6" type="text" />
                </div>
                <div class="p-field p-col-12 p-md-4">
                    <label for="lastname6">Türü</label>
                    <Dropdown v-model="scriptType" :options="scriptTypes" optionLabel="label"  />
                </div>
                <div class="p-field p-col-12">
                    <label for="lastname6">Betik İçeriği</label>
                    <Textarea :autoResize="true" rows="20" cols="100" />
                </div>
                <Button label="Oluştur" />
            </div>
            
        </Dialog>
    </div>
</template>

<script>
import {FilterMatchMode} from 'primevue/api';

export default {
    data() {
        return {
            records: [
                {
                    id: 1,
                    name: 'Bilgisayar Bilgisi',
                    type:'BASH',
                    createDate: '01.01.2021 12:10:09',
                    modifyDate: '02.01.2021 11:09:12'
                }
            ],
            filters: {
                'name': {value: null, matchMode: FilterMatchMode.STARTS_WITH},
            },
            showTemplateDialog: false,
            scriptTypes: [
                {
                    label: 'BASH',
                    value: 'BASH'
                }
            ]
        }
    }
}
</script>
