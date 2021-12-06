<template>
    <Dialog header="Erişim Yetkisi Ekleme" v-model:visible="modalVisible" 
    :modal="true" position="top"
    >
        <div class="p-grid">
            <div class="p-col-12">
                <p>"cn=adminGroups,ou=User,ou=Groups,dc=liderahenk,dc=org" grubunun tüm üyeleri seçeceğiniz klasör ve bu klasörün altındaki tüm klasör ve kayıtlara erişim sağlayacaktır</p>
            </div>
            <div class="p-col-12">
                <tree-component 
                    ref="agentsTree"
                    loadNodeUrl="/lider/user_groups/getGroups"
                    loadNodeOuUrl="/lider/user_groups/getOuDetails"
                />
            </div>
            <div class="p-col-12">
               <div class="p-field-radiobutton">
                    <RadioButton  value="1" v-model="userPermissionChoise" />
                    <label >Seçili klasör ve alt klasörlerini sadece okuma yetkisi ver</label>
                </div>
                <div class="p-field-radiobutton">
                    <RadioButton  value="2" v-model="userPermissionChoise" />
                    <label >Seçili klasör ve alt klasörlerini okuma ve yazma yetkisi ver</label>
                </div>
            </div>
        </div>

         <template #footer>
            <Button label="Kapat" icon="pi pi-times" @click="modalVisible = false" class="p-button-text"/>
            <Button label="Ekle" icon="pi pi-check" @click="addUsersToData" autofocus />
        </template>
       
    </Dialog>
    
</template>

<script>
import TreeComponent from '@/components/Tree/TreeComponent.vue';
export default {
    components: {
        TreeComponent
    },
    data() {
        return {
            userPermissionChoise: 1
        }
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
