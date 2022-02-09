<template>
  <Panel :toggleable="true" class="p-m-3">
    <template #header>
      <h4 class="p-pt-2">Sistem Güncesi</h4>
    </template>
    <div class="p-fluid p-formgrid p-grid">
      
      <div class="p-field p-col-12 p-lg-3 p-md-6 p-sm-12">
        <label for="inputRegistrationDate">Günce Tarihi</label>
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
        <label for="inputStatus">Günce Tipi</label>
        <Dropdown
          v-model="filter.operationType"
          :options="operationTypes"
          optionLabel="text"
          optionValue="value"
          :filter="true" 
        />
      </div>
      <div class="p-field p-col-12 p-lg-3 p-md-6 p-sm-12">
        <label for="inputDN">Filtre Alanı</label>
        <Dropdown  v-model="filter.field" :options="filter.filterTextType" optionLabel="text" optionValue="value"></Dropdown>
      </div>
        <div class="p-field p-col-12 p-lg-3 p-md-6 p-sm-12">
            <label for="inputDN">{{
                filter.field !== 'requestIp' ? 'Kullanıcı Adı' : 'Ip Adresi'
              }}</label>
            <div class="p-inputgroup">
                <InputText :placeholder="filter.field !== 'requestIp' ? 'Kullanıcı': 'Ip Addres' " v-model="filter.searchText" />
                <Button v-show="filter.field !== 'requestIp' "  icon="pi pi-sitemap" class="p-button-primary" @click="searchTextDialog = true"/>
            </div>
        </div>
      <div class="p-field p-col-12 p-text-right">
        <div class="p-d-flex p-jc-end">
          <div>
            <Button
              label="Temizle"
              icon="fas fa-backspace"
              @click="clearFilterFields"
            />
          </div>
          <div class="p-ml-2">
            <Button label="Ara" icon="fas fa-search" @click="filterAgents" />
          </div>
        </div>
      </div>
    </div>
  </Panel>
  <Card class="p-m-3 p-mb-7">
    <template #title>
      <div class="p-d-flex p-jc-between">
        <div>Sonuçlar</div>
        <div>
          <Button
            label="Dışa Aktar"
            icon="fas fa-file-excel"
            @click="exportToExcel()"
          />
        </div>
      </div>
    </template>
    <template #content>
      <DataTable :value="logs" responsiveLayout="scroll" dataKey="id" :loading="loading">
        <template #empty>
          Görev bulunamadı...
        </template>
        <template #loading>
          Yükleniyor...
        </template>
        <Column header="#">
          <template #body="{index}">
            <span>{{ index + 1 }}</span>
            </template>
        </Column>
        <Column header="Günce Tipi">
          <template #body="{ data }">
              {{ getOpetarionType(data.crudType)}}
          </template>
        </Column>
        <Column field="createDate" header="Oluşturulma Tarihi"></Column>
        <Column field="logMessage" header="Mesaj"></Column>
        <Column field="userId" header="Kullanıcı Adı"></Column>
        <Column field="requestIp" header="IP Adresi"></Column>
        <Column>
          <template #body="{ data }">
            <div class="p-d-flex p-jc-end">
              <div>
                <Button
                  class="p-button-sm p-button-raised p-button-rounded"
                  icon="pi pi-list"
                  v-tooltip.left="'Log Details'"
                  @click="showLogDetailDialog(data.id)"
                />
              </div>
            </div>
          </template>
        </Column>
      </DataTable>
      <Paginator
        :rows="10"
        :totalRecords="totalElements"
        :rowsPerPageOptions="[10, 25, 50, 100]"
        @page="onPage($event)"
      >
        <template #left=""> Toplam Sonuç: {{ totalElements }} </template>
      </Paginator>
    </template>
  </Card>
 

  <Dialog
    v-model:visible="logDetailDialog"
    :breakpoints="{ '960px': '75vw', '640px': '100vw' }"
    :style="{ width: '50vw' }"
  >
    <template #header>
      <h3>Seçilen Sistem Güncesi Detayı</h3>
    </template>

    <div class="p-grid">
      <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
      <div class="p-col-4"><b>Günce ID</b></div>
      <div class="p-col-8">
        {{ selectedLog.id }}
      </div>
      <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
      <div class="p-col-4"><b>Günce Tipi</b></div>
      <div class="p-col-8">
        {{ getOpetarionType(selectedLog.crudType) }}
      </div>
      <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
      <div class="p-col-4"><b>Oluşturma Tarihi</b></div>
      <div class="p-col-8">
        {{ selectedLog.createDate }}
      </div>
      <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
      <div class="p-col-4"><b>Mesaj</b></div>
      <div class="p-col-8">
        {{ selectedLog.logMessage }}
      </div>
      <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
      <div class="p-col-4"><b>Kullanıcı Adı</b></div>
      <div class="p-col-8">
        {{ selectedLog.userId }}
      </div>
      <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
      <div class="p-col-4"><b>IP Adresi</b></div>
      <div class="p-col-8">
        {{ selectedLog.requestIp }}
      </div>
      <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
    </div>

     <template #footer>
      <Button
        label="Close"
        icon="pi pi-times"
        class="p-button-text"
        @click="logDetailDialog = false"
      />
    </template>

  </Dialog>

  <Dialog header="Kullanıcı Grubu Seç" v-model:visible="searchTextDialog" :style="{width: '50vw'}" :modal="true">
        <tree-component 
            ref="usertree"
            loadNodeUrl="/lider/user/getUsers"
            loadNodeOuUrl="/lider/user/getOuDetails"
            :treeNodeClick="treeNodeClick"
        />
        <template #footer>
            <Button label="Kapat" icon="pi pi-times" @click="searchTextDialog = false" class="p-button-text"/>
            <Button label="Oluştur" icon="pi pi-check" @click="selectsearchText" autofocus />
        </template>
    </Dialog>
</template>

<script>
import axios from "axios";
import moment from "moment";

export default {
  data() {
    return {
        logs: [],
        totalElements: 0,
        showedTotalElementCount: 10,
        currentPage: 1,
        offset: 1,
        loading: true,
        getFilterData: true,
        logDetailDialog: false,
        selectedLog: null,
        searchTextDialog:false,
        operationTypesResponse:[],
        operationTypes:[],
        filter: {
            filterTextType: [
              {value: 'userId', text:'Kullanıcı Adı'},
              {value: 'requestIp', text:'IP Adresi'}
            ],
            logCreateDate: '',
            logCreateStartDate:'',
            logCreateEndDate:'',
            operationType:'ALL',
            searchText:null,
            field:null,
        },
        selectedNode: null
    };
  },
  mounted() {
    this.getLogs();
    this.getOperationTypes();
  },
  methods: {
    treeNodeClick(node){
      this.selectedNode = node;
    },
    selectsearchText() {
      if(this.selectedNode) {
        this.filter.searchText = this.selectedNode.distinguishedName;
        this.searchTextDialog = false;
        this.selectedNode = null;
      }
    },
    showLogDetailDialog(logId) {
      this.selectedLog = this.logs.filter(
        (log) => log.id === logId
      )[0];
      this.logDetailDialog = true;
    },
    getLogs(pageNumber = 1, rowNumber = 10) {
      this.currentPage = pageNumber;
      var data = new FormData();
      data.append("pageNumber", pageNumber);
      data.append("pageSize", rowNumber);
      data.append('operationType',this.filter.operationType);
      if(this.filter.searchText != null) {
        data.append("searchText", this.filter.searchText);
      }
       if(this.filter.field != null) {
        data.append("field", this.filter.field);
      }
      if (pageNumber == 1) {
        data.append("getFilterData", true);
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
      axios.post("/operation/logs", data).then((response) => {
        this.logs = response.data.content;
        this.totalElements = response.data.totalElements;
        this.loading = false;
      });
    },
    currentPageChange(newCurrentPage) {
      this.loading = true;
      this.getLogs(newCurrentPage);
    },
    onPage(event) {
      this.loading = true;
      this.getLogs(event.page + 1, event.rows);
    },
    filterAgents() {
      this.getLogs(this.currentPage, this.showedTotalElementCount);
    },
    exportToExcel() {
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
      axios.post("/operation/export", data, {responseType: 'blob'})
      .then((response) => {
        let blob = new Blob([response.data]);
        let link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = "Logs_Report.xlsx";
        this.loading = false;
        link.click();
      });
    },
    clearFilterFields() {
      this.filter = {
          logCreateDate: '',
          logCreateStartDate:'',
          logCreateEndDate:'',
          operationType:'ALL',
          field:null,
          searchText:null
      };
    },
    getOperationTypes(){
        axios.post("/operation/types", {}).then((response) => {
            this.operationTypesResponse = response.data;
            this.operationTypes = this.operationTypesResponse.map((otype, index) => {
              return {
                text: this.getOpetarionType(otype),
                value: index + 1
              }
            });
        });
    },
    getOpetarionType(type) {
      var typeText = type;
      if (type == "CREATE") {
        typeText = "Oluşturma";
      } else if (type == "READ") {
        typeText = "Okuma";
      } else if (type == "UPDATE") {
        typeText = "Güncelleme";
      } else if (type == "DELETE") {
        typeText = "Silme";
      } else if (type == "LOGIN") {
        typeText = "Oturum Açma";
      } else if (type == "LOGOUT") {
        typeText = "Oturum Kapatma";
      } else if (type == "EXECUTE_TASK") {
        typeText = "Görev Çalıştırma";
      } else if (type == "EXECUTE_POLICY") {
        typeText = "Politika Çalıştırma";
      } else if (type == "CHANGE_PASSWORD") {
        typeText = "Parola Değiştir";
      } else if (type == "MOVE") {
        typeText = "Taşı";
      } else if (type == "UNASSIGMENT_POLICY") {
        typeText = "Politika Kaldır";
      }
      return typeText;
    },
  },
};
</script>

<style scoped></style>
