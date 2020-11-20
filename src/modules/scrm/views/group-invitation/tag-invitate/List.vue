<template>
  <div class="tag-invitate-list">
    <div class="query-table-box">
      <el-button size="small" type="primary" @click="addTagInvitation">创建群邀请</el-button>
      <div class="search-content">
        <el-form label-width="100px" label-position="right" size="small">
          <el-form-item label="任务名称">
            <el-input placeholder="请输入任务名称"></el-input>
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
        <el-table-column label="任务名称" align="center" prop="name"></el-table-column>
        <!-- <el-table-column label="群名称" align="center"></el-table-column> -->
        <!-- <el-table-column label="发送邀请成员" align="center"></el-table-column> -->
        <el-table-column label="创建时间" align="center" prop="createTime"></el-table-column>
        <!-- <el-table-column label="已邀请客户" align="center"></el-table-column> -->
        <!-- <el-table-column label="已入群客户" align="center"></el-table-column> -->
        <!-- <el-table-column label="未发送成员" align="center"></el-table-column> -->
        <!-- <el-table-column label="未邀请客户" align="center"></el-table-column> -->
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="getGroupDetail(scope.row.id)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="common-pagination">
      <com-pagination :page="page" @sizeChange="onSizeChange" @pageChange="onPageChange"></com-pagination>
    </div>
  </div>
</template>

<script>
import ComPagination from '../../../components/common/ComPagination'
export default {
  components: { ComPagination },
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
    this.getGroupInvitationPage()
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
    // 获取列表
    getGroupInvitationPage() {
      let params = {
        pageNum: this.page.pageNum,
        pageSize: this.page.pageSize,
      }
      this.$http.getGroupInvitationPage(params).then(res => {
        this.tableData = res.data.data.list
        this.page.total = res.data.data.total
      })
    },
    // 跳转到详情页
    getGroupDetail(id) {
      this.$router.push(`/main/scrm/group-invitation/tag/detail?id=${id}`)
    },
    // 跳转到新增页
    addTagInvitation() {
      this.$router.push(`/main/scrm/group-invitation/tag/form`)
    },
    onSizeChange(val) {
      this.page.pageSize = val
      this.page.pageNum = 1
      this.getGroupInvitationPage()
    },
    onPageChange(val) {
      this.page.pageNum = val
      this.getGroupInvitationPage()
    }
  }
}
</script>

<style lang="scss" scoped>
.tag-invitate-list {
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
::v-deep .el-table th {
  color: #303133;
  background-color: #ebeef5;
}
</style>