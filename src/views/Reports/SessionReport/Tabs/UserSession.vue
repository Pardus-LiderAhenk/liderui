<template>
    <Panel :toggleable="true" class="p-m-3">
      <template #header>
        <h4 class="p-pt-2">{{$t('reports.session_report.user_session_reports')}}</h4>
      </template>
      <div class="p-fluid p-formgrid p-grid">
        
        <div class="p-field p-col-12 p-lg-3 p-md-6 p-sm-12">
          <label for="inputUserDate">{{$t('reports.session_report.session_date')}}</label>
          <Calendar
            v-model="filter.userCreateDate"
            selectionMode="range"
            :showButtonBar="true"
            :numberOfMonths="2"
            dateFormat="dd/mm/yy"
            :showIcon="true"
            :hideOnDateTimeSelect="true"
            :manualInput="false"
            @clear-click="clearCalendar"
          />
        </div>
        <div class="p-field p-col-12 p-lg-3 p-md-6 p-sm-12">
          <label for="inputStatus">{{$t('reports.session_report.session_type')}}</label>
          <Dropdown
            v-model="filter.status"
            :options="statuses"
            optionLabel="name"
            optionValue="value"/>

        </div>
        <div class="p-field p-col-12 p-lg-3 p-md-6 p-sm-12">
              <label for="inputDN">{{ $t('reports.session_report.username')  }}</label>
              <div class="p-inputgroup">
                  <InputText  v-model="filter.username" />
                  <Button 
                    icon="pi pi-sitemap" 
                    class="p-button-primary" 
                    @click="searchTextDialog = true"/>
              </div>
        </div>

        <div class="p-field p-col-12 p-lg-3 p-md-6 p-sm-12">
          <label for="dn">{{ $t('reports.session_report.computer_name')  }}</label>
          <div class="p-inputgroup">
              <InputText  v-model="filter.searchClient" />
              <Button 
                icon="pi pi-sitemap" 
                class="p-button-primary" 
                @click="searchClientDialog = true"/>
          </div>
      </div>

        <div class="p-field p-col-12 p-text-right">
          <div class="p-d-flex p-jc-end">
            <div>
              <Button
              :label="$t('reports.session_report.clear')"
                icon="fas fa-backspace"
                @click="clearFilterFields"
              />
            </div>
            <div class="p-ml-2">
              <Button 
              :label="$t('reports.session_report.search')"
              icon="fas fa-search" 
              @click="filterUsers" />
            </div>
          </div>
        </div>
      </div>
    </Panel>
    <Card class="p-m-3 p-mb-7">
      <template #title>
        <div class="p-d-flex p-jc-between">
          <div>{{$t('reports.session_report.results')}}</div>
          <div>
            <Button
              :label="$t('reports.session_report.export')"
              icon="fas fa-file-excel"
              @click="exportToExcel()"
            />
          </div>
        </div>
      </template>
      <template #content>
        <DataTable :value="sessions"  responsiveLayout="scroll" :loading="loading" >
          <template #empty>
            <div class="p-d-flex p-jc-center">
            {{$t('reports.session_report.session_cant_find')}}
          </div>
          </template>
          <template #loading>
             {{$t('reports.session_report.loading')}}
          </template>
          <Column header="#">
          <template #body="{index}">
            <span>{{ ((pageNumber - 1)*rowNumber) + index + 1 }}</span>
          </template>
          </Column>
           <Column  :header="$t('reports.session_report.username')">
            <template #body="{ data }">
              {{ data.username }}
          </template>
          </Column>
          <Column field="sessionEvent" :header="$t('reports.session_report.session_type')">
            <template #body="{ data}">
              <span v-if="data.sessionEvent == 1">
                {{ $t('reports.session_report.login') }}
              </span>
              <span v-if="data.sessionEvent == 2">
                {{ $t('reports.session_report.logout') }}
              </span>
          </template>
          </Column>
          <Column field="createDate" :header="$t('reports.session_report.session_date')">
            <template #body="{ data }">
              {{ formatDate(data.createDate) }}
            </template>
          </Column>
          <Column :header="$t('reports.session_report.computer_name')">
          <template #body="{ data }">
              {{ data.hostname }}
          </template>
          </Column>
          <Column field="macAddresses" :header="$t('reports.session_report.mac_address')">
          <template #body="{ data }">
              {{ data.macAddresses.replace(/'/g, " ")  }}
          </template>
          </Column>
          <Column field="ipAddresses" :header="$t('reports.session_report.ip_address')">
            <template #body="{ data }">
              {{ data.ipAddresses.replace(/'/g, "")  }}
          </template>
          </Column>
        </DataTable>
      
        <Paginator
          :rows="10"
          :totalRecords="totalElements"
          :rowsPerPageOptions="[10, 25, 50, 100]"
          @page="onPage($event)">
          <template> {{$t('reports.session_report.total_result')}} : {{ totalElements }} </template>
        </Paginator>
      </template>
    </Card>

    <Dialog :header="$t('reports.session_report.client_select')" 
    v-model:visible="searchClientDialog" 
    :style="{width: '50vw'}" :modal="true">
      <div class="p-field">
        <tree-component ref="tree"
          loadNodeUrl="/api/lider/computer/computers"
          loadNodeOuUrl="/api/lider/computer/ou-details"
          :treeNodeClick="treeClientNodeClick"
           isAgentTree="true"
          :searchFields="searchFields">
      </tree-component>
      </div>

        <div class="p-col-12 p-md-6 p-lg-3">
          
        </div>
          <template #footer>
              <Button :label="$t('reports.session_report.cancel')" icon="pi pi-times" @click="searchClientDialog = false" class="p-button-text"/>
              <Button :label="$t('reports.session_report.select')" icon="pi pi-check" @click="selectClientsearchText"  autofocus/>
          </template>
      </Dialog>

      <Dialog :header="$t('reports.session_report.user_select')" 
      v-model:visible="searchTextDialog" 
      :style="{width: '50vw'}" :modal="true">
        <tree-component
            ref="usertree"
            loadNodeUrl="/api/lider/user/users"
            loadNodeOuUrl="/api/lider/user/ou-details"
            :treeNodeClick="treeNodeClick"
            :searchFields="searchFields"
            :scrollHeight="40"
            >
        </tree-component>
  
          <div class="p-col-12 p-md-6 p-lg-3">
            
          </div>
            <template #footer>
                <Button :label="$t('reports.session_report.cancel')" icon="pi pi-times" @click="searchTextDialog = false" class="p-button-text"/>
                <Button :label="$t('reports.session_report.select')" icon="pi pi-check" @click="selectsearchText" autofocus />
            </template>
        </Dialog>

  </template>
  
  <script>
  import TreeComponent from '@/components/Tree/TreeComponent.vue';
  import { sessionReportService } from "../../../../services/Reports/SessionReportService.js";
  import moment from "moment";


  export default {
    data() {
      return {
        selectedUserUid:null,
        selectedAgent:null,
        pageNumber: 1,
        rowNumber: 10,
        totalElements: 0,
        offset: 1,
        loading: false,
        filterText:'',
        filterSearchText: '',
        searchTextDialog:false,
        searchClientDialog:false,
        sessions: [],
        username:'',
        showedTotalElementCount: 10,
        currentPage: 1,

        filter: {
            userCreateDate: "",
            startDate:"",
            endDate:"",
            sessionType:'ALL',
            status:'ALL',
            username: "",
            searchClient:"",
        },
        
        statuses: [
        {
          name: this.$t('reports.session_report.all'),
          value: "ALL",
        },
        {
          name: this.$t('reports.session_report.login'),
          value: "LOGIN",
        },
        {
          name: this.$t('reports.session_report.logout'),
          value: "LOGOUT",
        },
      ],

      };
    },
    components:{
        TreeComponent
    },

    mounted() {
          this.getSessionHistory();
    },

    computed:{
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

      treeClientNodeClick(node){
          this.selectedNode = node;
          this.filter.searchClient = node.uid;
      },

      treeNodeClick(node) {
        this.selectedNode = node;
        this.filter.username = node.uid;
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
          this.currentPage = this.pageNumber;
          this.loading = true;
          let params = new FormData();
          params.append("pageNumber", this.pageNumber);
          params.append("pageSize", this.rowNumber);
          params.append("sessionType", this.filter.status);
          params.append("username", this.filter.username);
          params.append("hostname", this.filter.searchClient);

          if (this.filter.userCreateDate && this.filter.userCreateDate[0] != null) {
            params.append(
              "startDate",
              moment(this.filter.userCreateDate[0])
                .set("hour", 0)
                .set("minute", 0)
                .set("second", 0)
                .format("DD/MM/YYYY HH:mm:ss")
            );
          }
         if (this.filter.userCreateDate && this.filter.userCreateDate[1] != null) {
          params.append(
            "endDate",
            moment(this.filter.userCreateDate[1])
                .set("hour", 0)
                .set("minute", 0)
                .set("second", 0)
                .format("DD/MM/YYYY HH:mm:ss")
           );
        }

          const{response,error} = await sessionReportService.userSessionList(params);
          if(error){
            this.$toast.add({
              severity:'error', 
              detail: this.$t('reports.session_report.error_session_list')+ " \n"+error, 
              summary:this.$t("computer.task.toast_summary"), 
              life: 3000
            });
          }
          else{
            if(response.status == 200){
              if (response.data) {
                this.sessions = response.data.content;
                this.totalElements = response.data.totalElements;
              }
            }
            else if(response.status == 417){
              this.$toast.add({
                  severity:'error', 
                  detail: this.$t('reports.session_report.error_417_session_list'), 
                  summary:this.$t("computer.task.toast_summary"), 
                  life: 3000
              });
            }
          }         
          this.loading = false;     
      },

      filterUsers(){
        this.getSessionHistory(this.currentPage,this.showedTotalElementCount);
      },

      clearCalendar() {
        this.filter.userCreateDate = "";
      },

      selectsearchText() {
        if(this.selectedNode) {
          this.filter.username = this.selectedNode.uid;
          this.searchTextDialog = false;

        }
      },

      selectClientsearchText() {

        if(this.selectedNode) {
          this.filter.searchClient = this.selectedNode.uid;
          this.searchClientDialog = false;
        }
      },

      async exportToExcel() {
        this.loading = true;
        var data = new FormData();
        data.append("pageNumber", this.pageNumber);
        data.append("pageSize", this.rowNumber);
        data.append("sessionType", this.filter.status);
        data.append("username", this.filter.username);
        data.append("hostname", this.filter.searchClient);

        if (this.filter.userCreateDate && this.filter.userCreateDate[0] != null) {
            data.append(
              "startDate",
              moment(this.filter.userCreateDate[0])
                .set("hour", 0)
                .set("minute", 0)
                .set("second", 0)
                .format("DD/MM/YYYY HH:mm:ss")
            );
          }
         if (this.filter.userCreateDate && this.filter.userCreateDate[1] != null) {
          data.append(
            "endDate",
            moment(this.filter.userCreateDate[1])
                .set("hour", 0)
                .set("minute", 0)
                .set("second", 0)
                .format("DD/MM/YYYY HH:mm:ss")
           );
        }


        const { response, error } = await sessionReportService.userSessionReportExport(data);
        if (error){
              this.$toast.add({
              severity:'error',
              detail:this.$t('reports.session_report.error_user_session_report'),
              summary:this.$t("computer.toast_summary"),
              life:3600
            });
          
        }else{
          if(response.status == 200){
            let blob = new Blob([response.data])
            let link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = "User Session Report.xlsx";
            this.loading = false;
            link.click();
          }
          else if(response.status == 400)
          this.$toast.add({
              severity:'error',
              detail:this.$t('reports.session_report.error_417_user_session_report'),
              summary:this.$t("computer.toast_summary"),
              life:3600
            });      
        }
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit',hour12: false};
      const formattedDate = new Date(dateString).toLocaleString('tr-TR', options);
      return formattedDate;
    },
  
    clearFilterFields() {
      this.filter = {
        userCreateDate: '',
        userCreateStartDate:'',
        userCreateEndDate:'',
        sessionType:'ALL',
        status:'ALL',
        username: "",
        searchText:"",
        searchClient:"",
      };
    },
    onPage(event) {
      this.loading = true;
      this.pageNumber = event.page + 1;
      this.rowNumber = event.rows;
      this.getSessionHistory();
    },
    
    },
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
  ::v-deep(.p-paginator) {
    .p-component {
        margin-left: auto;
    }
  }
  </style>
  