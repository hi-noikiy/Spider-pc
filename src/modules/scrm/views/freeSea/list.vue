<template>
  <div>
    <!-- 顶部导航 -->
    <div class="top_nav_tabe">
      <ul>
        <li
          v-for="(item, index) in catrgrouList"
          :key="index"
          :class="{
            active: item.isActive,
            borderRight: index == 0 && catrgrouList[1].isActive,
            borderLeft: index == catrgrouList.length - 1 && catrgrouList[catrgrouList.length - 2].isActive
          }"
          @click="relationClick(index)"
        >
          {{ item.name }}
        </li>
      </ul>
    </div>
    <div class="addlivecode">
      <div class="container">
        <div class="top_nav">
          <div class="query-table-box" v-if="nowIndex == 0">
            <el-form inline :model="searchForm" label-width="100px" label-position="left" size="small">
              <el-form-item label="客户昵称">
                <el-input v-model="searchForm.name" @input="searchLiveCodeList" clearable></el-input>
              </el-form-item>
              <el-form-item label="客户来源">
                <el-input v-model="searchForm.name" @input="searchLiveCodeList" clearable></el-input>
              </el-form-item>
              <el-form-item label="进入回收时间">
                <el-date-picker
                  v-model="sendTime"
                  format="yyyy-MM-dd HH:mm"
                  type="datetimerange"
                  value-format="yyyy-MM-dd HH:mm"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  @change="searchLiveCodeList">
                </el-date-picker>
              </el-form-item>
              <!-- <el-form-item>
              <el-button size="small" type="primary" @click="searchLiveCodeList">查询</el-button>
              <el-button size="small" type="info" @click="reLiveCodeSearch">重置</el-button>
            </el-form-item> -->
            </el-form>
          </div>
          <div class="query-table-box" v-if="nowIndex == 1">
            <el-form inline :model="searchDraftForm" label-width="100px" label-position="left" size="small">
              <el-form-item label="客户姓名">
                <el-input
                  v-model="searchDraftForm.name"
                  @input="searchLiveCodeListDraft"
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item label="认领成员">
                <el-input
                  v-model="searchDraftForm.name"
                  @input="searchLiveCodeListDraft"
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item label="录入时间">
                <el-date-picker
                  v-model="sendTime"
                  format="yyyy-MM-dd HH:mm"
                  type="datetimerange"
                  value-format="yyyy-MM-dd HH:mm"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  @change="searchLiveCodeList">
                </el-date-picker>
              </el-form-item>
              <!-- <el-form-item>
              <el-button size="small" type="primary" @click="searchLiveCodeListDraft">查询</el-button>
              <el-button size="small" type="info" @click="reLiveCodeSearchDraft">重置</el-button>
            </el-form-item> -->
            </el-form>
          </div>
        </div>

        <div class="table-info" v-if="nowIndex == 0">
          <el-button type="text" @click="goRecycle" :loading="syncLoading">客户回收规则</el-button>
        </div>
        <div class="table-info" v-if="nowIndex == 1">
          <el-button type="text" @click="goRecycle" :loading="syncLoading">客户回收规则</el-button>
          <div class="table-info-btns">
            <!-- <el-button size="small" type="primary" @click="goRecycle" :loading="syncLoading">客户回收</el-button> -->
            <el-button size="small" type="primary" @click="isclient=true" :loading="syncLoading">录入客户</el-button>
            <el-button size="small" type="primary" @click="$router.push('/main/scrm/customer-management/extend/list')">批量导入客户</el-button>
          </div>
        </div>
        <div class="common-table-box" v-if="nowIndex == 0">
          <el-table
            :data="tableData"
            width="100%"
            id="table"
            :header-cell-style="{ 'text-align': 'center', 'background-color': '#ebeef5', color: '#333333' }"
            :height="height"
          >
            <!-- <el-table-column label="序号" type="index"></el-table-column> -->
            <el-table-column label="客户信息" prop="name" align="center"> </el-table-column>
            <el-table-column label="原归属成员" prop="chatTypeName" align="center"> </el-table-column>
            <el-table-column label="手机" prop="sendQuantity" align="center"> </el-table-column>
            <el-table-column label="进入回收时间" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.sendTime | timeSubString }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class="caozuo-column">
              <template slot-scope="scope">
                <el-button type="text" >认领</el-button>
                <el-button type="text" @click="$router.push('./custDetail')">详情</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="common-pagination" v-if="nowIndex == 0">
          <com-pagination :page="page" @sizeChange="onSizeChange" @pageChange="onPageChange"></com-pagination>
        </div>

        <div class="common-table-box" v-if="nowIndex == 1">
          <el-table
            :data="tableDraftData"
            width="100%"
            id="table"
            :header-cell-style="{ 'text-align': 'center', 'background-color': '#ebeef5', color: '#333333' }"
            :height="height">
            <el-table-column label="客户信息" prop="name" align="center"> </el-table-column>
            <el-table-column label="认领成员" prop="chatTypeName" align="center"> </el-table-column>
            <el-table-column label="录入时间" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.createTime | timeSubString }}</span>
              </template>
            </el-table-column>
            <el-table-column label="回收时间" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.sendTime | timeSubString }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class="caozuo-column">
              <template slot-scope="scope">
                <el-button type="text" >详情</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="common-pagination" v-if="nowIndex == 1">
          <com-pagination
            :page="pageDraft"
            @sizeChange="onSizeDraftChange"
            @pageChange="onPageDraftChange"
          ></com-pagination>
        </div>
      </div>
    </div>
    <enterClient :visible='isclient' @onClose="onClose"></enterClient>
  </div>
</template>
<script>
import api from '../../api/freeSea'
import ComPagination from '../../components/common/ComPagination'
import enterClient from './enterClient'
export default {
  components: { ComPagination ,enterClient},
  data() {
    return {
      syncLoading:false,
      isclient:false,
      nowIndex: 0,
      catrgrouList: [
        {
          name: '企微客户',
          id: 0,
          isActive: true
        },
        { name: '非企微成员', id: 1,isActive:false },
      ],
      MessageItem: [],
      openMessageDialog: false,
      openGroupDialog: false,
      searchForm: {
        name: ''
      },
      height: 400,
      page: {
        pageNum: 1,
        pageSize: 15,
        total: 0
      },
      sendTime: '',
      tableData: [{}],
      searchDraftForm: {
        name: ''
      },
      pageDraft: {
        pageNum: 1,
        pageSize: 15,
        total: 0
      },
      tableDraftData: [{}],
      messageDraftItemList: [],
      dialogFormVisible: false
    }
  },
  methods: {
    // 切换头部
    relationClick(index) {
      if (this.catrgrouList[index].isActive) {
        return
      }
      for (var i = 0; i < this.catrgrouList.length; i++) {
        this.catrgrouList[i].isActive = false
      }
      this.catrgrouList[index].isActive = true
      this.nowIndex = index
    },
    onClose(flag) {
      this.isclient = false
      if (typeof flag == 'boolean' && flag) {
        // this.getPosterList(this.searchData.name, this.tagId)
      }
    },
    // 跳转客户回收
    goRecycle(){
      this.$router.push('./recycle')
    },
    // 跳转客户回收
    goRecycle(){
      this.$router.push('./recycle')
    },

    // 查询1
    searchLiveCodeList() {
      this.page.pageNum = 1
      this.page.pageSize = 15
      this.page.total = 0
      // this.getPage()
    },
    // 重置1
    reLiveCodeSearch() {
      this.searchForm.name = ''
      this.page.pageNum = 1
      this.page.pageSize = 15
      this.page.total = 0
      this.sendTime = ''
      // this.getPage()
    },

    // 翻页1
    onSizeChange(val) {
      this.page.pageSize = val
      this.page.pageNum = 1
      // this.getPage()
    },
    // 翻页1
    onPageChange(val) {
      this.page.pageNum = val
      // this.getPage()
    },

    // 查询2
    searchLiveCodeListDraft() {
      this.searchDraftForm.pageNum = 1
      this.pageDraft.pageSize = 15
      this.pageDraft.total = 0
      // this.getDraftsPage()
    },
    // 重置2
    reLiveCodeSearchDraft() {
      this.searchDraftForm.name = ''
      this.pageDraft.pageNum = 1
      this.pageDraft.pageSize = 15
      this.pageDraft.total = 0
      // this.getDraftsPage()
    },
    // 翻页2
    onSizeDraftChange(val) {
      this.pageDraft.pageSize = val
      this.pageDraft.pageNum = 1
      // this.getDraftsPage()
    },
    // 翻页2
    onPageDraftChange(val) {
      this.pageDraft.pageNum = val
      // this.getDraftsPage()
    },

    time(datetime) {
      let startAt = (new Date(this.date) * 1000) / 1000
      if (startAt < Date.now()) {
        datetime = new Date()
      }
      this.sendTime = datetime
      this.sendTime += ':00'
      console.log(this.sendTime)
    },
    fullTableHeight() {
      const TOP_HEADER_HEIGHT = 60,
        PAGINATION_HEIGHT = 52,
        PADDING_BOTTOM_HEIGHT = 20,
        PADDING_TOP_HEIGHT = 20
      this.height =
        window.innerHeight -
        document.querySelector('#table').offsetTop -
        TOP_HEADER_HEIGHT -
        PAGINATION_HEIGHT -
        PADDING_BOTTOM_HEIGHT -
        PADDING_TOP_HEIGHT - 44
    },
  },
  created() {
    
  },
  mounted() {
    this.$nextTick(() => {
      this.fullTableHeight()
    })
  },
  filters: {
    timeSubString(time) {
      if (!time) {
        return
      }
      return time.substring(0, time.length - 3)
    }
  }
}
</script>

<style lang="scss" scoped>
.table-info {
  padding: 0 20px;
  box-sizing: border-box;
  color: #909399;
  font-size: 14px;
  display: flex;
  align-items: flex-end;
  margin-bottom: 20px;
  .info-msg {
    margin-right: 40px;
    span {
      color: #1e90ff;
    }
  }
  .table-info-btns {
    margin-left: auto;
  }
}
.top_nav_tabe {
  width: 100%;
  height: 44px;
  // background-color: #F5F5F5;
  display: flex;
  ul {
    display: flex;
    background-color: #ffffff;
    background-image: linear-gradient(to bottom, #ebeef5, #ffffff);
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    overflow: hidden;
    li {
      width: 120px;
      height: 44px;
      text-align: center;
      line-height: 44px;
      background-color: #ebeef5;
      font-size: 14px;
      user-select: none;
      // border-radius: 20px;
      cursor: pointer;
      &.active {
        border-radius: 0px;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        background-color: #ffffff;
      }
      &.borderLeft {
        border-bottom-left-radius: 10px;
      }
      &.borderRight {
        border-bottom-right-radius: 10px;
      }
    }
  }
}
.addlivecode {
  width: 100%;
  height: 100%;
  position: relative;
}
.container {
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  .top_nav {
    display: flex;
    padding: 20px 20px 0;
  }
}
.query-table-box {
  // box-sizing: border-box;
  display: flex;
  flex-direction: column;
  // margin-left: auto;
}
.common-table-box {
  padding: 0 20px;
  box-sizing: border-box;
}

.title-div {
  // border: 1px solid red;
  margin: 20px;
  span {
    cursor: pointer;
    background-color: #f5f5f5;
    color: #000;
    padding: 10px 20px;
    user-select: none;
    font-size: 14px;
  }
}
.checked {
  background-color: #ffffff !important;
  // color: #fff !important;
}

::v-deep .el-dialog {
  border-radius: 6px;
}
::v-deep .el-dialog__header {
  padding: 10px 20px;
  border-bottom: 1px solid #ebeef5;
  font-size: 16px;
}
::v-deep .el-dialog__title {
  font-size: 14px;
}
::v-deep .el-dialog__headerbtn {
  top: 15px;
}
::v-deep .el-dialog__body {
  padding: 20px;
}
</style>
