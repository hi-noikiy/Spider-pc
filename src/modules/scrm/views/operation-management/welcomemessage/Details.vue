<template>
  <div class="memberDetails">
    <div class="header_nav">
      <el-button type="text" icon="el-icon-arrow-left" @click="$router.go(-1)">{{
        pageId ? '修改欢迎语' : '创建欢迎语'
      }}</el-button>
    </div>
    <div class="main_content">
      <div class="main_box">
        <el-form label-width="90px" label-position="left" :model="model" ref="model">
          <el-form-item label="使用成员" :required="true">
            <input type="hidden" />
            <div class="tagname-form">
              <span class="tagName" v-for="(item, index) in allList" :key="index"
                ><i class="el-icon-user-solid icon-user"></i>{{ item.userName }}</span
              >
            </div>
            <el-button plain icon="el-icon-plus" size="mini" @click="addMember()">添加</el-button>
          </el-form-item>
          <el-form-item
            label="欢迎语"
            prop="message"
            :rules="{ required: true, message: '请输入欢迎语', trigger: 'blur' }"
          >
            <el-input
              id="textInput"
              class="record_input"
              type="textarea"
              width="600px"
              maxlength="100"
              show-word-limit
              size="small"
              placeholder="最多可输入100字"
              height="400px"
              :rows="6"
              resize="none"
              v-model="model.message"
            ></el-input>

            <div class="welcome-buttom">
              <div class="welcome-emjoi">
                <emotion @selectedEmotion="_selectedEmotion"></emotion>
              </div>
              <div class="welcome-div">
                <el-button type="text" size="mini">插入昵称</el-button>
                <el-button plain size="mini" @click="insert('<客户昵称>')">客户昵称</el-button>
                <el-button plain size="mini" @click="insert('<成员昵称>')">成员昵称</el-button>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="附加内容" :required="true">
            <el-radio-group v-model="changeTag">
              <el-radio label="text" @change="changeNone">无</el-radio>
              <el-radio label="image" @change="changeImage">图片</el-radio>
              <el-radio label="image_text" @change="changeWeb">网页</el-radio>
              <el-radio label="program" @change="changeApp">小程序</el-radio>
            </el-radio-group>
          </el-form-item>
          <div class="image-div" v-if="model.type === 'image'">
            <el-form-item>
              <QcImageUpload width="100px" height="100px" class="image-upload" v-model="imageUrl" prop="imageUrl">
              </QcImageUpload>
              <span class="picture_tips">(上传图片)</span>
            </el-form-item>
          </div>
          <div class="web-div" v-if="model.type === 'image_text'">
            <el-form-item :rules="[{ required: true, message: '请填写该字段' }]" label="链接标题" prop="name"
              ><el-input placeholder="最多可输入32个字" v-model="model.name"></el-input
            ></el-form-item>
            <el-form-item :rules="[{ required: true, message: '请填写该字段' }]" label="链接描述" prop="content"
              ><el-input placeholder="最多可输入32个字" v-model="model.content"></el-input
            ></el-form-item>
            <el-form-item :rules="[{ required: true, message: '请填写该字段' }]" label="链接地址" prop="link"
              ><el-input placeholder="请输入链接地址" v-model="model.link"></el-input
            ></el-form-item>
            <el-form-item>
              <QcImageUpload width="100px" height="100px" v-model="linkImageUrl"></QcImageUpload>
              <span class="picture_tips">(上传图片)</span>
            </el-form-item>
          </div>
          <div class="app-div" v-if="model.type === 'program'">
            <el-form-item label="配置小程序">
              <el-select placeholder="请选择" v-model="model.programId" @change="getProgramInfo()">
                <el-option
                  class="app-select"
                  v-for="(item, index) in options"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="" v-if="model.programId">
              <div class="programInfo">
                <el-card shadow="hover" :body-style="{ padding: '10px' }">
                  <div class="programInfoContent">
                    <div class="logo">
                      <el-avatar size="medium" :src="imgHost + programInfoOption.logo"></el-avatar>
                    </div>
                    <div class="name">{{ programInfoOption.name }}</div>
                  </div>
                </el-card>
              </div>
            </el-form-item>
          </div>
          <el-form-item label="是否启用" prop="isEnabled"  :required="true">
            <el-switch v-model="model.isEnabled"> </el-switch>
          </el-form-item>
          <el-form-item>
            <el-button size="medium" @click="$router.go(-1)">取消</el-button>
            <el-button type="primary" size="medium" @click="createSumbitAddBtn()" v-show="!pageId">保存</el-button>
            <el-button type="primary" size="medium" @click="createSumbitAddBtn()" v-show="pageId">保存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!-- 添加发送对象 -->
    <!-- <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      :show-close="false"
      width="800"
      top="10vh"
    >
      <div class="dialogVisibleTree">
        <div class="department-tree">
          <department-tree ref="department" :selectedList="memberList"> </department-tree>
        </div>
        <div class="footer_btn">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="setMembers">保存</el-button>
        </div>
      </div>
    </el-dialog> -->
    <MemberTreeDialog
      :config="dialogVisible"
      @closeDialog="dialogVisible.visible = false"
      :selectedList="memberList"
      ref="department"
      @handleConfirm="setMembers"
    >
    </MemberTreeDialog>
  </div>
</template>

<script>
import Emotion from '../../../components/common/Emotion'
// import DepartmentTree from '../../../components/common/DepartmentTree'
import MemberTreeDialog from '../../../components/components/MemberTreeDialog'
import Clipboard from 'clipboard'
export default {
  data() {
    return {
      // 页面id
      pageId: '',
      appId: '',
      // 数据
      model: {
        id: '',
        createTime: '',
        updateTime: '',
        appId: '',
        type: '',
        name: '',
        content: '',
        imageUrl: '',
        videoUrl: '',
        link: '',
        programId: '',
        file: '',
        fileId: '',
        message: '',
        userId: '',
        isEnabled: true,
        source: '',
        mediaId: '',
        mediaIdExpireTime: '',
        userType: 0
      },
      // 附加内容类型
      changeTag: 'text',
      // 小程序选择列表
      options: [],
      // 上传图片
      imageUrl: '',
      linkImageUrl: '',
      dialogVisible: {
        width: '800px',
        title: '选择目标成员',
        visible: false
      },
      // ---添加发送对象对话框数据 ---
      memberList: [],
      idList: [],
      allList: [],
      programInfoOption: {
        logo: '',
        name: ''
      }
      // ---添加发送对象对话框数据end ---
    }
  },
  methods: {
    //  ---数据渲染函数---
    // 获取页面id
    getPageId() {
      let id = this.$route.query.id
      if (!id) {
        return
      }
      this.pageId = id
      this.getUserWelcome(id)
    },
    // 切换附加内容
    //改变文本
    changeNone(val) {
      this.model.type = val
    },
    //改变图片
    changeImage(val) {
      this.model.type = val
    },
    //改变网址
    changeWeb(val) {
      this.model.type = val
    },
    //改变小程序
    changeApp(val) {
      this.model.type = val
    },
    // 插入表情包
    _selectedEmotion(val) {
      let message = document.getElementById('textInput')
      let insert = message.selectionStart
      this.model.message = message.value.substr(0, insert) + val + message.value.substr(insert)
    },
    // 插入昵称
    async insert(myValue) {
      let myField = document.getElementById('textInput')
      if (myField.selectionStart || myField.selectionStart === 0) {
        var startPos = myField.selectionStart
        var endPos = myField.selectionEnd
        this.model.message =
          myField.value.substring(0, startPos) + myValue + myField.value.substring(endPos, myField.value.length)
        await this.$nextTick()
        myField.focus()
        myField.setSelectionRange(endPos + myValue.length, endPos + myValue.length)
      } else {
        this.model.message += myValue
      }
    },
    // 添加成员
    addMember() {
      this.dialogVisible.visible = true
      // this.$nextTick(() => {
      //   this.$refs.department.setCheckedNodes()
      // })
    },
    // 新建保存
    createSumbitAddBtn() {
      this.$refs.model.validate((valid) => {
        if (valid) {
          // 必须选择目标成员
          if (!this.idList.length) {
            this.$message({
              message: '请选择发送目标人员',
              type: 'warning'
            })
            return
          }
          let options = {
            isEnabled: this.model.isEnabled,
            message: this.model.message,
            type: this.changeTag,
            userType: this.model.userType,
            welcomeUserList: this.idList
          }

          // 提交文本
          // 提交图片
          if (this.changeTag == 'image') {
            if (!this.imageUrl) {
              this.$message({
                message: '请上传图片',
                type: 'warning'
              })
              return
            }
            options.imageUrl = this.imageUrl
          }
          // 提交图文网页
          if (this.changeTag == 'image_text') {
            if (!this.linkImageUrl) {
              this.$message({
                message: '请上传图片',
                type: 'warning'
              })
              return
            }
            options.imageUrl = this.linkImageUrl
            options.name = this.model.name
            options.content = this.model.content
            options.link = this.model.link
          }
          // 提交小程序
          if (this.changeTag == 'program') {
            this.options.forEach((item) => {
              if (item.id == this.model.programId) {
                options.programId = item.id
                options.link = item.page
                options.name = item.name
                options.imageUrl = item.logo
              }
            })
          }
          // 存在id时进行修改操作
          if (this.pageId) {
            options.id = this.pageId
            options.appId = this.appId
            options.createTime = this.model.createTime
            options.isDeleted = this.model.isDeleted
            options.mediaIdExpireTime = this.model.mediaIdExpireTime
            this.updateUserWelcome(options, (res) => {
              this.$router.push('/main/scrm/operation-management/welcomemessage/list')
            })
          } else {
            this.addWelcome(options, (res) => {
              this.$router.go(-1)
            })
          }
        } else {
          return false
        }
      })
    },
    // ---添加发送对象对话框方法 ---
    setMembers(list) {
      console.log('6666666666666666666666666', list)
      this.memberList = list
      if (!this.memberList.length) {
        this.$message({
          message: '请选择发送成员后再提交',
          type: 'warning'
        })
        return
      }
      console.log(this.memberList)
      let idList = []
      let allList = []
      this.memberList.forEach((item) => {
        idList.push({ userId: item.id, type: item.type })
        allList.push({ userId: item.id, type: item.type, userName: item.name })
      })
      this.idList = idList
      this.allList = allList
      this.dialogVisible.visible = false
    },
    // 获取小程序信息
    getProgramInfo() {
      console.log(this.model.programId)
      this.options.forEach((item) => {
        if (item.id == this.model.programId) {
          this.programInfoOption = item
        }
      })
    },
    // ---添加发送对象对话框方法end ---
    // ---获取数据函数---
    // 新建欢迎语
    addWelcome(options, callback) {
      this.$http.addWelcome(options).then((res) => {
        if (callback) {
          callback(res)
        }
      })
    },
    // 修改欢迎语
    updateUserWelcome(options, callback) {
      this.$http.updateUserWelcome(options).then((res) => {
        if (callback) {
          callback(res)
        }
      })
    },
    // 获取小程序列表
    getProgarm() {
      this.$http.getProgarm().then((res) => {
        this.options = res.data.data
        console.log('这是小程序', res.data.data)
      })
    },
    // 获取欢迎语详情
    getUserWelcome(id) {
      this.$http.getUserWelcome({ id }).then((res) => {
        console.log('无敌', res)
        this.model = res.data.data
        this.changeTag = res.data.data.type
        this.appId = res.data.data.appId
        if (this.changeTag == 'image') {
          this.imageUrl = res.data.data.imageUrl
        }
        if (this.changeTag == 'image_text') {
          this.linkImageUrl = res.data.data.imageUrl
        }
        res.data.data.welcomeUserList.forEach((item) => {
          this.idList.push({ userId: item.userId, type: 0 })
          this.allList.push({ userId: item.userId, type: 0, userName: item.userName || item.deptName })
          this.memberList.push({ id: item.userId, name: item.userName || item.deptName })
        })
      })
    }
  },
  components: {
    Emotion,
    MemberTreeDialog
  },
  created() {
    //  获取页面id
    this.getPageId()
    // 获取小程序
    this.getProgarm()
    // 获取企业成员树
    // this.getMembers()
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog {
  border-radius: 6px;
}
::v-deep .el-dialog__header {
  padding: 10px 20px;
  border-bottom: 1px solid #ebeef5;
  font-size: 16px;
}
::v-deep .el-dialog__title {
  font-size: 14px;
}
::v-deep .el-dialog__headerbtn {
  top: 15px;
}
::v-deep .el-dialog__body {
  padding: 20px;
}

.memberDetails {
  width: 100%;
  height: 100%;
}
.main_content {
  margin-top: 20px;
  background-color: #ffffff;
  padding: 20px;
  min-height: calc(100% - 56px);
  box-sizing: border-box;
  .main_box {
    width: 800px;
    .welcome-buttom {
      display: flex;
      .welcome-emjoi {
        display: flex;
        align-items: center;
        margin-right: auto;
      }
    }
    .tagname-form {
      .tagName {
        display: inline-block;
        border: 1px solid #546e95;
        padding: 0 5px;
        margin: 8px 8px 7px 0;
        border-radius: 3px;
        height: 28px;
        line-height: 28px;
        color: #546e95;
        i {
          color: #546e95;
        }
      }
    }
    .picture_tips {
      font-size: 14px;
      color: #606266;
    }
  }
}
.dialogVisibleTree {
  .footer_btn {
    display: flex;
    justify-content: flex-end;
  }
}
.programInfo {
  width: 217px;
  .programInfoContent {
    height: 36px;
    display: flex;
    .name {
      margin-left: 5px;
      line-height: 36px;
      color: #606266;
      font-size: 14px;
    }
  }
}
</style>