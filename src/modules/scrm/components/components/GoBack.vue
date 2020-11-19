<template>
  <!-- 返回上一级 -->
  <!-- 
    使用方式
    1. 引入组件 
    示例：
    import GoBack from '../../../components/components/GoBack.vue'
    2. 使用组件
    示例：
    <GoBack :title="'所在群聊'"></GoBack>
    参数：
    名称        类型                   示例                                       说明
    title    string                 这是标题                                    可选，返回标题，默认为‘详情’
 -->
  <div>
    <div class="header_nav">
      <el-button type="text" icon="el-icon-arrow-left" @click="$router.go(-1)">{{ title }}</el-button>
    </div>
  </div>
</template>
<script>
import { string } from 'clipboard'
export default {
  props: {
    // 返回标题
    title: {
      type: String,
      default: '详情'
    }
  }
}
</script>
<style lang="scss" scoped>
.header_nav {
  padding-bottom: 20px; // 保持上下距离一致，可取消
}
</style>