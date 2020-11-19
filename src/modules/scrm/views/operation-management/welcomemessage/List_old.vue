<template>
  <div class="welcome-message" v-if="reFresh">
    <div class="welcome-title">
      <p class="welcome-title-p">
        [注意]:除了使用本系统的活码进行添加好友之外，都会触发此处的欢迎语，如手机号添加、群内添加好友，分享二维码添加，分享名片添加等。<br />
        由于企业微信的限制，如果已在【企业微信管理后台】配置了欢迎语，这里的欢迎语将并不会生效
      </p>
    </div>
    <div class="table">
      <el-table
        :data="tableData"
        id="tablebox"
        style="width: 100%"
        v-loading="isLoading"
        :height="height"
        :header-cell-style="{ 'text-align': 'center', 'background-color': '#ebeef5', color: '#333333' }"
      >
        <el-table-column prop="content" label="消息内容" align="center" width="600px">
          <template slot-scope="scope">
            <div class="rowContent">
              <i class="el-icon-service"></i>：{{ scope.row.content.message }} <br />
              <i class="el-icon-paperclip"></i>：{{ scope.row.content.type | rowContentFilters }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="使用成员" align="center"></el-table-column>
        <el-table-column prop="updateTime" label="修改时间" align="center"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click=";(welcomeMessageDialogVisible = true), getCheckedNodes(scope.row.id)"
              >修改</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
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
    <!-- <div class="container">
      <div class="welcome-tree">
        <div class="menu-left">
          <div class="left-tree">
            <el-tree
              :data="treeMenu"
              default-expand-all
              node-key="id"
              ref="tree"
              highlight-current
              :props="defaultProps"
              @node-click="getCheckedNodes"
            >
            </el-tree>
          </div>
        </div>
      </div>
      <div class="welcome-content">
        <el-form label-width="100px" label-position="right" :model="model" ref="model">
          <el-form-item label="欢迎语" prop="message">
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
                <span class="welcome-firstname">插入昵称</span>
                <span class="welcome-customername" @click="insert('<客户昵称>')">客户昵称</span>
                <span class="welcome-salename" @click="insert('<成员昵称>')">成员昵称</span>
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
            <QcImageUpload width="100px" height="100px" class="image-upload" v-model="imageUrl" prop="imageUrl">
            </QcImageUpload>
            <span>上传图片</span>
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
            <el-form-item :rules="[{ required: true, message: '请填写该字段' }]" label="封面图" prop="imageUrl">
              <QcImageUpload width="100px" height="100px" v-model="linkImageUrl"> </QcImageUpload>
              <span>上传图片</span>
            </el-form-item>
          </div>
          <div class="app-div" v-if="model.type === 'program'">
            <el-form-item label="配置小程序">
              <el-select placeholder="请选择" v-model="model.programId" @change="changeSelect()">
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
          </div>
          <el-form-item label="是否启用" prop="isEnabled">
            <el-switch v-model="model.isEnabled"> </el-switch>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="medium" @click="sumbitAddBtn()">保存</el-button>
            <el-button size="medium" @click="cancelBtn()">取消</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="text" class="delete-btn" @click="deteleWelcome">删除此用户欢迎语</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div> -->
    <el-dialog
      title="修改"
      :visible.sync="welcomeMessageDialogVisible"
      width="50%"
      :modal-append-to-body="false"
      top="7vh"
    >
      <div class="welcomeMessageDialogVisible">
        <el-form label-width="100px" label-position="right" :model="model" ref="model">
          <el-form-item label="欢迎语" prop="message">
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
                <span class="welcome-firstname">插入昵称</span>
                <span class="welcome-customername" @click="insert('<客户昵称>')">客户昵称</span>
                <span class="welcome-salename" @click="insert('<成员昵称>')">成员昵称</span>
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
            <QcImageUpload width="100px" height="100px" class="image-upload" v-model="imageUrl" prop="imageUrl">
            </QcImageUpload>
            <br />
            <span>上传图片</span>
            <br />
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
            <el-form-item :rules="[{ required: true, message: '请填写该字段' }]" label="封面图" prop="imageUrl">
              <QcImageUpload width="100px" height="100px" v-model="linkImageUrl"> </QcImageUpload>
              <span>上传图片</span>
            </el-form-item>
          </div>
          <div class="app-div" v-if="model.type === 'program'">
            <el-form-item label="配置小程序">
              <el-select placeholder="请选择" v-model="model.programId" @change="changeSelect()">
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
          </div>
          <el-form-item label="是否启用" prop="isEnabled">
            <el-switch v-model="model.isEnabled"> </el-switch>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="medium" @click="sumbitAddBtn()">保存</el-button>
            <el-button size="medium" @click="cancelBtn()">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from '../../../api/operation-management'
import Emotion from '../../../components/common/Emotion'
// import { template } from '@/modules/flywheel/utils/template'

export default {
  components: { Emotion },
  inject: ['reload'],
  data() {
    return {
      treeMenu: [],
      checkDefault: [],
      reFresh: true,
      changeTag: 'text',
      val: '',
      programId: '',
      options: [],
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
      pageData: {
        pageNum: 1,
        pageSize: 15,
        total: 0
      },
      defaultProps: {
        children: 'childs',
        label: 'name'
      },
      childs: [],
      tree: [],
      // childs: [],
      firstShow: true,
      secondShow: [],
      thirdShow: [],
      imageUrl: '',
      linkImageUrl: '',
      chooseAll: [],
      tableData: [],
      messageFlg: 0,
      isLoading: false,
      welcomeMessageDialogVisible: false,
      height: 400
    }
  },
  methods: {
    //提交按钮
    sumbitAddBtn() {
      if (this.model.userId == '') {
        this.$message.warning('请选择人员')
      } else if (this.model.message == '') {
        this.$message.warning('请输入欢迎语')
      } else if (this.model.message.length > 100) {
        this.$message.warning('欢迎语不能超过100个字')
      } else if (this.model.id == '') {
        // if (this.chooseAll.length != 0) {
        //   let newUserId = this.chooseAll.join('_')
        //   this.model.userId = newUserId
        if (this.model.type == 'image') {
          this.model.imageUrl = this.imageUrl
          this.model.type = this.changeTag
          this.model.link = ''
          this.model.programId = ''
          this.model.file = ''
          this.model.content = ''
          this.model.name = ''
          if (this.model.imageUrl == '') {
            this.$message.warning('请上传图片')
          } else {
            api.addWelcome(this.model).then(() => {
              this.$message.success('添加成功')
              this.getWelcomeUser()
              this.welcomeMessageDialogVisible = false
              this.getDepartmentTreeMember({})
            })
          }
        } else if (this.model.type == 'image_text') {
          this.model.imageUrl = this.linkImageUrl
          this.model.type = this.changeTag
          this.model.file = ''
          this.model.programId = ''
          if (this.model.name == '') {
            this.$message.warning('请输入链接标题')
          } else if (this.model.content == '') {
            this.$message.warning('请输入链接描述')
          } else if (this.model.link == '') {
            this.$message.warning('请输入链接地址')
          } else if (this.model.imageUrl == '') {
            this.$message.warning('请上传图片')
          } else {
            api.addWelcome(this.model).then(() => {
              this.$message.success('添加成功')
              this.getWelcomeUser()
              this.welcomeMessageDialogVisible = false
              this.getDepartmentTreeMember({})
            })
          }
        } else if (this.model.type == 'program') {
          this.model.type = this.changeTag
          this.model.file = ''
          this.model.link = ''
          this.model.content = ''
          this.model.name = ''
          this.model.imageUrl = ''
          this.model.videoUrl = ''
          if (this.model.programId == '') {
            this.$message.warning('请选择小程序')
          } else {
            api.addWelcome(this.model).then(() => {
              this.$message.success('添加成功')
              this.getWelcomeUser()
              this.welcomeMessageDialogVisible = false
              this.getDepartmentTreeMember({})
            })
          }
        } else {
          this.model.type = this.changeTag
          this.model.link = ''
          this.model.programId = ''
          this.model.file = ''
          this.model.content = ''
          this.model.name = ''
          this.model.videoUrl = ''
          api.addWelcome(this.model).then(() => {
            this.$message.success('添加成功')
            this.getWelcomeUser()
            this.welcomeMessageDialogVisible = false
            this.getDepartmentTreeMember({})
          })
        }
      } else if (this.model.id != '') {
        if (this.model.type == 'image') {
          this.model.imageUrl = this.imageUrl
          this.model.videoUrl = ''
          this.model.link = ''
          this.model.content = ''
          this.model.name = ''
          this.model.programId = ''
          this.model.file = ''
          this.linkImageUrl = ''
          api.updateUserWelcome(this.model).then(() => {
            this.$message.success('更新成功')
            this.getWelcomeUser()
            this.welcomeMessageDialogVisible = false
            this.getDepartmentTreeMember({})
          })
        } else if (this.model.type == 'text') {
          this.model.imageUrl = ''
          this.model.link = ''
          this.model.content = ''
          this.model.name = ''
          this.model.programId = ''
          this.model.file = ''
          this.model.videoUrl = ''
          this.imageUrl = ''
          this.linkImageUrl = ''
          api.updateUserWelcome(this.model).then(() => {
            this.$message.success('更新成功')
            this.getWelcomeUser()
            this.welcomeMessageDialogVisible = false
            this.getDepartmentTreeMember({})
          })
        } else if (this.model.type == 'image_text') {
          this.model.imageUrl = this.linkImageUrl
          this.model.videoUrl = ''
          this.model.file = ''
          this.model.programId = ''
          this.imageUrl = ''
          if (this.model.name == '') {
            this.$message.warning('请输入链接标题')
          } else if (this.model.content == '') {
            this.$message.warning('请输入链接描述')
          } else if (this.model.link == '') {
            this.$message.warning('请输入链接地址')
          } else if (this.model.imageUrl == '') {
            this.$message.warning('请上传图片')
          } else if (this.model.message.length > 100) {
            this.$message.warning('欢迎语不能超过100个字')
          } else {
            api.updateUserWelcome(this.model).then(() => {
              this.$message.success('更新成功')
              this.getWelcomeUser()
              this.welcomeMessageDialogVisible = false
              this.getDepartmentTreeMember({})
            })
          }
        } else if (this.model.type == 'program') {
          this.imageUrl = ''
          this.linkImageUrl = ''
          this.model.imageUrl = ''
          this.model.link = ''
          this.model.content = ''
          this.model.name = ''
          this.model.file = ''
          this.model.videoUrl = ''
          if (this.model.programId == '') {
            this.$message.warning('请选择小程序')
          } else {
            api.updateUserWelcome(this.model).then(() => {
              this.$message.success('更新成功')
              this.getWelcomeUser()
              this.welcomeMessageDialogVisible = false
              this.getDepartmentTreeMember({})
            })
          }
        } else {
          this.model.imageUrl = ''
          this.model.link = ''
          this.model.content = ''
          this.model.name = ''
          this.model.file = ''
          this.model.videoUrl = ''
          this.model.programId = ''
          api.updateUserWelcome(this.model).then(() => {
            this.$message.success('更新成功')
            this.getWelcomeUser()
            this.welcomeMessageDialogVisible = false
            this.getDepartmentTreeMember({})
          })
        }
      }
    },
    _selectedEmotion(val) {
      let message = document.getElementById('textInput')
      let insert = message.selectionStart
      this.model.message = message.value.substr(0, insert) + val + message.value.substr(insert)
    },
    //取消按钮
    cancelBtn() {
      this.welcomeMessageDialogVisible = false
      this.getWelcomeUser()
    },
    //改变无
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
    getDepartmentTreeMember(options) {
      this.isLoading = true
      options.pageSize = this.pageData.pageSize
      options.pageNum = this.pageData.pageNum
      this.$http.getDepartmentTreeMember(options).then((res) => {
        // console.log('全部成员数据', res)
        console.log('全部成员数据', res.data.data.list)
        this.pageData.total = res.data.data.total
        this.getMessage(res.data.data.list)
      })
    },
    getTree() {
      this.isLoading = true
      this.messageFlg = 0
      this.tableData = []
      api.getTree().then((res) => {
        let tree = res.data.data
        console.log('这是树', res.data.data)
        let treeArray = []
        treeArray[0] = {
          id: tree[0].id,
          name: tree[0].name
        }
        tree[0].userList.forEach((item) => {
          let arr = {
            id: item.id,
            name: item.name
          }
          treeArray.push(arr)
        })
        this.getMessage(treeArray)
        // treeArray.forEach((item) => {
        //   let listItem = {
        //     name: item.name,
        //     info: this.getNewWelcomeUser(item.id)
        //   }
        //   console.log(listItem)
        // })
        // 使用自执行函数解决异步问题

        this.treeMenu = JSON.parse(JSON.stringify(tree).replace(/"userList"/g, '"childs"'))
        this.getList()
        // this.checkDefault.push(this.treeMenu)
        // this.treeMenu.forEach((item, index) => {
        //   if (item.childs != undefined) {
        //     this.checkDefault.push(item.childs[index].childs[index].id)
        //     // console.log(item.childs[index].childs[index])
        //   }

        // })
      })
    },
    getMessage(treeArray) {
      console.log('传入的数据', treeArray)
      if (this.messageFlg >= treeArray.length || treeArray.length == 0) {
        this.isLoading = false
        return
      } else {
        this.getNewWelcomeUser(treeArray[this.messageFlg].id, (res) => {
          console.log('纳尼', res)
          let listItem = {}
          if (!res.data.data) {
            listItem = {
              id: treeArray[this.messageFlg].id,
              name: treeArray[this.messageFlg].name,
              content: {
                message: '',
                type: ''
              },
              createTime: '',
              updateTime: ''
            }
          } else {
            listItem = {
              id: treeArray[this.messageFlg].id,
              name: treeArray[this.messageFlg].name,
              content: {
                message: res.data.data.message || '',
                type: res.data.data.type || ''
              },
              createTime: res.data.data.createTime || '',
              updateTime: res.data.data.updateTime || ''
            }
          }
          this.tableData.push(listItem)
          console.log('tableData', this.tableData)
          this.messageFlg++
          this.getMessage(treeArray)
        })
      }
    },
    getList() {
      let newList = this.ListData(this.treeMenu, 'childs')
      let selectedMember = {}
      for (let i = 0; i < newList.length; i++) {
        if (newList[i].userId) {
          selectedMember = newList[i]
          break
        }
      }
      this.$nextTick(() => {
        // this.$refs.tree.setCurrentKey(selectedMember.id)
        this.model.userId = selectedMember.id
        this.getWelcomeUser()
        // api.getUserWelcome({userId :this.model.userId}).then(()=>{
        // })
      })
    },
    getTableHeight() {
      const TOP_WORDS_HEIGHT = 40,
        TABLE_BOTTOM_HEIGHT = 90
      this.height =
        window.innerHeight - document.querySelector('#tablebox').offsetTop - TOP_WORDS_HEIGHT - TABLE_BOTTOM_HEIGHT - 52
    },
    ListData(data) {
      return data.reduce(
        (arr, { id, name, userId, childs = [] }) => arr.concat([{ id, name, userId }], this.ListData(childs)),
        []
      )
    },
    handleChange(val) {
      this.secondShow = val
      this.secondShow = !this.secondShow
    },
    handleThirdChange(val) {
      this.thirdShow = val
      this.thirdShow = !this.thirdShow
    },
    openFirstShow(val) {
      this.firstShow = !this.firstShow
    },
    openFristName(val) {
      this.model.userId = val.id
    },
    openSecondItem(val) {
      this.model.userId = val.id
    },
    openFourthItem(val) {
      this.model.userId = val.id
    },
    addUserName() {
      // // this.model.message += this.text
      // let areaField = document.getElementById('textInput')
      // this.model.message += this.text
      // console.log(areaField.focus())
    },
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
    addSaleName() {
      this.model.message += this.saleText
    },
    getCheckedNodes(id) {
      this.model = {
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
      }
      // if (val.isTree != undefined) {
      //   this.model.userType = 1
      // }
      this.imageUrl = ''
      this.linkImageUrl = ''
      this.model.userId = id
      this.getWelcomeUser()
    },
    getProgarm() {
      api.getProgarm().then((res) => {
        this.options = res.data.data
      })
    },
    getNewWelcomeUser(userId, callback) {
      api.getUserWelcome({ userId }).then((res) => {
        if (callback) {
          callback(res)
        }
      })
    },
    // 分页
    onSizeChange(val) {
      this.tableData = []
      this.messageFlg = 0
      this.pageData.pageSize = val
      this.getDepartmentTreeMember({})
    },
    onPageChange(val) {
      this.tableData = []
      this.messageFlg = 0
      this.pageData.pageNum = val
      this.getDepartmentTreeMember({})
    },
    getWelcomeUser() {
      api.getUserWelcome({ userId: this.model.userId }).then((res) => {
        let models = res.data.data
        if (models != undefined) {
          this.model = res.data.data
          this.changeTag = this.model.type
          if (models.type == 'image') {
            this.model = res.data.data
            this.imageUrl = this.model.imageUrl
          } else if (models.type == 'text' || models.type == 'image_text' || models.type == 'program') {
            this.model = res.data.data
            this.linkImageUrl = this.model.imageUrl
            this.changeTag = this.model.type
          }
        } else {
          this.changeTag = 'text'
        }
        //  else if (models.type == 'image') {
        //   console.log(1)
        //   this.model = res.data.data
        //   this.imageUrl = res.data.data.imageUrl
        // }
      })
    },
    //获取小程序id
    changeSelect(val) {
      this.options.forEach((item) => {
        if (item.id === val) {
          this.model.programId = item.id
        }
      })
    }
    //删除欢迎语
    // deteleWelcome() {
    //   // let messageId = this.model.id
    //   this.$confirm('是否删除改此成员欢迎语', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     api.deleteUserWelcome({ id: this.model.id }).then(() => {
    //       this.$message.success('删除此成员欢迎语成功')
    //       this.reload()
    //       // this.reFresh = false
    //       // this.$nextTick(() => {
    //       //   this.reFresh = true
    //       // })
    //       this.model = {
    //         id: '',
    //         createTime: '',
    //         updateTime: '',
    //         appId: '',
    //         type: '',
    //         name: '',
    //         content: '',
    //         imageUrl: '',
    //         videoUrl: '',
    //         link: '',
    //         programId: '',
    //         file: '',
    //         fileId: '',
    //         message: '',
    //         // userId: '',
    //         isEnabled: true,
    //         source: '',
    //         mediaId: '',
    //         mediaIdExpireTime: ''
    //       }
    //       this.imageUrl = ''
    //       this.linkImageUrl = ''
    //       this.changeTag = 'text'
    //       this.getWelcomeUser()
    //       // this.model.id = messageId
    //       console.log(this.model)
    //     })
    //   })
    // }
    // getNodes() {
    //   let list = this.$refs.tree.getCheckedNodes()
    //   let arr = []
    //   list.forEach(item => {
    //     if (item.userId) {
    //       arr.push(item.id)
    //     }
    //   })
    //   this.chooseAll = arr
    // }
    //树节点自定义内容
  },
  created() {
    // this.getDepartmentTreeMember({})
    this.getProgarm()
    this.getDepartmentTreeMember({})
  },
  // watch: {
  //   selectedMember: function(newVal, oldVal) {
  //     if (newVal) {
  //       this.$nextTick(() => {
  //         this.$refs.tree.setCurrentKey(this.selectedMember)
  //       })
  //     }
  //   }
  // }
  mounted() {
    this.$nextTick(() => {
      this.getTableHeight()
    })
  },
  filters: {
    rowContentFilters(option) {
      if (option == 'text') {
        return '无'
      }
      if (option == 'image') {
        return '图片'
      }
      if (option == 'image_text') {
        return '网页'
      }
      if (option == 'program') {
        return '小程序'
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.welcome-message {
  // width: 100%;
  // height: 100%;
  position: relative;
  .welcome-title {
    font-size: 14px;
    color: #aaaaaa;
    // padding: 10px 0;
    p {
      margin: 5px 0;
    }
  }
  .table {
    padding: 20px;
    background-color: #fff;
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
  .container {
    padding-top: 70px;
    width: 100%;
    height: 650px;
    background-color: #ffffff;
    display: flex;
    padding-bottom: 100px;
    .welcome-tree {
      // border: 1px solid rgba($color: #000000, $alpha: 0.3);
      padding: 0px 20px;
      width: 20%;
      height: 650px;
      overflow-y: auto;
    }
    .welcomeMessageDialogVisible {
      width: 70%;
      height: 100%;
      // border: 1px solid green;
      .record_input {
        width: 500px;
      }
      .welcome-buttom {
        width: 500px;
        height: 40px;
        // border: 1px solid red;
        display: flex;
        justify-content: space-between;

        .welcome-div {
          margin-top: 10px;
          -moz-user-select: none;
          -webkit-user-select: none;
          -ms-user-select: none;
          user-select: none;
          .welcome-customername {
            padding: 5px;
            border: 1px solid #294a7b;
            color: #294a7b;
            margin-left: 5px;
            cursor: pointer;
            border-radius: 5px;
          }
          .welcome-salename {
            padding: 5px;
            border: 1px solid #294a7b;
            color: #294a7b;
            margin-left: 5px;
            cursor: pointer;
            border-radius: 5px;
          }
        }
      }
    }
  }
}
.welcome-emjoi {
  margin-top: 10px;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.image-div {
  .image-upload {
    margin-left: 100px;
  }
  span {
    margin-left: 120px;
    font-size: 14px;
    color: darkgrey;
  }
}
.web-div {
  width: 600px;
  span {
    margin-left: 20px;
    font-size: 14px;
    color: darkgrey;
  }
}
.testDiv {
  top: 100%;
  height: 100%;
  background: #fff;
}
.first-item-item {
  padding-left: 30px;
}
.second-item {
  padding-left: 20px;
}
.second-item-item {
  padding-left: 30px;
}
.delete-btn {
  color: #e54f62;
}
::v-deep.el-tree-node__content {
  &:hover {
    background-color: rgba($color: #294a7b, $alpha: 0.5);
  }
}
::v-deep.el-tree-node__label {
  width: auto;
  font-family: “Trebuchet MS”, Arial, Helvetica, sans-serif;
  font-size: 14px;
  letter-spacing: 1px;
}
::v-deep.el-tree-node:focus > .el-tree-node__content {
  background-color: rgba($color: #294a7b, $alpha: 1); //背景色
  color: #fff;
}
::v-deep.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
  position: relative;
  background-color: rgba($color: #294a7b, $alpha: 1);
  color: #fff;
  &:before {
    content: '\00a0';
    display: inline-block;
    border: 3px solid #3399ff;
    border-top-width: 0;
    border-right-width: 0;
    width: 9px;
    height: 5px;
    transform: rotate(-50deg);
    position: absolute;
    top: 30%;
    left: 70%;
  }
}
.welcome-title-p {
  letter-spacing: 1.5px;
  line-height: 20px;
}
// ::v-deep .el-checkbox__inner {
//   border: none;
//   background-color: #fff;
// }
// ::v-deep .el-checkbox {
//   border: none;
// }
// ::v-deep .unselected .el-checkbox__input .el-checkbox__inner::after {
//   // ::after {
//   // 对号

//   border: none;
//   // 不覆盖下面的 会 导致对号变形
//   box-sizing: content-box;
//   content: '';
//   border-left: 0;
//   border-top: 0;
//   height: 7px;
//   left: 3px;
//   position: absolute;
//   // top: 1px;
//   // width: 3px;
//   // }
//   background-color: #fff;
// }
// ::v-deep .el-checkbox__input .el-checkbox__inner::after {
//   // 对号
//   border: none;
//   // 不覆盖下面的 会 导致对号变形
//   background: none;
//   content: '';
//   border-left: 0;
//   border-top: 0;
//   height: 7px;
//   left: 3px;
//   position: absolute;
//   top: 1px;
//   width: 3px;
//   //
//   // transform: rotate(45deg) scaleY(1);
// }

// ::v-deep.el-checkbox__input.is-checked .el-checkbox__inner,
// .el-checkbox__input.is-indeterminate .el-checkbox__inner {
//   border: none;
//   background: none;
//   color: none;
// }
// ::v-deep.el-checkbox__input.is-checked + .el-checkbox__label {
//   border: none;
//   background: none;
//   color: none;
// }
// ::v-deep.el-checkbox.is-bordered.is-checked {
//   border: none;
//   background: none;
//   color: none;
// }
// ::v-deep.el-checkbox__input.is-focus .el-checkbox__inner {
//   border: none;
//   background: none;
//   color: none;
// }
// .icon-margin {
//   margin: 0 5px;
// }
// .checkbox-title {
//   margin: 5px 0;
//   color: rgb(136, 133, 133);
//   font-size: 20px !important;
// }
// .el-icon-user-solid {
//   color: #294a7b;
// }
// ::v-deep.is-current>.el-tree-node__content{        background: #F4F6F8;        position: relative;    }    ::v-deep.is-current>.el-tree-node__content::before{        content: "";        position: absolute;        width: 3px;        height: 100%;        background: #1989FA;        top: 0;        left: 0;;    }
.rowContent {
  text-align: left;
  line-height: 30px;
}
.welcomeMessageDialogVisible {
  width: 70%;
  height: 100%;
  // border: 1px solid green;
  .record_input {
    width: 500px;
  }
  .welcome-buttom {
    width: 500px;
    height: 40px;
    // border: 1px solid red;
    display: flex;
    justify-content: space-between;

    .welcome-div {
      margin-top: 10px;
      -moz-user-select: none;
      -webkit-user-select: none;
      -ms-user-select: none;
      user-select: none;
      .welcome-customername {
        padding: 5px;
        border: 1px solid #294a7b;
        color: #294a7b;
        margin-left: 5px;
        cursor: pointer;
        border-radius: 5px;
      }
      .welcome-salename {
        padding: 5px;
        border: 1px solid #294a7b;
        color: #294a7b;
        margin-left: 5px;
        cursor: pointer;
        border-radius: 5px;
      }
    }
  }
}
</style>
