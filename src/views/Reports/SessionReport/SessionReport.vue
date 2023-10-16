<template>
    <div>
        <TabView>
            <TabPanel>
                <template #header>
                    <i class="pi pi-desktop"></i>
                    <span>
                        &nbsp;{{ $t('İstemci Oturumları')}}
                    </span>
                </template>
                <agent-session></agent-session>
                </TabPanel>
                <TabPanel>
                <template #header>
                    <i class="pi pi-users"></i>
                    <span>
                        &nbsp;{{$t('Kullanıcı oturumları')}}
                    </span>
                </template>
                <user-session
                :selectedUser="user"
                :selectedNode="selectedNode"
                ></user-session>
            </TabPanel>
        </TabView>
    </div>
 
  </template>
  
  <script>
  import AgentSession from "./Tabs/AgentSession.vue";
  import UserSession from "./Tabs/UserSession.vue";
  import { mapActions, mapGetters } from "vuex";
  import {ref} from 'vue';
  
  export default {
  
    setup(){
        const selectedNode = ref(null);
        const tree = ref(null);
        return { selectedNode, tree };
    },

    data() {
        return {
            user: null,
        }
    },

    components: {
        AgentSession,
        UserSession    
    },

    methods: {
        ...mapActions(["setSelectedLiderNode"]),

        treeNodeClick(node) {

            this.selectedNode = node;
            this.setSelectedLiderNode(node);
            this.getUserStatus();
        },

        getUserStatus(){
            let disabled = false;
            if (this.selectedNode && this.selectedNode.type == 'USER') {
                if (this.selectedNode.attributes.pwdAccountLockedTime) {
                    disabled = true;
                }
            }
            return disabled;
        }
    },

    watch: {
        selectedUser() {
            this.user = this.selectedUser;
        },
        selectedLiderNode(){
            if (this.selectedLiderNode && this.selectedLiderNode.type == 'USER'){
                this.selectedNode = this.selectedLiderNode;
                this.getUserStatus();
            }
        },
    }
      
  }
  </script>
  
  <style lang="scss" scoped>
  
  </style>