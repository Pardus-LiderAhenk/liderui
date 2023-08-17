<template>
  <slot name="search">
    <div class="p-fluid p-grid">
      <div class="p-col-12">
        <Button type="button" :label="$t('tree.advanced_search')"
          @click="advancedSearchOpToogle($event)" icon="pi pi-search" 
          class="p-button-sm  p-button-outlined"
        />
      </div>
    </div>
    <OverlayPanel ref="advancedSearchOp"
      appendTo="body"
      :showCloseIcon="false" 
      id="overlay_panel" 
      :style="{width: '25vw'}" 
      :breakpoints="{'960px': '75vw'}"
      >
      <div class="p-grid p-flex-column">
        <div class="p-col p-fluid">
           <label style="font-weight: bold;">{{$t('tree.search_dn')}}:</label>
              <a v-if="selectedNode && (selectedNode.type == 'ORGANIZATIONAL_UNIT' || selectedNode.type == 'CONTAINER')">
                &nbsp;{{selectedNode.name}}
              </a>
              <a v-else>
                &nbsp;{{rootNode.name}}
              </a>
        </div>
        <div class="p-col">
          <div class="p-fluid p-formgrid p-grid">
            <div class="p-field p-col-12 p-md-5">
              <label>{{$t('tree.search_field')}}</label>
              <Dropdown
                v-model="search.type" 
                :options="searchFields" 
                optionValue="value" 
                optionLabel="key" 
                placeholder="Select">
              </Dropdown>
              <small v-show="searchValidation.type" class="p-error">
                {{ $t('tree.search_field_warn') }}
              </small>
            </div>
            <div class="p-field p-col-12 p-md-7">
              <label>{{$t('tree.search_value')}}</label>
              <InputText 
                :class="searchValidation.text ? 'p-invalid p-inputtext-sm': 'p-inputtext-sm'"  
                type="text" v-model="search.text">
              </InputText>
              <small v-show="searchValidation.text" class="p-error">
                {{ $t('tree.search_value_warn') }}
              </small>
            </div>
          </div>
        </div>
        <div class="p-col">
          <div class="p-col p-grid p-jc-end">
            <Button 
              :label="$t('tree.search')"
              icon="pi pi-search" 
              @click="searchTree"
              class="p-button-sm"
            />
          </div>
        </div>
      </div>
      <div v-if="searchLoading">
        <!-- <ProgressBar mode="indeterminate" style="height: .5em" /> -->
        <ProgressSpinner
          style="width: 20px; height: 20px"
          strokeWidth="8"
          fill="var(--surface-ground)"
          animationDuration=".5s"
        />
        <a class="primary">&nbsp;{{$t('tree.searching')}}</a>
      </div>
    </OverlayPanel>
  </slot>

  <!-- tabview menu -->
  <TabView v-model:activeIndex="tabIndex" class="tabview-custom" @tab-click="getOnlineAgents">
    <TabPanel style="max-height:500px;overflow:auto">
      <template #header>
        <i class="fas fa-sitemap"></i>
        <span>
            &nbsp;&nbsp;{{ $t('tree.tree') }}
        </span>
      </template>
      <div>
        <div class="p-fluid">
          <div class="p-field">
              <span class="p-input-icon-left">
                <i class="pi pi-filter-slash" />
                <InputText v-model="filterText" 
                  type="text" class="p-inputtext-sm" 
                  :placeholder="$t('tree.filters_records')">
                </InputText>
            </span>
          </div>
          <ScrollPanel :style="{ 'height': scrollHeight + 'vh' }">
            <div class="p-field">
              <el-tree
                class="filter-tree"
                :props="treeProps"
                :empty-text="$t('tree.not_found_record')"
                :render-content="renderContent"
                :load="loadNode"
                lazy
                @node-click="handleTreeClick"
                @node-contextmenu="nodeContextMenu"
                highlight-current=true
                accordion="true"
                ref="tree"
                :filter-node-method="filterNode"
                :show-checkbox="showCheckbox"
                @getCheckedNodes="getCheckedNodes"
                @check="nodeCheckClicked('mainTree')"
                node-key="distinguishedName"
                :getHalfCheckedNodes="getHalfCheckedNodes"
              >
                <template #default="{ node, data }">
                  <span class="custom-tree-node">
                    <span>{{ node.label }}</span>
                    <span>
                      <a
                        @click="append(data)">
                        Append
                      </a>
                      <a
                        @click="remove(node, data)">
                        Delete
                      </a>
                    </span>
                  </span>
                </template>
              </el-tree>
            </div>
          </ScrollPanel>
        </div>
      </div>
    </TabPanel>
    <!-- Search resul tree -->
    <TabPanel style="max-height:500px;overflow:auto">
      <template #header>
        <i class="pi pi-check-circle"></i>
        <span>
          &nbsp;&nbsp;{{ $t('tree.search_result') }}
        </span>
      </template>
      <div class="p-fluid" >
        <div class="p-field">
            <span class="p-input-icon-left">
              <i class="pi pi-filter-slash" />
              <InputText v-model="filterSearchText" 
                type="text" class="p-inputtext-sm" 
                :placeholder="$t('tree.filters_records')">
              </InputText>
          </span>
        </div>
        <ScrollPanel :style="{ 'height': scrollHeight + 'vh' }">
          <div class="p-field">
            <el-tree 
              class="filter-tree"
              :data="searchResults" 
              :props="treeProps"
              :load="searchLoadNode"
              :show-checkbox="showCheckbox"
              @getCheckedNodes="getCheckedNodes"
              @check="nodeCheckClicked('searchTree')"
              @node-contextmenu="nodeContextMenu"
              lazy
              highlight-current=true
              accordion="true"
              :filter-node-method="filterNode"
              ref="searchResultTree"
              @node-click="handleTreeClick"
              :render-content="renderSearchContent"
              :empty-text="$t('tree.not_found_record')"
              :getHalfCheckedNodes="getHalfCheckedNodes"
              node-key="distinguishedName">
            </el-tree>
          </div>
        </ScrollPanel>
      </div>
    </TabPanel>
    <!-- Online client tree -->
    <TabPanel v-if="isAgentTree" style="max-height:500px;overflow:auto">
      <template #header>
          <i class="pi pi-globe"></i>
          <span>
              &nbsp;&nbsp;{{ $t('tree.online_clients') }}
          </span>
      </template>
        <div class="p-fluid"
          v-loading="loading"
          :element-loading-text="$t('tree.online_loading')"
          element-loading-background="rgba(0, 0, 0, 0.6)"
          :element-loading-spinner="svg"
        
        >
        <div class="p-field">
            <span class="p-input-icon-left">
              <i class="pi pi-filter-slash" />
              <InputText v-model="filterOnlineText" 
                type="text" class="p-inputtext-sm" 
                :placeholder="$t('tree.filters_records')">
              </InputText>
          </span>
        </div>
        <ScrollPanel :style="{ 'height': scrollHeight + 'vh' }">
          <div class="p-field">
            <el-tree 
              class="filter-tree"
              :data="onlineAgentResults" 
              :props="treeProps"
              lazy
              highlight-current=true
              accordion="true"
              :filter-node-method="filterNode"
              ref="onlineResultTree"
              :show-checkbox="showCheckbox"
              @getCheckedNodes="getCheckedNodes"
              @check="nodeCheckClicked('onlineResultTree')"
              @node-click="handleTreeClick"
              :render-content="renderSearchContent"
              :empty-text="$t('tree.not_found_record')"
              node-key="distinguishedName"
              >
            </el-tree>
          </div>
        </ScrollPanel>
      </div>
    </TabPanel>
  </TabView>
  <!-- tabview menu end -->
  
  <!-- Context Menu -->
  <slot name="contextmenu">
    <div
      class="el-overlay mycontextmenu"
      v-show="showContextMenu"
      @click="closeContextMenu"
    >
      <ul class="dropdown-menu show" ref="rightMenu">
        <p
          href="#!"
          class="dropdown-item"
          data-v-0001a5f9=""
          data-v-7445dd9c-s=""
        >
          <i class="ni ni-single-02" data-v-0001a5f9="" data-v-7445dd9c-s=""></i
          ><span data-v-0001a5f9="" data-v-7445dd9c-s="">Profil</span>
        </p>
        <p
          href="#!"
          class="dropdown-item"
          data-v-0001a5f9=""
          data-v-7445dd9c-s=""
        >
          <i class="ni ni-single-02" data-v-0001a5f9="" data-v-7445dd9c-s=""></i
          ><span data-v-0001a5f9="" data-v-7445dd9c-s="">Profil</span>
        </p>
      </ul>
    </div>
  </slot>
  <!-- Context Menu End -->
</template>

<script>
import axios from "axios";
import { computerManagementService } from "../../services/ComputerManagement/ComputerManagement";

export default {

  props: {
    handleContextMenu: {
      type: Function,
      default: () => {},
    },
    treeNodeClick: {
      type: Function,
      default: (node) => {},
    },
    treeProps: {
      type: Object,
      default: () => {
        return {
          children: "childEntries",
          label: "name",
          isLeaf: function (data, node) {
            if (data.type === "ORGANIZATIONAL_UNIT" || data.type === null || data.type == "CONTAINER") {
              return false;
            } else {
              return true;
            }
          },
        }
      },
    },
    loadNodeUrl: {
      type: String,
      required: true,
    },

    scrollHeight: {
      description: "scroll bar height",
      type: Number,
      default: 60
    },
    loadNodeOuUrl: {
      type: String,
      required: true,
    },
    showCheckbox: {
      type: Boolean,
      default: false
    },
    getCheckedNodes: {
      type:Function,
      default : () => {}
    },
    getHalfCheckedNodes: {
      type:Function,
      default : () => {}
    },
    showContextMenu: {
      type: Boolean,
      default : false
    },
    searchNodeUrl: {
      type: String,
      default: "/api/lider/ldap/search-entry",
      description: "url for search entry"
    },
    renderSearchContent: {
      type: Function,
      default: (h, { node, data, store }) => {
        let containerIcon = require("@/assets/images/icons/entry_container.gif");
        let lastSession = null;
        let isOnline = false;
        if (data.type === "AHENK") {
          isOnline = data.online;
          if (data.attributes.hasOwnProperty("o") && data.attributes["o"]) {
            lastSession = data.attributes["o"];
          }
        }
        return (
          <span class="custom-tree-node">
          {data.type === "ORGANIZATIONAL_UNIT" || data.type === null ? (
            <i class="fa fa-folder-open" style="color:#F2C85B;"></i>
          ) : data.type === "AHENK" && data.attributes.hasOwnProperty("liderDeviceOSType") && data.attributes['liderDeviceOSType'] == 'Linux'? (
            <i class="fab fa-linux" style="color:#000000;"></i>
          ) : data.type === "AHENK" && data.attributes.hasOwnProperty("liderDeviceOSType") && data.attributes['liderDeviceOSType'] == 'Windows'? (
            <i class="fab fa-windows"></i>
          ) : data.type === "AHENK" ? (
            <i class="fab fa-linux" style="color:#000000;"></i>
          ) : data.type === "USER" ? (
            <i class="fa fa-user"></i>
          ) : data.type === "GROUP" ? (
            <i class="fas fa-users"></i>
          ) : data.type === "CONTAINER" ? (
            <img src={containerIcon}/>
          ) : data.type === "ROLE" ? (
            <i class="fas fa-user-tag"></i>
          ) : data.type === "WIND0WS_AHENK" ? (
           <i class="fab fa-windows"></i>
          ) : ""
          }
          <span style="margin-left:5px;">{data.type === "AHENK" && <i class="pi pi-circle-on" style={isOnline?'font-size: 50%; color:#689F38':'font-size: 50%; color:#D32F2F'}></i>} 
          &nbsp;{data.type === "AHENK" && lastSession? 
            node.data.name +" ("+lastSession+")":node.data.name}
          </span>
        </span>
        );
      }
    },
    isMove : {
      type: Boolean,
      default: false
    },
    isAgentTree: {
      type: Boolean,
      default: false
    },
    searchFields: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      search: {
        type: null,
        text: "",
        dn: "",
      },
      selectedNode: null,
      treeData: null,
      searchResults: null,
      onlineAgentResults: null,
      activeNames: ['1'],
      tabIndex: 0,
      filterText:'',
      filterSearchText: '',
      filterOnlineText: '',
      rootNode: null,
      searchValidation: {},
      searchLoading: false,
      loading: false
    };
  },

  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },

    filterSearchText(val){
      this.$refs.searchResultTree.filter(val);
    },

    filterOnlineText(val){
      this.$refs.onlineResultTree.filter(val);
    },

    search: {
      handler(){
        this.validateForm();
      },
      deep: true,
    },
  },

  methods: {
    nodeContextMenu(event,node,treenode,tree) {
      this.$emit('handleContextMenu', event,node,treenode,tree);
    },

    renderContent(h, { node, data, store }) {
      let containerIcon = require("@/assets/images/icons/entry_container.gif");
      let lastSession = null;
      let isOnline = false;
      if (data.type === "AHENK") {
        isOnline = data.online;
        if (data.attributes.hasOwnProperty("o") && data.attributes["o"]) {
          lastSession = data.attributes["o"];
        }
      }
      return (
        <span class="custom-tree-node">
          {data.type === "ORGANIZATIONAL_UNIT" || data.type === null ? (
            <i class="fa fa-folder-open" style="color:#F2C85B;"></i>
          ) : data.type === "AHENK" && data.attributes.hasOwnProperty("liderDeviceOSType") && data.attributes['liderDeviceOSType'] == 'Linux'? (
            <i class="fab fa-linux" style="color:#000000;"></i>
          ) : data.type === "AHENK" && data.attributes.hasOwnProperty("liderDeviceOSType") && data.attributes['liderDeviceOSType'] == 'Windows'? (
            <i class="fab fa-windows"></i>
          ) : data.type === "AHENK" ? (
            <i class="fab fa-linux" style="color:#000000;"></i>
          ) : data.type === "USER" ? (
            <i class="fa fa-user"></i>
          ) : data.type === "GROUP" ? (
            <i class="fas fa-users"></i>
          ) : data.type === "CONTAINER" ? (
            <img src={containerIcon}/>
          ) : data.type === "ROLE" ? (
            <i class="fas fa-user-tag"></i>
          ) : data.type === "WIND0WS_AHENK" ? (
           <i class="fab fa-windows"></i>
          ) : ""
          }
          <span style="margin-left:5px;">{data.type === "AHENK" && <i class="pi pi-circle-on" style={isOnline?'font-size: 50%; color:#689F38':'font-size: 50%; color:#D32F2F'}></i>} 
          &nbsp;{this.isAgentTree && data.type === "AHENK" && lastSession? 
            node.data.name +" ("+lastSession+")":node.data.name}
          </span>
        </span>
      );
    },

    getAgentsByNode: function (node) {
      return new Promise((resolve, reject) => {
        var data = new FormData();
        data.append("uid", node.distinguishedName);
        axios.post(this.loadNodeOuUrl, data).then((response) => {
          node.childEntries = response.data;
          node.childEntries = node.childEntries || [];
          node.isRoot = true;
          this.rootNode = node;
          resolve(node);
        });
      });
    },

    loadNode(node, resolve) {
      if (node.level === 0) {
        axios.post(this.loadNodeUrl, {}).then((response) => {
          if(response.data) {
            Promise.all(response.data.map(this.getAgentsByNode)).then(
            (result) => {
              this.$emit('directoryConnection', true);
              this.treeData = result;
              resolve(result);
            });
          } else {
             this.$emit('directoryConnection', false);
          }
        });
      }
      if (node.level >= 1) {
        var data = new FormData();
        data.append("uid", node.data.distinguishedName);
        axios.post(this.loadNodeOuUrl, data).then((response) => {
          this.isMove ? 
          resolve(response.data.filter(node => node.type=="ORGANIZATIONAL_UNIT")):
          resolve(response.data);
        });
      }
    },

    searchLoadNode(node, resolve) {
      if (this.searchResults) {
        if (node.level === 0) {
          axios.post(this.loadNodeUrl, {}).then((response) => {
            Promise.all(response.data.map(this.getAgentsByNode)).then(
              (result) => {
                this.treeData = result;
                resolve(result);
              }
            );
          });
        }
        if (node.level >= 1) {
          var data = new FormData();
          data.append("uid", node.data.distinguishedName);
          axios.post(this.loadNodeOuUrl, data).then((response) => {
            this.isMove ? 
            resolve(response.data.filter(node => node.type=="ORGANIZATIONAL_UNIT")):
            resolve(response.data);
          });
        }
      }
    },

    handleTreeClick(node) {
      this.selectedNode = node;
      this.treeNodeClick(node);
      this.search.dn = node.distinguishedName;
    },

    closeContextMenu() {
      this.openContextMenu = !this.openContextMenu;
    },

    async searchTree() {
      if (this.validateForm()) {
        this.searchLoading = true;
        let searchText = "*"+ this.search.text +"*";
        let searchDn = null;
        if (this.selectedNode) {
          if (this.selectedNode.type == 'ORGANIZATIONAL_UNIT' || this.selectedNode.type == 'CONTAINER') {
            searchDn = this.selectedNode.distinguishedName;
          } else {
            searchDn = this.rootNode.distinguishedName;
          }
        } else {
          searchDn = this.rootNode.distinguishedName;
        }
        let params = new FormData();
        params.append("searchDn", searchDn);
        params.append("key", this.search.type);
        params.append("value", searchText);
        await axios.post(this.searchNodeUrl, params).then((response) => {
          this.tabIndex = 1;
          this.searchResults = response.data;
          this.$refs.advancedSearchOp.hide();
          this.searchLoading = false;
        });
      }
    },

    async getOnlineAgents() {
      this.loading = true;
      if (this.tabIndex === 2) {
        let searchDn = null;
        let params = new FormData();
        if (this.selectedNode && this.selectedNode.type == 'ORGANIZATIONAL_UNIT') {
          searchDn = this.selectedNode.distinguishedName;
        } else {
          searchDn = this.rootNode.distinguishedName;
        }
        params.append("searchDn", searchDn);
        const{response,error} = await computerManagementService.searchOnlineEntries(params);
        if(error){
          this.$toast.add({
            severity:'error', 
            detail: this.$t('computer.agent_info.error_online_entries'), 
            summary:this.$t("computer.task.toast_summary"), 
            life: 3000
          })
        }
        else{
          if(response.status == 200){
            this.tabIndex = 2;
            this.onlineAgentResults = response.data;
            
          }
          else if(response.status == 404){
            this.$toast.add({
              severity:'error', 
              detail: this.$t('computer.agent_info.error_404_online_entries'), 
              summary:this.$t("computer.task.toast_summary"), 
              life: 3000
          })
          }
        }
        this.loading = false;
      }
    },

    handleNextClick(val) {
     
    },
    load() {
      // scoll için eklendi
    },

    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },

    nodeCheckClicked(type) {
      let ref = this.$refs.tree;
      if (type == "searchTree") {
        ref = this.$refs.searchResultTree;
      } else if (type == "onlineResultTree") {
        ref = this.$refs.onlineResultTree;
      }

      let clickedNodes = [];
      Promise.all(ref.getCheckedNodes().map(async node => {
        if ( node.type === "ORGANIZATIONAL_UNIT") {
          let ouNode = ref.getNode(node.distinguishedName);
          if(ouNode.childNodes.length <= 0 ) {
            var data = new FormData();
            data.append("uid", node.distinguishedName);
            let response = await axios.post(this.loadNodeOuUrl, data);
            clickedNodes = clickedNodes.concat(response.data);
            return response.data;
          }
        } else {
          clickedNodes.push(node);
          return node;
        }
      })).then(result => {
        this.getCheckedNodes(clickedNodes);
      });
    },

    append(data,node) {
       if (node.childEntries && node.childEntries.length <= 0) {
         node.childEntries = []
       }
      this.$refs.tree.append(data,node);
    },

    remove(node) {
      //this.$refs.tree.setCurrentKey(this.$refs.tree.getCurrentKey());
      this.$refs.tree.remove(node.distinguishedName);
    },
    updateNode(key,node) {
      this.$refs.tree.updateKeyChildren(key, node);
    },
    getCurrentNode() {
      return this.$refs.tree.getCurrentNode();
    },
    setCheckedNode(key,checked) {
      this.$refs.tree.setChecked(key,checked);
    },
    getNode(nodeKey) {
      return this.$refs.tree.getNode(nodeKey);
    },

    advancedSearchOpToogle(event) {
      this.searchValidation = {};
      this.$refs.advancedSearchOp.toggle(event);
    },

    validateForm() {
      if (!this.search.type){
        this.searchValidation['type'] = true;
      } else{
        delete this.searchValidation['type']
      }
      if (!this.search.text.trim()){
        this.searchValidation['text'] = true;
      } else{
        delete this.searchValidation['text']
      }
      return !Object.keys(this.searchValidation).length;
    },
  },
};
</script>

<style lang="scss" scoped>
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

</style>
