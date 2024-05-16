<template>
  <Dialog :style="{ width: '20vw' }" :header="$t('computer.task.toast_summary')"
    v-model:visible="remoteAccessConfirmDialog" 
    :modal="true"
    >
    <div class="confirmation-content">
      <span v-if="selectedProtocol === 'vnc'">
        <i class="pi pi-info-circle" style="font-size: 1.5rem"></i>&nbsp;
        {{ $t('computer.plugins.remote_access.remote_desktop_access_will_be_provided_are_you_sure') }}
      </span>
      <span v-if="selectedProtocol === 'ssh'">
        <i class="pi pi-info-circle" style="font-size: 1.5rem"></i>&nbsp;
        {{ $t('computer.plugins.remote_access.ssh_access_will_be_provided_are_you_sure') }}
      </span>
      <span v-if="selectedProtocol === 'rdp'">
        <i class="pi pi-info-circle" style="font-size: 1.5rem"></i>&nbsp;
        {{ $t('computer.plugins.remote_access.remote_desktop_access_will_be_provided_are_you_sure') }}
      </span>
    </div>
    <template #footer>
      <Button :label="$t('computer.plugins.base_plugin.no')" 
        icon="pi pi-times" 
        @click="remoteAccessConfirmDialog = false"
        class="p-button-text p-button-sm" 
      />
      <Button :label="$t('computer.plugins.base_plugin.yes')" 
        icon="pi pi-check" 
        @click="connectRemoteAccess"
        class="p-button-sm" 
      />
    </template>
  </Dialog>

  <div>
    <Card>
      <template #title>
        <div class="p-d-flex p-jc-between">
          <div style="font-size:15px;">
            {{ $t("computer.plugins.remote_access.header") }}
          </div>
          <div>
            <Button icon="pi pi-play" 
              class="p-button-raised p-button-sm"
              :title="$t('computer.plugins.remote_access.connect')" 
              @click.prevent="showRemoteAccessConfirmDialog">
            </Button>
          </div>
        </div>
        <hr style="margin-bottom:-5px">
      </template>

      <template #content>
        <div class="p-fluid">
          <div class="p-field p-col-6">
            <label>{{ $t('computer.plugins.remote_access.remote_access_option') }}</label>
            <Dropdown 
              v-model="selectedProtocol" 
              :options="protocols" 
              optionLabel="label" 
              optionValue="value">
            </Dropdown>
          </div>
        </div>

        <Fieldset class="p-field p-col-6" v-if="selectedProtocol === 'vnc'"
          :legend="$t('computer.plugins.remote_access.remote_access_options')">
          <div class="p-col-12">
            <div class="p-field-radiobutton">
              <RadioButton id="remoteAccessType1" 
                name="yes" 
                value="yes" 
                v-model="permission" 
              />
              <label for="remoteAccessType1">
                {{ $t('computer.plugins.remote_access.enable_user_permission_and_notification') }}
              </label>
            </div>
            <div class="p-field-radiobutton">
              <RadioButton id="remoteAccessType2" 
                name="without_notify" 
                value="without_notify" 
                v-model="permission" 
              />
              <label for="remoteAccessType2">
                {{ $t('computer.plugins.remote_access.disable_user_permission_and_notification') }}
              </label>
            </div>
          </div>
        </Fieldset>

        <Fieldset class="p-fluid p-col-6" v-if="selectedProtocol === 'ssh'"
          :legend="$t('computer.plugins.remote_access.ssh_connection_settings')">
          <div class="p-field p-col-12">
            <label>{{ $t('computer.plugins.remote_access.ip_address') }}</label>
            <div class="p-inputgroup">
              <InputText type="text" 
                v-model="host" 
                :class="validationHost ? 'p-invalid' : ''"
                placeholder="192.168.*.*" 
              />
              <Button icon="pi pi-undo" 
                :title="$t('computer.plugins.remote_access.get_ip_address')"
                @click="getIpAddress" 
              />
            </div>
            <small v-show="validationHost" class="p-error">
              {{ $t('computer.plugins.remote_access.ip_address_cannot_be_null') }}
            </small>
          </div>
          <div class="p-field p-col-12">
            <label>{{ $t('computer.plugins.remote_access.username') }}</label>
            <InputText type="text" 
              v-model="username" 
              :class="validationUsername ? 'p-invalid' : ''"
              :placeholder="$t('computer.plugins.remote_access.username')" 
            />
            <small v-show="validationUsername" class="p-error">
              {{ $t('computer.plugins.remote_access.username_cannot_be_null') }}
            </small>
          </div>
          <div class="p-field p-col-12">
            <label>{{ $t('computer.plugins.remote_access.user_password') }}</label>
            <Password 
              :class="validationPassword ? 'p-invalid' : ''" 
              v-model="password" 
              :feedback="false" 
              toggleMask
              :placeholder="$t('computer.plugins.remote_access.user_password_cannot_be_null')" />
            <small v-show="validationPassword" class="p-error">
              {{ $t('computer.plugins.remote_access.user_password_cannot_be_null') }}
            </small>
          </div>
        </Fieldset>

        <Fieldset class="p-fluid p-col-12" v-if="selectedProtocol === 'rdp'"
          :legend="$t('computer.plugins.remote_access.rdp_connection')">
          <div class="p-col-12">
            <TabMenu :model="tabList" class="p-mb-3" />
            <div v-if="selectedTab == 'new-rdp-connection'">
              <div class="p-col-6">
                <Card>
                  <template #title>
                    <h4>{{ $t('computer.plugins.remote_access.connection_information') }}</h4>
                  </template>
                  <template #content>
                    <div class="p-field p-col-12">
                      <label>{{ $t('computer.plugins.remote_access.registered_connections') }}</label>
                      <div class="p-inputgroup">
                        <Dropdown 
                          :options="savedRdpClientList" 
                          optionLabel="hostandhostname" 
                          v-model="savedRdpClient"
                          :filter="true" 
                          :filterPlaceholder="$t('computer.plugins.remote_access.find_client')"
                          :placeholder="$t('computer.plugins.remote_access.select_registered_connection')"
                        >
                          <template #option="{ option }">
                            <div class="p-d-flex p-ai-center">
                                <i class="pi pi-desktop p-mr-2"></i>
                                <div>{{ option.host }} - {{ option.hostname }}</div>
                            </div>
                          </template>
                        </Dropdown>

                        <Button 
                          :label="$t('computer.plugins.remote_access.clear')" 
                          icon="fas fa-backspace"
                          class="p-button-raised p-button-sm p-ml-2" 
                          @click="clearSelectedRdpClient()" 
                        />
                      </div>
                    </div>
                    <div class="p-field p-col-12">
                      <label>{{ $t('computer.plugins.remote_access.ip_address') }}</label>
                      <div class="p-inputgroup">
                        <InputText type="text" 
                          v-model="host" 
                          :class="validationHost ? 'p-invalid' : ''"
                          placeholder="192.168.*.*" 
                        />
                      </div>
                      <small v-show="validationHost" class="p-error">
                        {{ $t('computer.plugins.remote_access.ip_address_cannot_be_null') }}
                      </small>
                    </div>
                    <div class="p-field p-col-12">
                      <label>{{ $t('computer.plugins.remote_access.username') }}</label>
                      <InputText type="text" 
                        v-model="username" 
                        :class="validationUsername ? 'p-invalid' : ''"
                        :placeholder="$t('computer.plugins.remote_access.username')" 
                      />
                      <small v-show="validationUsername" class="p-error">
                        {{ $t('computer.plugins.remote_access.username_cannot_be_null') }}
                      </small>
                    </div>
                    <div class="p-field p-col-12">
                      <label>{{ $t('computer.plugins.remote_access.user_password') }}</label>
                      <Password 
                        :class="validationPassword ? 'p-invalid' : ''" 
                        v-model="password" 
                        :feedback="false"
                        toggleMask :placeholder="$t('computer.plugins.remote_access.user_password_cannot_be_null')" 
                      />
                      <small v-show="validationPassword" class="p-error">
                        {{ $t('computer.plugins.remote_access.user_password_cannot_be_null') }}
                      </small>
                    </div>
                  </template>
                </Card>
              </div>
            </div>

            <div v-if="selectedTab == 'saved-rdp-connections'">
              <div class="p-col-12">
                <div>
                  <Card>
                    <template #title>
                      <div style="display: flex; justify-content: end;">
                        <div>
                          <Button 
                            :label="$t('computer.plugins.remote_access.add_new_client')" 
                            icon="pi pi-plus"
                            class="p-button-raised p-button-sm" 
                            @click="addNewRdpClient()" 
                          />
                        </div>
                      </div>
                    </template>
                    <template #content>
                      <DataTable :value="savedRdpClientList" :loading="loading">
                        <Column field="id" header="#" style="width: 5%">
                          <template #body="{ index }">
                            <span>{{ ((currentPage - 1)*rowNumber) + index + 1 }}</span>
                          </template>
                        </Column>
                        <Column field="host" 
                          :header="$t('computer.plugins.remote_access.ip_address')" 
                          style="width: 15%">
                        </Column>
                        <Column field="username" 
                          :header="$t('computer.plugins.remote_access.username')"
                          style="width: 15%">
                        </Column>
                        <Column field="hostname" 
                          :header="$t('computer.plugins.remote_access.hostname')"
                          style="width: 20%">
                        </Column>
                        <Column field="description" 
                          :header="$t('computer.plugins.remote_access.description_field')"
                          style="width: 35%">
                        </Column>
                        <Column header="" style="width: 15%">
                          <template #body="slotProps">
                            <div class="p-d-flex p-jc-end">
                              <Button icon="pi pi-pencil" 
                                v-tooltip.bottom="$t('computer.plugins.remote_access.edit')"
                                class="p-button-sm p-mr-2 p-button-warning" 
                                @click="addNewRdpClient(slotProps.data)" 
                              />
                              <Button icon="pi pi-trash" 
                                class="p-button-sm p-button-danger"
                                v-tooltip.bottom="$t('computer.plugins.remote_access.delete')"
                                @click.prevent="deleteRdpClientConfirmDialog = true; 
                                selectedRdpClient = slotProps.data" 
                              />
                            </div>
                          </template>
                        </Column>
                      </DataTable>
                      <Paginator v-model:first="offset" 
                        :rows="10" 
                        :totalRecords="resultCount"
                        @page="onPageChanged($event)">
                      </Paginator>
                    </template>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </Fieldset>
      </template>

      <template #footer>
        <div class="p-col p-as-start">
          <a class="primary" type="secondary" @click="toggle"
            v-tooltip.right="$t('computer.plugins.plugin_popover.title')">
            <i class="el el-icon-question"></i>
          </a>
          <OverlayPanel ref="op" 
            appendTo="body" 
            :showCloseIcon="false" 
            id="overlay_panel" 
            style="width: 450px"
            :breakpoints="{ '960px': '75vw' }">
            <div>
              <h5>{{ $t('computer.plugins.plugin_popover.title') }}</h5>
            </div>
            <ul>
              <li>
                <small>{{ pluginDescription }}</small>
              </li>
            </ul>
            <i class="pi pi-link"></i>
            &nbsp;
            <a 
              :href="pluginUrl" 
              type="primary" 
              target="_blank">
              {{ $t('computer.plugins.plugin_popover.for_more_info') }}...
            </a>
          </OverlayPanel>
        </div>
      </template>
    </Card>
  </div>


  <AddNewRdpClientDialog v-if="showAddNewRdpClientDialog" 
    :showAddNewRdpClientDialog="showAddNewRdpClientDialog"
    @closeNewRdpClientDialog="showAddNewRdpClientDialog = false" 
    :selectedRdpClient="selectedRdpClient"
    @saveRdpClient="saveRdpClient" 
  />

  <Dialog 
    :header="$t('computer.plugins.remote_access.delete_registered_client')"
    v-model:visible="deleteRdpClientConfirmDialog" 
    :modal="true" @hide="deleteRdpClientConfirmDialog = false"
  >
    <div class="confirmation-content">
      <i class="pi pi-info-circle p-mr-3" style="font-size: 2rem" />
      <span>{{ $t('computer.plugins.remote_access.registered_client_will_be_deleted_are_you_sure') }}</span>
    </div>
    <template #footer>
      <Button :label="$t('computer.plugins.remote_access.cancel')" 
        icon="pi pi-times" 
        @click="deleteRdpClientConfirmDialog = false"
        class="p-button-text p-button-sm" 
      />
      <Button :label="$t('computer.plugins.remote_access.yes')" 
        icon="pi pi-check" 
        @click="deleteSavedRdpClient(selectedRdpClient)" 
        class="p-button-sm" 
      />
    </template>
  </Dialog>
</template>

<script>
/**
 * Remote access with guacd
 * commandId: SETUP-VNC-SERVER
 * @see {@link http://www.liderahenk.org/}
 * 
 */

import { taskService } from '../../../../../services/Task/TaskService.js';
import { remoteAccessService } from "../../../../../services/ComputerManagement/RemoteAccess.js"
import AddNewRdpClientDialog from "./AddNewRdpClientDialog.vue";
import { mapGetters } from "vuex";

export default {
  components: {
    AddNewRdpClientDialog,
  },
  data() {
    return {
      pluginDescription: this.$t("computer.plugins.remote_access.description"),
      pluginUrl: "https://docs.liderahenk.org/lider3.0/computerManagement/computerManagement/remoteAccess/",
      permission: "yes",
      protocols: [
        { label: this.$t('computer.plugins.remote_access.connect_with_vnc'), value: 'vnc' },
        { label: this.$t('computer.plugins.remote_access.connect_with_ssh'), value: 'ssh' },
        { label: this.$t('computer.plugins.remote_access.connect_with_rdp'), value: 'rdp' },
      ],
      selectedProtocol: 'vnc',
      username: "",
      password: "",
      host: "",
      validationPassword: false,
      validationUsername: false,
      validationHost: false,
      remoteAccessConfirmDialog: false,
      deleteRdpClientConfirmDialog: false,
      selectedRdpClient: null,
      savedRdpClient: null,
      savedRdpClientList: null,
      selectedTab: "new-rdp-connection",
      showAddNewRdpClientDialog: false,
      currentPage: 1,
      rowNumber: 10,
      ordering: null,
      resultCount: 0,
      offset: 1,
      tabList: [
        { label: this.$t('computer.plugins.remote_access.connection'), icon: "pi pi-link", command: () => { this.setSelectedTab('new-rdp-connection') } },
        { label: this.$t('computer.plugins.remote_access.registered_clients'), icon: "fa fa-desktop", command: () => { this.setSelectedTab('saved-rdp-connections') } },
      ],
      loading: false,
      lideruser: ""
    };
  },


  methods: {
    showRemoteAccessConfirmDialog() {
      if (this.selectedProtocol == "vnc") {
        if (this.selectedLiderNode == null ||
          this.selectedLiderNode.type != "AHENK") {
          this.$toast.add({
            severity: 'warn',
            detail: this.$t("computer.task.selected_agent_warn"),
            summary: this.$t("computer.task.toast_summary"),
            life: 5000
          });
          return;
        }
      } else if (this.selectedProtocol == "ssh") {
        if (!this.host.trim()) {
          this.validationHost = true;
          return;
        }
        if (!this.username.trim()) {
          this.validationUsername = true;
          return;
        }
        if (!this.password.trim()) {
          this.validationPassword = true;
          return;
        }
      } else if (this.selectedProtocol == "rdp") {
        if (!this.host.trim()) {
          this.validationHost = true;
          return;
        }
        if (!this.username.trim()) {
          this.validationUsername = true;
          return;
        }
        if (!this.password.trim()) {
          this.validationPassword = true;
          return;
        }
      }
      this.remoteAccessConfirmDialog = true;
    },

    async getSavedRdpClient(nextPage) {
      this.currentPage = nextPage
      this.loading = true;
      let params = {
        page: nextPage,
        size: this.rowNumber
      }
      const { response, error } = await remoteAccessService.listClients(params);
      if (error) {
        this.$toast.add({
          severity: 'error',
          detail: this.$t('computer.plugins.remote_access.error_fetching_the_saved_clients'),
          summary: this.$t("computer.task.toast_summary"),
          life: 3000
        });
      }
      else {
        this.savedRdpClientList = response.data.content;
        this.resultCount = response.data.totalElements
      }
      this.loading = false;
    },

    async saveRdpClient(event, data) {
      if (event == "added") {

        let saveRdpClientResponse = null
        let params = {
          host: data.host,
          username: data.username,
          hostname: data.hostname,
          description: data.description,
        }

        const { response, error } = await remoteAccessService.saveClient(params)
        if (error) {
          if (error.response.status == "409") {
            this.$toast.add({
              severity: 'warn',
              detail: this.$t('computer.plugins.remote_access.client_already_exists'),
              summary: this.$t("computer.task.toast_summary"),
              life: 3000
            });
          }
          else {
            this.$toast.add({
              severity: 'error',
              detail: this.$t('computer.plugins.remote_access.error_adding_the_client'),
              summary: this.$t("computer.task.toast_summary"),
              life: 3000
            });
          }
        }
        else {
          this.$toast.add({
          severity: 'success',
          summary: this.$t("computer.task.toast_summary"),
          detail: this.$t("computer.plugins.remote_access.client_added_successfully"),
          life: 3000
        });

          saveRdpClientResponse = response;
          this.getSavedRdpClient(this.currentPage);
        }

      } else {

        let updateRdpClientResponse = null
        let params = {
          id: data.id,
          host: data.host,
          username: data.username,
          hostname: data.hostname,
          description: data.description,
        }

        const { response, error } = await remoteAccessService.updateClient(params)

        if (error) {
          if (error.response.status == "409") {
            this.$toast.add({
              severity: 'warn',
              detail: this.$t('computer.plugins.remote_access.client_already_exists'),
              summary: this.$t("computer.task.toast_summary"),
              life: 3000
            });
          }
          else {
            this.$toast.add({
              severity: 'error',
              detail: this.$t('computer.plugins.remote_access.error_updating_the_client'),
              summary: this.$t("computer.task.toast_summary"),
              life: 3000
            });
          }
        }
        else {
          this.$toast.add({
          severity: 'success',
          summary: this.$t("computer.task.toast_summary"),
          detail: this.$t("computer.plugins.remote_access.client_updated_successfully"),
          life: 3000
        });

          updateRdpClientResponse = response;
          this.getSavedRdpClient(this.currentPage);
        }
      }
      this.showAddNewRdpClientDialog = false;
    },

    async deleteSavedRdpClient(data) {
      const { response, error } = await remoteAccessService.deleteClient(data.id)

      if (error) {
        this.$toast.add({
          severity: 'error',
          detail: this.$t('computer.plugins.remote_access.error_deleting_the_client'),
          summary: this.$t("computer.task.toast_summary"),
          life: 3000
        });
      }
      else {
        this.deleteRdpClientConfirmDialog = false;
        this.getSavedRdpClient(this.currentPage);

        this.$toast.add({
          severity: 'success',
          summary: this.$t("computer.task.toast_summary"),
          detail: this.$t("computer.plugins.remote_access.client_deleted_successfully"),
          life: 3000
        });
        this.selectedRdpClient = null;
      }
    },

    addNewRdpClient(data) {
      this.selectedRdpClient = data;
      this.showAddNewRdpClientDialog = true;
    },

    selectSavedRdpClient(data) {
      this.username = data.username;
      this.host = data.host;
    },

    clearSelectedRdpClient() {
      this.savedRdpClient = null;
      this.username = "";
      this.password = "";
      this.host = "";
    },

    setSelectedTab(tab) {
      this.savedRdpClient = null;
      this.username = "";
      this.password = "";
      this.host = "";
      this.selectedTab = tab;
    },

    connectRemoteAccess() {
      let data = {
        "dn": this.selectedProtocol == 'vnc' ? this.selectedLiderNode.distinguishedName : null,
        "uid": this.selectedProtocol == 'vnc' ? this.selectedLiderNode.uid : null,
        "protocol": this.selectedProtocol,
        "permission": this.selectedProtocol == 'vnc' ? this.permission : null,
        "username": this.selectedProtocol === 'ssh' ? this.username : this.selectedProtocol === 'rdp' ? this.username : null,
        "password": this.selectedProtocol === 'ssh' ? this.password : this.selectedProtocol === 'rdp' ? this.password : null,
        "host": this.selectedProtocol == 'ssh' ? this.host : null,
        "lideruser": this.lideruser,
      }

      // if selected protocol is vnc added remote connection info to vuex
      if (this.selectedProtocol == "vnc") {
        this.$store.dispatch('addRemoteConnections', data).then(() => {
          let routeData = this.$router.resolve({
            path: '/remote-access',
            query: {
              uid: this.selectedProtocol == 'vnc' ? this.selectedLiderNode.uid : null,
              protocol: this.selectedProtocol
            }
          });
          window.open(routeData.href, '_blank');
        });
      } else if (this.selectedProtocol == "ssh") {
        let routeData = this.$router.resolve({
          path: '/remote-access',
          query: {
            username: this.username,
            password: this.password,
            host: this.host,
            protocol: this.selectedProtocol,
            lideruser: this.lideruser
          }
        });
        window.open(routeData.href, '_blank');
      } else if (this.selectedProtocol == "rdp") {
        let routeData = this.$router.resolve({
          path: '/remote-access',
          query: {
            username: this.username,
            password: this.password,
            host: this.host,
            protocol: this.selectedProtocol,
            lideruser: this.lideruser
          }
        });
        window.open(routeData.href, '_blank');
      }
      this.remoteAccessConfirmDialog = false;
    },

    async getIpAddress() {
      if (this.selectedLiderNode == null ||
        this.selectedLiderNode.type != "AHENK") {
        this.$toast.add({
          severity: 'warn',
          detail: this.$t("computer.task.selected_agent_warn"),
          summary: this.$t("computer.task.toast_summary"),
          life: 5000
        });
        return;
      }
      const params = new FormData();
      params.append("agentJid", this.selectedLiderNode.uid);

      const { response, error } = await taskService.agentInfoDetail(params);
      if (error) {
        this.$toast.add({
          severity: 'error',
          detail: this.$t('computer.plugins.remote_access.an_error_occurred_while_fetching_the_ip_address'),
          summary: this.$t("computer.task.toast_summary"),
          life: 3000
        });
      }
      else {
        if (response.status == 200) {
          if (response.data != "" && response.data != null) {
            this.host = response.data.ipAddresses.replace(/'/g, "");
          }
        }
        else if (response.status == 417) {
          this.$toast.add({
            severity: 'error',
            detail: this.$t('computer.plugins.remote_access.error_417_fetching_ip_address'),
            summary: this.$t("computer.task.toast_summary"),
            life: 3000
          });
        }
      }
    },

    toggle(event) {
      this.$refs.op.toggle(event);
    },

    async onPageChanged(event) {
      const nextPage = event.page + 1;
      if (nextPage != this.currentPage) {
        this.getSavedRdpClient(nextPage);
      }
    },

    addHostAndHostnameToRdpClientList() {
      if (this.savedRdpClientList != null) {
        for (let index = 0; index < this.savedRdpClientList.length; index++) {
          const element = this.savedRdpClientList[index];
          element.hostandhostname = element.host + " - " + element.hostname;
        }
      }
    }
  },

  computed: {
    paginatorTemplate() {
      return `{FirstPageLink} {PreviousPageLink} {PageLinks} {NextPageLink} {LastPageLink}`;
    },
    ...mapGetters(["selectedLiderNode"]),
  },

  async mounted() {
    await this.getSavedRdpClient(1);
    this.addHostAndHostnameToRdpClientList();
    this.lideruser = this.$store.getters.getUser.uid;
  },

  watch: {
    username() {
      if (this.username.trim()) {
        this.validationUsername = false;
      }
    },

    password() {
      if (this.password.trim()) {
        this.validationPassword = false;
      }
    },

    host() {
      if (this.host.trim()) {
        this.validationHost = false;
      }
    },

    selectedProtocol() {
      this.username = "";
      this.password = "";
      this.host = "";
    },

    savedRdpClient() {
      if (this.savedRdpClient != null) {
        this.selectSavedRdpClient(this.savedRdpClient);
      }
    },

    savedRdpClientList() {
      this.addHostAndHostnameToRdpClientList();
    }
  },
}

</script>

<style lang="scss" scoped>
::v-deep(.p-paginator) {
    .p-component {
        margin-left: auto;
    }
}
</style>
