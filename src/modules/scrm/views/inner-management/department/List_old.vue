<template>
  <div class="inner-department">
    <div class="container">
      <!-- <div class="query-table">
        <div class="query-table-left">
          <div class="search-input">
            <el-input size="small" placeholder="输入部门名称" v-model="searchForm.content"></el-input>
          </div>
          <el-button size="small" type="primary" @click="onSearch">查询</el-button>
          <el-button size="small" type="info" @click="onReset">重置</el-button>
        </div>
        <el-button type="primary" size="small" @click="showAddDialog">新增部门</el-button>
      </div> -->
      <div class="operating-btn">
        <el-button size="small" type="primary" :loading="syncLoading" @click="dataSync">数据同步</el-button>
      </div>
      <div class="common-table-box">
        <com-table :tableData="tableData" :column="column"></com-table>
      </div>
      <div class="common-pagination">
        <com-pagination :page="page" @sizeChange="onSizeChange" @pageChange="onPageChange"></com-pagination>
      </div>
    </div>
    <com-dialog :config="addDialog.config" @closeDialog="addDialog.config.visible = false">
      <div class="dialog-content">
        <el-form :model="addForm" :rules="rules" ref="addModel" label-position="right" label-width="auto">
          <el-form-item label="部门名称" prop="name">
            <el-input v-model="addForm.name" placeholder="请输入部门名称" clearable> </el-input>
          </el-form-item>
        </el-form>
        <div class="submit-btn">确定</div>
      </div>
    </com-dialog>
    <com-dialog :config="editDialog.config" @closeDialog="editDialog.config.visible = false">
      <div class="dialog-content">
        <el-form :model="editForm" :rules="rules" ref="editModel" label-position="right" label-width="auto">
          <el-form-item label="部门名称" prop="name">
            <el-input v-model="editForm.name" placeholder="请输入部门名称" clearable> </el-input>
          </el-form-item>
        </el-form>
        <div class="submit-btn" @click="submitEdit">确定</div>
      </div>
    </com-dialog>
  </div>
</template>

<script>
import ComTable from '../../../components/common/ComTable'
import ComPagination from '../../../components/common/ComPagination'
import ComDialog from '../../../components/common/ComDialog'
export default {
  components: { ComTable, ComPagination, ComDialog },
  data() {
    let nameValidator = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入部门名称'))
      } else {
        callback()
      }
    }
    return {
      searchForm: {
        content: ''
      },
      tableData: [],
      column: [
        {
          type: 'index',
          label: '序号',
          align: 'center',
          width: '150px'
        },
        {
          label: '部门名称',
          align: 'center',
          minWidth: '150px',
          prop: 'name'
        },
        {
          label: '创建时间',
          align: 'center',
          minWidth: '150px',
          prop: 'createTime'
        },
        {
          label: '更新时间',
          align: 'center',
          minWidth: '150px',
          prop: 'updateTime'
        }
        // {
        //   label: '操作',
        //   align: 'center',
        //   width: '200px',
        //   fixed: 'right',
        //   formatter: row => {
        //     return (
        //       <div>
        //         <el-button
        //           type="text" onClick={this.showEditDialog.bind(this, row)}>
        //           修改
        //         </el-button>
        //       </div>
        //     )
        //   }
        // }
      ],
      page: {
        pageNum: 1,
        pageSize: 15,
        total: 0
      },
      addDialog: {
        config: {
          width: '600px',
          title: '新增部门',
          visible: false
        }
      },
      addForm: {
        name: ''
      },
      rules: {
        name: [{ required: true, validator: nameValidator, trigger: 'blur' }]
      },
      editDialog: {
        config: {
          width: '600px',
          title: '修改部门',
          visible: false
        }
      },
      editForm: {},
      syncLoading: false
    }
  },
  created() {
    this.getDepartmentPage()
  },
  methods: {
    onSizeChange(val) {
      this.page.pageSize = val
      this.page.pageNum = 1
      this.getDepartmentPage()
    },
    onPageChange(val) {
      this.page.pageNum = val
      this.getDepartmentPage()
    },
    getDepartmentPage() {
      let that = this
      that.$http.getDepartmentPage(that.page).then(res => {
        that.tableData = res.data.data.list
        that.page.total = res.data.data.total
      })
    },
    // 打开新增弹窗
    showAddDialog() {
      this.addDialog.config.visible = true
    },
    // 打开编辑弹窗
    showEditDialog(row) {
      this.editForm = Object.assign({}, row)
      this.editDialog.config.visible = true
    },
    // 提交修改信息
    submitEdit() {
      let that = this
      that.$refs.editModel.validate(valid => {
        if (valid) {
          // 验证通过提交数据
          console.log('验证通过')
        }
      })
    },
    // 数据同步
    dataSync() {
      this.syncLoading = true
      this.$http.syncCustomerList().then(() => {
        this.$message.success('同步成功')
        this.syncLoading = false
        this.page.pageNum = 1
        this.getDepartmentPage()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.inner-department {
  width: 100%;
  height: 100%;
  position: relative;
}
.container {
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  padding: 20px;
  box-sizing: border-box;
}
.operating-btn {
  display: flex;
  flex-direction: row-reverse;
  margin-bottom: 20px;
}
.query-table {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  &-left {
    display: flex;
    .search-input {
      width: 300px;
      margin-right: 10px;
    }
  }
}
.common-pagination {
  width: 100%;
  position: absolute;
  left: 0;
  bottom: 0;
}
.dialog-content {
  width: 100%;
  height: 200px;
  padding: 0 40px;
  box-sizing: border-box;
}
.submit-btn {
  width: 200px;
  height: 36px;
  line-height: 36px;
  font-size: 14px;
  color: #ffffff;
  text-align: center;
  background-color: #294a7b;
  margin: 60px auto;
  border-radius: 3px;
  cursor: pointer;
}
</style>
