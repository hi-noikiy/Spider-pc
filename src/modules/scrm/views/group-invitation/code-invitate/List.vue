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
      <com-pagination :page="page"></com-pagination>
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
::v-deep .el-table th {
  color: #303133;
  background-color: #ebeef5;
}
</style>