<template>
  <div>
    <!-- Delete Selected Folder Dialog -->
    <Dialog :style="{width: '30vw'}"
      :header="$t('computer.agent_info.delete_folder')" 
      v-model:visible="deleteFolderDialog"  
      :modal="true" 
      @hide="deleteFolderDialog = false">
      <div class="confirmation-content">
          <i class="pi pi-info-circle p-mr-3" style="font-size: 2rem" />
          <span>{{ $t('computer.agent_info.delete_folder_warn')}}</span>
      </div>
      <template #footer>
      <Button 
          :label="$t('computer.agent_info.cancel')" 
          icon="pi pi-times" 
          @click="deleteFolderDialog = false" 
          class="p-button-text p-button-sm"
      />
      <Button 
          :label="$t('computer.agent_info.yes')"
          icon="pi pi-check" 
          @click="deleteFolder"
          class="p-button-sm"
      />
      </template>
    </Dialog>
    <!-- Delete Selected Folder Dialog End -->
    <!-- Add Folder Dialog -->
    <Dialog :header="$t('computer.agent_info.add_folder')" v-model:visible="addFolderDialog" 
        :style="{width: '30vw'}" :modal="true">
        <div class="p-fluid">
            <div class="p-field">
                <label for="folderName">{{$t('computer.agent_info.folder_name')}}</label>
                <InputText :class="validationFolderName ? 'p-invalid': ''" type="text" v-model="folderName"/>
                <small v-if="validationFolderName" class="p-error">
                    {{ $t('computer.agent_info.folder_name_warn')}}
                </small>
            </div>
        </div>
        <template #footer>
            <Button :label="$t('computer.agent_info.cancel')" icon="pi pi-times" 
                @click="addFolderDialog = false" class="p-button-text p-button-sm"
            />
            <Button :label="$t('computer.agent_info.add')" icon="pi pi-plus"
                @click="addFolder" class="p-button-sm"
            />
        </template>
    </Dialog>
    <!-- Add Folder Dialog End-->
    <!-- Update Agent Dialog -->
    <Dialog :style="{width: '20vw'}"
        :header="$t('computer.agent_info.update_client')" 
        v-model:visible="updateAgentConfirm"  
        :modal="true" 
      >
      <div class="confirmation-content">
        <span>
          <i class="fas fa-info-circle" ></i>&nbsp;
          {{ $t('computer.agent_info.update_client_confirm_question') }}
        </span>
      </div>
      <template #footer>
        <Button 
          :label="$t('computer.agent_info.cancel')" 
          icon="pi pi-times"
          @click="updateAgentConfirm = false" 
          class="p-button-text p-button-sm"
        />
        <Button 
          :label="$t('computer.agent_info.yes')"
          icon="pi pi-check" 
          @click="updateAgentInfo"
          class="p-button-sm"
        />
      </template>
    </Dialog>
    <!-- Delete Agent Dialog -->
    <Dialog :style="{width: '20vw'}"
      :header="$t('computer.agent_info.delete_client')" 
      v-model:visible="deleteAgentConfirm"  
      :modal="true" 
    >
      <div class="confirmation-content">
        <span v-if="selectedLiderNode && selectedLiderNode.type == 'AHENK' && selectedLiderNode.online">
          <i class="fas fa-info-circle" ></i>&nbsp;
          {{ $t('computer.agent_info.delete_client_confirm_question_online') }}
        </span>
        <span v-else-if="selectedLiderNode && selectedLiderNode.type == 'AHENK' && !selectedLiderNode.online">
          <i class="fas fa-info-circle" ></i>&nbsp;
          {{ $t('computer.agent_info.delete_client_confirm_question_offline') }}
        </span>
      </div>
      <template #footer>
        <Button 
          :label="$t('computer.agent_info.cancel')" 
          icon="pi pi-times"
          @click="deleteAgentConfirm = false" 
          class="p-button-text p-button-sm"
        />
        <Button 
          :label="$t('computer.agent_info.yes')"
          icon="pi pi-check" 
          @click="deleteAgent"
          class="p-button-sm"
        />
      </template>
    </Dialog>
    <!-- Rename Agent Dialog -->
    <Dialog :style="{width: '20vw'}"
        :header="$t('computer.agent_info.rename')" 
        v-model:visible="renameAgentDialog"  
        :modal="true" 
      >
      <div class="p-fluid">
        <div class="p-field">
          <label>{{$t('computer.agent_info.hostname')}}</label>
          <InputText :class="validationRenameAgent ? 'p-inputtext-sm p-invalid': 'p-inputtext-sm'"  
            placeholder="pardus" v-model="newHostname" type="text" 
          />
          <small v-if="validationRenameAgent" class="p-error">
            {{$t('computer.agent_info.hostname_input_warn')}}
          </small>
        </div>
        <div class="p-field">
          <i class="fas fa-info-circle" ></i>&nbsp;
          <span>{{ $t('computer.agent_info.rename_success') }}</span>
        </div>
      </div>
      <template #footer>
        <Button 
          :label="$t('computer.agent_info.cancel')" 
          icon="pi pi-times"
          @click="renameAgentDialog = false" 
          class="p-button-text p-button-sm"
        />
        <Button 
          :label="$t('computer.agent_info.update')"
          icon="pi pi-refresh" 
          @click="renameAgent"
          class="p-button-sm"
        />
      </template>
    </Dialog>
    <!-- Move Agent Dialog -->
    <Dialog :header="$t('computer.agent_info.move_agent')" 
      v-model:visible="moveAgentDialog" 
      :style="{width: '40vw'}" :modal="true"
    >
      <div class="p-grid p-flex-column">
        <div class="p-col">
          <tree-component 
            ref="movetree"
            loadNodeUrl="/api/lider/computer/computers"
            loadNodeOuUrl="/api/lider/computer/ou-details"
            :treeNodeClick="moveTreeNodeClick"
            :searchFields="searchFields"
            :isMove="true"
          />
        </div>
        <div class="p-col p-text-center">
          <small>{{ $t('computer.agent_info.move_agent_info') }}</small>
        </div>
      </div>
      <template #footer>
        <Button 
          :label="$t('computer.agent_info.cancel')" 
          icon="pi pi-times"
          @click="moveAgentDialog = false" 
          class="p-button-text p-button-sm">
        </Button>
        <Button class="p-button-sm"
          :label="$t('computer.agent_info.move')"
          icon="el-icon-rank" 
          @click="moveAgent" 
        >
        </Button>
      </template>
    </Dialog>
    <!-- Node Detail Dialog -->
    <Dialog
      :header="$t('computer.agent_info.node_detail')" 
      :modal="true"
      :style="{ width: '50vw'}"
      v-model:visible="showAgentInfoDialog">
        <TabView style="min-height:50vh;">
          <TabPanel>
            <template #header>
                <i class="pi pi-info-circle"></i>
                <span>
                    &nbsp;{{ $t('computer.agent_info.node_detail') }}
                </span>
            </template>
            <DataTable class="p-datatable-sm" 
              :value="selectedNodeData" responsiveLayout="scroll"
            >
              <Column field="label" :header="$t('group_management.attribute')"></Column>
              <Column field="value" :header="$t('group_management.value')"></Column>
            </DataTable>
          </TabPanel>
          <TabPanel v-if="selectedLiderNode.type == 'AHENK'">
            <template #header>
                <i class="el el-icon-data-analysis"></i>
                <span>
                    &nbsp;{{ $t('computer.agent_info.client_detail') }}
                </span>
            </template>
            <h4>{{ $t('computer.agent_info.general_info') }}</h4>
            <div class="p-grid">
              <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
              <div class="p-col-4"><b>{{ $t('computer.agent_info.hostname') }}</b></div>
              <div class="p-col-8">{{ selectedAgentInfo.hostname }}</div>
              <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
              <div class="p-col-4"><b>{{$t("computer.agent_info.mac")}}</b></div>
              <div class="p-col-8">
                {{ selectedAgentInfo.macAddresses.replace(/'/g, "") }}
              </div>
              <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
              <div class="p-col-4"><b>JID</b></div>
              <div class="p-col-8">{{ selectedAgentInfo.jid }}</div>
              <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
              <div class="p-col-4"><b>{{ $t('computer.agent_info.ip_addr') }}</b></div>
              <div class="p-col-8">
                {{ selectedAgentInfo.ipAddresses.replace(/'/g, "") }}
              </div>
              <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
              <div class="p-col-4"><b>{{ $t("computer.agent_info.operating_system") }}</b></div>
              <div class="p-col-8">{{ getPropertyValue(selectedAgentInfo.properties, "os.version") }}</div>
              <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
              <div class="p-col-4"><b>{{ $t("computer.agent_info.agent_version") }}</b></div>
              <div class="p-col-8">{{ getPropertyValue(selectedAgentInfo.properties, "agentVersion") }}</div>
              <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
              <div class="p-col-4"><b>{{ $t("computer.agent_info.created_date") }}</b></div>
              <div class="p-col-8">{{ selectedAgentInfo.createDate }}</div>
              <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
              <div class="p-col-4"><b>{{ $t("computer.agent_info.modified_date") }}</b></div>
              <div class="p-col-8">{{ selectedAgentInfo.updateDate }}</div>
              <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
            </div>
          <h4>{{ $t("computer.agent_info.disk_and_memory_info") }}</h4>
          <div class="p-grid">
            <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
            <div class="p-col-4"><b>{{ $t("computer.agent_info.total_disk") }}</b></div>
            <div class="p-col-8">
              {{
                (getPropertyValue(selectedAgentInfo.properties, "hardware.disk.total") / 1000)
                  .toFixed(2)
                  .toLocaleString("tr-TR")
              }}
            </div>
            <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
            <div class="p-col-4"><b>{{ $t("computer.agent_info.used_disk") }}</b></div>
            <div class="p-col-8">
              {{
                (getPropertyValue(selectedAgentInfo.properties, "hardware.disk.used") / 1000)
                  .toFixed(2)
                  .toLocaleString("tr-TR")
              }}
            </div>
            <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
            <div class="p-col-4"><b>{{ $t("computer.agent_info.available_disk") }})</b></div>
            <div class="p-col-8">
              {{
                ((getPropertyValue(selectedAgentInfo.properties, "hardware.disk.total") -
                    getPropertyValue(
                      selectedAgentInfo.properties,
                      "hardware.disk.used"
                    )) / 1000)
                  .toFixed(2)
                  .toLocaleString("tr-TR")
              }}
            </div>
            <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
            <div class="p-col-4"><b>{{ $t("computer.agent_info.disk_partitions") }}</b></div>
            <div class="p-col-8">
              {{ getPropertyValue(selectedAgentInfo.properties, "hardware.disk.partitions") }}
            </div>
            <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
            <div class="p-col-4"><b>{{ $t("computer.agent_info.memory") }}</b></div>
            <div class="p-col-8">
              {{
                (getPropertyValue(selectedAgentInfo.properties, "hardware.memory.total") / 1000)
                  .toFixed(2)
                  .toLocaleString("tr-TR")
              }}
            </div>
            <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
          </div>
          <h4>{{ $t("computer.agent_info.processor_info") }}</h4>
          <div class="p-grid">
            <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
            <div class="p-col-4"><b>{{ $t("computer.agent_info.processor") }}</b></div>
            <div class="p-col-8"> {{ getPropertyValue(selectedAgentInfo.properties, "processor") }}</div>
            <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
            <div class="p-col-4"><b>{{ $t("computer.agent_info.physical_core_count") }}</b></div>
            <div class="p-col-8">
              {{
                getPropertyValue(selectedAgentInfo.properties, "hardware.cpu.physicalCoreCount")
              }}
            </div>
            <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
          </div>
          </TabPanel>
          <TabPanel v-if="selectedLiderNode.type == 'AHENK'">
            <template #header>
                <i class="pi pi-users"></i>
                <span>
                    &nbsp;{{ $t('computer.agent_info.session_history') }}
                </span>
            </template>
            <DataTable :value="selectedAgentInfo.sessions"
              style="margin-top: 2em"  ref="dt" class="p-datatable-sm" 
              v-model:filters="filters"
              responsiveLayout="stack"
              :paginator="true" :rows="10"
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" 
              :rowsPerPageOptions="[10,25,50]">
              <template #header>
                <div class="p-d-flex p-jc-between">
                    <div style="text-align: left">
                        <Button v-if="selectedAgentInfo.sessions.length > 0"
                            class="p-button-sm" icon="pi pi-download"
                            :label="$t('computer.agent_info.export')"
                            @click="exportSessionsHistoryCSV($event)">
                        </Button>
                    </div>
                    <div class="p-d-flex p-jc-end">
                        <span class="p-input-icon-left">
                          <i class="pi pi-search" />
                          <InputText 
                            v-model="filters['global'].value" 
                            class="p-inputtext-sm" 
                            :placeholder="$t('computer.agent_info.search')" 
                          />
                        </span>
                    </div>
                </div>
              </template>
              <template #empty>
                <div class="p-d-flex p-jc-center">
                  <span>{{$t('computer.agent_info.sessions_table_empty_message')}}</span>
                </div>
              </template>
              <Column field="username" :header="$t('computer.agent_info.username')"></Column>
              <Column field="createDate" :header="$t('computer.agent_info.created_date')"></Column>
              <Column field="sessionEvent" :header="$t('computer.agent_info.status')">
                <template #body="slotProps">
                  <Badge
                    :value="slotProps.data.sessionEvent == 'LOGIN'? 
                    $t('computer.agent_info.login'): 
                    $t('computer.agent_info.logout')" 
                    :severity="slotProps.data.sessionEvent == 'LOGIN'? 'success': 'danger'">
                  </Badge>
                </template>
              </Column>
            </DataTable>
          </TabPanel>
      </TabView>
      <template #footer>
          <Button 
              :label="$t('group_management.close')" 
              icon="pi pi-times"
              @click="showAgentInfoDialog = false" 
              class="p-button-text p-button-sm">
          </Button>
      </template>
    </Dialog>
    <div>
      <base-plugin
        :pluginTask="task"
        @task-response="responseAgentInfo">
        <template #pluginTitle>
          <span v-if="selectedLiderNode">
            <i :class="selectedLiderNode.type == 'AHENK'? 'fab fa-linux': 'pi pi-folder-open'"></i>
            &nbsp; {{selectedLiderNode.name}}
          </span>
          <p v-else><i class="pi pi-folder-open"></i>&nbsp; Agents</p>
        </template>
        <template #pluginTitleButton>
          <div>
            <SplitButton class="p-button-sm" :title="$t('computer.agent_info.node_detail')" 
              @click="showNodeDetail" :model="selectedLiderNode && selectedLiderNode.type == 'AHENK'? items: folderItems"
              icon="pi pi-list">
            </SplitButton>
          </div>
        </template>
        <template #default>
            <div class="p-grid">
              <div class="p-col-4"><b><i class="el el-icon-turn-off"></i> {{ $t("computer.agent_info.status") }}</b></div>
              <div class="p-col-8">
                <Badge v-if="selectedLiderNode && selectedLiderNode.type == 'AHENK' && selectedAgentInfo" 
                  :value="selectedLiderNode.online ? $t('computer.agent_info.online'):$t('computer.agent_info.offline')" 
                  :severity="selectedLiderNode.online ?'success':'danger'">
                </Badge>
              </div>
              <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
              <div class="p-col-4"><b><i class="el el-icon-data-line"></i> {{ $t("computer.agent_info.hostname") }}</b></div>
              <div class="p-col-8" v-if="selectedLiderNode && selectedLiderNode.type == 'AHENK' && selectedAgentInfo">
                {{ selectedAgentInfo.hostname }}
              </div>
              <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
              <div class="p-col-4"><b><i class="el el-icon-location-outline"></i> {{ $t("computer.agent_info.location") }}</b></div>
              <div class="p-col-8" v-if="selectedLiderNode">{{ getEntryFolderName(selectedLiderNode.distinguishedName) }}</div>
              <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
              <div class="p-col-4" v-if="isUserDomain"><b><i class="pi pi-sitemap"></i> {{ $t("computer.agent_info.user_domain") }}</b></div>
              <div class="p-col-8" v-if="selectedLiderNode && selectedLiderNode.type == 'AHENK' && selectedAgentInfo">
                {{ selectedAgentInfo.userDirectoryDomain }}
              </div>
              <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
              <div class="p-col-4"><b><i class="el el-icon-data-analysis"></i> {{ $t("computer.agent_info.operating_system") }}</b></div>
              <div class="p-col-8" v-if="selectedLiderNode && selectedLiderNode.type == 'AHENK' && selectedAgentInfo">
                {{ getPropertyValue(selectedAgentInfo.properties, "os.version") }}
              </div>
              <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
              <div class="p-col-4"><b><i class="el el-icon-cpu"></i> {{ $t("computer.agent_info.processor") }}</b></div>
              <div class="p-col-8" v-if="selectedLiderNode && selectedLiderNode.type == 'AHENK' && selectedAgentInfo">
                {{ getPropertyValue(selectedAgentInfo.properties, "processor") }}
              </div>
              <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
              <div class="p-col-4"><b><i class="pi pi-wifi"></i> {{ $t("computer.agent_info.ip_addr") }}</b></div>
              <div class="p-col-8" v-if="selectedLiderNode && selectedLiderNode.type == 'AHENK' && selectedAgentInfo">
                {{ selectedAgentInfo.ipAddresses.replace(/'/g, "") }}
              </div>
              <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
              <div class="p-col-4"><b><i class="el el-icon-data-analysis"></i> {{ $t("computer.agent_info.mac") }}</b></div>
              <div class="p-col-8" v-if="selectedLiderNode && selectedLiderNode.type == 'AHENK' && selectedAgentInfo">
                {{ selectedAgentInfo.macAddresses.replace(/'/g, "") }}
              </div>
              <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
              <div class="p-col-4"><b><i class="fa fa-code-branch"></i> {{ $t("computer.agent_info.agent_version") }}</b></div>
              <div class="p-col-8" v-if="selectedLiderNode && selectedLiderNode.type == 'AHENK' && selectedAgentInfo">
                {{ getPropertyValue(selectedAgentInfo.properties, "agentVersion") }}
              </div>
              <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
              <div class="p-col-4"><b><i class="far fa-user"></i> {{ $t("computer.agent_info.last_logged_user") }}</b></div>
              <div class="p-col-8" v-if="selectedLiderNode && selectedLiderNode.type == 'AHENK' && selectedAgentInfo">
                {{ selectedLiderNode.o }}
              </div>
              <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
              <div class="p-col-4"><b><i class="pi pi-calendar-times"></i> {{ $t("computer.agent_info.created_date") }}</b></div>
              <div class="p-col-8" v-if="selectedLiderNode && selectedLiderNode.type == 'AHENK' && selectedAgentInfo">
                {{ selectedAgentInfo.createDate }}
              </div>
            </div>
            <div v-if="loading">
              <div class="p-text-center">
                <!-- <i style="font-size: 1.5rem" class="el el-icon-loading"></i>&nbsp; -->
                <ProgressSpinner
                  style="width: 20px; height: 20px"
                  strokeWidth="8"
                  fill="var(--surface-ground)"
                  animationDuration=".5s"
                />
                <a class="primary">
                  &nbsp;{{$t('computer.plugins.base_plugin.loading_default_text')}}
                </a>
              </div>
            </div>
        </template>
      </base-plugin>
    </div>
  </div>
</template>

<script>
/**
 * Agent info task. update, delete, move agent.
 * @see {@link http://www.liderahenk.org/}
 * 
 */

import { mapGetters } from "vuex";
import {FilterMatchMode} from 'primevue/api';
import TreeComponent from '@/components/Tree/TreeComponent.vue';
import { computerManagementService } from "../../../../../services/ComputerManagement/ComputerManagement.js";
import { taskService } from '../../../../../services/Task/TaskService.js';
import { userService } from "../../../../../services/Settings/UserService";

export default {
  
  props : {
    pluginTask: {
      type: Object,
      description: "Plugin task object",
    }
  },

  data() {
    return {
      showTaskDialog: false,
      task: null,
      loading: false,
      agentCn: "",
      isUserDomain: true,
      agentInfoModal: false,
      showAgentInfoDialog: false,
      selectedNodeSummaryData: [],
      attributesMultiValue: false,
      filters: {},
      selectedAgentInfo: null,
      deleteAgentConfirm: null,
      renameAgentDialog: false,
      validationRenameAgent: false,
      newHostname: "",
      updateAgentConfirm: false,
      addFolderDialog: false,
      deleteFolderDialog: false,
      folderName: '',
      validationFolderName: false,
      linuxIcon: require("@/assets/images/icons/linux.png"),
      folderItems: [
        {
          label: this.$t('computer.agent_info.add_folder'),
          icon: 'pi pi-folder-open',
          command: () => {
            if (this.selectedLiderNode && this.selectedLiderNode.type == "ORGANIZATIONAL_UNIT") {
              this.addFolderDialog = true;
            }
          }
        },
        {
          label: this.$t('computer.agent_info.delete_folder'),
          icon: 'pi pi-trash',
          command: () => {
            if (this.selectedLiderNode && this.selectedLiderNode.type == "ORGANIZATIONAL_UNIT") {
              this.deleteFolderDialog = true;
            }
          }
        },
      ],
      items: [
        {
          label: this.$t('computer.agent_info.update'),
          icon: 'pi pi-refresh',
          command: () => {
            if (this.selectedLiderNode && this.selectedLiderNode.type == "AHENK") {
              this.updateAgentConfirm = true;
            }
          }
        },
        {
          label: this.$t('computer.agent_info.rename'),
          icon: 'pi pi-pencil',
          command: () => {
            if (this.selectedLiderNode && this.selectedLiderNode.type == "AHENK") {
              if (!this.selectedLiderNode.online) {
                this.$toast.add({
                  severity:'warn', 
                  detail: this.$t("computer.agent_info.rename_warn"), 
                  summary:this.$t("computer.task.toast_summary"), 
                  life: 3000
                });
                return;
              }
              this.renameAgentDialog = true;
              this.newHostname = "";
              this.validationRenameAgent = false;
            }
          }
        },
        {
          label: this.$t('computer.agent_info.move_agent'),
          icon: 'el-icon-rank',
          command: () => {
            if (this.selectedLiderNode && this.selectedLiderNode.type == "AHENK") {
              this.moveAgentDialog = true;
            } 
          }
        },
        {
          label: this.$t('computer.agent_info.delete_client'),
          icon: 'pi pi-trash',
          command: () => {
            if (this.selectedLiderNode && this.selectedLiderNode.type == "AHENK") {
              this.deleteAgentConfirm = true;
            }
          }
        },
      ],
      moveFolderNode: null,
      moveAgentDialog: false,
      searchFields: [
        {
          key: this.$t('tree.folder'),
          value: "ou"
        },
      ],
    };
  },

  components: {
    TreeComponent
   },

  created() {
    this.task = {...this.pluginTask};
    this.filters = {
      'global': {value: null, matchMode: FilterMatchMode.CONTAINS}
    }
  },

  computed:mapGetters(["selectedLiderNode"]),

  mounted() {
    if (this.selectedLiderNode != null && this.selectedLiderNode.type == "AHENK") {
        this.getAgentInfo();
    }
  },

  watch: {
    selectedLiderNode() {
      if (this.selectedLiderNode) {
        if (this.selectedLiderNode != null && this.selectedLiderNode.type == "AHENK") {
        this.getAgentInfo();
      }
      this.getSelectedNodeAttribute();
      }
    },
    newHostname() {
      if (this.newHostname.trim()) {
        this.validationRenameAgent = false;
      }
    }
  },

  methods: {
    // ...mapActions(["setSelectedAgentInfo"]),

    async  getAgentInfo() {
      this.agentCn = this.selectedLiderNode.cn;
      const params = new URLSearchParams();
      params.append("agentJid", this.selectedLiderNode.uid);
      //axios.post("/api/select-agent-info/detail", params).then((response) => {
      const { response,error } = await taskService.agentInfoDetail(params);
      if(error){
        return "error";
      }
      else{
        if(response.status == 200){
          if (response.data != "" && response.data != null) {
          this.selectedAgentInfo = response.data;
          // this.setSelectedAgentInfo(response.data);
        } else {
          this.selectedAgentInfo = null;
          this.$toast.add({
            severity:'error', 
            detail: this.$t("computer.agent_info.error_message"), 
            summary:this.$t("computer.task.toast_summary"), 
            life: 3000
            });
          }
        }
        else if(response.status == 417){
          return "error";
        }
      }
    },

    setAgentInfo(property, value) {
      for (let index = 0; index < this.tableData.length; index++) {
        const element = this.tableData[index];
        if (element.property == property) {
          element.value = value;
        }
      }
    },

    getEntryFolderName(selDn) {
      let dnArr = selDn.split(",");
      let ous = "";
      for (let i = 0; i < dnArr.length; i++) {
        let dn = dnArr[i];
        if(dn.startsWith("ou")){
          let arr = dn.split("=");
          if(arr.length > 0){
            ous += arr[1]
            if(i < dnArr.length){
              ous +=" / ";
            }
          }
        }
      }
      ous = ous.trim().slice(0, -1);
      return ous;
    },

    showNodeDetail(){
      if (this.selectedLiderNode) {
        this.showAgentInfoDialog = true;
      } else {
        this.$toast.add({
          severity:'warn', 
          detail: this.$t("computer.agent_info.select_node_warn"), 
          summary:this.$t("computer.task.toast_summary"), 
          life: 3000
        });
      }
    },

    getPropertyValue(properties, propertyName) {
      var propertyValue = "";
      if (this.selectedLiderNode.type == "AHENK") {
        const filteredProperties = properties.filter(
        (property) => property.propertyName === propertyName
        );
        if (filteredProperties != null && filteredProperties.length > 0) {
          propertyValue = filteredProperties[0].propertyValue;
        }
      }
      return propertyValue;
    },

    showAgentInfoModal(show) {
      if (show) {
        this.agentInfoModal = true;
      } else {
        this.agentInfoModal = false;
      }
    },

    getSelectedNodeAttribute() {
      let nodeData = [];
      let nodeSummaryData = [];
      nodeSummaryData.push({
        'label': this.$t('computer.agent_info.name'),
        'value': this.selectedLiderNode.name,
        },
        {
          'label': this.$t('computer.agent_info.type'),
          'value': this.selectedLiderNode.type,
        });
      if (this.selectedLiderNode.type == "AHENK") {
        nodeData.push({
          'label': this.$t('computer.agent_info.uid'),
          'value': this.selectedLiderNode.uid
        });
      }
      nodeData.push({
        'label': this.$t('computer.agent_info.name'),
        'value': this.selectedLiderNode.name,
        }, 
        {
          'label': this.$t('computer.agent_info.node_dn'),
          'value': this.selectedLiderNode.distinguishedName,
        },
        {
          'label': this.$t('computer.agent_info.type'),
          'value': this.selectedLiderNode.type,
        },
        {
          'label': this.$t('computer.agent_info.created_date'),
          'value': this.selectedLiderNode.createDateStr,
        },
        {
          'label': this.$t('computer.agent_info.modified_date'),
          'value': this.selectedLiderNode.modifyDateStr,
        },
        {
          'label': this.$t('computer.agent_info.creator_name'),
          'value': this.selectedLiderNode.attributes.creatorsName,
        },
        {
          'label': this.$t('computer.agent_info.modifier_name'),
          'value': this.selectedLiderNode.attributes.modifiersName,
        });
      this.selectedLiderNode.attributesMultiValues.objectClass.map(oclas => {
        nodeData.push({
          'label': this.$t('computer.agent_info.objectclass'),
          'value' : oclas
        })
      });
      if (this.selectedLiderNode.type == "AHENK" && this.selectedLiderNode.attributesMultiValues.memberOf) {
          this.selectedLiderNode.attributesMultiValues.memberOf.map(memberOf => {
              nodeData.push({
                  'label': this.$t('node_detail.member_of_group'),
                  'value' : memberOf
              })
          });
      }
      this.selectedNodeData = nodeData;
      this.selectedNodeSummaryData = nodeSummaryData;
    },

    exportSessionsHistoryCSV() {
        this.$refs.dt.exportCSV();
    },

    moveTreeNodeClick(node) {
      //*** This method for tree that is created for folder move dialog.  */
      this.moveFolderNode = node;
    },

    async moveAgent() {
      if (this.moveFolderNode != null && this.moveFolderNode.type == "ORGANIZATIONAL_UNIT") {
        this.task.commandId = "MOVE_AGENT";
        const params = new FormData();
        params.append("sourceDN", this.selectedLiderNode.distinguishedName);
        params.append("sourceCN", this.selectedLiderNode.cn);
        params.append("destinationDN", this.moveFolderNode.distinguishedName);
        const{response,error} = await computerManagementService.moveEntry(params);
        if(error){
          this.$toast.add({
            severity:'error', 
            detail: this.$t("computer.agent_info.move_client_error")+"\n"+error, 
            summary:this.$t("computer.task.toast_summary"), 
            life: 3000
          });
        }
        else{
            if(response.status == 200){
              if (response.data) {
                // TO DO --> computer tree will be updated
                this.moveAgentDialog = false;
                this.$emit('moveSelectedAgent', this.selectedLiderNode, this.moveFolderNode.distinguishedName);
              }
            }
            else if(response.status == 417){
              this.$toast.add({
                severity:'error', 
                detail: this.$t("computer.agent_info.error_417_move_agent"), 
                summary:this.$t("computer.task.toast_summary"), 
                life: 3000
            });
          }
      }
      } 
      else {
        this.$toast.add({
          severity:'warn', 
          detail: this.$t("computer.agent_info.select_folder_warn"), 
          summary:this.$t("computer.task.toast_summary"), 
          life: 3000
        });
      }
    },

    async updateAgentInfo() {
      this.loading = true;
      this.updateAgentConfirm = false;
      this.task.commandId = "AGENT_INFO";
      const params = new FormData();
      params.append("agentDN", this.selectedLiderNode.distinguishedName);
      const{response,error} = await computerManagementService.getAgentInfo(params);
      if (!response.data) {
        this.$toast.add({
          severity:'error', 
          detail: this.$t("computer.agent_info.delete_client_error"), 
          summary:this.$t("computer.task.toast_summary"), 
          life: 3000
        });
      }
  
    },

    async deleteAgent() {
      this.task.commandId = "DELETE_AGENT";
      const params = new FormData();
      this.deleteAgentConfirm = false;
      params.append("agentDN", this.selectedLiderNode.distinguishedName);
      params.append("agentUID", this.selectedLiderNode.uid);
      const{response,error} = await computerManagementService.deleteAgent(params);
      if(error){
        this.$toast.add({
          severity:'error', 
          detail: this.$t("computer.agent_info.delete_client_error")+"\n"+error, 
          summary:this.$t("computer.task.toast_summary"), 
          life: 3000
        });
      }
      else{
        if (response.data) {
          this.$emit('deleteSelectedAgent', this.selectedLiderNode);
        } else {
          this.$toast.add({
            severity:'error', 
            detail: this.$t("computer.agent_info.delete_client_error"), 
            summary:this.$t("computer.task.toast_summary"), 
            life: 3000
          });
        }
      }
    },

    async renameAgent() {
      if (!this.newHostname.trim()) {
        this.validationRenameAgent = true;
        return;
      }
      this.task.commandId = "RENAME_ENTRY";
      this.renameAgentDialog = false;
      const params = new FormData();
      params.append("agentDN", this.selectedLiderNode.distinguishedName);
      params.append("cn", this.selectedLiderNode.cn);
      params.append("newHostname", this.newHostname);
      const{response,error} = await computerManagementService.renameAgent(params);
      if(error){
        this.$toast.add({
          severity:'error', 
          detail: this.$t("computer.agent_info.rename_error")+"\n"+error, 
          summary:this.$t("computer.task.toast_summary"), 
          life: 3000
        });
      }
      else{
        if(response.status == 200){
          if (response.data) {
            let newDn = this.selectedLiderNode.distinguishedName.replace("cn="+this.selectedLiderNode.cn, "cn="+this.newHostname);
            this.selectedLiderNode.distinguishedName = newDn;
            this.selectedLiderNode.name = this.newHostname;
            this.selectedLiderNode.cn = this.newHostname;
            this.selectedLiderNode.uid = this.newHostname;
            this.selectedLiderNode.attributes.uid = this.newHostname;
            this.selectedLiderNode.attributes.cn = this.newHostname;
            this.selectedLiderNode.attributes.entryDN = newDn;
            this.$emit('renameSelectedAgent', this.selectedLiderNode);
              this.$toast.add({
                severity:'success', 
                detail: this.$t("computer.agent_info.rename_success"), 
                summary:this.$t("computer.task.toast_summary"), 
                life: 5000
              });
        } 
          else {
            this.$toast.add({
              severity:'error', 
              detail: this.$t("computer.agent_info.delete_client_error"), 
              summary:this.$t("computer.task.toast_summary"), 
              life: 3000
            });
          }
        }
        else if (error.response.status == 409) {
          this.$toast.add({
            severity:'error', 
            detail: this.$t("computer.agent_info.rename_same_hostname_error"), 
            summary:this.$t("computer.task.toast_summary"), 
            life: 5000
            });
          }
      }
    },

    async responseAgentInfo(message) {
      if (message.commandClsId == "AGENT_INFO") {
        this.loading = false;
        var arrg = JSON.parse(message.result.responseDataStr);
        if (arrg) {
          let phase = null;
          let processor = null;
          if (arrg.hasOwnProperty('phase')) {
            phase = arrg.phase;
          }
          if (arrg.hasOwnProperty('processor')) {
            processor = arrg.processor;
          }
          const params = new FormData();
          params.append("ipAddresses", arrg.ipAddresses);
          params.append("hostname", arrg.hostname);
          params.append("agentVersion", arrg.agentVersion);
          params.append("macAddresses", arrg.macAddresses);
          params.append("phase", phase);
          params.append("osVersion", arrg.osVersion);
          params.append("agentUid", this.selectedLiderNode.uid);
          const{response,error} = await computerManagementService.updateAgentInfo(params);
          if(error){
            this.$toast.add({
                severity:'error', 
                detail: this.$t("computer.agent_info.delete_client_error"), 
                summary:this.$t("computer.task.toast_summary"), 
                life: 3000
              });
          }
          else{
            if(response.status == 200){
              if (response.data) {
              // TO DO --> computer tree will be updated
                this.selectedAgentInfo = response.data
              } 
            }
            else if(response.status == 417){
              this.$toast.add({
                severity:'error', 
                detail: this.$t("computer.agent_info.error_417_update_agent_info"), 
                summary:this.$t("computer.task.toast_summary"), 
                life: 3000
              });
            }


          }
        }
      }
    },

    async addFolder() {
      if (!this.folderName.trim()) {
        this.validationFolderName = true;
        return;
      }
      let params = new FormData();
      params.append("parentName", this.selectedLiderNode.distinguishedName);
      params.append("ou", this.folderName);
      //axios.post('/api/lider/user/add-ou', params).then(response => {
      const{ response,error } = await userService.addOu(params);
      if(error){
        return "error";
      }
      else{
        if(response.status == 200){
          this.$emit('addFolder', response.data, this.selectedLiderNode.distinguishedName);
          this.$toast.add({
              severity:'success', 
              detail: this.$t('computer.agent_info.add_folder_success'), 
              summary:this.$t("computer.task.toast_summary"), 
              life: 3000
          });
        }
        else if(response.status == 417){
          return "error";
        }
      }
        
      this.folderName = '';
      this.addFolderDialog = false;
    },

    async deleteFolder() {
      let ldapEntry = [];
      ldapEntry.push({
        "distinguishedName": this.selectedLiderNode.distinguishedName,
        "entryUUID": this.selectedLiderNode.entryUUID,
        "type": this.selectedLiderNode.type,
        "uid": this.selectedLiderNode.uid
      });

      const{response,error} = await computerManagementService.deleteComputerOu(ldapEntry);
      if(error){
        this.$toast.add({
              severity:'warn', 
              detail: this.$t('computer.agent_info.no_delete_folder_warn'), 
              summary:this.$t("computer.task.toast_summary"), 
              life: 3000
          });
      }
      else{
        if(response.status == 200){
          if (response.data) {
            this.$emit('deleteSelectedAgent', this.selectedLiderNode);
            this.$toast.add({
                severity:'success', 
                detail: this.$t('computer.agent_info.delete_folder_success'), 
                summary:this.$t("computer.task.toast_summary"), 
                life: 3000
            });
      }   else {
            this.$toast.add({
                severity:'warn', 
                detail: this.$t('computer.agent_info.no_delete_folder_warn'), 
                summary:this.$t("computer.task.toast_summary"), 
                life: 3000
            });
        }


        }
        else if(response.status == 417){
          this.$toast.add({
              severity:'error', 
              detail: this.$t('computer.agent_info.error_417_delete_computer_ou'), 
              summary:this.$t("computer.task.toast_summary"), 
              life: 3000
          });
        }
      }
      this.deleteFolderDialog = false;

    }
  },
};
</script>

<style lang="scss" scoped>
.dashboard .task-list {
    list-style-type: none;
    margin: 0;
    padding: 0;
}
.p-splitbutton {
    /* height: 2rem; */
    height: 33px;
  
}
::v-deep(.p-paginator) {
    .p-paginator-current {
        margin-left: auto;
    }
}
::v-deep(.p-datatable.p-datatable-customers) {
    .p-paginator {
        padding: 1rem;
    }
}
</style>
