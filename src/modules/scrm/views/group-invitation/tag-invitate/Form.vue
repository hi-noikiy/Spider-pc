<template>
  <div class="tag-invitate-form">
    <!-- <div class="top-nav">
      <el-button type="text" icon="el-icon-arrow-left" @click="$router.go(-1)">标签建群</el-button>
    </div> -->
    <go-back title="标签建群"></go-back>
    <div class="container">
      <div class="c-tips">
        <el-alert
          title="每位客户每周最多收到来自客户群发管理员的1条群发消息，如选择的客户本周已收到过群发消息本条邀请将不会成功发送"
          type="warning"
          show-icon
          :closable="false"
        >
        </el-alert>
      </div>
      <div class="module">
        <div class="title">基础信息</div>
        <div class="content">
          <div class="base-form">
            <el-form label-width="100px" label-position="left">
              <el-form-item label="任务名称" :rules="[{ required: true, message: '该字段不能为空' }]"
              >
                <el-input placeholder="请填写任务名称" v-model="form.name"></el-input>
              </el-form-item>
              <el-form-item label="关联成员" :required="true">
                <div class="user-item" v-if="selectedUsers.length != 0">
                  <span class="user-item-content" v-for="(item, index) in selectedUsers" :key="index">
                    <i class="item-icon el-icon-s-custom"></i>
                    {{ item.name }}
                  </span>
                </div>
                <el-button icon="el-icon-plus" plain size="small" @click="addUsers">添加</el-button>
              </el-form-item>
              <el-form-item label="筛选客户" :required="true">
                <!-- <el-radio-group>
                  <el-radio>筛选客户</el-radio>
                  <el-radio>全部客户</el-radio>
                </el-radio-group> -->
                <div class="switch-box">
                  <el-switch
                    v-model="form.isFiltered"
                    active-color="#294a7b"
                  >
                  </el-switch>
                </div>
                <div class="select-customer" v-if="form.isFiltered">
                  <div class="select-box">
                    <el-form label-width="80px">
                      <el-form-item label="性别">
                        <el-radio-group v-model="form.gender">
                          <el-radio :label="10">全部</el-radio>
                          <el-radio :label="1">男性</el-radio>
                          <el-radio :label="2">女性</el-radio>
                          <el-radio :label="0">未知性别</el-radio>
                        </el-radio-group>
                      </el-form-item>
                      <el-form-item label="添加时间">
                        <el-date-picker
                          v-model="dateTimeRange"
                          size="mini"
                          type="datetimerange"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                          format="yyyy-MM-dd"
                          value-format="yyyy-MM-dd"
                          clearable
                          @change="dateChange"
                        >
                      </el-date-picker>
                      </el-form-item>
                      <el-form-item label="行为标签">
                        <div class="none-tag" v-if="behaviorTagList.length == 0">
                          暂无创建的行为标签，<el-button type="text" @click="goToCreate">请先前往创建&nbsp;&gt;</el-button>
                        </div>
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
                      </el-form-item>
                    </el-form>
                  </div>
                </div>
                <div class="select-total"></div>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
      <div class="module">
        <div class="title">设置群信息</div>
        <div class="setting-content">
          <div class="group-setting">
            <el-form label-width="100px" label-position="left">
              <el-form-item label="入群引导语" :required="true">
                <div class="setting-input-box">
                  <el-input
                    placeholder="回复内容不能超过1300个字"
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
                    <p>1、群人数上限为200人，超过200人时请 【添加多个群聊】，否则可能会导致部分用户 【无法入群】，添加多个群聊时，客户只会收到一条群发邀请</p>
                    <p>2、上传群二维码时请【仔细核对】，群二维码和群聊【对应错误】将导致【数据异常】</p>
                    <p>3、如果客户添加了多个客服，只会收到一位客服的入群邀请</p>
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
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="module">
        <div class="title">其他设置</div>
        <div class="other-setting">
          <el-form label-width="100px" label-position="left">
            <el-form-item label="过滤客户">
              <div class="switch-box" style="display: flex; align-items: center">
                <el-switch
                  v-model="form.isExcludeExistingCustomer"
                  active-color="#294a7b"
                >
                </el-switch>
                <el-alert
                  title="开启后已在群聊中的客户将不会收到邀请"
                  type="warning"
                  show-icon
                  :closable="false"
                  style="line-height: 20px; width: 400px; margin-left: 10px"
                >
                </el-alert>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="f-btn-group">
        <el-button @click="goBack">取消</el-button>
        <el-button type="primary" @click="submitTagInvitateForm" :loading="isLoading">保存</el-button>
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
            <el-table-column label="选择" align="center">
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
        name: '', // 任务名称
        message: '', // 入群引导语
        isFiltered: true, // 是否需要筛选客户
        isExcludeExistingCustomer: true, // 是否过滤客户（开启后已在群聊中的客户将不会收到邀请）
        gender: 10, // 性别。 0-未知 1-男性 2-女性 10-全部
        customerStartDate: '', // 客户开始添加日期
        customerEndDate: '', // 客户结束添加日期
        behaviorTagList: [], // 行为标签
        groupChatList: [], // 群列表
        userList: [], // 成员列表
      },
      dateTimeRange: '', // 时间范围
      selectedTags: [], // 已选的行为标签
      behaviorTagList: [], // 行为标签列表
      behaviorTagBoxHeight: 0, // 行为标签容器高度
      tagShowMoreFlag: false, // 是否显示展开/收起按钮
      newTime: '', // 当前时刻
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
      departmentDialog: { // 选择成员弹窗
        config: {
          width: '800px',
          title: '选择关联人员',
          visible: false
        }
      },
      selectedUsers: [], // 已选择的成员
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
    dateChange() {
      if (this.dateTimeRange) {
        console.log('开始日期', this.dateTimeRange[0], this.dateTimeRange[1])
      }
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
      this.selectedRow = {}
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
        // let newList = [].concat(this.colonyDialog.tableData)
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
    goBack() {
      this.$router.go(-1)
    },
    // 提交标签建群表单
    submitTagInvitateForm() {
      if (this.form.name === '') {
        this.$message.warning('请输入任务名称')
        return
      }
      if (this.selectedUsers.length <= 0) {
        this.$message.warning('请添加关联成员')
        return
      } else {
        let users = []
        this.selectedUsers.forEach(item => {
          let obj = {
            userId: item.id
          }
          users.push(obj)
        })
        this.form.userList = users
      }
      // 开启筛选客户提交筛选条件，否则筛选条件全部设为空值
      if (this.form.isFiltered) {
        console.log('添加的时间', this.dateTimeRange)
        if (this.dateTimeRange) {
          this.form.customerStartDate = this.dateTimeRange[0]
          this.form.customerEndDate = this.dateTimeRange[1]
        }
        let tagList = []
        this.selectedTags.forEach(item => {
          let obj = {
            tagId: item.id,
            tagGroupId: item.groupId
          }
          tagList.push(obj)
        })
        this.form.behaviorTagList = tagList
      } else {
        this.form.gender = ''
        this.form.customerStartDate = ''
        this.form.customerEndDate = ''
        this.form.behaviorTagList = []
      }
      if (this.form.message === '') {
        this.$message.warning('请输入引导语')
        return
      }
      if (this.selectedColony.length <= 0) {
        this.$message.warning('请选择群聊')
      } else {
        // 校验添加的群聊是否上传了群二维码
        let isPass = false
        for (let i = 0; i < this.selectedColony.length; i++) {
          let item = this.selectedColony[i]
          if (item.qrCodeList.length <= 0) {
            this.$message.warning('请上传群聊二维码')
            isPass = false
            break
          } else {
            isPass = true
          }
        }
        if (!isPass) {
          return
        } else {
          let chatList = []
          this.selectedColony.forEach(item => {
            let obj = {
              groupChatId: item.colonyInfo.id,
              qrcode: item.qrCodeList[0].url
            }
            chatList.push(obj)
          })
          this.form.groupChatList = chatList
        }
      }
      console.log('提交的数据》》', this.form)
      this.isLoading = true
      this.$http.addGroupInvitation(this.form).then(() => {
        this.$message.success('新增成功')
        this.$router.go(-1)
      })
    },
    // 跳转到标签管理页
    goToCreate() {
      this.$router.push('/main/scrm/tag-library/enterprise/list')
    }
  }
}
</script>

<style lang="scss" scoped>
.tag-invitate-form {
  height: 100%;
}
.container {
  background-color: #ffffff;
  padding: 20px;
  box-sizing: border-box;
  margin-bottom: 20px;
  .c-tips {
    line-height: 30px;
    margin-bottom: 20px;
  }
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
        .select-customer {
          margin-top: 20px;
          .select-box {
            padding: 20px;
            background: #fbfbfb;
            border-radius: 2px;
            border: 1px solid #eee;
            font-size: 14px;
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