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
            v-model="filter.operationType"
            :options="operationTypes"
            optionLabel="text"
            optionValue="value"
            :filter="true" 
            :showClear="true" 
            :placeholder="$t('reports.system_log_report.select')"
          />
        </div>
        <div class="p-field p-col-12 p-lg-3 p-md-6 p-sm-12">
              <label for="inputDN">{{
                  filter.field !== 'requestIp' ? $t('reports.system_log_report.username') : $t('reports.system_log_report.ip_address')
                }}</label>
              <div class="p-inputgroup">
                  <InputText :placeholder="filter.field !== 'requestIp' ? $t('reports.system_log_report.username'): $t('reports.system_log_report.ip_address') " v-model="filter.searchText" />
                  <Button v-show="filter.field !== 'requestIp' "  icon="pi pi-sitemap" class="p-button-primary" @click="searchTextDialog = true"/>
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
          <div>{{$t('reports.system_log_report.results')}}</div>
          <div>
            <Button
              :label="$t('reports.system_log_report.export')"
              icon="fas fa-file-excel"
              @click="exportToExcel()"
            />
          </div>
        </div>
      </template>
      <template #content>
        <DataTable :value="logs" responsiveLayout="scroll" dataKey="id" :loading="loading">
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
          <Column :header="$t('Kullanıcı adı')"></Column>
          <Column field="machineName" :header="$t('Makine Adı')"></Column>
          <Column field="createDate" :header="$t('Giriş Tarihi')"></Column>
          <Column field="sessionType" :header="$t('Oturum tipi')"></Column>
          <Column field="requestIp" :header="$t('IP Adresi')"></Column>
          
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
   
  
    <Dialog
      v-model:visible="logDetailDialog"
      :breakpoints="{ '960px': '75vw', '640px': '100vw' }"
      :style="{ width: '50vw' }"
    >
      <template #header>
        <h3> {{$t('reports.system_log_report.selected_system_log_detail')}}</h3>
      </template>
  
      <div class="p-grid">
        <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
        <div class="p-col-4"><b> {{$t('Kullanıcı Adı')}}</b></div>
        <div class="p-col-8">
          {{ selectedLog.id }}
        </div>
        <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
        <div class="p-col-4"><b> {{$t('Makine Adı')}}</b></div>
        <div class="p-col-8">
          {{ getOpetarionType(selectedLog.crudType) }}
        </div>
        <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
        <div class="p-col-4"><b> {{$t('reports.system_log_report.create_date')}}</b></div>
        <div class="p-col-8">
          {{ selectedLog.createDate }}
        </div>
        <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
        <div class="p-col-4"><b> {{$t('reports.system_log_report.message')}}</b></div>
        <div class="p-col-8">
          {{ selectedLog.logMessage }}
        </div>
        <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
        <div class="p-col-4"><b> {{$t('reports.system_log_report.username')}}</b></div>
        <div class="p-col-8">
          {{ selectedLog.userId }}
        </div>
        <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
        <div class="p-col-4"><b> {{$t('reports.system_log_report.ip_address')}}</b></div>
        <div class="p-col-8">
          {{ selectedLog.requestIp }}
        </div>
        <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
      </div>
  
    </Dialog>
  
    <Dialog :header="$t('reports.system_log_report.select_user_group')" v-model:visible="searchTextDialog" :style="{width: '50vw'}" :modal="true">
      <tree-component
          ref="tree"
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
          <div class="p-col-12 p-md-6 p-lg-3" style="min-height:90vh; background-color:#fff;padding-left:20px;margin-top:10px;">
            
        </div>
          <template #footer>
              <Button label="Kapat" icon="pi pi-times" @click="searchTextDialog = false" class="p-button-text"/>
              <Button label="Oluştur" icon="pi pi-check" @click="selectsearchText" autofocus />
          </template>
      </Dialog>
  </template>
  
  <script>
  import moment from "moment";
  import TreeComponent from '@/components/Tree/TreeComponent.vue';
  import { sessionReportService } from "../../../../services/Reports/SessionReportService.js";
  import { mapActions, mapGetters } from "vuex";
  import {ref} from 'vue';



  
  export default {
    setup(){
        const selectedNode = ref(null);
        const tree = ref(null);
        return { selectedNode, tree };
    },
    // props: {
    //   // selectedUser: {
    //   //     type: Object,
    //   //     description: "Selected tree node",
    //   // },
    //   selectedNode: {
    //         type: Object,
    //         description: "Selected tree node",
    //     },
    // },
    data() {
      return {
        logs: [],
        totalElements: 0,
        showedTotalElementCount: 10,
        currentPage: 1,
        offset: 1,
        loading: true,
        logDetailDialog: false,
        searchTextDialog:false,
        sessions: null,
        filterTextType: [
              {value: 'userId', text:this.$t('reports.system_log_report.username')},
              {value: 'requestIp', text:this.$t('reports.system_log_report.ip_address')}
        ],
        filter: {
            logCreateDate: '',
            logCreateStartDate:'',
            logCreateEndDate:'',
            operationType:'ALL',
            searchText:null,
            field:null,
        },
        pageNumber: 1,
        rowNumber: 10,
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
      },
      
      async getSessionHistory() {
          
          const{response,error} = await sessionReportService.userSessionList(this.selectedNode.uid);
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
        data.append('operationType',this.filter.operationType);
        if(this.filter.searchText != null) {
          data.append("searchText", this.filter.searchText);
        }
         if(this.filter.field != null) {
          data.append("field", this.filter.field);
        }
       
        if (this.filter.logCreateStartDate[0] != null) {
          data.append(
            "startDate",
            moment(this.filter.logCreateStartDate[0])
              .set("hour", 0)
              .set("minute", 0)
              .set("second", 0)
              .format("DD/MM/YYYY HH:mm:ss")
          );
        }
        
        if (this.filter.logCreateEndDate[1] != null) {
          data.append(
            "endDate",
            moment(this.filter.logCreateEndDate[1])
              .set("hour", 0)
              .set("minute", 0)
              .set("second", 0)
              .format("DD/MM/YYYY HH:mm:ss")
          );
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
  </style>
  