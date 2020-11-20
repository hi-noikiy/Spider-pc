<template>
  <!-- 企业配置 -->
  <div>
    <div class="title">配置企业微信调用接口所需要的密钥等信息</div>
    <div class="from">
      <el-form :model="formData" ref="ruleForm" label-width="132px" label-position="right" class="demo-ruleForm">
        <el-form-item
          label="企业名称"
          :rules="[{ required: true, message: '请输入企业名称', trigger: 'blur' }]"
          prop="name"
        >
          <el-input v-model="formData.name" placeholder="请输入企业名称" :disabled="isDisabled"></el-input>
        </el-form-item>
        <el-form-item
          label="企业ID"
          :rules="[{ required: true, message: '请输入企业ID', trigger: 'blur' }]"
          prop="cropId"
        >
          <div class="item_content">
            <el-input v-model="formData.cropId" placeholder="请输入企业ID" :disabled="isDisabled"></el-input>
            <el-popover
              placement="right"
              title="获取企业号ID"
              width="400"
              trigger="hover"
              content="进入https://work.weixin.qq.com/wework_admin/frame#profile我的企业-企业信息，最下方复制企业ID"
            >
              <el-button slot="reference" type="text" icon="el-icon-warning-outline"></el-button>
            </el-popover>
          </div>
        </el-form-item>
        <el-form-item
          label="通讯录同步Secret"
          :rules="[{ required: true, message: '请输入通讯录同步Secret', trigger: 'blur' }]"
          prop="secret"
        >
          <div class="item_content">
            <el-input v-model="formData.secret" placeholder="请输入通讯录同步Secret" :disabled="isDisabled"></el-input>
            <el-popover
              placement="right"
              title="获取通讯录同步密钥"
              width="400"
              trigger="hover"
              content="进入https://work.weixin.qq.com/wework_admin/frame#apps/contactsApi管理工具-通讯录同步，开启API编辑通讯录同步功能，并复制Secret"
            >
              <el-button slot="reference" type="text" icon="el-icon-warning-outline"></el-button>
            </el-popover>
          </div>
        </el-form-item>
        <el-form-item
          label="客户联系Secret"
          :rules="[{ required: true, message: '请输入客户联系Secret', trigger: 'blur' }]"
          prop="customerSecret"
        >
          <div class="item_content">
            <el-input
              v-model="formData.customerSecret"
              placeholder="请输入客户联系Secret"
              :disabled="isDisabled"
            ></el-input>
            <el-popover
              placement="right"
              title="获取客户联系密钥"
              width="400"
              trigger="hover"
              content="进入https://work.weixin.qq.com/wework_admin/frame#customer/analysis客户联系-客户，开启API管理客户功能，并复制Secret"
            >
              <el-button slot="reference" type="text" icon="el-icon-warning-outline"></el-button>
            </el-popover>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button plain @click="updateButton" v-show="isDisabled">修改</el-button>
          <el-button type="primary" @click="createCompany" v-if="isNewFlag && !isDisabled">保存</el-button>
          <el-button type="primary" @click="updateCompany" v-if="!isNewFlag && !isDisabled">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import api from '../../../api/dispose'
export default {
  data() {
    return {
      // 表单数据
      formData: {
        name: '',
        cropId: '',
        secret: '',
        customerSecret: ''
      },
      // 是否为修改可编辑状态
      isDisabled: true,
      // 是否未新建
      isNewFlag: true
    }
  },
  methods: {
    // ---页面渲染---
    // 修改
    updateButton() {
      this.isDisabled = false
    },
    // ---获取数据---
    // 获取授权信息
    disposePage(options) {
      api.disposePage(options).then((res) => {
        let data = res.data.data.list
        if (!data || data.length == 0) {
          this.isDisabled = false
          this.isNewFlag = true
          return
        }
        data.forEach((item) => {
          if (item.agentId == -1) {
            this.formData = item
            this.$store.commit('dispose/setCompanyInfo', { id: item.cropId, name: item.name })
            this.isDisabled = true
            this.isNewFlag = false
          }
        })
      })
    },
    // 新建授权
    createCompany() {
      if (this.isDisabled) {
        return
      }
      this.$refs.ruleForm.validate((valid) => {
        this.formData.agentId = -1
        this.formData.mark = "global"
        this.formData.signatureToken = -1
        this.formData.signatureKey = -1
        if (valid) {
          api.disposeAdd(this.formData).then(() => {
            this.$message.success('新建成功')
            this.isDisabled = true
            this.disposePage()
          })
        } else {
          return false
        }
      })
    },
    // 修改授权
    updateCompany() {
      if (this.isDisabled) {
        return
      }
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          api.disposeUpdate(this.formData).then((res) => {
            this.disposePage()
            this.$message.success('修改成功')
          })
        } else {
          return false
        }
      })
    }
  },
  created() {
    this.disposePage()
  }
}
</script>

<style lang="scss" scoped>
.title {
  font-size: 16px;
  padding: 20px 0;
  color: #606266;
  position: relative;
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
    left: -20px;
  }
}
.from {
  width: 600px;
  .item_content {
    width: 494px;
    display: flex;
    .el-button {
      margin-left: 10px;
    }
  }
}
</style>