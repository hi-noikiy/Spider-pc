<template>
  <div class="code-invitate-form">
    <go-back title="新建拉群"></go-back>
    <div class="container">
      <div class="module">
        <div class="title">基础信息</div>
        <div class="content">
          <div class="base-form">
            <el-form label-width="120px">
              <el-form-item label="二维码名称" :rules="[{ required: true, message: '该字段不能为空' }]"
              >
                <el-input placeholder="名称不会展示给用户,用于企业记录渠道名称或使用场景"></el-input>
              </el-form-item>
              <el-form-item label="使用人员" :required="true">
                <div class="user-item" v-if="selectedUsers.length != 0">
                  <span class="user-item-content" v-for="(item, index) in selectedUsers" :key="index">
                    <i class="item-icon el-icon-s-custom"></i>
                    {{ item.name }}
                  </span>
                </div>
                <el-button icon="el-icon-plus" plain size="small" @click="addUsers">添加</el-button>
              </el-form-item>
              <el-form-item label="好友验证">
                <div class="verify-switch">
                  <el-switch></el-switch>
                  <span>已关闭</span>
                  <el-tooltip
                    effect="light"
                    placement="right"
                    content="开启好友验证后，用户扫码添加好友需要验证后才会添加成功，关闭好友验证后不需要验证，直接添加成功"
                  >
                    <i class="el-icon-question"></i>
                  </el-tooltip>
                </div>
              </el-form-item>
              <el-form-item label="行为标签">
                <div class="none-tag" v-if="behaviorTagList.length == 0">
                  暂无创建的行为标签，<el-button type="text" @click="goToCreate">请先前往创建&nbsp;&gt;</el-button>
                </div>
                <div class="tag-list-wrapper">
                  <div :class="['tag-list', tagShowMoreFlag ? 'show' : '']">
                    <div class="tag-list-box" ref="behaviorTagList">
                      <div class="tag-group" v-for="(item, index) in behaviorTagList" :key="index">
                        <div class="group-title">{{ item.name }}</div>
                        <div class="group-content">
                          <div
                            class="tag-item"
                            v-for="(obj, idx) in item.tagList"
                            :key="idx"
                            :class="checkTagActive(obj) ? 'active' : ''"
                            @click="onTagSelect(obj, item.id)"
                          >
                            {{ obj.name }}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="tag-list-more" v-if="behaviorTagBoxHeight > 110">
                      <el-button type="text" @click="tagShowMoreFlag = !tagShowMoreFlag">
                        {{ tagShowMoreFlag ? '收起' : '展开' }}
                        <i :class="[tagShowMoreFlag ? 'el-icon-arrow-up' : 'el-icon-arrow-down']"></i>
                      </el-button>
                    </div>
                  </div>
                </div>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
      <div class="module">
        <div class="title">设置群信息</div>
        <div class="setting-content">
          <div class="group-setting">
            <el-form label-width="120px">
              <el-form-item label="入群引导语" :required="true">
                <div class="setting-input-box">
                  <el-input
                    placeholder="例：你好！扫码下方二维码进群交流~如有问题，可随时咨询"
                    id="textInput"
                    class="textarea-input"
                    type="textarea"
                    maxlength="1300"
                    size="small"
                    :rows="6"
                    resize="none"
                    show-word-limit
                    style="width: 100%"
                    v-model="form.message"
                  >
                  </el-input>
                </div>
                <div class="setting-tips">
                  <div class="tips-title">提示：</div>
                  <div class="tips-content">
                    <p>1、可添加多个群聊，当前面的群人数达到上限后，自动发送后面的群二维码</p>
                    <p>2、群人数上限最多为200人</p>
                    <p>3、上传群二维码时请【仔细核对】，群二维码和群聊【对应错误】将导致【拉群任务失败】</p>
                  </div>
                </div>
              </el-form-item>
              <el-form-item v-for="(item, index) in selectedColony" :key="index" :label="'群聊' + (index + 1)" :required="true">
                <div class="group-box">
                  <div class="group-content">
                    <div class="g-c-left">
                      <img class="group-img" src="../../../images/group-icon.png"/>
                      <div class="group-msg">
                        <div class="msg-name">{{item.colonyInfo.name}}</div>
                        <div class="msg-numb">{{item.colonyInfo.quantity}} / 200人</div>
                      </div>
                    </div>
                    <div class="g-c-right">
                      <!-- <i class="el-icon-edit right-icon"></i> -->
                      <i class="el-icon-delete right-icon" @click="deleteSelectedColony(index)"></i>
                    </div>
                  </div>
                  <div class="group-qrcode">
                    <upload-image :multiple="false" tips="上传群二维码" @success="(val) => uploadImageSuccess(val, index)" :fileList="item.colonyInfo.qrCodeList"></upload-image>
                  </div>
                </div>
              </el-form-item>
              <el-form-item label="群聊" :required="true">
                <el-button size="mini" icon="el-icon-plus" @click="showColonyDialog">选择群聊</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="preview-panel">
            <div class="panel-title">客户收到的消息</div>
            <div class="panel-content">
              <img src="../../../images/groupsendMobile.png"/>
              <div class="preview-content">
                <div class="p-cont-time">
                  <span>{{ newTime }}</span>
                </div>
                <div class="p-cont-text" v-if="form.message.length != 0">
                  <i class="el-icon-user-solid icon-user"></i>
                  <div class="text-content">
                    <p>{{ form.message }}</p>
                  </div>
                </div>
                <!-- <div class="p-cont-text" v-if="form.message.length != 0">
                  <i class="el-icon-user-solid icon-user"></i>
                  <div>
                    <img class="img-content" src="#" />
                  </div>
                </div> -->
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="f-btn-group">
        <el-button @click="goBack">取消</el-button>
        <el-button type="primary" @click="submitCodeInvitateForm" :loading="isLoading">保存</el-button>
      </div>
    </div>
    <!-- 选择客户群 -->
    <com-dialog :config="colonyDialog.config" @closeDialog="closeColonyDialog">
      <div class="colony-dialog">
        <div class="common-table-box">
          <el-table
            :data="colonyDialog.tableData"
            style="width: 100%"
            height="400"
            :header-cell-style="{ 'text-align': 'center', 'background-color': '#ebeef5', 'color': '#333333' }"
          >
            <el-table-column label="群名称" align="center" prop="name"></el-table-column>
            <el-table-column label="群主" align="center" prop="ownerName"></el-table-column>
            <el-table-column label="群人数" align="center" prop="quantity"></el-table-column>
            <!-- <el-table-column label="今日加群人数" align="center" prop="todayIn"></el-table-column> -->
            <!-- <el-table-column label="今日退群人数" align="center" prop="todayOut"></el-table-column> -->
            <el-table-column label="创建时间" align="center" prop="createAtToTime"></el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <div v-if="scope.row.isSelected">已添加</div>
                <el-checkbox v-else v-model="scope.row.checked" @change="colonyCheckChange(scope.row)"></el-checkbox>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="common-pagination">
          <com-pagination :page="colonyDialog.page" @sizeChange="onSizeChange" @pageChange="onPageChange"></com-pagination>
        </div>
        <div class="group-btn">
          <el-button @click="closeColonyDialog">取 消</el-button>
          <el-button type="primary" @click="onColonySubmit">确 定</el-button>
        </div>
      </div>
    </com-dialog>
    <!-- 选择成员 -->
    <department-dialog
      :config="departmentDialog.config"
      @closeDialog="departmentDialog.config.visible = false"
      :selectedList="selectedUsers"
      @handleConfirm="handleConfirm"
    >
    </department-dialog>
  </div>
</template>

<script>
import GoBack from '../../../components/components/GoBack'
import ComDialog from '../../../components/common/ComDialog'
import ComPagination from '../../../components/common/ComPagination'
import UploadImage from '../../../components/components/UploadImage'
import DepartmentDialog from '../../../components/components/MemberTreeLinkageDialog'
export default {
  components: { GoBack, ComDialog, ComPagination, UploadImage, DepartmentDialog },
  data() {
    return {
      form: {
        message: ''
      },
      newTime: '', // 当前时刻
      departmentDialog: { // 选择成员弹窗
        config: {
          width: '800px',
          title: '添加成员',
          visible: false
        }
      },
      selectedUsers: [], // 已选择的成员
      selectedTags: [], // 已选的行为标签
      behaviorTagList: [], // 行为标签列表
      behaviorTagBoxHeight: 0, // 行为标签容器高度
      tagShowMoreFlag: false, // 是否显示展开/收起按钮
      colonyDialog: { // 客户群列表
        config: {
          width: '800px',
          title: '选择群聊',
          visible: false
        },
        tableData: [],
        page: {
          pageNum: 1,
          pageSize: 15,
          total: 0
        }
      },
      selectedColony: [], // 已选择的群列表
      selectedRow: {}, // 群聊弹窗中选中的群
      isLoading: false,
    }
  },
  created() {
    this.getBehaviorTagList()
    this.getNewTime()
  },
  methods: {
    getBehaviorTagList() {
      this.$http.getBehaviorPages().then(res => {
        this.behaviorTagList = res.data.data
        this.$nextTick(() => {
          this.getBehaviorTagBoxHeight()
        })
      })
    },
    // 获取行为标签容器高度
    getBehaviorTagBoxHeight() {
      let height = this.$refs.behaviorTagList.offsetHeight
      this.behaviorTagBoxHeight = height
    },
    // 获取当前时间
    getNewTime() {
      this.newTime = ''
      const hh = new Date().getHours() < 10 ? '0' + new Date().getHours() : new Date().getHours()
      const mm = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes()
      this.newTime = hh + ':' + mm
    },
    // 获取选择的成员列表
    handleConfirm(list) {
      this.selectedUsers = list
      console.log('已选择的成员', list)
      this.departmentDialog.config.visible = false
    },
    // 添加成员
    addUsers() {
      this.departmentDialog.config.visible = true
    },
    // 判断当前标签是否被选中
    checkTagActive(obj) {
      let flag = this.selectedTags.some((item) => item.id === obj.id)
      if (flag) {
        return true
      } else {
        return false
      }
    },
    // 选择行为标签
    onTagSelect(obj, groupId) {
      // 当前已经选中则取消选择，否则选中当前项
      let flag = this.selectedTags.some((item) => item.id === obj.id)
      if (flag) {
        this.selectedTags.splice(this.selectedTags.findIndex((item) => item.id === obj.id), 1)
      } else {
        let tag = {
          id: obj.id,
          name: obj.name,
          groupId: groupId
        }
        this.selectedTags.push(tag)
      }
    },
    // 打开群聊弹窗
    showColonyDialog() {
      this.colonyDialog.config.visible = true
      this.getColonyList()
    },
    // 关闭群聊弹窗
    closeColonyDialog() {
      this.colonyDialog.config.visible = false
    },
    // 获取当前选中的群聊
    onColonySubmit() {
      this.selectedRow.isSelected = true
      let obj = {
        colonyInfo: this.selectedRow,
        qrCodeList: []
      }
      this.selectedColony.push(obj)
      this.colonyDialog.config.visible = false
      console.log('已选的群聊', this.selectedColony)
    },
    // 获取客户群列表
    getColonyList() {
      this.$http.getCustomerColonyPage(this.colonyDialog.page).then(res => {
        this.colonyDialog.page.total = res.data.data.total
        let newList = res.data.data.list
        newList.forEach(item => {
          item.checked = false
          item.isSelected = false
        })
        newList.forEach(obj => {
          let flag = this.selectedColony.some((row) => row.colonyInfo.id === obj.id)
          if (flag) {
            obj.isSelected = true
          }
        })
        this.colonyDialog.tableData = newList
        console.log('已选', this.selectedColony, this.colonyDialog.tableData)
      })
    },
    // 选择群聊的项改变
    colonyCheckChange(row) {
      console.log('返回值', row.checked)
      let checked = row.checked
      let list = [].concat(this.colonyDialog.tableData)
      list.forEach(item => {
        item.checked = false
      })
      list.forEach(obj => {
        if (obj.id === row.id) {
          obj.checked = checked
        }
      })
      this.colonyDialog.tableData = list
      this.selectedRow = row
    },
    // 上传图片成功
    uploadImageSuccess(val, idx) {
      console.log('返回数据', val, idx)
      this.selectedColony[idx].qrCodeList = val
    },
    // 删除已选择的群聊
    deleteSelectedColony(idx) {
      this.selectedColony.splice(idx, 1)
    },
    onSizeChange(val) {
      this.colonyDialog.page.pageSize = val
      this.colonyDialog.page.pageNum = 1
      this.getColonyList()
    },
    onPageChange(val) {
      this.colonyDialog.page.pageNum = val
      this.getColonyList()
    },
    goBack() {
      this.$router.go(-1)
    },
    // 提交自动建群表单
    submitCodeInvitateForm() {

    },
    // 跳转到标签管理页
    goToCreate() {
      this.$router.push('/main/scrm/tag-library/enterprise/list')
    }
  }
}
</script>

<style lang="scss" scoped>
.code-invitate-form {
  height: 100%;
}
.container {
  background-color: #ffffff;
  padding: 20px;
  box-sizing: border-box;
  margin-bottom: 20px;
  .module {
    .title {
      position: relative;
      padding: 10px 0;
      color: #606266;
      &::before {
        content: "";
        width: 6px;
        height: 20px;
        background-color: #294a7b;
        position: absolute;
        top: 0;
        bottom: 0;
        left: -20px;
        top: 8px;
      }
    }
    .content {
      margin: 20px 0;
      .base-form {
        margin-top: 20px;
        .verify-switch {
          display: flex;
          align-items: center;
          span {
            margin: 0 10px;
          }
        }
        .tag-list-wrapper {
          padding: 20px;
          background-color: #fbfbfb;
          .tag-list {
            position: relative;
            height: 110px;
            overflow: hidden;
            padding-right: 68px;
            &.show {
              height: auto;
              overflow: none;
            }
            .tag-list-box {
              .tag-group {
                display: flex;
                color: #606266;
                .group-title {
                  width: 72px;
                  margin-right: 20px;
                  text-align: right;
                  line-height: 30px;
                }
                .group-content {
                  flex: 1;
                  display: flex;
                  flex-wrap: wrap;
                  .tag-item {
                    cursor: pointer;
                    padding: 5px;
                    background-color: #fff;
                    border-radius: 4px;
                    height: 20px;
                    line-height: 20px;
                    margin: 0 10px 10px 0;
                  }
                  .active {
                    background-color: #294a7b;
                    color: #ffffff;
                  }
                }
              }
            }
            .tag-list-more {
              position: absolute;
              right: 10px;
              bottom: 0;
            }
          }
        }
      }
    }
    .setting-content {
      margin: 20px 0;
      display: flex;
      .group-setting {
        flex: 1;
        .setting-tips {
          display: flex;
          background-color: #fdf6ec;
          color: #E6A23C;
          padding: 8px 16px;
          border-radius: 4px;
          margin-top: 20px;
          line-height: 24px;
          .tips-title {
            width: 50px;
          }
          .tips-content {
            flex: 1;
          }
        }
        .group-box {
          padding: 20px;
          background: #fbfbfb;
          border-radius: 2px;
          border: 1px solid #eee;
          font-size: 14px;
          .group-content {
            display: flex;
            line-height: 20px;
            align-items: center;
            .g-c-left {
              display: flex;
              padding: 10px;
              width: 250px;
              background: #ffffff;
              border: 1px solid #eee;
              .group-img {
                width: 40px;
                height: 40px;
              }
              .group-msg {
                width: 200px;
                margin-left: 10px;
                .msg-name {
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                }
                .msg-numb {
                  color: #999;
                }
              }
            }
            .g-c-right {
              .right-icon {
                background: #f0f0f0;
                padding: 4px;
                cursor: pointer;
                margin-left: 10px;
              }
            }
          }
          .group-qrcode {
            margin-top: 20px;
          }
        }
      }
      .preview-panel {
        width: 400px;
        text-align: center;
        .panel-title {
          font-size: 14px;
          color: #606266;
          margin-bottom: 20px;
          text-align: center;
        }
        .panel-content {
          position: relative;
          img {
            width: 270px;
            height: 535px;
          }
          .preview-content {
            height: 350px;
            width: 255px;
            top: 90px;
            left: 70px;
            position: absolute;
            overflow-y: auto;
            .p-cont-time {
              span {
                font-size: 12px;
                color: #606266;
              }
            }
            .p-cont-text {
              text-align: left;
              display: flex;
              .icon-user {
                text-align: center;
                background-color: #294a7b;
                width: 30px;
                height: 30px;
                color: #fff;
                border-radius: 5px;
                line-height: 30px;
                margin: 20px 0 0 20px;
              }
              .text-content {
                position: relative;
                margin: 20px 10px 0 10px;
                p {
                  user-select: none;
                  line-height: 15px;
                  letter-spacing: 1px;
                  width: 150px;
                  word-wrap: break-word;
                  border-radius: 5px;
                  padding: 10px;
                  background-color: #fff;
                  font-size: 12px;
                  color: #595959;
                }
              }
              .text-content::before {
                content: '';
                display: block;
                width: 0;
                height: 0;
                border: 8px solid #fff;
                border-top-color: transparent;
                border-left-color: transparent;
                border-bottom-color: transparent;
                position: absolute;
                top: 8px;
                left: -15px;
              }
              .img-content {
                width: 100px;
                height: 100px;
                margin: 20px 0 0 10px;
              }
            }
          }
        }
      }
    }
  }
}
.user-item {
  width: 500px;
  display: flex;
  flex-wrap: wrap;
  line-height: 14px;
  border-radius: 3px;
  .item-icon {
    color: #294a7b;
  }
  span {
    border: 1px solid #dcdfe6;
    padding: 5px;
    cursor: pointer;
    margin: 8px 8px 7px 0;
    border-radius: 3px;
  }
}
.colony-dialog {
  .group-btn {
    display: flex;
    justify-content: flex-end;
    padding-top: 20px;
  }
}
.f-btn-group {
  margin-left: 100px;
  margin-top: 50px;
}
::v-deep .el-form-item .el-form-item {
  margin-bottom: 22px;
}
.preview-content::-webkit-scrollbar {
  width: 2px;
  height: 20px;
}
</style>