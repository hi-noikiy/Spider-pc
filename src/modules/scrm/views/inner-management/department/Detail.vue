<template>
  <div class="department-div">
    <GoBack :title="'返回'"></GoBack>
    <div class="department-div-top">
      <div class="department-thmub-text">
        <div class="thmub">
          <img :src="customerData.avatar" />
        </div>
        <div class="text">
          {{ customerData.name }}
        </div>
        <!-- <div class="icon">
          <i class="el-icon-user-solid icon-user"></i>
        </div> -->
      </div>
      <div class="title-bar">基础信息</div>
      <div class="department-div-container">
        <ul>
          <li>
            <span class="name">手机号：</span>
            <span class="value">{{ customerData.mobile || '--' }}</span>
          </li>
          <li>
            <span class="name">职位：</span>
            <span class="value">{{ customerData.position || '--' }}</span>
          </li>
        </ul>
      </div>
      <div class="title-bar">其他信息</div>
      <div class="department-div-container">
        <ul>
          <li>
            <span class="name">备注名：</span>
            <span class="value">15813228684</span>
          </li>
        </ul>
      </div>
      <div class="title-bar">对外信息</div>
      <div class="department-div-container">
        <ul>
          <li>
            <span class="name">企业朋友圈：</span>
            <span class="value">15813228684</span>
            <el-button type="text">修改</el-button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import GoBack from '../../../components/components/GoBack'
export default {
  components: {
    GoBack
  },
  data() {
    return {
      queryId: '',
      customerData: {}
    }
  },
  methods: {
    getMemberDetail() {
      this.$http.getMemberDetail({ id: this.queryId }).then(res => {
        this.customerData = res.data.data
      })
    }
  },
  created() {
    if (this.$route.query.id) {
      this.queryId = this.$route.query.id
      this.getMemberDetail()
    }
  }
}
</script>

<style lang="scss" scoped>
.department-div {
  width: 100%;
  height: 100%;

  .department-div-top {
    width: 100%;
    height: 100%;
    background-color: #ffffff;
    .department-thmub-text {
      padding: 20px 0;
      margin-left: 20px;
      display: flex;
      .thmub {
        img {
          width: 60px;
          height: 60px;
          border-radius: 5px;
        }
      }
      .text {
        font-size: 18px;
        margin: 5px 0 0 15px;
        color: #909399;
        font-weight: 400;
      }
      .icon {
        font-size: 18px;
        margin: 3px 0 0 5px;
        color: #294a7b;
      }
    }
  }
  .title-bar {
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
    color: #303133;
    position: relative;
    display: flex;
    align-items: center;
    &::before {
      content: '';
      display: block;
      width: 6px;
      height: 20px;
      background-color: #294a7b;
      position: absolute;
      top: 0;
      bottom: 0;
      margin: auto 0;
      left: 0px;
    }
  }
  .department-div-container {
    width: 70%;
    padding: 20px 20px 0;
    box-sizing: border-box;
    ul {
      max-width: 1000px;
      display: flex;
      flex-wrap: wrap;
      li {
        width: 30%;
        min-width: 300px;
        font-size: 14px;
        color: #909399;
        margin: 0 20px 30px 0;
        .el-button {
          margin-left: 10px;
        }
      }
    }
  }
}
</style>
