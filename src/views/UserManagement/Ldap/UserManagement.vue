<template>
    <node-detail :showNodeDetailDialog="showNodeDetailDialog"
        @close-node-detail-dialog="showNodeDetailDialog=false">
    </node-detail>
    <div class="p-grid user-management">
        <div class="p-col-12 p-md-6 p-lg-3" style="min-height:90vh; background-color:#fff;padding-left:20px;margin-top:10px;">
            <tree-component
                ref="tree"
                loadNodeUrl="/lider/user/getUsers"
                loadNodeOuUrl="/lider/user/getOuDetails"
                :treeNodeClick="treeNodeClick"
                @handleContextMenu="handleContenxtMenu"
                :searchFields="searchFields"
            >
                <template #contextmenu>
                    <div
                        ref="treecontextmenu"
                        class="el-overlay mycontextmenu"
                        v-show="showContextMenu"
                        @click="showContextMenu = false"
                        >
                        <div ref="rightMenu">
                            <Menu :model="contextMenuItems"/>
                        </div>
                    </div>
                </template>
            </tree-component>
        </div>
        <div class="p-col-12 p-md-6 p-lg-9" style="min-height:90vh; margin-top:3px">
            <Card>
                <template #content>
                    <div class="p-grid">
                        <div class="p-col-12 p-md-6 p-lg-4">
                            <PanelMenu :model="menuitems"/>
                        </div>
                        <div class="p-col-12 p-md-6 p-lg-8">
                            <keep-alive>
                                <component :is="selectedTabUserMenu"
                                    :selectedNode="selectedNode"
                                    :userNode="userNode"
                                    @updated-user="treeNodeClick">
                                </component>
                            </keep-alive>
                        </div>
                    </div>
                </template>
            </Card>
        </div>
    </div>
    <!-- Add Folder Dialog -->
    <Dialog :header="$t('user_management.add_folder')" v-model:visible="modals.folderAdd" 
        :style="{width: '30vw'}" :modal="true">
        <div class="p-fluid">
            <div class="p-field">
                <label for="folderName">{{$t('user_management.folder_name')}}</label>
                <InputText :class="validation.folderName ? 'p-invalid': ''" type="text" v-model="folderName"/>
                <small v-if="validation.folderName" class="p-error">
                    {{ $t('user_management.folder_name_warn')}}
                </small>
            </div>
        </div>
        <template #footer>
            <Button :label="$t('user_management.cancel')" icon="pi pi-times" 
                @click="modals.folderAdd = false" class="p-button-text p-button-sm"
            />
            <Button :label="$t('user_management.add')" icon="pi pi-plus"
                @click="addFolder" class="p-button-sm"
            />
        </template>
    </Dialog>
    <!-- Add Folder Dialog End-->

    <!-- Add User Dialog -->
    <Dialog :header="$t('user_management.add_user')" 
        v-model:visible="modals.addUser" :style="{width: '40vw'}" :modal="true">
        <div class="confirmation-content">
            <div class="p-fluid p-formgrid p-grid">
                <div class="p-field p-col-12">
                    <label for="firstname6">{{$t('user_management.uid')}}</label>
                    <InputText :class="userValidation.uid ? 'p-invalid p-inputtext-sm': 'p-inputtext-sm'" 
                        v-model="user.uid" type="text"
                    />
                    <small v-if="userValidation.uid" class="p-error">
                        {{$t('user_management.uid_warn')}}
                    </small>
                </div>
                <div class="p-field p-col-12">
                    <label for="firstname6">{{$t('user_management.username')}}</label>
                    <InputText :class="userValidation.cn ? 'p-invalid p-inputtext-sm': 'p-inputtext-sm'" 
                        type="text" v-model="user.cn"
                    />
                    <small v-if="userValidation.cn" class="p-error">
                        {{$t('user_management.cn_warn')}}
                    </small>
                </div>
                <div class="p-field p-col-12">
                    <label for="firstname6">{{$t('user_management.surname')}}</label>
                    <InputText :class="userValidation.sn ? 'p-invalid p-inputtext-sm': 'p-inputtext-sm'" 
                        type="text" v-model="user.sn"
                    />
                    <small v-if="userValidation.sn" class="p-error">
                        {{$t('user_management.sn_warn')}}
                    </small>
                </div>
                <div class="p-field p-col-12">
                    <label for="firstname6">{{$t('user_management.mail_address')}}</label>
                    <span class="p-input-icon-right">
                        <i class="pi pi-envelope" />
                        <InputText :class="userValidation.uimaild ? 'p-invalid p-inputtext-sm': 'p-inputtext-sm'" 
                            type="text" v-model="user.mail"
                        />
                        <small v-if="userValidation.mail" class="p-error">
                            {{$t('user_management.mail_warn')}}
                        </small>
                    </span>
                </div>
                <div class="p-field p-col-12">
                    <label for="firstname6">{{$t('user_management.telephone_number')}}</label>
                    <span class="p-input-icon-right">
                        <i class="pi pi-phone"></i>
                        <InputMask :class="userValidation.telephoneNumber ? 'p-invalid p-inputtext-sm': 'p-inputtext-sm'" 
                            mask="(999) 999-9999" v-model="user.telephoneNumber" placeholder="(999) 999-9999" 
                        />
                        <small v-if="userValidation.telephoneNumber" class="p-error">
                            {{$t('user_management.telephone_number_warn')}}
                        </small>
                    </span>
                </div>
                <div class="p-field p-col-12">
                    <label for="firstname6">{{$t('user_management.address')}}</label>
                    <Textarea :class="userValidation.homePostalAddress ? 'p-invalid': ''" 
                        :autoResize="true" rows="3" cols="30" v-model="user.homePostalAddress"
                    />
                    <small v-if="userValidation.homePostalAddress" class="p-error">
                        {{$t('user_management.address_warn')}}
                    </small>
                </div>
                <div class="p-filed p-col-12">
                    <password-component ref="password" :isSmallInput="true"></password-component>
                    
                </div>
            </div>
        </div>
        <template #footer>
            <Button :label="$t('user_management.cancel')" icon="pi pi-times" 
                @click="modals.addUser = false" class="p-button-text p-button-sm"
            />
            <Button :label="$t('user_management.add')" icon="pi pi-user-plus" 
                @click="addUser" class="p-button-sm"
            />
        </template>
    </Dialog>
    <!-- Add User Dialog End -->
    <!-- Move Selected Node Dialog -->
    <Dialog header="Taşınacak Klasörü Seçiniz" v-model:visible="modals.moveUser" :style="{width: '50vw'}" :modal="true">
        <tree-component 
            ref="movetree"
            loadNodeUrl="/lider/user/getUsers"
            loadNodeOuUrl="/lider/user/getOuDetails"
            :treeNodeClick="moveTreeNodeClick"
            :searchFields="searchFolderFields"
        />
        <div class="p-col p-text-center">
          <small>{{$t('user_management.select_folder_warn')}}</small>
        </div>
        <template #footer>
            <Button :label="$t('user_management.cancel')" icon="pi pi-times" 
                @click="modals.moveUser = false" class="p-button-text p-button-sm"
            />
            <Button :label="$t('user_management.move')" icon="el-icon-rank" 
                @click="moveUser" class="p-button-sm"
            />
        </template>
    </Dialog>
    <!-- Move Selected Node Dialog End -->
</template>

<script>

/**
 * User management in OpenLDAP
 * @see {@link http://www.liderahenk.org/}
 */

import TreeComponent from '@/components/Tree/TreeComponent.vue';
import NodeDetail from '@/components/Tree/NodeDetail.vue';
import PasswordComponent from '@/components/Password/PasswordComponent.vue';
import axios from 'axios';
import { mapActions } from "vuex"
import {ref} from 'vue';

import GeneralInformations from '@/views/UserManagement/Ldap/Components/GeneralInformations.vue';
import PasswordChange from '@/views/UserManagement/Ldap/Components/PasswordChange.vue';
import UserGroups from '@/views/UserManagement/Ldap/Components/UserGroups.vue';
import SessionHistory from '@/views/UserManagement/Ldap/Components/SessionHistory.vue';

export default {
    setup(){
        const selectedNode = ref(null);
        const tree = ref(null);
        return { selectedNode, tree };
    },
    components: {
        TreeComponent,
        NodeDetail,
        PasswordComponent,
        GeneralInformations,
        PasswordChange,
        UserGroups,
        SessionHistory
    },
    data() {
        return {
            showNodeDetailDialog: false,
            moveUserNode: null,
            userNode: null,
            modals: {
                folderAdd: false,
                moveUser: false,
                deleteNode: false,
                addUser: false
            },
            folderName:'',
            user:{
                uid: "",
                cn: "",
                sn: "",
                mail: "",
                telephoneNumber: "",
                homePostalAddress: "",
                userPassword: ""
            },
            selectedAgents: [],
            showContextMenu: false,
            contextMenuItems: [],
            validation: {
                folderName: false,
            },
            userValidation: {},
            selectedTabUserMenu: "general-informations",
            menuitems: [
                {
                    label: this.$t('user_management.general_information'), 
                    icon: 'pi pi-id-card', 
                    command:() => this.selectedTabUserMenu = "general-informations"
                },
                {
                    label: this.$t('user_management.change_password'), 
                    icon: 'pi pi-unlock', 
                    command:() => this.selectedTabUserMenu = "password-change"
                },
                {
                    label: this.$t('user_management.group_list'), 
                    icon: 'el el-icon-coin', 
                    command:() => this.selectedTabUserMenu = "user-groups"
                },
                {
                    label: this.$t('user_management.session_history'), 
                    icon: 'pi pi-replay', 
                    command:() => this.selectedTabUserMenu = "session-history"
                },

            ],
            searchFolderFields: [
                {
                    key: this.$t('tree.folder'),
                    value: "ou"
                },
            ],
            searchFields: [
                {
                    key: this.$t('tree.id'),
                    value: "uid"
                },
                {
                    key: this.$t('tree.username'),
                    value: "cn"
                },
                {
                    key: this.$t('tree.surname'),
                    value: "sn"
                },
                {
                    key: this.$t('tree.folder'),
                    value: "ou"
                }
            ],
        }
    },
    created() {
        axios.get("/lider/user/configurations", null).then((response) => {
            if (response.data != null) {
                this.userNode = response.data;
            }
        });

        this.setSelectedLiderNode(null);
    },

    methods: {
        ...mapActions(["setSelectedLiderNode"]),

        treeNodeClick(node) {
            this.selectedNode = node;
            this.setSelectedLiderNode(node);
        },

        moveTreeNodeClick(node) {
            //*** This method for tree that is created for folder move dialog.  */
            this.moveUserNode = node;
        },

        addFolder() {
            if (!this.folderName.trim()) {
                this.validation.folderName = true;
                return;
            }
            let params = new FormData();
            params.append("parentName", this.selectedNode.distinguishedName);
            params.append("ou", this.folderName);
            axios.post('/lider/user/addOu', params).then(response => {
                this.modals.folderAdd = false;
                if (response.data) {
                     this.$refs.tree.append(response.data, this.selectedNode);
                    this.$toast.add({
                        severity:'success', 
                        detail: this.$t('user_management.add_folder_success'), 
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000
                    });
                } else {
                    this.$toast.add({
                        severity:'error', 
                        detail: this.$t('user_management.add_folder_error'), 
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000
                    });
                }
            });
            this.folderName = '';
        },
       
        moveUser() {
            if (!this.moveUserNode) {
                this.$toast.add({
                    severity:'warn', 
                    detail: this.$t('user_management.select_folder_warn'), 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
                return;
            }
            let params = new FormData();
            params.append("sourceDN", this.selectedNode.distinguishedName);
            params.append("destinationDN", this.moveUserNode.distinguishedName);
            this.modals.moveUser = false;
            axios.post('/lider/user/move/entry', params).then(response => {
                if (response.data) {
                    this.$refs.tree.remove(this.selectedNode);
                    this.$refs.tree.append(this.selectedNode, this.$refs.tree.getNode(this.moveUserNode.distinguishedName));
                    this.setSelectedLiderNode(null);
                    this.$toast.add({
                        severity:'success', 
                        detail: this.$t('user_management.moved_user_success'), 
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000
                    });
                } else {
                    this.$toast.add({
                        severity:'error', 
                        detail: this.$t('user_management.moved_user_error'), 
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000
                    });
                }
            });
        },

        deleteNode() {
            let ldapEntry = [];
            let deleteUrl = "/lider/user/deleteUser";
            if (this.selectedNode.type === "ORGANIZATIONAL_UNIT") {
                ldapEntry.push({
                    "distinguishedName": this.selectedNode.distinguishedName,
                    "entryUUID": this.selectedNode.entryUUID,
                    "type": this.selectedNode.type,
                    "uid": this.selectedNode.uid
                });
                deleteUrl = "/lider/user/deleteUserOu";
                
            } else if (this.selectedNode.type === "USER") {
                ldapEntry.push({
                    "distinguishedName": this.selectedNode.distinguishedName,
                    "type": this.selectedNode.type,
                });
            }
            axios.post(deleteUrl, ldapEntry).then(response => {
                this.modals.deleteNode = false;
                if (response.data) {
                    this.$refs.tree.remove(this.selectedNode);
                    this.setSelectedLiderNode(null);
                    this.$toast.add({
                        severity:'success', 
                        detail: this.$t('user_management.delete_node_success'), 
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000
                    });
                } else {
                    this.$toast.add({
                        severity:'error', 
                        detail: this.$t('user_management.delete_node_error'), 
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000
                    });
                }
            });
        },

        addUser() {
            if (this.userFormValidation()) {
                if (!this.$refs.password.getPassword()) {
                    this.user.userPassword = this.$refs.password.getPassword();
                    return;
                }
                let params = new FormData();
                params.append("parentName", this.selectedNode.distinguishedName);
                params.append("uid", this.user.uid);
                params.append("cn", this.user.cn);
                params.append("sn", this.user.sn);
                params.append("mail", this.user.mail);
                params.append("telephoneNumber", this.user.telephoneNumber);
                params.append("homePostalAddress", this.user.homePostalAddress);
                params.append("userPassword", this.user.userPassword);
                axios.post('/lider/user/addUser', params).then(response => {
                    this.modals.addUser = false;
                    if (response.data) {
                        this.$refs.tree.append(response.data, this.selectedNode);
                        this.$toast.add({
                            severity:'success', 
                            detail: this.$t('user_management.add_user_success'), 
                            summary:this.$t("computer.task.toast_summary"), 
                            life: 3000
                        });
                        this.user.uid = "";
                        this.user.cn = "";
                        this.user.sn = "";
                        this.user.mail = "";
                        this.user.telephoneNumber = "";
                        this.user.homePostalAddress = "";
                        this.user.userPassword = "";
                    } else {
                        this.$toast.add({
                            severity:'error', 
                            detail: this.$t('user_management.add_user_error'), 
                            summary:this.$t("computer.task.toast_summary"), 
                            life: 3000
                        });
                    }
                });
            }
        },

        userFormValidation() {
            if (!this.user.uid.trim()) {
                this.userValidation["uid"] = true;
            } else {
                delete this.userValidation['uid'];
            }
            if (!this.user.cn.trim()) {
                this.userValidation["cn"] = true;
            } else {
                delete this.userValidation['cn'];
            }
            if (!this.user.sn.trim()) {
                this.userValidation["sn"] = true;
            } else {
                delete this.userValidation['sn'];
            }
            if (!this.user.mail.trim()) {
                this.userValidation["mail"] = true;
            } else {
                delete this.userValidation['mail'];
            }
            if (!this.user.telephoneNumber.trim()) {
                this.userValidation["telephoneNumber"] = true;
            } else {
                delete this.userValidation['telephoneNumber'];
            }
            if (!this.user.homePostalAddress.trim()) {
                this.userValidation["homePostalAddress"] = true;
            } else {
                delete this.userValidation['homePostalAddress'];
            }
            return !Object.keys(this.userValidation).length;
        },

        handleContenxtMenu(data, node, treenode, tree){
            data.preventDefault();
            this.treeNodeClick(node);
            switch(node.type) {
                case 'ORGANIZATIONAL_UNIT':
                    if (node.isRoot) {
                        this.contextMenuItems = [
                            {label: this.$t('user_management.node_detail'), icon:'pi pi-list', command: () => {this.showNodeDetailDialog = true}},
                            {label: this.$t('user_management.add_user'), icon:"pi pi-user-plus", command: () => {this.modals.addUser = true;}},
                            {label: this.$t('user_management.add_folder'),icon:"pi pi-folder-open", command: () => {this.validation.folderName = false; this.modals.folderAdd = true}},
                        ]
                    } else {
                        this.contextMenuItems = [
                            {label: this.$t('user_management.node_detail'), icon: 'pi pi-list', command: () => {this.showNodeDetailDialog = true}},
                            {label: this.$t('user_management.add_user'), icon:"pi pi-user-plus", command: () => {this.modals.addUser = true}},
                            {label: this.$t('user_management.add_folder'), icon:"pi pi-folder-open", command: () => {this.validation.folderName = false; this.modals.folderAdd = true}},
                            {label: this.$t('user_management.delete_folder'), icon:"pi pi-trash", command:() => {this.modals.deleteNode = true;}},
                        ]
                    }
                    break
                case 'USER':
                    this.contextMenuItems = [
                        {label: this.$t('user_management.node_detail'), icon: 'pi pi-list', command: () => {this.showNodeDetailDialog = true}},
                        {label: this.$t('user_management.move_user'), icon:"el-icon-rank", command: () => {this.modals.moveUser = true}},
                        {label: this.$t('user_management.delete_user'), icon:"pi pi-user-minus", command:() => {this.modals.deleteNode = true;}},
                    ]
            }

            this.$refs.rightMenu.style.top = data.clientY + 'px';
            this.$refs.rightMenu.style.left = data.clientX + 'px';
            this.$refs.rightMenu.style.position = 'fixed';
            this.$refs.rightMenu.style.margin = '0';
            this.$refs.rightMenu.style.backgroundColor = '0';
            this.showContextMenu = !this.showContextMenu;
        }
    },

    watch: {
        user: {
            handler(){
                this.userFormValidation();
            },
            deep: true,
        }
    }
}
</script>

<style scoped>
.mycontextmenu {
    background-color: rgba(0,0,0,0.0);
}
.user-management {
    background-color: #e7f2f8;
}
</style>