<template>
  <div class="tag-invitate-detail">
    <go-back title="详情"></go-back>
    <div class="container">
      <div class="overview">
        <div class="left">
          <div>基本信息</div>
        </div>
        <div class="right">
          <div class="right-title">客户统计</div>
          <div class="right-box">
            <div class="right-statistics">
              <div class="s-item item-divider">
                <div class="count">0</div>
                <div class="name">已入群客户</div>
              </div>
              <div class="s-item">
                <div class="count">0</div>
                <div class="name">未入群客户</div>
              </div>
            </div>
            <div class="right-statistics">
              <div class="s-item item-divider">
                <div class="count">0</div>
                <div class="name">已邀请客户
                  <el-tooltip
                    effect="light"
                    placement="top"
                    content="邀请客户列表中，已收到成员推送的入群邀请的客户数"
                  >
                    <i class="el-icon-question"></i>
                  </el-tooltip>
                </div>
              </div>
              <div class="s-item">
                <div class="count">0</div>
                <div class="name">未邀请客户
                  <el-tooltip
                    effect="light"
                    placement="top"
                    content="邀请客户列表中，未收到成员推送的入群邀请的客户数"
                  >
                    <i class="el-icon-question"></i>
                  </el-tooltip>
                </div>
              </div>
            </div>
            <div class="right-statistics">
              <div class="s-item item-divider">
                <div class="count">0</div>
                <div class="name">完成发送成员
                  <el-tooltip
                    effect="light"
                    placement="top"
                    content="已将邀请客户入群的群发任务，群发给客户的员工数，若成员收到了多条邀请群发的任务，需将全部推送都发送，则视为已发送"
                  >
                    <i class="el-icon-question"></i>
                  </el-tooltip>
                </div>
              </div>
              <div class="s-item">
                <div class="count">0</div>
                <div class="name">未完成发送成员
                  <el-tooltip
                    effect="light"
                    placement="top"
                    content="收到群发任务的成员，未发送群发邀请的成员数。若成员收到了多条邀请群发的任务，有一条未发送的任务，则视为未完成"
                  >
                    <i class="el-icon-question"></i>
                  </el-tooltip>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="table-list">
        <tab-button :navList="navList" @change="changeNav"></tab-button>
        <div class="list-box" v-if="activeTab === 0">
          <div class="query-table-box">
            <el-form inline label-width="80px" label-position="right" size="small">
              <el-form-item label="客户名称">
                <el-input placeholder="请输入要搜索的客户"></el-input>
              </el-form-item>
              <el-form-item label="送达状态">
                <el-select v-model="customerSearch.form.status" placeholder="请选择">
                  <el-option
                    v-for="item in customerSearch.statusOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="是否入群">
                <el-select v-model="customerSearch.form.join" placeholder="请选择">
                  <el-option
                    v-for="item in customerSearch.joinOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>
          <div class="common-table-box">
            <el-table
              id="customerTable"
              :header-cell-style="{ 'text-align': 'center' }"
              :height="tableHeight"
            >
              <el-table-column label="客户" align="center"></el-table-column>
              <el-table-column label="所属成员" align="center"></el-table-column>
              <el-table-column label="发送状态" align="center"></el-table-column>
              <el-table-column label="邀请群聊" align="center"></el-table-column>
              <el-table-column label="是否入群" align="center"></el-table-column>
              <el-table-column label="操作" align="center"></el-table-column>
            </el-table>
          </div>
          <div class="common-pagination">
            <com-pagination></com-pagination>
          </div>
        </div>
        <div class="list-box" v-if="activeTab === 1">
          <div class="query-table-box">
            <el-form inline label-width="100px" label-position="right" size="small">
              <el-form-item label="成员名称">
                <el-input placeholder="请输入要搜索的成员"></el-input>
              </el-form-item>
              <el-form-item label="收到任务条数">
                <el-select v-model="userSearch.form.task" placeholder="请选择">
                  <el-option
                    v-for="item in userSearch.taskOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="送达状态">
                <el-select v-model="userSearch.form.status" placeholder="请选择">
                  <el-option
                    v-for="item in userSearch.statusOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>
          <div class="common-table-box">
            <el-table
              id="userTable"
              :header-cell-style="{ 'text-align': 'center' }"
              :height="tableHeight"
            >
              <el-table-column label="成员" align="center"></el-table-column>
              <el-table-column label="客户数" align="center"></el-table-column>
              <el-table-column label="已邀请" align="center"></el-table-column>
              <el-table-column label="收到任务条数" align="center"></el-table-column>
              <el-table-column label="发送状态" align="center"></el-table-column>
              <el-table-column label="操作" align="center"></el-table-column>
            </el-table>
          </div>
          <div class="common-pagination">
            <com-pagination></com-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GoBack from '../../../components/components/GoBack'
import TabButton from '../../../components/components/TabButton'
import ComPagination from '../../../components/common/ComPagination'
export default {
  components: { GoBack, TabButton, ComPagination },
  data() {
    return {
      tagInvitateId: '', // 标签建群id
      navList: [
        { name: '客户详情', isActive: true },
        { name: '成员详情', isActive: false }
      ],
      activeTab: 0, // 默认选中的标签项
      tableHeight: 400,
      userTableHeight: 400,
      customerSearch: { // 客户列表搜索表单
        form: {
          status: '1', // 送达状态
          join: '1', // 是否入群
        },
        statusOptions: [ // 送达状态
          { value: '1', label: '未收到邀请' },
          { value: '2', label: '已收到邀请' },
          { value: '3', label: '客户已不是好友' },
          { value: '4', label: '客户接受已达上限' },
        ],
        joinOptions: [ // 是否入群
          { value: '1', label: '已入群' },
          { value: '2', label: '未入群' }
        ]
      },
      userSearch: { // 成员列表搜索表单
        form: {
          task: '1', // 收到任务条数
          status: '1', // 发送状态
        },
        taskOptions: [ // 收到任务条数
          { value: '1', label: '1条' },
          { value: '2', label: '多条' },
        ],
        statusOptions: [ // 发送状态
          { value: '1', label: '未完成发送' },
          { value: '2', label: '已完成发送' },
        ]
      }
    }
  },
  created() {
    // if (this.$route.query.id) {
    //   this.tagInvitateId = this.$route.query.id
    //   this.getGroupInvitationDetail()
    //   this.getInvitCustomerPage()
    // }
  },
  mounted() {
    this.$nextTick(() => {
      this.fullTableHeight()
      window.onresize = () => {
        this.fullTableHeight()
      }
    })
  },
  methods: {
    fullTableHeight() {
      const TOP_HEADER_HEIGHT = 60,
        PAGINATION_HEIGHT = 52,
        PADDING_TOP_HEIGHT = 20
      this.tableHeight =
        window.innerHeight -
        document.querySelector('.table-list').offsetTop -
        TOP_HEADER_HEIGHT -
        PAGINATION_HEIGHT -
        PADDING_TOP_HEIGHT - 116
      console.log('返回高度', this.tableHeight)
    },
    getGroupInvitationDetail() {
      this.$http.getGroupInvitationDetail({ id: this.tagInvitateId }).then(res => {

      })
    },
    getInvitCustomerPage() {
      this.$http.getGroupInvitationCustomerPage().then(res => {

      })
    },
    changeNav(val) {
      this.activeTab = val
    }
  },
  destroyed() {
    window.onresize = ''
  }
}
</script>

<style lang="scss" scoped>
.container {
  font-size: 14px;
  .overview {
    display: flex;
    line-height: 20px;
    margin-bottom: 20px;
    .left {
      padding: 20px;
      background: #ffffff;
      flex-basis: 30%;
      margin-right: 20px;
    }
    .right {
      padding: 20px;
      background: #ffffff;
      flex-basis: 70%;
      .right-title {
        padding-bottom: 20px;
      }
      .right-box {
        display: flex;
        justify-content: space-between;
        .right-statistics {
          display: flex;
          background: #fbfdff;
          border: 1px solid #cfe8ff;
          flex-basis: 32%;
          .s-item {
            position: relative;
            flex: 1;
            padding: 30px 0;
            text-align: center;
            .count {
              margin-bottom: 10px;
            }
          }
          .item-divider {
            &::after {
              content: "";
              width: 1px;
              height: 38px;
              background: #e9e9e9;
              position: absolute;
              top: 50%;
              -webkit-transform: translateY(-50%);
              transform: translateY(-50%);
              right: 0;
            }
          }
        }
      }
    }
  }
}
.table-list {
  .list-box {
    background: #ffffff;
    .query-table-box {
      padding: 20px 20px 0 20px;
    }
    .common-table-box {
      padding: 0 20px;
    }
  }
}
::v-deep .el-table th {
  color: #303133;
  background-color: #ebeef5;
}
</style>