<template>
  <div>
    <div class="header_nav" style="margin-bottom: 20px">
      <el-button type="text" icon="el-icon-arrow-left" @click="$router.go(-1)">明细</el-button>
    </div>
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
          <div class="query-table-box">
            <el-form inline :model="searchForm" label-width="100px" label-position="left" size="small">
              <el-form-item :label="checkname.name">
                <el-input v-model="searchForm.name" clearable :placeholder="checkname.name3"></el-input>
              </el-form-item>
              <el-form-item label="分配状态">
                <el-select v-model="searchForm.status" clearable placeholder="请选择"  style='width:180px'>
                  <el-option
                    v-for="item in statusoptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <!-- <el-input v-model="" clearable></el-input> -->
              </el-form-item>
              <el-form-item label="分配时间">
                <el-date-picker
                @change="getDatePicker"
                  v-model="begend"
                  format="yyyy-MM-dd"
                  type="datetimerange"
                  value-format="yyyy-MM-dd"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>
              <!-- <el-form-item> -->
              <el-button size="small" type="primary" @click="searchLiveCodeList">查询</el-button>
              <el-button size="small" type="info" @click="reLiveCodeSearch">重置</el-button>
            <!-- </el-form-item> -->
            </el-form>
          </div>
        </div>
        <div style='padding:0px 20px 20px 20px'><el-button type='primary' @click='distribution'>批量分配</el-button></div>
        <div class="common-table-box">
          <el-table
            :data="tableData"
            width="100%"
            id="table"
            :header-cell-style="{ 'text-align': 'center', 'background-color': '#ebeef5', 'color': '#333333' }"
            :height="height"
            @selection-change="handleSelectionChange"
          >
          <!--  -->
            <el-table-column type="selection" width="55" :selectable="checkSelectable"></el-table-column>
            <el-table-column :label="checkname.name2" prop="name" align="center"> </el-table-column>
            <el-table-column label="分配状态" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.status=='await_allocation'">未分配</span>
                <span v-if="scope.row.status=='allocating'">分配中</span>
                <span v-if="scope.row.status=='success'">分配成功</span>
                <span v-if="scope.row.status=='failure'">分配失败</span>
              </template>
            </el-table-column>
            <el-table-column label="分配成员" prop="aimsUserName" align="center"> </el-table-column>
            <el-table-column label="分配时间" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.createTime}}</span>
              </template>
            </el-table-column>
            <!-- <el-table-column label="操作" align="center" class="caozuo-column">
              <template slot-scope="scope">
                <el-button v-if="scope.row.status==='await_allocation'" type='text' @click="distribution(scope.row)">分配</el-button>
              </template>
            </el-table-column> -->
          </el-table>
        </div>
        <div class="common-pagination">
          <com-pagination :page="page" @sizeChange="onSizeChange" @pageChange="onPageChange"></com-pagination>
        </div>
      </div>
    </div>
    <TransferMember :visible="showTrans" :customerRequests="customerRequests" :chatRequest="chatRequest" :index="nowIndex" @onClose="onClose"></TransferMember>
  </div>
</template>
<script>
import ComPagination from '../../components/common/ComPagination'
import TransferMember from './transferMember'

export default {
  components: { ComPagination,TransferMember },
  data() {
    return {
      wxUserId:'',
      showTrans:false,
      page: {
        pageNum: 1,
        pageSize: 15,
        total: 0
      },
      isclient:false,
      nowIndex: 0,
      catrgrouList: [
        {name: '分配客户',id: 0,isActive: true},
        {name: '分配客户群', id: 1,isActive:false},
      ],
      statusoptions:[
        {label:'未分配',value:'await_allocation'},
        {label:'分配中',value:'allocating'},
        {label:'分配成功',value:'success'},
        {label:'分配失败',value:'failure'}
      ],
      status:'',
      searchForm: {
        name: '',
        status:'',
        startTime:'',
        endTime:'',
      },
      height:'',
      checkname:{
        name:'分配客户',
        name1:'客户状态',
        name2:' 客户信息',
        name3:'请输入要搜索的客户'
      },
      tableData:[],
      begend:'',
      customerRequests:[],
      chatRequest:{}
    }
  },
  created() {
    this.wxUserId=this.$route.query.wxUserId
    this.getClient(this.$route.query.wxUserId)
  },
  methods: {
    // 获取列表
    getClient(wxUserId){
      var params={
        name:this.searchForm.name,
        status:this.searchForm.status,
        startTime:this.searchForm.startTime,
        endTime:this.searchForm.endTime,
        userId:wxUserId,
        type:this.nowIndex==0?'customer':'chat'
      }
      this.$http.waitDistribution(params).then(res=>{
        this.tableData=res.data.data.list
        this.page.total=res.data.data.total
      })
    },
    // 获取选中的行
    handleSelectionChange(val){
      this.customerRequests=[]
      this.chatRequest={}
      this.chatRequest.chatIdList=[]
      val.forEach(row=>{
        if(this.nowIndex==0){
          var array={}
          array.externalUserid=row.resourceId
          array.handoverUserid=row.originalUserId
          this.customerRequests.push(array)
          console.log(this.customerRequests)
        }else if(this.nowIndex==1){
          this.chatRequest.chatIdList.push(row.resourceId)
          this.chatRequest.handoverUserid=row.originalUserId
          console.log(this.chatRequest)
        }
      })
      
    },
    // 设置当前行是否可选中进行分配
    checkSelectable(row,index){
      return row.status == 'await_allocation'
    },
    // 分配
    distribution(row){
      if(this.nowIndex==0&&this.customerRequests.length==0){
        this.$message.warning('请选择要分配的客户')
        return
      }else if(this.nowIndex==1&&!this.chatRequest.handoverUserid){
        this.$message.warning('请选择要分配的客户群')
        return
      }
      this.showTrans=true
    },
    onClose(flag){
      this.showTrans=false
      this.customerRequests=[]
      this.chatRequest={}
      this.getClient(this.wxUserId)
    },
    // 获取起止时间
    getDatePicker(e){
      this.searchForm.startTime=e[0]
      this.searchForm.endTime=e[1]
    },
    // 查询
    searchLiveCodeList(){
      if(this.nowIndex==0){
        this.searchForm.type='customer'
      }else{
        this.searchForm.type='chat'
      }
      this.getClient(this.wxUserId)
    },
    // 重置
    reLiveCodeSearch(){
      this.searchForm.name=''
      this.searchForm.status=''
      this.searchForm.startTime=''
      this.searchForm.endTime=''
      this.begend=''
      this.getClient(this.wxUserId)
    },
    // 切换顶部
    relationClick(index) {
      if (this.catrgrouList[index].isActive) {
        return
      }
      for (var i = 0; i < this.catrgrouList.length; i++) {
        this.catrgrouList[i].isActive = false
      }
      this.catrgrouList[index].isActive = true
      this.nowIndex = index
      if(index==0){
        this.checkname={
          name:'分配客户',
          name1:'客户状态',
          name2:' 客户信息',
          name3:'请输入要搜索的客户'
        }
      }else{
        this.checkname={
          name:'客户群',
          name1:'分配状态',
          name2:' 客户群信息',
          name3:'请输入要搜索的客户群'
        }
      }
      this.reLiveCodeSearch()
      this.getClient(this.wxUserId)
    },

    onSizeChange(val) {
      this.page.pageSize = val
      this.page.pageNum = 1
      this.getClient(this.wxUserId)
    },
    onPageChange(val) {
      this.page.pageNum = val
      this.getClient(this.wxUserId)
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
        PADDING_TOP_HEIGHT - 100
    },
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
