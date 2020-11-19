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
              <el-form-item label="使用人员" :required="true"></el-form-item>
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
                    <p>1、可添加多个群聊，当前面的群人数达到上限后，自动发送后面的群二维码</p>
                    <p>2、群人数上限最多为200人</p>
                    <p>3、上传群二维码时请【仔细核对】，群二维码和群聊【对应错误】将导致【拉群任务失败】</p>
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
            <el-table-column label="操作" align="center"></el-table-column>
          </el-table>
        </div>
        <div class="common-pagination">
          <com-pagination :page="colonyDialog.page"></com-pagination>
        </div>
      </div>
    </com-dialog>
  </div>
</template>

<script>
import GoBack from '../../../components/components/GoBack'
import ComDialog from '../../../components/common/ComDialog'
import ComPagination from '../../../components/common/ComPagination'
export default {
  components: { GoBack, ComDialog, ComPagination },
  data() {
    return {
      form: {
        message: ''
      },
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
      }
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
    // 打开群聊弹窗
    showColonyDialog() {
      this.colonyDialog.config.visible = true
      this.getColonyList()
    },
    // 关闭群聊弹窗
    closeColonyDialog() {
      this.colonyDialog.config.visible = false
    },
    // 获取客户群列表
    getColonyList() {
      this.$http.getCustomerColonyPage(this.colonyDialog.page).then(res => {
        this.colonyDialog.tableData = res.data.data.list
        this.colonyDialog.page.total = res.data.data.total
      })
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
::v-deep .el-form-item .el-form-item {
  margin-bottom: 22px;
}
.preview-content::-webkit-scrollbar {
  width: 2px;
  height: 20px;
}
</style>