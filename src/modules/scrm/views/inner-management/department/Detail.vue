<template>
  <div class="department-div">
    <GoBack :title="'返回'"></GoBack>
    <div class="department-div-top">
      <div class="department-thmub-text">
        <div class="thmub">
          <img :src="customerData.avatar" />
        </div>
        <div class="text">
          <div>{{ customerData.name }}</div>
        </div>

        <!-- <div class="icon">
          <i class="el-icon-user-solid icon-user"></i>
        </div> -->
      </div>
      <div class="title-bar">基础信息</div>
      <div class="department-div-container">
        <ul>
          <li>
            <span class="name">手机号：</span>
            <span class="value">{{ customerData.mobile || '--' }}</span>
          </li>
          <li>
            <span class="name">职务：</span>
            <span class="value">{{ customerData.position || '--' }}</span>
          </li>
          <li>
            <span class="name">邮箱：</span>
            <span class="value">{{ customerData.email || '--' }}</span>
          </li>
          <li>
            <span class="name">性别：</span>
            <span class="value">{{ customerData.gender | isGender }}</span>
          </li>
        </ul>
      </div>
      <!-- <div class="title-bar">其他信息</div>
      <div class="department-div-container">
        <ul>
          <li>
            <span class="name">备注名：</span>
            <span class="value">15813228684</span>
          </li>
        </ul>
      </div> -->
      <div class="title-bar">对外信息</div>
      <div class="department-exter-container">
        <ul v-if="customerData.userExternalAttrList != []">
          <li v-for="(item, index) in customerData.userExternalAttrList" :key="index">
            <span class="name">{{ item.name }}：</span>
            <span class="value">
              <span style="color:black" v-if="item.type == 0">{{ item.textValue }}</span>
              <span style="color:black" v-if="item.type == 1">{{ item.webTitle }}</span>
              <span style="color:black" v-if="item.type == 2">{{ item.programTitle }}</span>
              <el-tag type="info" size="small" style="margin-left:5px">{{ item.type | isType }}</el-tag></span
            >
            <el-button type="text" @click="editDetail(item)">修改</el-button>
          </li>
        </ul>
        <ul v-else>
          <li>暂无数据</li>
        </ul>
      </div>
    </div>
    <com-dialog :config="customerDialog.config" @closeDialog="closeCustomerDialog">
      <div class="customer-container">
        <el-form v-if="model.type == 0" label-position="right" label-width="100px">
          <!-- <el-form-item label="类型名称：" :required="true">
            <el-input v-model="model.name" placeholder="请输入类型名称" maxlength="32" show-word-limit></el-input>
          </el-form-item> -->
          <el-form-item label="文本内容：" :required="true">
            <el-input v-model="model.textValue" placeholder="请输入文本内容" maxlength="32" show-word-limit></el-input>
          </el-form-item>
        </el-form>
        <el-form v-if="model.type == 1" label-position="right" label-width="100px">
          <!-- <el-form-item label="类型名称：" :required="true">
            <el-input v-model="model.name" placeholder="请输入类型名称" maxlength="32" show-word-limit></el-input>
          </el-form-item> -->
          <el-form-item label="网页标题：" :required="true">
            <el-input v-model="model.webTitle" placeholder="请输入网页标题" maxlength="32" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="网页链接：" :required="true">
            <el-input
              type="textarea"
              v-model="model.webUrl"
              placeholder="请输入网页链接"
              maxlength="128"
              show-word-limit
              size="small"
              :rows="3"
              resize="none"
              class="textarea-input"
              style="width: 100%"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-form v-if="model.type == 2" label-position="right" label-width="100px">
          <!-- <el-form-item label="类型名称：" :required="true">
            <el-input v-model="model.name" placeholder="请输入类型名称" maxlength="32" show-word-limit></el-input>
          </el-form-item> -->
          <SelectProgramItem
            ref="SelectProgramItem"
            :programIdProps="model.id"
            class="selectProgram"
          ></SelectProgramItem>
          <!-- <SelectProgramAppId
            ref="SelectProgramItem"
            :programIdProps="model.id"
            class="selectProgram"
          ></SelectProgramAppId> -->
        </el-form>
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
import GoBack from '../../../components/components/GoBack'
import ComDialog from '../../../components/common/ComDialog'
import SelectProgramItem from '../../../components/components/SelectProgramItem'
import SelectProgramAppId from '../../../components/components/SelectProgramAppId'
export default {
  components: {
    GoBack,
    ComDialog,
    SelectProgramItem,
    SelectProgramAppId
  },
  data() {
    return {
      queryId: '',
      customerData: {},
      //弹窗
      customerDialog: {
        config: {
          width: '800px',
          title: '修改对外信息',
          visible: false
        }
      },
      model: {},
      updateModels: {
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
      editForm: {
        name: '',
        textValue: '',
        webTitle: '',
        programTitle: ''
      }
    }
  },
  methods: {
    //方法开始
    checkDetail(item) {
      console.log(item)
    },
    //修改开始
    editDetail(item) {
      this.model = Object.assign({}, item)
      this.customerDialog.config.visible = true
    },
    //取消按钮
    closeNoticeDialog() {
      this.customerDialog.config.visible = false
    },
    //提交按钮
    sumbitNotice() {
      this.updateModels.userIdList = []
      this.updateModels.userIdList.push(this.customerData.id)
      this.updateModels.name = this.model.name
      if (this.model.type == 0) {
        if (this.model.name == '') {
          this.$message.warning('类型名称不能为空')
          return
        }
        if (this.model.textValue == '') {
          this.$messasge.warning('文本内容不能为空')
          return
        }
        // this.updateModels.name = this.model.name
        this.updateModels.textValue = this.model.textValue
        this.updateModels.type = this.model.type
        this.updateExternal(this.updateModels)
      }
      if (this.model.type == 1) {
        if (this.model.name == '') {
          this.$message.warning('类型名称不能为空')
          return
        }
        if (this.model.webTitle == '') {
          this.$message.warning('网页标题不能为空')
          return
        }
        if (this.model.webUrl == '') {
          this.$message.warning('网页链接不能为空')
          return
        }
        // this.updateModels.name = this.model.name
        this.updateModels.webUrl = this.model.webUrl
        this.updateModels.webTitle = this.model.webTitle
        this.updateModels.type = this.model.type
        this.updateExternal(this.updateModels)
      }
      if (this.model.type == 2) {
        let program = this.$refs.SelectProgramItem.success()
        this.updateModels.programTitle = program.name
        this.updateModels.programAppId = program.appId
        this.updateModels.programPagePath = program.page
        this.updateModels.type = this.model.type
        this.updateExternal(this.updateModels)
      }
    },

    //弹窗关闭按钮
    closeCustomerDialog() {
      this.customerDialog.config.visible = false
    },
    clearModel() {
      this.updateModels = {
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
    },
    //方法结束
    //接口部分
    getMemberDetail() {
      this.$http.getMemberDetail({ id: this.queryId }).then(res => {
        this.customerData = res.data.data
      })
    },
    updateExternal(params) {
      this.$http.updateUserExternalAttr(params).then(() => {
        this.$message.success('修改成功')
        this.getMemberDetail()
        this.clearModel()
        this.customerDialog.config.visible = false
      })
    }
    //接口结束
  },
  created() {
    if (this.$route.query.id) {
      this.queryId = this.$route.query.id
      this.getMemberDetail()
    }
  },
  filters: {
    isGender(option) {
      if (option == 0) {
        return '未知'
      }
      if (option == 1) {
        return '男'
      }
      if (option == 2) {
        return '女'
      }
    },
    isType(option) {
      if (option == 0) {
        return '文本'
      }
      if (option == 1) {
        return '网页'
      }
      if (option == 2) {
        return '小程序'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.department-div {
  width: 100%;
  height: 100%;

  .department-div-top {
    width: 100%;
    height: 100%;
    background-color: #ffffff;
    .department-thmub-text {
      padding: 20px 0;
      margin-left: 20px;
      display: flex;
      .thmub {
        img {
          width: 60px;
          height: 60px;
          border-radius: 5px;
        }
      }
      .text {
        font-size: 18px;
        margin: 5px 0 0 15px;
        color: #909399;
        font-weight: 400;
      }
      .icon {
        font-size: 18px;
        margin: 3px 0 0 5px;
        color: #294a7b;
      }
    }
  }
  .title-bar {
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
    color: #303133;
    position: relative;
    display: flex;
    align-items: center;
    &::before {
      content: '';
      display: block;
      width: 6px;
      height: 20px;
      background-color: #294a7b;
      position: absolute;
      top: 0;
      bottom: 0;
      margin: auto 0;
      left: 0px;
    }
  }
  .department-div-container {
    width: 70%;
    padding: 20px 20px 0;
    box-sizing: border-box;
    ul {
      // max-width: 1000px;
      // display: flex;
      // flex-wrap: wrap;
      li {
        // width: 30%;
        // min-width: 300px;
        font-size: 14px;
        color: #909399;
        margin: 0 20px 30px 0;
        .value {
          .el-tag {
            padding: 0;
            margin: 0;
            padding: 0px 5px;
            cursor: pointer;
            // background-color: black;
          }
          .el-button {
            margin-left: 10px;
          }
        }
      }
    }
  }
  .department-exter-container {
    width: 70%;
    padding: 20px 20px 0;
    box-sizing: border-box;
    ul {
      // max-width: 1000px;
      // display: flex;
      // flex-wrap: wrap;
      li {
        // border: 1px solid red;
        // width: 30%;
        // min-width: 300px;
        font-size: 14px;
        color: #909399;
        margin: 0 20px 10px 0;
        .value {
          .el-tag {
            padding: 0;
            margin: 0;
            padding: 0px 5px;
            cursor: pointer;
            margin-right: 5px;
          }
          .el-button {
            margin-left: 10px;
          }
        }
      }
    }
  }
}
.customer-container {
  .el-form {
    // padding: 10px 0;
  }
}
.customer-btn {
  display: flex;
  justify-content: flex-start;
  div {
    margin-left: auto;
  }
}
.textarea-input {
  ::v-deep .el-textarea__inner {
    padding-right: 20px;
  }
  ::v-deep .el-input__count {
    bottom: 1px;
    height: 20px;
    line-height: 20px;
    text-align: right;
    left: 1px;
    border-bottom-right-radius: 4px;
    border-bottom-left-radius: 4px;
    padding-right: 10px;
    box-sizing: border-box;
  }
}
.selectProgram {
  margin-left: 18px;
}
</style>
