<template>
  <div class="external-div">
    <TableList :tableData="tableData" :tableColumn="tableColumn"></TableList>
  </div>
</template>

<script>
import TableList from '../../../components/components/TableList'
export default {
  components: { TableList },

  data() {
    return {
      tableData: [],
      tableColumn: [
        {
          title: '类型',
          formatter: row => {
            return (
              <div>{row.type == '0' ? '文本' : row.type == '1' ? '网页' : row.type == '2' ? '小程序' : '其他'}</div>
            )
          },
          align: 'center'
        },
        {
          prop: 'name',
          title: '类型名称',
          align: 'center'
        },
        {
          title: '关联人员',
          align: 'center',
          formatter: row => {
            return (
              <div>
                <span>
                  <i class="el-icon-user-solid icon-user"></i>
                </span>
              </div>
            )
          }
        },
        {
          title: '操作',
          align: 'center',
          formatter: row => {
            return (
              <div>
                <el-button type="text">修改</el-button>
                <el-button type="text">删除</el-button>
              </div>
            )
          }
        }
      ]
    }
  },
  methods: {
    getUserExternalPage() {
      let userName = []
      this.tableData = []
      this.$http.getUserExternalPage().then(res => {
        res.data.data.forEach(item => {
          if (item.userName != '') {
            userName = item.userName.split(';')
          }
          this.tableData.push({
            name: item.name,
            userName: userName,
            type: item.type,
            created: item.created
          })
        })
      })
      console.log(this.tableData)
    }
  },

  created() {
    this.getUserExternalPage()
  }
}
</script>

<style lang="scss" scoped>
.external-div {
  width: 100%;
  height: 100%;
  background-color: #fff;
}
</style>
