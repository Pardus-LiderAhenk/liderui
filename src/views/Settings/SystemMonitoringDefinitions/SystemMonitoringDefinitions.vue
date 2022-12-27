<template>
  <div class="p-grid">
    <div class="p-col-12">
      <Card style="margin-top: 10px">
        <template #title>
          {{ $t("settings.system_monitoring_definitions.title") }}
        </template>
        <template #content>
          {{ $t("settings.system_monitoring_definitions.definition") }}
        </template>
      </Card>
    </div>
    <div class="p-col-12">
      <Card>
        <template #title>
          <div class="p-d-flex p-jc-between">
            {{ $t("settings.system_monitoring_definitions.template_list") }}
            <Button
              class="p-button-sm"
              icon="pi pi-plus"
              :label="$t('settings.system_monitoring_definitions.add')"
              @click="addNewTemplate"
            >
            </Button>
          </div>
        </template>
        <template #content>
          <DataTable
            :value="templates"
            responsiveLayout="scroll"
            class="p-datatable-sm"
            v-model:filters="filters"
            dataKey="id"
          >
            <template #header>
              <div class="p-d-flex p-jc-end">
                <span class="p-input-icon-left">
                  <i class="pi pi-search" />
                  <InputText
                    v-model="filters['global'].value"
                    class="p-inputtext-sm"
                    :placeholder="$t('settings.system_monitoring_definitions.search')"
                  />
                </span>
              </div>
            </template>
            <template #empty>
              <div class="p-d-flex p-jc-center">
                <span>
                    {{$t("settings.system_monitoring_definitions.table_empty_message")}}
                </span>
              </div>
            </template>
            <Column header="#" style="width:5%">
              <template #body="{index}">
                  <span>{{ ((pageNumber - 1)*rowNumber) + index + 1 }}</span>
              </template>
            </Column>
            <Column style="width:25%"
              field="label"
              :header="$t('settings.system_monitoring_definitions.template_name')"
            >
            </Column>
            <Column
              field="createDate"
              :header="$t('settings.system_monitoring_definitions.created_date')"
            >
            </Column>
            <Column
             field="modifyDate" 
             :header="$t('settings.system_monitoring_definitions.modified_date')"
            >
            </Column>
            <Column :exportable="false">
              <template #body="slotProps">
                <div class="p-d-flex p-jc-end">
                  <Button
                    class="p-mr-2 p-button-sm p-button-rounded p-button-warning"
                    icon="pi pi-pencil"
                    :label="$t('settings.system_monitoring_definitions.edit')"
                    @click.prevent="editTemplate(slotProps.data)"
                  >
                  </Button>
                  <Button
                    class="p-button-danger p-button-sm p-button-rounded"
                    icon="pi pi-trash"
                    :label="$t('settings.system_monitoring_definitions.delete')"
                    @click.prevent="deleteTemplateConfirmDialog = true; selectedTemplate = slotProps.data"
                  >
                  </Button>
                </div>
              </template>
            </Column>
          </DataTable>
          <Paginator
              v-model:first="first"
              :rows="10"
              :totalRecords="totalElements"
              :rowsPerPageOptions="[10, 25, 50, 100]"
              @page="onPage($event)"
          >
          </Paginator>
        </template>
      </Card>
    </div>
    <Dialog
      :header="selectedTemplate ? $t('settings.system_monitoring_definitions.update_template'): 
      $t('settings.system_monitoring_definitions.create_template')"
      :modal="false"
      :style="{ width: '60vw' }"
      :maximizable="true"
      v-model:visible="showTemplateDialog"
    >
      <div class="p-grid p-flex-column">
        <div class="p-fluid p-formgrid p-grid p-col">
          <div class="p-field p-col-12">
            <label>{{
              $t("settings.system_monitoring_definitions.template_name")
            }}</label>
            <InputText
              type="text"
              v-model="label"
              :class="validationErrors.label || validationTemplateLabel ? 'p-invalid': ''"
            />
            <small v-if="validationErrors.label" class="p-error">{{
              $t("settings.system_monitoring_definitions.template_name_warn")
            }}</small>
            <small v-if="validationTemplateLabel" class="p-error">
              {{$t("settings.system_monitoring_definitions.template_name_unique_warn")}}
            </small>
          </div>
          <div class="p-field p-col-12">
            <TabView ref="tabview1">
              <TabPanel>
                <template #header>
                  <i class="pi pi-comments"></i>
                  <span>
                      &nbsp;{{ $t("settings.system_monitoring_definitions.template_content")}}
                    </span>
                </template>
                <Textarea
                  :autoResize="false"
                  style="width: 100%; height: 475px"
                  v-model="contents"
                />
              </TabPanel>
              <TabPanel>
                <template #header>
                  <i class="pi pi-cog"></i>
                  <span>
                      &nbsp;{{$t("settings.system_monitoring_definitions.template_settings")}}
                  </span>
                </template>
                <Textarea
                  :autoResize="false"
                  style="width: 100%; height: 475px"
                  v-model="settings"
                />
              </TabPanel>
            </TabView>
            <small v-if="validationErrors.contents" class="p-error">{{
              $t("settings.system_monitoring_definitions.template_content_warn")
            }}</small>
          </div>
        </div>
      </div>
      <template #footer>
        <Button
          :label="$t('settings.system_monitoring_definitions.cancel')"
          icon="pi pi-times"
          @click="showTemplateDialog = false; selectedTemplate = null;"
          class="p-button-text p-button-sm"
        />
        <Button
          :label="selectedTemplate ? $t('settings.system_monitoring_definitions.update'):
          $t('settings.system_monitoring_definitions.save')"
          :icon="selectedTemplate ? 'pi pi-refresh' : 'pi pi-save'"
          class="p-button-sm"
          @click="templateOperation(selectedTemplate ? 'update' : 'add')"
        />
      </template>
    </Dialog>
    <Dialog 
      :header="$t('computer.task.toast_summary')" 
      v-model:visible="deleteTemplateConfirmDialog"  
      :modal="true" 
      @hide="deleteTemplateConfirmDialog = false"
        >
          <div class="confirmation-content">
              <i class="pi pi-info-circle p-mr-3" style="font-size: 2rem" />
              <span>{{ $t('settings.system_monitoring_definitions.delete_template_confirm_message')}}</span>
          </div>
          <template #footer>
          <Button 
              :label="$t('settings.system_monitoring_definitions.cancel')" 
              icon="pi pi-times" 
              @click="deleteTemplateConfirmDialog = false" 
              class="p-button-text p-button-sm"
          />
          <Button 
              :label="$t('settings.system_monitoring_definitions.yes')"
              icon="pi pi-check" 
              @click="deleteTemplate"
              class="p-button-sm"
          />
          </template>
      </Dialog>
  </div>
</template>

<script>
/**
 * System Monitoring(Conky) Template definition page. The conky template added, updated or deleted
 * @see {@link http://www.liderahenk.org/}
 *
 */

import { FilterMatchMode } from "primevue/api";
import { conkyService } from "../../../services/Settings/ConkyService.js";

export default {
  data() {
    return {
      templates: [],
      deleteTemplateConfirmDialog: false,
      selectedTemplate: null,
      filters: {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      },
      showTemplateDialog: false,
      label: "",
      contents: "conky.text = [[\n]]",
      settings: "",
      validationErrors: {},
      validationTemplateLabel: false,
      defaultSettings:
        "conky.config = {\n" +
        "   update_interval = 1,\n" +
        "   cpu_avg_samples = 2,\n" +
        "   net_avg_samples = 2,\n" +
        "   out_to_console = false,\n" +
        "   override_utf8_locale = true,\n" +
        "   double_buffer = true,\n" +
        "   no_buffers = true,\n" +
        "   text_buffer_size = 32768,\n" +
        "   imlib_cache_size = 0,\n" +
        "   own_window = true,\n" +
        "   own_window_type = 'normal',\n" +
        "   own_window_argb_visual = true,\n" +
        "   own_window_argb_value = 50,\n" +
        "   own_window_hints = 'undecorated,below,sticky,skip_taskbar,skip_pager',\n" +
        "   border_inner_margin = 5,\n" +
        "   border_outer_margin = 0,\n" +
        "   xinerama_head = 1,\n" +
        "   alignment = 'bottom_right',\n" +
        "   gap_x = 0,\n" +
        "   gap_y = 33,\n" +
        "   draw_shades = false,\n" +
        "   draw_outline = false,\n" +
        "   draw_borders = false,\n" +
        "   draw_graph_borders = false,\n" +
        "   use_xft = true,\n" +
        "   font = 'Ubuntu Mono:size=12',\n" +
        "   xftalpha = 0.8,\n" +
        "   uppercase = false,\n" +
        "   default_color = 'white',\n" +
        "   own_window_colour = '#000000',\n" +
        "   minimum_width = 300, minimum_height = 0,\n" +
        "   alignment = 'top_right'\n" +
        "}\n",
      pageNumber: 1,
      rowNumber: 10,
      totalElements:0,
      first : 0,
    };
  },

  mounted() {
    this.getTemplate();
  },

  methods: {

    async getTemplate(){

      const{response,error} = await conkyService.conkyList(this.rowNumber, this.pageNumber);
      if(error){
        this.$toast.add({
          severity: "error",
          detail: this.$t("settings.system_monitoring_definitions.get_templates_error_message") +" \n" + error,
          summary: this.$t("computer.task.toast_summary"),
          life: 3000,
        });
      }
      else{
        if(response.status == 200){
          if (response.data != null) {
            this.templates = response.data.content;
            this.totalElements = response.data.totalElements;
          }
        }
        else if(response.status == 417){
          this.$toast.add({
            severity: "error",
            detail: this.$t("computer.plugins.conky.error_417_fetching_conky"),
            summary: this.$t("computer.task.toast_summary"),
            life: 3000,
          });
        }
      }
    },

    onPage(event) {
      this.pageNumber = event.page + 1;
      this.rowNumber = event.rows;
      this.getTemplate();
    },

    editTemplate(data) {
      this.selectedTemplate = data;
      this.showTemplateDialog = true;
      this.label = data.label;
      this.contents = data.contents;
      this.settings = data.settings;
    },

    addNewTemplate() {
      (this.label = ""), (this.settings = this.defaultSettings);
      this.contents = "conky.text = [[\n]]";
      this.selectedTemplate = null;
      this.validationErrors = {};
      this.showTemplateDialog = true;
    },

    async deleteTemplate() {
      this.deleteTemplateConfirmDialog = false;
      const params = {
        id: this.selectedTemplate.id,
      };

      const{response,error} = await conkyService.conkyDelete(this.selectedTemplate.id);
      if(error){
        this.$toast.add({
            severity: "error",
            detail:this.$t("settings.system_monitoring_definitions.deleted_template_error_message") +" \n" + error,
            summary: this.$t("computer.task.toast_summary"),
            life: 3000,
          });
      }
      else{
        if(response.status == 200){
          if (response.data != null) {
            // var index = this.templates.findIndex(function (item, i) {
            //   return item.id === response.data.id;
            // });
            // if (index > -1) {
            //   this.templates.splice(index, 1);
            // }
            this.reset();
            this.selectedTemplate = null;
            this.$toast.add({
              severity: "success",
              detail: this.$t("settings.system_monitoring_definitions.deleted_template_success_message"),
              summary: this.$t("computer.task.toast_summary"),
              life: 3000,
            });
          }
        }
        else if(response.status == 417){
          this.$toast.add({
            severity: "error",
            detail:this.$t("settings.system_monitoring_definitions.error_417_delete_template"),
            summary: this.$t("computer.task.toast_summary"),
            life: 3000,
          });
        }
      }

    },

    async templateOperation(action) {
      if (action == "update") {
        if (!this.validateForm()) {
          return;
        }
        const params = {
          label: this.label,
          contents: this.contents,
          settings: this.settings,
          id: this.selectedTemplate.id,
        };

        const{response,error} = await conkyService.conkyUpdate(params);
        if(error){
          this.$toast.add({
              severity: "error",
              detail:this.$t("settings.system_monitoring_definitions.updated_template_error_message") +" \n" + error,
              summary: this.$t("computer.task.toast_summary"),
              life: 3000,
            });
        }
        else{
          if(response.status == 200){
            if (response.data != null) {
                this.showTemplateDialog = false;
                // for (let index = 0; index < this.templates.length; index++) {
                //   const element = this.templates[index];
                //   if (response.data.id === element.id) {
                //     element.label = response.data.label;
                //     element.contents = response.data.contents;
                //     element.settings = response.data.settings;
                //     element.modifyDate = response.data.modifyDate;
                //   }
                // }
                this.reset();
                this.$toast.add({
                  severity: "success",
                  detail: this.$t("settings.system_monitoring_definitions.updated_template_success_message"),
                  summary: this.$t("computer.task.toast_summary"),
                  life: 3000,
                });
              }
            }
          }
        }
      else {
        if (!this.validateForm()) {
          return;
        }
        const params = {
          label: this.label,
          contents: this.contents,
          settings: this.settings,
        };
        const{response,error} = await conkyService.conkyAdd(params);
        if(error){
          this.$toast.add({
              severity: "error",
              detail:this.$t("settings.system_monitoring_definitions.saved_template_error_message") + " \n" + error,
              summary: this.$t("computer.task.toast_summary"),
              life: 3000,
            });
        }
        else{
          if(response.status == 200){
            if (response.data != null) {
              this.showTemplateDialog = false;
              // this.templates.push(response.data);
              this.reset();
              this.$toast.add({
                severity: "success",
                detail: this.$t("settings.system_monitoring_definitions.saved_template_success_message"),
                summary: this.$t("computer.task.toast_summary"),
                life: 3000,
              });
            }
          }
          else if(response.status == 417){
            this.$toast.add({
              severity: "error",
              detail:this.$t("settings.system_monitoring_definitions.error_417_saved_template"),
              summary: this.$t("computer.task.toast_summary"),
              life: 3000,
            });
          }
        }
      }
    },

    validateForm() {
      if (!this.label.trim()) {
        this.validationErrors["label"] = true;
      }
      if (!this.contents.trim()) {
        this.validationErrors["contents"] = true;
      }
      if (!this.settings.trim()) {
        this.validationErrors["settings"] = true;
      }
      return !Object.keys(this.validationErrors).length;
    },

    isExistTemplateName(label, id) {
      let isExist = false;
      for (let index = 0; index < this.templates.length; index++) {
        const element = this.templates[index];
        if (element.label === label) {
          isExist = true;
          if (id && element.id === id) {
            isExist = false;
          }
        }
      }
      return isExist;
    },

    reset(){
        this.pageNumber = 1;
        this.rowNumber = 10;
        this.getTemplate();
        this.first = 0;
    }
   
  },

  watch: {
    contents() {
      delete this.validationErrors["contents"];
    },
    label() {
      delete this.validationErrors["label"];
      this.validationTemplateLabel = false;
    },
    settings() {
      delete this.validationErrors["settings"];
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
