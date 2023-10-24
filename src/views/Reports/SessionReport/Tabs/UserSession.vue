<template>
    <Panel :toggleable="true" class="p-m-3">
      <template #header>
        <h4 class="p-pt-2">{{$t('Kullanıcı Oturum Raporu')}}</h4>
      </template>
      <div class="p-fluid p-formgrid p-grid">
        
        <div class="p-field p-col-12 p-lg-3 p-md-6 p-sm-12">
          <label for="inputRegistrationDate">{{$t('Oturum Tarihi')}}</label>
          <Calendar
            v-model="filter.logCreateDate"
            selectionMode="range"
            :showButtonBar="true"
            :numberOfMonths="2"
            dateFormat="dd/mm/yy"
            :showIcon="true"
            :hideOnDateTimeSelect="true"
            :manualInput="false"
          />
        </div>
        <div class="p-field p-col-12 p-lg-3 p-md-6 p-sm-12">
          <label for="inputStatus">{{$t('Oturum Tipi')}}</label>
          <Dropdown
            v-model="filter.status"
            :options="statuses"
            optionLabel="name"
            optionValue="value"
            :showClear="true"
          />

        </div>
        <div class="p-field p-col-12 p-lg-3 p-md-6 p-sm-12">
              <label for="inputDN">{{
                  filter.field !== 'username' ? $t('reports.system_log_report.username') : $t('reports.system_log_report.ip_address')
                }}</label>
              <div class="p-inputgroup">
                  <InputText  v-model="filter.username" />
                  <Button icon="pi pi-sitemap" class="p-button-primary" @click="searchTextDialog = true"/>
              </div>
          </div>
        <div class="p-field p-col-12 p-text-right">
          <div class="p-d-flex p-jc-end">
            <div>
              <Button
              :label="$t('reports.system_log_report.clear')"
                icon="fas fa-backspace"
                @click="clearFilterFields"
              />
            </div>
            <div class="p-ml-2">
              <Button 
              :label="$t('Ara1')"
              icon="fas fa-search" 
              @click="getSessionHistory" />
            </div>
          </div>
        </div>
      </div>
    </Panel>
    <Card class="p-m-3 p-mb-7">
      <template #title>
        <div class="p-d-flex p-jc-between">
          <div>{{$t('Sonuçlar')}}</div>
          <div>
            <Button
              :label="$t('Dışa Aktar')"
              icon="fas fa-file-excel"
              @click="exportToExcel()"
            />
          </div>
        </div>
      </template>
      <template #content>
        <DataTable :value="sessions" responsiveLayout="scroll" >
          <template #empty>
            {{$t('reports.system_log_report.task_cant_find')}}...
          </template>
          <template #loading>
             {{$t('reports.system_log_report.loading')}}...
          </template>
          <Column header="#">
            <template #body="{index}">
              <span>{{ ((pageNumber - 1)*rowNumber) + index + 1 }}</span>
            </template>
          </Column>
          <Column field="username" :header="$t('Kullanıcı adı')"></Column>
          <Column :header="$t('Makine Adı')">
            <template #body="{ data }">
                {{ data.agent.jid }}
            </template>
          </Column>
          <Column field="sessionEvent" :header="$t('Oturum tipi')"></Column>
          <Column field="ipAddresses" :header="$t('IP Adresi')">
          <template #body="{ data }">
              {{ data.agent.ipAddresses.replace(/'/g, "") }}
          </template>
          </Column>
          <Column field="macAddresses" :header="$t('MAC Adresi')">
            <template #body="{ data }">
                {{ data.agent.macAddresses.replace(/'/g, "") }}
            </template>
          </Column>
          <Column field="createDate" :header="$t('Oluşturulma Tarihi')"></Column>

          
        </DataTable>
        <Paginator
          :rows="10"
          :totalRecords="totalElements"
          :rowsPerPageOptions="[10, 25, 50, 100]"
          @page="onPage($event)"
        >
          <template> {{$t('reports.system_log_report.total_result')}} : {{ totalElements }} </template>
        </Paginator>
      </template>
    </Card>

    <Dialog :header="$t('Kullanıcı Adıp')" v-model:visible="searchTextDialog" :style="{width: '50vw'}" :modal="true">
      <tree-component
          ref="usertree"
          loadNodeUrl="/api/lider/user/users"
          loadNodeOuUrl="/api/lider/user/ou-details"
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

        <div class="p-col-12 p-md-6 p-lg-3">
          
        </div>
          <template #footer>
              <Button label="Kapat" icon="pi pi-times" @click="searchTextDialog = false" class="p-button-text"/>
              <Button label="Oluştur" icon="pi pi-check" @click="selectsearchText" autofocus />
          </template>
      </Dialog>

      <!-- <Dialog :header="$t('Makine adı ')" v-model:visible="searchTextDialog" :style="{width: '50vw'}" :modal="true">
        <template #header>
          <i class="fas fa-sitemap"></i>
          <span>
              &nbsp;&nbsp;{{ $t('tree.tree') }}
          </span>
        </template>
        <div>
          <div class="p-fluid">
            <div class="p-field">
                <span class="p-input-icon-left">
                  <i class="pi pi-filter-slash" />
                  <InputText v-model="filterText" 
                    type="text" class="p-inputtext-sm" 
                    :placeholder="$t('tree.filters_records')">
                  </InputText>
              </span>
            </div>
            <ScrollPanel :style="{ 'height': scrollHeight + 'vh' }">
              <div class="p-field">
                <el-tree
                  class="filter-tree"
                  :props="treeProps"
                  :empty-text="$t('tree.not_found_record')"
                  :render-content="renderContent"
                  :load="loadNode"
                  lazy
                  @node-click="handleTreeClick"
                  @node-contextmenu="nodeContextMenu"
                  highlight-current=true
                  accordion="true"
                  ref="tree"
                  :filter-node-method="filterNode"
                  :show-checkbox="showCheckbox"
                  @getCheckedNodes="getCheckedNodes"
                  @check="nodeCheckClicked('mainTree')"
                  node-key="distinguishedName"
                  :getHalfCheckedNodes="getHalfCheckedNodes"
                >
                  <template #default="{ node, data }">
                    <span class="custom-tree-node">
                      <span>{{ node.label }}</span>
                      <span>
                        <a
                          @click="append(data)">
                          Append
                        </a>
                        <a
                          @click="remove(node, data)">
                          Delete
                        </a>
                      </span>
                    </span>
                  </template>
                </el-tree>
              </div>
            </ScrollPanel>
          </div>
        </div>
  
          <div class="p-col-12 p-md-6 p-lg-3">
            
          </div>
            <template #footer>
                <Button label="Kapat" icon="pi pi-times" @click="searchTextDialog = false" class="p-button-text"/>
                <Button label="Oluştur" icon="pi pi-check" @click="selectsearchText" autofocus />
            </template>
        </Dialog> -->
  </template>
  
  <script>
  import TreeComponent from '@/components/Tree/TreeComponent.vue';
  import { sessionReportService } from "../../../../services/Reports/SessionReportService.js";
  import { mapActions, mapGetters } from "vuex";
  import {ref} from 'vue';
  import axios from "axios";
  import { agentSessionReportService } from "../../../../services/Reports/AgentSessionReportService.js";


  export default {
    setup(){
        const selectedNode = ref(null);
        const tree = ref(null);
        return { selectedNode, tree };
    },
    props: {
    //   // selectedUser: {
    //   //     type: Object,
    //   //     description: "Selected tree node",
    //   // },
    //   selectedNode: {
    //         type: Object,
    //         description: "Selected tree node",
    //     },
    // treeProps: {
    //   type: Object,
    //   default: () => {
    //     return {
    //       children: "childEntries",
    //       label: "name",
    //       isLeaf: function (data, node) {
    //         if (data.type === "ORGANIZATIONAL_UNIT" || data.type === null || data.type == "CONTAINER") {
    //           return false;
    //         } else {
    //           return true;
    //         }
    //       },
    //     }
    //   },
    // },
    // loadNodeUrl: {
    //   type: String,
    //   required: true,
    // },

    // scrollHeight: {
    //   description: "scroll bar height",
    //   type: Number,
    //   default: 60
    // },
    // loadNodeOuUrl: {
    //   type: String,
    //   required: true,
    // },
    // showCheckbox: {
    //   type: Boolean,
    //   default: false
    // },
    // getCheckedNodes: {
    //   type:Function,
    //   default : () => {}
    // },
    // getHalfCheckedNodes: {
    //   type:Function,
    //   default : () => {}
    // },
    // showContextMenu: {
    //   type: Boolean,
    //   default : false
    // },
    // searchNodeUrl: {
    //   type: String,
    //   default: "/api/lider/ldap/search-entry",
    //   description: "url for search entry"
    // },
    },
    data() {
      return {
        logs: [],
        totalElements: 0,
        showedTotalElementCount: 10,
        currentPage: 1,
        offset: 1,
        loading: true,
        filterText:'',
        filterSearchText: '',
        searchTextDialog:false,
        sessions: null,

        filter: {
            userCreateDate: '',
            userCreateStartDate:'',
            userCreateEndDate:'',
            sessionType:'ALL',
            status:'ALL',
            username: "",
            searchText:null,
            field:null,
        },
        pageNumber: 1,
        rowNumber: 10,
        statuses: [
        {
          name: this.$t('Hepsi'),
          value: "ALL",
        },
        {
          name: this.$t('Çevrimiçi'),
          value: "ONLINE",
        },
        {
          name: this.$t('Çevrimdışı'),
          value: "OFFLINE",
        },
      ],
      };
    },
    components:{
      TreeComponent
    },

    // created() {

    //   this.configuration();
    // },

    mounted() {
        if (this.selectedNode && this.selectedNode.type === "USER") {
            this.getSessionHistory();
        } else {
            this.sessions = null;
        }
        
    },

    computed:{
        ...mapGetters(["selectedLiderNode"]),
        isUserDisabled: {
            get() {
                return this.getUserStatus();
            },
            set() {
              return true;  
            },
        }
    },

    methods: {
      ...mapActions(["setSelectedLiderNode"]),

      treeNodeClick(node) {

          this.selectedNode = node;
          //this.setSelectedLiderNode(node);
          //this.getUserStatus();
      },

      getUserStatus(){
          let disabled = false;
          if (this.selectedNode && this.selectedNode.type == 'USER') {
              if (this.selectedNode.attributes.pwdAccountLockedTime) {
                  disabled = true;
              }
          }
          return disabled;
      },
      
      async getSessionHistory() {

          let params = new FormData();
          params.append("pageNumber", this.pageNumber);
          params.append("pageSize", this.rowNumber);
          params.append("createDate", this.filter.userCreateDate);
          params.append("sessionType", this.filter.status);
          params.append("username", this.filter.username);

          const{response,error} = await sessionReportService.userSessionList(params);
          console.log(response);
          if(error){
              this.$toast.add({
                  severity:'error', 
                  detail: this.$t('user_management.session_history_error')+ " \n"+error, 
                  summary:this.$t("computer.task.toast_summary"), 
                  life: 3000
              });
          }
          else{
              if(response.status == 200){
                  if (response.data) {
                      this.sessions = response.data;
                  }
              }
              else if(response.status == 417){
                  this.$toast.add({
                      severity:'error', 
                      detail: this.$t('user_management.error_417_session_history'), 
                      summary:this.$t("computer.task.toast_summary"), 
                      life: 3000
                  });
              }
          }              
      },
      // treeNodeClick(node) {
      //       this.selectedNode = node;
      //       this.setSelectedLiderNode(node);
      //   },

      async configuration(){
         const{response,error} = await userService.userConfigurations();
         if(error){
             return "error";
         }
         else{
             if(response.status == 200){
                 if (response.data != null) {
                     this.userLdapBaseDn = response.data;
                 }
             }
         }
         this.setSelectedLiderNode(null);

      },

      selectsearchText() {
        if(this.selectedNode) {
          this.filter.searchText = this.selectedNode.distinguishedName;
          this.searchTextDialog = false;
          //this.selectedNode = null;
        }
      },

      async exportToExcel() {
        this.loading = true;
        var data = new FormData();
        data.append("hostname", "ebru");
        // data.append("dn", this.filter.dn);
        // data.append("hostname", this.filter.hostname);
        // if (this.filter.registrationDate[0] != null) {
        //   data.append(
        //     "registrationStartDate",
        //     moment(this.filter.registrationDate[0])
        //       .set("hour", 0)
        //       .set("minute", 0)
        //       .set("second", 0)
        //       .format("DD/MM/YYYY HH:mm:ss")
        //   );
        // }
        // if (this.filter.registrationDate[1] != null) {
        //   data.append(
        //     "registrationEndDate",
        //     moment(this.filter.registrationDate[1])
        //       .set("hour", 0)
        //       .set("minute", 0)
        //       .set("second", 0)
        //       .format("DD/MM/YYYY HH:mm:ss")
        //   );
        // }
        const { response, error } = await agentSessionReportService.agentSessionInfoExport(data)
        if (error){
              this.$toast.add({
              severity:'error',
              detail:this.$t('reports.task_report.agent_info_report_export_error'),
              summary:this.$t("computer.toast_summary"),
              life:3600
            });
          
        }else{
          if(response.status == 200){
            let blob = new Blob([response.data])
            let link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = "Agent Report.xlsx";
            this.loading = false;
            link.click();
          }
          else if(response.status == 400)
          this.$toast.add({
              severity:'error',
              detail:this.$t('reports.task_report.error_400_agent_info_report'),
              summary:this.$t("computer.toast_summary"),
              life:3600
            });      
        }
    },
  
      clearFilterFields() {
        this.filter = {
            logCreateDate: '',
            logCreateStartDate:'',
            logCreateEndDate:'',
            field:null,
            searchText:null
        };
      },

      userFormValidation() {
            if (!this.user.uid.trim()) {
                this.userValidation["uid"] = true;
            } else {
                delete this.userValidation['uid'];
            }
            
            return !Object.keys(this.userValidation).length;
        },

      nodeContextMenu(event,node,treenode,tree) {
        this.$emit('handleContextMenu', event,node,treenode,tree);
      },

      filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },

      renderContent(h, { node, data, store }) {
        let containerIcon = require("@/assets/images/icons/entry_container.gif");
        let lastSession = null;
        let isOnline = false;
        if (data.type === "AHENK") {
          isOnline = data.online;
          if (data.attributes.hasOwnProperty("o") && data.attributes["o"]) {
            lastSession = data.attributes["o"];
          }
        }
        return (
          <span class="custom-tree-node">
            {data.type === "ORGANIZATIONAL_UNIT" || data.type === null ? (
              <i class="fa fa-folder-open" style="color:#F2C85B;"></i>
            ) : data.type === "AHENK" && data.attributes.hasOwnProperty("liderDeviceOSType") && data.attributes['liderDeviceOSType'] == 'Linux'? (
              <i class="fab fa-linux" style="color:#000000;"></i>
            ) : data.type === "AHENK" && data.attributes.hasOwnProperty("liderDeviceOSType") && data.attributes['liderDeviceOSType'] == 'Windows'? (
              <i class="fab fa-windows"></i>
            ) : data.type === "AHENK" ? (
              <i class="fab fa-linux" style="color:#000000;"></i>
            ) : data.type === "USER" ? (
              <i class="fa fa-user"></i>
            ) : data.type === "GROUP" ? (
              <i class="fas fa-users"></i>
            ) : data.type === "CONTAINER" ? (
              <img src={containerIcon}/>
            ) : data.type === "ROLE" ? (
              <i class="fas fa-user-tag"></i>
            ) : data.type === "WIND0WS_AHENK" ? (
             <i class="fab fa-windows"></i>
            ) : ""
            }
            <span style="margin-left:5px;">{data.type === "AHENK" && <i class="pi pi-circle-on" style={isOnline?'font-size: 50%; color:#689F38':'font-size: 50%; color:#D32F2F'}></i>} 
            &nbsp;{this.isAgentTree && data.type === "AHENK" && lastSession? 
              node.data.name +" ("+lastSession+")":node.data.name}
            </span>
          </span>
      );
    },

    loadNode(node, resolve) {
      if (node.level === 0) {
        axios.post(this.loadNodeUrl, {}).then((response) => {
          if(response.data) {
            Promise.all(response.data.map(this.getAgentsByNode)).then(
            (result) => {
              this.$emit('directoryConnection', true);
              this.treeData = result;
              resolve(result);
            });
          } else {
             this.$emit('directoryConnection', false);
          }
        });
      }
      if (node.level >= 1) {
        var data = new FormData();
        data.append("uid", node.data.distinguishedName);
        axios.post(this.loadNodeOuUrl, data).then((response) => {
          this.isMove ? 
          resolve(response.data.filter(node => node.type=="ORGANIZATIONAL_UNIT")):
          resolve(response.data);
        });
      }
    },


    handleTreeClick(node) {
      this.selectedNode = node;
      this.treeNodeClick(node);
      this.search.dn = node.distinguishedName;
    },
  
  
    },

    watch: {
        user: {
            handler(){
                this.userFormValidation();
            },
            deep: true,
        },
        selectedNode() {
            if (this.selectedNode && this.selectedNode.type === "USER") {
               this.getSessionHistory();
            } else {
                this.sessions = null;
            }
        }
    }

  };
  </script>
  
  <style lang="scss" scoped>
  ::v-deep(.p-paginator) {
      .p-component {
          margin-left: auto;
      }
  }

  ::v-deep .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content{
    background-color:#2196f3;
    color:white
  }
  ::v-deep(.custom-scrolltop) {
    width: 2rem;
    height: 2rem;
    border-radius: 4px;
    background-color: var(--primary-color);

    &:hover {
		background-color: var(--primary-color);
	}

    .p-scrolltop-icon {
        font-size: 1rem;
        color: var(--primary-color-text);
    }
  }
  </style>
  