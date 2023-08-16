<template>
    <Dialog :header="$t('settings.console_user_settings.adding_access_authorization')" 
        v-model:visible="modalVisible" 
        :modal="true"
        :breakpoints="{ '960px': '75vw', '640px': '100vw' }"
        :style="{ width: '60vw' }"
    >
        <div class="p-grid">
            <div class="p-col-12">
                <tree-component 
                    ref="agentsTree"
                    loadNodeUrl="/api/lider/user-groups/groups"
                    loadNodeOuUrl="/api/lider/user-groups/ou-details"
                    :searchFields="searchFields"
                    :treeNodeClick="setSelectedNode"
                    :scrollHeight="40"
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
            if (!this.selectedNode) {
                this.$toast.add({
                    severity:'warn', 
                    detail: this.$t("settings.console_user_settings.select_node_warn"),
                    summary: this.$t("computer.task.toast_summary"),
                    life: 3000
                });
                return;
            }
            this.$emit('addOlcAccessRule', this.selectedNode.distinguishedName, this.userPermissionChoise);
            this.modalVisible = false;
        }
    }
}
</script>
