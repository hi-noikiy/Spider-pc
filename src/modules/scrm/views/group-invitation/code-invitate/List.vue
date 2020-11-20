<template>
  <div class="code-invitate-list">
    <div class="query-table-box">
      <el-button size="small" type="primary">新建拉群</el-button>
      <div class="search-content">
        <el-form label-width="100px" label-position="right" size="small">
          <el-form-item label="名称">
            <el-input placeholder="请输入名称"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="common-table-box">
      <el-table
        :data="tableData"
        width="100%"
        id="table"
        :height="tableHeight"
        :header-cell-style="{ 'text-align': 'center' }"
      >
        <el-table-column label="二维码" align="center"></el-table-column>
        <el-table-column label="名称" align="center"></el-table-column>
        <el-table-column label="创建时间" align="center"></el-table-column>
        <el-table-column label="使用成员" align="center"></el-table-column>
        <el-table-column label="添加好友" align="center"></el-table-column>
        <el-table-column label="标签" align="center"></el-table-column>
        <el-table-column label="群聊" align="center"></el-table-column>
        <el-table-column label="操作" align="center"></el-table-column>
      </el-table>
    </div>
    <div class="common-pagination">
      <com-pagination :page="page" @sizeChange="onSizeChange" @pageChange="onPageChange"></com-pagination>
    </div>
    <!-- 拉群详情 -->
    <com-dialog :config="detailDialog.config" @closeDialog="closeDetailDialog">
      <div class="detail-dialog">
        <div class="detail-left">
          <img class="qrcode" src="#" />
          <div class="code-name">拉群名称</div>
          <div class="left-btn"><el-button type="primary" style="width: 120px">下载活码</el-button></div>
          <div class="left-btn"><el-button style="width: 120px">修改</el-button></div>
        </div>
        <div class="detail-right">
          <el-form label-width="100px" label-position="right">
            <el-form-item label="创建时间：">
              <div>2020-11-19</div>
            </el-form-item>
            <el-form-item label="使用成员：">
              <div>使用成员</div>
            </el-form-item>
            <el-form-item label="客户标签：">
              <div>标签一</div>
            </el-form-item>
            <el-form-item label="入群引导语：">
              <div>你好啊！</div>
            </el-form-item>
            <el-form-item label="群聊详情：">
              <div>共两个群聊</div>
              <div class="group-list">
                <div class="group-box">
                  <img class="group-img" src="../../../images/group-icon.png" />
                  <div class="group-msg">
                    <div class="msg-name">群聊名称</div>
                    <div class="msg-numb">1 / 200人</div>
                  </div>
                </div>
                <div class="group-box">
                  <img class="group-img" src="../../../images/group-icon.png" />
                  <div class="group-msg">
                    <div class="msg-name">群聊名称</div>
                    <div class="msg-numb">1 / 200人</div>
                  </div>
                </div>
                <div class="group-box">
                  <img class="group-img" src="../../../images/group-icon.png" />
                  <div class="group-msg">
                    <div class="msg-name">群聊名称</div>
                    <div class="msg-numb">1 / 200人</div>
                  </div>
                </div>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </com-dialog>
  </div>
</template>

<script>
import ComPagination from '../../../components/common/ComPagination'
import ComDialog from '../../../components/common/ComDialog'
export default {
  components: { ComPagination, ComDialog },
  data() {
    return {
      tableData: [],
      tableHeight: 400,
      page: {
        pageNum: 1,
        pageSize: 15,
        total: 0
      },
      searchForm: {
        title: ''
      },
      detailDialog: { // 拉群详情
        config: {
          width: '800px',
          title: '拉群详情',
          visible: true
        }
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.fullTableHeight()
      window.onresize = () => {
        this.fullTableHeight()
      }
    })
  },
  created() {

  },
  destroyed() {
    window.onresize = ''
  },
  methods: {
    fullTableHeight() {
      const TOP_HEADER_HEIGHT = 60,
        PAGINATION_HEIGHT = 52,
        PADDING_BOTTOM_HEIGHT = 20,
        PADDING_TOP_HEIGHT = 20
      this.tableHeight =
        window.innerHeight -
        document.querySelector('#table').offsetTop -
        TOP_HEADER_HEIGHT -
        PAGINATION_HEIGHT -
        PADDING_BOTTOM_HEIGHT -
        PADDING_TOP_HEIGHT
    },
    onSizeChange(val) {
      this.page.pageSize = val
      this.page.pageNum = 1
    },
    onPageChange(val) {
      this.page.pageNum = val
    },
    // 关闭详情弹窗
    closeDetailDialog() {
      this.detailDialog.config.visible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.code-invitate-list {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  box-sizing: border-box;
}
.query-table-box {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 20px 20px 0 20px;
  .search-content {
    display: flex;
    align-items: center;
  }
}
.common-table-box {
  padding: 0 20px;
}
.detail-dialog {
  display: flex;
  height: 400px;
  .detail-left {
    flex: 0 0 200px;
    border-right: 1px solid #e8e8e8;
    padding: 0 20px 0 0;
    text-align: center;
    .qrcode {
      width: 120px;
      height: 120px;
      margin-top: 20px;
    }
    .code-name {
      margin-top: 20px;
      line-height: 24px;
    }
    .left-btn {
      margin-top: 20px;
    }
  }
  .detail-right {
    padding: 0 0 0 20px;
    flex: 1;
    overflow-y: auto;
    .group-list {
      .group-box {
        display: flex;
        padding: 10px;
        width: 250px;
        background: #ffffff;
        border: 1px solid #eee;
        line-height: 20px;
        margin-bottom: 20px;
        .group-img {
          width: 40px;
          height: 40px;
        }
        .group-msg {
          width: 200px;
          margin-left: 10px;
          .msg-name {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          .msg-numb {
            color: #999;
          }
        }
      }
    }
  }
}
::v-deep .el-table th {
  color: #303133;
  background-color: #ebeef5;
}
</style>