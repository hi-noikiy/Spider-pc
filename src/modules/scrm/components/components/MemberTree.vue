<template>
<!-- 选择目标成员树，支持无限层级，勾选部门可选择部门下的所有成员,应用页面"企业朋友圈"设置对外展示的成员 -->

  <div>
    <div class="tree_title">
      <div class="title_left">
        <div class="title_search">
          <el-input
            size="small"
            placeholder="请输入成员/部门名称"
            v-model="filterText"
          >
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </div>
        <div class="add_member">
          <el-button size="small" plain :disabled='isLoading' @click="dataSync">数据同步</el-button>
        </div>
      </div>
      <div class="title_right">已选择成员({{ selectedMenu.length }})</div>
    </div>
    <div class="tree_menu" v-loading="isLoading">
      <!-- 组织架构 -->
      <div class="menu_left">
        <div class="left_tree">
          <el-tree
            :data="treeMenu"
            show-checkbox
            default-expand-all
            node-key="myId"
            ref="linkageTree"
            :props="defaultProps"
            :highlight-current="true"
            @check="getCheckedNodes"
            @check-change="getCurrentNode"
            :filter-node-method="filterNode"
          >
          </el-tree>
        </div>
      </div>
      <!-- 已选择的成员 -->
      <div class="menu_right">
        <div class="right_menu">
          <div class="menu_item" v-for="(item, index) in selectedMenu" :key="index">
            <span>
              <i class="item_icon el-icon-s-custom"></i>
              {{ item.name }}
            </span>
            <el-button type="text" icon="el-icon-close" @click="delSetCheckedNodesArrFun(item)"></el-button>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="foot_btns">
      <el-button type="text" @click="configureWhatToAdd.visible = true">如何添加新成员?</el-button>
    </div> -->
    <WhatToAdd :configure="configureWhatToAdd" @closeDialog="closeWhatToAdd" @success="successWhatToAdd"></WhatToAdd>
  </div>
</template>

<script>
import WhatToAdd from './WhatToAdd'
export default {
  components: { WhatToAdd },
  props: {
    // 传入的值
    selectedList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      // 成员树数据
      treeMenu: [],
      // 设置节点名称
      defaultProps: {
        children: 'childs',
        label: 'name'
      },
      selectedMenu: [], // 选中后返回的列表，已去重
      treeList: [], // tree转array返回的列表
      currentSelected: [], // 树形结构里面所有选中的值，包括重复的对象
      filterText: '', // 筛选的关键词
      configureWhatToAdd: { // 如何添加新成员
        title: '如何添加新成员',
        visible: false
      },
      isLoading: false
    }
  },
  created() {
    this.getDepartmentTree()
  },
  watch: {
    filterText(val) {
      this.$refs.linkageTree.filter(val);
    }
  },
  methods: {
    // 获取企业组织结构树
    getDepartmentTree(callback) {
      this.$http.getDepartmentTree().then((res) => {
        let tree = res.data.data
        tree.forEach((item) => {
          // if (item.userList) {
          //   item.childs.unshift({ id: 1, name: '成员', userList: item.userList })
          // }
          if (item.userList) {
            for (let i = item.userList.length - 1; i >= 0; i--) {
              let obj = item.userList[i]
              item.childs.unshift(obj)
            }
            // item.userList.forEach((name) => {
            //   item.childs.unshift(name)
            // })
          }
        })
        this.treeMenu = JSON.parse(JSON.stringify(tree).replace(/"userList"/g, '"childs"'))
        // 设置企业的唯一id
        this.setMyId(this.treeMenu, 0)
        if (callback) {
          callback(res)
        }
      })
    },
    // 设置唯一id
    setMyId(options, myId) {
      options.forEach((item, index) => {
        item.myId = `${myId}-${index}`
        this.treeList.push(item)
        if (!item.childs) {
          return
        } else {
          this.setMyId(item.childs, item.myId)
        }
      })
    },
    // 设置默认选中的节点
    setCheckedNodes() {
      this.currentSelected = []
      this.selectedMenu = [].concat(this.selectedList)
      this.selectedMenu.forEach(item => {
        this.treeList.forEach(obj => {
          if (item.id === obj.id || item.userId === obj.id) {
            this.currentSelected.push(obj)
          }
        })
      })
      this.$refs.linkageTree.setCheckedNodes(this.currentSelected)
    },
    // 获取选择的节点
    getCheckedNodes() {
      this.$nextTick(() => {
        let list = this.$refs.linkageTree.getCheckedNodes()
        let arr = []
        list.forEach(item => {
          if (item.userId) {
            arr.push(item)
          }
        })
        // 去重
        let hash = {}
        let newArr = arr.reduce((item, next) => {
          hash[next.name] ? '' : hash[next.name] = true && item.push(next)
          return item
        }, [])
        this.selectedMenu = newArr
      })
    },
    // 获取当前选中的节点
    getCurrentNode(node, isChecked) {
      // console.log('当前选的节点', node, isChecked)
      let list = [].concat(this.currentSelected)
      // 节点是否被选中
      if (isChecked) {
        this.treeList.forEach(obj => {
          if (node.id === obj.id && !node.parentId ) {
            this.currentSelected.push(obj)
          }
        })
      } else {
        list.forEach((item, index) => {
          if (item.id === node.id) {
            this.currentSelected.splice(
              this.currentSelected.findIndex((item) => item.id === node.id), 1
            )
          }
        })
      }
      // console.log('已选的成员数', this.currentSelected.length, this.currentSelected)
      this.$nextTick(() => {
        this.$refs.linkageTree.setCheckedNodes(this.currentSelected)
      })
    },
    // 删除已选中成员
    delSetCheckedNodesArrFun(item) {
      // 从左边的结构树中删去已中的成员
      let list = [].concat(this.currentSelected)
      list.forEach((obj, idx) => {
        if (obj.id === item.id) {
          this.currentSelected.splice(
            this.currentSelected.findIndex((obj) => obj.id === item.id), 1
          )
          // console.log('删除', this.currentSelected.length, this.currentSelected)
        }
      })
      // 从右边已选中的成员列表中删去
      let arrList = [].concat(this.selectedMenu)
      arrList.forEach((obj, idx) => {
        if (obj.id === item.id) {
          this.selectedMenu.splice(
            this.selectedMenu.findIndex((obj) => obj.id === item.id), 1
          )
        }
      })
      this.$nextTick(() => {
        this.$refs.linkageTree.setCheckedNodes(this.currentSelected)
      })
    },
    filterNode(value, data) {
      if (!value) return true;
      // 只过滤成员，不过滤部门
      // if (!data.parentId) {
      //   return data.name.indexOf(value) !== -1;
      // }
      return data.name.indexOf(value) !== -1;
    },
    // 如何添加新成员
    closeWhatToAdd() {
      this.configureWhatToAdd.visible = false
    },
    successWhatToAdd() {
      this.configureWhatToAdd.visible = false
    },
    // 同步数据
    dataSync() {
      this.isLoading = true
      this.$http.syncCustomerList().then(() => {
        this.treeList = []
        this.selectedMenu = []
        this.currentSelected = []
        this.filterText = ''
        this.getDepartmentTree((res) => {
          this.$nextTick(() => {
            this.setCheckedNodes()
          })
          this.isLoading = false
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.tree_title {
  display: flex;
  align-items: center;
  .title_left,
  .title_right {
    width: 50%;
    text-align: center;
    padding-bottom: 20px;
  }
  .title_left {
    display: flex;
    .title_search {
      width: 250px;
    }
    .add_member {
      margin-left: 10px;
    }
  }
}
.tree_menu {
  display: flex;
  box-sizing: border-box;
  height: 500px;
  .menu_left {
    width: 50%;
    border-right: 1px solid #dcdfe6;
    overflow-y: auto;
    ::v-deep .el-tree-node__content {
      height: 32px;
    }
  }
  .menu_right {
    width: 50%;
    box-sizing: border-box;
    overflow-y: auto;
    .right_menu {
      .menu_item {
        display: flex;
        justify-content: space-between;
        line-height: 32px;
        height: 32px;
        color: #222222;
        align-items: center;
        padding: 0 20px;
        .close_icon {
          cursor: pointer;
        }
        .item_icon {
          color: #294a7b;
        }
        &:hover {
          background-color: #f5f7fa;
        }
      }
    }
  }
  .title {
    margin-bottom: 20px;
    color: #909399;
  }
}
::-webkit-scrollbar {
  width: 0;
  height: 0;
}
</style>