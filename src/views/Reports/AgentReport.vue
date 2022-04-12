<template>
  <Panel :toggleable="true" class="p-m-3">
    <template #header>
      <h4 class="p-pt-2">Detaylı İstemci Raporu</h4>
    </template>
    <div class="p-fluid p-formgrid p-grid">
      <div class="p-field p-col-12 p-lg-3 p-md-6 p-sm-12">
        <label for="inputComputerName">Bilgisayar Adı</label>
        <InputText
          id="inputComputerName"
          type="text"
          v-model="filter.hostname"
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
        <label for="inputDN">DN</label>
        <InputText id="inputDN" type="text" v-model="filter.dn" />
      </div>
      <div class="p-field p-col-12 p-lg-3 p-md-6 p-sm-12">
        <label for="inputRegistrationDate">Kayıt Tarihi</label>
        <Calendar
          v-model="filter.registrationDate"
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
          v-model="filter.model"
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
      <DataTable :value="agents" responsiveLayout="scroll" dataKey="id" :loading="loading">
        <template #empty>
          No agents found.
        </template>
        <template #loading>
          Yükleniyor...
        </template>
        <!-- <Column>
          <template #body="slotProps">
            <span>{{ slotProps.index }}</span>
          </template>
        </Column> -->
        <Column field="hostname" header="Bilgisayar Adı"></Column>
        <Column header="Mac Adresi">
          <template #body="{ data }">
            {{ data.macAddresses.replace(/'/g, "") }}
          </template>
        </Column>
        <Column header="IP Adresi">
          <template #body="{ data }">
            {{ data.ipAddresses.replace(/'/g, "") }}
          </template>
        </Column>
        <Column field="isOnline" header="Durumu">
          <template #body="{ data }">
            <Badge
              v-if="data.isOnline"
              value="Çevrim İçi"
              severity="success"
            ></Badge>
            <Badge v-else value="Çevrim Dışı" severity="danger"></Badge>
          </template>
        </Column>
        <Column header="Marka">
          <template #body="{ data }">
            {{
              getPropertyValue(
                data.properties,
                "hardware.baseboard.manufacturer"
              )
            }}
          </template>
        </Column>
        <Column header="İşletim Sistemi">
          <template #body="{ data }">
            {{ getPropertyValue(data.properties, "os.distributionName") }}
          </template>
        </Column>
        <Column header="Versiyon">
          <template #body="{ data }">
            {{ getPropertyValue(data.properties, "os.distributionVersion") }}
          </template>
        </Column>
        <Column field="createDate" header="Oluşturulma Tarihi"></Column>
        <Column>
          <template #body="{ data }">
            <div class="p-d-flex p-jc-end">
              <div>
                <Button
                  class="p-button-sm p-button-raised p-button-rounded"
                  icon="pi pi-list"
                  v-tooltip.left="'Agent Details'"
                  @click="showAgentDetailDialog(data.id)"
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
    v-model:visible="agentDetailDialog"
    :breakpoints="{ '960px': '75vw', '640px': '100vw' }"
    :style="{ width: '50vw' }"
  >
    <template #header>
      <h3>İstemci Detayı</h3>
    </template>
    <h4>Genel Bilgiler</h4>
    <div class="p-grid">
      <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
      <div class="p-col-4"><b>Bilgisayar Adı</b></div>
      <div class="p-col-8">{{ selectedAgent.hostname }}</div>
      <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
      <div class="p-col-4"><b>MAC Adresleri</b></div>
      <div class="p-col-8">
        {{ selectedAgent.macAddresses.replace(/'/g, "") }}
      </div>
      <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
      <div class="p-col-4"><b>JID</b></div>
      <div class="p-col-8">{{ selectedAgent.jid }}</div>
      <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
      <div class="p-col-4"><b>IP Adresleri</b></div>
      <div class="p-col-8">
        {{ selectedAgent.ipAddresses.replace(/'/g, "") }}
      </div>
      <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
      <div class="p-col-4"><b>İşletim Sistemi Versiyonu</b></div>
      <div class="p-col-8">
        {{
          getPropertyValue(selectedAgent.properties, "os.distributionVersion")
        }}
      </div>
      <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
      <div class="p-col-4"><b>Ahenk Versiyonu</b></div>
      <div class="p-col-8">
        {{ getPropertyValue(selectedAgent.properties, "agentVersion") }}
      </div>
      <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
      <div class="p-col-4"><b>Oluşturulma Tarihi</b></div>
      <div class="p-col-8">{{ selectedAgent.createDate }}</div>
      <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
      <div class="p-col-4"><b>Güncelleme Tarihi</b></div>
      <div class="p-col-8">{{ selectedAgent.updateDate }}</div>
      <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
    </div>

    <h4>Disk ve Bellek Bilgisi</h4>
    <div class="p-grid">
      <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
      <div class="p-col-4"><b>Toplam Disk Alanı(GB)</b></div>
      <div class="p-col-8">
        {{
          (
            getPropertyValue(selectedAgent.properties, "hardware.disk.total") /
            1000
          )
            .toFixed(2)
            .toLocaleString("tr-TR")
        }}
      </div>
      <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
      <div class="p-col-4"><b>Kullanılan Disk Alanı(GB)</b></div>
      <div class="p-col-8">
        {{
          (
            getPropertyValue(selectedAgent.properties, "hardware.disk.used") /
            1000
          )
            .toFixed(2)
            .toLocaleString("tr-TR")
        }}
      </div>
      <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
      <div class="p-col-4"><b>Boş Disk Alanı(GB)</b></div>
      <div class="p-col-8">
        {{
          (
            (getPropertyValue(selectedAgent.properties, "hardware.disk.total") -
              getPropertyValue(
                selectedAgent.properties,
                "hardware.disk.used"
              )) /
            1000
          )
            .toFixed(2)
            .toLocaleString("tr-TR")
        }}
      </div>
      <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
      <div class="p-col-4"><b>Disk Bölümleri</b></div>
      <div class="p-col-8">
        {{
          getPropertyValue(selectedAgent.properties, "hardware.disk.partitions")
        }}
      </div>
      <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
      <div class="p-col-4"><b>RAM(GB)</b></div>
      <div class="p-col-8">
        {{
          (
            getPropertyValue(
              selectedAgent.properties,
              "hardware.memory.total"
            ) / 1000
          )
            .toFixed(2)
            .toLocaleString("tr-TR")
        }}
      </div>
      <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
    </div>

    <h4>İşlemci Bilgisi</h4>
    <div class="p-grid">
      <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
      <div class="p-col-4"><b>İşlemci</b></div>
      <div class="p-col-8">
        {{ getPropertyValue(selectedAgent.properties, "processor") }}
      </div>
      <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
      <div class="p-col-4"><b>Fiziksel Çekirdek Sayısı</b></div>
      <div class="p-col-8">
        {{
          getPropertyValue(
            selectedAgent.properties,
            "hardware.cpu.physicalCoreCount"
          )
        }}
      </div>
      <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
    </div>

    <template #footer>
      <Button
        label="Close"
        icon="pi pi-times"
        class="p-button-text"
        @click="agentDetailDialog = false"
      />
    </template>
  </Dialog>
</template>

<script>
import axios from "axios";
import moment from "moment";

export default {
  data() {
    return {
      agents: [],
      totalElements: 0,
      showedTotalElementCount: 10,
      currentPage: 1,
      offset: 1,
      loading: true,
      brands: [],
      models: [],
      processors: [],
      osVersions: [],
      agentVersions: [],
      getFilterData: true,
      agentDetailDialog: false,
      selectedAgent: null,
      statuses: [
        {
          name: "Hepsi",
          value: "ALL",
        },
        {
          name: "Açık",
          value: "ONLINE",
        },
        {
          name: "Kapalı",
          value: "OFFLINE",
        },
      ],
      filter: {
        dn: "",
        hostname: "",
        ipAddress: "",
        macAddress: "",
        registrationDate: "",
        registrationStartDate: "",
        registrationEndDate: "",
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
    this.getAgents();
  },
  methods: {
    showAgentDetailDialog(agentID) {
      this.selectedAgent = this.agents.filter(
        (agent) => agent.id === agentID
      )[0];
      this.agentDetailDialog = true;
    },
    getPropertyValue(properties, propertyName) {
      var propertyValue = "";
      const filteredProperties = properties.filter(
        (property) => property.propertyName === propertyName
      );
      if (filteredProperties != null && filteredProperties.length > 0) {
        propertyValue = filteredProperties[0].propertyValue;
      }
      return propertyValue;
    },
    getAgents(pageNumber = 1, rowNumber = 10) {
      this.currentPage = pageNumber;
      var data = new FormData();
      data.append("pageNumber", pageNumber);
      data.append("pageSize", rowNumber);
      data.append("status", this.filter.status);
      data.append("dn", this.filter.dn);
      data.append("hostname", this.filter.hostname);
      data.append("ipAddress", this.filter.ipAddress);
      data.append("macAddress", this.filter.macAddress);
      data.append("registrationStartDate", this.filter.registrationStartDate);
      data.append("registrationEndDate", this.filter.registrationEndDate);
      data.append("brand", this.filter.brand);
      data.append("model", this.filter.model);
      data.append("processor", this.filter.processor);
      data.append("osVersion", this.filter.osVersion);
      data.append("agentVersion", this.filter.agentVersion);
      if (pageNumber == 1) {
        data.append("getFilterData", true);
      }
      if (this.filter.registrationDate[0] != null) {
        data.append(
          "registrationStartDate",
          moment(this.filter.registrationDate[0])
            .set("hour", 0)
            .set("minute", 0)
            .set("second", 0)
            .format("DD/MM/YYYY HH:mm:ss")
        );
      }
      if (this.filter.registrationDate[1] != null) {
        data.append(
          "registrationEndDate",
          moment(this.filter.registrationDate[1])
            .set("hour", 0)
            .set("minute", 0)
            .set("second", 0)
            .format("DD/MM/YYYY HH:mm:ss")
        );
      }
      axios.post("/lider/agent_info/list", data).then((response) => {
        this.brands = response.data.brands;
        this.models = response.data.models;
        this.processors = response.data.processors;
        this.agentVersions = response.data.agentVersions;
        this.osVersions = response.data.osVersions;
        this.agents = response.data.agents.content;
        this.totalElements = response.data.agents.totalElements;
        this.loading = false;
      });
    },
    currentPageChange(newCurrentPage) {
      this.loading = true;
      this.getAgents(newCurrentPage);
    },
    onPage(event) {
      this.loading = true;
      this.getAgents(event.page + 1, event.rows);
    },
    filterAgents() {
      if (this.filter.registrationDate[0] != null) {
        this.filter.registrationStartDate = moment(
          this.filter.registrationDate[0]
        )
          .set("hour", 0)
          .set("minute", 0)
          .set("second", 0)
          .format("DD/MM/YYYY HH:mm:ss");
      }
      if (this.filter.registrationDate[1] != null) {
        this.filter.registrationEndDate = moment(
          this.filter.registrationDate[1]
        )
          .set("hour", 23)
          .set("minute", 59)
          .set("second", 59)
          .format("DD/MM/YYYY HH:mm:ss");
      }
      this.getAgents(this.currentPage, this.showedTotalElementCount);
    },
    exportToExcel() {
      this.loading = true;
      var data = new FormData();
      data.append("status", this.filter.status);
      data.append("dn", this.filter.dn);
      data.append("hostname", this.filter.hostname);
      data.append("ipAddress", this.filter.ipAddress);
      data.append("macAddress", this.filter.macAddress);
      data.append("registrationStartDate", this.filter.registrationStartDate);
      data.append("registrationEndDate", this.filter.registrationEndDate);
      data.append("brand", this.filter.brand);
      data.append("model", this.filter.model);
      data.append("processor", this.filter.processor);
      data.append("osVersion", this.filter.osVersion);
      data.append("agentVersion", this.filter.agentVersion);
      if (this.filter.registrationDate[0] != null) {
        data.append(
          "registrationStartDate",
          moment(this.filter.registrationDate[0])
            .set("hour", 0)
            .set("minute", 0)
            .set("second", 0)
            .format("DD/MM/YYYY HH:mm:ss")
        );
      }
      if (this.filter.registrationDate[1] != null) {
        data.append(
          "registrationEndDate",
          moment(this.filter.registrationDate[1])
            .set("hour", 0)
            .set("minute", 0)
            .set("second", 0)
            .format("DD/MM/YYYY HH:mm:ss")
        );
      }
      axios.post("/lider/agent_info/export", data, {responseType: 'blob'})
      .then((response) => {
        let blob = new Blob([response.data]);
        let link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = "Agent Report.xlsx";
        this.loading = false;
        link.click();
      });
    },
    clearFilterFields() {
      this.filter = {
        dn: "",
        hostname: "",
        ipAddress: "",
        macAddress: "",
        registrationDate: "",
        registrationStartDate: "",
        registrationEndDate: "",
        status: "ALL",
        brand: "",
        model: "",
        processor: "",
        osVersion: "",
        agentVersion: "",
      };
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
</style>
