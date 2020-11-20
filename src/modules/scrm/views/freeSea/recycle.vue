<template>
  <div class="customer-colony">
    <div class="header_nav" style="margin-bottom: 20px">
      <el-button type="text" icon="el-icon-arrow-left" @click="$router.go(-1)">客户回收</el-button>
    </div>
    <div class="cutomer-title">
      当通用规则（指所有员工）和特殊化规则（指个人规则）同时存在的情况下，员工则执行特殊化规则。比如，张三既在通用规则，又在特殊化规则，那么，就按特殊化规则执行。
    </div>
    <div class="container">
      <div class="operating-btn">
        <el-button size="small" type="primary" @click="showrule=true">新增客户回收规则</el-button>
      </div>
      <div class="common-table-box">
        <com-table :tableData="tableData" :column="column"></com-table>
      </div>
      <div class="common-pagination">
        <com-pagination :page="page" @sizeChange="onSizeChange" @pageChange="onPageChange"></com-pagination>
      </div>
    </div>
    <RecycleRule :visible='showrule' :id="updateId" @onClose="onClose"></RecycleRule>
  </div>
</template>

<script>
import ComTable from '../../components/common/ComTable'
// import ComDialog from '../../components/common/ComDialog'
import ComPagination from '../../components/common/ComPagination'
import RecycleRule from './recycleRule'
export default {
  components: { ComTable, ComPagination ,RecycleRule},
  data() {
    let nameValidator = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入名称'))
      } else {
        callback()
      }
    }
    return {
      showrule:false,
      updateId:'',
      tableData: [], //存储从后台获取到的数组
      column: [
        {
          prop: 'name',
          label: '生效成员',
          align: 'center'
        },
        {
          label: '回收规则',
          align: 'center',
          prop: 'sequence'
        },
        {
          label: '成员限制',
          align: 'center',
          prop: ''
        },
        {
          label: '操作',
          align: 'center',
          fixed: 'right',
          formatter: (row) => {
            return (
              <div>
                <el-button type="text" onClick={this.showEditDialog.bind(this, row)}>
                  编辑
                </el-button>
                <el-button type="text" onClick={this.deteleUsing.bind(this, row.id)}>
                  删除
                </el-button>
              </div>
            )
          }
        }
      ],
      page: {
        pageNum: 1,
        pageSize: 15,
        total: 0
      },

      editDialog: {
        config: {
          width: '600px',
          title: '修改字段',
          visible: false
        },
        model: {},
        rules: {
          name: [{ required: true, validator: nameValidator, trigger: 'blur' }]
        }
      },
      syncLoading: false,
      eidtExtendlDialog: {
        config: {
          width: '600px',
          title: '新增字段',
          visible: false
        },
        model: {
          name: '', // 名称
          sequence: 0, // 排序号
          type: 1,
          typeItem: ''
        },
        rules: {
          name: [{ required: true, validator: nameValidator, trigger: 'blur' }]
        }
      },
      isEnabled: false
    }
  },
  created() {
    this.getColonyList()
  },
  methods: {
    onClose(flag){
      this.showrule=false
      this.updateId=''
    },
    onSizeChange(val) {
      this.page.pageSize = val
      this.page.pageNum = 1
      this.getColonyList()
    },
    onPageChange(val) {
      this.page.pageNum = val
      this.getColonyList()
    },
    // 获取客户群列表
    getColonyList() {
      let that = this
      that.$http.getFieldList(that.page).then((res) => {
        that.tableData = res.data.data.list
        that.page.total = res.data.data.total
      })
    },
    // 显示编辑弹窗
    showEditDialog(row) {
      this.editDialog.model = Object.assign({}, row)
      this.editDialog.config.visible = true
    },
    editColony() {
      let that = this
      that.$refs.editModel.validate((valid) => {
        if (valid) {
          // 验证通过提交数据
          that.$http.updateField(that.editDialog.model).then(() => {
            that.$message.success('修改成功')
            // 清除表单数据、关闭弹窗、重置page、获取列表数据
            that.$refs.editModel.resetFields()
            that.editDialog.config.visible = false
            let obj = {
              pageNum: 1,
              pageSize: 15,
              total: 0
            }
            that.page = obj
            that.getColonyList()
          })
        }
      })
    },
    // 客户同步

    //点击新增按钮的触发事件
    addField() {
      let that = this
      that.eidtExtendlDialog.model.name = ''
      that.eidtExtendlDialog.config.visible = true
    },
    //关闭弹窗的x按钮
    closePerExtendDialog() {
      let that = this
      that.eidtExtendlDialog.config.visible = false
    },
    //新增弹窗里的确认按钮
    sumbitAddPerTagDialog() {
      let that = this
      if (that.eidtExtendlDialog.model.name == '') {
        that.$message.warning('请填写字段名称')
      } else {
        that.$http.addField(that.eidtExtendlDialog.model).then(() => {
          that.eidtExtendlDialog.model.name = ''
          that.eidtExtendlDialog.model.sequence = 0
          that.$message.success('新增字段成功')
          that.getColonyList()
          that.eidtExtendlDialog.config.visible = false
        })
      }
    },
    //停用按钮
    stopUsing(row) {
      let that = this
      let list = row
      that
        .$confirm('是否停用？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          list.isEnabled = false
          that.$http.updateField(list).then(() => {
            that.$message.success('停用成功')
            that.getColonyList()
          })
        })
        .catch(() => {
          return
        })
    },
    //启用按钮
    openUsing(row) {
      let that = this
      that
        .$confirm('是否启用？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          let params = {
            id: row.id,
            isEnabled: true
          }
          that.$http.openField(params).then(() => {
            that.$message.success('启用成功')
            that.getColonyList()
          })
        })
        .catch(() => {
          return
        })
    },
    //删除新增字段
    deteleUsing(id) {
      let that = this
      that
        .$confirm('是否删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          that.$http.deteleField({ id }).then(() => {
            that.$message.success('删除成功')
            that.getColonyList()
          })
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.customer-colony {
  width: 100%;
  height: 100%;
  position: relative;
}
.container {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  background-color: #ffffff;
}
.operating-btn {
  margin-bottom: 20px;
}
.common-pagination {
  // width:calc(100% - 30px) ;
  // position: absolute;
  // left: 0;
  // bottom: 0;
}
.dialog-content {
  width: 100%;
  // height: 260px;
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
  margin: 30px auto;
  border-radius: 3px;
  cursor: pointer;
}
.cutomer-title {
  border: 1px solid #ffdda6;
  background: #fff2db;
  color: #606266;
  font-size: 14px;
  padding: 10px;
  margin-bottom: 10px;
}
</style>
