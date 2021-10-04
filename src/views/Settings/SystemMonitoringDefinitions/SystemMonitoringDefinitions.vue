<template>
    <div class="p-grid">
        <div class="p-col-12">
            <Card>
                <template #title>
                    Sistem Gözlemcisi Tanımlama
                </template>
                <template #content>
                    Metin tabanlı bilgilerin kullanıcının masaüstünde görülmesini sağlar. Şablon İçeriği ve Şablon Ayarları eksiksiz girilerek şablon kaydedilir. Şablon İçeriği ve Şablon Ayarları ayrı ayrı girilmelidir. Ayarlar, Şablon Ayarları sekmesinde #VARSAYILAN olarak sunulan içerik gibi olacak şekilde özelleştirilebilir.
                </template>
            </Card>
        </div>
        <div class="p-col-12">
            <Card>
                <template #title>
                    <div class="p-d-flex p-jc-between">
                        <p>Sistem Gözlemcisi Tanımları</p>
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
                         <Column field="name" header="Name" style="min-width:12rem">
                            <template #body="{data}">
                                {{data.name}}
                            </template>
                            <template #filter="{filterModel}">
                                <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by name"/>
                            </template>
                        </Column>
                         <Column field="createDate" header="Oluşturulma Tarihi"></Column>
                          <Column field="modifiyDate" header="Düzenleme Tarihi"></Column>
                          <Column :exportable="false" style="min-width:8rem">
                                <template #body="slotProps">
                                    <Button class="p-mr-2" label="Edit" @click="editProduct(slotProps.data)"></Button>
                                    <Button class="p-button-danger" label="Delete"></Button>
                                </template>
                            </Column>
                    </DataTable>
                </template>
            </Card>
        </div>



        <Dialog header="Yeni Şablon Oluştur" v-model:visible="showTemplateDialog" >
            <div class="p-fluid p-formgrid">
                <div class="p-field p-col-12">
                    <label for="lastname6">Şablon Adı</label>
                    <InputText id="lastname6" type="text" />
                </div>
            </div>
            <div class="p-col-12">
                <TabView ref="tabview1">
                    <TabPanel header="Şablon İçeriği">
                        <Textarea :autoResize="true" rows="20" cols="100" />
                    </TabPanel>
                    <TabPanel header="Şablon Ayarları">
                        <Textarea  :autoResize="true" rows="20" cols="100" />
                    </TabPanel>
                </TabView>
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
                    createDate: '01.01.2021 12:10:09',
                    modifyDate: '02.01.2021 11:09:12'
                }
            ],
            filters: {
                'name': {value: null, matchMode: FilterMatchMode.STARTS_WITH},
            },
            showTemplateDialog: false
        }
    }
}
</script>
