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
            <el-form label-width="120px">
              <el-form-item label="任务名称" :rules="[{ required: true, message: '该字段不能为空' }]"
              >
                <el-input placeholder="请填写任务名称"></el-input>
              </el-form-item>
              <el-form-item label="选择群发账号" :required="true"></el-form-item>
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
                      </el-form-item>
                    </el-form>
                  </div>
                </div>
                <div class="select-total"></div>
              </el-form-item>
              <el-form-item label="是否过滤客户" :required="true">
                <div class="switch-box">
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
                    <p>1、群人数上限为200人，超过200人时请 【添加多个群聊】，否则可能会导致部分用户 【无法入群】，添加多个群聊时，客户只会收到一条群发邀请</p>
                    <p>2、上传群二维码时请【仔细核对】，群二维码和群聊【对应错误】将导致【数据异常】</p>
                    <p>3、如果客户添加了多个客服，只会收到一位客服的入群邀请</p>
                  </div>
                </div>
              </el-form-item>
              <el-form-item label="群聊" :required="true"></el-form-item>
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
  </div>
</template>

<script>
import GoBack from '../../../components/components/GoBack'
export default {
  components: { GoBack },
  data() {
    return {
      form: {
        name: '', // 任务名称
        message: '', // 入群引导语
        isFiltered: true, // 是否需要筛选客户
        isExcludeExistingCustomer: true, // 是否过滤客户（开启后已在群聊中的客户将不会收到邀请）
        gender: 1, // 性别。 0-未知 1-男性 2-女性
        customerStartDate: '', // 客户开始添加日期
        customerEndDate: '', // 客户结束添加日期
        behaviorTagList: [], // 行为标签
        customerList: [], // 客户列表
        groupChatList: [], // 群列表
      },
      dateTimeRange: '', // 时间范围
      behaviorTagList: [], // 行为标签列表
      behaviorTagBoxHeight: 0, // 行为标签容器高度
      tagShowMoreFlag: false, // 是否显示展开/收起按钮
      newTime: '', // 当前时刻
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
        .switch-box {
          display: flex;
          align-items: center;
        }
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