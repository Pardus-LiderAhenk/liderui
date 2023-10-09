<template>
<Panel :toggleable="true" class="p-m-3">
    <template #header>
      <h4 class="p-pt-2">{{$t('İstemci Oturum Raporu')}}</h4>
    </template>
    <div class="p-fluid p-formgrid p-grid">
      <div class="p-field p-col-12 p-lg-3 p-md-6 p-sm-12">
        <label for="inputComputerName">{{$t('reports.detailed_agent_report.computer_name')}}</label>
        <InputText
          
        />
      </div>
      <div class="p-field p-col-12 p-lg-3 p-md-6 p-sm-12">
        <label for="inputIPAdress">{{$t('reports.detailed_agent_report.ip_address')}}</label>
        <InputText id="inputIPAdress" type="text"  />
      </div>
      <div class="p-field p-col-12 p-lg-3 p-md-6 p-sm-12">
        <label for="inputMacAddress">{{$t('reports.detailed_agent_report.mac_address')}}</label>
        <InputText
          
        />
      </div>
      <div class="p-field p-col-12 p-lg-3 p-md-6 p-sm-12">
        <label for="inputDN">{{$t('reports.detailed_agent_report.dn')}}</label>
         <div class="p-inputgroup ">
            <InputText  />
            <Button icon="pi pi-sitemap" class="p-button-warning" 
                
            />
        </div>
      </div>
      <div class="p-field p-col-12 p-lg-3 p-md-6 p-sm-12">
        <label for="inputRegistrationDate">{{$t('reports.detailed_agent_report.create_date')}}</label>
        <Calendar
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
        <label for="inputStatus">{{$t('reports.detailed_agent_report.status')}}</label>
        <Dropdown
          
        />
      </div>
      <div class="p-field p-col-12 p-lg-3 p-md-6 p-sm-12">
        <label for="selectBrand">{{$t('reports.detailed_agent_report.brand')}}</label>
        <Dropdown
          
        />
      </div>
      <div class="p-field p-col-12 p-lg-3 p-md-6 p-sm-12">
        <label for="selectModel">{{$t('reports.detailed_agent_report.model')}}</label>
        <Dropdown
          
        />
      </div>
      <div class="p-field p-col-12 p-lg-3 p-md-6 p-sm-12">
        <label for="selectProcessor">{{$t('reports.detailed_agent_report.processor')}}</label>
        <Dropdown
          
        />
      </div>
      <div class="p-field p-col-12 p-lg-3 p-md-6 p-sm-12">
        <label for="selectOSVersion">{{$t('reports.detailed_agent_report.operating_system_version')}}</label>
        <Dropdown
          
        />
      </div>
      <div class="p-field p-col-12 p-lg-3 p-md-6 p-sm-12">
        <label for="selectAgentVersion">{{$t('reports.detailed_agent_report.ahenk_version')}}</label>
        <Dropdown
          
        />
      </div>
      <div class="p-field p-col-12 p-lg-3 p-md-6 p-sm-12">
        <label for="selectSessionVersion">{{$t('reports.detailed_agent_report.session')}}</label>
        <Dropdown
          
        />
      </div>
      <div class="p-field p-col-12 p-lg-3 p-md-6 p-sm-12">
        <label for="">{{$t('reports.detailed_agent_report.disk_type')}}</label>
        <Dropdown
          
        />
      </div>
      <div class="p-field p-col-12 p-text-right">
        <div class="p-d-flex p-jc-end">
          <div>
            <Button
              :label="$t('reports.detailed_agent_report.clear')"
              icon="fas fa-backspace"
              
            />
          </div>
          <div class="p-ml-2">
            <Button
              :label="$t('reports.detailed_agent_report.search')"
              icon="fas fa-search" 
             
              />
          </div>
        </div>
      </div>
    </div>
  </Panel>
</template>
<script>
</script>