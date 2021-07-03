<template>
  <Panel :toggleable="true" class="p-m-3">
    <template #header>
      <h3>Detaylı İstemic Raporu</h3>
    </template>
    <div class="p-fluid p-formgrid p-grid">
      <div class="p-field p-col-12 p-lg-3 p-md-6 p-sm-12">
        <label for="inputComputerName">Bilgisayar Adı</label>
        <InputText
          id="inputComputerName"
          type="text"
          v-model="filter.computerName"
        />
      </div>
      <div class="p-field p-col-12 p-lg-3 p-md-6 p-sm-12">
        <label for="inputIPAdress">IP Adresi</label>
        <InputText id="inputIPAdress" type="text" v-model="filter.ipAddress" />
      </div>
      <div class="p-field p-col-12 p-lg-3 p-md-6 p-sm-12">
        <label for="inputMacAddress">Mac Adresi</label>
        <InputText
          id="inputMacAddress"
          type="text"
          v-model="filter.macAddress"
        />
      </div>
      <div class="p-field p-col-12 p-lg-3 p-md-6 p-sm-12">
        <label for="inputRegistrationDate">Kayıt Tarihi</label>
        <Calendar
          v-model="filter.registrationDate"
          selectionMode="range"
          :showTime="true"
          :showButtonBar="true"
          :numberOfMonths="2"
          dateFormat="dd/mm/yy"
          :showIcon="true"
          :hideOnDateTimeSelect="true"
          :manualInput="false"
        />
      </div>
      <div class="p-field p-col-12 p-lg-3 p-md-6 p-sm-12">
        <label for="inputStatus">Durumu</label>
        <Dropdown
          v-model="filter.status"
          :options="statuses"
          optionLabel="name"
          optionValue="value"
        />
      </div>
      <div class="p-field p-col-12 p-lg-3 p-md-6 p-sm-12">
        <label for="selectBrand">Marka</label>
        <Dropdown
          id="selectBrand"
          v-model="filter.brand"
          :options="brands"
          placeholder="Hepsi"
        />
      </div>
      <div class="p-field p-col-12 p-lg-3 p-md-6 p-sm-12">
        <label for="selectModel">Model</label>
        <Dropdown
          id="selectModel"
          v-model="filter.brand"
          :options="brands"
          placeholder="Hepsi"
        />
      </div>
      <div class="p-field p-col-12 p-lg-3 p-md-6 p-sm-12">
        <label for="selectProcessor">İşlemci</label>
        <Dropdown
          id="selectProcessor"
          v-model="filter.processor"
          :options="processors"
          placeholder="Hepsi"
        />
      </div>
      <div class="p-field p-col-12 p-lg-3 p-md-6 p-sm-12">
        <label for="selectOSVersion">İşletim Sistemi Versiyonu</label>
        <Dropdown
          id="selectOSVersion"
          v-model="filter.osVersion"
          :options="osVersions"
          placeholder="Hepsi"
        />
      </div>
      <div class="p-field p-col-12 p-lg-3 p-md-6 p-sm-12">
        <label for="selectAgentVersion">Ahenk Versiyonu</label>
        <Dropdown
          id="selectAgentVersion"
          v-model="filter.agentVersion"
          :options="agentVersions"
          placeholder="Hepsi"
        />
      </div>
      <div class="p-field p-col-12 p-text-right">
        <div class="p-d-flex p-jc-end">
          <div>
            <Button
              label="Temizle"
              icon="fas fa-backspace"
              @click="filterAgents"
            />
          </div>
          <div class="p-ml-2">
            <Button label="Ara" icon="fas fa-search" />
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
          <Button label="Dışa Aktar" icon="fas fa-file-excel" />
        </div>
      </div>
    </template>
    <template #content>
      <DataTable :value="agents" responsiveLayout="scroll" dataKey="id">
        <Column>
          <template #body="{index}">
            <span>{{ index + 1 }}</span>
          </template>
        </Column>
        <Column field="hostname" header="Bilgisayar Adı"></Column>
        <Column header="Mac Adresi">
          <template #body="{data}">
            {{data.macAddresses.replace(/'/g, '')}}
          </template>
        </Column>
        <Column header="IP Adresi">
          <template #body="{data}">
            {{data.ipAddresses.replace(/'/g, '')}}
          </template>
        </Column>
        <Column field="isOnline" header="Durumu">
        
          <template #body="{data}">
            <Badge v-if="data.isOnline" value="Çevrim İçi" severity="success"></Badge>
            <Badge v-else value="Çevrim Dışı" severity="danger"></Badge>
          </template>
        </Column>
        <Column header="Marka">
          <template #body="{data}">
            {{
              getPropertyValue(
                data.properties,
                "hardware.baseboard.manufacturer"
              )
            }}
          </template>
        </Column>
        <Column header="İşletim Sistemi">
          <template #body="{data}">
            {{ getPropertyValue(data.properties, "os.distributionName") }}
          </template>
        </Column>
        <Column header="Versiyon">
          <template #body="{data}">
            {{ getPropertyValue(data.properties, "os.distributionVersion") }}
          </template>
        </Column>
        <Column field="createDate" header="Oluşturulma Tarihi"></Column>
        <Column>
          <template #body="{data}">
            <div class="p-d-flex p-jc-end">
              <div>
                <Button
                  class="p-button-sm p-button-raised p-button-rounded"
                  icon="pi pi-list"
                  v-tooltip.left="'Agent Details'"
                  @click="showProjectResultOutputDetailDialog(data)"
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
        <template #left="">
          Toplam Sonuç: {{totalElements}}
        </template>
      </Paginator>
    </template>
  </Card>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      agents: [],
      totalElements: 0,
      showedTotalElementCount: 10,
      currentPage: 1,
      offset: 1,
      loadingData: true,
      brands: [],
      models: [],
      processors: [],
      osVersions: [],
      agentVersions: [],
      statuses: [
        {
          name: "Hepsi",
          value: "ALL",
        },
        {
          name: "Açık",
          value: "online",
        },
        {
          name: "Kapalı",
          value: "offline",
        },
      ],
      filter: {
        computerName: "",
        ipAddress: "",
        macAddress: "",
        registrationDate: "",
        status: "ALL",
        brand: "",
        model: "",
        processor: "",
        osVersion: "",
        agentVersion: "",
      },
    };
  },
  mounted() {
    this.getFilterData();
    this.getAgents();
  },
  methods: {
    getPropertyValue(properties, propertyName) {
      var propertyValue = "";
      const filteredProperties = properties.filter(
        (property) => property.propertyName === propertyName
      );
      if (filteredProperties != null) {
        propertyValue = filteredProperties[0].propertyValue;
      }
      return propertyValue;
    },
    getAgents(pageNumber = 1, rowNumber = 10) {
      console.log(pageNumber + " : " + rowNumber);
      this.currentPage = pageNumber;
      var data = new FormData();
      data.append("pageNumber", pageNumber);
      data.append("pageSize", rowNumber);
      data.append("status", "all");
      axios.post("/lider/agent_info/list", data).then((response) => {
        this.agents = response.data.content;
        this.totalElements = response.data.totalElements;
        this.loadingData = false;
      });
    },
    getFilterData() {
      axios.post("/lider/agent_info/filterData").then((response) => {
        this.brands = response.data.brands;
        this.models = response.data.models;
        this.processors = response.data.processors;
        this.agentVersions = response.data.agentVersions;
        this.osVersions = response.data.osVersions;
        console.log(this.brands);
      });
    },
    currentPageChange(newCurrentPage) {
      this.loadingData = true;
      this.getAgents(newCurrentPage);
    },
    onPage(event) {
      //event.page: New page number
      //event.first: Index of first record
      //event.rows: Number of rows to display in new page
      //event.pageCount: Total number of pages
      this.loadingData = true;
      this.getAgents(event.page + 1, event.rows);
    },
    filterAgents() {
      console.log(this.filter);
    },
    indexMethod(index) {
      return (this.currentPage - 1) * this.showedTotalElementCount + index + 1;
    },
    handleRegistrationDateChange(value) {
    },
  },
};
</script>

<style scoped></style>
