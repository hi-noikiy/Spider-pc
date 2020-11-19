<template>
  <el-dialog
    title="关联角色"
    :visible.sync="visible"
    width="700px"
    :append-to-body="true"
    :before-close="close"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <div style="height:350px;overflow: auto;">
      <div v-for="(first, firstIndex) in tree" :key="firstIndex">
        <!-- 第一级 -->
        <div class="first-item">
          <el-checkbox
            v-model="first.checked"
            @change="change($event, 0, firstIndex)"
          >{{first.name}}</el-checkbox>
        </div>
        <!-- 第二级 -->
        <div class="item-list" v-for="(second, secondIndex) in first.childs" :key="secondIndex">
          <el-checkbox
            v-model="second.checked"
            @change="change($event, 1, firstIndex, secondIndex)"
          >{{second.name}}</el-checkbox>
        </div>
      </div>
    </div>
    <span slot="footer">
      <el-button @click="close(false)">取 消</el-button>
      <el-button type="primary" @click="success()">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: Boolean,
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      tree:[],
      loading: false,
      dataLoading: false,
      roleList: [],
      checkedRole: [],
      isIndeterminate: true,
      checkAll: false,
      defaultProps: {
        children: 'childs',
        label: 'name'
      },
      expandedkeys:[],
      checkedkeys:[],
    }
  },
  watch: {
    visible(val) {
      if (val && this.id) {
        this.dataLoading = true
        // this.detail()
        this.getDepartmentTreeData(this.id)
      }
    }
  },

  methods: {
    // 获取分类数据
    getDepartmentTreeData(id) {
      this.$http.BoundListGroup({type:'poster',accountId:id}).then((res) => {
        this.tree = res.data.data
      })
    },
    // check选中数据
    change(val, level, firstIndex, secondIndex) {
      // console.log(val, level, firstIndex, secondIndex)
      switch (level) {
        case 0:
          this.updateTreeChild(this.tree[firstIndex].childs, val)
          break
        case 1:
          if (val) {
            this.tree[firstIndex].checked = val
          }
          // this.updateTreeChild(this.tree[firstIndex].childs[secondIndex].childs, val)
          break
        
      }
    },
    updateTreeChild(data, flag) {
      data.forEach(item => {
        item.checked = flag
        item.childs instanceof Array && this.updateTreeChild(item.childs, flag)
      })
    },
    loop(data, ids = []) {
      let array = ids
      data.forEach(item => {
        if (item.checked) {
          array.push(item.id)
          item.childs instanceof Array && this.loop(item.childs, array)
        }
      })
      return array
    },
    
    handleCheckAllChange(val) {
      this.checkedRole = val ? this.roleList : []
      this.isIndeterminate = false
    },
    handleCheckedRoleChange(value) {
      // console.log(value)
      let checkedCount = value.length
      this.checkAll = checkedCount === this.roleList.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.roleList.length
    },

    success() {
      let permissionIdList = this.loop(this.tree)
      // console.log(permissionIdList)
      let model = {
        accountId: this.id,
        groupIds: permissionIdList
      }
      // this.checkedRole.map(item => {
      //   model.roleIdList += item.id + ','
      // })
      // model.roleIdList = model.roleIdList.substring(0, model.roleIdList.length - 1)
      this.update(model)
    },
    //修改
    async update(model) {
      try {
        await this.$http.BoundCouunt(model)
        this.dataLoading = false
        this.$message.success('关联成功')
        this.close(true)
      } catch (err) {
        this.dataLoading = false
        if (/超时/.test(err.data.message)) {
          this.closeLogin(true)
        }
      }
    },
    close(flag) {
      this.reduc()
      this.$emit('close', flag)
    },
    reduc() {
      this.roleList = []
      this.checkedRole = []
      this.isIndeterminate = true
      this.checkAll = false
    }
  }
}
</script>
<style>
.first-item {
  /* border-bottom: 1px solid #e0e0e0; */
  padding-bottom: 10px;
}
.item-list {
  padding: 10px 0;
  margin-left: 25px;
}
.bottom-btn {
  text-align: center;
  height: 60px;
  line-height: 60px;
  border-top: 1px solid #e7eaec;
}
</style>
