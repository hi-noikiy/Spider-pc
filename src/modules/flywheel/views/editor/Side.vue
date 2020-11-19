<template>
  <div class="side">
    <div class="card-wrap">
      <div class="card" :class="{ 'card--active': type == 'app' }" @click="type = 'app'">
        项目配置
      </div>
      <div class="card" :class="{ 'card--active': type == 'page' }" @click="type = 'page'">
        页面配置
      </div>
      <div class="card" :class="{ 'card--active': type == 'component' }" @click="() => (type = 'component')">
        组件配置
      </div>
    </div>
    <div class="page-menu" v-if="type == 'app'">
      <el-collapse accordion>
        <el-collapse-item title="导航栏" name="1">
          <RenderForm
            :form-options="window.config"
            @update-form="updateSideConfigByType($event, 'window')"
          ></RenderForm>
        </el-collapse-item>
        <el-collapse-item title="底部菜单" name="2">
          <RenderForm
            :form-options="tabbar.config"
            @update-form="updateSideConfigByType($event, 'tabbar')"
          ></RenderForm>
        </el-collapse-item>
      </el-collapse>
    </div>
    <div class="page-menu pages-editor" v-else-if="type == 'page'">
      <el-collapse accordion>
        <el-collapse-item v-for="configPage in configPageList" :key="configPage.id" :title="configPage.title">
          <ul class="page-wrap-title">
            <li
              v-for="(page, index) in configPage.pages"
              :key="index"
              class="page-wrap-title__list"
              :class="{ 'page-wrap-title__list--active': currentPageId == page.options.id }"
              @click="updateCurrentPageId(page.options.id)"
            >
              <i class="el-icon-check" v-if="page.options.isShow" />
              <span class="name">{{ page.options.text }}</span>
            </li>
            <li class="page-wrap-title__list" v-if="configPage.code == 'zdy'" @click="pushPageList">
              <i class="el-icon-plus" />
            </li>
          </ul>
          <template v-for="(page, index) in configPage.pages">
            <div class="page-wrap-content" :key="index" v-if="currentPageId == page.options.id">
              <RenderForm :form-options="page.config" @update-form="updateConfigPageListForm"></RenderForm>
              <el-button
                v-if="!page.options.isSystem"
                plain
                type="danger"
                size="small"
                icon="el-icon-delete"
                style="margin:0 0 20px 100px"
                @click="removePageList(index)"
                >移除</el-button
              >
            </div>
          </template>
        </el-collapse-item>
      </el-collapse>
    </div>
    <div class="page-menu" v-else-if="type == 'component'">
      <el-collapse accordion>
        <template v-for="item in componentListData">
          <el-collapse-item v-if="item.code === 'jczj'" :key="item.id" :title="item.name" :name="item.id">
            <ul class="components">
              <li
                v-for="(component, key) in item.child"
                :key="key"
                class="component"
                @click="pushComponentToSimulator(component.name)"
              >
                <el-image :src="imgHost + component.iconUrl" style="width:35px;"></el-image>
                <pre class="text">{{ component.title }}</pre>
              </li>
            </ul>
          </el-collapse-item>
          <el-collapse-item :title="item.name" :name="item.id" :key="item.id" v-else>
            <div v-for="component in item.child" :key="component.id">
              <img
                class="component-list"
                :src="imgHost + component.iconUrl"
                width="100%"
                @click="pushComponentToSimulator(component.name)"
              />
            </div>
          </el-collapse-item>
        </template>
      </el-collapse>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import RenderForm from './RenderForm'
import index from '@/modules/flywheel/mixins'
import { mapMutations } from 'vuex'
import createPage from '@/modules/flywheel/utils/pages'
import { uuid } from '../../utils/tools'

export default {
  components: {
    RenderForm
  },
  mixins: [index],
  data() {
    return {
      type: 'app',
      componentListData: [],
      componentLists: [],
      componentCustoms: []
    }
  },
  created() {
    this.pageComponentCategory()
    if (this.$route.query.id) {
      this.getProject()
    } else {
      this.pageCategory(_.cloneDeep(this.configPageList))
    }
  },
  methods: {
    ...mapMutations({
      updateSideConfig: 'editor/updateSideConfig',
      updateConfigPageList: 'editor/updateConfigPageList'
    }),
    getProject() {
      this.$http.getProject({ id: this.$route.query.id }).then(res => {
        const app = JSON.parse(res.data.data.json)
        this.updateSideConfig({ type: 'window', data: app.window })
        this.updateSideConfig({ type: 'tabbar', data: app.tabbar })
        this.updatePageList(app.pages)
        this.updateComponentToSimulator(app.components)
        this.pageCategory(_.cloneDeep(app.configPageList))
      })
    },
    // 获取分类
    pageCategory(moduleList) {
      this.$http.pageFlywheelCategory({ type: 12 }).then(res => {
        res.data.data.list.forEach((category, index) => {
          let module = moduleList.find(item => item.id === category.id)
          if (!module) {
            moduleList.splice(index + 1, 0, {
              code: category.code,
              title: category.name,
              id: category.id,
              pages: []
            })
          }
        })
        this.pageFlyWheelNavigationBar(moduleList)
      })
    },
    pageComponentCategory() {
      this.$http.pageFlywheelCategory({ type: 14 }).then(res => {
        this.componentListData = res.data.data.list
        this.pageFlyWheelComponent()
      })
    },
    pageFlyWheelNavigationBar(moduleList) {
      this.$http.pageFlyWheelNavigationBar({ isTabBar: true }).then(res => {
        let pageList = []
        res.data.data.list.forEach(item => {
          let page = createPage(item)
          page.options = item
          pageList.push(page)
        })
        pageList.forEach(page => {
          let module = moduleList.find(module => module.id == page.options.categoryId)
          let modulePage = module.pages.find(modulePage => modulePage.options.id === page.options.id)
          if (modulePage) {
            Object.assign(page, modulePage)
          } else {
            module.pages.push(page)
          }
        })
        this.updateConfigPageList(moduleList)
      })
    },
    pageFlyWheelComponent() {
      this.$http.pageFlyWheelComponent({ pageSize: 1000, pageNum: 1 }).then(res => {
        // res.data.data.list.push({
        //   categoryId: '1a50db48950245108b18628e014566fb',
        //   name: 'QcVideo',
        //   iconUrl: ''
        // })
        res.data.data.list.forEach(comp => {
          this.componentListData.forEach(category => {
            if (comp.categoryId === category.id) {
              if (category.child) {
                category.child.push(comp)
              } else {
                category.child = []
                category.child.push(comp)
              }
            }
          })
        })
      })
    },
    updateSideConfigByType(form, type) {
      let data = _.cloneDeep(this[type])
      data.config = form
      data.options = this.formatComponentOptions(data.config)
      this.updateSideConfig({ type, data })
    },
    updateConfigPageListForm(form) {
      const options = this.formatComponentOptions(form)
      let configPageList = _.cloneDeep(this.configPageList)
      configPageList.forEach(pageConfig => {
        pageConfig.pages.some(item => {
          if (item.options.id == this.currentPageId) {
            item.config = form
            item.options = options
            return true
          }
        })
      })
      this.updateConfigPageList(configPageList)
      this.updatePageListForm(options)
    },
    updatePageListForm(options) {
      let pageList = _.cloneDeep(this.pageList)
      pageList.some((item, index) => {
        if (item.id == this.currentPageId) {
          // 能否匹配到，匹配到如果：isShow是true，做替换操作。否则删除当前列。
          if (options.isShow) {
            pageList[index] = options
          } else {
            pageList.splice(index, 1)
            // this.updateCurrentPageId('')
          }
          return true
        } else if (pageList.length - 1 === index && item.id !== this.currentPageId) {
          // 当最后一个都匹配不到时，添加一个
          pageList.push(options)
        }
      })
      if (pageList.length === 0) {
        pageList.push(options)
      }
      this.updatePageList(pageList)
    },
    /**
     * 添加一个自定义页面
     */
    pushPageList() {
      if (this.configPageList[0].pages.length === 5) {
        this.$message('最多添加五个自定义页面')
      } else {
        const hasAdding = this.pageList.length < 5
        // 创建的新页面
        let page = createPage({ isShow: hasAdding ? true : false })
        // 已存在的配置页面
        let configPageList = _.cloneDeep(this.configPageList)
        // 显示的页面列表
        let pageList = _.cloneDeep(this.pageList)
        page.options = this.formatComponentOptions(page.config)
        configPageList[0].pages.push(page)
        this.updateConfigPageList(configPageList)
        if (hasAdding) {
          pageList.push(page.options)
          this.updatePageList(pageList)
        }
      }
    },
    removePageList(index) {
      let configPageList = _.cloneDeep(this.configPageList)
      let pageList = _.cloneDeep(this.pageList)
      let removePage = configPageList[0].pages.splice(index, 1)
      pageList.some((item, index) => {
        if (item.id === removePage[0].options.id) {
          pageList.splice(index, 1)
          return true
        }
      })
      this.updatePageList(pageList)
      this.updateConfigPageList(configPageList)
      this.clearPageListComponent(index, removePage)
    },
    /**
     * 移除一个页面
     * @param {string} index 下标
     */
    clearPageListComponent(index, removePage) {
      // 清除该页面的所关联的组件
      let simulatorComponent = _.cloneDeep(this.simulatorComponent).filter(component => {
        return component.pageId != removePage[0].options.id
      })
      this.updateComponentToSimulator(simulatorComponent)
    },
    /**
     * 向仿真器添加一个组件
     * @param {string} name 组件名
     */
    pushComponentToSimulator(name) {
      const data = this.simulatorComponent.filter(item => item.name === name)
      let component = this.componentList.find(item => item.name === name)
      if (
        (this.currentPage.isSystem && this.$message('该页面只提供预览，不支持编辑')) ||
        (!component && this.$message('组件不存在！')) ||
        (!this.currentPageId && this.$message('请选择先选择或创建页面，再添加组件！')) ||
        (component.max && data.length >= component.max && this.$message(`该组件只能添加${component.max}个`))
      )
        return
      let newComponent = _.cloneDeep(component)
      newComponent.id = uuid()
      newComponent.pageId = this.currentPageId
      let simulatorComponent = _.cloneDeep(this.simulatorComponent)
      simulatorComponent.push(newComponent)
      this.updateComponentToSimulator(simulatorComponent)
    }
  }
}
</script>
<style lang="scss">
.el-collapse {
  border-top: none;
  .el-collapse-item__header {
    font-weight: normal;
    padding-left: 20px;
  }
}
.page-menu {
  .el-collapse-item__content {
    padding: 0 20px;
  }
  .el-form-item__label {
    text-align: left;
  }
}
.pages-editor {
  .el-collapse-item__content {
    padding: 0;
  }
}
</style>

<style lang="scss" scoped>
.side {
  width: 375px;
  height: 100%;
  position: absolute;
  left: 0;
  z-index: 1;
  border-right: 1px solid #eee;
  background: #fff;
  .card-wrap {
    display: flex;
    background: #e8e8e8;
    color: #888;
    .card {
      padding: 15px 10px;
      flex: 1;
      text-align: center;
      cursor: pointer;
      &.card--active {
        background: #fff;
      }
    }
  }
  .page-menu {
    width: 375px;
    position: fixed;
    bottom: 0;
    top: 110px;
    z-index: 10;
    overflow-y: auto;
    box-sizing: border-box;
    &::-webkit-scrollbar {
      display: none;
    }
    &.pages-editor {
      .page-wrap-title {
        display: flex;
        flex-wrap: wrap;
        border-top: 1px solid #eee;
        &__list {
          position: relative;
          text-align: center;
          flex: 75px 0;
          height: 50px;
          padding: 5px;
          background: #eee;
          box-sizing: border-box;
          border-right: 1px solid #fff;
          border-bottom: 1px solid #eee;
          cursor: default;
          &--active {
            background: #dadada;
          }
          .name {
            width: 100%;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
          .el-icon-check {
            position: absolute;
            top: 0;
            right: 0;
            padding: 2px;
            font-size: 14px;
            background: #2196f3;
            color: #fff;
          }
          .el-icon-plus {
            position: absolute;
            font-size: 26px;
            left: 26px;
            top: 13px;
          }
        }
      }
      .page-wrap-content {
        padding: 15px 15px 0;
        border-top: 1px solid #eee;
      }
    }
  }
  .components {
    .component {
      float: left;
      width: 25%;
      padding: 10px 0;
      box-sizing: border-box;
      transition: all 0.3s;
      list-style: none;
      text-align: center;
      cursor: pointer;
      &:hover {
        box-shadow: inset 0 0px 17px 2px #eeeeee;
      }
      .icon {
        display: inline-block;
        font-size: 28px;
        color: #ff5722;
      }
      .text {
        color: #909399;
        font-size: 12px;
      }
    }
  }
}
.component-list {
  border-radius: 3px;
  margin-top: 15px;
  box-shadow: 0px 0px 5px #f3f3f3;
  transition: all 0.2s;
  &:hover {
    box-shadow: 0px 0px 15px #dadada;
  }
}
</style>
