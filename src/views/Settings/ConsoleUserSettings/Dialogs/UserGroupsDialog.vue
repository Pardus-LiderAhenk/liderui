<template>
    <Dialog :header="$t('settings.console_user_settings.adding_access_authorization')" v-model:visible="modalVisible" 
    :modal="true" position="top"
    >
        <div class="p-grid">
            <div class="p-col-12">
                <p>{{$t('settings.console_user_settings.admin_group_info')}}</p>
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
                    <label >{{$t('settings.console_user_settings.read_access')}}</label>
                </div>
                <div class="p-field-radiobutton">
                    <RadioButton  value="write" v-model="userPermissionChoise" />
                    <label >{{$t('settings.console_user_settings.read_and_write_access')}}</label>
                </div>
            </div>
        </div>

         <template #footer>
            <Button :label="$t('settings.console_user_settings.close')" icon="pi pi-times" @click="modalVisible = false" class="p-button-text"/>
            <Button :label="$t('settings.console_user_settings.add')" icon="pi pi-check" @click="addAccessRule" autofocus />
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
