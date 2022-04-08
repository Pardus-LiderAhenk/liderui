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
                    :searchFields="searchFields"
                    :treeNodeClick="setSelectedNode"
                />
            </div>
            <div class="p-col-12">
               <div class="p-field-radiobutton">
                    <RadioButton  value="read" v-model="userPermissionChoise" />
                    <label >Seçili klasör ve alt klasörlerini sadece okuma yetkisi ver</label>
                </div>
                <div class="p-field-radiobutton">
                    <RadioButton  value="write" v-model="userPermissionChoise" />
                    <label >Seçili klasör ve alt klasörlerini okuma ve yazma yetkisi ver</label>
                </div>
            </div>
        </div>

         <template #footer>
            <Button label="Kapat" icon="pi pi-times" @click="modalVisible = false" class="p-button-text"/>
            <Button label="Ekle" icon="pi pi-check" @click="addAccessRule" autofocus />
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
            userPermissionChoise: 'read',
            selectedNode: null,
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
    },
    methods: {
        setSelectedNode(node) {
            this.selectedNode = node;
        },
        addAccessRule() {
            this.$emit('addOlcAccessRule', this.selectedNode.distinguishedName, this.userPermissionChoise);
            this.modalVisible = false;
        }
    }
}
</script>
