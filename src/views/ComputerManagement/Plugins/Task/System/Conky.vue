<template>
  <div>
    <base-plugin
      :pluginUrl="pluginUrl"
      :pluginDescription="pluginDescription"
      :showTaskDialog="showTaskDialog"
      @close-task-dialog="showTaskDialog = false"
      :pluginTask="task"
    >
      <template #pluginTitle>
        {{ $t("computer.plugins.conky.header") }}
      </template>
      <template #pluginTitleButton>
        <div>
          <Button
            icon="pi pi-trash"
            class="p-button-danger p-button-sm p-mr-2"
            :title="$t('computer.plugins.conky.remove_template')"
            @click.prevent="sendTaskConky(true)"
          >
          </Button>
          <Button
            icon="pi pi-send"
            class="p-button-raised p-button-sm"
            :title="$t('computer.plugins.conky.send_template')"
            @click.prevent="sendTaskConky(false)"
          >
          </Button>
        </div>
      </template>
      <template #default>
        <div class="p-grid p-flex-column">
          <div class="p-fluid p-formgrid p-grid p-col">
            <div class="p-field p-col-12">
              <label>{{ $t("computer.plugins.conky.templates") }}</label>
              <Dropdown
                v-model="selectedTemplate"
                :options="templates"
                optionLabel="label"
                :class="conkyValidation ? 'p-invalid' : ''"
                :showClear="true"
                :filter="true"
                :placeholder="$t('computer.plugins.conky.select_template')"
                filterPlaceholder="Find Template"
              >
              </Dropdown>
              <small v-if="conkyValidation" class="p-error">{{
                $t("computer.plugins.conky.warn_select_template")
              }}</small>
            </div>
          </div>
          <div class="p-col">
            <TabView
              class="tabview-custom"
              ref="tabview4"
              v-model:activeIndex="activeIndex"
            >
              <TabPanel>
                <template #header>
                  <i class="pi pi-comments"></i>
                  <span>{{ $t("computer.plugins.conky.content") }}</span>
                </template>
              </TabPanel>
              <TabPanel>
                <template #header>
                  <i class="pi pi-cog"></i>
                  <span>{{ $t("computer.plugins.conky.settings") }}</span>
                </template>
              </TabPanel>
            </TabView>
            <Textarea
              v-if="selectedTemplate && activeIndex === 0"
              v-model="selectedTemplate.contents"
              style="height: 320px; width: 100%"
            />
            <Textarea
              v-if="selectedTemplate && activeIndex === 1"
              v-model="selectedTemplate.settings"
              style="height: 320px; width: 100%"
            />
            <p v-if="!selectedTemplate" class="p-text-center">
              {{ $t("computer.plugins.conky.warn_select_template") }}
            </p>
          </div>
        </div>
      </template>
      <template #pluginFooter> </template>
    </base-plugin>
  </div>
</template>

<script>
/**
 * Conky Plugin. Allows to text-based information to be displayed on desktop of users
 * commandId: EXECUTE_CONKY
 * @see {@link http://www.liderahenk.org/}
 *
 */

import { conkyService } from "../../../../../services/Settings/ConkyService.js";

export default {
  props: {
    pluginTask: {
      type: Object,
      description: "Plugin task object",
    },
  },

  created() {
    this.task = { ...this.pluginTask };
  },

  data() {
    return {
      task: null,
      showTaskDialog: false,
      pluginDescription: this.$t("computer.plugins.conky.description"),
      pluginUrl:"https://docs.liderahenk.org/lider3.0/computerManagement/computerManagement/systemMonitoring/",
      conkyMessage: "",
      conkyValidation: false,
      templates: [],
      selectedTemplate: "",
      activeIndex: 0,
    };
  },

  mounted() {

    this.conkyListAll();
   
  },

  methods: {

    sendTaskConky(removeConky) {
      this.conkyValidation = false;
      if (!removeConky && !this.selectedTemplate) {
        this.conkyValidation = true;
        return true;
      }
      this.task.commandId = "EXECUTE_CONKY";
      this.task.parameterMap = {
        conkyMessage: this.selectedTemplate
          ? this.selectedTemplate.settings +
            "\n" +
            this.selectedTemplate.contents
          : "",
        removeConkyMessage: removeConky,
      };
      this.showTaskDialog = true;
    },

    async conkyListAll(){

      const{response,error} = await conkyService.conkyListAll();
      if(error){
        this.$toast.add({
          severity: "error",
          detail: this.$t("computer.plugins.conky.conky_error_message") +" \n" + error,
          summary: this.$t("computer.task.toast_summary"),
          life: 3000,
        });
      }
      else{
        if(response.status == 200){
          if (response.data != null || response.data != "") {
            for (let index = 0; index < response.data.length; index++) {
                const element = response.data[index];
                this.templates.push({
                  label: element.label,
                  id: element.id,
                  contents: element.contents,
                  settings: element.settings,
                });
              }
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
    }
  },
  watch: {
    selectedTemplate() {
      if (this.selectedTemplate) {
        this.conkyValidation = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.tabview-custom {
  i,
  span {
    vertical-align: middle;
  }
  span {
    margin: 0 0.5rem;
  }
}
</style>
