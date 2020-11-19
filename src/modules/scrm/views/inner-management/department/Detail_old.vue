<template>
  <div class="department-detail">
    <div class="navigation">
      <div class="tag">部门</div>
      <i class="el-icon-d-arrow-right"></i>
      <div class="tag">查看</div>
    </div>
    <div class="container">
      <div class="g-module">
        <div class="operating-group">
          <div class="base-btn">
            <div class="label">基础信息</div>
            <div class="edit" @click="editBaseInfo"><i class="el-icon-edit-outline"></i>&nbsp;编辑</div>
            <div class="delete">删除部门</div>
          </div>
        </div>
        <div class="grouping-msg">
          <div class="msg-label">部门名称：</div>
          <div class="msg-desc">市场部</div>
        </div>
        <div class="grouping-msg">
          <div class="msg-label">部门备注：</div>
          <div class="msg-desc">市场一部</div>
        </div>
        <div class="grouping-msg">
          <div class="msg-label">添加时间：</div>
          <div class="msg-desc">2019-11-11 00:00:00</div>
        </div>
      </div>
      <div class="g-module">
        <div class="query-table">
          <div class="query-table-left">
            <div class="search-input">
              <el-input placeholder="输入用户名称、备注">
                <el-button slot="append" icon="el-icon-search"></el-button>
              </el-input>
            </div>
            <el-button size="small" type="info">&nbsp;&nbsp;重置&nbsp;&nbsp;</el-button>
          </div>
          <div class="query-table-right">
            <div class="customer-total">微信总数：<span>0</span></div>
            <el-button size="small" type="primary" @click="addEnterprise">添加企业号</el-button>
          </div>
        </div>
        <div class="common-table-box">
          <com-table :tableData="tableData" :column="column"></com-table>
        </div>
      </div>
    </div>
    <com-dialog :config="editDialog.config" @closeDialog="editDialog.config.visible = false">
      <div class="edit-content">
        <div class="edit-input">
          部门名称&nbsp;&nbsp;&nbsp;&nbsp;
          <el-input
            placeholder="请输入部门名称">
          </el-input>
        </div>
        <div class="edit-input">
          部门备注&nbsp;&nbsp;&nbsp;&nbsp;
          <el-input
            placeholder="请输入部门备注">
          </el-input>
        </div>
        <div class="submit-btn">确定</div>
      </div>
    </com-dialog>
    <com-dialog :config="addDialog.config" @closeDialog="addDialog.config.visible = false">
      <div class="add-content">
        <div class="table-box">
          <div class="table-head">
            <div class="th-item th-item-first"></div>
            <div class="th-item th-item-second">企业号</div>
            <div class="th-item">备注</div>
            <div class="th-item">状态</div>
          </div>
          <div class="table-content">
            <div class="table-row">
              <div class="tr-item tr-item-first">
                <el-checkbox></el-checkbox>
              </div>
              <div class="tr-item tr-item-second">
                <el-avatar shape="square" :size="40" fit="fit"></el-avatar>
                <div class="cust-info">
                  <div class="info-msg">康明刚</div>
                  <div class="info-msg info-light">VCG视觉中国</div>
                </div>
              </div>
              <div class="tr-item">备注信息</div>
              <div class="tr-item">正常</div>
            </div>
          </div>
        </div>
        <div class="submit-btn submit-btn-add">确定</div>
      </div>
    </com-dialog>
  </div>
</template>

<script>
import ComTable from '../../../components/common/ComTable'
import ComDialog from '../../../components/common/ComDialog'
export default {
  components: { ComTable, ComDialog },
  data() {
    return {
      tableData: [],
      column: [
        {
          type: 'index',
          label: '序号',
          align: 'center',
          width: '200px'
        },
        {
          label: '企业号',
          align: 'center',
          prop: ''
        },
        {
          label: '分组',
          align: 'center',
          prop: ''
        },
        {
          label: '状态',
          align: 'center',
          prop: ''
        },
        {
          label: '操作',
          align: 'center',
          width: '200px',
          fixed: 'right',
          formatter: row => {
            return (
              <div>
                <el-button
                  type="text">
                  移除
                </el-button>
              </div>
            )
          }
        }
      ],
      editDialog: {
        config: {
          width: '600px',
          title: '编辑基础信息',
          visible: false
        }
      },
      addDialog: {
        config: {
          width: '600px',
          title: '添加企业号',
          visible: false
        }
      }
    }
  },
  methods: {
    // 编辑基础信息
    editBaseInfo() {
      this.editDialog.config.visible = true
    },
    // 添加企业号
    addEnterprise() {
      this.addDialog.config.visible = true
    }
  }
}
</script>

<style lang="scss" scoped>
.grouping-detail {
  width: 100%;
  height: 100%;
  position: relative;
}
.navigation {
  width: 100%;
  color: #909399;
  font-size: 14px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  .tag {
    margin-right: 10px;
  }
  .el-icon-d-arrow-right {
    color: #1e90ff;
    margin-right: 10px;
  }
}
.container {
  width: 100%;
  height: calc(100% - 34px);
}
.g-module {
  width: 100%;
  font-size: 14px;
  padding: 20px 40px;
  box-sizing: border-box;
  background-color: #ffffff;
  margin-bottom: 20px;
}
.operating-group {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .base-btn {
    display: flex;
    align-items: flex-end;
    .label {
      font-size: 16px;
      color: #303133;
      margin-right: 40px;
    }
    .edit {
      color: #1e90ff;
      margin-right: 40px;
      cursor: pointer;
    }
    .delete {
      color: #909399;
      margin-right: 40px;
      cursor: pointer;
    }
  }
}
.grouping-msg {
  max-width: 800px;
  display: flex;
  align-items: center;
  line-height: 24px;
  padding: 20px 0;
  box-sizing: border-box;
  border-bottom: 1px solid #EBEEF5;
  margin-top: 20px;
  .msg-label {
    color: #909399;
    margin-right: 10px;
  }
  .msg-desc {
    color: #303133;
  }
}
.query-table {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  &-left {
    display: flex;
    .search-input {
      margin-right: 20px;
    }
  }
  &-right {
    display: flex;
    align-items: center;
    .customer-total {
      margin-right: 30px;
      span {
        color: #ffa500;
      }
    }
  }
}
.edit-content {
  width: 100%;
  height: 200px;
  padding: 0 40px;
  box-sizing: border-box;
  .edit-input {
    display: flex;
    white-space: nowrap;
    align-items: center;
    margin-bottom: 20px;
  }
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
.submit-btn-add {
  margin: 20px auto;
}
.add-content {
  width: 100%;
  height: 300px;
  padding: 0 20px;
  box-sizing: border-box;
  .table-box {
    width: 100%;
    height: 240px;
    .table-head {
      display: flex;
      padding: 20px 0;
      box-sizing: border-box;
      color: #303133;
      background-color: #EBEEF5;
      .th-item {
        width: 140px;
        text-align: center;
        padding: 0 10px;
        box-sizing: border-box;
      }
      .th-item-second {
        width: 160px;
      }
      .th-item-first {
        width: 80px;
      }
    }
    .table-content {
      .table-row {
        display: flex;
        padding: 20px 0;
        box-sizing: border-box;
        color: #303133;
        .tr-item {
          width: 140px;
          text-align: center;
          padding: 0 10px;
          box-sizing: border-box;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .tr-item-second {
          width: 160px;
          .cust-info {
            margin-left: 5px;
            .info-msg {
              line-height: 20px;
            }
            .info-light {
              color: #ffa500;
            }
          }
        }
        .tr-item-first {
          width: 80px;
        }
      }
    }
  }
}
::v-deep .el-input-group__append {
  background-color: #294A7B;
  border: 1px solid #284A7B;
}
::v-deep .el-icon-search {
  color: #ffffff;
}
</style>