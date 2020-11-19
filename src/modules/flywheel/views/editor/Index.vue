<template>
  <div>
    <div class="mall-menu">
      <div class="flex">
        <el-button size="mini" icon="el-icon-arrow-left" @click="$router.back()">返回</el-button>
      </div>
      <div class="name">页面编辑器</div>
      <div class="flex save">
        <el-button size="mini" type="primary" icon="el-icon-check" @click="onDialogShow()">保存</el-button>
      </div>
    </div>
    <div class="mall-editor">
      <Side />
      <Simulator />
      <Configure />
    </div>
    <el-dialog :visible="visible" append-to-body title="信息描述" :show-close="false" width="450px">
      <el-form ref="extModel" :model="extModel" label-position="right" label-width="80px">
        <el-form-item label="版本号" prop="userVersion" :rules="[{ required: true, message: '请填写版本号' }]">
          <el-input v-model="extModel.userVersion" placeholder="例：1.0.0"></el-input>
        </el-form-item>
        <el-form-item label="版本描述" prop="userDesc" :rules="[{ required: true, message: '请填写版本描述' }]">
          <el-input type="textarea" v-model="extModel.userDesc" placeholder="描述该版本的功能"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="onClose()">关闭</el-button>
        <el-button @click="onSubmit()" type="primary" :loading="uploadLoading">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import mixins from '@/modules/flywheel/mixins'
import Side from './Side'
import Simulator from './Simulator'
import Configure from './Configure'
import { uuid } from '../../utils/tools'
import _ from 'lodash'
export default {
  mixins: [mixins],
  components: {
    Side,
    Simulator,
    Configure
  },
  data() {
    return {
      qrcode: '',
      uploadLoading: false,
      visible: false,
      navigateToMiniProgramAppIdList: [],
      extModel: {
        userVersion: this.$route.query.userVersion,
        userDesc: this.$route.query.userDesc
      }
    }
  },
  created() {
    this.addWeapp()
  },
  methods: {
    addWeapp() {
      this.$http.miniAppPage({ pageSize: 10 }).then(res => {
        this.navigateToMiniProgramAppIdList = res.data.data.list.map(item => item.wxAppId)
      })
    },
    // 生成项目
    async createProject(userVersion, userDesc) {
      // 是否存在ID，不存在创建新的，存在继续使用这个id对应接口的layoutId
      const id = this.$route.query.id || uuid()
      let templates = [],
        pages = [], // 使用到的pages集合
        tabbar = _.cloneDeep(this.tabbar.options), // 小程序的tabbar设置项
        window = _.cloneDeep(this.window.options), // 小程序的window 设置项
        extPages = {}, // ext 中每个页面的一些配置项
        extConfigTabbar = [], // ext.config.tabbar 到时候会替换小程序的tabbar 的图片，文字
        extConfigPages = [], // ext.config.pages 页面自定义的一些配置项
        plugins = {}

      tabbar.list = []
      let customPageIndex = 0
      // 这是tabbar的配置
      this.pageList.forEach((page, index) => {
        // 如果该页面显示，将执行四件事
        if (page.isShow) {
          let newPage = _.cloneDeep(page)
          let { navigationBarTitleText, enablePullDownRefresh } = newPage
          // 1、把每个显示的页面路径放在pages 里面
          if (!pages.includes(newPage.pagePath)) {
            if (!newPage.isSystem) {
              ++customPageIndex
              newPage.pagePath = 'pages/custom/tabbar' + customPageIndex
              pages.push(newPage.pagePath)
              // 2、获取每个页面的自己的config
              extPages[newPage.pagePath] = {
                navigationBarTitleText,
                enablePullDownRefresh
              }
            } else {
              extPages[newPage.pagePath] = {
                navigationBarTitleText
              }
              pages.push(newPage.pagePath)
            }
          }
          extConfigTabbar.push({
            index,
            text: newPage.text
          })
          newPage.iconPath && (extConfigTabbar[index].iconPath = this.imgHost + newPage.iconPath)
          newPage.selectedIconPath &&
            (extConfigTabbar[index].selectedIconPath = this.imgHost + newPage.selectedIconPath)
          // 3、因为小程序模版不会存在新上传的icon，所有只需要text，和pagePath
          // 4、把显示的页面添加到导航栏的配置里面
          const { text, pagePath } = newPage
          tabbar.list.push({ text, pagePath })
        }
        // 如果不是系统创建的页面，则需要把当前页面所用到的组件查询出来
        if (!page.isSystem) {
          const components = this.simulatorComponent
            .filter(comp => {
              return page.id == comp.pageId
            })
            .map(item => {
              return { name: item.name, options: item.options }
            })
          templates.push({
            file: page.id,
            components
          })
          extConfigPages.push({
            layoutAppId: id,
            fileId: page.id,
            background: page.background,
            filledBlock: {
              isHeaderColor: page.isHeaderColor,
              height: page.height * 2,
              themeColor: this.theme.color1
            }
          })
        }
      })
      const theme = {
        '--color-primary': this.theme.color1,
        '--color-primary2': this.theme.color5,
        '--color-primary4': this.theme.color4,
        '--color-primary6': this.theme.color3,
        '--color-primary8': this.theme.color2
      }
      try {
        this.uploadLoading = true
        const data = await this.$http.getWxAppConfig().then(res => {
          return res.data.data
        })
        const project = {
          templates,
          window: this.window,
          tabbar: this.tabbar,
          configPageList: this.configPageList,
          pages: this.pageList,
          components: this.simulatorComponent
        }
        if (data.wechatAppId === 'wx1f09080c8b5c8e3d') {
          plugins = {
            'live-player-plugin': {
              version: '1.0.0', // 填写该直播组件最新版本号，微信开发者工具调试时可获取最新版本号
              provider: 'wx2b03c6e691cd7370' // 必须填该直播组件appid，该示例值即为直播组件appid
            }
          }
        }
        const extJson = {
          plugins,
          pages,
          window,
          tabBar: tabbar,
          extPages,
          extAppid: data.wechatAppId,
          navigateToMiniProgramAppIdList: this.navigateToMiniProgramAppIdList,
          ext: {
            tabbar: extConfigTabbar,
            theme,
            pageConfig: extConfigPages,
            config: {
              HOME_PATH: '/' + pages[0],
              baseUrl: data.projectApi + '/',
              IMG_HOST: data.cosHost,
              appId: data.wechatAppId
            }
          }
        }
        // 保存数据
        await this.$http.addProject1_2({
          id,
          projectName: data.projectName,
          json: JSON.stringify(project),
          extJson: JSON.stringify(extJson),
          userVersion,
          userDesc,
          status: 10,
          path: pages[0]
        })
        this.onClose()
        this.uploadLoading = false
        this.$confirm('数据已保存', '操作提示', {
          type: 'success',
          center: true,
          confirmButtonText: '返回列表',
          cancelButtonText: '关闭'
        })
          .then(() => {
            this.$router.back()
          })
          .catch(() => {})
      } catch (error) {
        this.uploadLoading = false
        console.log(error)
      }
    },
    onSubmit() {
      this.$refs.extModel.validate(flag => {
        if (flag) {
          this.createProject(this.extModel.userVersion, this.extModel.userDesc, this.type)
        }
      })
    },

    onDialogShow(type = 'save') {
      this.type = type
      this.visible = true
    },
    onClose() {
      this.extModel = {
        userVersion: this.$route.query.userVersion,
        userDesc: this.$route.query.userDesc
      }
      this.visible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.mall-menu {
  height: 60px;
  width: 100%;
  padding: 0 20px;
  position: absolute;
  top: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  box-shadow: 0px 0px 10px #eee;
  .flex {
    width: 375px;
    &.save {
      text-align: right;
    }
  }
  .name {
    text-align: center;
  }
}
.mall-editor {
  width: 100%;
  position: absolute;
  top: 60px;
  bottom: 0;
  background: #eee;
  // filter: blur(4px);
}
</style>
