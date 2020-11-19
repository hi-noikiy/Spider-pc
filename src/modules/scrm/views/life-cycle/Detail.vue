<template>
  <div class="container">
    <div class="header_nav">
      <el-button type="text" icon="el-icon-arrow-left" @click="$router.go(-1)">客户生命周期</el-button>
    </div>
    <!-- <div class="title-bar">
      <el-button size="small" type="info" @click="goBack"
        >&nbsp;&nbsp;&nbsp;&nbsp;返回&nbsp;&nbsp;&nbsp;&nbsp;</el-button
      >
    </div> -->
    <div class="main_content">
      <!-- <div class="steps">
        <el-steps :active="-1">
          <el-step
            v-for="(item, index) in lifeCycleList"
            :key="index"
            :title="item.label"
            icon="el-icon-success icon-cycle"
          ></el-step>
        </el-steps>
      </div> -->
      <div class="add-btn">
        <el-button type="primary" size="small" @click="showAddDialog">新增阶段</el-button>
      </div>
      <div class="com-table-box">
        <com-table :tableData="tableData" :column="column"></com-table>
      </div>
      <simple-dialog
        :config="addDialog.config"
        :showClose="false"
        @closeDialog="closeAddDialog"
        @handleConfirm="confirmAddModel"
      >
        <div class="dialog-content">
          <div class="form">
            <el-form :model="addDialog.model" :rules="rules" ref="addModel" label-position="right" label-width="auto">
              <el-form-item label="阶段名称" prop="cycleName">
                <el-input
                  maxlength="8"
                  show-word-limit
                  v-model="addDialog.model.cycleName"
                  placeholder="请输入阶段名称"
                >
                </el-input>
              </el-form-item>
              <el-form-item label="阶段描述" prop="cycleDescription">
                <el-input
                  maxlength="30"
                  show-word-limit
                  v-model="addDialog.model.cycleDescription"
                  placeholder="请输入阶段名称"
                >
                </el-input>
              </el-form-item>
              <!-- <el-form-item label="排序号" prop="sortNo">
              <el-input
                type="number"
                v-model="addDialog.model.sortNo"
                placeholder="请输入排序号"
              >
              </el-input>
            </el-form-item> -->
            </el-form>
          </div>
          <div class="tips">跟进提醒（非必填）</div>
          <div class="remind-table">
            <div class="table-header">
              <div class="header-item item-left">提醒对象</div>
              <div class="header-item item-center">客户停留一个阶段多少天提醒</div>
              <div class="header-item item-right">次日几点提醒</div>
            </div>
            <div class="table-row">
              <div class="row-item item-left">客户所属成员</div>
              <div class="row-item item-center">
                <div class="center-input">
                  <el-input type="number" v-model="addDialog.model.customerStayTime" :min="1"></el-input><span>天</span>
                </div>
              </div>
              <div class="row-item item-right">
                <div class="tiem-select">
                  <el-time-select
                    v-model="addDialog.model.customerRemindTime"
                    :picker-options="pickerOptions"
                    placeholder="选择时间"
                  >
                  </el-time-select>
                </div>
              </div>
            </div>
            <div class="table-row" style="border-bottom: unset">
              <div class="row-item item-left">管理员</div>
              <div class="row-item item-center">
                <div class="center-input">
                  <el-input type="number" v-model="addDialog.model.adminStayTime" :min="1"></el-input><span>天</span>
                </div>
              </div>
              <div class="row-item item-right">
                <div class="tiem-select">
                  <el-time-select
                    v-model="addDialog.model.adminRemindTime"
                    :picker-options="pickerOptions"
                    placeholder="选择时间"
                  >
                  </el-time-select>
                </div>
              </div>
            </div>
            <div class="table-row">
              <div class="row-item item-left">添加管理员</div>
              <div class="row-item item-center">
                <div class="admin-member">
                  <template v-if="adminUsers.length <= 0">
                    <el-button type="text" @click="showDepartmentDialog">添加</el-button>
                  </template>
                  <template v-else>
                    <div class="member-item" v-for="(item, index) in adminUsers" :key="index">
                      <i class="el-icon-s-custom member-icon"></i>
                      <span>{{ item.name }}</span>
                      <i class="el-icon-close" @click="deleteUser(index)"></i>
                    </div>
                    <el-button type="text" @click="showDepartmentDialog">修改</el-button>
                  </template>
                </div>
              </div>
              <div class="row-item item-right"></div>
            </div>
          </div>
        </div>
      </simple-dialog>
      <simple-dialog
        :config="editDialog.config"
        :showClose="false"
        @closeDialog="closeEditDialog"
        @handleConfirm="confirmEditModel"
      >
        <div class="dialog-content">
          <div class="form">
            <el-form :model="editDialog.model" :rules="rules" ref="editModel" label-position="right" label-width="auto">
              <el-form-item label="阶段名称" prop="cycleName">
                <el-input
                  maxlength="8"
                  show-word-limit
                  v-model="editDialog.model.cycleName"
                  placeholder="请输入阶段名称"
                >
                </el-input>
              </el-form-item>
              <el-form-item label="阶段描述" prop="cycleDescription">
                <el-input
                  maxlength="30"
                  show-word-limit
                  v-model="editDialog.model.cycleDescription"
                  placeholder="请输入阶段名称"
                >
                </el-input>
              </el-form-item>
              <!-- <el-form-item label="排序号" prop="sortNo">
              <el-input
                type="number"
                v-model="addDialog.model.sortNo"
                placeholder="请输入排序号"
              >
              </el-input>
            </el-form-item> -->
            </el-form>
          </div>
          <div class="tips">跟进提醒（非必填）</div>
          <div class="remind-table">
            <div class="table-header">
              <div class="header-item item-left">提醒对象</div>
              <div class="header-item item-center">客户停留一个阶段多少天提醒</div>
              <div class="header-item item-right">次日几点提醒</div>
            </div>
            <div class="table-row">
              <div class="row-item item-left">客户所属成员</div>
              <div class="row-item item-center">
                <div class="center-input">
                  <el-input type="number" v-model="editDialog.model.customerStayTime" :min="1"></el-input><span>天</span>
                </div>
              </div>
              <div class="row-item item-right">
                <div class="tiem-select">
                  <el-time-select
                    v-model="editDialog.model.customerRemindTime"
                    :picker-options="pickerOptions"
                    placeholder="选择时间"
                  >
                  </el-time-select>
                </div>
              </div>
            </div>
            <div class="table-row" style="border-bottom: unset">
              <div class="row-item item-left">管理员</div>
              <div class="row-item item-center">
                <div class="center-input">
                  <el-input type="number" v-model="editDialog.model.adminStayTime" :min="1"></el-input><span>天</span>
                </div>
              </div>
              <div class="row-item item-right">
                <div class="tiem-select">
                  <el-time-select
                    v-model="editDialog.model.adminRemindTime"
                    :picker-options="pickerOptions"
                    placeholder="选择时间"
                  >
                  </el-time-select>
                </div>
              </div>
            </div>
            <div class="table-row">
              <div class="row-item item-left">添加管理员</div>
              <div class="row-item item-center">
                <div class="admin-member">
                  <template v-if="adminUsers.length <= 0">
                    <el-button type="text" @click="showDepartmentDialog">添加</el-button>
                  </template>
                  <template v-else>
                    <div class="member-item" v-for="(item, index) in adminUsers" :key="index">
                      <i class="el-icon-s-custom member-icon"></i>
                      <span>{{ item.name }}</span>
                      <i class="el-icon-close" @click="deleteUser(index)"></i>
                    </div>
                    <el-button type="text" @click="showDepartmentDialog">修改</el-button>
                  </template>
                </div>
              </div>
              <div class="row-item item-right"></div>
            </div>
          </div>
        </div>
      </simple-dialog>
      <!-- 选择管理人员 -->
      <department-dialog
        :config="departmentDialog.config"
        @closeDialog="departmentDialog.config.visible = false"
        :selectedList="adminUsers"
        ref="department"
        @handleConfirm="handleConfirm"
      >
      </department-dialog>
    </div>
  </div>
</template>

<script>
import ComTable from '../../components/common/ComTable'
import SimpleDialog from '../../components/common/SimpleDialog'
import DepartmentDialog from '../../components//common/DepartmentDialog'
export default {
  components: {
    ComTable,
    SimpleDialog,
    DepartmentDialog
  },
  data() {
    let cycleNameValidator = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入阶段名称'))
      } else {
        callback()
      }
    }
    let cycleDescriptionValidator = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入阶段描述'))
      } else {
        callback()
      }
    }
    return {
      lifeCycleList: [],
      tableData: [],
      column: [
        {
          label: '客户阶段',
          width: '200px',
          align: 'center',
          prop: 'cycleName'
        },
        {
          label: '阶段描述',
          width: '250px',
          align: 'left',
          prop: 'cycleDescription'
        },
        {
          label: '跟进提醒',
          minWidth: '250px',
          align: 'left',
          formatter: (row) => {
            return (
              <div>
                <div>
                  成员提醒：
                  {row.customerStayTime && row.customerRemindTime ? (
                    <span>
                      客户停留一个阶段超过【{row.customerStayTime}天】，次日【{row.customerRemindTime}】提醒
                    </span>
                  ) : (
                    '-'
                  )}
                </div>
                <div>
                  管理员提醒：
                  {row.adminStayTime && row.adminRemindTime ? (
                    <span>
                      客户停留一个阶段超过【{row.adminStayTime}天】，次日【{row.adminRemindTime}】提醒
                    </span>
                  ) : (
                    '-'
                  )}
                </div>
              </div>
            )
          }
        },
        {
          label: '操作',
          width: '200px',
          align: 'center',
          fixed: 'right',
          formatter: (row, column, cellValue, index) => {
            return (
              <div>
                <el-button type="text" onClick={this.moveUp.bind(this, row, index)}>
                  上移
                </el-button>
                <el-button type="text" onClick={this.moveDown.bind(this, row, index)}>
                  下移
                </el-button>
                <el-button type="text" onClick={this.showEditDialog.bind(this, row)}>
                  编辑
                </el-button>
                <el-button type="text" onClick={this.deleteLifeCycle.bind(this, row.id)}>
                  删除
                </el-button>
              </div>
            )
          }
        }
      ],
      addDialog: {
        config: {
          width: '800px',
          title: '新增阶段',
          position: 'center',
          visible: false
        },
        model: {
          // sortNo: 0, // number
          cycleName: '',
          cycleDescription: '',
          customerStayTime: null, // number
          customerRemindTime: '',
          adminStayTime: null, // number
          adminRemindTime: '',
          noticeAdmin: '' // userId
        }
      },
      adminUsers: [], //管理人员列表
      rules: {
        cycleName: [{ required: true, validator: cycleNameValidator, trigger: 'blur' }],
        cycleDescription: [{ required: true, validator: cycleDescriptionValidator, trigger: 'blur' }]
      },
      pickerOptions: {
        start: '00:00',
        step: '00:30',
        end: '24:00'
      },
      editDialog: {
        config: {
          width: '800px',
          title: '编辑阶段',
          position: 'center',
          visible: false
        },
        model: {}
      },
      departmentDialog: {
        config: {
          width: '800px',
          title: '选择管理人员',
          visible: false
        }
      }
    }
  },
  created() {
    this.getLifeCycleList()
  },
  methods: {
    // 获取生命周期阶段列表
    getLifeCycleList() {
      let params = {
        pageNum: 1,
        pageSize: 999
      }
      this.$http.getCustomerLifeCycleList(params).then((res) => {
        let list = res.data.data.list
        this.tableData = list
        let newList = []
        list.forEach((item) => {
          let obj = {
            value: item.id,
            label: item.cycleName
          }
          newList.push(obj)
        })
        this.lifeCycleList = newList
      })
    },
    // getHours(val) {
    //   let date = new Date(val)
    //   return `${date.getHours() <= 9 ? '0' + date.getHours() : date.getHours()}
    //   :${date.getMinutes() <= 9 ? '0' + date.getMinutes() : date.getMinutes()}`
    // },
    showAddDialog() {
      this.adminUsers = []
      this.addDialog.model.cycleName = ''
      this.addDialog.model.cycleDescription = ''
      this.addDialog.model.customerStayTime = null
      this.addDialog.model.customerRemindTime = ''
      this.addDialog.model.adminStayTime = null
      this.addDialog.model.adminRemindTime = ''
      this.addDialog.model.noticeAdmin = ''
      this.addDialog.config.visible = true
    },
    closeAddDialog() {
      this.addDialog.config.visible = false
    },
    // 新增阶段
    confirmAddModel() {
      this.$refs.addModel.validate((valid) => {
        if (valid) {
          // 验证通过，提交表单
          if (this.adminUsers.length > 0) {
            this.addDialog.model.noticeAdmin = this.adminUsers[0].userId
          }
          this.$http.addCustomerLifeCycle(this.addDialog.model).then(() => {
            this.$message.success('新增成功')
            this.addDialog.config.visible = false
            this.getLifeCycleList()
          })
        }
      })
    },
    showEditDialog(row) {
      this.editDialog.model = Object.assign({}, row)
      let obj = {}
      let list = []
      if (this.editDialog.model.noticeAdminInfo) {
        obj = this.editDialog.model.noticeAdminInfo
        list.push(obj)
      }
      // let obj = this.editDialog.model.noticeAdminInfo
      // let obj = {
      //   id: "f8a8112b926446f398f58edbd421c003",
      //   userId: "Wu",
      //   name: "伍圣和",
      //   position: "前端",
      //   avatar: "http://wework.qpic.cn/bizmail/LA1jfibIuRgcD2R7vO19ONIZspHOHP9spH7fR2AB2UqIohjkFcfWwEA/0",
      //   thumbAvatar: "http://wework.qpic.cn/bizmail/LA1jfibIuRgcD2R7vO19ONIZspHOHP9spH7fR2AB2UqIohjkFcfWwEA/100"
      // }
      this.adminUsers = list
      // this.adminUsers = this.editDialog.model
      this.editDialog.config.visible = true
    },
    closeEditDialog() {
      this.editDialog.config.visible = false
    },
    confirmEditModel() {
      this.$refs.editModel.validate((valid) => {
        if (valid) {
          if (this.adminUsers.length > 0) {
            this.editDialog.model.noticeAdmin = this.adminUsers[0].userId
          } else {
            this.editDialog.model.noticeAdmin = ''
          }
          this.$http.updateCustomerLifeCycle(this.editDialog.model).then(() => {
            this.$message.success('编辑成功')
            this.editDialog.config.visible = false
            this.getLifeCycleList()
          })
        }
      })
      this.editDialog.config.visible = false
    },
    // 删除生命周期阶段
    deleteLifeCycle(id) {
      this.$confirm('是否确定删除该周期阶段，删除后对应阶段的客户划分将为未设置状态？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.deleteCustomerLifeCycle({ id }).then(() => {
          this.$message.success('删除成功')
          this.getLifeCycleList()
        })
      })
    },
    // 上移，上下两个sortNo交换位置
    moveUp(row, index) {
      let listLength = this.tableData.length
      let position = index + 1
      // 周期阶段在首位无法上移
      if (position == 1) {
        this.$message.warning('阶段已在最前面')
      } else {
        let firstNo = this.tableData[index - 1].sortNo
        let lastNo = this.tableData[index].sortNo
        let updateList = []
        this.tableData[index].sortNo = firstNo
        this.tableData[index - 1].sortNo = lastNo
        updateList.push(this.tableData[index])
        updateList.push(this.tableData[index - 1])
        this.$http.updateBatchLifeCycle(updateList).then(() => {
          this.$message.success('上移成功')
          this.getLifeCycleList()
        })
      }
    },
    // 下移，上下两个sortNo交换位置
    moveDown(row, index) {
      let listLength = this.tableData.length
      let position = index + 1
      // 周期阶段在首位无法上移
      if (position == listLength) {
        this.$message.warning('阶段已在最后面')
      } else {
        let firstNo = this.tableData[index].sortNo
        let lastNo = this.tableData[index + 1].sortNo
        let updateList = []
        this.tableData[index].sortNo = lastNo
        this.tableData[index + 1].sortNo = firstNo
        updateList.push(this.tableData[index])
        updateList.push(this.tableData[index + 1])
        this.$http.updateBatchLifeCycle(updateList).then(() => {
          this.$message.success('下移成功')
          this.getLifeCycleList()
        })
      }
    },
    showDepartmentDialog() {
      this.departmentDialog.config.visible = true
      this.$nextTick(() => {
        this.$refs.department.setCheckedNodes()
      })
    },
    deleteUser(idx) {
      this.adminUsers.splice(idx, 1)
    },
    // 关闭弹窗获取已选中的列表
    handleConfirm(list) {
      if (list.length > 1) {
        this.$message.warning('当前只能选择一个管理员')
      } else {
        this.adminUsers = list
        this.departmentDialog.config.visible = false
        // console.log('返回数据' + JSON.stringify(list[0]))
      }
    },
    goBack() {
      this.$router.back()
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  .title-bar {
    display: flex;
    flex-direction: row-reverse;
  }
  .steps {
    max-width: 1000px;
    margin: 40px auto 20px auto;
  }
  .add-btn {
    margin-bottom: 20px;
  }
}
.main_content {
  background-color: #ffffff;
  padding: 20px;
  margin-top: 20px;
}
.dialog-content {
  // .form {
  //   width: 500px;
  //   margin: 20px auto 0 auto;
  // }
  // .tips {
  //   margin-left: 140px;
  // }
  .remind-table {
    // width: 600px;
    // margin: 20px auto 0 auto;
    margin-top: 20px;
    .table-header {
      display: flex;
      padding: 20px 0px;
      // border-bottom: 1px solid #dcdfe6;
      align-items: center;
      justify-content: space-between;
      color: #7f7f7f;
    }
    .table-row {
      display: flex;
      padding: 10px 0;
      // border-bottom: 1px solid #dcdfe6;
      align-items: center;
      justify-content: space-between;
      .center-input {
        display: flex;
        align-items: center;
        width: 120px;
        // margin: auto;
        span {
          margin-left: 10px;
        }
      }
    }
    .item-left {
      width: 33%;
    }
    .item-center {
      width: 33%;
      // text-align: center;
    }
    .item-right {
      width: 33%;
    }
  }
}
.admin-member {
  display: flex;
  flex-flow: wrap;
  .member-item {
    height: 30px;
    line-height: 30px;
    padding: 0 10px;
    border: 1px solid #dcdfe6;
    border-radius: 3px;
    margin-right: 10px;
    .member-icon {
      margin-right: 5px;
      color: #294a7b;
    }
    .el-icon-close {
      margin-left: 5px;
      cursor: pointer;
    }
  }
}
::v-deep .icon-cycle {
  font-size: 20px !important;
  color: #294a7b;
  background: #294a7b;
  border-radius: 50%;
}
::v-deep .el-step__title {
  color: #7f7f7f;
  font-size: 14px;
}
::v-deep .el-date-editor {
  width: 120px;
}
</style>