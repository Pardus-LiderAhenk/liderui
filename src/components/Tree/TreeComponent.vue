<template>
  <slot name="search">
    <el-popover placement="bottom" :width="400" v-model:visible="showSearchForm">
      <p>Search DN : {{ search.dn }}</p>
      <el-form status-icon label-position="top" size="small">
        <el-form-item label="Arama Alanı">
          <select placeholder="Arama Alanı" v-model="search.type">
            <option label="Id" value="uid"></option>
            <option label="Adı" value="cn"></option>
            <option label="Son Oturum" value="o"></option>
            <option label="Klasör" value="ou"></option>
          </select>
        </el-form-item>
        <el-form-item label="Arama Cümlesi">
          <el-input type="text" v-model="search.text"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchTree()">Ara</el-button>
          <el-button @click="showSearchForm = !showSearchForm">Cancel</el-button>
        </el-form-item>
      </el-form>

      <template #reference>
        <el-button icon="el-icon-search" style="width: 100%"
          >Arama Yap</el-button
        >
      </template>
    </el-popover>
  </slot>

  <!-- <slot name="pagination">
    <div
      style="
        width: 100%;
        justify-content: flex-end;
        text-align: right;
        margin-top: 5px;
      "
    >
      <span style="float: left">Sayfa : 1</span>
      <el-pagination
        background
        layout="prev, next"
        pager-count="1"
        :total="1000"
        @next-click="handleNextClick"
      >
      </el-pagination>
    </div>
  </slot> -->


  <el-tabs style="height: 100%; width: 100%" v-model="tabIndex">
    <el-tab-pane label="Tree" name="basetree" style="max-height:500px;overflow:auto">
      <div v-infinite-scroll="load">

  <el-input
    placeholder="Kayıtları Filtrele"
    v-model="filterText">
  </el-input>
      <el-tree
        class="filter-tree"
        :props="treeProps"
        empty-text="Kayıt Bulunamadı"
        :render-content="renderContent"
        :load="loadNode"
        lazy
        @node-click="handleTreeClick"
        @node-contextmenu="handleContextMenu"
        highlight-current=true
        accordion="true"
        ref="tree"
        :filter-node-method="filterNode"
        :show-checkbox="showCheckbox"
        @getCheckedNodes="getCheckedNodes"
        @check="nodeCheckClicked"
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
    </el-tab-pane>
    <el-tab-pane label="Search" name="search">
      <el-collapse v-model="activeNames" @change="handleChange">
         <el-collapse-item title="Arama Sonuları" name="1">
          <el-tree 
            :data="searchResults" 
            :props="treeProps" 
            @node-click="handleTreeClick"
            :render-content="renderSearchContent"
            empty-text="Kayıt Bulunamadıııı"
            node-key="distinguishedName">
              
              </el-tree>
              </el-collapse-item>
      </el-collapse>
    </el-tab-pane>
    
  </el-tabs>

  <!-- Context Menu -->
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
  <!-- Context Menu End -->
</template>

<script>
import axios from "axios";
export default {
  components: {},
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
          if (data.type === "ORGANIZATIONAL_UNIT") {
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
    renderSearchContent: {
      type: Function,
      default: (h, { node, data, store }) => {
        let linuxIcon = require("@/assets/images/icons/linux.png");
        let groupIcon = require("@/assets/images/icons/entry_group.gif");
        return (
          <span class="custom-tree-node">
            {data.type === "ORGANIZATIONAL_UNIT" ? (
              <i
                class="fa fa-folder-open"
                style="color:#F2C85B;  font-weight:bold"
              ></i>
            ) : data.type === "AHENK" ? (
              <img src={linuxIcon} style="width:20px" />
            ) : (
              <img src={groupIcon} style="width:20px" />
            )}
            <span style="margin-left:5px;">{node.label}</span>
          </span>
        );
      }
    },
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
      searchResults:null,
      activeNames: ['1'],
      tabIndex: 'basetree',
      showSearchForm : false,
      filterText:'',
      rootNode:null,
    };
  },
  watch: {
     filterText(val) {
        this.$refs.tree.filter(val);
      }
  },
  methods: {
    renderContent(h, { node, data, store }) {
      let linuxIcon = require("@/assets/images/icons/linux.png");
      let groupIcon = require("@/assets/images/icons/entry_group.gif");
      return (
        <span class="custom-tree-node">
          {data.type === "ORGANIZATIONAL_UNIT" ? (
            <i
              class="fa fa-folder-open"
              style="color:#F2C85B;  font-weight:bold"
            ></i>
          ) : data.type === "AHENK" ? (
            <img src={linuxIcon} style="width:20px" />
          ) : (
            <img src={groupIcon} style="width:20px" />
          )}
          <span style="margin-left:5px;">{node.data.name}</span>
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
          resolve(response.data);
        });
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
    searchTree() {
      axios
        .post("/lider/ldap/searchEntry?searchDn="+ this.search.dn + "&key=" + this.search.type + '&value=' + this.search.text, {})
        .then((response) => {
          this.showSearchForm = false
          this.tabIndex = "search";
          this.searchResults = response.data;
        });
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
    nodeCheckClicked() {

      let clickedNodes = [];

      Promise.all(this.$refs.tree.getCheckedNodes().map(async node => {
        if ( node.type === "ORGANIZATIONAL_UNIT") {
          let ouNode = this.$refs.tree.getNode(node.distinguishedName);
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
    }
  },
  
  
};
</script>

<style scoped>
  ::v-deep .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content{
    background-color:#2196f3;
    color:white
  }
</style>
