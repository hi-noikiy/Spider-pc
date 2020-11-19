<template>
  <div class="department">
    <div class="top">
      <div class="reload">
        <el-button type="primary" @click="dataSync" size="small">数据同步</el-button>
        <!-- <el-button type="primary" @click="openConfig" size="small">对外信息设置跳转</el-button> -->
        <el-button type="primary" @click="customerMessage" size="small">对外信息设置</el-button>
      </div>
      <div class="search">
        <div class="search_content">
          <ul>
            <li>
              <div class="title">成员姓名</div>
              <div class="inp">
                <el-input
                  v-model="searchData.name"
                  placeholder="请输入成员姓名"
                  clearable
                  @input="searchByUserName"
                  size="small"
                ></el-input>
              </div>
            </li>
          </ul>
        </div>
        <!-- <div class="search_btns">
          <el-button type="primary" size="small">搜索</el-button>
        </div> -->
      </div>
    </div>
    <div class="content">
      <div class="left">
        <el-tree
          class="myTree"
          :data="data"
          node-key="deptId"
          :props="defaultProps"
          :default-expanded-keys="[1]"
          @node-click="handleNodeClick"
        ></el-tree>
        <!-- <el-input
          class="myTextarea"
          type="textarea"
          placeholder="请输入内容"
          resize="none"
          v-model="searchData.name"
          maxlength="4000"
          show-word-limit
        >
        </el-input> -->
      </div>
      <div class="right">
        <el-table
          :data="tableData"
          style="width: 100%"
          :height="height"
          id="table"
          v-loading="isLoading"
          :header-cell-style="{ 'text-align': 'center', 'background-color': '#ebeef5', color: '#333333' }"
          @selection-change="handleSelectionChange"
          :row-key="getRowKey"
          ref="multipleTable"
        >
          <el-table-column type="selection" :reserve-selection="true"></el-table-column>
          <el-table-column prop="name" label="姓名" align="center"> </el-table-column>
          <el-table-column prop="address" label="头像" align="center">
            <template slot-scope="scope">
              <el-image
                style="width: 44px; height: 44px"
                :src="scope.row.thumbAvatar || defaultHearderImage"
                fit="fill"
              ></el-image>
            </template>
          </el-table-column>
          <el-table-column prop="position" label="职务" align="center"> </el-table-column>
          <el-table-column prop="deptName" label="部门" align="center"></el-table-column>
          <el-table-column prop="mobile" label="手机" align="center"> </el-table-column>
          <el-table-column prop="email" label="邮箱" align="center"> </el-table-column>
          <el-table-column prop="attrName" label="对外信息" align="center"> </el-table-column>
          <el-table-column prop="createTime" label="添加时间" align="center">
            <template slot-scope="scope">
              {{ scope.row.createTime | allTableTimefilters }}
            </template>
          </el-table-column>
          <!-- <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <div>
                <el-button type="text" @click="showCrop(scope.row)">详情</el-button>
              </div>
            </template>
          </el-table-column> -->
        </el-table>
        <div class="page">
          <div class="pagination-count">
            <span class="count">共：{{ pageData.total }}&nbsp;条数据</span>
          </div>
          <el-pagination
            @size-change="onSizeChange"
            @current-change="onPageChange"
            :page-sizes="[15, 30, 50]"
            :page-size="pageData.pageSize"
            :current-page="pageData.pageNum"
            :total="pageData.total"
            layout="prev, pager, next, sizes"
            background
            style="margin-right: -26px"
          ></el-pagination>
        </div>
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
import ComDialog from '../../../components/common/ComDialog'
import Emotion from '../../../components/common/Emotion'
import SelectProgramItem from '../../../components/components/SelectProgramItem'
export default {
  components: { ComDialog, Emotion, SelectProgramItem },
  data() {
    return {
      data: [
        {
          name: '公司名称',
          childs: [
            {
              name: '部门名称'
            }
          ]
        }
      ],
      defaultProps: {
        children: 'childs',
        label: 'name'
      },
      height: 400,
      pageData: {
        pageSize: 15,
        pageNum: 1,
        total: 0
      },
      searchData: {
        name: ''
      },
      tableData: [],
      isLoading: false,
      nowId: '',
      //弹窗
      customerDialog: {
        config: {
          width: '800px',
          title: '对外信息设置',
          visible: false
        }
      },
      memberList: [], //选择树后的人
      //树的事件
      departmentDialog: {
        config: {
          width: '800px',
          title: '选择成员',
          visible: false
        }
      },
      navList: [
        {
          title: '无',
          type: 'text'
        },
        {
          title: '图文链接',
          type: 'image_text'
        },
        {
          title: '小程序',
          type: 'program'
        }
      ],
      dataList: {
        // 类型
        radioValue: 'text',
        // 文本
        textarea: '',
        // 图片
        image: [],
        programId: ''
      },

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
      selectList: [], //表格选中的数据
      selectIdList: [] //表格选中的数据的id列表
    }
  },
  methods: {
    // ---页面渲染函数---
    //获取选中的数据
    handleSelectionChange(val) {
      // console.log(val)
      this.selectIdList = []
      this.selectList = val
      this.selectList.forEach(item => {
        this.selectIdList.push(item.id)
      })
      sessionStorage.setItem('idList', this.selectIdList)
    },
    // 保存选中的数据id,row-key就是要指定一个key标识这一行的数据
    getRowKey(row) {
      return row.id
    },
    //成员对外信息展示按钮
    customerMessage() {
      this.customerDialog.config.visible = true
    },
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
      this.model.userIdList = []
      if (this.selectIdList.length == 0) {
        this.$message.warning('请选择成员')
        return
      }
      if (this.selectIdList.length != 0) {
        this.model.userIdList = this.selectIdList
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
    //点击跳转对外信息按钮
    openConfig() {
      this.$router.push('/main/scrm/inner-management/external/list')
    },
    //点击添加按钮，打开树图
    openDepartDialog() {
      this.departmentDialog.config.visible = true
    },

    //点击插入表情
    _selectedEmotion(val) {
      let textInput = document.getElementById('textInput')
      // 插入表情
      let insert = textInput.selectionStart
      this.model.textValue = textInput.value.substr(0, insert) + val + textInput.value.substr(insert)
    },
    //点击详情按钮
    showCrop(row) {
      this.$router.push(`/main/scrm/inner-management/department/detail?id=${row.id}`)
    },
    //点击树解构的确认按钮
    handleNodeClick(data) {
      if (data.parentId == 0) {
        this.nowId = ''
        this.getDepartmentTreeMember({})
        return
      }
      this.nowId = data.id
      this.pageData.pageNum = 1
      this.getDepartmentTreeMember({ deptId: data.id })
    },
    // 分页
    onSizeChange(val) {
      this.pageData.pageSize = val
      this.getDepartmentTreeMember({ deptId: this.nowId })
    },
    onPageChange(val) {
      this.pageData.pageNum = val
      this.getDepartmentTreeMember({ deptId: this.nowId })
    },
    getTableHeight() {
      const OTHER_HEIGHT = 76 + 40 + 52
      this.height = window.innerHeight - document.querySelector('#table').offsetTop - OTHER_HEIGHT
    },
    // 顶部搜索
    searchByUserName() {
      let option = {
        userName: this.searchData.name,
        deptId: ''
      }
      this.getDepartmentTreeMember(option)
    },
    // 数据同步
    dataSync() {
      this.isLoading = true
      this.$http.syncCustomerList().then(() => {
        this.$message.success('同步成功')
        this.getDepartmentTreeMember({ deptId: this.nowId })
      })
    },
    // ---数据获取函数---
    // 获取部门数据
    getDepartmentTreeData() {
      this.$http.getDepartmentTreeData().then(res => {
        this.data = res.data.data
        if (!res.data.data[0].id) {
          this.isLoading = false
          return
        }
        this.getDepartmentTreeMember({})
      })
    },
    getDepartmentTreeMember(options) {
      this.isLoading = true
      options.pageSize = this.pageData.pageSize
      options.pageNum = this.pageData.pageNum
      this.$http.getDepartmentTreeMember(options).then(res => {
        this.tableData = res.data.data.list
        this.pageData.total = res.data.data.total
        let selectId = sessionStorage.getItem('idList')
        if (selectId != '' && selectId != null) {
          let arr = selectId.split(',')
          this.$nextTick(() => {
            this.tableData.forEach(item => {
              let flag = arr.some(label => item.id === label)
              if (flag) {
                this.$refs.multipleTable.toggleRowSelection(item, true)
              }
            })
          })
        }
        this.isLoading = false
      })
    },
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
        this.getDepartmentTreeData()

        // sessionStorage.removeItem('idList')
      })
    }
  },
  created() {
    // 获取部门数据
    this.getDepartmentTreeData()
    sessionStorage.removeItem('idList')
  },
  mounted() {
    this.$nextTick(() => {
      this.getTableHeight()
      window.onresize = () => {
        this.getTableHeight()
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.department {
  width: 100%;
  height: 100%;
  .top {
    width: 100%;
    box-sizing: border-box;
    display: flex;
    padding: 0 20px;
    background-color: #ffffff;
    .search {
      padding-top: 20px;
      display: flex;
      height: 36px;
      .search_content {
        ul {
          display: flex;
          li {
            height: 36px;
            display: flex;
            align-items: center;
            font-size: 14px;
            margin-right: 10px;
            .title {
              color: #606266;
              margin-right: 10px;
            }
          }
        }
      }
      .search_btns {
        display: flex;
        align-items: center;
      }
    }
    .reload {
      padding-top: 20px;
      margin-right: auto;
    }
  }
  .content {
    width: 100%;
    height: calc(100% - 76px);
    display: flex;
    .left {
      width: 279px;
      height: 100%;
      background-color: #ffffff;
      padding: 20px;
      box-sizing: border-box;
      .myTree {
        ::v-deep .el-tree-node__content {
          height: 50px;
          .el-tree-node__label {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }
    .right {
      width: calc(100% - 289px);
      height: 100%;
      background-color: #ffffff;
      padding: 20px;
      box-sizing: border-box;
      margin-left: 10px;
    }
    .page {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #fff;
      padding: 10px 15px;
      .pagination-count {
        height: 28px;
        line-height: 28px;
        font-size: 14px;
        color: #7b7b7b;
        .count {
          margin-right: 20px;
        }
      }
    }
  }
}
.customer-container {
  .information-form {
    padding: 0 20px;
    // border: 1px solid red;
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
            // margin-left: 50px;

            .el-form {
              .el-form-item {
                margin: 10px 0;
              }
              // .type-text-textarea {
              //   ::v-deep .el-textarea__inner {
              //     padding: 5px 15px 20px;
              //   }
              //   ::v-deep .el-input__count {
              //     width: calc(100% - 12px);
              //     background-color: #ffffff;
              //     right: 11px;
              //     bottom: 1px;
              //     border-bottom-left-radius: 4px;
              //     text-align: right;
              //     padding: 4px;
              //     box-sizing: border-box;
              //   }
              // }
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
.emotion {
  display: flex;
  justify-content: flex-start;
  padding: 3px 0;
  .emotion-emjoi {
    margin-left: auto;
  }
}
// .myTextarea {
//   ::v-deep .el-textarea__inner {
//     height: 200px;
//     padding-bottom: 20px;
//   }
//   ::v-deep .el-input__count {
//     width: calc(100% - 2px) ;
//     bottom: 1px;
//     height: 20px;
//     line-height: 20px;
//     text-align: right;
//     left: 1px;
//     border-bottom-right-radius: 4px;
//     border-bottom-left-radius: 4px;
//     padding-right: 10px;
//     box-sizing: border-box;
//   }
// }
</style>
