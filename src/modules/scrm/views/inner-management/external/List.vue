<template>
  <div class="external-div">
    <GoBack :title="'返回'"></GoBack>
    <div class="container">
      <div class="top_search">
        <div class="operating-btn">
          <el-button size="small" type="primary" @click="addExternal">新建类型</el-button>
        </div>
      </div>
      <div class="common-table-box">
        <el-table
          :data="tableData"
          width="100%"
          id="table"
          class="el-table"
          :header-cell-style="{ 'text-align': 'center', 'background-color': '#ebeef5', color: '#333333' }"
          :height="height"
          @cell-mouse-enter="isOverflow"
        >
          <el-table-column label="类型" align="center">
            <template slot-scope="scope">
              <div>
                {{ scope.row.type | isType }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="类型名称" prop="name" align="center"></el-table-column>
          <el-table-column label="关联人员" class="special-column" align="center">
            <template slot-scope="scope">
              <div class="tagname-form">
                <span class="tagName" v-for="(item, index) in scope.row.userName" :key="index"
                  ><i class="el-icon-user-solid icon-user"></i>{{ item }}</span
                >
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <div>
                <el-button type="text" @click="editExternal(scope.row)">修改</el-button>
                <el-button type="text" @click="deleteExternal(scope.row)">删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="common-pagination">
        <com-pagination :page="page" @sizeChange="onSizeChange" @pageChange="onPageChange"></com-pagination>
      </div>
    </div>

    <com-dialog :config="customerDialog.config" @closeDialog="closeCustomerDialog">
      <div class="customer-container">
        <div class="information-div">
          <div class="information-form">
            <el-form label-position="left" label-width="100px">
              <el-form-item label="类型名称:" :required="true">
                <el-input placeholder="请输入类型名称" maxlength="32" show-word-limit v-model="model.name"></el-input>
              </el-form-item>
              <el-form-item label="类型:" :required="true">
                <div class="information-type">
                  <el-radio-group v-model="model.type">
                    <el-radio :label="0">文本</el-radio>
                    <el-radio :label="1">网页</el-radio>
                    <el-radio :label="2">小程序</el-radio>
                  </el-radio-group>
                  <div class="type-text" v-if="model.type == 0">
                    <el-form label-position="left" label-width="80px">
                      <div class="type-text-textarea">
                        <el-form-item label="文本内容" :required="true">
                          <el-input
                            v-model="model.textValue"
                            max="32"
                            maxlength="32"
                            show-word-limit
                            id="textInput"
                            placeholder="请输入文本内容"
                          ></el-input>
                        </el-form-item>
                      </div>
                    </el-form>
                  </div>
                  <div class="type-web" v-if="model.type == 1">
                    <el-form label-position="left" label-width="80px">
                      <el-form-item label="网页标题" :required="true">
                        <el-input v-model="model.webTitle" placeholder="请输入网页标题" maxlength="32" show-word-limit>
                        </el-input>
                      </el-form-item>
                      <el-form-item label="网页链接" :required="true">
                        <el-input
                          v-model="model.webUrl"
                          placeholder="请输入网页链接"
                          maxlength="128"
                          show-word-limit
                        ></el-input>
                      </el-form-item>
                    </el-form>
                  </div>
                  <div class="type-progarm" v-if="model.type == 2">
                    <el-form>
                      <SelectProgramItem
                        ref="SelectProgramItem"
                        :programIdProps="model.programAppId"
                      ></SelectProgramItem>
                    </el-form>
                  </div>
                </div>
              </el-form-item>
              <el-form-item label="关联人员" :required="true">
                <div class="tree-div">
                  <!-- <Tree></Tree> -->
                  <DepartmentTree :selectedList="selectedList" ref="department"></DepartmentTree>
                </div>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
      <div class="customer-btn">
        <div>
          <el-button @click="closeNoticeDialog()">取消</el-button>
          <el-button type="primary" @click="sumbitNotice()">保存</el-button>
        </div>
      </div>
    </com-dialog>
  </div>
</template>

<script>
import TableList from '../../../components/components/TableList'
import ComPagination from '../../../components/common/ComPagination'
import ComDialog from '../../../components/common/ComDialog'
import SelectProgramItem from '../../../components/components/SelectProgramItem'
import GoBack from '../../../components/components/GoBack.vue'
import Tree from '../../../components/components/Tree'
import DepartmentTree from '../../../components/common/DepartmentTree'
export default {
  components: { TableList, ComPagination, ComDialog, SelectProgramItem, GoBack, Tree, DepartmentTree },

  data() {
    return {
      tableData: [],
      selectedList: [],
      height: 400, //表格高度
      page: {
        pageNum: 1,
        pageSize: 15,
        total: 0
      },
      //弹窗
      customerDialog: {
        config: {
          width: '800px',
          visible: false,
          title: ''
        }
      },
      addedit: '',
      model: {
        userIdList: [],
        name: '',
        textValue: '',
        webUrl: '',
        webTitle: '',
        programAppId: '',
        programPagePath: '',
        programTitle: '',
        type: 0
      },
      selectIdList: []
    }
  },
  mounted() {
    this.getMembers()
  },
  methods: {
    getMembers() {
      this.$http.getMomentsMembers().then(res => {
        this.selectedList = res.data.data
        this.$nextTick(() => {
          this.$refs.department.setCheckedNodes()
        })
      })
    },
    //方法部分开始
    //弹窗关闭按钮
    closeCustomerDialog() {
      this.customerDialog.config.visible = false
    },
    //取消按钮
    closeNoticeDialog() {
      this.customerDialog.config.visible = false
    },
    //保存按钮
    sumbitNotice() {
      this.selectedList = this.$refs.department.selectedMenu
      this.model.userIdList = []
      if (this.selectedList.length != 0) {
        this.selectedList.forEach(item => {
          this.model.userIdList.push(item.id)
        })
      }
      if (this.model.userIdList.length == 0) {
        this.$message.warning('请选择成员')
        return
      }
      if (this.model.name == '') {
        this.$message.warning('请输入类型名称')
        return
      }
      if (this.model.type == 0) {
        if (this.model.textValue == '') {
          this.$message.warning('文本内容不能为空')
          return
        }
        this.model.webTitle = ''
        this.model.webUrl = ''
        this.model.programAppId = ''
        this.model.programPagePath = ''
        this.model.programTitle = ''
        this.updateUserExternalAttr()
      }
      if (this.model.type == 1) {
        if (this.model.webTitle == '') {
          this.$message.warning('网页名称不能为空')
          return
        }
        if (this.model.webUrl == '') {
          this.$message.warning('网页链接不能为空')
          return
        }
        if (this.model.webUrl != '') {
          var reg = /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/
          if (!reg.test(this.model.webUrl)) {
            this.$message.warning('请输入正确的网页链接')
            return
          }
        }
        this.model.textValue = ''
        this.model.programAppId = ''
        this.model.programPagePath = ''
        this.model.programTitle = ''
        this.updateUserExternalAttr()
      }
      if (this.model.type == 2) {
        let program = this.$refs.SelectProgramItem.success()
        if (program.appId == undefined || program.page == undefined || program.name == undefined) {
          this.$message.warning('请选择小程序')
          return
        } else {
          this.model.programAppId = program.appId
          this.model.programPagePath = program.page
          this.model.programTitle = program.name
          this.model.textValue = ''
          this.model.webTitle = ''
          this.model.webUrl = ''
          this.updateUserExternalAttr()
        }
      }
    },

    //点击新建类型按钮
    addExternal() {
      this.customerDialog.config.title = '新增类型'
      this.customerDialog.config.visible = true
    },
    isOverflow(row, column, cell, event) {
      // console.log(row);
      if (column.label == '成员') {
        // console.log(cell)
      }
    },
    fullTableHeight() {
      const TOP_HEADER_HEIGHT = 60,
        PAGINATION_HEIGHT = 52,
        PADDING_BOTTOM_HEIGHT = 20,
        PADDING_TOP_HEIGHT = 20
      this.height =
        window.innerHeight -
        document.querySelector('#table').offsetTop -
        TOP_HEADER_HEIGHT -
        PAGINATION_HEIGHT -
        PADDING_BOTTOM_HEIGHT -
        PADDING_TOP_HEIGHT
    },
    //如果溢出
    changeCellStyle(row) {
      if (row.column.label === '关联人员') {
        return 'overflow:hidden; text-overflow:ellipsis;display:-webkit-box; -webkit-box-orient:vertical;-webkit-line-clamp:2;  ' // 修改的样式
      } else {
        return ''
      }
    },
    //分页的方法
    onSizeChange(val) {
      this.page.pageSize = val
      this.page.pageNum = 1
      this.getUserExternalPage()
    },
    onPageChange(val) {
      this.page.pageNum = val
      this.getUserExternalPage()
    },
    //修改的方法
    editExternal(row) {
      this.customerDialog.config.title = '修改类型'
      this.model.name = row.name
      this.model.type = row.type
      this.customerDialog.config.visible = true
      this.selectedList = row.userName
      this.$nextTick(() => {
        this.$refs.department.setCheckedNodes()
      })
    },
    //删除的方法
    deleteExternal(row) {
      this.$confirm('是否删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          name: row.name,
          type: row.type,
          userIdList: null,
          textValue: null,
          webUrl: null,
          webTitle: null,
          programAppId: null,
          programPagePath: null,
          programTitle: null
        }
        this.$http.deteleExternal(params).then(() => {
          this.customerDialog.config.visible = false
          this.$message.success('删除成功')
          this.getUserExternalPage()
        })
      })
    },
    //方法部分结束
    //接口部分开始
    updateUserExternalAttr() {
      this.$http.updateUserExternalAttr(this.model).then(() => {
        this.customerDialog.config.visible = false
        this.$message.success('保存成功')
        this.model = {
          userIdList: [],
          name: '',
          textValue: '',
          webUrl: '',
          webTitle: '',
          programAppId: '',
          programPagePath: '',
          programTitle: '',
          type: 0
        }
        this.getUserExternalPage()

        // sessionStorage.removeItem('idList')
      })
    },
    getUserExternalPage() {
      let params = {
        pageSize: this.page.pageSize,
        pageNum: this.page.pageNum
      }
      let userName = []
      this.tableData = []
      this.$http.getUserExternalPage(params).then(res => {
        res.data.data.forEach(item => {
          if (item.userName != '') {
            userName = item.userName.split(';')
          }
          this.tableData.push({
            name: item.name,
            userName: userName,
            type: item.type,
            created: item.created
          })
        })
        this.page.total = res.data.data.length
        // console.log(this.page.total)
      })
      // console.log(this.tableData)
      // this.page.total = this.tableData.length
    }
    //接口部分结束
  },

  created() {
    this.getUserExternalPage()
  },
  mounted() {
    this.$nextTick(() => {
      this.fullTableHeight()
    })
  },
  filters: {
    isType(type) {
      if (type == 0) {
        return '文本'
      }
      if (type == 1) {
        return '网页'
      }
      if (type == 2) {
        return '小程序'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.external-div {
  width: 100%;
  height: 100%;
  position: relative;
  .container {
    width: 100%;
    height: 100%;
    background-color: #ffffff;
    .top_search {
      padding: 20px;
      display: flex;
      .search {
        margin-left: auto;
        &::v-deep .el-form-item {
          margin-bottom: 0;
        }
      }
    }
    .common-table-box {
      padding: 0 20px;
      box-sizing: border-box;
      .tagList {
        span {
          display: inline-block;
          padding: 2px 5px;
          margin: 5px;
          border: 1px solid #f2f2f2;
          border-radius: 3px;
          background-color: #f2f2f2;
        }
      }
    }
    .common-pagination {
      width: 100%;
      position: absolute;
      left: 0;
      bottom: 0;
    }
  }
}
.customer-container {
  &::-webkit-scrollbar {
    width: 5px;
  }
  .information-form {
    padding: 0 20px;
    .el-form {
      .el-form-item {
        .information-tag {
          width: 85%;
          // border: 1px solid red;
          display: inline-block;
          .information-tagdiv {
            .tagName {
              display: inline-block;
              border: 1px solid #546e95;
              padding: 0 5px;
              margin: 0px 8px 7px 0;
              border-radius: 3px;
              height: 28px;
              line-height: 28px;
              color: #546e95;
              i {
                color: #546e95;
              }
            }
          }
        }
        .information-type {
          .type-text {
            border: 1px solid #dcdfe6;
            border-radius: 3px;
            background-color: #f5f5f5;
            padding: 10px;
            .el-form {
              .el-form-item {
                margin: 10px 0;
              }
            }
          }
          .type-web {
            border: 1px solid #dcdfe6;
            border-radius: 3px;
            background-color: #f5f5f5;
            padding: 10px;
            // margin-left: 50px;
            .el-form {
              .el-form-item {
                margin: 10px 0;
              }
            }
          }
          .type-progarm {
            border: 1px solid #dcdfe6;
            border-radius: 3px;
            background-color: #f5f5f5;
            padding: 10px;
            // margin-left: 50px;
          }
        }
      }
      .el-button:nth-child(1) {
        margin-left: 50px;
      }
    }
  }
}
.customer-btn {
  display: flex;
  justify-content: flex-start;
  div {
    margin-left: auto;
  }
}

.tagname-form {
  min-height: 60px;
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  .tagName {
    display: inline-block;
    border: 1px solid #dcdfe6;
    padding: 2px 5px;
    cursor: pointer;
    margin: 8px 8px 7px 0;
    margin-right: 8px;
    margin-bottom: 7px;
    border-radius: 3px;
  }
  .icon-user {
    color: #294a7b;
  }
}
::v-deep .special-column {
  width: 200px;
}
.tree-div {
  border-top: 1px solid rgb(231, 231, 231);
  border-left: 1px solid rgb(231, 231, 231);
  border-bottom: 1px solid rgb(231, 231, 231);
  // border: 1px solid red;
  height: 450px;
  overflow: auto;
  // margin-top: 5px;
  &::-webkit-scrollbar {
    width: 2px;
  }
}
</style>
