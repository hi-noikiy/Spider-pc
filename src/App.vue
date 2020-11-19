<template>
  <div id="app">
    <router-view v-if="ReFresh"></router-view>
    <el-dialog title="系统会话过期，请重新登录" width="380px" :visible="isSession" :show-close="false">
      <el-form ref="model" :model="model" label-position="left" label-width="60px" hide-required-asterisk>
        <el-form-item label="帐号" prop="username" :rules="[{ required: true, message: '请填写帐号' }]">
          <el-input v-model="model.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" :rules="[{ required: true, message: '请填写密码' }]">
          <el-input type="password" v-model="model.password"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="systemOut()">退出系统</el-button>
        <el-button type="primary" @click="login()">登录</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'app',
  destroyed() {
    localStorage.removeItem('user')
    localStorage.removeItem('appMsgValid')
    localStorage.removeItem('appMessage')
  },
  provide() {
    return {
      reload: this.reload
    }
  },
  data() {
    return {
      model: {
        username: '',
        password: '',
        type: 2
      },
      ReFresh: true
    }
  },
  computed: {
    isSession() {
      return this.$store.state.isSession
    }
  },
  created() {
    this.getAppMessage()
  },
  methods: {
    systemOut() {
      this.$store.commit('updateSession', false)
      this.$router.replace('/login')
    },
    login() {
      this.$refs.model.validate((value) => {
        if (value) {
          this.$http.login(this.model).then((res) => {
            this.model = this.$options.data().model
            this.$nextTick(() => {
              this.$refs.model.clearValidate()
            })
            this.$store.commit('updateSession', false)
            localStorage.setItem('user', JSON.stringify(res.data.data))
            // 判断是否重载页面
            let isPostTypeApi = this.$store.state.isPostTypeApi
            if (!isPostTypeApi) {
              location.reload()
            }
          })
        }
      })
    },
    reload() {
      this.ReFresh = false
      this.$nextTick(() => {
        this.ReFresh = true
      })
    },
    /**
     * 根据code获取应用信息（用于动态页面标题和登录页的logo）
     * code: 从浏览器地址里面截取应用名称
     * 比如：http://x.wego168.com/athena/admin/#/会截到 “athena”
     */
    getAppMessage() {
      if (location && location.host == 'go.growth168.com') {
      // if (location && location.host == 'localhost:8082') {
        // 是否是数字增长 匹配成功就切换成数字增长的logo
        let obj = {
          name: '数字增长-小树桔',
          company: '小树桔',
          remark: '',
          logUrl: '/attachments/component/182ebe4370364e9eb84e58f2756a6526.png'
        }
        localStorage.setItem('appMsgValid', 'true')
        localStorage.setItem('appMessage', JSON.stringify(obj))
        return
      }
      let pathName = window.location.pathname
      let strs = pathName.split('/')
      let code = strs[1]
      // let code = 'hyzs'
      if (code) {
        this.$http.getAppMessage({ code: code }).then((res) => {
          let obj = res.data.data
          if (obj) {
            localStorage.setItem('appMsgValid', 'true')
            localStorage.setItem('appMessage', JSON.stringify(res.data.data))
            document.title = obj.name
          } else {
            localStorage.setItem('appMsgValid', 'false')
          }
        })
      } else {
        localStorage.setItem('appMsgValid', 'false')
      }
    }
  }
}
</script>

<style lang="scss">
@import url('./assets/css/reset.css');
@import url('//at.alicdn.com/t/font_1365381_llbfgl71eb8.css'); // 阿里字体库iconfont（项目：企成iocn）
@import url('./assets/css/emotion.css');

#app {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial,
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.el-image-viewer__close {
  color: #fff !important;
  font-size: 50px !important;
}
.el-image-viewer__mask {
  opacity: 0.8 !important;
}

.upload-img-box {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 6px;
  border: 1px dashed #d9d9d9;
  overflow: hidden;
  cursor: pointer;
  &:hover {
    // border-color: #409eff;
    border-color: $--color-primary;
  }
  .upload-icon {
    font-size: 28px;
    color: #8c939d;
    width: 120px;
    height: 120px;
    line-height: 120px !important;
    text-align: center;
  }
}

.img-upload {
  display: flex;
  justify-content: space-between;
  .img-item {
    width: 270px;
  }
}

.context-box {
  padding: 20px;
  overflow: auto;
  min-width: 850px;
  .setting {
    margin-bottom: 30px;
    .title {
      margin-bottom: 20px;
      line-height: 1;
      font-size: 18px;
      position: relative;
      padding: 10px 15px;
      background: #f2f2f2;
      &:before {
        position: absolute;
        content: '';
        border-left: 3px solid #2161ad;
        left: 0;
        top: 0;
        bottom: 0;
      }
    }
  }
}
</style>
