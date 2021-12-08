<template>

<div class="p-grid ad-management">
    <div class="p-col-12 p-md-6 p-lg-3" style="min-height:90vh; background-color:#fff;padding-left:20px;margin-top:10px;">
        <tree-component ref="tree" class="border-card"
            loadNodeUrl="/ad/getDomainEntry"
            loadNodeOuUrl="/ad/getChildEntriesOu"
            :treeNodeClick="treeNodeClick"
            @handleContextMenu="handleContenxtMenu"
            :searchFields="searchFields"
            searchNodeUrl="/ad/searchEntry"
        >
            <template #contextmenu>
                <div
                    ref="treecontextmenu"
                    class="el-overlay mycontextmenu"
                    v-show="showContextMenu"
                    @click="showContextMenu = false"
                    >
                    <div  ref="rightMenu">
                        <Menu :model="contextMenuItems" />
                    </div>
                </div>
            </template>
        </tree-component>
    </div>
    <div class="p-col-12 p-md-6 p-lg-9" style="min-height:90vh; margin-top:3px">
        <Card>
            <template #header >
                
            </template>
        </Card>
    </div>
</div>
    
</template>

<script>
export default {

    data() {
        return {
            showContextMenu: false,
            searchFields: [
                {
                    key: "SAM-Account-Name",
                    value: "sAMAccountName"
                },
                {
                    key: this.$t('tree.cn'),
                    value: "cn"
                },
                {
                    key: this.$t('tree.surname'),
                    value: "sn"
                },
                {
                    key: this.$t('tree.folder'),
                    value: "ou"
                },
                {
                    key: this.$t('tree.description'),
                    value: "description"
                },
                {
                    key: this.$t('tree.address'),
                    value: "streetAddress"
                },
                {
                    key: this.$t('tree.telephone_number'),
                    value: "telephoneNumber"
                },
                {
                    key: this.$t('tree.objectclass'),
                    value: "objectclass"
                }
            ],
            contextMenuItems: [
                {label: 'View', icon: 'pi pi-fw pi pi-list'},
                {label: 'Delete', icon: 'pi pi-fw pi-times'}
            ],
            
        };
    },

    methods:{
        treeNodeClick(data) {
            console.log(data)
        },

        handleContenxtMenu(data, node, treenode, tree){
            data.preventDefault();

            this.treeNodeClick(node);

            console.log(data)
            console.log(node)

            this.$refs.rightMenu.style.top = data.clientY + 'px';
            this.$refs.rightMenu.style.left = data.clientX + 'px';
            this.$refs.rightMenu.style.position = 'fixed';
            this.$refs.rightMenu.style.margin = '0';
            this.$refs.rightMenu.style.backgroundColor = '0';
            this.showContextMenu = !this.showContextMenu;
        },
    }
    
}
</script>

<style lang="scss" scoped>
.mycontextmenu {
    background-color: rgba(0,0,0,0.0);
}
.ad-management {
    background-color: #e7f2f8;
}
</style>