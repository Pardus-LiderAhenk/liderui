<template>
    <Dialog header="Konsol Kullanıcısı Ekle" v-model:visible="modalVisible" >
        <TabView>
            <TabPanel header="Yeni Arayüz Kullanıcısı Oluştur">
                <div class="p-grid">
                    <div class="p-col-6">
                        <div class="p-fluid p-formgrid p-grid">
                            <div class="p-field p-col-12">
                                <label for="zip">Kimlik (ID) *</label>
                                <InputText id="zip" type="text" />
                            </div>
                            <div class="p-field p-col-12">
                                <label for="firstname6">Kullanıcı Adı *</label>
                                <InputText id="firstname6" type="text" />
                            </div>
                            <div class="p-field p-col-12">
                                <label for="lastname6">Kullanıcı Soyadı *</label>
                                <InputText id="lastname6" type="text" />
                            </div>
                            <div class="p-field p-col-12">
                                <label for="city">Mail Adresi *</label>
                                <InputText id="city" type="text" />
                            </div>
                            <div class="p-field p-col-12">
                                <label for="zip">Telefon *</label>
                                <InputText id="zip" type="text" />
                            </div>
                            <div class="p-field p-col-12">
                                <label for="zip">Adres</label>
                                <InputText id="zip" type="text" />
                            </div>
                        </div>
                    </div>
                    <div class="p-col-6">
                        <div class="p-fluid p-formgrid p-grid">
                            <div class="p-field p-col-12">
                                <label for="firstname6">Parola *</label>
                                <InputText id="firstname6" type="text" />
                            </div>
                            <div class="p-field p-col-12">
                                <label for="lastname6">Parola Onayla *</label>
                                <InputText id="lastname6" type="text" />
                            </div>
                            <div class="p-field p-col-12">
                                <p>Şifre en az 6 karakter olmalıdır. En az bir büyük harf, küçük harf ve sayı içermelidir.</p>
                            </div>
                        </div>
                    </div>
                    <div class="p-col-12 p-d-flex p-jc-end">
                        
                    </div>
                </div>
            </TabPanel>
            <TabPanel header="Mevcut Kullanıcılara Erişim Yetkisi Ver">
                <tree-component 
                    ref="agentsTree"
                    loadNodeUrl="/lider/user/getUsers"
                    loadNodeOuUrl="/lider/user/getOuDetails"
                />
            </TabPanel>
            <TabPanel header="Dizin Erişim Yetkisi Ver"></TabPanel>
        </TabView>
        <template #footer>
            <Button label="Kapat" icon="pi pi-times" @click="modalVisible = false" class="p-button-text"/>
            <Button label="Yeni Arayüz Kullanıcısı Ekle" icon="pi pi-check" @click="addUsersToData" autofocus />
        </template>
    </Dialog>

</template>


<script>
import TreeComponent from '@/components/Tree/TreeComponent.vue';
export default {
    components:{
        TreeComponent
    },
    props: ['modalVisibleValue'],
    computed: {
        modalVisible: {
            get() {
                return this.modalVisibleValue;
            },
            set() {
                this.$emit('modalVisibleValue', false);
            }
        },
    }
}
</script>
